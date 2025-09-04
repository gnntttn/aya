
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, View, Hadith } from '../types';
import { getAyahDetail } from '../services/quranService';
import { getHadithOfTheDay } from '../services/geminiService';
import SpiritualReflection from './SpiritualReflection';
import IslamicCalendar from './IslamicCalendar';

const VerseOfTheDay: React.FC = () => {
    const { t, language, surahs, setSelectedSurah, setView } = useContext(LanguageContext) as LanguageContextType;
    const [verse, setVerse] = useState<Ayah | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRandomVerse = useCallback(async () => {
        if (surahs.length === 0) return;
        setIsLoading(true);
        try {
            const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
            const randomAyahNumber = Math.floor(Math.random() * randomSurah.numberOfAyahs) + 1;
            const ayahDetail = await getAyahDetail(randomSurah.number, randomAyahNumber, language);
            setVerse(ayahDetail);
        } catch (err) {
            console.error("Failed to fetch verse of the day:", err);
            setVerse(null);
        } finally {
            setIsLoading(false);
        }
    }, [language, surahs]);

    useEffect(() => {
        fetchRandomVerse();
    }, [fetchRandomVerse]);
    
    const navigateToSurah = () => {
        if(verse && verse.surah) {
            setSelectedSurah(verse.surah.number);
            setView('quran');
        }
    }

    return (
        <div className="w-full p-5 text-center glass-card relative overflow-hidden" style={{ animationDelay: '100ms' }}>
            <div 
                className="absolute inset-0 bg-no-repeat bg-cover opacity-5 dark:opacity-10" 
                style={{backgroundImage: "url('/geometric_bg.svg')"}}>
            </div>
            <div className="relative z-10">
                <h3 className="font-lora font-semibold text-lg text-[var(--text-primary)] mb-3">{t('verseOfTheDayTitle')}</h3>
                {isLoading ? (
                    <div className="h-24 flex items-center justify-center text-sm text-[var(--text-secondary)]">Loading...</div>
                ) : verse ? (
                    <div onClick={navigateToSurah} className="cursor-pointer group relative pt-4">
                         <div className="absolute top-0 right-0 text-3xl text-[var(--accent-primary)] opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M9.983 3v7.391c0 2.9-2.35 5.25-5.25 5.25a5.25 5.25 0 0 1-5.25-5.25C-.517 7.391 1.833 5 4.733 5c1.423 0 2.733.575 3.733 1.525V3h1.517zM21.483 3v7.391c0 2.9-2.35 5.25-5.25 5.25a5.25 5.25 0 0 1-5.25-5.25C10.983 7.391 13.333 5 16.233 5c1.423 0 2.733.575 3.733 1.525V3h1.517z"></path></svg>
                        </div>
                        <p dir="rtl" className="font-amiri text-2xl leading-relaxed text-right text-[var(--text-primary)]">{verse.text}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium group-hover:text-[var(--accent-primary)] transition-colors text-right">({verse.surah?.name}: {verse.numberInSurah})</p>
                    </div>
                ) : (
                    <div className="h-24 flex items-center justify-center text-sm text-red-400">Could not load verse.</div>
                )}
            </div>
        </div>
    );
};

const HadithOfTheDay: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [hadith, setHadith] = useState<Hadith | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHadith = async () => {
            setIsLoading(true);
            try {
                const hadithData = await getHadithOfTheDay(language);
                setHadith(hadithData);
            } catch (err) {
                console.error("Failed to fetch Hadith of the day:", err);
                setHadith(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHadith();
    }, [language]);

    return (
        <div className="w-full p-5 text-left glass-card" style={{ animationDelay: '150ms' }}>
            <h3 className="font-lora font-semibold text-lg text-center text-[var(--text-primary)] mb-3">{t('hadithOfTheDayTitle')}</h3>
            {isLoading ? (
                <div className="h-32 flex items-center justify-center text-sm text-[var(--text-secondary)]">Loading...</div>
            ) : hadith ? (
                <div className="space-y-3">
                    <p className={`text-lg text-[var(--text-primary)] leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>"{hadith.hadithText}"</p>
                    <div className="text-xs text-[var(--text-secondary)] font-medium">
                        <p>{t('hadithNarrator')}: {hadith.narrator}</p>
                        <p>{t('hadithReference')}: {hadith.reference}</p>
                    </div>
                     <div className="pt-2 mt-2 border-t border-[var(--border-color)]">
                        <h4 className="font-semibold text-xs text-[var(--accent-primary)] uppercase tracking-wider">{t('hadithExplanation')}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{hadith.briefExplanation}</p>
                    </div>
                </div>
            ) : (
                <div className="h-32 flex items-center justify-center text-sm text-red-400">Could not load Hadith.</div>
            )}
        </div>
    );
};


const HomeNavCard: React.FC<{
    view: View;
    title: string;
    description: string;
    icon: JSX.Element;
    delay: string;
}> = ({ view, title, description, icon, delay }) => {
    const { setView } = useContext(LanguageContext) as LanguageContextType;
    return (
        <button 
            onClick={() => setView(view)} 
            className="glass-card p-4 flex flex-col items-start justify-between text-left group w-full h-full"
            style={{ animationDelay: delay }}
        >
            <div>
                <div className="mb-2 text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <h4 className="font-lora font-bold text-md text-[var(--text-primary)]">{title}</h4>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{description}</p>
        </button>
    );
};

const Home: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    
    const cardIcons = {
        dua: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        quran: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    }

    return (
        <div className="w-full space-y-6 animate-fade-in stagger-in">
            <header style={{ animationDelay: '0ms' }}>
                <h1 className="font-lora text-3xl font-bold text-[var(--text-primary)]">{t('greetingMorning')}</h1>
                <p className="text-[var(--text-secondary)] mt-1">{t('homeSubGreeting')}</p>
            </header>
            
            <IslamicCalendar />

            <SpiritualReflection />

            <VerseOfTheDay />
            
            <HadithOfTheDay />
            
            <div className="grid grid-cols-2 gap-4 h-24" style={{ animationDelay: '200ms' }}>
                <HomeNavCard view="dua" title={t('homeCardDua')} description={t('homeCardDuaDesc')} icon={cardIcons.dua} delay="250ms" />
                <HomeNavCard view="quran" title={t('homeCardQuran')} description={t('homeCardQuranDesc')} icon={cardIcons.quran} delay="300ms" />
            </div>
        </div>
    );
};

export default Home;
