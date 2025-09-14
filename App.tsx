import React, { useState, useContext, useEffect, useRef } from 'react';
import type { Language, LanguageContextType, Translations, View, Reciter, Theme, Surah, Dua, SpiritualGoal, QuranSettings, Khatmah } from './types';
import { LanguageContext } from './types';
import Home from './components/Home';
import Assistant from './components/Assistant';
import Quran from './components/Quran';
import More from './components/More';
import SurahDetail from './components/SurahDetail';
import Onboarding from './components/Onboarding';
import FiqhQA from './components/FiqhQA';
import LiveBroadcast from './components/LiveBroadcast';
import { recitersData } from './data/recitersData';
import { getSurahList } from './services/quranService';

const translations: { [key in Language]: Translations } = {
  en: {
    // Onboarding
    welcomeTitle: "Welcome to AYA",
    welcomeDescription: "Your companion for spiritual reflection and growth.",
    continueButton: "Begin Journey",
    // Quick Actions
    qaAlQuran: "Al-Quran",
    qaDuaAssistant: "Dua Assistant",
    qaQibla: "Qibla Compass",
    qaTasbih: "Tasbih Counter",
    qaAllFeatures: "All Features",
    qaSettings: "Settings",
    // Nav (Old, for reference)
    navPrayerTimes: "Prayer times",
    navMasjidFinder: "Masjid Finder",
    navAlQuran: "Al-Quran",
    navQibla: "Qibla",
    navCalendar: "Calendar",
    navTasbeeh: "Tasbeeh",
    nav5Pillars: "5 Pillars",
    navDuas: "Duas",
    navAboutUs: "About Us",
    navHome: "Home",
    navQuran: "Quran",
    navAssistant: "Assistant",
    navPrayer: "Prayer",
    navLive: "Live",
    navFiqh: "Q&A",
    navMore: "More",
    navQuiz: "Quiz",
    navSettings: "Settings",
    navAdmin: "Admin",
    // Home Page
    homeNextPrayer: "Next Prayer",
    homeNextPrayerIn: "in",
    homeDailyTimetable: "Daily Timetable",
    homeQuickActions: "Quick Actions",
    greetingMorning: "As-salamu alaykum",
    greetingAfternoon: "As-salamu alaykum",
    greetingEvening: "As-salamu alaykum",
    homeSubGreeting: "What would you like to do today?",
    verseOfTheDayTitle: "Verse of the Day",
    hadithOfTheDayTitle: "Hadith of the Day",
    hadithReference: "Reference",
    hadithNarrator: "Narrated by",
    hadithExplanation: "Brief Explanation",
    homeCardDua: "AI Assistant",
    homeCardDuaDesc: "Generate personal duas",
    homeCardQuran: "Surah Index",
    homeCardQuranDesc: "Browse the Holy Quran",
    homeCardQuiz: "Knowledge Quiz",
    homeCardQuizDesc: "Test your knowledge",
    homeCardSettings: "Settings",
    homeCardSettingsDesc: "Customize your app",
    homeCardLive: "Live Broadcast",
    homeCardLiveDesc: "Radio & TV streams",
    // Prayer Times Widget
    homePrayerTimesWidgetTitle: "Today's Prayer Times",
    homePrayerTimesShow: "Show Prayer Times",
    homePrayerTimesNextPrayer: "Next prayer is {prayerName} in",
    homePrayerTimesLoading: "Loading prayer times...",
    homePrayerTimesLocationError: "Could not get prayer times. Please enable location services.",
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
    modelOverloadedError: "The AI model is currently overloaded. Please try again in a few moments.",
    promptError: "Please describe what you would like to make dua for.",
    duaCardTransliteration: "Transliteration",
    duaCardReference: "Reference",
    sampleDuasTitle: "Sample Duas",
    myDuasTitle: "My Saved Duas",
    myDuasEmpty: "You haven't saved any duas yet.",
    duaSave: "Save Dua",
    duaUnsave: "Unsave Dua",
    duaSaved: "Saved",
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
    bookmarkSurah: "Bookmark Surah",
    unbookmarkSurah: "Remove Bookmark",
    tafsirGenerating: "Generating explanation...",
    tafsirTitle: "Explanation of Ayah {number}",
    getTafsir: "Explain with AI",
    getTafsirTitle: "Get AI Explanation",
    shareAsImage: "Share as Image",
    generatingImage: "Generating Image...",
    imageCopied: "Image copied to clipboard!",
    shareError: "Could not share image.",
    quranLoopAyah: "Repeat Ayah",
    quranReadingPrefs: "Reading Preferences",
    quranFontSize: "Font Size",
    quranLineHeight: "Line Spacing",
    quranSearchByJuz: "Filter by Juz'",
    juz: "Juz",
    allJuz: "All Juz'",
    // Image Customization
    imageCustomizationTitle: "Customize Ayah Image",
    ayahColor: "Verse Color",
    translationColor: "Translation Color",
    backgroundColor: "Background Color",
    colorPresets: "Color Presets",
    generateAndShare: "Generate & Share",
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
    // Memorization Helper
    memorizationHelperTitle: "Memorization Helper",
    memorizationHelperTooltip: "Memorize this Ayah",
    memorizationHelperIntro: "Focus on the verse, then try to recall it from memory.",
    memorizationShow: "Show",
    memorizationHide: "Hide",
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
    settingsReciter: "Preferred Reciter",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    settingsShareTitle: "Share the App",
    settingsShareButton: "Share AYA",
    settingsLinkCopied: "Link Copied!",
    settingsInstallApp: "Install App",
    settingsInstallButton: "Install",
    settingsNotifications: "Notifications",
    notifEnable: "Enable Notifications",
    notifEnabled: "Notifications Enabled",
    notifBlocked: "Notifications Blocked",
    notifBlockedHelp: "Please enable notifications for this site in your browser settings.",
    // Notification Content
    notifTitle: "AYA Reminder",
    notif5h: "Have you taken a moment for reflection today? AYA is waiting for you.",
    notif1d: "Don't miss today's Verse of the Day. Open AYA for a spiritual boost.",
    notif2d: "Your spiritual journey continues. Come back to AYA to explore the Quran.",
    notif3d: "We miss you! It's been a while. Let's reconnect with your faith.",
    notif5d: "A gentle reminder to nurture your soul. Your companion AYA is here for you.",
    notif7d: "Consistency is key in faith. Let's get back on track with AYA.",
    notif10d: "Has it been 10 days? Your spiritual goals await. Let's achieve them together.",
    // Tasbih Page
    tasbihTitle: "Tasbih Counter",
    tasbihTarget: "Target: {count}",
    tasbihReset: "Reset",
    tasbihCycleComplete: "Cycle Complete!",
    // More Page
    moreTitle: "More Features",
    moreAllFeatures: "All Other Features",
    morePrayerTimes: "Prayer Times",
    moreTasbih: "Tasbih Counter",
    moreAsmaulHusna: "Names of Allah",
    moreQibla: "Qibla Compass",
    moreAdhkar: "Morning & Evening Adhkar",
    moreProphetStories: "Stories of the Prophets",
    moreZakatCalculator: "Zakat Calculator",
    moreFiqhQA: "Islamic Q&A",
    moreSahabaStories: "Lives of the Sahaba",
    moreInheritance: "Inheritance Calculator",
    moreHajjGuide: "Hajj & Umrah Guide",
    moreHalalTravel: "Halal Travel Assistant",
    moreDreamInterpreter: "Dream Interpreter",
    moreSalawatCounter: "Salawat Counter",
    moreHadithSearch: "Hadith Search",
    moreSpiritualGoals: "Spiritual Goals",
    moreLiveBroadcast: "Live Broadcast",
    moreKhatmahTracker: "Khatmah Tracker",
    moreSermonGenerator: "AI Sermon Generator",
    moreIslamicHistory: "Islamic History",
    khatmahTrackerTitle: "Khatmah Tracker",
    khatmahTrackerDesc: "Set your goal and track your Quran reading progress.",
    // Khatmah Tracker
    khatmahSetupTitle: "Start Your Khatmah",
    khatmahTargetDate: "Set your target completion date",
    khatmahStartButton: "Begin Khatmah",
    khatmahProgressTitle: "Khatmah Progress",
    khatmahPagesReadOf: "{read} of {total} pages read",
    khatmahDaysLeft: "{days} days left",
    khatmahDailyGoal: "Your goal is ~{pages} pages today",
    khatmahLogToday: "Log pages read today",
    khatmahLogPlaceholder: "e.g., 10",
    khatmahAddProgress: "Add Progress",
    khatmahCompletedTitle: "Masha'Allah!",
    khatmahCompletedDesc: "You have successfully completed your Khatmah. May Allah accept it from you.",
    khatmahStartNew: "Start New Khatmah",
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
    // Qibla Compass
    qiblaTitle: "Qibla Compass",
    qiblaDescription: "Find the direction of the Kaaba from your current location.",
    qiblaFind: "Find Qibla",
    qiblaCalibrating: "Calibrating compass...",
    qiblaCalibrationError: "Could not calibrate the compass. Your device may not have the required sensors or permission may be blocked.",
    qiblaAllowMotion: "Please allow motion sensor access to use the compass.",
    qiblaAllowLocation: "Please allow location access to find the Qibla direction.",
    qiblaMotionDenied: "Motion sensor access was denied. Please enable it in your browser settings.",
    qiblaNorth: "N",
    qiblaSouth: "S",
    qiblaEast: "E",
    qiblaWest: "W",
    // Adhkar
    adhkarTitle: "Adhkar",
    adhkarDescription: "Fortify your day with remembrances.",
    adhkarMorning: "Morning",
    adhkarEvening: "Evening",
    adhkarVirtue: "Virtue",
    adhkarCount: "Count",
    // Zakat Calculator
    zakatTitle: "Zakat Calculator",
    zakatDescription: "Calculate your annual Zakat on wealth.",
    zakatTotalWealth: "Total Yearly Savings/Wealth",
    zakatNisabInfo: "Zakat is due on wealth that has been held for a full year and is above the Nisab threshold (equivalent to 85g of gold).",
    zakatCalculate: "Calculate Zakat",
    zakatAmount: "Your Zakat amount is:",
    zakatError: "Please enter a valid number.",
    // Prophet Stories
    prophetStoriesTitle: "Stories of the Prophets",
    prophetStoriesDescription: "Learn from the lives of the Prophets.",
    prophetStoriesLoading: "Generating story...",
    prophetStoriesLessons: "Key Lessons",
    // Sahaba Stories
    sahabaStoriesTitle: "Lives of the Sahaba",
    sahabaStoriesDescription: "Learn from the companions of the Prophet (PBUH).",
    sahabaStoriesLoading: "Generating story...",
    sahabaStoriesLessons: "Key Lessons & Virtues",
    // Fiqh Q&A
    fiqhQATitle: "Islamic Q&A",
    fiqhQADescription: "Ask questions about Islamic topics. Note: This is not a fatwa service.",
    fiqhQAPlaceholder: "E.g., What are the nullifiers of ablution?",
    fiqhQASubmit: "Get Answer",
    fiqhQADisclaimer: "Disclaimer: This AI is for informational purposes only and is not a qualified scholar. Always consult a local scholar for formal religious rulings (fatwa).",
    // Inheritance Calculator
    inheritanceTitle: "Inheritance Calculator",
    inheritanceDescription: "Calculate inheritance shares according to Islamic law.",
    inheritanceTotalEstate: "Total Estate Value",
    inheritanceHeirs: "Select the Heirs",
    inheritanceSpouse: "Spouse (Husband/Wife)",
    inheritanceSons: "Number of Sons",
    inheritanceDaughters: "Number of Daughters",
    inheritanceFather: "Father",
    inheritanceMother: "Mother",
    inheritanceCalculate: "Calculate Shares",
    inheritanceResultTitle: "Inheritance Distribution",
    inheritanceWarning: "This is an educational tool. Consult a qualified scholar for actual inheritance cases.",
    inheritanceHeir: "Heir",
    inheritanceShare: "Share",
    inheritanceAmount: "Amount",
    // Hajj & Umrah Guide
    hajjGuideTitle: "Hajj & Umrah Guide",
    hajjGuideDescription: "A step-by-step guide to performing the holy pilgrimages.",
    hajjGuideHajj: "Hajj",
    hajjGuideUmrah: "Umrah",
    hajjGuideAsk: "Ask a question about Hajj/Umrah",
    // Halal Travel Assistant
    travelTitle: "Halal Travel Assistant",
    travelDescription: "Find halal-friendly information for any city.",
    travelPlaceholder: "Enter a city, e.g., London",
    travelSubmit: "Search",
    travelLoading: "Finding halal spots...",
    travelMosques: "Mosques & Prayer Places",
    travelRestaurants: "Halal Restaurants",
    travelTips: "General Tips",
    // Dream Interpreter
    dreamTitle: "Dream Interpreter",
    dreamDescription: "Get a possible interpretation of your dream based on Islamic sources.",
    dreamPlaceholder: "I dreamed of a white horse...",
    dreamSubmit: "Interpret Dream",
    dreamLoading: "Interpreting...",
    dreamDisclaimer: "Disclaimer: Dream interpretations are symbolic and not definitive truth. Only Allah knows the unseen. This is for reflection only.",
    // Salawat Counter
    salawatTitle: "Salawat Counter",
    salawatDescription: "Send blessings upon the Prophet Muhammad (PBUH).",
    salawatText: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
    // Hadith Search
    hadithSearchTitle: "Hadith Search",
    hadithSearchDescription: "Search for authentic Hadith by topic.",
    hadithSearchPlaceholder: "e.g., charity, prayer, fasting",
    hadithSearchSubmit: "Search",
    hadithSearchLoading: "Searching for Hadith...",
    hadithSearchNoResults: "No Hadith found for that topic.",
    // Spiritual Goals
    goalsTitle: "My Spiritual Goals",
    goalsDescription: "Set and track your daily spiritual habits.",
    goalsAddPlaceholder: "e.g., Read Surah Al-Mulk",
    goalsAddButton: "Add Goal",
    goalsCompleted: "Completed for today!",
    goalsEmpty: "You haven't set any goals yet. Add one to begin!",
    // Live Broadcast
    liveTitle: "Live Broadcast",
    liveDescription: "Listen to Quran radio stations or watch live channels from the Holy Mosques.",
    liveRadio: "Radio",
    liveTv: "TV",
    liveSearchPlaceholder: "Search for a station or channel...",
    liveLoadingStations: "Loading stations...",
    liveErrorStations: "Could not load stations. Please try again later.",
    liveWatchNow: "Watch Now",
    // Sermon Generator
    sermonGeneratorTitle: "Sermon & Lesson Generator",
    sermonGeneratorDescription: "Enter a topic and the AI will generate a sermon outline for you.",
    sermonGeneratorPlaceholder: "e.g., Patience in Islam",
    sermonGeneratorSubmit: "Generate Outline",
    sermonGeneratorLoading: "Preparing your sermon...",
    sermonIntro: "Introduction",
    sermonPoints: "Key Points",
    sermonConclusion: "Conclusion",
    sermonDua: "Supplication (Dua)",
    // Islamic History
    islamicHistoryTitle: "Interactive Islamic History",
    islamicHistoryDescription: "Explore key periods and events in Islamic history.",
    islamicHistoryLoading: "Loading summary...",
    historySummary: "Summary",
    historyKeyFigures: "Key Figures",
    historyKeyEvents: "Key Events",
    historySignificance: "Significance",
    // Install App
    installAppTitle: "Install AYA App",
    installAppDescriptionIOS: "To install the app on your iPhone, follow these steps in Safari:",
    installAppDescriptionAndroid: "To install the app on your Android device, follow these steps in Chrome:",
    installAppIOSStep1: "Tap the 'Share' button",
    installAppIOSStep2: "Scroll down and tap 'Add to Home Screen'",
    installAppIOSStep3: "Tap 'Add' in the top corner",
    installAppAndroidStep1: "Tap the 'More' (three dots) button",
    installAppAndroidStep2: "Tap 'Install app'",
    // Admin Dashboard
    adminTitle: "Admin Dashboard",
    adminUsageStats: "Usage Statistics",
    adminApiStatus: "API Status",
    adminLanguage: "Language",
    adminTheme: "Theme",
    adminSavedDuas: "Saved Duas",
    adminBookmarks: "Bookmarks",
    adminGoals: "Goals",
    adminApiAvailable: "Available",
    adminApiUnavailable: "Not Configured",
    adminDeviceData: "Device Info",
    adminOS: "Operating System",
    adminBrowser: "Browser",
    adminClearData: "Clear Local Data",
    adminDataCleared: "Data Cleared",
    adminConfirmClear: "Are you sure? This will reset saved duas, goals, bookmarks, and settings.",
    adminFeatureUsage: "Feature Usage",
    adminApiLog: "API Performance Log",
    adminDynamicContent: "Dynamic Content Management",
    adminFeatureFlags: "Feature Flags",
    adminVerseOfTheDayOverride: "Verse of the Day Override",
    adminOverrideInstructions: "Enter a Surah and Ayah number to feature it on the home screen. Clear to resume random verses.",
    adminSurahNumber: "Surah Number",
    adminAyahNumber: "Ayah Number",
    adminSet: "Set",
    adminClear: "Clear",
    adminCurrentOverride: "Currently Overridden",
    adminNoOverride: "None (Random)",
    adminFeatureNewQuranUI: "Enable New Quran UI",
    adminFeatureDescNewQuranUI: "A preview of the redesigned Quran reading experience.",
    adminLogType: "Type",
    adminLogDuration: "Duration (ms)",
    adminLogStatus: "Status",
    adminLogTime: "Time",
    adminLogSuccess: "Success",
    adminLogFailed: "Failed",
    adminNoUsage: "No feature usage tracked yet.",
    adminNoApiLogs: "No API calls logged yet.",
    // General
    checkingConfig: "Checking configuration...",
    back: "Back",
    close: "Close",
  },
  ar: {
    welcomeTitle: "أهلاً بك في آية",
    welcomeDescription: "رفيقك للتأمل والنمو الروحي.",
    continueButton: "ابدأ الرحلة",
    qaAlQuran: "القرآن الكريم",
    qaDuaAssistant: "مساعد الدعاء",
    qaQibla: "بوصلة القبلة",
    qaTasbih: "المسبحة",
    qaAllFeatures: "كل الميزات",
    qaSettings: "الإعدادات",
    navPrayerTimes: "أوقات الصلاة",
    navMasjidFinder: "مكتشف المسجد",
    navAlQuran: "القرآن الكريم",
    navQibla: "القبلة",
    navCalendar: "التقويم",
    navTasbeeh: "المسبحة",
    nav5Pillars: "الأركان الخمسة",
    navDuas: "أدعية",
    navAboutUs: "حول التطبيق",
    navHome: "الرئيسية",
    navQuran: "القرآن",
    navAssistant: "المساعد",
    navPrayer: "الصلاة",
    navLive: "البث",
    navFiqh: "س & ج",
    navMore: "المزيد",
    navQuiz: "اختبار",
    navSettings: "الإعدادات",
    navAdmin: "المسؤول",
    homeNextPrayer: "الصلاة القادمة",
    homeNextPrayerIn: "بعد",
    homeDailyTimetable: "مواقيت اليوم",
    homeQuickActions: "إجراءات سريعة",
    greetingMorning: "السلام عليكم",
    greetingAfternoon: "السلام عليكم",
    greetingEvening: "السلام عليكم",
    homeSubGreeting: "ماذا تود أن تفعل اليوم؟",
    verseOfTheDayTitle: "آية اليوم",
    hadithOfTheDayTitle: "حديث اليوم",
    hadithReference: "المصدر",
    hadithNarrator: "الراوي",
    hadithExplanation: "شرح مختصر",
    homeCardDua: "المساعد الذكي",
    homeCardDuaDesc: "لإنشاء أدعية شخصية",
    homeCardQuran: "فهرس السور",
    homeCardQuranDesc: "تصفح القرآن الكريم",
    homeCardQuiz: "اختبر معلوماتك",
    homeCardQuizDesc: "اختبر معرفتك",
    homeCardSettings: "الإعدادات",
    homeCardSettingsDesc: "خصص تطبيقك",
    homeCardLive: "البث المباشر",
    homeCardLiveDesc: "إذاعات وقنوات تلفزيونية",
    homePrayerTimesWidgetTitle: "أوقات الصلاة اليوم",
    homePrayerTimesShow: "عرض أوقات الصلاة",
    homePrayerTimesNextPrayer: "الصلاة القادمة {prayerName} بعد",
    homePrayerTimesLoading: "جاري تحميل أوقات الصلاة...",
    homePrayerTimesLocationError: "تعذر جلب أوقات الصلاة. يرجى تفعيل خدمات الموقع.",
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
    modelOverloadedError: "نموذج الذكاء الاصطناعي مُحمل حاليًا. يرجى المحاولة مرة أخرى بعد لحظات.",
    promptError: "يرجى وصف ما تود الدعاء من أجله.",
    duaCardTransliteration: "النطق الصوتي",
    duaCardReference: "المرجع",
    sampleDuasTitle: "أدعية نموذجية",
    myDuasTitle: "أدعيتي المحفوظة",
    myDuasEmpty: "لم تقم بحفظ أي دعاء بعد.",
    duaSave: "حفظ الدعاء",
    duaUnsave: "إلغاء حفظ الدعاء",
    duaSaved: "تم الحفظ",
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
    bookmarkSurah: "حفظ السورة",
    unbookmarkSurah: "إزالة الحفظ",
    tafsirGenerating: "جاري إنشاء التفسير...",
    tafsirTitle: "تفسير الآية رقم {number}",
    getTafsir: "تفسير بالذكاء الاصطناعي",
    getTafsirTitle: "الحصول على تفسير بالذكاء الاصطناعي",
    shareAsImage: "مشاركة كصورة",
    generatingImage: "جاري إنشاء الصورة...",
    imageCopied: "تم نسخ الصورة إلى الحافظة!",
    shareError: "تعذرت مشاركة الصورة.",
    quranLoopAyah: "تكرار الآية",
    quranReadingPrefs: "خيارات القراءة",
    quranFontSize: "حجم الخط",
    quranLineHeight: "تباعد الأسطر",
    quranSearchByJuz: "تصفية بالجزء",
    juz: "الجزء",
    allJuz: "كل الأجزاء",
    imageCustomizationTitle: "تخصيص صورة الآية",
    ayahColor: "لون الآية",
    translationColor: "لون الترجمة",
    backgroundColor: "لون الخلفية",
    colorPresets: "ألوان جاهزة",
    generateAndShare: "إنشاء ومشاركة",
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
    memorizationHelperTitle: "مساعد التحفيظ",
    memorizationHelperTooltip: "تحفيظ هذه الآية",
    memorizationHelperIntro: "ركز على الآية، ثم حاول تذكرها من ذاكرتك.",
    memorizationShow: "إظهار",
    memorizationHide: "إخفاء",
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
    settingsReciter: "القارئ المفضل",
    themeLight: "فاتح",
    themeDark: "داكن",
    themeSystem: "النظام",
    settingsShareTitle: "شارك التطبيق",
    settingsShareButton: "مشاركة آية",
    settingsLinkCopied: "تم نسخ الرابط!",
    settingsInstallApp: "تثبيت التطبيق",
    settingsInstallButton: "تثبيت",
    settingsNotifications: "الإشعارات",
    notifEnable: "تفعيل الإشعارات",
    notifEnabled: "الإشعارات مفعلة",
    notifBlocked: "الإشعارات محظورة",
    notifBlockedHelp: "يرجى تفعيل الإشعارات لهذا الموقع من إعدادات المتصفح.",
    notifTitle: "تذكير من آية",
    notif5h: "هل أخذت لحظة للتأمل اليوم؟ تطبيق آية في انتظارك.",
    notif1d: "لا تفوّت آية اليوم. افتح تطبيق آية لجرعة روحانية.",
    notif2d: "رحلتك الروحانية مستمرة. عد إلى تطبيق آية لتصفح القرآن.",
    notif3d: "اشتقنا إليك! لقد مر وقت. لنجدد اتصالنا بإيمانك.",
    notif5d: "تذكير لطيف لتغذية روحك. رفيقك، تطبيق آية، هنا من أجلك.",
    notif7d: "الاستمرارية هي مفتاح الإيمان. لنعد إلى المسار الصحيح مع تطبيق آية.",
    notif10d: "هل مرت 10 أيام؟ أهدافك الروحانية بانتظارك. لنحققها معًا.",
    tasbihTitle: "المسبحة الإلكترونية",
    tasbihTarget: "الهدف: {count}",
    tasbihReset: "إعادة تعيين",
    tasbihCycleComplete: "اكتملت الدورة!",
    moreTitle: "ميزات إضافية",
    moreAllFeatures: "جميع الميزات الأخرى",
    morePrayerTimes: "مواقيت الصلاة",
    moreTasbih: "المسبحة الإلكترونية",
    moreAsmaulHusna: "أسماء الله الحسنى",
    moreQibla: "بوصلة القبلة",
    moreAdhkar: "أذكار الصباح والمساء",
    moreProphetStories: "قصص الأنبياء",
    moreZakatCalculator: "حاسبة الزكاة",
    moreFiqhQA: "أسئلة وأجوبة إسلامية",
    moreSahabaStories: "سير الصحابة",
    moreInheritance: "حاسبة الميراث",
    moreHajjGuide: "دليل الحج والعمرة",
    moreHalalTravel: "مساعد السفر الحلال",
    moreDreamInterpreter: "تفسير الأحلام",
    moreSalawatCounter: "عداد الصلوات",
    moreHadithSearch: "باحث الأحاديث",
    moreSpiritualGoals: "أهدافي الروحانية",
    moreLiveBroadcast: "البث المباشر",
    moreKhatmahTracker: "متتبع الختمة",
    moreSermonGenerator: "مولد الخطب بالذكاء الاصطناعي",
    moreIslamicHistory: "التاريخ الإسلامي",
    khatmahTrackerTitle: "متتبع الختمة",
    khatmahTrackerDesc: "حدد هدفك وتتبع تقدمك في قراءة القرآن.",
    khatmahSetupTitle: "ابدأ ختمتك",
    khatmahTargetDate: "حدد تاريخ الانتهاء المستهدف",
    khatmahStartButton: "ابدأ الختمة",
    khatmahProgressTitle: "تقدم ختمتك",
    khatmahPagesReadOf: "تمت قراءة {read} من {total} صفحة",
    khatmahDaysLeft: "تبقى {days} يوم",
    khatmahDailyGoal: "هدفك هو ~{pages} صفحة اليوم",
    khatmahLogToday: "سجل الصفحات المقروئة اليوم",
    khatmahLogPlaceholder: "مثال: 10",
    khatmahAddProgress: "إضافة تقدم",
    khatmahCompletedTitle: "ما شاء الله!",
    khatmahCompletedDesc: "لقد أتممت ختمتك بنجاح. تقبل الله منك.",
    khatmahStartNew: "ابدأ ختمة جديدة",
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
    qiblaTitle: "بوصلة القبلة",
    qiblaDescription: "اعثر على اتجاه الكعبة من موقعك الحالي.",
    qiblaFind: "تحديد القبلة",
    qiblaCalibrating: "جاري معايرة البوصلة...",
    qiblaCalibrationError: "تعذرت معايرة البوصلة. قد لا يحتوي جهازك على المستشعرات المطلوبة أو قد يكون الإذن محظورًا.",
    qiblaAllowMotion: "يرجى السماح بالوصول إلى مستشعر الحركة لاستخدام البوصلة.",
    qiblaAllowLocation: "يرجى السماح بالوصول إلى الموقع لتحديد اتجاه القبلة.",
    qiblaMotionDenied: "تم رفض الوصول إلى مستشعر الحركة. يرجى تفعيله في إعدادات المتصفح.",
    qiblaNorth: "ش",
    qiblaSouth: "ج",
    qiblaEast: "ق",
    qiblaWest: "غ",
    adhkarTitle: "الأذكار",
    adhkarDescription: "حصن يومك بذكر الله.",
    adhkarMorning: "الصباح",
    adhkarEvening: "المساء",
    adhkarVirtue: "الفضل",
    adhkarCount: "العدد",
    zakatTitle: "حاسبة الزكاة",
    zakatDescription: "احسب زكاة أموالك السنوية.",
    zakatTotalWealth: "إجمالي المدخرات/الثروة السنوية",
    zakatNisabInfo: "تجب الزكاة على الأموال التي حال عليها الحول وبلغت النصاب (ما يعادل قيمة 85 جرامًا من الذهب).",
    zakatCalculate: "احسب الزكاة",
    zakatAmount: "مبلغ الزكاة هو:",
    zakatError: "الرجاء إدخال رقم صحيح.",
    prophetStoriesTitle: "قصص الأنبياء",
    prophetStoriesDescription: "تعلم من سير الأنبياء.",
    prophetStoriesLoading: "جاري إنشاء القصة...",
    prophetStoriesLessons: "الدروس المستفادة",
    sahabaStoriesTitle: "سير الصحابة",
    sahabaStoriesDescription: "تعلم من صحابة النبي (ص).",
    sahabaStoriesLoading: "جاري إنشاء القصة...",
    sahabaStoriesLessons: "الدروس والفضائل",
    fiqhQATitle: "أسئلة وأجوبة إسلامية",
    fiqhQADescription: "اطرح أسئلة حول مواضيع إسلامية. ملاحظة: هذه ليست خدمة فتاوى.",
    fiqhQAPlaceholder: "مثال: ما هي نواقض الوضوء؟",
    fiqhQASubmit: "احصل على إجابة",
    fiqhQADisclaimer: "إخلاء مسؤولية: هذا الذكاء الاصطناعي هو لأغراض معلوماتية فقط وليس عالمًا مؤهلاً. استشر دائمًا عالمًا محليًا للحصول على أحكام دينية رسمية (فتوى).",
    inheritanceTitle: "حاسبة الميراث",
    inheritanceDescription: "احسب أنصبة الميراث وفقًا للشريعة الإسلامية.",
    inheritanceTotalEstate: "قيمة التركة الإجمالية",
    inheritanceHeirs: "حدد الورثة",
    inheritanceSpouse: "الزوج / الزوجة",
    inheritanceSons: "عدد الأبناء",
    inheritanceDaughters: "عدد البنات",
    inheritanceFather: "الأب",
    inheritanceMother: "الأم",
    inheritanceCalculate: "احسب الأنصبة",
    inheritanceResultTitle: "توزيع الميراث",
    inheritanceWarning: "هذه أداة تعليمية. استشر عالمًا مؤهلاً لقضايا الميراث الفعلية.",
    inheritanceHeir: "الوارث",
    inheritanceShare: "النصيب",
    inheritanceAmount: "المبلغ",
    hajjGuideTitle: "دليل الحج والعمرة",
    hajjGuideDescription: "دليل تفصيلي خطوة بخطوة لأداء المناسك المقدسة.",
    hajjGuideHajj: "الحج",
    hajjGuideUmrah: "العمرة",
    hajjGuideAsk: "اسأل سؤالاً عن الحج/العمرة",
    travelTitle: "مساعد السفر الحلال",
    travelDescription: "ابحث عن معلومات مناسبة للمسلمين في أي مدينة.",
    travelPlaceholder: "أدخل اسم مدينة، مثلاً: لندن",
    travelSubmit: "بحث",
    travelLoading: "نبحث عن أماكن حلال...",
    travelMosques: "المساجد وأماكن الصلاة",
    travelRestaurants: "مطاعم حلال",
    travelTips: "نصائح عامة",
    dreamTitle: "مفسر الأحلام",
    dreamDescription: "احصل على تفسير محتمل لرؤياك بناءً على المصادر الإسلامية.",
    dreamPlaceholder: "رأيت في المنام حصانًا أبيض...",
    dreamSubmit: "فسّر الحلم",
    dreamLoading: "جاري التفسير...",
    dreamDisclaimer: "إخلاء مسؤولية: تفسير الأحلام رمزي وليس حقيقة مطلقة. الغيب لا يعلمه إلا الله. هذا للتأمل فقط.",
    salawatTitle: "عداد الصلوات",
    salawatDescription: "أكثر من الصلاة على النبي محمد (ص).",
    salawatText: "اللهم صل على محمد وعلى آل محمد",
    hadithSearchTitle: "باحث الأحاديث",
    hadithSearchDescription: "ابحث عن أحاديث صحيحة حسب الموضوع.",
    hadithSearchPlaceholder: "مثال: الصدقة، الصلاة، الصيام",
    hadithSearchSubmit: "بحث",
    hadithSearchLoading: "جاري البحث عن أحاديث...",
    hadithSearchNoResults: "لم يتم العثور على أحاديث لهذا الموضوع.",
    goalsTitle: "أهدافي الروحانية",
    goalsDescription: "حدد وتتبع عاداتك الروحانية اليومية.",
    goalsAddPlaceholder: "مثال: قراءة سورة الملك",
    goalsAddButton: "إضافة هدف",
    goalsCompleted: "أُنجز لليوم!",
    goalsEmpty: "لم تقم بتحديد أي أهداف بعد. أضف هدفًا للبدء!",
    liveTitle: "البث المباشر",
    liveDescription: "استمع إلى إذاعات القرآن الكريم أو شاهد بثاً مباشراً من الحرمين الشريفين.",
    liveRadio: "الإذاعة",
    liveTv: "التلفاز",
    liveSearchPlaceholder: "ابحث عن إذاعة أو قناة...",
    liveLoadingStations: "جاري تحميل الإذاعات...",
    liveErrorStations: "تعذر تحميل الإذاعات. يرجى المحاولة لاحقاً.",
    liveWatchNow: "شاهد الآن",
    sermonGeneratorTitle: "مولد الخطب والدروس",
    sermonGeneratorDescription: "أدخل موضوعًا وسيقوم الذكاء الاصطناعي بإنشاء هيكل خطبة لك.",
    sermonGeneratorPlaceholder: "مثال: الصبر في الإسلام",
    sermonGeneratorSubmit: "إنشاء خطبة",
    sermonGeneratorLoading: "جاري إعداد الخطبة...",
    sermonIntro: "المقدمة",
    sermonPoints: "النقاط الرئيسية",
    sermonConclusion: "الخاتمة",
    sermonDua: "الدعاء",
    islamicHistoryTitle: "التاريخ الإسلامي التفاعلي",
    islamicHistoryDescription: "استكشف فترات وأحداث رئيسية في التاريخ الإسلامي.",
    islamicHistoryLoading: "جاري تحميل الملخص...",
    historySummary: "ملخص",
    historyKeyFigures: "شخصيات رئيسية",
    historyKeyEvents: "أحداث رئيسية",
    historySignificance: "الأهمية والدلالة",
    installAppTitle: "تثبيت تطبيق آية",
    installAppDescriptionIOS: "لتثبيت التطبيق على جهازك الآيفون، اتبع هذه الخطوات في متصفح سفاري:",
    installAppDescriptionAndroid: "لتثبيت التطبيق على جهازك الأندرويد، اتبع هذه الخطوات في متصفح كروم:",
    installAppIOSStep1: "اضغط على أيقونة 'المشاركة'",
    installAppIOSStep2: "مرر للأسفل واختر 'إضافة إلى الشاشة الرئيسية'",
    installAppIOSStep3: "اضغط على 'إضافة' في الزاوية العلوية",
    installAppAndroidStep1: "اضغط على زر 'المزيد' (ثلاث نقاط)",
    installAppAndroidStep2: "اضغط على 'تثبيت التطبيق'",
    adminTitle: "لوحة تحكم المسؤول",
    adminUsageStats: "إحصائيات الاستخدام",
    adminApiStatus: "حالة API",
    adminLanguage: "اللغة",
    adminTheme: "المظهر",
    adminSavedDuas: "الأدعية المحفوظة",
    adminBookmarks: "السور المحفوظة",
    adminGoals: "الأهداف",
    adminApiAvailable: "متوفر",
    adminApiUnavailable: "غير مهيأ",
    adminDeviceData: "معلومات الجهاز",
    adminOS: "نظام التشغيل",
    adminBrowser: "المتصفح",
    adminClearData: "مسح البيانات المحلية",
    adminDataCleared: "تم مسح البيانات",
    adminConfirmClear: "هل أنت متأكد؟ سيؤدي هذا إلى إعادة تعيين الأدعية والأهداف والإشارات المرجعية والإعدادات المحفوظة.",
    adminFeatureUsage: "استخدام الميزات",
    adminApiLog: "سجل أداء API",
    adminDynamicContent: "إدارة المحتوى الديناميكي",
    adminFeatureFlags: "أعلام الميزات",
    adminVerseOfTheDayOverride: "تجاوز آية اليوم",
    adminOverrideInstructions: "أدخل رقم سورة وآية لعرضها في الشاشة الرئيسية. امسح الحقول للعودة للآيات العشوائية.",
    adminSurahNumber: "رقم السورة",
    adminAyahNumber: "رقم الآية",
    adminSet: "تعيين",
    adminClear: "مسح",
    adminCurrentOverride: "التجاوز الحالي",
    adminNoOverride: "لا يوجد (عشوائي)",
    adminFeatureNewQuranUI: "تفعيل واجهة القرآن الجديدة",
    adminFeatureDescNewQuranUI: "معاينة للتصميم المحدث لتجربة قراءة القرآن.",
    adminLogType: "النوع",
    adminLogDuration: "المدة (مللي ثانية)",
    adminLogStatus: "الحالة",
    adminLogTime: "الوقت",
    adminLogSuccess: "نجاح",
    adminLogFailed: "فشل",
    adminNoUsage: "لم يتم تتبع استخدام أي ميزة بعد.",
    adminNoApiLogs: "لم يتم تسجيل أي استدعاءات API بعد.",
    checkingConfig: "جاري التحقق من الإعدادات...",
    back: "رجوع",
    close: "إغلاق",
  },
  fr: {
    welcomeTitle: "Bienvenue à AYA",
    welcomeDescription: "Votre compagnon pour la réflexion et la croissance spirituelle.",
    continueButton: "Commencer le voyage",
    qaAlQuran: "Al-Quran",
    qaDuaAssistant: "Assistant Dou'a",
    qaQibla: "Boussole Qibla",
    qaTasbih: "Compteur Tasbih",
    qaAllFeatures: "Fonctionnalités",
    qaSettings: "Paramètres",
    navPrayerTimes: "Horaires de Prière",
    navMasjidFinder: "Trouver une Mosquée",
    navAlQuran: "Al-Quran",
    navQibla: "Qibla",
    navCalendar: "Calendrier",
    navTasbeeh: "Tasbeeh",
    nav5Pillars: "5 Piliers",
    navDuas: "Dou'as",
    navAboutUs: "À propos",
    navHome: "Accueil",
    navQuran: "Coran",
    navAssistant: "Assistant",
    navPrayer: "Prière",
    navLive: "Direct",
    navFiqh: "Q&R",
    navMore: "Plus",
    navQuiz: "Quiz",
    navSettings: "Paramètres",
    navAdmin: "Admin",
    homeNextPrayer: "Prochaine Prière",
    homeNextPrayerIn: "dans",
    homeDailyTimetable: "Horaires du Jour",
    homeQuickActions: "Actions Rapides",
    greetingMorning: "As-salamu alaykum",
    greetingAfternoon: "As-salamu alaykum",
    greetingEvening: "As-salamu alaykum",
    homeSubGreeting: "Que souhaitez-vous faire aujourd'hui ?",
    verseOfTheDayTitle: "Verset du Jour",
    hadithOfTheDayTitle: "Hadith du Jour",
    hadithReference: "Référence",
    hadithNarrator: "Rapporté par",
    hadithExplanation: "Brève Explication",
    homeCardDua: "Assistant IA",
    homeCardDuaDesc: "Générez des dou'as personnelles",
    homeCardQuran: "Index des Sourates",
    homeCardQuranDesc: "Parcourez le Saint Coran",
    homeCardQuiz: "Quiz de Connaissances",
    homeCardQuizDesc: "Testez vos connaissances",
    homeCardSettings: "Paramètres",
    homeCardSettingsDesc: "Personnalisez votre application",
    homeCardLive: "Diffusion en direct",
    homeCardLiveDesc: "Streams Radio & TV",
    homePrayerTimesWidgetTitle: "Horaires de Prière du Jour",
    homePrayerTimesShow: "Afficher les horaires",
    homePrayerTimesNextPrayer: "Prochaine prière {prayerName} dans",
    homePrayerTimesLoading: "Chargement des horaires...",
    homePrayerTimesLocationError: "Impossible d'obtenir les horaires. Veuillez activer la localisation.",
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
    modelOverloadedError: "Le modèle d'IA est actuellement surchargé. Veuillez réessayer dans quelques instants.",
    promptError: "Veuillez décrire pourquoi vous souhaitez faire une dou'a.",
    duaCardTransliteration: "Translittération",
    duaCardReference: "Référence",
    sampleDuasTitle: "Exemples de Dou'as",
    myDuasTitle: "Mes Dou'as Sauvegardées",
    myDuasEmpty: "Vous n'avez pas encore sauvegardé de dou'as.",
    duaSave: "Sauvegarder la Dou'a",
    duaUnsave: "Retirer la Dou'a",
    duaSaved: "Enregistré",
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
    bookmarkSurah: "Mettre en favori",
    unbookmarkSurah: "Retirer des favoris",
    tafsirGenerating: "Génération de l'explication...",
    tafsirTitle: "Explication du Verset {number}",
    getTafsir: "Expliquer avec l'IA",
    getTafsirTitle: "Obtenir l'explication par l'IA",
    shareAsImage: "Partager comme image",
    generatingImage: "Génération de l'image...",
    imageCopied: "Image copiée dans le presse-papiers !",
    shareError: "Impossible de partager l'image.",
    quranLoopAyah: "Répéter le Verset",
    quranReadingPrefs: "Préférences de lecture",
    quranFontSize: "Taille de la police",
    quranLineHeight: "Interligne",
    quranSearchByJuz: "Filtrer par Juz'",
    juz: "Juz'",
    allJuz: "Tous les Juz'",
    imageCustomizationTitle: "Personnaliser l'image du verset",
    ayahColor: "Couleur du verset",
    translationColor: "Couleur de la traduction",
    backgroundColor: "Couleur de fond",
    colorPresets: "Palettes de couleurs",
    generateAndShare: "Générer et partager",
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
    memorizationHelperTitle: "Aide à la mémorisation",
    memorizationHelperTooltip: "Mémoriser ce verset",
    memorizationHelperIntro: "Concentrez-vous sur le verset, puis essayez de le rappeler de mémoire.",
    memorizationShow: "Afficher",
    memorizationHide: "Masquer",
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
    settingsReciter: "Récitateur Préféré",
    themeLight: "Clair",
    themeDark: "Sombre",
    themeSystem: "Système",
    settingsShareTitle: "Partager l'application",
    settingsShareButton: "Partager AYA",
    settingsLinkCopied: "Lien copié !",
    settingsInstallApp: "Installer l'App",
    settingsInstallButton: "Installer",
    settingsNotifications: "Notifications",
    notifEnable: "Activer les notifications",
    notifEnabled: "Notifications activées",
    notifBlocked: "Notifications bloquées",
    notifBlockedHelp: "Veuillez activer les notifications pour ce site dans les paramètres de votre navigateur.",
    notifTitle: "Rappel de AYA",
    notif5h: "Avez-vous pris un moment pour la réflexion aujourd'hui ? AYA vous attend.",
    notif1d: "Ne manquez pas le Verset du Jour. Ouvrez AYA pour un élan spirituel.",
    notif2d: "Votre voyage spirituel continue. Revenez sur AYA pour explorer le Coran.",
    notif3d: "Vous nous manquez ! Cela fait un moment. Reconnectons-nous avec votre foi.",
    notif5d: "Un doux rappel pour nourrir votre âme. Votre compagnon AYA est là pour vous.",
    notif7d: "La constance est la clé de la foi. Reprenons le bon chemin avec AYA.",
    notif10d: "Déjà 10 jours ? Vos objectifs spirituels vous attendent. Atteignons-les ensemble.",
    tasbihTitle: "Compteur Tasbih",
    tasbihTarget: "Objectif : {count}",
    tasbihReset: "Réinitialiser",
    tasbihCycleComplete: "Cycle terminé !",
    moreTitle: "Plus de fonctionnalités",
    moreAllFeatures: "Toutes les autres fonctionnalités",
    morePrayerTimes: "Horaires de Prière",
    moreTasbih: "Compteur Tasbih",
    moreAsmaulHusna: "Noms d'Allah",
    moreQibla: "Boussole Qibla",
    moreAdhkar: "Adhkar du Matin & Soir",
    moreProphetStories: "Histoires des Prophètes",
    moreZakatCalculator: "Calculateur de Zakat",
    moreFiqhQA: "Q&A Islamique",
    moreSahabaStories: "Vies des Compagnons",
    moreInheritance: "Calculateur d'Héritage",
    moreHajjGuide: "Guide Hajj & Omra",
    moreHalalTravel: "Assistant de Voyage Halal",
    moreDreamInterpreter: "Interprète de Rêves",
    moreSalawatCounter: "Compteur de Salawat",
    moreHadithSearch: "Recherche de Hadith",
    moreSpiritualGoals: "Objectifs Spirituels",
    moreLiveBroadcast: "Diffusion en direct",
    moreKhatmahTracker: "Suivi de Khatmah",
    moreSermonGenerator: "Générateur de Sermon IA",
    moreIslamicHistory: "Histoire Islamique",
    khatmahTrackerTitle: "Suivi de Khatmah",
    khatmahTrackerDesc: "Définissez votre objectif et suivez vos progrès de lecture du Coran.",
    khatmahSetupTitle: "Commencez votre Khatmah",
    khatmahTargetDate: "Définissez votre date d'achèvement cible",
    khatmahStartButton: "Commencer la Khatmah",
    khatmahProgressTitle: "Progression de la Khatmah",
    khatmahPagesReadOf: "{read} sur {total} pages lues",
    khatmahDaysLeft: "{days} jours restants",
    khatmahDailyGoal: "Votre objectif est d'environ {pages} pages aujourd'hui",
    khatmahLogToday: "Enregistrer les pages lues aujourd'hui",
    khatmahLogPlaceholder: "ex: 10",
    khatmahAddProgress: "Ajouter la progression",
    khatmahCompletedTitle: "Masha'Allah !",
    khatmahCompletedDesc: "Vous avez terminé votre Khatmah avec succès. Qu'Allah l'accepte de votre part.",
    khatmahStartNew: "Commencer une nouvelle Khatmah",
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
    qiblaTitle: "Boussole Qibla",
    qiblaDescription: "Trouvez la direction de la Kaaba depuis votre position actuelle.",
    qiblaFind: "Trouver la Qibla",
    qiblaCalibrating: "Calibrage de la boussole...",
    qiblaCalibrationError: "Impossible de calibrer la boussole. Votre appareil ne dispose peut-être pas des capteurs nécessaires ou l'autorisation est bloquée.",
    qiblaAllowMotion: "Veuillez autoriser l'accès au capteur de mouvement pour utiliser la boussole.",
    qiblaAllowLocation: "Veuillez autoriser l'accès à la localisation pour trouver la direction de la Qibla.",
    qiblaMotionDenied: "L'accès au capteur de mouvement a été refusé. Veuillez l'activer dans les paramètres de votre navigateur.",
    qiblaNorth: "N",
    qiblaSouth: "S",
    qiblaEast: "E",
    qiblaWest: "O",
    adhkarTitle: "Adhkar",
    adhkarDescription: "Fortifiez votre journée avec les rappels.",
    adhkarMorning: "Matin",
    adhkarEvening: "Soir",
    adhkarVirtue: "Mérite",
    adhkarCount: "Nombre",
    zakatTitle: "Calculateur de Zakat",
    zakatDescription: "Calculez votre Zakat annuelle sur la richesse.",
    zakatTotalWealth: "Épargne/Richesse annuelle totale",
    zakatNisabInfo: "La Zakat est due sur la richesse détenue pendant une année complète et dépassant le seuil du Nisab (équivalent à 85g d'or).",
    zakatCalculate: "Calculer la Zakat",
    zakatAmount: "Le montant de votre Zakat est :",
    zakatError: "Veuillez entrer un nombre valide.",
    prophetStoriesTitle: "Histoires des Prophètes",
    prophetStoriesDescription: "Apprenez de la vie des Prophètes.",
    prophetStoriesLoading: "Génération de l'histoire...",
    prophetStoriesLessons: "Leçons Clés",
    sahabaStoriesTitle: "Vies des Compagnons",
    sahabaStoriesDescription: "Apprenez des compagnons du Prophète (PSL).",
    sahabaStoriesLoading: "Génération de l'histoire...",
    sahabaStoriesLessons: "Leçons Clés & Vertus",
    fiqhQATitle: "Q&A Islamique",
    fiqhQADescription: "Posez des questions sur des sujets islamiques. Note : Ceci n'est pas un service de fatwa.",
    fiqhQAPlaceholder: "Ex: Quels sont les actes qui annulent les ablutions ?",
    fiqhQASubmit: "Obtenir une réponse",
    fiqhQADisclaimer: "Avertissement : Cette IA est à titre informatif uniquement et n'est pas un savant qualifié. Consultez toujours un savant local pour des décisions religieuses formelles (fatwa).",
    inheritanceTitle: "Calculateur d'Héritage",
    inheritanceDescription: "Calculez les parts d'héritage selon la loi islamique.",
    inheritanceTotalEstate: "Valeur Totale de la Succession",
    inheritanceHeirs: "Sélectionnez les héritiers",
    inheritanceSpouse: "Conjoint(e)",
    inheritanceSons: "Nombre de Fils",
    inheritanceDaughters: "Nombre de Filles",
    inheritanceFather: "Père",
    inheritanceMother: "Mère",
    inheritanceCalculate: "Calculer les Parts",
    inheritanceResultTitle: "Distribution de l'Héritage",
    inheritanceWarning: "Ceci est un outil éducatif. Consultez un savant qualifié pour les cas réels d'héritage.",
    inheritanceHeir: "Héritier",
    inheritanceShare: "Part",
    inheritanceAmount: "Montant",
    hajjGuideTitle: "Guide Hajj & Omra",
    hajjGuideDescription: "Un guide étape par étape pour accomplir les pèlerinages sacrés.",
    hajjGuideHajj: "Hajj",
    hajjGuideUmrah: "Omra",
    hajjGuideAsk: "Posez une question sur le Hajj/Omra",
    travelTitle: "Assistant de Voyage Halal",
    travelDescription: "Trouvez des informations halal pour n'importe quelle ville.",
    travelPlaceholder: "Entrez une ville, ex: Paris",
    travelSubmit: "Rechercher",
    travelLoading: "Recherche d'endroits halal...",
    travelMosques: "Mosquées et Lieux de Prière",
    travelRestaurants: "Restaurants Halal",
    travelTips: "Conseils Généraux",
    dreamTitle: "Interprète de Rêves",
    dreamDescription: "Obtenez une interprétation possible de votre rêve basée sur des sources islamiques.",
    dreamPlaceholder: "J'ai rêvé d'un cheval blanc...",
    dreamSubmit: "Interpréter le Rêve",
    dreamLoading: "Interprétation...",
    dreamDisclaimer: "Avertissement : Les interprétations de rêves sont symboliques et non une vérité définitive. Seul Allah connaît l'invisible. Ceci est pour la réflexion seulement.",
    salawatTitle: "Compteur de Salawat",
    salawatDescription: "Envoyez des bénédictions sur le Prophète Muhammad (PSL).",
    salawatText: "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
    hadithSearchTitle: "Recherche de Hadith",
    hadithSearchDescription: "Recherchez des hadiths authentiques par sujet.",
    hadithSearchPlaceholder: "ex: charité, prière, jeûne",
    hadithSearchSubmit: "Rechercher",
    hadithSearchLoading: "Recherche de hadiths...",
    hadithSearchNoResults: "Aucun hadith trouvé pour ce sujet.",
    goalsTitle: "Mes Objectifs Spirituels",
    goalsDescription: "Définissez et suivez vos habitudes spirituelles quotidiennes.",
    goalsAddPlaceholder: "ex: Lire la sourate Al-Mulk",
    goalsAddButton: "Ajouter un objectif",
    goalsCompleted: "Terminé pour aujourd'hui !",
    goalsEmpty: "Vous n'avez défini aucun objectif. Ajoutez-en un pour commencer !",
    liveTitle: "Diffusion en direct",
    liveDescription: "Écoutez les stations de radio du Coran ou regardez les chaînes en direct des Saintes Mosquées.",
    liveRadio: "Radio",
    liveTv: "Télé",
    liveSearchPlaceholder: "Rechercher une station ou une chaîne...",
    liveLoadingStations: "Chargement des stations...",
    liveErrorStations: "Impossible de charger les stations. Veuillez réessayer plus tard.",
    liveWatchNow: "Regarder maintenant",
    sermonGeneratorTitle: "Générateur de Sermons & Leçons",
    sermonGeneratorDescription: "Entrez un sujet et l'IA générera un plan de sermon pour vous.",
    sermonGeneratorPlaceholder: "ex: La patience en Islam",
    sermonGeneratorSubmit: "Générer le Plan",
    sermonGeneratorLoading: "Préparation de votre sermon...",
    sermonIntro: "Introduction",
    sermonPoints: "Points Clés",
    sermonConclusion: "Conclusion",
    sermonDua: "Supplication (Dou'a)",
    islamicHistoryTitle: "Histoire Islamique Interactive",
    islamicHistoryDescription: "Explorez les périodes et événements clés de l'histoire islamique.",
    islamicHistoryLoading: "Chargement du résumé...",
    historySummary: "Résumé",
    historyKeyFigures: "Personnages Clés",
    historyKeyEvents: "Événements Clés",
    historySignificance: "Signification",
    installAppTitle: "Installer l'app AYA",
    installAppDescriptionIOS: "Pour installer l'application sur votre iPhone, suivez ces étapes dans Safari :",
    installAppDescriptionAndroid: "Pour installer l'application sur votre appareil Android, suivez ces étapes dans Chrome :",
    installAppIOSStep1: "Appuyez sur le bouton 'Partager'",
    installAppIOSStep2: "Faites défiler et appuyez sur 'Sur l'écran d'accueil'",
    installAppIOSStep3: "Appuyez sur 'Ajouter' dans le coin supérieur",
    installAppAndroidStep1: "Appuyez sur le bouton 'Plus' (trois points)",
    installAppAndroidStep2: "Appuyez sur 'Installer l'application'",
    adminTitle: "Tableau de Bord Admin",
    adminUsageStats: "Statistiques d'Utilisation",
    adminApiStatus: "Statut de l'API",
    adminLanguage: "Langue",
    adminTheme: "Thème",
    adminSavedDuas: "Dou'as Sauvegardées",
    adminBookmarks: "Favoris",
    adminGoals: "Objectifs",
    adminApiAvailable: "Disponible",
    adminApiUnavailable: "Non Configuré",
    adminDeviceData: "Infos Appareil",
    adminOS: "Système d'exploitation",
    adminBrowser: "Navigateur",
    adminClearData: "Effacer les données locales",
    adminDataCleared: "Données effacées",
    adminConfirmClear: "Êtes-vous sûr ? Cela réinitialisera les dou'as, les objectifs, les favoris et les paramètres enregistrés.",
    adminFeatureUsage: "Utilisation des Fonctionnalités",
    adminApiLog: "Journal de Performance de l'API",
    adminDynamicContent: "Gestion de Contenu Dynamique",
    adminFeatureFlags: "Indicateurs de Fonctionnalités",
    adminVerseOfTheDayOverride: "Forcer le Verset du Jour",
    adminOverrideInstructions: "Entrez un numéro de Sourate et de Verset à afficher sur l'accueil. Videz pour reprendre les versets aléatoires.",
    adminSurahNumber: "Numéro de Sourate",
    adminAyahNumber: "Numéro de Verset",
    adminSet: "Définir",
    adminClear: "Effacer",
    adminCurrentOverride: "Actuellement forcé",
    adminNoOverride: "Aucun (Aléatoire)",
    adminFeatureNewQuranUI: "Activer la nouvelle IU du Coran",
    adminFeatureDescNewQuranUI: "Un aperçu de l'expérience de lecture du Coran repensée.",
    adminLogType: "Type",
    adminLogDuration: "Durée (ms)",
    adminLogStatus: "Statut",
    adminLogTime: "Heure",
    adminLogSuccess: "Succès",
    adminLogFailed: "Échec",
    adminNoUsage: "Aucune utilisation de fonctionnalité suivie.",
    adminNoApiLogs: "Aucun appel d'API enregistré.",
    checkingConfig: "Vérification de la configuration...",
    back: "Retour",
    close: "Fermer",
  }
};

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => localStorage.getItem('onboarding-complete') === 'true');
  
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('aya-lang') as Language;
    return ['en', 'ar', 'fr'].includes(savedLang) ? savedLang : 'ar';
  });
  
  const [reciter, setReciterState] = useState<Reciter>(() => {
    const savedReciterId = localStorage.getItem('aya-reciter');
    return recitersData.find(r => r.identifier === savedReciterId) || recitersData[0];
  });

  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('aya-theme') as Theme) || 'system');
  const [view, setView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const savedBookmarks = localStorage.getItem('aya-bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });
  const [savedDuas, setSavedDuas] = useState<Dua[]>(() => {
    const storedDuas = localStorage.getItem('aya-saved-duas');
    return storedDuas ? JSON.parse(storedDuas) : [];
  });
  const [goals, setGoals] = useState<SpiritualGoal[]>(() => {
    const storedGoals = localStorage.getItem('aya-goals');
    const parsedGoals = storedGoals ? JSON.parse(storedGoals) : [];
    // Reset daily completion status
    const today = new Date().toDateString();
    return parsedGoals.map((g: SpiritualGoal) => ({
      ...g,
      completed: g.lastCompleted === today,
    }));
  });
  const [initialMoreView, setInitialMoreView] = useState<string>('menu');
  const [notificationPermission, setNotificationPermissionState] = useState<NotificationPermission>(
    () => (typeof Notification !== 'undefined' ? Notification.permission : 'default')
  );
  const [featureFlags, setFeatureFlagsState] = useState<{ [key: string]: boolean }>(() => {
    const storedFlags = localStorage.getItem('aya-feature-flags');
    return storedFlags ? JSON.parse(storedFlags) : {};
  });
  const [quranSettings, setQuranSettingsState] = useState<QuranSettings>(() => {
    const storedSettings = localStorage.getItem('aya-quran-settings');
    return storedSettings ? JSON.parse(storedSettings) : { fontSize: 1.8, lineHeight: 2.8 };
  });
  const [khatmah, setKhatmahState] = useState<Khatmah | null>(() => {
    const storedKhatmah = localStorage.getItem('aya-khatmah');
    return storedKhatmah ? JSON.parse(storedKhatmah) : null;
  });

  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  };

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
  
  useEffect(() => {
    localStorage.setItem('aya-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  useEffect(() => {
    localStorage.setItem('aya-saved-duas', JSON.stringify(savedDuas));
  }, [savedDuas]);

  useEffect(() => {
    localStorage.setItem('aya-goals', JSON.stringify(goals.map(({ id, text, lastCompleted }) => ({ id, text, lastCompleted }))));
  }, [goals]);

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (typeof Notification === 'undefined' || !navigator.serviceWorker.controller) {
            return;
        }

        if (document.visibilityState === 'hidden' && notificationPermission === 'granted') {
            const schedule = [
                { delay: 5 * 3600 * 1000, key: 'notif5h' },
                { delay: 1 * 24 * 3600 * 1000, key: 'notif1d' },
                { delay: 2 * 24 * 3600 * 1000, key: 'notif2d' },
                { delay: 3 * 24 * 3600 * 1000, key: 'notif3d' },
                { delay: 5 * 24 * 3600 * 1000, key: 'notif5d' },
                { delay: 7 * 24 * 3600 * 1000, key: 'notif7d' },
                { delay: 10 * 24 * 3600 * 1000, key: 'notif10d' },
            ];

            const notifications = schedule.map(item => ({
                delay: item.delay,
                title: t('notifTitle'),
                body: t(item.key)
            }));

            navigator.serviceWorker.controller.postMessage({
                command: 'schedule-notifications',
                notifications,
            });
        } else {
            navigator.serviceWorker.controller.postMessage({ command: 'cancel-notifications' });
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [notificationPermission, language, t]);

  const addBookmark = (surahNumber: number) => {
    if (!bookmarks.includes(surahNumber)) {
        setBookmarks([...bookmarks, surahNumber]);
    }
  };

  const removeBookmark = (surahNumber: number) => {
    setBookmarks(bookmarks.filter(b => b !== surahNumber));
  };

  const addSavedDua = (dua: Dua) => {
    if (dua.id && !savedDuas.some(d => d.id === dua.id)) {
      setSavedDuas(prev => [dua, ...prev]);
    }
  };

  const removeSavedDua = (duaId: string) => {
      setSavedDuas(prev => prev.filter(d => d.id !== duaId));
  };

  const addGoal = (text: string) => {
    const newGoal: SpiritualGoal = {
      id: new Date().toISOString(),
      text,
      completed: false,
      lastCompleted: null,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (goalId: string, completed: boolean) => {
    setGoals(prev => prev.map(g => g.id === goalId ? {
      ...g,
      completed,
      lastCompleted: completed ? new Date().toDateString() : g.lastCompleted
    } : g));
  };

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };


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

  const setNotificationPermission = (permission: NotificationPermission) => {
    setNotificationPermissionState(permission);
  };
  
  const setFeatureFlag = (flag: string, value: boolean) => {
    const newFlags = { ...featureFlags, [flag]: value };
    setFeatureFlagsState(newFlags);
    localStorage.setItem('aya-feature-flags', JSON.stringify(newFlags));
  };

  const setQuranSettings = (settings: QuranSettings) => {
    setQuranSettingsState(settings);
    localStorage.setItem('aya-quran-settings', JSON.stringify(settings));
  };

  const startKhatmah = (targetDate: string) => {
    const newKhatmah: Khatmah = {
      startDate: new Date().toISOString(),
      targetDate,
      pagesRead: 0,
    };
    setKhatmahState(newKhatmah);
    localStorage.setItem('aya-khatmah', JSON.stringify(newKhatmah));
  };

  const updateKhatmahProgress = (pages: number) => {
    if (khatmah) {
      const newPagesRead = Math.min(604, khatmah.pagesRead + pages);
      const updatedKhatmah = { ...khatmah, pagesRead: newPagesRead };
      setKhatmahState(updatedKhatmah);
      localStorage.setItem('aya-khatmah', JSON.stringify(updatedKhatmah));
    }
  };

  const resetKhatmah = () => {
    setKhatmahState(null);
    localStorage.removeItem('aya-khatmah');
  };

  useEffect(() => {
    if (view !== 'quran' && selectedSurah !== null) {
      setSelectedSurah(null);
    }
  }, [view, selectedSurah]);

  useEffect(() => {
    // Force dark theme based on new design
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

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
    bookmarks,
    addBookmark,
    removeBookmark,
    savedDuas,
    addSavedDua,
    removeSavedDua,
    goals,
    addGoal,
    updateGoal,
    removeGoal,
    initialMoreView,
    setInitialMoreView,
    notificationPermission,
    setNotificationPermission,
    featureFlags,
    setFeatureFlag,
    quranSettings,
    setQuranSettings,
    khatmah,
    startKhatmah,
    updateKhatmahProgress,
    resetKhatmah,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { view, selectedSurah, isOnboardingComplete, language, setView } = useContext(LanguageContext) as LanguageContextType;

  if (!isOnboardingComplete) {
    return <Onboarding />;
  }

  const renderView = () => {
    if (view === 'quran' && selectedSurah) {
        return <SurahDetail key={`surah-${selectedSurah}`} surahNumber={selectedSurah} />;
    }
    switch (view) {
        case 'home': return <Home key="home" />;
        case 'fiqh': return <FiqhQA key="fiqh" />;
        case 'assistant': return <Assistant key="assistant" />;
        case 'quran': return <Quran key="quran" />;
        case 'live': return <LiveBroadcast key="live" />;
        case 'more': return <More key="more" />;
        default: return <Home key="home" />;
    }
  };
  
  const fontClass = language === 'ar' ? 'font-amiri' : 'font-inter';

  return (
     <div className={`flex flex-col min-h-[100dvh] ${fontClass}`}>
      <main className="flex-grow w-full px-4 pt-6 pb-8 flex flex-col items-center relative">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;
