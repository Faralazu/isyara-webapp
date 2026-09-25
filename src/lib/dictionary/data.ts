/**
 * MOD-DICT: Shared BISINDO alphabet dataset.
 *
 * Grounded in SRD §3.2 (`bisindo_dictionary`) and PRD F-05.
 *
 * This module is intentionally free of `"use client"` so server components
 * (landing page, Learn hub) and client components (`DictionaryBrowser`) can
 * share one dataset. It is the single source of truth for the alphabet until
 * the full JSON dataset + reference images land in Phase 3, at which point only
 * this file changes.
 */

import type { Difficulty, SignType } from "@/types/dictionary";

export interface BisindoLetter {
  /** Huruf ("A" .. "Z") */
  id: string;

  /** Nama huruf dalam Bahasa Indonesia */
  nameId: string;

  /** Tipe isyarat: satu tangan atau dua tangan */
  type: SignType;

  /** Tingkat kesulitan gestur */
  difficulty: Difficulty;

  /** Instruksi posisi tangan (ID) */
  descriptionId: string;

  /** Path gambar referensi (misal: "/images/bisindo/A.png") */
  imagePath: string;
}

/** All 26 BISINDO alphabet signs, ordered A-Z. */
export const BISINDO_ALPHABET: readonly BisindoLetter[] = [
  { id: "A", nameId: "Huruf A", type: "two-handed", difficulty: "easy", descriptionId: "Telapak kiri tegak, telunjuk kanan menyentuh pangkal ibu jari kiri.", imagePath: "/images/bisindo/A.png" },
  { id: "B", nameId: "Huruf B", type: "two-handed", difficulty: "easy", descriptionId: "Kedua tangan membentuk dua loop bersentuhan di dada.", imagePath: "/images/bisindo/B.png" },
  { id: "C", nameId: "Huruf C", type: "two-handed", difficulty: "easy", descriptionId: "Kedua tangan melengkung membentuk setengah lingkaran.", imagePath: "/images/bisindo/C.png" },
  { id: "D", nameId: "Huruf D", type: "two-handed", difficulty: "easy", descriptionId: "Telunjuk kiri tegak, tangan kanan membentuk lengkungan D.", imagePath: "/images/bisindo/D.png" },
  { id: "E", nameId: "Huruf E", type: "two-handed", difficulty: "medium", descriptionId: "Telunjuk kiri tegak mendatar, tiga jari kanan menyentuh.", imagePath: "/images/bisindo/E.png" },
  { id: "F", nameId: "Huruf F", type: "two-handed", difficulty: "medium", descriptionId: "Dua jari tangan saling menyilang tegak.", imagePath: "/images/bisindo/F.png" },
  { id: "G", nameId: "Huruf G", type: "two-handed", difficulty: "medium", descriptionId: "Kedua tangan mengepal bertumpuk satu sama lain.", imagePath: "/images/bisindo/G.png" },
  { id: "H", nameId: "Huruf H", type: "two-handed", difficulty: "medium", descriptionId: "Telapak kiri tegak, telapak kanan menyapu melintang.", imagePath: "/images/bisindo/H.png" },
  { id: "I", nameId: "Huruf I", type: "one-handed", difficulty: "easy", descriptionId: "Satu tangan mengepal dengan jari kelingking tegak lurus.", imagePath: "/images/bisindo/I.png" },
  { id: "J", nameId: "Huruf J", type: "two-handed", difficulty: "hard", descriptionId: "Gerakan meliuk kelingking membentuk huruf J di udara.", imagePath: "/images/bisindo/J.png" },
  { id: "K", nameId: "Huruf K", type: "two-handed", difficulty: "medium", descriptionId: "Telunjuk kiri tegak, dua jari kanan membentuk V menyentuh.", imagePath: "/images/bisindo/K.png" },
  { id: "L", nameId: "Huruf L", type: "one-handed", difficulty: "easy", descriptionId: "Satu tangan membentuk sudut 90 derajat dengan ibu jari dan telunjuk.", imagePath: "/images/bisindo/L.png" },
  { id: "M", nameId: "Huruf M", type: "two-handed", difficulty: "medium", descriptionId: "Tiga jari kanan diletakkan di atas telapak tangan kiri.", imagePath: "/images/bisindo/M.png" },
  { id: "N", nameId: "Huruf N", type: "two-handed", difficulty: "medium", descriptionId: "Dua jari kanan diletakkan di atas telapak tangan kiri.", imagePath: "/images/bisindo/N.png" },
  { id: "O", nameId: "Huruf O", type: "two-handed", difficulty: "easy", descriptionId: "Ujung jari kedua tangan bertemu membentuk lingkaran bulat.", imagePath: "/images/bisindo/O.png" },
  { id: "P", nameId: "Huruf P", type: "two-handed", difficulty: "medium", descriptionId: "Bentuk lingkaran tangan kanan menyentuh telunjuk kiri yang tegak.", imagePath: "/images/bisindo/P.png" },
  { id: "Q", nameId: "Huruf Q", type: "two-handed", difficulty: "hard", descriptionId: "Bentuk lingkaran O dengan ekor telunjuk kanan menjulur ke bawah.", imagePath: "/images/bisindo/Q.png" },
  { id: "R", nameId: "Huruf R", type: "two-handed", difficulty: "medium", descriptionId: "Jari telunjuk dan jari tengah kanan saling menyilang.", imagePath: "/images/bisindo/R.png" },
  { id: "S", nameId: "Huruf S", type: "two-handed", difficulty: "medium", descriptionId: "Dua jari kelingking saling bertaut.", imagePath: "/images/bisindo/S.png" },
  { id: "T", nameId: "Huruf T", type: "two-handed", difficulty: "medium", descriptionId: "Telunjuk kanan menyentuh ujung atas telunjuk kiri secara tegak lurus.", imagePath: "/images/bisindo/T.png" },
  { id: "U", nameId: "Huruf U", type: "two-handed", difficulty: "easy", descriptionId: "Dua telunjuk tegak berdampingan membentuk U.", imagePath: "/images/bisindo/U.png" },
  { id: "V", nameId: "Huruf V", type: "two-handed", difficulty: "easy", descriptionId: "Dua telunjuk menyentuh di pangkal membentuk huruf V.", imagePath: "/images/bisindo/V.png" },
  { id: "W", nameId: "Huruf W", type: "two-handed", difficulty: "medium", descriptionId: "Jari kedua tangan saling bersilangan membentuk pola W.", imagePath: "/images/bisindo/W.png" },
  { id: "X", nameId: "Huruf X", type: "two-handed", difficulty: "hard", descriptionId: "Dua telunjuk menyilang membentuk tanda silang X.", imagePath: "/images/bisindo/X.png" },
  { id: "Y", nameId: "Huruf Y", type: "two-handed", difficulty: "medium", descriptionId: "Telunjuk kanan diletakkan di sela jempol dan telunjuk kiri.", imagePath: "/images/bisindo/Y.png" },
  { id: "Z", nameId: "Huruf Z", type: "two-handed", difficulty: "hard", descriptionId: "Gerakan telunjuk kanan melukis pola zigzag Z di udara.", imagePath: "/images/bisindo/Z.png" },
];

/**
 * Curated starter set for the Learn hub preview strip: a mix of single-hand
 * and dual-hand signs drawn from `BISINDO_ALPHABET` (no re-authored content).
 */
export const LEARN_PREVIEW_LETTER_IDS: readonly string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "I",
  "L",
  "O",
];

/** Resolve the Learn preview strip entries from the shared dataset. */
export function getLearnPreviewLetters(): BisindoLetter[] {
  return LEARN_PREVIEW_LETTER_IDS.map((id) => findSign(id)).filter(
    (sign): sign is BisindoLetter => sign !== undefined
  );
}

/** Look up a letter by id (case-insensitive), or `undefined` when unknown. */
export function findSign(letter: string): BisindoLetter | undefined {
  const normalized = letter.trim().toUpperCase();
  return BISINDO_ALPHABET.find((sign) => sign.id === normalized);
}

/** Human-readable Indonesian label for a sign type. */
export function getSignTypeLabel(type: SignType): string {
  return type === "two-handed" ? "2 Tangan" : "1 Tangan";
}

/** Count of signs matching a sign type. */
export function countSignsByType(type: SignType): number {
  return BISINDO_ALPHABET.filter((sign) => sign.type === type).length;
}
