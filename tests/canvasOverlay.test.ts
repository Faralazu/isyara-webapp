import { describe, it, expect } from "vitest";
import type { HandLandmark } from "@/types/camera";
import {
  HAND_CONNECTIONS,
  HAND_LANDMARK_COUNT,
  buildHandGeometry,
  computeCoverTransform,
  drawHandOverlay,
  getHandStyle,
  projectLandmark,
  resolveHandSides,
  type HandOverlayContext,
} from "@/lib/mediapipe/handSkeleton";

/** Build 21 normalized landmarks with a simple deterministic spread. */
function makeHand(offsetX = 0, offsetY = 0): HandLandmark[] {
  return Array.from({ length: HAND_LANDMARK_COUNT }, (_, i) => ({
    x: offsetX + (i % 5) * 0.05,
    y: offsetY + Math.floor(i / 5) * 0.05,
    z: -0.01 * i,
  }));
}

describe("Hand Skeleton Topology (PRD F-02)", () => {
  it("should expose exactly 21 landmarks per hand in the MediaPipe model", () => {
    expect(HAND_LANDMARK_COUNT).toBe(21);
  });

  it("should connect all 21 landmarks into a single skeleton graph", () => {
    // Every landmark must appear in at least one bone.
    const used = new Set<number>();
    for (const [from, to] of HAND_CONNECTIONS) {
      used.add(from);
      used.add(to);
    }

    expect(used.size).toBe(HAND_LANDMARK_COUNT);
    expect(HAND_CONNECTIONS.length).toBeGreaterThanOrEqual(20);
    expect(HAND_CONNECTIONS.length).toBeLessThanOrEqual(21);
  });

  it("should only reference valid landmark indices", () => {
    for (const [from, to] of HAND_CONNECTIONS) {
      expect(from).toBeGreaterThanOrEqual(0);
      expect(to).toBeGreaterThanOrEqual(0);
      expect(from).toBeLessThan(HAND_LANDMARK_COUNT);
      expect(to).toBeLessThan(HAND_LANDMARK_COUNT);
      expect(from).not.toBe(to);
    }
  });

  it("should start the thumb and each finger chain from the wrist or palm", () => {
    // Wrist (0) anchors the thumb and the index chain; the palm (5/9/13) anchors the rest.
    expect(HAND_CONNECTIONS).toContainEqual([0, 1]);
    expect(HAND_CONNECTIONS).toContainEqual([0, 5]);
    expect(HAND_CONNECTIONS).toContainEqual([5, 9]);
    expect(HAND_CONNECTIONS).toContainEqual([9, 13]);
    expect(HAND_CONNECTIONS).toContainEqual([13, 17]);
  });
});

describe("Hand Side Resolution (visual left/right distinction)", () => {
  it("should use the MediaPipe handedness labels when available", () => {
    expect(resolveHandSides(["Left", "Right"], 2)).toEqual(["left", "right"]);
    expect(resolveHandSides(["Right"], 1)).toEqual(["right"]);
  });

  it("should be case-insensitive and tolerate whitespace", () => {
    expect(resolveHandSides([" left ", "RIGHT"], 2)).toEqual(["left", "right"]);
  });

  it("should fall back to SRD §5.1 order (first right, second left)", () => {
    expect(resolveHandSides(null, 2)).toEqual(["right", "left"]);
    expect(resolveHandSides(undefined, 1)).toEqual(["right"]);
  });

  it("should flip a duplicate label so both hands never share a colour", () => {
    expect(resolveHandSides(["Right", "Right"], 2)).toEqual(["right", "left"]);
    expect(resolveHandSides(["Left", "Left"], 2)).toEqual(["left", "right"]);
  });

  it("should return one side per detected hand and nothing for zero hands", () => {
    expect(resolveHandSides([], 0)).toEqual([]);
    expect(resolveHandSides(null, 3)).toHaveLength(3);
  });

  it("should assign distinct colours to the left and right hand styles", () => {
    const left = getHandStyle("left");
    const right = getHandStyle("right");

    expect(left.bone).not.toBe(right.bone);
    expect(left.label).toBe("Kiri");
    expect(right.label).toBe("Kanan");
  });
});

describe("Object-Cover Coordinate Mapping", () => {
  it("should letterbox horizontally when the video is wider than the canvas", () => {
    // 640×480 (4:3) video inside a 400×400 (1:1) canvas → cover scale = 400/480
    const transform = computeCoverTransform(640, 480, 400, 400);
    const scale = 400 / 480;

    expect(transform.scale).toBeCloseTo(scale);
    expect(transform.offsetY).toBeCloseTo(0);
    // (400 - 640 * scale) / 2 → negative horizontal overflow (cropped sides)
    expect(transform.offsetX).toBeCloseTo((400 - 640 * scale) / 2);
    expect(transform.offsetX).toBeLessThan(0);
  });

  it("should pillarbox vertically when the video is taller than the canvas", () => {
    const transform = computeCoverTransform(480, 640, 400, 400);
    const scale = 400 / 480;

    expect(transform.scale).toBeCloseTo(scale);
    expect(transform.offsetX).toBeCloseTo(0);
    expect(transform.offsetY).toBeLessThan(0);
  });

  it("should return an identity transform for degenerate inputs", () => {
    expect(computeCoverTransform(0, 0, 400, 400)).toEqual({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
    expect(computeCoverTransform(640, 480, 0, 0)).toEqual({
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    });
  });

  it("should project the landmark centre to the canvas centre", () => {
    const transform = computeCoverTransform(640, 480, 640, 480);
    const point = projectLandmark({ x: 0.5, y: 0.5 }, transform, 640, 480, false);

    expect(point.x).toBeCloseTo(320);
    expect(point.y).toBeCloseTo(240);
  });

  it("should flip the x axis when the video is mirrored (selfie view)", () => {
    const transform = computeCoverTransform(640, 480, 640, 480);

    const natural = projectLandmark({ x: 0.25, y: 0.5 }, transform, 640, 480, false);
    const mirrored = projectLandmark({ x: 0.25, y: 0.5 }, transform, 640, 480, true);

    expect(natural.x).toBeCloseTo(160);
    expect(mirrored.x).toBeCloseTo(480);
    expect(mirrored.y).toBeCloseTo(natural.y);
  });
});

describe("buildHandGeometry", () => {
  const transform = computeCoverTransform(640, 480, 640, 480);

  it("should produce 21 projected points and 21 bones per hand", () => {
    const geometry = buildHandGeometry(
      [makeHand()],
      ["Right"],
      transform,
      640,
      480,
      false
    );

    expect(geometry).toHaveLength(1);
    expect(geometry[0].points).toHaveLength(21);
    expect(geometry[0].bones).toHaveLength(HAND_CONNECTIONS.length);
    expect(geometry[0].side).toBe("right");
  });

  it("should handle dual-hand input with distinct sides and colours", () => {
    const geometry = buildHandGeometry(
      [makeHand(0.1, 0.2), makeHand(0.6, 0.2)],
      ["Left", "Right"],
      transform,
      640,
      480,
      false
    );

    expect(geometry).toHaveLength(2);
    expect(geometry.map((hand) => hand.side)).toEqual(["left", "right"]);
    expect(geometry[0].style.bone).not.toBe(geometry[1].style.bone);
  });

  it("should tolerate malformed hands with fewer than 21 landmarks", () => {
    const truncated = makeHand().slice(0, 5);
    const geometry = buildHandGeometry(
      [truncated],
      ["Left"],
      transform,
      640,
      480,
      false
    );

    expect(geometry[0].points).toHaveLength(5);
    // Only bones whose two endpoints exist are emitted.
    for (const [from, to] of geometry[0].bones) {
      expect(from).toBeDefined();
      expect(to).toBeDefined();
    }
    expect(geometry[0].bones.length).toBeLessThan(HAND_CONNECTIONS.length);
    expect(geometry[0].bones.length).toBeGreaterThan(0);
  });
});

describe("drawHandOverlay (canvas renderer)", () => {
  interface CallCounts {
    save: number;
    restore: number;
    beginPath: number;
    closePath: number;
    stroke: number;
    fill: number;
    arc: number;
    arcTo: number;
    fillRect: number;
    fillText: number;
  }

  function createMockContext(): { ctx: HandOverlayContext; counts: CallCounts } {
    const counts: CallCounts = {
      save: 0,
      restore: 0,
      beginPath: 0,
      closePath: 0,
      stroke: 0,
      fill: 0,
      arc: 0,
      arcTo: 0,
      fillRect: 0,
      fillText: 0,
    };

    const ctx: HandOverlayContext = {
      save: () => void (counts.save += 1),
      restore: () => void (counts.restore += 1),
      beginPath: () => void (counts.beginPath += 1),
      closePath: () => void (counts.closePath += 1),
      moveTo: () => undefined,
      lineTo: () => undefined,
      arcTo: () => void (counts.arcTo += 1),
      arc: () => void (counts.arc += 1),
      fill: () => void (counts.fill += 1),
      stroke: () => void (counts.stroke += 1),
      fillRect: () => void (counts.fillRect += 1),
      fillText: () => void (counts.fillText += 1),
      measureText: (text: string) => ({ width: text.length * 7 }),
      lineWidth: 1,
      lineCap: "round",
      lineJoin: "round",
      strokeStyle: "#000",
      fillStyle: "#000",
      font: "10px sans-serif",
      textAlign: "center",
      textBaseline: "middle",
    };

    return { ctx, counts };
  }

  const transform = computeCoverTransform(640, 480, 640, 480);

  it("should draw nothing when no hands are detected", () => {
    const { ctx, counts } = createMockContext();

    drawHandOverlay(ctx, []);

    expect(counts.stroke).toBe(0);
    expect(counts.fill).toBe(0);
    expect(counts.save).toBe(0);
  });

  it("should draw bones, joints and a label chip for one hand", () => {
    const { ctx, counts } = createMockContext();
    const geometry = buildHandGeometry(
      [makeHand()],
      ["Left"],
      transform,
      640,
      480,
      false
    );

    drawHandOverlay(ctx, geometry, {
      lineWidth: 3,
      showLabels: true,
      canvasSize: { width: 640, height: 480 },
    });

    expect(counts.save).toBe(1);
    expect(counts.restore).toBe(1);
    // outline stroke + coloured bones stroke + joint ring stroke
    expect(counts.stroke).toBeGreaterThanOrEqual(3);
    // joint halo + joint core + label chip
    expect(counts.fill).toBeGreaterThanOrEqual(3);
    expect(counts.arc).toBe(21 * 2); // halos + cores
    expect(counts.arcTo).toBe(4); // rounded label chip corners
    expect(counts.fillText).toBe(1);
  });

  it("should skip labels when showLabels is false", () => {
    const { ctx, counts } = createMockContext();
    const geometry = buildHandGeometry(
      [makeHand()],
      ["Right"],
      transform,
      640,
      480,
      false
    );

    drawHandOverlay(ctx, geometry, { showLabels: false });

    expect(counts.fillText).toBe(0);
    expect(counts.arcTo).toBe(0);
  });

  it("should balance save/restore across multiple hands", () => {
    const { ctx, counts } = createMockContext();
    const geometry = buildHandGeometry(
      [makeHand(0.1, 0.2), makeHand(0.6, 0.2)],
      ["Left", "Right"],
      transform,
      640,
      480,
      false
    );

    drawHandOverlay(ctx, geometry, { showLabels: false });

    expect(counts.save).toBe(2);
    expect(counts.restore).toBe(2);
    expect(counts.arc).toBe(42 * 2);
  });
});
