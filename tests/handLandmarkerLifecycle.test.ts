import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  detectHandsFromVideo,
  initializeHandLandmarker,
  resetHandLandmarker,
  type VideoHandLandmarker,
} from "@/lib/mediapipe/handLandmarker";
import { logger } from "@/lib/logger";
describe("initializeHandLandmarker SSR guard", () => {
  it("should refuse to initialize outside the browser", async () => {
    // The node test environment has no `window`, which is exactly the state
    // Next.js server rendering runs in.
    expect(typeof window).toBe("undefined");

    await expect(initializeHandLandmarker()).rejects.toThrow(
      /can only be initialized in browser context/i
    );
  });
});

describe("resetHandLandmarker", () => {
  it("should be safe to call when nothing was ever loaded", () => {
    expect(() => resetHandLandmarker()).not.toThrow();
    expect(() => resetHandLandmarker()).not.toThrow();
  });
});

describe("detectHandsFromVideo failure handling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const readyVideo = () =>
    ({
      readyState: 4,
      videoWidth: 640,
      videoHeight: 480,
      paused: false,
      ended: false,
    }) as unknown as HTMLVideoElement;

  it("should swallow detector errors, log a warning and return null", () => {
    const logSpy = vi.spyOn(logger, "log").mockImplementation(() => undefined);
    const landmarker: VideoHandLandmarker = {
      detectForVideo: vi.fn(() => {
        throw new Error("WASM heap corrupted");
      }),
    };

    const result = detectHandsFromVideo(landmarker, readyVideo(), 100);

    expect(result).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "WARN",
        module: "MOD-CAM",
        event: "MEDIAPIPE_DETECT_ERROR",
        data: expect.objectContaining({ error: "WASM heap corrupted" }),
      })
    );
  });

  it("should stringify non-Error throws in the warning payload", () => {
    const logSpy = vi.spyOn(logger, "log").mockImplementation(() => undefined);
    const landmarker: VideoHandLandmarker = {
      detectForVideo: vi.fn(() => {
        throw "plain string failure";
      }),
    };

    expect(detectHandsFromVideo(landmarker, readyVideo())).toBeNull();
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ error: "plain string failure" }),
      })
    );
  });

  it("should return null when the detector yields no landmarks", () => {
    const landmarker: VideoHandLandmarker = {
      detectForVideo: vi.fn(() => ({ landmarks: [], handedness: [] })),
    };

    expect(detectHandsFromVideo(landmarker, readyVideo())).toBeNull();
  });
});
