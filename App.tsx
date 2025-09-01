
import React, { useState, useContext, useEffect, useRef } from 'react';
import type { Language, LanguageContextType, Translations, View, Reciter, Theme, Surah } from './types';
import { LanguageContext } from './types';
import BottomNavBar from './components/BottomNavBar';
import Home from './components/Home';
import DuaGenerator from './components/DuaGenerator';
import Quran from './components/Quran';
import Quiz from './components/Quiz';
import More from './components/More';
import SurahDetail from './components/SurahDetail';
import Onboarding from './components/Onboarding';
import { recitersData } from './data/recitersData';
import { getSurahList } from './services/quranService';

const translations: { [key in Language]: Translations } = {
  en: {
    // Onboarding
    chooseLanguage: "Choose Language",
    welcomeTitle: "Welcome to AYA",
    welcomeDescription: "Your companion for reading, listening to, and reflecting upon the Holy Quran.",
    continueButton: "Continue",
    // Nav
    navHome: "Home",
    navDua: "Assistant", // Changed from "Dua"
    navQuran: "Surahs", // Changed from "Quran"
    navQuiz: "Quiz",
    navMore: "More", // New
    // Home Page
    greetingMorning: "Good Morning",
    greetingAfternoon: "Good Afternoon",
    greetingEvening: "Good Evening",
    homeSubGreeting: "Read, listen, and reflect on the words of Allah.",
    streakTitle: "Day Streak",
    verseOfTheDayTitle: "Verse for Reflection",
    dhikrOfTheDayTitle: "Praises of the Day",
    // Dua Page (Now Assistant)
    headerTitle: "AYA",
    pageTitle: "Smart Assistant",
    pageDescription: "Describe your situation, your hopes, or your worries, and let us generate a heartfelt dua for you.",
    textareaPlaceholder: "For example: 'I have a job interview tomorrow and I am feeling nervous...'",
    generateButton: "Generate Dua",
    generatingButton: "Generating...",
    tryExamples: "Or try one of these examples:",
    example1: "I have an important exam tomorrow and I'm feeling anxious.",
    example2: "My family member is sick and I want to pray for their recovery.",
    example3: "I am starting a new business and I need guidance and success.",
    example4: "I am feeling lost and need strength to overcome a personal challenge.",
    loadingMessage: "Crafting your dua...",
    errorTitle: "Error:",
    errorMessage: "Sorry, an error occurred while generating your dua. Please try again.",
    promptError: "Please describe what you would like to make dua for.",
    duaCardTransliteration: "Transliteration:",
    duaCardReference: "Reference:",
    // Quran Page
    quranTitle: "The Holy Quran",
    quranDescription: "Browse all 114 Surahs of the Quran.",
    searchPlaceholder: "Search Surah name...",
    surah: "Surah",
    ayahs: "Ayahs",
    backToSurahs: "Back to Surah List",
    ayah: "Ayah",
    loadingSurah: "Loading Surah...",
    selectReciter: "Select Reciter",
    nextSurah: "Next Surah",
    previousSurah: "Previous Surah",
    playSurah: "Play Surah",
    pause: "Pause",
    // Quiz Page
    quizTitle: "Test Your Knowledge",
    quizIntro: "Ready to test your knowledge of the Quran and Islam? A new set of questions will be generated for you.",
    quizStart: "Start Quiz",
    quizGenerating: "Generating a new quiz for you...",
    quizQuestion: "Question",
    quizOf: "of",
    quizNext: "Next",
    quizSubmit: "Submit",
    quizResults: "Quiz Results",
    quizScore: "You scored {score} out of {total}",
    quizRestart: "Play Again",
    quizCorrect: "Correct!",
    quizIncorrect: "Incorrect.",
    // More Page
    moreTitle: "Settings & More",
    themeTitle: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
  },
  ar: {
    // Onboarding
    chooseLanguage: "اختر لغتك",
    welcomeTitle: "أهلاً بك في آية",
    welcomeDescription: "رفيقك لقراءة القرآن الكريم والاستماع إليه وتدبره.",
    continueButton: "التالي",
    // Nav
    navHome: "الرئيسية",
    navDua: "المساعد الذكي", // Changed
    navQuran: "السور", // Changed
    navQuiz: "اختبر",
    navMore: "المزيد", // New
    // Home Page
    greetingMorning: "صباح الخير",
    greetingAfternoon: "نهارك سعيد",
    greetingEvening: "مساء الخير",
    homeSubGreeting: "اقرأ واستمع وتدبر كلام الله.",
    streakTitle: "يوم متتالي",
    verseOfTheDayTitle: "آية للتدبر",
    dhikrOfTheDayTitle: "تسبيحات اليوم",
    // Dua Page (Now Assistant)
    headerTitle: "آية",
    pageTitle: "المساعد الذكي",
    pageDescription: "صف حالتك، آمالك، أو مخاوفك، ودعنا ننشئ لك دعاءً صادقًا.",
    textareaPlaceholder: "على سبيل المثال: 'لدي مقابلة عمل غدًا وأشعر بالتوتر...'",
    generateButton: "إنشاء دعاء",
    generatingButton: "جاري الإنشاء...",
    tryExamples: "أو جرب أحد هذه الأمثلة:",
    example1: "لدي امتحان مهم غدًا وأشعر بالقلق.",
    example2: "أحد أفراد عائلتي مريض وأريد أن أدعو له بالشفاء.",
    example3: "أبدأ مشروعًا تجاريًا جديدًا وأحتاج إلى التوجيه والنجاح.",
    example4: "أشعر بالضياع وأحتاج إلى القوة للتغلب على تحدٍ شخصي.",
    loadingMessage: "نصوغ دعاءك...",
    errorTitle: "خطأ:",
    errorMessage: "عذرًا، حدث خطأ أثناء إنشاء دعائك. يرجى المحاولة مرة أخرى.",
    promptError: "يرجى وصف ما تود الدعاء من أجله.",
    duaCardTransliteration: "النطق الصوتي:",
    duaCardReference: "المرجع:",
    // Quran Page
    quranTitle: "القرآن الكريم",
    quranDescription: "تصفح جميع سور القرآن الـ 114.",
    searchPlaceholder: "ابحث عن اسم السورة...",
    surah: "سورة",
    ayahs: "آيات",
    backToSurahs: "العودة إلى قائمة السور",
    ayah: "آية",
    loadingSurah: "جاري تحميل السورة...",
    selectReciter: "اختر القارئ",
    nextSurah: "السورة التالية",
    previousSurah: "السورة السابقة",
    playSurah: "تشغيل السورة",
    pause: "إيقاف مؤقت",
    // Quiz Page
    quizTitle: "اختبر معلوماتك",
    quizIntro: "هل أنت مستعد لاختبار معرفتك بالقرآن والإسلام؟ سيتم إنشاء مجموعة جديدة من الأسئلة لك.",
    quizStart: "ابدأ الاختبار",
    quizGenerating: "جاري إنشاء اختبار جديد لك...",
    quizQuestion: "سؤال",
    quizOf: "من",
    quizNext: "التالي",
    quizSubmit: "إرسال",
    quizResults: "نتائج الاختبار",
    quizScore: "لقد حصلت على {score} من {total}",
    quizRestart: "إعادة الاختبار",
    quizCorrect: "صحيح!",
    quizIncorrect: "غير صحيح.",
    // More Page
    moreTitle: "الإعدادات والمزيد",
    themeTitle: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
  },
  fr: {
    // Onboarding
    chooseLanguage: "Choisissez la langue",
    welcomeTitle: "Bienvenue à AYA",
    welcomeDescription: "Votre compagnon pour lire, écouter et méditer sur le Saint Coran.",
    continueButton: "Continuer",
    // Nav
    navHome: "Accueil",
    navDua: "Assistant", // Changed
    navQuran: "Sourates", // Changed
    navQuiz: "Quiz",
    navMore: "Plus", // New
    // Home Page
    greetingMorning: "Bonjour",
    greetingAfternoon: "Bon après-midi",
    greetingEvening: "Bonsoir",
    homeSubGreeting: "Lisez, écoutez et méditez les paroles d'Allah.",
    streakTitle: "Jours de suite",
    verseOfTheDayTitle: "Verset à méditer",
    dhikrOfTheDayTitle: "Louanges du jour",
    // Dua Page (Now Assistant)
    headerTitle: "AYA",
    pageTitle: "Assistant Intelligent",
    pageDescription: "Décrivez votre situation, vos espoirs ou vos inquiétudes, et laissez-nous générer une dou'a sincère pour vous.",
    textareaPlaceholder: "Par exemple : 'J'ai un entretien d'embauche demain et je suis nerveux...'",
    generateButton: "Générer la Dou'a",
    generatingButton: "Génération...",
    tryExamples: "Ou essayez l'un de ces exemples :",
    example1: "J'ai un examen important demain et je me sens anxieux.",
    example2: "Un membre de ma famille est malade et je veux prier pour sa guérison.",
    example3: "Je démarre une nouvelle entreprise et j'ai besoin de conseils et de succès.",
    example4: "Je me sens perdu et j'ai besoin de force pour surmonter un défi personnel.",
    loadingMessage: "Préparation de votre dou'a...",
    errorTitle: "Erreur :",
    errorMessage: "Désolé, une erreur est survenue lors de la génération de votre dou'a. Veuillez réessayer.",
    promptError: "Veuillez décrire ce pour quoi vous souhaitez faire une dou'a.",
    duaCardTransliteration: "Translittération :",
    duaCardReference: "Référence :",
    // Quran Page
    quranTitle: "Le Saint Coran",
    quranDescription: "Parcourez les 114 sourates du Coran.",
    searchPlaceholder: "Rechercher une sourate...",
    surah: "Sourate",
    ayahs: "Versets",
    backToSurahs: "Retour à la liste des sourates",
    ayah: "Verset",
    loadingSurah: "Chargement de la sourate...",
    selectReciter: "Choisir le récitateur",
    nextSurah: "Sourate suivante",
    previousSurah: "Sourate précédente",
    playSurah: "Lire la Sourate",
    pause: "Pause",
    // Quiz Page
    quizTitle: "Testez Vos Connaissances",
    quizIntro: "Prêt à tester vos connaissances sur le Coran et l'Islam ? Une nouvelle série de questions sera générée pour vous.",
    quizStart: "Commencer le Quiz",
    quizGenerating: "Génération d'un nouveau quiz pour vous...",
    quizQuestion: "Question",
    quizOf: "de",
    quizNext: "Suivant",
    quizSubmit: "Soumettre",
    quizResults: "Résultats du Quiz",
    quizScore: "Votre score est de {score} sur {total}",
    quizRestart: "Rejouer",
    quizCorrect: "Correct !",
    quizIncorrect: "Incorrect.",
    // More Page
    moreTitle: "Paramètres et plus",
    themeTitle: "Apparence",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
  }
};

const viewOrder: View[] = ['home', 'quran', 'dua', 'quiz', 'more'];

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

  const [view, setViewState] = useState<View>('home');
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const previousViewIndex = useRef(viewOrder.indexOf('home'));


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

  const setView = (newView: View) => {
      const newIndex = viewOrder.indexOf(newView);
      if (newIndex > previousViewIndex.current) {
          setAnimationDirection('right');
      } else {
          setAnimationDirection('left');
      }
      previousViewIndex.current = newIndex;
      setViewState(newView);
  }

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
        document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]')?.setAttribute('content', '#020617');
        document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]')?.setAttribute('content', '#f8fafc');
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
    const mainDiv = document.getElementById('root');
    if (mainDiv) {
        const fontClass = language === 'ar' ? 'font-amiri' : 'font-poppins';
        // Remove old font class if it exists
        mainDiv.classList.remove('font-amiri', 'font-poppins');
        // Add new font class
        mainDiv.classList.add(fontClass);
    }
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
    animationDirection,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

const ViewContainer: React.FC<{ currentView: View, children: React.ReactNode }> = ({ currentView, children }) => {
    const { animationDirection } = useContext(LanguageContext) as LanguageContextType;
    const [displayedChild, setDisplayedChild] = useState(children);
    const [animationClass, setAnimationClass] = useState('animate-slide-in-right');

    useEffect(() => {
        setAnimationClass(animationDirection === 'right' ? 'animate-slide-out-left' : 'animate-slide-out-right');
        
        const timer = setTimeout(() => {
            setDisplayedChild(children);
            setAnimationClass(animationDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left');
        }, 200); // Half of animation duration

        return () => clearTimeout(timer);
    }, [children, animationDirection]);

    return (
        <div key={currentView} className={`view-container ${animationClass}`}>
            {displayedChild}
        </div>
    );
};

const AppContent: React.FC = () => {
  const { view, selectedSurah, isOnboardingComplete, completeOnboarding } = useContext(LanguageContext) as LanguageContextType;

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderView = () => {
    if (view === 'quran' && selectedSurah) {
        return <SurahDetail surahNumber={selectedSurah} />;
    }
    switch (view) {
        case 'home': return <Home />;
        case 'dua': return <DuaGenerator />;
        case 'quran': return <Quran />;
        case 'quiz': return <Quiz />;
        case 'more': return <More />;
        default: return <Home />;
    }
  };

  return (
     <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-grow w-full px-4 py-6 pb-24 flex flex-col items-center relative">
        <ViewContainer currentView={view}>
            {renderView()}
        </ViewContainer>
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
