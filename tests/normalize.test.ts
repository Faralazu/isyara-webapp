import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { HandLandmark } from "@/types/camera";
import { logger } from "@/lib/logger";
import {
  COORDS_PER_LANDMARK,
  FEATURES_PER_HAND,
  LANDMARKS_PER_HAND,
  LEFT_HAND_RANGE,
  MAX_HANDS,
  RIGHT_HAND_RANGE,
  TOTAL_FEATURES,
  createZeroFeatureVector,
  normalizeLandmarks,
} from "@/lib/tensorflow/normalize";

/**
 * Build a hand whose landmarks spread out from a configurable wrist.
 * The last landmark is placed at a known distance so scale is predictable.
 */
function makeHand(options: {
  wrist?: { x: number; y: number; z: number };
  spread?: number;
} = {}): HandLandmark[] {
  const { wrist = { x: 0.5, y: 0.5, z: 0 }, spread = 0.1 } = options;

  return Array.from({ length: LANDMARKS_PER_HAND }, (_, i) => ({
    x: wrist.x + ((i % 5) - 2) * spread,
    y: wrist.y + (Math.floor(i / 5) - 2) * spread,
    z: wrist.z - i * 0.01,
  }));
}

/** Hand where landmark[20] sits exactly `distance` away from the wrist. */
function makeHandWithKnownReach(distance: number): HandLandmark[] {
  const hand = Array.from({ length: LANDMARKS_PER_HAND }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
  }));

  hand[20] = { x: 0.5 + distance, y: 0.5, z: 0 };

  return hand;
}

function sliceHand(vector: number[], slot: "left" | "right"): number[] {
  const range = slot === "left" ? LEFT_HAND_RANGE : RIGHT_HAND_RANGE;
  return vector.slice(range.start, range.end);
}

/**
 * Compare float vectors element-wise.
 * Translation invariance cannot use exact equality: subtracting different
 * absolute wrist coordinates leaves tiny IEEE-754 rounding differences.
 */
function expectCloseArrays(actual: number[], expected: number[], precision = 9): void {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], precision);
  });
}

describe("Feature layout constants (training pipeline contract)", () => {
  it("should define the 126-feature dual-hand layout", () => {
    expect(LANDMARKS_PER_HAND).toBe(21);
    expect(COORDS_PER_LANDMARK).toBe(3);
    expect(FEATURES_PER_HAND).toBe(63);
    expect(TOTAL_FEATURES).toBe(126);
    expect(MAX_HANDS).toBe(2);
  });

  it("should place the left hand at [0, 63) and the right hand at [63, 126)", () => {
    expect(LEFT_HAND_RANGE).toEqual({ start: 0, end: 63 });
    expect(RIGHT_HAND_RANGE).toEqual({ start: 63, end: 126 });
    // The slices must tile the full vector with no gap or overlap.
    expect(LEFT_HAND_RANGE.end).toBe(RIGHT_HAND_RANGE.start);
    expect(RIGHT_HAND_RANGE.end).toBe(TOTAL_FEATURES);
  });

  it("should create a zero vector of exactly 126 finite values", () => {
    const zeros = createZeroFeatureVector();

    expect(zeros).toHaveLength(TOTAL_FEATURES);
    expect(zeros.every((value) => value === 0)).toBe(true);
    expect(zeros.every((value) => Number.isFinite(value))).toBe(true);
  });
});

describe("normalizeLandmarks (SRD §5.1 & §9.3)", () => {
  beforeEach(() => {
    vi.spyOn(logger, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an array of length 126", () => {
    const result = normalizeLandmarks([makeHand()], ["Right"]);

    expect(result).not.toBeNull();
    expect(result).toHaveLength(TOTAL_FEATURES);
    expect(result?.every((value) => Number.isFinite(value))).toBe(true);
  });

  it("should map Left hand to indices 0..62 and Right hand to indices 63..125", () => {
    const leftHand = makeHandWithKnownReach(0.2);
    const rightHand = makeHandWithKnownReach(0.4);

    const result = normalizeLandmarks([leftHand, rightHand], ["Left", "Right"]);
    expect(result).not.toBeNull();
    if (!result) return;

    const left = sliceHand(result, "left");
    const right = sliceHand(result, "right");

    // Both hands have landmark[20] at exactly +x from the wrist, so after
    // per-hand scaling it normalizes to 1.0 in the x component.
    expect(left[20 * COORDS_PER_LANDMARK]).toBeCloseTo(1);
    expect(right[20 * COORDS_PER_LANDMARK]).toBeCloseTo(1);
    expect(left[20 * COORDS_PER_LANDMARK + 1]).toBeCloseTo(0);
    expect(right[20 * COORDS_PER_LANDMARK + 1]).toBeCloseTo(0);
  });

  it("should zero-pad Left hand slots when only Right hand is detected", () => {
    const result = normalizeLandmarks([makeHand()], ["Right"]);
    expect(result).not.toBeNull();
    if (!result) return;

    const left = sliceHand(result, "left");
    const right = sliceHand(result, "right");

    expect(left).toHaveLength(FEATURES_PER_HAND);
    expect(left.every((value) => value === 0)).toBe(true);
    expect(right.some((value) => value !== 0)).toBe(true);
  });

  it("should zero-pad Right hand slots when only Left hand is detected", () => {
    const result = normalizeLandmarks([makeHand()], ["Left"]);
    expect(result).not.toBeNull();
    if (!result) return;

    const left = sliceHand(result, "left");
    const right = sliceHand(result, "right");

    expect(right).toHaveLength(FEATURES_PER_HAND);
    expect(right.every((value) => value === 0)).toBe(true);
    expect(left.some((value) => value !== 0)).toBe(true);
  });

  it("should return 126 zeros when no hands are detected", () => {
    expect(normalizeLandmarks([], ["Left"])).toEqual(createZeroFeatureVector());
    expect(normalizeLandmarks(null)).toEqual(createZeroFeatureVector());
    expect(normalizeLandmarks(undefined, null)).toEqual(createZeroFeatureVector());
  });

  it("should set detected wrist landmark to [0, 0, 0] relative coordinates", () => {
    const hand = makeHand({ wrist: { x: 0.42, y: 0.61, z: -0.03 } });
    const result = normalizeLandmarks([hand], ["Right"]);
    expect(result).not.toBeNull();
    if (!result) return;

    const right = sliceHand(result, "right");
    expect(right[0]).toBe(0);
    expect(right[1]).toBe(0);
    expect(right[2]).toBe(0);
  });

  it("should normalize all coordinates to range [-1, 1]", () => {
    const result = normalizeLandmarks(
      [makeHand({ wrist: { x: 0.05, y: 0.95, z: 0.2 } }), makeHand({ wrist: { x: 0.9, y: 0.1, z: -0.4 } })],
      ["Left", "Right"]
    );
    expect(result).not.toBeNull();
    if (!result) return;

    for (const value of result) {
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("should handle hand scale and distance invariance independently per hand", () => {
    // Same hand shape, rendered at two different distances from the camera.
    const near = normalizeLandmarks([makeHandWithKnownReach(0.4)], ["Left"]);
    const far = normalizeLandmarks([makeHandWithKnownReach(0.1)], ["Left"]);

    expect(near).not.toBeNull();
    expect(far).not.toBeNull();
    if (!near || !far) return;

    expectCloseArrays(sliceHand(near, "left"), sliceHand(far, "left"));

    // Both hands normalized separately: a big left hand must not rescale the right one.
    const mixed = normalizeLandmarks(
      [makeHandWithKnownReach(0.4), makeHandWithKnownReach(0.1)],
      ["Left", "Right"]
    );
    expect(mixed).not.toBeNull();
    if (!mixed) return;

    expectCloseArrays(sliceHand(mixed, "left"), sliceHand(near, "left"));
    expectCloseArrays(sliceHand(mixed, "right"), sliceHand(far, "left"));
  });

  it("should be translation invariant (frame position must not matter)", () => {
    const centered = normalizeLandmarks([makeHand({ wrist: { x: 0.5, y: 0.5, z: 0 } })], ["Left"]);
    const corner = normalizeLandmarks([makeHand({ wrist: { x: 0.05, y: 0.9, z: 0.3 } })], ["Left"]);

    expect(centered).not.toBeNull();
    expect(corner).not.toBeNull();
    if (!centered || !corner) return;

    expectCloseArrays(sliceHand(centered, "left"), sliceHand(corner, "left"));
  });

  it("should reject hands with fewer than 21 landmarks", () => {
    const short = makeHand().slice(0, 20);
    const result = normalizeLandmarks([short], ["Left"]);

    expect(result).toBeNull();
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "WARN",
        module: "MOD-ML",
        event: "NORMALIZE_REJECTED",
        data: expect.objectContaining({ reason: "invalid_landmark_count", handIndex: 0 }),
      })
    );
  });

  it("should reject hands with more than 21 landmarks", () => {
    const long = [...makeHand(), { x: 0.5, y: 0.5, z: 0 }];
    expect(normalizeLandmarks([long], ["Left"])).toBeNull();
  });

  it("should reject more than 2 hands (SRD §5.6)", () => {
    const result = normalizeLandmarks(
      [makeHand(), makeHand(), makeHand()],
      ["Left", "Right", "Left"]
    );

    expect(result).toBeNull();
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ reason: "too_many_hands", handCount: 3 }),
      })
    );
  });

  it("should reject non-finite landmark coordinates", () => {
    const broken = makeHand();
    broken[7] = { x: Number.NaN, y: 0.5, z: 0 };
    expect(normalizeLandmarks([broken], ["Left"])).toBeNull();

    const infinite = makeHand();
    infinite[3] = { x: 0.5, y: Number.POSITIVE_INFINITY, z: 0 };
    expect(normalizeLandmarks([infinite], ["Right"])).toBeNull();
  });

  it("should fall back to SRD §5.1 slot order when handedness is missing", () => {
    const first = makeHandWithKnownReach(0.2);
    const second = makeHandWithKnownReach(0.4);

    const result = normalizeLandmarks([first, second]);
    expect(result).not.toBeNull();
    if (!result) return;

    // No label: first hand → right slot, second hand → left slot.
    expect(sliceHand(result, "left")).toEqual(sliceHand(normalizeLandmarks([second], ["Left"]) ?? [], "left"));
    expect(sliceHand(result, "right")).toEqual(sliceHand(normalizeLandmarks([first], ["Right"]) ?? [], "right"));
  });

  it("should fall back to the deterministic slot when a label is unreadable", () => {
    const result = normalizeLandmarks([makeHand()], ["  "]);
    expect(result).not.toBeNull();
    if (!result) return;

    expect(sliceHand(result, "right").some((value) => value !== 0)).toBe(true);
    expect(sliceHand(result, "left").every((value) => value === 0)).toBe(true);
  });

  it("should warn but still return 126 features when both hands share one label", () => {
    const result = normalizeLandmarks(
      [makeHandWithKnownReach(0.2), makeHandWithKnownReach(0.4)],
      ["Right", "Right"]
    );

    expect(result).toHaveLength(TOTAL_FEATURES);
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({ event: "NORMALIZE_SLOT_COLLISION" })
    );
  });

  it("should keep the last hand when a slot collision occurs (SRD §5.1 step 3d)", () => {
    const result = normalizeLandmarks(
      [makeHandWithKnownReach(0.2), makeHandWithKnownReach(0.4)],
      ["Right", "Right"]
    );
    expect(result).not.toBeNull();
    if (!result) return;

    const onlySecond = normalizeLandmarks([makeHandWithKnownReach(0.4)], ["Right"]);
    expect(onlySecond).not.toBeNull();
    if (!onlySecond) return;

    expectCloseArrays(sliceHand(result, "right"), sliceHand(onlySecond, "right"));
    expect(sliceHand(result, "left").every((value) => value === 0)).toBe(true);
  });

  it("should not warn about collisions when each hand gets its own slot", () => {
    normalizeLandmarks([makeHand(), makeHand()], ["Left", "Right"]);

    expect(logger.log).not.toHaveBeenCalled();
  });

  it("should reject a hand that is not an array", () => {
    const malformed = [null as unknown as HandLandmark[]];
    const result = normalizeLandmarks(malformed, ["Left"]);

    expect(result).toBeNull();
    expect(logger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ reason: "invalid_landmark_count", landmarkCount: null }),
      })
    );
  });

  it("should keep a degenerate (all-collapsed) hand at the origin instead of dividing by zero", () => {
    const collapsed = Array.from({ length: LANDMARKS_PER_HAND }, () => ({
      x: 0.3,
      y: 0.7,
      z: 0.1,
    }));

    const result = normalizeLandmarks([collapsed], ["Left"]);
    expect(result).not.toBeNull();
    if (!result) return;

    expect(result).toHaveLength(TOTAL_FEATURES);
    expect(result.every((value) => Number.isFinite(value))).toBe(true);
    expect(result.every((value) => value === 0)).toBe(true);
  });

  it("should not mutate the input landmarks", () => {
    const hand = makeHand({ wrist: { x: 0.42, y: 0.61, z: -0.03 } });
    const snapshot = JSON.stringify(hand);

    normalizeLandmarks([hand], ["Left"]);

    expect(JSON.stringify(hand)).toBe(snapshot);
  });
});
