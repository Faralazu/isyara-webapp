/**
 * MOD-ML: Dual-hand landmark normalization into the 126-feature model input.
 *
 * Grounded in:
 * - SRD Section 5.1 (Algorithm: Dual-Hand Landmark Normalization)
 * - SRD Section 5.6 (Input validation: hands length ≤ 2, exactly 21 landmarks)
 * - SRD Section 4.1 Contract 8 (`normalizeLandmarks` signature & invariants)
 * - docs/IMPLEMENTATION_PLAN.md §ML Pipeline Step 1–2 (Left: 0..62, Right: 63..125)
 *
 * Feature layout (must stay in sync with the Python training pipeline in
 * `training/collect_landmarks.py`):
 *
 *   index   0 ..  62  → left hand  (21 landmarks × 3 coords: x, y, z)
 *   index  63 .. 125  → right hand (21 landmarks × 3 coords: x, y, z)
 *
 * Absent hands are zero-padded. Each detected hand is normalized independently:
 * coordinates become wrist-relative and are scaled by that hand's own maximum
 * Euclidean distance, which makes the vector invariant to hand size, distance
 * from the camera, and position inside the frame.
 */

import type { HandLandmark } from "@/types/camera";
import { logger } from "@/lib/logger";

/** MediaPipe hand model always returns 21 landmarks per hand. */
export const LANDMARKS_PER_HAND = 21;

/** Each landmark carries x, y and z. */
export const COORDS_PER_LANDMARK = 3;

/** 21 × 3 = 63 floats per hand. */
export const FEATURES_PER_HAND = LANDMARKS_PER_HAND * COORDS_PER_LANDMARK;

/** 63 × 2 = 126 floats total, the TF.js model input width. */
export const TOTAL_FEATURES = FEATURES_PER_HAND * 2;

/** Feature slice for the left hand: indices [0, 63). */
export const LEFT_HAND_RANGE = { start: 0, end: FEATURES_PER_HAND } as const;

/** Feature slice for the right hand: indices [63, 126). */
export const RIGHT_HAND_RANGE = {
  start: FEATURES_PER_HAND,
  end: TOTAL_FEATURES,
} as const;

/** Maximum number of hands the model was trained on (dual-hand BISINDO). */
export const MAX_HANDS = 2;

/** Slot a detected hand is written to. */
export type HandSlot = "left" | "right";

/** All-zero 126-feature vector, used when no hands are detected. */
export function createZeroFeatureVector(): number[] {
  return new Array<number>(TOTAL_FEATURES).fill(0);
}

/**
 * Decide which deterministic slot a hand belongs to.
 *
 * SRD §5.1 step 3: use the MediaPipe `handedness` label, falling back to
 * "first hand → right, second hand → left" when the label is missing.
 *
 * Note: this deliberately uses the raw model label (no mirror correction).
 * The training pipeline consumes the same raw labels, and left/right variance
 * is handled by hand-swap augmentation during training (Day 10), not here.
 */
function resolveHandSlot(
  rawLabel: string | undefined,
  handIndex: number
): HandSlot {
  const label = rawLabel?.trim().toLowerCase();

  if (label === "left") return "left";
  if (label === "right") return "right";

  return handIndex === 0 ? "right" : "left";
}

/**
 * Normalize a single hand into 63 wrist-relative, scale-invariant floats.
 *
 * Preconditions are guaranteed by the caller: exactly 21 landmarks with finite
 * coordinates. Steps mirror SRD §5.1 steps 3a–3c.
 */
function normalizeSingleHand(hand: ReadonlyArray<HandLandmark>): number[] {
  const wrist = hand[0];
  const centered = new Array<number>(FEATURES_PER_HAND);

  let maxDistance = 0;

  for (let i = 0; i < LANDMARKS_PER_HAND; i += 1) {
    const landmark = hand[i];
    const dx = landmark.x - wrist.x;
    const dy = landmark.y - wrist.y;
    const dz = landmark.z - wrist.z;

    const offset = i * COORDS_PER_LANDMARK;
    centered[offset] = dx;
    centered[offset + 1] = dy;
    centered[offset + 2] = dz;

    // The wrist itself is always at distance 0, so it never drives the scale.
    if (i > 0) {
      const distance = Math.hypot(dx, dy, dz);
      if (distance > maxDistance) maxDistance = distance;
    }
  }

  // A degenerate hand (every landmark on the wrist) would divide by zero.
  const scale = maxDistance === 0 ? 1 : maxDistance;

  for (let i = 0; i < FEATURES_PER_HAND; i += 1) {
    centered[i] /= scale;
  }

  return centered;
}

/** Reject malformed input with a single structured warning (SRD §5.6). */
function rejectInput(event: string, data: Record<string, unknown>): null {
  logger.log({
    level: "WARN",
    module: "MOD-ML",
    event,
    data,
  });

  return null;
}

/**
 * Convert up to two detected hands into the flat 126-float model input.
 *
 * @param hands - Detected hands, each with exactly 21 landmarks.
 * @param handedness - MediaPipe handedness labels ("Left" | "Right").
 * @returns 126 normalized floats, or `null` when the input is malformed.
 *
 * Invariants (SRD §5.1 postconditions):
 * - Output length is always exactly 126.
 * - Every value is in range [-1.0, 1.0].
 * - Unused hand slots stay 0.0 (zero-padded).
 * - Detected wrist landmarks are always at the origin (0, 0, 0).
 *
 * Zero hands yields an all-zero vector rather than `null`: the model still
 * receives a valid tensor shape, and "no hands" is a normal runtime state.
 */
export function normalizeLandmarks(
  hands: ReadonlyArray<ReadonlyArray<HandLandmark>> | null | undefined,
  handedness?: ReadonlyArray<string | undefined> | null
): number[] | null {
  if (!hands || hands.length === 0) {
    return createZeroFeatureVector();
  }

  if (hands.length > MAX_HANDS) {
    return rejectInput("NORMALIZE_REJECTED", {
      reason: "too_many_hands",
      handCount: hands.length,
      maxHands: MAX_HANDS,
    });
  }

  // Validate everything before transforming, so a bad input never produces a
  // partially filled vector.
  for (let handIndex = 0; handIndex < hands.length; handIndex += 1) {
    const hand = hands[handIndex];

    if (!Array.isArray(hand) || hand.length !== LANDMARKS_PER_HAND) {
      return rejectInput("NORMALIZE_REJECTED", {
        reason: "invalid_landmark_count",
        handIndex,
        landmarkCount: Array.isArray(hand) ? hand.length : null,
        expected: LANDMARKS_PER_HAND,
      });
    }

    for (let i = 0; i < LANDMARKS_PER_HAND; i += 1) {
      const landmark = hand[i];

      if (
        !landmark ||
        !Number.isFinite(landmark.x) ||
        !Number.isFinite(landmark.y) ||
        !Number.isFinite(landmark.z)
      ) {
        return rejectInput("NORMALIZE_REJECTED", {
          reason: "non_finite_landmark",
          handIndex,
          landmarkIndex: i,
        });
      }
    }
  }

  const leftHand = new Array<number>(FEATURES_PER_HAND).fill(0);
  const rightHand = new Array<number>(FEATURES_PER_HAND).fill(0);
  const filled: Record<HandSlot, boolean> = { left: false, right: false };

  for (let handIndex = 0; handIndex < hands.length; handIndex += 1) {
    const slot = resolveHandSlot(handedness?.[handIndex], handIndex);
    const normalized = normalizeSingleHand(hands[handIndex]);

    if (filled[slot]) {
      // MediaPipe occasionally labels both hands identically. The slot is
      // overwritten per SRD §5.1 step 3d; surface the collision because the
      // training pipeline must reproduce the same behaviour.
      logger.log({
        level: "WARN",
        module: "MOD-ML",
        event: "NORMALIZE_SLOT_COLLISION",
        data: { slot, handIndex, rawLabel: handedness?.[handIndex] ?? null },
      });
    }

    const target = slot === "left" ? leftHand : rightHand;
    for (let i = 0; i < FEATURES_PER_HAND; i += 1) {
      target[i] = normalized[i];
    }
    filled[slot] = true;
  }

  return leftHand.concat(rightHand);
}
