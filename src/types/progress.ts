/**
 * MOD-STATE: Progress and Persistent Storage Types
 * Grounded in SRD Section 3.1 & Section IV Contract 5
 */

export interface LetterStats {
  attempts: number;
  successes: number;
  bestConfidence: number;
}

export interface ProgressData {
  /** Huruf yang telah dikuasai */
  masteredLetters: string[];

  /** Skor quiz tertinggi (0 - 10) */
  quizHighScore: number;

  /** Total sesi latihan yang diselesaikan */
  totalPractice: number;

  /** Streak belajar harian berturut-turut */
  currentStreak: number;

  /** Tanggal terakhir aktif (ISO date "YYYY-MM-DD") */
  lastActiveDate: string | null;

  /** Preferensi bahasa UI */
  preferredLanguage: "id" | "en";

  /** Preferensi tema */
  preferredTheme: "light" | "dark";

  /** Statistik performa per-huruf */
  letterStats: Record<string, LetterStats>;

  /** Schema version untuk migrasi data */
  _schemaVersion?: number;
}

export const DEFAULT_PROGRESS: ProgressData = {
  masteredLetters: [],
  quizHighScore: 0,
  totalPractice: 0,
  currentStreak: 0,
  lastActiveDate: null,
  preferredLanguage: "id",
  preferredTheme: "light",
  letterStats: {},
  _schemaVersion: 1,
};

export interface UseProgressReturn {
  /** Data progress saat ini */
  progress: ProgressData;

  /** Tandai huruf sebagai mastered */
  markMastered: (letter: string) => void;

  /** Rekam sesi latihan */
  recordPractice: (letter: string, success: boolean, confidence: number) => void;

  /** Update skor quiz */
  updateQuizScore: (score: number) => void;

  /** Update streak (dipanggil saat app dibuka) */
  updateStreak: () => void;

  /** Set preferensi bahasa */
  setLanguage: (lang: "id" | "en") => void;

  /** Set preferensi tema */
  setTheme: (theme: "light" | "dark") => void;

  /** Reset semua progress */
  resetAll: () => void;
}
