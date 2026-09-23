import { describe, it, expect, vi } from "vitest";
import {
  MEDIAPIPE_CONFIG,
  formatMediaPipeResult,
  mapMediaPipeError,
  detectHandsFromVideo,
  MEDIAPIPE_WASM_CDN,
  HAND_LANDMARKER_MODEL_URL,
} from "@/lib/mediapipe/handLandmarker";

describe("MediaPipe Hand Landmarker Configuration & Assets", () => {
  it("should enforce dual-hand detection (numHands: 2) for BISINDO", () => {
    expect(MEDIAPIPE_CONFIG.numHands).toBe(2);
    expect(MEDIAPIPE_CONFIG.runningMode).toBe("VIDEO");
    expect(MEDIAPIPE_CONFIG.minHandDetectionConfidence).toBe(0.5);
    expect(MEDIAPIPE_CONFIG.minHandPresenceConfidence).toBe(0.5);
    expect(MEDIAPIPE_CONFIG.minTrackingConfidence).toBe(0.5);
  });

  it("should have valid CDN and model URLs", () => {
    expect(MEDIAPIPE_WASM_CDN).toContain("cdn.jsdelivr.net");
    expect(MEDIAPIPE_WASM_CDN).toContain("tasks-vision");
    expect(HAND_LANDMARKER_MODEL_URL).toContain("storage.googleapis.com");
    expect(HAND_LANDMARKER_MODEL_URL).toContain("hand_landmarker.task");
  });
});

describe("formatMediaPipeResult Formatter", () => {
  it("should return null for null, undefined, or empty results", () => {
    expect(formatMediaPipeResult(null)).toBeNull();
    expect(formatMediaPipeResult({})).toBeNull();
    expect(formatMediaPipeResult({ landmarks: [] })).toBeNull();
  });

  it("should format single-hand detection result properly", () => {
    // Generate 21 dummy landmarks
    const mock21Points = Array.from({ length: 21 }, (_, i) => ({
      x: 0.1 * i,
      y: 0.2 * i,
      z: 0.05 * i,
    }));

    const rawResult = {
      landmarks: [mock21Points],
      handedness: [[{ categoryName: "Right", score: 0.98 }]],
    };

    const formatted = formatMediaPipeResult(rawResult, 12345);
    expect(formatted).not.toBeNull();
    expect(formatted?.landmarks).toHaveLength(1);
    expect(formatted?.landmarks?.[0]).toHaveLength(21);
    expect(formatted?.handedness).toEqual(["Right"]);
    expect(formatted?.timestamp).toBe(12345);
    expect(formatted?.landmarks?.[0]?.[0]).toEqual({ x: 0, y: 0, z: 0 });
  });

  it("should format dual-hand detection result properly (2 hands, 2x21 points)", () => {
    const leftHandPoints = Array.from({ length: 21 }, (_, i) => ({
      x: 0.2 + 0.01 * i,
      y: 0.4 + 0.01 * i,
      z: -0.02 * i,
    }));
    const rightHandPoints = Array.from({ length: 21 }, (_, i) => ({
      x: 0.7 + 0.01 * i,
      y: 0.4 + 0.01 * i,
      z: -0.01 * i,
    }));

    const rawResult = {
      landmarks: [leftHandPoints, rightHandPoints],
      handedness: [
        [{ categoryName: "Left", score: 0.95 }],
        [{ categoryName: "Right", score: 0.97 }],
      ],
    };

    const formatted = formatMediaPipeResult(rawResult, 99999);
    expect(formatted).not.toBeNull();
    expect(formatted?.landmarks).toHaveLength(2);
    expect(formatted?.landmarks?.[0]).toHaveLength(21);
    expect(formatted?.landmarks?.[1]).toHaveLength(21);
    expect(formatted?.handedness).toEqual(["Left", "Right"]);
    expect(formatted?.timestamp).toBe(99999);
  });

  it("should fallback to 'Right' if handedness category is missing or empty", () => {
    const mock21Points = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    const rawResult = {
      landmarks: [mock21Points],
      handedness: [[]],
    };

    const formatted = formatMediaPipeResult(rawResult);
    expect(formatted?.handedness).toEqual(["Right"]);
  });
});

describe("mapMediaPipeError (SRD Section 4.3 Catalog)", () => {
  it("should map WebGL failure to E-MP-002", () => {
    const err = new Error("WebGL context lost or not supported by graphics driver");
    const result = mapMediaPipeError(err);

    expect(result.code).toBe("E-MP-002");
    expect(result.message).toContain("WebGL");
  });

  it("should map GPU failure to E-MP-002", () => {
    const err = new Error("GPU delegate initialization failed");
    const result = mapMediaPipeError(err);

    expect(result.code).toBe("E-MP-002");
    expect(result.message).toContain("WebGL");
  });

  it("should map network/model fetch error to E-MP-001", () => {
    const err = new Error("Failed to fetch hand_landmarker.task: 404 Not Found");
    const result = mapMediaPipeError(err);

    expect(result.code).toBe("E-MP-001");
    expect(result.message).toContain("Gagal mengunduh atau memuat model AI");
  });

  it("should handle non-Error objects gracefully", () => {
    const result = mapMediaPipeError("Network timeout string");
    expect(result.code).toBe("E-MP-001");
    expect(result.message).toContain("Gagal mengunduh");
  });
});

describe("detectHandsFromVideo Frame Validation", () => {
  it("should return null if landmarker is not initialized", () => {
    const mockVideo = {} as HTMLVideoElement;
    expect(detectHandsFromVideo(null, mockVideo)).toBeNull();
  });

  it("should return null if video frame is not ready (readyState < 2)", () => {
    const mockLandmarker = { detectForVideo: vi.fn() };
    const mockVideo = {
      readyState: 1, // HAVE_METADATA only, not HAVE_CURRENT_DATA
      videoWidth: 640,
      videoHeight: 480,
      paused: false,
      ended: false,
    } as unknown as HTMLVideoElement;

    expect(detectHandsFromVideo(mockLandmarker, mockVideo)).toBeNull();
    expect(mockLandmarker.detectForVideo).not.toHaveBeenCalled();
  });

  it("should return null if videoWidth is 0", () => {
    const mockLandmarker = { detectForVideo: vi.fn() };
    const mockVideo = {
      readyState: 4,
      videoWidth: 0,
      videoHeight: 0,
      paused: false,
      ended: false,
    } as unknown as HTMLVideoElement;

    expect(detectHandsFromVideo(mockLandmarker, mockVideo)).toBeNull();
    expect(mockLandmarker.detectForVideo).not.toHaveBeenCalled();
  });

  it("should return null if video is paused or ended", () => {
    const mockLandmarker = { detectForVideo: vi.fn() };
    const pausedVideo = {
      readyState: 4,
      videoWidth: 640,
      videoHeight: 480,
      paused: true,
      ended: false,
    } as unknown as HTMLVideoElement;

    expect(detectHandsFromVideo(mockLandmarker, pausedVideo)).toBeNull();
    expect(mockLandmarker.detectForVideo).not.toHaveBeenCalled();
  });

  it("should call detectForVideo and return formatted result when frame is ready", () => {
    const mock21Points = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
    const mockLandmarker = {
      detectForVideo: vi.fn().mockReturnValue({
        landmarks: [mock21Points],
        handedness: [[{ categoryName: "Left" }]],
      }),
    };

    const readyVideo = {
      readyState: 4,
      videoWidth: 640,
      videoHeight: 480,
      paused: false,
      ended: false,
    } as unknown as HTMLVideoElement;

    const result = detectHandsFromVideo(mockLandmarker, readyVideo, 5000);
    expect(mockLandmarker.detectForVideo).toHaveBeenCalledWith(readyVideo, 5000);
    expect(result).not.toBeNull();
    expect(result?.landmarks).toHaveLength(1);
    expect(result?.handedness).toEqual(["Left"]);
  });
});
