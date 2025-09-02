
import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SurahDetailData, Ayah } from '../types';
import { getSurahDetail } from '../services/quranService';
import ErrorMessage from './common/ErrorMessage';
import LoadingIndicator from './common/LoadingIndicator';
import ReciterSelector from './ReciterSelector';

interface SurahDetailProps {
  surahNumber: number;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber }) => {
    const { t, language, setSelectedSurah, surahs, reciter } = useContext(LanguageContext) as LanguageContextType;
    const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);
                setSurahData(null); 
                const data = await getSurahDetail(surahNumber, reciter.identifier);
                setSurahData(data);
            } catch (err) {
                setError("Failed to load Surah details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
        return () => {
            if (audioRef.current) audioRef.current.pause();
        }
    }, [surahNumber, reciter.identifier]);
    
    const playAyah = (ayah: Ayah) => {
        if (audioRef.current && ayah.audio) {
            if (currentPlayingAyah === ayah.number && isPlaying) {
                audioRef.current.pause();
            } else {
                setCurrentPlayingAyah(ayah.number);
                audioRef.current.src = ayah.audio;
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    };

    const handleAudioEnd = () => {
       setCurrentPlayingAyah(null);
    };

    if (isLoading) return <div className="pt-20"><LoadingIndicator message={t('loadingSurah')} /></div>;
    if (error || !surahData) return <ErrorMessage message={error || "Could not load Surah data."} />;
    
    const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

    const currentSurahIndex = surahs.findIndex(s => s.number === surahData.number);
    const prevSurah = currentSurahIndex > 0 ? surahs[currentSurahIndex - 1] : null;
    const nextSurah = currentSurahIndex < surahs.length - 1 ? surahs[currentSurahIndex + 1] : null;

    return (
        <div className="w-full animate-fade-in pb-12">
            <header className="text-center mb-6 relative">
                <button onClick={() => setSelectedSurah(null)} className="absolute top-1/2 -translate-y-1/2 left-0 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)]">{language === 'ar' ? surahData.name : surahData.englishName}</h2>
                <p className="text-[var(--text-secondary)]">{language === 'ar' ? surahData.englishNameTranslation : surahData.name}</p>
            </header>
            
            <div className="glass-card p-4 sm:p-6">
                <div className="mb-6 p-3 bg-black/5 dark:bg-white/5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <ReciterSelector />
                </div>

                {surahData.number !== 1 && surahData.number !== 9 && (
                     <p className="text-center font-amiri text-2xl my-6 text-[var(--text-primary)]">
                        {BISMILLAH}
                    </p>
                )}

                <div dir="rtl" className="font-amiri text-3xl leading-[2.5] text-right text-[var(--text-primary)] p-2" style={{ wordSpacing: '8px' }}>
                    {surahData.ayahs.map((ayah) => (
                        <React.Fragment key={ayah.number}>
                            <span 
                                onClick={() => playAyah(ayah)}
                                className={`cursor-pointer transition-colors duration-300 rounded px-1 ${
                                    currentPlayingAyah === ayah.number ? 'bg-yellow-400/20 text-[var(--accent-primary)]' : 'hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                            >
                                {ayah.text}
                            </span>
                            <span className="relative inline-block w-10 h-10 mx-1 text-center text-sm font-sans text-[var(--text-secondary)] align-middle">
                                 <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 1.99219L14.8321 9.03219L22.4521 9.50419L16.4881 14.8082L18.4441 22.1882L12.0001 18.0002L5.55612 22.1882L7.51212 14.8082L1.54812 9.50419L9.16812 9.03219L12.0001 1.99219Z"/></svg>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">{ayah.numberInSurah}</span>
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="w-full flex justify-between items-center mt-6">
                <button
                    onClick={() => prevSurah && setSelectedSurah(prevSurah.number)}
                    disabled={!prevSurah}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] disabled:opacity-40 transition-colors text-left"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {prevSurah && <span className="text-sm font-semibold text-[var(--text-primary)]">{language === 'ar' ? prevSurah.name : prevSurah.englishName}</span>}
                </button>
                <button
                    onClick={() => nextSurah && setSelectedSurah(nextSurah.number)}
                    disabled={!nextSurah}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] disabled:opacity-40 transition-colors text-right"
                >
                    {nextSurah && <span className="text-sm font-semibold text-[var(--text-primary)]">{language === 'ar' ? nextSurah.name : nextSurah.englishName}</span>}
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
            </div>
             <audio
                ref={audioRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleAudioEnd}
                className="hidden"
            />
        </div>
    );
};

export default SurahDetail;
