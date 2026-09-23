/**
 * MOD-I18N: Internationalization Types
 * Grounded in SRD Section IV Contract 7
 */

export type SupportedLocale = "id" | "en";

export interface Translations {
  // Navigation
  nav_translate: string;
  nav_learn: string;
  nav_dictionary: string;

  // Translate page
  translate_title: string;
  translate_start_camera: string;
  translate_stop_camera: string;
  translate_no_hand: string;
  translate_detecting: string;

  // Learn page
  learn_title: string;
  learn_practice: string;
  learn_quiz: string;
  learn_progress: string;

  // Dictionary page
  dict_title: string;
  dict_one_handed: string;
  dict_two_handed: string;

  // Common
  common_loading: string;
  common_error: string;
  common_retry: string;
  common_correct: string;
  common_incorrect: string;
  common_score: string;

  [key: string]: string;
}

export interface UseLanguageReturn {
  locale: SupportedLocale;
  t: (key: string) => string;
  setLocale: (locale: SupportedLocale) => void;
}
