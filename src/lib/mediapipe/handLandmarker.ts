/**
 * Core MediaPipe Hand Landmarker service & loader
 * Grounded in SRD Section 2.1, 4.1 (Contract 2), 4.3 (Error Codes), and 7.1/7.2 (Resilience & Caching)
 */

import type { HandLandmarker } from "@mediapipe/tasks-vision";
import type { HandLandmark, MediaPipeResult } from "@/types/camera";
import type { ErrorCode } from "@/types/events";
import { logger } from "@/lib/logger";

/**
 * Minimal structural shape of MediaPipe's `HandLandmarkerResult` that this
 * module consumes. Declared structurally (rather than importing the full
 * interface) so that detection output can be unit-tested with lightweight
 * fixtures that omit `worldLandmarks` / `handednesses`.
 */
export interface RawLandmarkResult {
  landmarks?: ReadonlyArray<
    ReadonlyArray<{ x: number; y: number; z: number }>
  > | null;
  handedness?: ReadonlyArray<
    ReadonlyArray<{ categoryName?: string }>
  > | null;
}

/**
 * Minimal structural contract needed to run per-frame video detection.
 * `HandLandmarker` satisfies this; so do test doubles.
 */
export interface VideoHandLandmarker {
  detectForVideo: (
    videoFrame: HTMLVideoElement,
    timestamp: number
  ) => RawLandmarkResult;
}

export const MEDIAPIPE_WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";

export const HAND_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export const MEDIAPIPE_CONFIG = {
  numHands: 2, // Dual-hand detection for BISINDO alphabets
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  runningMode: "VIDEO" as const,
};

let cachedHandLandmarker: HandLandmarker | null = null;
let initPromise: Promise<HandLandmarker> | null = null;

/**
 * Format raw MediaPipe HandLandmarkerResult into clean, typed MediaPipeResult
 */
export function formatMediaPipeResult(
  rawResult: RawLandmarkResult | null | undefined,
  timestamp: number = performance.now()
): MediaPipeResult | null {
  if (!rawResult || !rawResult.landmarks || rawResult.landmarks.length === 0) {
    return null;
  }

  const landmarks: HandLandmark[][] = rawResult.landmarks.map((hand) =>
    hand.map((pt) => ({
      x: Number(pt.x),
      y: Number(pt.y),
      z: Number(pt.z),
    }))
  );

  const handedness: string[] = (rawResult.handedness || []).map(
    (cats) => cats[0]?.categoryName || "Right"
  );

  return {
    landmarks,
    handedness,
    timestamp,
  };
}

/**
 * Map error during MediaPipe initialization or execution to standard ErrorCode
 */
export function mapMediaPipeError(err: unknown): {
  code: ErrorCode;
  message: string;
} {
  const errMsg = err instanceof Error ? err.message : String(err);

  if (
    errMsg.toLowerCase().includes("webgl") ||
    errMsg.toLowerCase().includes("gl context") ||
    errMsg.toLowerCase().includes("gpu")
  ) {
    return {
      code: "E-MP-002",
      message:
        "Browser Anda tidak mendukung akselerasi WebGL untuk model deteksi tangan. Harap gunakan peramban modern (Chrome/Edge).",
    };
  }

  return {
    code: "E-MP-001",
    message:
      "Gagal mengunduh atau memuat model AI deteksi tangan MediaPipe. Periksa koneksi internet Anda.",
  };
}

/**
 * Initialize MediaPipe HandLandmarker with lazy loading, GPU delegate, and CPU fallback
 */
export async function initializeHandLandmarker(
  onProgress?: (progress: number) => void
): Promise<HandLandmarker> {
  if (typeof window === "undefined") {
    throw new Error("MediaPipe HandLandmarker can only be initialized in browser context.");
  }

  if (cachedHandLandmarker) {
    onProgress?.(100);
    return cachedHandLandmarker;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      onProgress?.(10);
      logger.log({
        level: "INFO",
        module: "MOD-CAM",
        event: "MEDIAPIPE_LOADING_START",
      });

      // Dynamic import to prevent SSR bundling crashes in Next.js Turbopack
      const { FilesetResolver, HandLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );

      onProgress?.(30);
      // Resolve WASM binary assets
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_CDN);
      onProgress?.(60);

      // Attempt initialization with GPU delegate first
      let landmarker: HandLandmarker;
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_LANDMARKER_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: MEDIAPIPE_CONFIG.runningMode,
          numHands: MEDIAPIPE_CONFIG.numHands,
          minHandDetectionConfidence:
            MEDIAPIPE_CONFIG.minHandDetectionConfidence,
          minHandPresenceConfidence: MEDIAPIPE_CONFIG.minHandPresenceConfidence,
          minTrackingConfidence: MEDIAPIPE_CONFIG.minTrackingConfidence,
        });
      } catch (gpuError) {
        logger.log({
          level: "WARN",
          module: "MOD-CAM",
          event: "MEDIAPIPE_GPU_FALLBACK",
          data: {
            message:
              gpuError instanceof Error ? gpuError.message : String(gpuError),
          },
        });

        // Fallback to CPU delegate if GPU delegate fails
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_LANDMARKER_MODEL_URL,
            delegate: "CPU",
          },
          runningMode: MEDIAPIPE_CONFIG.runningMode,
          numHands: MEDIAPIPE_CONFIG.numHands,
          minHandDetectionConfidence:
            MEDIAPIPE_CONFIG.minHandDetectionConfidence,
          minHandPresenceConfidence: MEDIAPIPE_CONFIG.minHandPresenceConfidence,
          minTrackingConfidence: MEDIAPIPE_CONFIG.minTrackingConfidence,
        });
      }

      cachedHandLandmarker = landmarker;
      onProgress?.(100);

      logger.log({
        level: "INFO",
        module: "MOD-CAM",
        event: "MEDIAPIPE_LOADED",
        data: {
          numHands: MEDIAPIPE_CONFIG.numHands,
          runningMode: MEDIAPIPE_CONFIG.runningMode,
        },
      });

      return landmarker;
    } catch (err) {
      initPromise = null;
      cachedHandLandmarker = null;
      const mapped = mapMediaPipeError(err);
      logger.log({
        level: "ERROR",
        module: "MOD-CAM",
        event: "MEDIAPIPE_LOAD_FAILED",
        error: {
          code: mapped.code,
          message: mapped.message,
          stack: err instanceof Error ? err.stack : undefined,
        },
      });
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Execute hand detection from HTMLVideoElement frame
 */
export function detectHandsFromVideo(
  landmarker: VideoHandLandmarker | null,
  video: HTMLVideoElement,
  timestampMs: number = performance.now()
): MediaPipeResult | null {
  if (
    !landmarker ||
    !video ||
    video.readyState < 2 ||
    video.videoWidth === 0 ||
    video.videoHeight === 0 ||
    video.paused ||
    video.ended
  ) {
    return null;
  }

  try {
    const rawResult = landmarker.detectForVideo(video, timestampMs);
    return formatMediaPipeResult(rawResult, timestampMs);
  } catch (err) {
    logger.log({
      level: "WARN",
      module: "MOD-CAM",
      event: "MEDIAPIPE_DETECT_ERROR",
      data: {
        error: err instanceof Error ? err.message : String(err),
      },
    });
    return null;
  }
}

/**
 * Reset and close HandLandmarker singleton instance
 */
export function resetHandLandmarker(): void {
  if (cachedHandLandmarker) {
    try {
      cachedHandLandmarker.close();
    } catch {
      // ignore close errors
    }
    cachedHandLandmarker = null;
  }
  initPromise = null;
}
