// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useWebcam } from "@/hooks/useWebcam";

/**
 * Integration tests for the webcam lifecycle (SRD §3.3 state machine).
 * These run in jsdom with a mocked `navigator.mediaDevices`, so the real
 * permission/stream orchestration is exercised without a physical camera.
 */

type TrackStub = {
  stop: ReturnType<typeof vi.fn>;
  onended: (() => void) | null;
  label: string;
  kind: string;
};

function createStreamStub(trackCount = 1) {
  const tracks: TrackStub[] = Array.from({ length: trackCount }, (_, i) => ({
    stop: vi.fn(),
    onended: null,
    label: `Camera ${i}`,
    kind: "video",
  }));

  return {
    tracks,
    getVideoTracks: () => tracks,
    getTracks: () => tracks,
  };
}

function installMediaDevices(getUserMedia: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    writable: true,
    value: { getUserMedia },
  });
}

/**
 * Register a fake <video> on the hook's ref.
 * jsdom never fires `loadedmetadata`, so the test drives that handler itself.
 */
function attachVideo(result: { current: { videoRef: { current: HTMLVideoElement | null } } }) {
  const video = document.createElement("video");
  Object.defineProperty(video, "play", { value: vi.fn().mockResolvedValue(undefined) });
  result.current.videoRef.current = video;

  return video;
}

/** Fire the metadata handler the hook installs once the stream is attached. */
async function emitLoadedMetadata(video: HTMLVideoElement) {
  await act(async () => {
    video.onloadedmetadata?.(new Event("loadedmetadata"));
  });
}

describe("useWebcam lifecycle (SRD §3.3)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start in the idle state without requesting the camera", () => {
    const getUserMedia = vi.fn();
    installMediaDevices(getUserMedia);

    const { result } = renderHook(() => useWebcam());

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
    expect(result.current.errorCode).toBeNull();
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("should expose the SRD default constraints", () => {
    installMediaDevices(vi.fn());

    const { result } = renderHook(() => useWebcam());

    expect(result.current.constraints).toEqual({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30, max: 30 },
      },
      audio: false,
    });
  });

  it("should transition to active and attach the stream to the video element", async () => {
    const stream = createStreamStub();
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    installMediaDevices(getUserMedia);

    const { result } = renderHook(() => useWebcam());

    // The hook only touches the DOM once a <video> is mounted and registered.
    const video = attachVideo(result);

    await act(async () => {
      await result.current.startCamera();
    });

    expect(getUserMedia).toHaveBeenCalledWith(result.current.constraints);
    expect(video.srcObject).toBe(stream);
    // The stream is attached first; the state turns active once metadata lands.
    expect(result.current.status).toBe("initializing");

    await emitLoadedMetadata(video);

    expect(result.current.status).toBe("active");
    expect(video.play).toHaveBeenCalled();
  });

  it("should map a denied permission to E-CAM-001 and keep the error message", async () => {
    const denial = new DOMException("Permission denied", "NotAllowedError");
    installMediaDevices(vi.fn().mockRejectedValue(denial));

    const { result } = renderHook(() => useWebcam());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorCode).toBe("E-CAM-001");
    expect(result.current.error).toContain("Isyara memerlukan akses kamera");
  });

  it("should map a missing device to E-CAM-002", async () => {
    const notFound = new DOMException("Requested device not found", "NotFoundError");
    installMediaDevices(vi.fn().mockRejectedValue(notFound));

    const { result } = renderHook(() => useWebcam());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.errorCode).toBe("E-CAM-002");
  });

  it("should stop every track and clear the video source when stopped", async () => {
    const stream = createStreamStub(2);
    installMediaDevices(vi.fn().mockResolvedValue(stream));

    const { result } = renderHook(() => useWebcam());

    const video = attachVideo(result);

    await act(async () => {
      await result.current.startCamera();
    });

    act(() => {
      result.current.stopCamera();
    });

    expect(stream.tracks.every((track) => track.stop.mock.calls.length === 1)).toBe(true);
    expect(video.srcObject).toBeNull();
    expect(result.current.status).toBe("stopped");
  });

  it("should report E-CAM-002 when the hardware disconnects mid-session", async () => {
    const stream = createStreamStub();
    installMediaDevices(vi.fn().mockResolvedValue(stream));

    const { result } = renderHook(() => useWebcam());

    attachVideo(result);

    await act(async () => {
      await result.current.startCamera();
    });

    // Simulate the USB camera being unplugged.
    act(() => {
      stream.tracks[0].onended?.();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorCode).toBe("E-CAM-002");
    expect(result.current.error).toContain("terputus");
  });

  it("should release the camera when the component unmounts", async () => {
    const stream = createStreamStub();
    installMediaDevices(vi.fn().mockResolvedValue(stream));

    const { result, unmount } = renderHook(() => useWebcam());

    attachVideo(result);

    await act(async () => {
      await result.current.startCamera();
    });

    unmount();

    expect(stream.tracks[0].stop).toHaveBeenCalled();
  });

  it("should stop the previous stream before starting a new one", async () => {
    const first = createStreamStub();
    const second = createStreamStub();
    const getUserMedia = vi
      .fn()
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);
    installMediaDevices(getUserMedia);

    const { result } = renderHook(() => useWebcam());

    const video = attachVideo(result);

    await act(async () => {
      await result.current.startCamera();
    });
    await act(async () => {
      await result.current.startCamera();
    });

    expect(first.tracks[0].stop).toHaveBeenCalled();
    expect(video.srcObject).toBe(second);
  });

  it("should report E-CAM-002 when the MediaDevices API is unavailable", async () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useWebcam());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.errorCode).toBe("E-CAM-002");
    expect(result.current.error).toContain("HTTPS");
  });

  it("should auto-start when the option is enabled", async () => {
    const stream = createStreamStub();
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    installMediaDevices(getUserMedia);

    renderHook(() => useWebcam({ autoStart: true }));

    await waitFor(() => {
      expect(getUserMedia).toHaveBeenCalledOnce();
    });
  });
});
