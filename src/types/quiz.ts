/**
 * MOD-LEARN: Quiz Engine Types and Contracts
 * Grounded in SRD Section IV Contract 6 & Section 5.3
 */

export type QuizState =
  | "idle"
  | "countdown"
  | "active"
  | "checking"
  | "result"
  | "finished";

export interface QuizQuestion {
  /** Index pertanyaan (0-9) */
  index: number;

  /** Huruf target yang harus diperagakan */
  targetLetter: string;

  /** Status kebenaran jawaban */
  isCorrect: boolean | null;

  /** Sisa waktu saat soal terjawab (detik) */
  timeRemaining: number | null;
}

export interface QuizConfig {
  /** Jumlah soal (SRD: tetap 10 soal per kuis) */
  totalQuestions: 10;

  /** Durasi waktu per soal dalam detik (default: 15) */
  timePerQuestion: number;

  /** Ambang batas confidence untuk dinyatakan benar (default: 0.75) */
  minCorrectConfidence: number;
}

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  totalQuestions: 10,
  timePerQuestion: 15,
  minCorrectConfidence: 0.75,
};

export interface UseQuizReturn {
  state: QuizState;
  currentQuestion: QuizQuestion | null;
  score: number;
  questions: QuizQuestion[];
  timeRemaining: number;
  startQuiz: () => void;
  submitAnswer: (letter: string, confidence: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}
