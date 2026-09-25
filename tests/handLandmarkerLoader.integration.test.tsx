// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const forVisionTasks = vi.fn();
const createFromOptions = vi.fn();

vi.mock("@mediapipe/tasks-vision", () => ({
  FilesetResolver: {
    forVisionTasks: (...args: unknown[]) => forVisionTasks(...args),
  },
  HandLandmarker: {
    createFromOptions: (...args: unknown[]) => createFromOptions(...args),
  },
}));

import { logger } from "@/lib/logger";
import {
  initializeHandLandmarker,
  resetHandLandmarker,
  HAND_LANDMARKER_MODEL_URL,
  MEDIAPIPE_CONFIG,
  MEDIAPIPE_WASM_CDN,
} from "@/lib/mediapipe/handLandmarker";

/**
 * Integration tests for the MediaPipe loader (SRD §7.1 resilience).
 * `@mediapipe/tasks-vision` is mocked, so what gets exercised is the loader's
 * own caching, GPU→CPU fallback and error reporting.
 */

const visionStub = { fake: "vision-fileset" };

function makeLandmarkerStub(delegate: string) {
  return { delegate, close: vi.fn() };
}

describe("initializeHandLandmarker (SRD §7.1)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    forVisionTasks.mockReset();
    createFromOptions.mockReset();
    forVisionTasks.mockResolvedValue(visionStub);
    resetHandLandmarker();
  });

  afterEach(() => {
    resetHandLandmarker();
    vi.restoreAllMocks();
  });

  it("should load WASM assets and create a GPU landmarker with the SRD config", async () => {
    const landmarker = makeLandmarkerStub("GPU");
    createFromOptions.mockResolvedValue(landmarker);
    const onProgress = vi.fn();

    const result = await initializeHandLandmarker(onProgress);

    expect(result).toBe(landmarker);
    expect(forVisionTasks).toHaveBeenCalledWith(MEDIAPIPE_WASM_CDN);
    expect(createFromOptions).toHaveBeenCalledWith(
      visionStub,
      expect.objectContaining({
        baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_URL, delegate: "GPU" },
        runningMode: MEDIAPIPE_CONFIG.runningMode,
        numHands: MEDIAPIPE_CONFIG.numHands,
        minHandDetectionConfidence: MEDIAPIPE_CONFIG.minHandDetectionConfidence,
        minHandPresenceConfidence: MEDIAPIPE_CONFIG.minHandPresenceConfidence,
        minTrackingConfidence: MEDIAPIPE_CONFIG.minTrackingConfidence,
      })
    );
    expect(onProgress).toHaveBeenCalledWith(10);
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it("should fall back to the CPU delegate when the GPU delegate fails", async () => {
    const logSpy = vi.spyOn(logger, "log").mockImplementation(() => undefined);
    const cpuLandmarker = makeLandmarkerStub("CPU");
    createFromOptions
      .mockRejectedValueOnce(new Error("WebGL context lost"))
      .mockResolvedValueOnce(cpuLandmarker);

    const result = await initializeHandLandmarker();

    expect(result).toBe(cpuLandmarker);
    expect(createFromOptions).toHaveBeenCalledTimes(2);
    expect(createFromOptions).toHaveBeenLastCalledWith(
      visionStub,
      expect.objectContaining({
        baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_URL, delegate: "CPU" },
      })
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "WARN",
        event: "MEDIAPIPE_GPU_FALLBACK",
        data: expect.objectContaining({ message: "WebGL context lost" }),
      })
    );
  });

  it("should log MEDIAPIPE_LOAD_FAILED and rethrow when both delegates fail", async () => {
    const logSpy = vi.spyOn(logger, "log").mockImplementation(() => undefined);
    createFromOptions.mockRejectedValue(new Error("network unreachable"));

    await expect(initializeHandLandmarker()).rejects.toThrow("network unreachable");

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "ERROR",
        event: "MEDIAPIPE_LOAD_FAILED",
        error: expect.objectContaining({ code: "E-MP-001" }),
      })
    );
  });

  it("should reuse the cached instance on subsequent calls without re-downloading", async () => {
    const landmarker = makeLandmarkerStub("GPU");
    createFromOptions.mockResolvedValue(landmarker);

    const first = await initializeHandLandmarker();
    const onProgress = vi.fn();
    const second = await initializeHandLandmarker(onProgress);

    expect(second).toBe(first);
    expect(forVisionTasks).toHaveBeenCalledOnce();
    expect(createFromOptions).toHaveBeenCalledOnce();
    // The cached path reports completion immediately.
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it("should deduplicate concurrent initializations into one load", async () => {
    const landmarker = makeLandmarkerStub("GPU");
    createFromOptions.mockResolvedValue(landmarker);

    const [a, b] = await Promise.all([
      initializeHandLandmarker(),
      initializeHandLandmarker(),
    ]);

    expect(a).toBe(b);
    expect(createFromOptions).toHaveBeenCalledOnce();
  });

  it("should retry after a failure instead of caching the rejection forever", async () => {
    const landmarker = makeLandmarkerStub("GPU");
    createFromOptions
      .mockRejectedValueOnce(new Error("first attempt failed"))
      .mockRejectedValueOnce(new Error("first attempt failed"))
      .mockResolvedValue(landmarker);

    await expect(initializeHandLandmarker()).rejects.toThrow();

    const result = await initializeHandLandmarker();
    expect(result).toBe(landmarker);
  });

  it("should close the cached instance and allow a fresh load after reset", async () => {
    const firstLandmarker = makeLandmarkerStub("GPU");
    const secondLandmarker = makeLandmarkerStub("GPU");
    createFromOptions
      .mockResolvedValueOnce(firstLandmarker)
      .mockResolvedValueOnce(secondLandmarker);

    const first = await initializeHandLandmarker();
    resetHandLandmarker();

    expect(first.close).toHaveBeenCalledOnce();

    const second = await initializeHandLandmarker();
    expect(second).toBe(secondLandmarker);
    expect(createFromOptions).toHaveBeenCalledTimes(2);
  });

  it("should tolerate a close() that throws during reset", async () => {
    const landmarker = makeLandmarkerStub("GPU");
    landmarker.close.mockImplementation(() => {
      throw new Error("already closed");
    });
    createFromOptions.mockResolvedValue(landmarker);

    await initializeHandLandmarker();

    expect(() => resetHandLandmarker()).not.toThrow();
  });
});
