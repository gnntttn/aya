
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, View } from '../types';
import { getAyahDetail } from '../services/quranService';

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
                    <div onClick={navigateToSurah} className="cursor-pointer group">
                        <p dir="rtl" className="font-amiri text-2xl leading-relaxed text-right text-[var(--text-primary)]">{verse.text}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 font-medium group-hover:text-[var(--accent-primary)] transition-colors">({verse.surah?.name}: {verse.numberInSurah})</p>
                    </div>
                ) : (
                    <div className="h-24 flex items-center justify-center text-sm text-red-400">Could not load verse.</div>
                )}
            </div>
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
        quiz: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    }

    return (
        <div className="w-full space-y-6 animate-fade-in stagger-in">
            <header style={{ animationDelay: '0ms' }}>
                <h1 className="font-lora text-3xl font-bold text-[var(--text-primary)]">{t('greetingMorning')}</h1>
                <p className="text-[var(--text-secondary)] mt-1">{t('homeSubGreeting')}</p>
            </header>

            <VerseOfTheDay />
            
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-48" style={{ animationDelay: '200ms' }}>
                <HomeNavCard view="dua" title={t('homeCardDua')} description={t('homeCardDuaDesc')} icon={cardIcons.dua} delay="250ms" />
                <HomeNavCard view="quran" title={t('homeCardQuran')} description={t('homeCardQuranDesc')} icon={cardIcons.quran} delay="300ms" />
                <HomeNavCard view="quiz" title={t('homeCardQuiz')} description={t('homeCardQuizDesc')} icon={cardIcons.quiz} delay="350ms" />
                <HomeNavCard view="settings" title={t('homeCardSettings')} description={t('homeCardSettingsDesc')} icon={cardIcons.settings} delay="400ms" />
            </div>
        </div>
    );
};

export default Home;
