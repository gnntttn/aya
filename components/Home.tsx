
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, Surah } from '../types';
import { getAyahDetail } from '../services/quranService';
import { dhikrData } from '../data/dhikrData';

const Home: React.FC = () => {
    const { t, language, surahs } = useContext(LanguageContext) as LanguageContextType;
    const [greeting, setGreeting] = useState('');
    const [streak, setStreak] = useState(1);
    const [verse, setVerse] = useState<Ayah | null>(null);
    const [isVerseLoading, setIsVerseLoading] = useState(true);
    const [currentDhikr, setCurrentDhikr] = useState('');

    // Set Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting(t('greetingMorning'));
        } else if (hour < 18) {
            setGreeting(t('greetingAfternoon'));
        } else {
            setGreeting(t('greetingEvening'));
        }
    }, [t]);
    
    // Calculate Streak
    useEffect(() => {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('aya-last-visit');
        const currentStreak = parseInt(localStorage.getItem('aya-streak') || '1', 10);

        if (lastVisit === today) {
            setStreak(currentStreak);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                const newStreak = currentStreak + 1;
                setStreak(newStreak);
                localStorage.setItem('aya-streak', String(newStreak));
            } else {
                setStreak(1);
                localStorage.setItem('aya-streak', '1');
            }
            localStorage.setItem('aya-last-visit', today);
        }
    }, []);

    // Fetch Random Verse of the Day
    useEffect(() => {
        const fetchRandomVerse = async () => {
            if (surahs.length === 0) return;
            setIsVerseLoading(true);
            try {
                // Pick a random surah
                const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
                // Pick a random ayah from that surah
                const randomAyahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
                
                const ayahDetail = await getAyahDetail(randomSurah.number, randomAyahNumber, language);
                setVerse(ayahDetail);

            } catch (err) {
                 console.error("Failed to fetch verse of the day:", err);
            } finally {
                setIsVerseLoading(false);
            }
        }
        fetchRandomVerse();
    }, [language, surahs]);
    
    const selectNewDhikr = useCallback(() => {
        const dhikrList = dhikrData[language];
        const randomIndex = Math.floor(Math.random() * dhikrList.length);
        setCurrentDhikr(dhikrList[randomIndex]);
    }, [language]);

    useEffect(() => {
        selectNewDhikr();
    }, [language, selectNewDhikr]);


    return (
        <div className="w-full space-y-4 text-[var(--text-primary)] stagger-in">
            {/* Top Row */}
            <div className="grid grid-cols-2 gap-4" style={{ animationDelay: '100ms' }}>
                {/* Streak Card */}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl flex flex-col items-start justify-center shadow-lg border border-[var(--border-color)]">
                    <span className="text-4xl font-bold text-[var(--accent-primary)]">{streak}</span>
                    <span className="text-sm text-[var(--text-secondary)]">{t('streakTitle')}</span>
                </div>
                {/* Greeting Card */}
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl flex flex-col items-end justify-center text-right shadow-lg border border-[var(--border-color)]">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {greeting}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--accent-primary)]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">{t('homeSubGreeting')}</p>
                </div>
            </div>

            {/* Verse Card */}
            <div className="bg-[var(--bg-secondary)] p-5 rounded-xl shadow-lg border border-[var(--border-color)]" style={{ animationDelay: '200ms' }}>
                <div className="flex justify-between items-center mb-3 text-[var(--accent-primary)]">
                    <h3 className="font-semibold">{t('verseOfTheDayTitle')}</h3>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
                     </svg>
                </div>
                {isVerseLoading ? (
                     <div className="text-center text-sm text-[var(--text-secondary)] py-4">Loading verse...</div>
                ) : verse ? (
                    <div className="text-center font-amiri">
                        <p dir="rtl" className="text-xl leading-relaxed text-right">{verse.text}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-2">({verse.surah?.name}: {verse.numberInSurah})</p>
                    </div>
                ) : (
                    <div className="text-center text-sm text-red-400 py-4">Could not load verse.</div>
                )}
            </div>

            {/* Dhikr Card */}
            <div className="bg-[var(--bg-secondary)] p-5 rounded-xl shadow-lg border border-[var(--border-color)]" style={{ animationDelay: '300ms' }}>
                 <div className="flex justify-between items-center mb-4 text-[var(--accent-primary)]">
                    <button onClick={selectNewDhikr} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)]" aria-label="New Dhikr">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10.707 9.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 15H9a1 1 0 010-2h3.586l-1.293-1.293a1 1 0 011.414-1.414l3 3z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <h3 className="font-semibold">{t('dhikrOfTheDayTitle')}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </div>
                <p className={`text-center text-2xl font-bold font-amiri ${language === 'ar' ? 'tracking-normal' : 'tracking-wide'}`}>
                    {currentDhikr}
                </p>
            </div>
        </div>
    );
};

export default Home;
