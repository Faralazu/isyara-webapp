"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type {
  UseWebcamReturn,
  WebcamStatus,
} from "@/types/camera";
import type { ErrorCode, MappedError } from "@/types/events";
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
export function mapCameraError(err: unknown): MappedError {
  if (err instanceof Error || (typeof err === "object" && err !== null && "name" in err)) {
    // Read through `unknown` fields: a rejected value may carry `name` without
    // being a real Error instance, so `message` cannot be assumed to exist.
    const candidate = err as { name?: unknown; message?: unknown };
    const errorName = typeof candidate.name === "string" ? candidate.name : "";
    const originalMessage =
      typeof candidate.message === "string" ? candidate.message : "";

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

  /**
   * Options live in refs so that inline callbacks or constraint object literals
   * passed by a parent re-render do not change the identity of `startCamera`.
   * Otherwise the mount effect below would re-run and its cleanup would tear
   * down a perfectly healthy live stream.
   *
   * The refs are seeded with the initial values and re-synced in an effect, so
   * they are never written during render.
   */
  const constraintsRef = useRef<MediaStreamConstraints>(constraints);
  const onStreamReadyRef = useRef<UseWebcamOptions["onStreamReady"]>(onStreamReady);

  useEffect(() => {
    constraintsRef.current = constraints;
  }, [constraints]);

  useEffect(() => {
    onStreamReadyRef.current = onStreamReady;
  }, [onStreamReady]);

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

    const activeConstraints = constraintsRef.current;

    // Check if mediaDevices API is supported
    if (!navigator?.mediaDevices?.getUserMedia) {
      const mapped: MappedError = {
        code: "E-CAM-002",
        message:
          "Fitur kamera tidak didukung pada browser ini atau halaman belum menggunakan HTTPS yang aman.",
      };
      if (isMountedRef.current) {
        setStatus("error");
        setError(mapped.message);
        setErrorCode(mapped.code);
      }
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
      const stream = await navigator.mediaDevices.getUserMedia(activeConstraints);

      if (!isMountedRef.current) {
        // Component unmounted while waiting for user prompt
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      setStatus("initializing");

      const videoConstraints =
        typeof activeConstraints.video === "object" ? activeConstraints.video : null;

      logger.log({
        level: "INFO",
        module: "MOD-CAM",
        event: "CAMERA_GRANTED",
        data: {
          tracksCount: stream.getVideoTracks().length,
          facingMode:
            videoConstraints && "facingMode" in videoConstraints
              ? videoConstraints.facingMode
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

      // Attach stream to video element.
      // The node is captured once: re-reading the ref inside the handler could
      // observe a different element (or null) by the time metadata lands.
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          if (!isMountedRef.current) return;
          const notifyReady = () => {
            if (!isMountedRef.current) return;
            setStatus("active");
            onStreamReadyRef.current?.(stream);
          };

          videoElement
            .play()
            .then(notifyReady)
            .catch(() => {
              // Browser autoplay policy might need interaction, but video is muted
              notifyReady();
            });
        };
      } else {
        setStatus("active");
        onStreamReadyRef.current?.(stream);
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
  }, []);

  // Handle autoStart option
  /**
   * Mount/unmount lifecycle.
   *
   * Runs once per mount: the cleanup must only fire on real unmount, never
   * because a parent re-render produced a new `startCamera` identity.
   */
  useEffect(() => {
    isMountedRef.current = true;

    // Capture the node this effect is responsible for; reading the ref inside
    // the cleanup could observe a different element by then.
    const videoElement = videoRef.current;

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
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, []);

  // Handle autoStart option
  useEffect(() => {
    if (!autoStart) return;

    // Deferred to a microtask: `startCamera()` flips status synchronously, and
    // applying state directly inside the effect body would cascade renders.
    // (Same rationale as the queueMicrotask guard in TranslateClient.)
    queueMicrotask(() => {
      if (isMountedRef.current) {
        startCamera();
      }
    });
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
