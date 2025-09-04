
import React, { useState, useMemo, useContext } from 'react';
import type { LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const Quran: React.FC = () => {
    const { t, language, setSelectedSurah, surahs, bookmarks } = useContext(LanguageContext) as LanguageContextType;
    const [searchTerm, setSearchTerm] = useState('');
    
    const isLoading = surahs.length === 0;

    const filteredSurahs = useMemo(() => {
        if (!searchTerm) return surahs;
        const lowercasedTerm = searchTerm.toLowerCase();
        return surahs.filter(surah => 
            surah.name.toLowerCase().includes(lowercasedTerm) ||
            surah.englishName.toLowerCase().includes(lowercasedTerm) ||
            surah.englishNameTranslation.toLowerCase().includes(lowercasedTerm) ||
            String(surah.number).includes(lowercasedTerm)
        );
    }, [searchTerm, surahs]);

    return (
        <div className="w-full text-center animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('quranTitle')}</h2>
            <p className="text-md text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                {t('quranDescription')}
            </p>

            <div className="mb-6 sticky top-4 z-10">
                <input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-sm"
                    aria-label={t('searchPlaceholder')}
                />
            </div>

            {isLoading && <LoadingIndicator message={t('loadingMessage')} />}
            {!isLoading && surahs.length === 0 && <ErrorMessage message="Failed to load Surah list." />}

            <div className="space-y-3">
                {!isLoading && filteredSurahs.map(surah => (
                    <button 
                        key={surah.number} 
                        onClick={() => setSelectedSurah(surah.number)} 
                        className="w-full text-left glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group"
                    >
                        <div className="flex items-center">
                            <div className="relative w-12 h-12 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                                <svg className="absolute w-full h-full opacity-40 group-hover:opacity-80 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M86.6 50L75 67.5L50 75L25 67.5L13.4 50L25 32.5L50 25L75 32.5L86.6 50Z M75 50L68.75 62.5L50 68.75L31.25 62.5L25 50L31.25 37.5L50 31.25L68.75 37.5L75 50Z" fill="currentColor"/>
                                </svg>
                                <span className="z-10 text-[var(--accent-text)]">{surah.number}</span>
                            </div>
                            <div className={`mx-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <div className="flex items-center gap-2">
                                    <p className={`font-semibold text-md text-[var(--text-primary)] ${language === 'ar' ? 'font-amiri' : ''}`}>{language === 'ar' ? surah.name : surah.englishName}</p>
                                    {bookmarks.includes(surah.number) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">{language === 'ar' ? surah.englishNameTranslation : surah.name}</p>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                             <p className="text-sm text-[var(--text-primary)] font-semibold">{surah.numberOfAyahs} {t('ayahs')}</p>
                             <p className="text-xs text-[var(--text-secondary)] capitalize">{surah.revelationType}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Quran;