import React, { useState, useContext, useEffect, useRef } from 'react';
import type { Language, LanguageContextType, Translations, View, Reciter, Theme, Surah } from './types';
import { LanguageContext } from './types';
import BottomNavBar from './components/BottomNavBar';
import Home from './components/Home';
import DuaGenerator from './components/DuaGenerator';
import Quran from './components/Quran';
import Tasbih from './components/Tasbih';
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
    welcomeDescription: "Your companion for spiritual reflection and growth.",
    continueButton: "Begin Journey",
    // Nav
    navHome: "Home",
    navQuran: "Quran",
    navDua: "Assistant",
    navTasbih: "Tasbih",
    navMore: "More",
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
    // Spiritual Companion
    spiritualCompanionTitle: "Spiritual Companion",
    spiritualCompanionPrompt: "How are you feeling today?",
    spiritualCompanionPlaceholder: "Feeling grateful...",
    spiritualCompanionSubmit: "Reflect",
    spiritualCompanionLoading: "Generating reflection...",
    spiritualCompanionToday: "Today's Reflection",
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
    playAyah: "Play Ayah",
    pause: "Pause",
    playAll: "Play Surah",
    tafsirGenerating: "Generating explanation...",
    tafsirTitle: "Explanation of Ayah {number}",
    getTafsir: "Explain with AI",
    getTafsirTitle: "Get AI Explanation",
    // Professional Tafsir
    tafsirLiteralTranslation: "Literal Translation",
    tafsirContext: "Context of Revelation",
    tafsirExplanation: "Explanation",
    tafsirLessons: "Key Lessons",
    // Recitation Practice
    recitationPracticeTitle: "Recitation Teacher",
    recitationPracticeIntro: "Read the verse aloud and I will check your recitation.",
    recitationPracticeTooltip: "Practice Recitation",
    recitationAllowMic: "Allow Microphone",
    recitationMicDenied: "Microphone access is needed. Please enable it in your browser settings.",
    recitationStart: "Tap to Record",
    recitationStop: "Tap to Stop",
    recitationRecording: "Recording...",
    recitationAnalyzing: "Analyzing...",
    recitationFeedbackCorrect: "Masha'Allah! Your recitation is correct.",
    recitationFeedbackIncorrect: "Good effort. There might be a small mistake. Please try again.",
    recitationFeedbackResult: "AI Feedback:",
    recitationYourRecitation: "I heard you recite:",
    recitationCorrection: "It seems you recited '{mistake}' instead of '{correct}'. Try again!",
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
    settingsShareTitle: "Share the App",
    settingsShareButton: "Share AYA",
    settingsLinkCopied: "Link Copied!",
    // Tasbih Page
    tasbihTitle: "Tasbih Counter",
    tasbihTarget: "Target: {count}",
    tasbihReset: "Reset",
    tasbihCycleComplete: "Cycle Complete!",
    // More Page
    moreTitle: "More Features",
    morePrayerTimes: "Prayer Times",
    moreAsmaulHusna: "Names of Allah",
    // Prayer Times
    prayerTimesTitle: "Prayer Times",
    prayerTimesDescription: "Allow location access to see prayer times for your area.",
    prayerAllowLocation: "Allow Location",
    prayerLocationDenied: "Location access is needed to show prayer times. Please enable it in your browser settings.",
    prayerFetching: "Fetching prayer times...",
    prayerFajr: "Fajr",
    prayerSunrise: "Sunrise",
    prayerDhuhr: "Dhuhr",
    prayerAsr: "Asr",
    prayerMaghrib: "Maghrib",
    prayerIsha: "Isha",
    prayerNext: "Next prayer in",
    // Asmaul Husna
    asmaulHusnaTitle: "The 99 Names of Allah",
    asmaulHusnaDescription: "Explore the beautiful names and attributes of Allah.",
    asmaulHusnaLoading: "Generating explanation...",
    // General
    checkingConfig: "Checking configuration...",
    back: "Back",
    close: "Close",
  },
  ar: {
    chooseLanguage: "اختر لغتك",
    welcomeTitle: "أهلاً بك في آية",
    welcomeDescription: "رفيقك للتأمل والنمو الروحي.",
    continueButton: "ابدأ الرحلة",
    navHome: "الرئيسية",
    navQuran: "القرآن",
    navDua: "المساعد",
    navTasbih: "المسبحة",
    navMore: "المزيد",
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
    spiritualCompanionTitle: "الرفيق الروحاني",
    spiritualCompanionPrompt: "كيف تشعر اليوم؟",
    spiritualCompanionPlaceholder: "أشعر بالامتنان...",
    spiritualCompanionSubmit: "تأمَّل",
    spiritualCompanionLoading: "جاري إنشاء التأمل...",
    spiritualCompanionToday: "تأمل اليوم",
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
    playAyah: "تشغيل الآية",
    pause: "إيقاف",
    playAll: "تشغيل السورة",
    tafsirGenerating: "جاري إنشاء التفسير...",
    tafsirTitle: "تفسير الآية رقم {number}",
    getTafsir: "تفسير بالذكاء الاصطناعي",
    getTafsirTitle: "الحصول على تفسير بالذكاء الاصطناعي",
    tafsirLiteralTranslation: "الترجمة الحرفية",
    tafsirContext: "سبب النزول",
    tafsirExplanation: "الشرح والتفسير",
    tafsirLessons: "الدروس المستفادة",
    recitationPracticeTitle: "مُعلِّم التلاوة",
    recitationPracticeIntro: "اقرأ الآية بصوت عالٍ وسأتحقق من تلاوتك.",
    recitationPracticeTooltip: "تدريب على التلاوة",
    recitationAllowMic: "السماح بالميكروفون",
    recitationMicDenied: "يلزم الوصول إلى الميكروفون. يرجى تفعيله في إعدادات المتصفح.",
    recitationStart: "انقر للتسجيل",
    recitationStop: "انقر للإيقاف",
    recitationRecording: "جاري التسجيل...",
    recitationAnalyzing: "جاري التحليل...",
    recitationFeedbackCorrect: "ما شاء الله! تلاوتك صحيحة.",
    recitationFeedbackIncorrect: "محاولة جيدة. قد يكون هناك خطأ بسيط. يرجى المحاولة مرة أخرى.",
    recitationFeedbackResult: "تقييم الذكاء الاصطناعي:",
    recitationYourRecitation: "سمعتك تقرأ:",
    recitationCorrection: "يبدو أنك قرأت '{mistake}' بدلاً من '{correct}'. حاول مرة أخرى!",
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
    settingsShareTitle: "شارك التطبيق",
    settingsShareButton: "مشاركة آية",
    settingsLinkCopied: "تم نسخ الرابط!",
    tasbihTitle: "المسبحة الإلكترونية",
    tasbihTarget: "الهدف: {count}",
    tasbihReset: "إعادة تعيين",
    tasbihCycleComplete: "اكتملت الدورة!",
    moreTitle: "ميزات إضافية",
    morePrayerTimes: "مواقيت الصلاة",
    moreAsmaulHusna: "أسماء الله الحسنى",
    prayerTimesTitle: "مواقيت الصلاة",
    prayerTimesDescription: "اسمح بالوصول للموقع لعرض مواقيت الصلاة لمنطقتك.",
    prayerAllowLocation: "السماح بالموقع",
    prayerLocationDenied: "يلزم الوصول إلى الموقع لعرض مواقيت الصلاة. يرجى تفعيله في إعدادات المتصفح.",
    prayerFetching: "جاري جلب مواقيت الصلاة...",
    prayerFajr: "الفجر",
    prayerSunrise: "الشروق",
    prayerDhuhr: "الظهر",
    prayerAsr: "العصر",
    prayerMaghrib: "المغرب",
    prayerIsha: "العشاء",
    prayerNext: "الصلاة القادمة بعد",
    asmaulHusnaTitle: "أسماء الله الحسنى",
    asmaulHusnaDescription: "اكتشف أسماء الله وصفاته الحسنى.",
    asmaulHusnaLoading: "جاري إنشاء الشرح...",
    checkingConfig: "جاري التحقق من الإعدادات...",
    back: "رجوع",
    close: "إغلاق",
  },
  fr: {
    chooseLanguage: "Choisissez la langue",
    welcomeTitle: "Bienvenue à AYA",
    welcomeDescription: "Votre compagnon pour la réflexion et la croissance spirituelle.",
    continueButton: "Commencer le voyage",
    navHome: "Accueil",
    navQuran: "Coran",
    navDua: "Assistant",
    navTasbih: "Tasbih",
    navMore: "Plus",
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
    spiritualCompanionTitle: "Compagnon Spirituel",
    spiritualCompanionPrompt: "Comment vous sentez-vous aujourd'hui ?",
    spiritualCompanionPlaceholder: "Je me sens reconnaissant...",
    spiritualCompanionSubmit: "Réfléchir",
    spiritualCompanionLoading: "Génération de la réflexion...",
    spiritualCompanionToday: "Réflexion du jour",
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
    playAyah: "Lire le Verset",
    pause: "Pause",
    playAll: "Lire la Sourate",
    tafsirGenerating: "Génération de l'explication...",
    tafsirTitle: "Explication du Verset {number}",
    getTafsir: "Expliquer avec l'IA",
    getTafsirTitle: "Obtenir l'explication par l'IA",
    tafsirLiteralTranslation: "Traduction Littérale",
    tafsirContext: "Contexte de la Révélation",
    tafsirExplanation: "Explication",
    tafsirLessons: "Leçons Clés",
    recitationPracticeTitle: "Professeur de Récitation",
    recitationPracticeIntro: "Lisez le verset à voix haute et je vérifierai votre récitation.",
    recitationPracticeTooltip: "Pratiquer la récitation",
    recitationAllowMic: "Autoriser le microphone",
    recitationMicDenied: "L'accès au microphone est requis. Veuillez l'activer dans les paramètres de votre navigateur.",
    recitationStart: "Appuyez pour enregistrer",
    recitationStop: "Appuyez pour arrêter",
    recitationRecording: "Enregistrement...",
    recitationAnalyzing: "Analyse...",
    recitationFeedbackCorrect: "Masha'Allah ! Votre récitation est correcte.",
    recitationFeedbackIncorrect: "Bon effort. Il pourrait y avoir une petite erreur. Veuillez réessayer.",
    recitationFeedbackResult: "Commentaire de l'IA :",
    recitationYourRecitation: "Je vous ai entendu réciter :",
    recitationCorrection: "Il semble que vous ayez récité '{mistake}' au lieu de '{correct}'. Réessayez !",
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
    settingsShareTitle: "Partager l'application",
    settingsShareButton: "Partager AYA",
    settingsLinkCopied: "Lien copié !",
    tasbihTitle: "Compteur Tasbih",
    tasbihTarget: "Objectif : {count}",
    tasbihReset: "Réinitialiser",
    tasbihCycleComplete: "Cycle terminé !",
    moreTitle: "Plus de fonctionnalités",
    morePrayerTimes: "Horaires de Prière",
    moreAsmaulHusna: "Noms d'Allah",
    prayerTimesTitle: "Horaires de Prière",
    prayerTimesDescription: "Autorisez l'accès à la localisation pour voir les horaires de prière de votre région.",
    prayerAllowLocation: "Autoriser la localisation",
    prayerLocationDenied: "L'accès à la localisation est nécessaire pour afficher les horaires de prière. Veuillez l'activer dans les paramètres de votre navigateur.",
    prayerFetching: "Récupération des horaires...",
    prayerFajr: "Fajr",
    prayerSunrise: "Sunrise",
    prayerDhuhr: "Dhuhr",
    prayerAsr: "Asr",
    prayerMaghrib: "Maghrib",
    prayerIsha: "Isha",
    prayerNext: "Prochaine prière dans",
    asmaulHusnaTitle: "Les 99 Noms d'Allah",
    asmaulHusnaDescription: "Explorez les beaux noms et attributs d'Allah.",
    asmaulHusnaLoading: "Génération de l'explication...",
    checkingConfig: "Vérification de la configuration...",
    back: "Retour",
    close: "Fermer",
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
        case 'tasbih': return <Tasbih key="tasbih" />;
        case 'more': return <More key="more" />;
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
