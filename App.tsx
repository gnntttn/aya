
import React, { useState, useContext, useEffect, useRef } from 'react';
import type { Language, LanguageContextType, Translations, View, Reciter, Theme, Surah } from './types';
import { LanguageContext } from './types';
import BottomNavBar from './components/BottomNavBar';
import Home from './components/Home';
import DuaGenerator from './components/DuaGenerator';
import Quran from './components/Quran';
import Quiz from './components/Quiz';
import Settings from './components/Settings';
import SurahDetail from './components/SurahDetail';
import Onboarding from './components/Onboarding';
import { recitersData } from './data/recitersData';
import { getSurahList } from './services/quranService';

const translations: { [key in Language]: Translations } = {
  en: {
    // Onboarding
    chooseLanguage: "Choose Language",
    welcomeTitle: "Welcome to AYA",
    welcomeDescription: "Your companion for spiritual reflection and growth.",
    continueButton: "Begin Journey",
    // Nav
    navHome: "Home",
    navQuran: "Quran",
    navDua: "Assistant",
    navQuiz: "Quiz",
    navSettings: "Settings",
    // Home Page
    greetingMorning: "As-salamu alaykum",
    greetingAfternoon: "As-salamu alaykum",
    greetingEvening: "As-salamu alaykum",
    homeSubGreeting: "What would you like to do today?",
    verseOfTheDayTitle: "Verse of the Day",
    homeCardDua: "AI Assistant",
    homeCardDuaDesc: "Generate personal duas",
    homeCardQuran: "Surah Index",
    homeCardQuranDesc: "Browse the Holy Quran",
    homeCardQuiz: "Knowledge Quiz",
    homeCardQuizDesc: "Test your knowledge",
    homeCardSettings: "Settings",
    homeCardSettingsDesc: "Customize your app",
    // Dua Page (Assistant)
    pageTitleDua: "Dua Assistant",
    pageDescriptionDua: "Describe your situation, your hopes, or your worries, and receive a heartfelt dua.",
    textareaPlaceholder: "I have an important exam tomorrow and I'm feeling anxious...",
    generateButton: "Generate Dua",
    generatingButton: "Generating...",
    loadingMessage: "Crafting your dua...",
    errorTitle: "Error",
    errorMessage: "Sorry, an error occurred. Please try again.",
    promptError: "Please describe what you would like to make dua for.",
    duaCardTransliteration: "Transliteration",
    duaCardReference: "Reference",
    sampleDuasTitle: "Sample Duas",
    // Quran Page
    quranTitle: "The Holy Quran",
    quranDescription: "Browse all 114 Surahs.",
    searchPlaceholder: "Search by name or number...",
    surah: "Surah",
    ayahs: "verses",
    backToSurahs: "Back to Surahs",
    loadingSurah: "Loading Surah...",
    selectReciter: "Select Reciter",
    playSurah: "Play Surah",
    pause: "Pause",
    // Quiz Page
    quizTitle: "Islamic Quiz",
    quizIntro: "Ready to test your knowledge? A new set of questions will be generated for you.",
    quizStart: "Start Quiz",
    quizGenerating: "Generating Quiz...",
    quizQuestion: "Question",
    quizOf: "of",
    quizNext: "Next",
    quizResults: "Quiz Results",
    quizScore: "You scored {score} out of {total}",
    quizRestart: "Play Again",
    quizCorrect: "Correct!",
    quizIncorrect: "Incorrect.",
    // Settings Page
    settingsTitle: "Settings",
    themeTitle: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    // General
    checkingConfig: "Checking configuration...",
  },
  ar: {
    chooseLanguage: "اختر لغتك",
    welcomeTitle: "أهلاً بك في آية",
    welcomeDescription: "رفيقك للتأمل والنمو الروحي.",
    continueButton: "ابدأ الرحلة",
    navHome: "الرئيسية",
    navQuran: "القرآن",
    navDua: "المساعد",
    navQuiz: "اختبار",
    navSettings: "الإعدادات",
    greetingMorning: "السلام عليكم",
    greetingAfternoon: "السلام عليكم",
    greetingEvening: "السلام عليكم",
    homeSubGreeting: "ماذا تود أن تفعل اليوم؟",
    verseOfTheDayTitle: "آية اليوم",
    homeCardDua: "المساعد الذكي",
    homeCardDuaDesc: "لإنشاء أدعية شخصية",
    homeCardQuran: "فهرس السور",
    homeCardQuranDesc: "تصفح القرآن الكريم",
    homeCardQuiz: "اختبر معلوماتك",
    homeCardQuizDesc: "اختبر معرفتك",
    homeCardSettings: "الإعدادات",
    homeCardSettingsDesc: "خصص تطبيقك",
    pageTitleDua: "مساعد الدعاء",
    pageDescriptionDua: "صف حالتك، آمالك، أو مخاوفك، واحصل على دعاء صادق.",
    textareaPlaceholder: "لدي امتحان مهم غدًا وأشعر بالقلق...",
    generateButton: "إنشاء دعاء",
    generatingButton: "جاري الإنشاء...",
    loadingMessage: "نصوغ دعاءك...",
    errorTitle: "خطأ",
    errorMessage: "عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.",
    promptError: "يرجى وصف ما تود الدعاء من أجله.",
    duaCardTransliteration: "النطق الصوتي",
    duaCardReference: "المرجع",
    sampleDuasTitle: "أدعية نموذجية",
    quranTitle: "القرآن الكريم",
    quranDescription: "تصفح جميع سور القرآن الـ 114.",
    searchPlaceholder: "ابحث بالاسم أو الرقم...",
    surah: "سورة",
    ayahs: "آيات",
    backToSurahs: "العودة للسور",
    loadingSurah: "جاري تحميل السورة...",
    selectReciter: "اختر القارئ",
    playSurah: "تشغيل السورة",
    pause: "إيقاف",
    quizTitle: "اختبار إسلامي",
    quizIntro: "هل أنت مستعد لاختبار معرفتك؟ سيتم إنشاء مجموعة جديدة من الأسئلة لك.",
    quizStart: "ابدأ الاختبار",
    quizGenerating: "جاري إنشاء الاختبار...",
    quizQuestion: "سؤال",
    quizOf: "من",
    quizNext: "التالي",
    quizResults: "نتائج الاختبار",
    quizScore: "لقد حصلت على {score} من {total}",
    quizRestart: "إعادة الاختبار",
    quizCorrect: "صحيح!",
    quizIncorrect: "غير صحيح.",
    settingsTitle: "الإعدادات",
    themeTitle: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
    checkingConfig: "جاري التحقق من الإعدادات...",
  },
  fr: {
    chooseLanguage: "Choisissez la langue",
    welcomeTitle: "Bienvenue à AYA",
    welcomeDescription: "Votre compagnon pour la réflexion et la croissance spirituelle.",
    continueButton: "Commencer le voyage",
    navHome: "Accueil",
    navQuran: "Coran",
    navDua: "Assistant",
    navQuiz: "Quiz",
    navSettings: "Paramètres",
    greetingMorning: "As-salamu alaykum",
    greetingAfternoon: "As-salamu alaykum",
    greetingEvening: "As-salamu alaykum",
    homeSubGreeting: "Que souhaitez-vous faire aujourd'hui ?",
    verseOfTheDayTitle: "Verset du Jour",
    homeCardDua: "Assistant IA",
    homeCardDuaDesc: "Générez des dou'as personnelles",
    homeCardQuran: "Index des Sourates",
    homeCardQuranDesc: "Parcourez le Saint Coran",
    homeCardQuiz: "Quiz de Connaissances",
    homeCardQuizDesc: "Testez vos connaissances",
    homeCardSettings: "Paramètres",
    homeCardSettingsDesc: "Personnalisez votre application",
    pageTitleDua: "Assistant de Dou'a",
    pageDescriptionDua: "Décrivez votre situation, vos espoirs ou vos inquiétudes, et recevez une dou'a sincère.",
    textareaPlaceholder: "J'ai un examen important demain et je me sens anxieux...",
    generateButton: "Générer la Dou'a",
    generatingButton: "Génération...",
    loadingMessage: "Préparation de votre dou'a...",
    errorTitle: "Erreur",
    errorMessage: "Désolé, une erreur est survenue. Veuillez réessayer.",
    promptError: "Veuillez décrire pourquoi vous souhaitez faire une dou'a.",
    duaCardTransliteration: "Translittération",
    duaCardReference: "Référence",
    sampleDuasTitle: "Exemples de Dou'as",
    quranTitle: "Le Saint Coran",
    quranDescription: "Parcourez les 114 sourates.",
    searchPlaceholder: "Rechercher par nom ou numéro...",
    surah: "Sourate",
    ayahs: "versets",
    backToSurahs: "Retour aux Sourates",
    loadingSurah: "Chargement de la sourate...",
    selectReciter: "Choisir le récitateur",
    playSurah: "Lire la Sourate",
    pause: "Pause",
    quizTitle: "Quiz Islamique",
    quizIntro: "Prêt à tester vos connaissances ? Une nouvelle série de questions sera générée pour vous.",
    quizStart: "Commencer le Quiz",
    quizGenerating: "Génération du quiz...",
    quizQuestion: "Question",
    quizOf: "de",
    quizNext: "Suivant",
    quizResults: "Résultats du Quiz",
    quizScore: "Votre score est de {score} sur {total}",
    quizRestart: "Rejouer",
    quizCorrect: "Correct !",
    quizIncorrect: "Incorrect.",
    settingsTitle: "Paramètres",
    themeTitle: "Apparence",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    checkingConfig: "Vérification de la configuration...",
  }
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => localStorage.getItem('onboarding-complete') === 'true');
  
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('aya-lang') as Language;
    return ['en', 'ar', 'fr'].includes(savedLang) ? savedLang : 'en';
  });
  
  const [reciter, setReciterState] = useState<Reciter>(() => {
    const savedReciterId = localStorage.getItem('aya-reciter');
    return recitersData.find(r => r.identifier === savedReciterId) || recitersData[0];
  });

  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('aya-theme') as Theme) || 'system');
  const [view, setView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);

  useEffect(() => {
    const fetchSurahs = async () => {
        try {
            const surahList = await getSurahList();
            setSurahs(surahList);
        } catch (error) {
            console.error("Failed to load global Surah list:", error);
        }
    };
    fetchSurahs();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aya-lang', lang);
  };
  
  const setReciter = (rec: Reciter) => {
    setReciterState(rec);
    localStorage.setItem('aya-reciter', rec.identifier);
  };

  const setTheme = (themeValue: Theme) => {
      setThemeState(themeValue);
      localStorage.setItem('aya-theme', themeValue);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-complete', 'true');
    setIsOnboardingComplete(true);
  };
  
  useEffect(() => {
    if (view !== 'quran' && selectedSurah !== null) {
      setSelectedSurah(null);
    }
  }, [view, selectedSurah]);

  useEffect(() => {
    const applyTheme = () => {
        const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDarkMode);
    };
    applyTheme();
    if (theme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme();
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    view,
    setView,
    selectedSurah,
    setSelectedSurah,
    reciter,
    setReciter,
    isOnboardingComplete,
    completeOnboarding,
    theme,
    setTheme,
    surahs,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { view, selectedSurah, isOnboardingComplete, completeOnboarding, language } = useContext(LanguageContext) as LanguageContextType;

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderView = () => {
    if (view === 'quran' && selectedSurah) {
        return <SurahDetail key={`surah-${selectedSurah}`} surahNumber={selectedSurah} />;
    }
    switch (view) {
        case 'home': return <Home key="home" />;
        case 'dua': return <DuaGenerator key="dua" />;
        case 'quran': return <Quran key="quran" />;
        case 'quiz': return <Quiz key="quiz" />;
        case 'settings': return <Settings key="settings" />;
        default: return <Home key="home" />;
    }
  };
  
  const fontClass = language === 'ar' ? 'font-amiri' : 'font-inter';

  return (
     <div className={`flex flex-col min-h-[100dvh] ${fontClass}`}>
      <main className="flex-grow w-full px-4 pt-8 pb-28 flex flex-col items-center relative">
        {renderView()}
      </main>
      <BottomNavBar />
    </div>
  );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;