import { createContext } from 'react';

export interface Dua {
  id?: string;
  title: string;
  duaText: string;
  duaArabic: string;
  duaTransliteration: string;
  reference: string;
}

export type Language = 'en' | 'ar' | 'fr';

export type View = 'home' | 'prayer' | 'quran' | 'assistant' | 'more';

export type Theme = 'light' | 'dark' | 'system';

export type QuizState = 'idle' | 'loading' | 'active' | 'results';

export interface Reciter {
  identifier: string;
  name: { [key in Language]: string };
}

export interface Radio {
  id: number;
  name: string;
  url: string;
}

// FIX: Add missing RadioStation and TvChannel types used in LiveBroadcast and liveStreamData.
export interface RadioStation {
  id: string;
  name: string;
  url: string;
}

export interface TvChannel {
  id: string;
  name: string;
  embedUrl: string;
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

export interface PrayerTimesData {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface AsmaulHusna {
    id: number;
    transliteration: string;
    en: { name: string; };
    fr: { name: string; };
    ar: string;
}

export interface Reflection {
    feeling: string;
    response: string;
    date: string;
}

export interface Tafsir {
    literalTranslation: string;
    context: string;
    explanation: string;
    lessons: string;
}

export interface RecitationFeedback {
    isCorrect: boolean;
    feedbackMessage: string;
    recitedText?: string;
    correctionDetails?: {
        mistake: string;
        correct: string;
    };
}

export interface Hadith {
    hadithText: string;
    narrator: string;
    reference: string;
    briefExplanation: string;
}

export interface Dhikr {
    arabic: string;
    transliteration: string;
    translation: string;
    count: number;
    virtue: string;
}

export interface ProphetStory {
    prophetName: string;
    story: string;
    lessons: string[];
}

export interface SahabiStory {
    sahabiName: string;
    story: string;
    lessons: string[];
}

export interface FiqhAnswer {
    question: string;
    answer: string;
    disclaimer: string;
}

export interface InheritanceInput {
    totalEstate: number;
    hasSpouse: boolean;
    sons: number;
    daughters: number;
    hasFather: boolean;
    hasMother: boolean;
}

export interface InheritanceResult {
    heir: string;
    share: string;
    amount: number;
}

export interface HajjGuideStep {
  title: string;
  description: string;
  dua?: string;
}

export interface TravelInfo {
    mosques: string[];
    halalRestaurants: string[];
    generalTips: string;
}

export interface DreamInterpretation {
    interpretation: string;
    disclaimer: string;
}

export interface HadithSearchResult {
    hadithText: string;
    reference: string;
    explanation: string;
}

export interface SpiritualGoal {
    id: string;
    text: string;
    completed: boolean;
    lastCompleted: string | null;
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
  bookmarks: number[];
  addBookmark: (surahNumber: number) => void;
  removeBookmark: (surahNumber: number) => void;
  savedDuas: Dua[];
  addSavedDua: (dua: Dua) => void;
  removeSavedDua: (duaId: string) => void;
  goals: SpiritualGoal[];
  addGoal: (text: string) => void;
  updateGoal: (goalId: string, completed: boolean) => void;
  removeGoal: (goalId: string) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);