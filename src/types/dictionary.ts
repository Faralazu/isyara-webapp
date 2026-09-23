/**
 * MOD-DICT: Dictionary Types and Contracts
 * Grounded in SRD Section 3.2
 */

export type SignType = "one-handed" | "two-handed";
export type Difficulty = "easy" | "medium" | "hard";

export interface BisindoSign {
  /** Identifier huruf ("A" .. "Z") */
  id: string;

  /** Nama huruf dalam Bahasa Indonesia */
  name_id: string;

  /** Nama huruf dalam English */
  name_en: string;

  /** Tipe isyarat: satu tangan atau dua tangan */
  type: SignType;

  /** Instruksi posisi tangan dalam Bahasa Indonesia */
  description_id: string;

  /** Hand posture instructions in English */
  description_en: string;

  /** Tips tambahan dalam Bahasa Indonesia */
  tips_id?: string;

  /** Additional tips in English */
  tips_en?: string;

  /** Path file gambar referensi (misal: "/images/bisindo/A.png") */
  image_path: string;

  /** Tingkat kesulitan gestur */
  difficulty: Difficulty;
}
