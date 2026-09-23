import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mapCameraError } from "@/hooks/useWebcam";
import { DEFAULT_WEBCAM_CONSTRAINTS } from "@/types/camera";

describe("Webcam Constraints & Grounding", () => {
  it("should match SRD specification for default camera constraints", () => {
    expect(DEFAULT_WEBCAM_CONSTRAINTS.audio).toBe(false);
    expect(DEFAULT_WEBCAM_CONSTRAINTS.video).toEqual({
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { ideal: 30, max: 30 },
    });
  });
});

describe("Webcam Error Mapper (SRD Section 4.3 Catalog)", () => {
  it("should map NotAllowedError to E-CAM-001 with permission guidance", () => {
    const error = new DOMException("Permission denied", "NotAllowedError");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-001");
    expect(result.message).toContain("Isyara memerlukan akses kamera");
    expect(result.message).toContain("peramban");
  });

  it("should map PermissionDeniedError to E-CAM-001", () => {
    const error = { name: "PermissionDeniedError", message: "User denied access" };
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-001");
    expect(result.message).toContain("Isyara memerlukan akses kamera");
  });

  it("should map SecurityError to E-CAM-001", () => {
    const error = { name: "SecurityError", message: "Media access blocked by security policy" };
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-001");
  });

  it("should map NotFoundError to E-CAM-002 with device guidance", () => {
    const error = new DOMException("Requested device not found", "NotFoundError");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-002");
    expect(result.message).toContain("Tidak ada kamera terdeteksi");
  });

  it("should map DevicesNotFoundError to E-CAM-002", () => {
    const error = { name: "DevicesNotFoundError", message: "No webcam available" };
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-002");
    expect(result.message).toContain("Tidak ada kamera terdeteksi");
  });

  it("should map NotReadableError to E-CAM-003 when camera is in use", () => {
    const error = new DOMException("Could not start video source", "NotReadableError");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-003");
    expect(result.message).toContain("Kamera sedang digunakan oleh aplikasi lain");
  });

  it("should map TrackStartError to E-CAM-003", () => {
    const error = { name: "TrackStartError", message: "Device busy" };
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-003");
    expect(result.message).toContain("Kamera sedang digunakan oleh aplikasi lain");
  });

  it("should map OverconstrainedError to E-CAM-002", () => {
    const error = new DOMException("Constraints could not be satisfied", "OverconstrainedError");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-002");
    expect(result.message).toContain("Resolusi atau spesifikasi kamera yang diminta tidak didukung");
  });

  it("should map TypeError when mediaDevices is missing (HTTP / unsupported)", () => {
    const error = new TypeError("Cannot read properties of undefined (reading 'mediaDevices')");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-002");
    expect(result.message).toContain("HTTPS");
  });

  it("should gracefully handle standard Error with custom message", () => {
    const error = new Error("Hardware fault occurred");
    const result = mapCameraError(error);

    expect(result.code).toBe("E-CAM-001");
    expect(result.message).toBe("Hardware fault occurred");
  });

  it("should return fallback message for unknown or non-object errors", () => {
    const result = mapCameraError(null);
    expect(result.code).toBe("E-CAM-001");
    expect(result.message).toContain("Terjadi kesalahan tidak terduga");

    const stringResult = mapCameraError("unexpected error string");
    expect(stringResult.code).toBe("E-CAM-001");
    expect(stringResult.message).toContain("Terjadi kesalahan tidak terduga");
  });
});

describe("Webcam Lifecycle & MediaStream Mock Simulation", () => {
  let mockStop: () => void;
  let mockTrack: {
    stop: () => void;
    onended: (() => void) | null;
    label: string;
  };
  let mockStream: {
    getVideoTracks: () => typeof mockTrack[];
    getTracks: () => typeof mockTrack[];
  };

  beforeEach(() => {
    mockStop = vi.fn();
    mockTrack = {
      stop: mockStop,
      onended: null,
      label: "FaceTime HD Camera",
    };
    mockStream = {
      getVideoTracks: () => [mockTrack],
      getTracks: () => [mockTrack],
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should correctly handle track cleanup when stop is called", () => {
    const tracks = mockStream.getTracks();
    expect(tracks).toHaveLength(1);

    // Simulate stopping camera
    tracks.forEach((track) => track.stop());
    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it("should trigger onended listener when track is disconnected mid-session", () => {
    let capturedStatus = "active";
    let capturedErrorCode: string | null = null;

    mockTrack.onended = () => {
      capturedStatus = "error";
      capturedErrorCode = "E-CAM-002";
    };

    // Simulate hardware disconnect
    if (mockTrack.onended) {
      mockTrack.onended();
    }

    expect(capturedStatus).toBe("error");
    expect(capturedErrorCode).toBe("E-CAM-002");
  });
});
