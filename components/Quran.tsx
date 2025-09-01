
import React, { useState, useMemo, useContext } from 'react';
import type { LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const Quran: React.FC = () => {
    const { t, language, setSelectedSurah, surahs } = useContext(LanguageContext) as LanguageContextType;
    const [searchTerm, setSearchTerm] = useState('');
    
    const isLoading = surahs.length === 0;

    const filteredSurahs = useMemo(() => {
        if (!searchTerm) {
            return surahs;
        }
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
            <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-2">{t('quranTitle')}</h2>
            <p className="text-md text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
                {t('quranDescription')}
            </p>

            <div className="mb-6 sticky top-4 z-10">
                <input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border border-[var(--border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                    aria-label={t('searchPlaceholder')}
                />
            </div>

            {isLoading && <LoadingIndicator message={t('loadingMessage')} />}
            {!isLoading && surahs.length === 0 && <ErrorMessage message="Failed to load Surah list. Please check your connection." />}

            <div className="space-y-3">
                {!isLoading && filteredSurahs.map(surah => (
                    <button 
                        key={surah.number} 
                        onClick={() => setSelectedSurah(surah.number)} 
                        className="w-full text-left bg-[var(--bg-secondary)] rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg hover:border-[var(--accent-primary)] border border-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] group"
                    >
                        <div className="flex items-center">
                            <span className="text-lg font-bold text-[var(--accent-primary)] w-10 h-10 flex items-center justify-center bg-teal-500/10 rounded-full transition-colors duration-300 group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-text)]">{surah.number}</span>
                            <div className={`mx-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <p className={`font-bold text-md text-[var(--text-primary)] ${language === 'ar' ? 'font-amiri' : ''}`}>{language === 'ar' ? surah.name : surah.englishName}</p>
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