"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  UseWebcamReturn,
  WebcamStatus,
} from "@/types/camera";
import type { ErrorCode } from "@/types/events";
import { DEFAULT_WEBCAM_CONSTRAINTS } from "@/types/camera";
import { logger } from "@/lib/logger";

export interface UseWebcamOptions {
  constraints?: MediaStreamConstraints;
  autoStart?: boolean;
  onStreamReady?: (stream: MediaStream) => void;
}

/**
 * Helper to map browser MediaStream / DOMException errors to standard Isyara ErrorCodes
 * Grounded in SRD Section 4.3 Error Codes Catalog
 */
export function mapCameraError(err: unknown): {
  code: ErrorCode;
  message: string;
} {
  if (err instanceof Error || (typeof err === "object" && err !== null && "name" in err)) {
    const errorName = (err as { name?: string }).name || "";
    const originalMessage = (err as Error).message || "";

    switch (errorName) {
      case "NotAllowedError":
      case "PermissionDeniedError":
      case "SecurityError":
        return {
          code: "E-CAM-001",
          message:
            "Isyara memerlukan akses kamera untuk mendeteksi isyarat. Harap izinkan akses kamera pada peramban (browser) Anda.",
        };

      case "NotFoundError":
      case "DevicesNotFoundError":
        return {
          code: "E-CAM-002",
          message:
            "Tidak ada kamera terdeteksi. Pastikan webcam terhubung dan berfungsi dengan baik.",
        };

      case "NotReadableError":
      case "TrackStartError":
        return {
          code: "E-CAM-003",
          message:
            "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi yang menggunakan kamera lalu coba lagi.",
        };

      case "OverconstrainedError":
      case "ConstraintNotSatisfiedError":
        return {
          code: "E-CAM-002",
          message:
            "Resolusi atau spesifikasi kamera yang diminta tidak didukung oleh perangkat Anda.",
        };

      case "TypeError":
        if (originalMessage.toLowerCase().includes("mediadevices")) {
          return {
            code: "E-CAM-002",
            message:
              "Fitur kamera tidak didukung pada browser ini atau memerlukan koneksi HTTPS yang aman.",
          };
        }
        break;
    }

    if (originalMessage) {
      return {
        code: "E-CAM-001",
        message: originalMessage,
      };
    }
  }

  return {
    code: "E-CAM-001",
    message: "Terjadi kesalahan tidak terduga saat mencoba mengakses kamera.",
  };
}

/**
 * Custom hook to manage webcam lifecycle, streams, permissions, and error handling.
 * Grounded in SRD Section 3.3 (Webcam Lifecycle) & Section 4.1 (Contract 1)
 */
export function useWebcam(options: UseWebcamOptions = {}): UseWebcamReturn {
  const {
    constraints = DEFAULT_WEBCAM_CONSTRAINTS,
    autoStart = false,
    onStreamReady,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const [status, setStatus] = useState<WebcamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);

  /**
   * Stop active camera stream and clean up media tracks
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (isMountedRef.current) {
      setStatus("stopped");
      setError(null);
      setErrorCode(null);
    }

    logger.log({
      level: "INFO",
      module: "MOD-CAM",
      event: "CAMERA_STOPPED",
    });
  }, []);

  /**
   * Request webcam stream from browser
   */
  const startCamera = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Check if mediaDevices API is supported
    if (!navigator?.mediaDevices?.getUserMedia) {
      const mapped = {
        code: "E-CAM-002" as ErrorCode,
        message:
          "Fitur kamera tidak didukung pada browser ini atau halaman belum menggunakan HTTPS yang aman.",
      };
      setStatus("error");
      setError(mapped.message);
      setErrorCode(mapped.code);
      logger.log({
        level: "ERROR",
        module: "MOD-CAM",
        event: "CAMERA_UNSUPPORTED",
        error: mapped,
      });
      return;
    }

    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setStatus("requesting");
    setError(null);
    setErrorCode(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!isMountedRef.current) {
        // Component unmounted while waiting for user prompt
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      setStatus("initializing");

      logger.log({
        level: "INFO",
        module: "MOD-CAM",
        event: "CAMERA_GRANTED",
        data: {
          tracksCount: stream.getVideoTracks().length,
          facingMode:
            typeof constraints.video === "object"
              ? (constraints.video as MediaTrackConstraints).facingMode
              : undefined,
        },
      });

      // Handle stream track ending mid-session (e.g. cable disconnected, hardware revoked)
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          if (!isMountedRef.current) return;
          logger.log({
            level: "WARN",
            module: "MOD-CAM",
            event: "CAMERA_DISCONNECTED",
            data: { label: track.label },
          });
          setStatus("error");
          setErrorCode("E-CAM-002");
          setError("Koneksi kamera terputus. Pastikan webcam terhubung.");
        };
      });

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (!isMountedRef.current) return;
          videoRef.current
            ?.play()
            .then(() => {
              if (isMountedRef.current) {
                setStatus("active");
                if (onStreamReady) {
                  onStreamReady(stream);
                }
              }
            })
            .catch(() => {
              // Browser autoplay policy might need interaction, but video is muted
              if (isMountedRef.current) {
                setStatus("active");
                if (onStreamReady) {
                  onStreamReady(stream);
                }
              }
            });
        };
      } else {
        setStatus("active");
        if (onStreamReady) {
          onStreamReady(stream);
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      const mapped = mapCameraError(err);
      setStatus("error");
      setError(mapped.message);
      setErrorCode(mapped.code);

      logger.log({
        level: "ERROR",
        module: "MOD-CAM",
        event: "CAMERA_DENIED",
        error: {
          code: mapped.code,
          message: mapped.message,
          stack: err instanceof Error ? err.stack : undefined,
        },
      });
    }
  }, [constraints, onStreamReady]);

  // Handle autoStart option
  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      startCamera();
    }

    return () => {
      isMountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {
            // ignore
          }
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [autoStart, startCamera]);

  return {
    videoRef,
    status,
    error,
    errorCode,
    startCamera,
    stopCamera,
    constraints,
  };
}
