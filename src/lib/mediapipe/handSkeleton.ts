/**
 * Hand skeleton topology, coordinate mapping, and canvas drawing helpers for
 * the MediaPipe 21-landmark hand model.
 *
 * Grounded in:
 * - SRD Section 2.3 (component dependency: `WebcamView` → `CanvasOverlay`)
 * - PRD F-02 (2 × 21 landmarks + skeleton with a visual left/right distinction)
 * - SRD Section 6.3 (slow devices may disable the overlay entirely)
 *
 * These helpers are deliberately DOM-light: geometry works on plain numbers and
 * drawing only touches a small structural 2D-context contract, so the renderer
 * can be unit-tested without a real canvas.
 */

import type { HandLandmark } from "@/types/camera";

/** MediaPipe hand model always returns exactly 21 landmarks per hand. */
export const HAND_LANDMARK_COUNT = 21;

/**
 * Bone connections between the 21 MediaPipe hand landmarks.
 * Index 0 is the wrist; fingers follow the thumb → index → middle → ring → pinky
 * order used by the MediaPipe hand topology.
 */
export const HAND_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  // Thumb
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  // Index finger
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  // Middle finger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  // Ring finger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  // Pinky
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  // Palm base (wrist → pinky MCP) closes the palm outline
  [0, 17],
];

/** Dark outline drawn under every bone so the skeleton stays readable on bright video. */
export const SKELETON_OUTLINE_COLOR = "rgba(2, 6, 23, 0.6)";

/** Chip background behind the per-hand "Kiri" / "Kanan" label. */
export const SKELETON_LABEL_BACKGROUND = "rgba(2, 6, 23, 0.72)";

const TAU = Math.PI * 2;

export interface Point {
  x: number;
  y: number;
}

/**
 * Result of mapping a `object-cover` video frame onto the overlay canvas.
 * The video keeps its aspect ratio, is centred, and may overflow the canvas.
 */
export interface CoverTransform {
  /** Uniform scale applied to the raw video pixels. */
  scale: number;
  /** Horizontal offset (CSS px) of the video's top-left corner inside the canvas. */
  offsetX: number;
  /** Vertical offset (CSS px) of the video's top-left corner inside the canvas. */
  offsetY: number;
}

export type HandSide = "left" | "right" | "unknown";

export interface HandStyle {
  side: HandSide;
  /** Bone stroke colour (also used by the UI legend). */
  bone: string;
  /** Joint core fill colour. */
  joint: string;
  /** Translucent joint halo colour. */
  halo: string;
  /** Human-readable Indonesian label ("Kiri" / "Kanan"). */
  label: string;
}

const HAND_STYLES: Record<HandSide, HandStyle> = {
  left: {
    side: "left",
    bone: "#38bdf8", // sky-400
    joint: "#f8fafc",
    halo: "rgba(56, 189, 248, 0.28)",
    label: "Kiri",
  },
  right: {
    side: "right",
    bone: "#fbbf24", // amber-400
    joint: "#f8fafc",
    halo: "rgba(251, 191, 36, 0.28)",
    label: "Kanan",
  },
  unknown: {
    side: "unknown",
    bone: "#a78bfa", // violet-400
    joint: "#f8fafc",
    halo: "rgba(167, 139, 250, 0.28)",
    label: "Tangan",
  },
};

/** Palette lookup for a resolved hand side. */
export function getHandStyle(side: HandSide): HandStyle {
  return HAND_STYLES[side];
}

/**
 * Resolve the visual side of every detected hand.
 *
 * MediaPipe's `handedness` label is used when present. Otherwise the SRD §5.1
 * fallback applies (first hand → right, second → left). When both hands report
 * the same label (or the label is unreadable) the second hand is flipped so the
 * two hands never share a colour.
 */
export function resolveHandSides(
  handedness: ReadonlyArray<string | undefined> | null | undefined,
  handCount: number
): HandSide[] {
  const sides: HandSide[] = [];

  for (let index = 0; index < handCount; index += 1) {
    const raw = handedness?.[index]?.trim().toLowerCase();
    let side: HandSide =
      raw === "left" ? "left" : raw === "right" ? "right" : index === 0 ? "right" : "left";

    if (index === 1 && sides[0] === side) {
      side = side === "left" ? "right" : "left";
    }

    sides.push(side);
  }

  return sides;
}

/**
 * Compute the `object-cover` mapping between the raw video frame and the canvas.
 * Returns an identity transform for degenerate (zero-sized) inputs.
 */
export function computeCoverTransform(
  videoWidth: number,
  videoHeight: number,
  canvasWidth: number,
  canvasHeight: number
): CoverTransform {
  if (videoWidth <= 0 || videoHeight <= 0 || canvasWidth <= 0 || canvasHeight <= 0) {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }

  const scale = Math.max(canvasWidth / videoWidth, canvasHeight / videoHeight);

  return {
    scale,
    offsetX: (canvasWidth - videoWidth * scale) / 2,
    offsetY: (canvasHeight - videoHeight * scale) / 2,
  };
}

/**
 * Project one normalized landmark onto canvas CSS pixels.
 * When the video is displayed mirrored (selfie view) the normalized x is flipped.
 */
export function projectLandmark(
  landmark: Pick<HandLandmark, "x" | "y">,
  transform: CoverTransform,
  videoWidth: number,
  videoHeight: number,
  mirrored: boolean
): Point {
  const normalizedX = mirrored ? 1 - landmark.x : landmark.x;

  return {
    x: transform.offsetX + normalizedX * videoWidth * transform.scale,
    y: transform.offsetY + landmark.y * videoHeight * transform.scale,
  };
}

export interface HandGeometry {
  side: HandSide;
  style: HandStyle;
  /** Projected landmark positions (21 points). */
  points: Point[];
  /** Projected bone segments derived from `HAND_CONNECTIONS`. */
  bones: Array<[Point, Point]>;
}

/**
 * Build drawable geometry for up to two detected hands.
 * Malformed hands (fewer than 21 landmarks) are tolerated: only the bones whose
 * endpoints exist are emitted.
 */
export function buildHandGeometry(
  hands: ReadonlyArray<ReadonlyArray<HandLandmark>>,
  handedness: ReadonlyArray<string> | null | undefined,
  transform: CoverTransform,
  videoWidth: number,
  videoHeight: number,
  mirrored: boolean
): HandGeometry[] {
  const sides = resolveHandSides(handedness, hands.length);

  return hands.map((hand, handIndex) => {
    const points = hand.map((landmark) =>
      projectLandmark(landmark, transform, videoWidth, videoHeight, mirrored)
    );
    const side = sides[handIndex] ?? "unknown";

    return {
      side,
      style: getHandStyle(side),
      points,
      bones: HAND_CONNECTIONS.filter(([from, to]) => from < points.length && to < points.length).map(
        ([from, to]): [Point, Point] => [points[from], points[to]]
      ),
    };
  });
}

/**
 * Minimal structural contract of the 2D context used by the overlay.
 * `CanvasRenderingContext2D` satisfies it; so do lightweight test doubles.
 */
export interface HandOverlayContext {
  save(): void;
  restore(): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void;
  fill(): void;
  stroke(): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  fillText(text: string, x: number, y: number): void;
  measureText(text: string): { width: number };
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasGradient | CanvasPattern;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

export interface HandOverlayOptions {
  /** Bone thickness in CSS px. Default: 3. */
  lineWidth?: number;
  /** Draw the "Kiri" / "Kanan" chip next to each wrist. Default: true. */
  showLabels?: boolean;
  /** Canvas size in CSS px, used to keep labels inside the viewport. */
  canvasSize?: { width: number; height: number };
}

/** Trace bone segments as a single path (caller owns `beginPath`). */
function traceBones(ctx: HandOverlayContext, bones: ReadonlyArray<[Point, Point]>): void {
  for (const [from, to] of bones) {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }
}

/** Trace joints as separate sub-paths so fills/strokes never connect them. */
function traceJoints(ctx: HandOverlayContext, points: ReadonlyArray<Point>, radius: number): void {
  for (const point of points) {
    ctx.moveTo(point.x + radius, point.y);
    ctx.arc(point.x, point.y, radius, 0, TAU);
  }
}

function traceRoundedRect(
  ctx: HandOverlayContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function drawHandLabel(
  ctx: HandOverlayContext,
  wrist: Point,
  style: HandStyle,
  jointRadius: number,
  lineWidth: number,
  canvasSize: { width: number; height: number } | undefined
): void {
  const fontSize = Math.max(11, Math.round(lineWidth * 4));
  ctx.font = `600 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const paddingX = 9;
  const paddingY = 5;
  const chipWidth = ctx.measureText(style.label).width + paddingX * 2;
  const chipHeight = fontSize + paddingY * 2;
  const gap = jointRadius * 2.2 + 6;

  let x = wrist.x - chipWidth / 2;
  let y = wrist.y - gap - chipHeight;
  const maxX = (canvasSize?.width ?? Number.POSITIVE_INFINITY) - chipWidth - 4;
  const maxY = (canvasSize?.height ?? Number.POSITIVE_INFINITY) - chipHeight - 4;
  x = clamp(x, 4, maxX);
  y = clamp(y, 4, maxY);

  traceRoundedRect(ctx, x, y, chipWidth, chipHeight, chipHeight / 2);
  ctx.fillStyle = SKELETON_LABEL_BACKGROUND;
  ctx.fill();

  ctx.fillStyle = style.bone;
  ctx.fillText(style.label, x + chipWidth / 2, y + chipHeight / 2 + 0.5);
}

function drawHand(
  ctx: HandOverlayContext,
  hand: HandGeometry,
  lineWidth: number,
  showLabels: boolean,
  canvasSize: { width: number; height: number } | undefined
): void {
  const { points, bones, style } = hand;
  const wrist = points[0];
  if (!wrist) return;

  const jointRadius = Math.max(3, lineWidth + 1);
  const haloRadius = jointRadius * 2.2;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // 1. Dark outline pass keeps the skeleton legible on bright backgrounds.
  ctx.beginPath();
  traceBones(ctx, bones);
  ctx.lineWidth = lineWidth + 3;
  ctx.strokeStyle = SKELETON_OUTLINE_COLOR;
  ctx.stroke();

  // 2. Coloured bones (the actual left/right distinction).
  ctx.beginPath();
  traceBones(ctx, bones);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = style.bone;
  ctx.stroke();

  // 3. Soft halos under the joints.
  ctx.beginPath();
  traceJoints(ctx, points, haloRadius);
  ctx.fillStyle = style.halo;
  ctx.fill();

  // 4. Bright joint cores with a coloured ring.
  ctx.beginPath();
  traceJoints(ctx, points, jointRadius);
  ctx.fillStyle = style.joint;
  ctx.fill();
  ctx.lineWidth = Math.max(1, lineWidth * 0.5);
  ctx.strokeStyle = style.bone;
  ctx.stroke();

  if (showLabels) {
    drawHandLabel(ctx, wrist, style, jointRadius, lineWidth, canvasSize);
  }

  ctx.restore();
}

/**
 * Draw the skeleton for every detected hand.
 * The canvas is expected to be cleared by the caller before each frame.
 */
export function drawHandOverlay(
  ctx: HandOverlayContext,
  hands: ReadonlyArray<HandGeometry>,
  options: HandOverlayOptions = {}
): void {
  const { lineWidth = 3, showLabels = true, canvasSize } = options;

  for (const hand of hands) {
    drawHand(ctx, hand, lineWidth, showLabels, canvasSize);
  }
}
