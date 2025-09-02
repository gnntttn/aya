
import { createContext } from 'react';

export interface Dua {
  title: string;
  duaText: string;
  duaArabic: string;
  duaTransliteration: string;
  reference: string;
}

export type Language = 'en' | 'ar' | 'fr';

export type View = 'home' | 'dua' | 'quran' | 'quiz' | 'settings';

export type Theme = 'light' | 'dark' | 'system';

export type QuizState = 'idle' | 'loading' | 'active' | 'results';

export interface Reciter {
  identifier: string;
  name: { [key in Language]: string };
}

// For Quran API
export interface Surah {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  translationText?: string;
  surah?: {
      number: number;
      name: string; // Arabic name
      englishName: string;
  }
}

export interface SurahDetailData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  juz: number;
  ayahs: Ayah[];
}

export interface QuizQuestion {
  question: { [key in Language]: string };
  options: { [key in Language]: string[] };
  correctAnswerIndex: number;
  explanation: { [key in Language]: string };
}

export interface Translations {
  [key:string]: string;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  view: View;
  setView: (view: View) => void;
  selectedSurah: number | null;
  setSelectedSurah: (num: number | null) => void;
  reciter: Reciter;
  setReciter: (reciter: Reciter) => void;
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  surahs: Surah[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
