// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";

const initializeHandLandmarker = vi.fn();
const detectHandsFromVideo = vi.fn();
const mapMediaPipeError = vi.fn();

vi.mock("@/lib/mediapipe/handLandmarker", () => ({
  initializeHandLandmarker: (...args: unknown[]) => initializeHandLandmarker(...args),
  detectHandsFromVideo: (...args: unknown[]) => detectHandsFromVideo(...args),
  mapMediaPipeError: (...args: unknown[]) => mapMediaPipeError(...args),
}));

import { useMediaPipe } from "@/hooks/useMediaPipe";

/**
 * Integration tests for the MediaPipe lifecycle (SRD §4.1 Contract 2).
 * The loader module is mocked so the hook's own state machine is what gets
 * exercised: load-once, progress reporting, error mapping and detection.
 */

const fakeLandmarker = { detectForVideo: vi.fn() };

describe("useMediaPipe lifecycle (SRD §4.1 Contract 2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mapMediaPipeError.mockReturnValue({
      code: "E-MP-001",
      message: "Gagal memuat model",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start in the loading state when autoLoad is enabled", () => {
    initializeHandLandmarker.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMediaPipe());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.loadingProgress).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("should not load anything when autoLoad is disabled", () => {
    const { result } = renderHook(() => useMediaPipe({ autoLoad: false }));

    expect(initializeHandLandmarker).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
  });

  it("should mark the model as loaded and report 100% progress", async () => {
    initializeHandLandmarker.mockResolvedValue(fakeLandmarker);
    const onLoaded = vi.fn();

    const { result } = renderHook(() => useMediaPipe({ onLoaded }));

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadingProgress).toBe(100);
    expect(onLoaded).toHaveBeenCalledOnce();
  });

  it("should forward progress callbacks from the loader", async () => {
    let reportProgress: ((value: number) => void) | undefined;
    initializeHandLandmarker.mockImplementation((onProgress?: (value: number) => void) => {
      reportProgress = onProgress;
      return new Promise(() => {});
    });

    const { result } = renderHook(() => useMediaPipe());

    expect(reportProgress).toBeTypeOf("function");

    act(() => {
      reportProgress?.(42);
    });

    await waitFor(() => {
      expect(result.current.loadingProgress).toBe(42);
    });
  });

  it("should map loader failures to an error code and call onError", async () => {
    const failure = new Error("model fetch failed");
    initializeHandLandmarker.mockRejectedValue(failure);
    const onError = vi.fn();

    const { result } = renderHook(() => useMediaPipe({ onError }));

    await waitFor(() => {
      expect(result.current.error).toBe("Gagal memuat model");
    });

    expect(result.current.errorCode).toBe("E-MP-001");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
    expect(mapMediaPipeError).toHaveBeenCalledWith(failure);
    expect(onError).toHaveBeenCalledWith({ code: "E-MP-001", message: "Gagal memuat model" });
  });

  it("should request the loader at most once per mount", async () => {
    initializeHandLandmarker.mockResolvedValue(fakeLandmarker);

    const { result, rerender } = renderHook(() => useMediaPipe());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    rerender();
    rerender();

    expect(initializeHandLandmarker).toHaveBeenCalledOnce();
  });

  it("should return null from detect before the model is ready", () => {
    initializeHandLandmarker.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useMediaPipe());

    expect(result.current.detect({} as HTMLVideoElement)).toBeNull();
    expect(detectHandsFromVideo).not.toHaveBeenCalled();
  });

  it("should delegate detection to the loaded landmarker", async () => {
    initializeHandLandmarker.mockResolvedValue(fakeLandmarker);
    const detection = { landmarks: [[]], handedness: ["Left"], timestamp: 1 };
    detectHandsFromVideo.mockReturnValue(detection);

    const { result } = renderHook(() => useMediaPipe());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    const video = {} as HTMLVideoElement;
    expect(result.current.detect(video)).toBe(detection);
    expect(detectHandsFromVideo).toHaveBeenCalledWith(fakeLandmarker, video);
  });

  it("should ignore a late loader resolution after unmount", async () => {
    let resolveLoader: ((value: unknown) => void) | undefined;
    initializeHandLandmarker.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLoader = resolve;
        })
    );
    const onLoaded = vi.fn();

    const { unmount } = renderHook(() => useMediaPipe({ onLoaded }));

    unmount();

    await act(async () => {
      resolveLoader?.(fakeLandmarker);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onLoaded).not.toHaveBeenCalled();
  });

  it("should ignore a late loader rejection after unmount", async () => {
    let rejectLoader: ((reason: unknown) => void) | undefined;
    initializeHandLandmarker.mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectLoader = reject;
        })
    );
    const onError = vi.fn();

    const { unmount } = renderHook(() => useMediaPipe({ onError }));

    unmount();

    await act(async () => {
      rejectLoader?.(new Error("late failure"));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(onError).not.toHaveBeenCalled();
  });
});
