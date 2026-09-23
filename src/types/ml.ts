/**
 * MOD-ML: Types and Contracts for Machine Learning Inference & Smoothing
 * Grounded in SRD Section IV Contract 3 & 4, and Section 5.1 & 5.2
 */

export interface PredictionResult {
  /** Huruf yang diprediksi ("A" - "Z") */
  letter: string;

  /** Confidence score (0.0 - 1.0) */
  confidence: number;

  /** Top 3 prediksi untuk evaluasi / debugging */
  top3: Array<{ letter: string; confidence: number }>;

  /** Inference time dalam milliseconds */
  inferenceTimeMs: number;
}

export interface UseModelReturn {
  /** Apakah model TF.js sudah loaded */
  isLoaded: boolean;

  /** Error saat loading model */
  error: string | null;

  /**
   * Predict huruf dari normalized dual-hand landmarks.
   * @param landmarks - Array of 126 floats (Left: 63 + Right: 63, zero-padded if single-handed)
   * @returns Prediction result dengan letter dan confidence
   */
  predict: (landmarks: number[]) => PredictionResult;
}

export interface SmoothingConfig {
  /** Jumlah frame dalam buffer. Default: 7 */
  bufferSize: number;

  /** Minimum confidence untuk dianggap valid. Default: 0.65 */
  minConfidence: number;

  /** Minimum kemunculan huruf di buffer untuk output consensus. Default: 4 */
  minConsensus: number;
}

export const DEFAULT_SMOOTHING_CONFIG: SmoothingConfig = {
  bufferSize: 7,
  minConfidence: 0.65,
  minConsensus: 4,
};

export interface UsePredictionReturn {
  /** Huruf yang sedang ditampilkan (sudah di-smooth) */
  currentLetter: string | null;

  /** Confidence score rata-rata dari consensus buffer */
  averageConfidence: number;

  /** Apakah sedang aktif mendeteksi */
  isDetecting: boolean;

  /** Start prediction loop (requestAnimationFrame) */
  startPrediction: () => void;

  /** Stop prediction loop */
  stopPrediction: () => void;

  /** Reset buffer */
  resetBuffer: () => void;
}
