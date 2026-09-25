/**
 * Observability, Events, and Error Codes Catalog
 * Grounded in SRD Section 4.2, 4.3, & 8.1
 */

import { SupportedLocale } from "./i18n";

export type IsyaraEvent =
  | { type: "CAMERA_GRANTED"; timestamp: number }
  | { type: "CAMERA_DENIED"; timestamp: number }
  | { type: "MODEL_LOADED"; loadTimeMs: number }
  | { type: "MODEL_ERROR"; error: string }
  | { type: "PREDICTION"; letter: string; confidence: number; latencyMs: number }
  | { type: "HAND_DETECTED"; handedness: string }
  | { type: "HAND_LOST"; timestamp: number }
  | { type: "LESSON_STARTED"; letter: string }
  | { type: "LESSON_COMPLETED"; letter: string; attempts: number }
  | { type: "QUIZ_STARTED"; timestamp: number }
  | { type: "QUIZ_COMPLETED"; score: number; durationSec: number }
  | { type: "LANGUAGE_CHANGED"; from: SupportedLocale; to: SupportedLocale }
  | { type: "THEME_CHANGED"; theme: "light" | "dark" }
  | { type: "PWA_INSTALLED"; timestamp: number };

export type ErrorCode =
  | "E-CAM-001" // Camera Permission Denied
  | "E-CAM-002" // Camera Not Found
  | "E-CAM-003" // Camera In Use
  | "E-ML-001"  // Model Load Failed
  | "E-ML-002"  // Model Predict Failed
  | "E-MP-001"  // MediaPipe Load Failed
  | "E-MP-002"  // WebGL Not Supported
  | "E-STOR-001"; // LocalStorage Full

/**
 * Standard result shape of the error mappers (`mapCameraError`,
 * `mapMediaPipeError`, …) grounded in the SRD §4.3 catalog.
 */
export interface MappedError {
  code: ErrorCode;
  message: string;
}

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  timestamp: string; // ISO 8601
  level: LogLevel;
  module: string;    // "MOD-CAM" | "MOD-ML" | "MOD-LEARN" | etc.
  event: string;
  data?: Record<string, unknown>;
  error?: {
    code: ErrorCode | string;
    message: string;
    stack?: string;
  };
}
