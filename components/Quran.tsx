import React, { useState, useMemo, useContext } from 'react';
import type { LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';
import { juzData } from '../data/juzData';

const Quran: React.FC = () => {
    const { t, language, setSelectedSurah, surahs, bookmarks } = useContext(LanguageContext) as LanguageContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
    
    const isLoading = surahs.length === 0;

    const filteredSurahs = useMemo(() => {
        let surahsToFilter = [...surahs];

        // Filter by Juz'
        if (selectedJuz !== null && juzData[selectedJuz - 1]) {
            const startSurahNum = juzData[selectedJuz - 1].surah;
            const endSurahNum = juzData[selectedJuz] ? juzData[selectedJuz].surah : 115; // Use 115 to include surah 114

            surahsToFilter = surahs.filter(s => {
                // Find all surahs that start within the range of this Juz.
                // This is an approximation but works well for a list filter.
                const nextJuz = juzData.find(j => j.juz > s.number);
                let startJuzForSurah = 1;
                if (nextJuz) {
                    const prevJuz = juzData[nextJuz.juz - 2];
                    if (prevJuz.surah > s.number) {
                        // This logic is complex, find a surah's starting juz.
                    }
                }
                
                // Simplified logic: Show all surahs from the start of the selected juz
                // up to the start of the next juz.
                const surahIsInJuzRange = s.number >= startSurahNum && s.number < endSurahNum;

                // Handle the last Juz (30) which includes surahs until the end.
                const isLastJuz = selectedJuz === 30;
                
                if (isLastJuz) {
                    return s.number >= startSurahNum;
                }
                
                // Include the starting surah of the next Juz if it contains ayahs from the current Juz
                if (s.number === startSurahNum && juzData[selectedJuz-1].ayah > 1) {
                    return true;
                }

                return surahIsInJuzRange;
            });
        }
        
        // Then filter by search term
        if (!searchTerm) return surahsToFilter;

        const lowercasedTerm = searchTerm.toLowerCase();
        return surahsToFilter.filter(surah => 
            surah.name.toLowerCase().includes(lowercasedTerm) ||
            surah.englishName.toLowerCase().includes(lowercasedTerm) ||
            surah.englishNameTranslation.toLowerCase().includes(lowercasedTerm) ||
            String(surah.number).includes(lowercasedTerm)
        );
    }, [searchTerm, surahs, selectedJuz]);

    return (
        <div className="w-full text-center animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('quranTitle')}</h2>
            <p className="text-md text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                {t('quranDescription')}
            </p>

            <div className="mb-6 sticky top-4 z-10 space-y-3">
                <input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-sm"
                    aria-label={t('searchPlaceholder')}
                />
                 <div className="select-with-chevron">
                    <select
                        value={selectedJuz ?? ''}
                        onChange={(e) => setSelectedJuz(e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-sm"
                        aria-label={t('quranSearchByJuz')}
                    >
                        <option value="">{t('allJuz')}</option>
                        {juzData.map(j => (
                            <option key={j.juz} value={j.juz}>{t('juz')} {j.juz} ({j.name})</option>
                        ))}
                    </select>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
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
