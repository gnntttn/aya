
import React, { useState, useMemo, useContext } from 'react';
import type { LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import ErrorMessage from './common/ErrorMessage';
import LoadingIndicator from './common/LoadingIndicator';

const Quran: React.FC = () => {
    const { t, language, setSelectedSurah, surahs } = useContext(LanguageContext) as LanguageContextType;
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
                                    <path d="M50 0L61.226 21.434L85.355 25.004L69.341 42.19L71.696 66.212L50 55.45L28.304 66.212L30.659 42.19L14.645 25.004L38.774 21.434L50 0Z" fill="currentColor"/>
                                </svg>
                                <span className="z-10 text-[var(--accent-text)]">{surah.number}</span>
                            </div>
                            <div className={`mx-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <p className={`font-semibold text-md text-[var(--text-primary)] ${language === 'ar' ? 'font-amiri' : ''}`}>{language === 'ar' ? surah.name : surah.englishName}</p>
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