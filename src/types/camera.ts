/**
 * MOD-CAM: Types and Contracts for Webcam and Hand Landmarker
 * Grounded in SRD Section IV Contract 1 & 2
 */

export type WebcamStatus =
  | "idle"
  | "requesting"
  | "initializing"
  | "active"
  | "error"
  | "stopped";

export interface UseWebcamReturn {
  /** Video element ref untuk di-attach ke <video> */
  videoRef: React.RefObject<HTMLVideoElement | null>;

  /** State lifecycle kamera */
  status: WebcamStatus;

  /** Error message jika status === 'error' */
  error: string | null;

  /** Mulai stream webcam. Triggers browser permission dialog */
  startCamera: () => Promise<void>;

  /** Stop stream dan release resources */
  stopCamera: () => void;

  /** Constraints yang digunakan */
  constraints: MediaStreamConstraints;
}

export const DEFAULT_WEBCAM_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: "user", // Kamera depan
    width: { ideal: 640 }, // Max 640px width
    height: { ideal: 480 }, // Max 480px height
    frameRate: { ideal: 30, max: 30 },
  },
  audio: false,
};

export interface HandLandmark {
  x: number; // Normalized [0, 1] relative to image width
  y: number; // Normalized [0, 1] relative to image height
  z: number; // Depth relative to wrist
}

export interface MediaPipeResult {
  /** 21 landmarks per hand, max 2 hands */
  landmarks: HandLandmark[][] | null;

  /** Handedness: 'Left' | 'Right' */
  handedness: string[] | null;

  /** Timestamp of detection */
  timestamp: number;
}

export interface UseMediaPipeReturn {
  /** Apakah model MediaPipe sudah loaded */
  isLoaded: boolean;

  /** Loading progress (0-100) */
  loadingProgress: number;

  /** Error saat loading */
  error: string | null;

  /** Detect hands dari video frame. Returns null jika tidak ada tangan */
  detect: (video: HTMLVideoElement) => MediaPipeResult | null;
}
