
import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SurahDetailData, Ayah } from '../types';
import { getSurahDetail } from '../services/quranService';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';
import ReciterSelector from './ReciterSelector';

interface SurahDetailProps {
  surahNumber: number;
}

const SurahOrnament: React.FC = () => (
    <div className="w-full my-4 flex items-center justify-between">
        <svg className="h-8 text-blue-800/70" viewBox="0 0 138 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M137.5 31.25C137.5 31.25 125.5 36.25 110.5 31.25C95.5 26.25 91 16.75 75.5 16.75C60 16.75 51.5 29.25 38.5 29.25C25.5 29.25 12 18.25 12 18.25" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18.25C12 18.25 2.5 13.25 0.5 6.25" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18.25C12 18.25 3 23.25 0.5 30.75" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <svg className="h-8 text-blue-800/70" viewBox="0 0 138 37" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(-1, 1)">
            <path d="M137.5 31.25C137.5 31.25 125.5 36.25 110.5 31.25C95.5 26.25 91 16.75 75.5 16.75C60 16.75 51.5 29.25 38.5 29.25C25.5 29.25 12 18.25 12 18.25" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18.25C12 18.25 2.5 13.25 0.5 6.25" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18.25C12 18.25 3 23.25 0.5 30.75" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
    </div>
);

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber }) => {
    const { t, language, setSelectedSurah, surahs, reciter } = useContext(LanguageContext) as LanguageContextType;
    const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
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
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
        // On new surah, stop any playing audio
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setCurrentPlayingAyah(null);
            setIsPlaying(false);
            setIsContinuousMode(false);
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
    
    const handlePlayPauseSurah = () => {
        if (!surahData || surahData.ayahs.length === 0) return;
        
        if (isPlaying && isContinuousMode) {
            audioRef.current?.pause();
            setIsContinuousMode(false);
        } else {
            setIsContinuousMode(true);
            const startAyah = surahData.ayahs.find(a => a.number === currentPlayingAyah && isPlaying) || surahData.ayahs[0];
            playAyah(startAyah);
        }
    };

    const handleAyahClick = (ayah: Ayah) => {
        setIsContinuousMode(false);
        playAyah(ayah);
    };

    const handleAudioEnd = () => {
        if (isContinuousMode && surahData) {
            const currentAyahIndex = surahData.ayahs.findIndex(a => a.number === currentPlayingAyah);
            if (currentAyahIndex !== -1 && currentAyahIndex < surahData.ayahs.length - 1) {
                playAyah(surahData.ayahs[currentAyahIndex + 1]);
            } else {
                setCurrentPlayingAyah(null);
                setIsContinuousMode(false);
            }
        } else {
            setCurrentPlayingAyah(null);
        }
    };
    

    if (isLoading) {
        return <div className="pt-20"><LoadingIndicator message={t('loadingSurah')} /></div>;
    }

    if (error || !surahData) {
        return <ErrorMessage message={error || "Could not load Surah data."} />;
    }
    
    const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

    const currentSurahIndex = surahs.findIndex(s => s.number === surahData.number);
    const prevSurah = currentSurahIndex > 0 ? surahs[currentSurahIndex - 1] : null;
    const nextSurah = currentSurahIndex < surahs.length - 1 ? surahs[currentSurahIndex + 1] : null;

    return (
        <div className="w-full animate-fade-in pb-12">
            
            <button onClick={() => setSelectedSurah(null)} className="absolute top-4 left-4 z-20 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
            </button>
            
            <div className="bg-[#FDFBF5] dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-[var(--border-color)]">

                {/* Page Header */}
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4 font-sans px-2">
                    <span>Juz' {surahData.juz}</span>
                    <span>Surah {surahData.englishName}</span>
                </div>

                {/* Surah Title */}
                <div className="w-full p-2 border-y-2 border-x border-blue-800/50 flex items-center justify-center">
                    <SurahOrnament />
                    <h2 className="text-3xl font-amiri text-center text-gray-800 dark:text-gray-100 whitespace-nowrap px-4">
                        {surahData.name}
                    </h2>
                    <SurahOrnament />
                </div>
                
                 {/* Player Controls */}
                <div className="my-6 p-3 bg-[var(--bg-secondary)] rounded-lg shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4 border border-[var(--border-color)]">
                    <ReciterSelector />
                    <button
                        onClick={handlePlayPauseSurah}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-semibold rounded-full shadow hover:bg-[var(--accent-secondary)] transition-colors w-full sm:w-auto justify-center"
                        aria-label={isPlaying && isContinuousMode ? 'Pause Surah' : 'Play Surah'}
                    >
                        {isPlaying && isContinuousMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.536 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                        )}
                        <span>{isPlaying && isContinuousMode ? t('pause') : t('playSurah')}</span>
                    </button>
                </div>

                {/* Bismillah (if applicable) */}
                {surahData.number !== 1 && surahData.number !== 9 && (
                     <p className="text-center font-amiri text-xl my-6 text-gray-800 dark:text-gray-100">
                        {BISMILLAH}
                    </p>
                )}

                {/* Ayahs */}
                <div dir="rtl" className="font-amiri text-3xl leading-loose md:leading-[3] text-right text-gray-900 dark:text-gray-50 p-4" style={{ wordSpacing: '8px' }}>
                    {surahData.ayahs.map((ayah) => (
                        <React.Fragment key={ayah.number}>
                            <span 
                                onClick={() => handleAyahClick(ayah)}
                                className={`cursor-pointer transition-colors duration-300 rounded px-1 ${
                                    currentPlayingAyah === ayah.number ? 'bg-teal-500/20 text-[var(--accent-primary)]' : 'hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                            >
                                {ayah.text}
                            </span>
                            <span className="relative inline-block w-10 h-10 mx-1 leading-10 text-center text-sm font-sans text-blue-900 dark:text-blue-200">
                                <svg className="absolute top-0 left-0 w-full h-full text-blue-800/70 dark:text-blue-300/70" viewBox="0 0 200 200">
                                    <path d="M86.6,173.2c-12.5-7.2-22.5-18-28.9-30.9S49.3,115,51,101.4s8-26.6,18-36.8s23.1-15.6,36.8-15.6s26.6,5.5,36.8,15.6 s15.6,23.1,15.6,36.8s-5.5,26.6-15.6,36.8S113.4,180.4,100,180.4c-4.4,0-8.8-0.6-13.4-1.8C82.2,177,77.9,175.2,74,173.2z M100,32 c-37.5,0-68,30.5-68,68s30.5,68,68,68s68-30.5,68-68S137.5,32,100,32z"></path>
                                </svg>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{ayah.numberInSurah}</span>
                            </span>
                        </React.Fragment>
                    ))}
                </div>
                
                 {/* Page Footer */}
                 <div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-[var(--border-color)] font-sans">
                    <span>{surahData.number}</span>
                </div>
            </div>

            {/* Surah Navigation */}
            <div className="w-full flex justify-between items-center mt-6">
                <button
                    onClick={() => prevSurah && setSelectedSurah(prevSurah.number)}
                    disabled={!prevSurah}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div className="text-left">
                        <p className="text-xs">{t('previousSurah')}</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{prevSurah ? (language === 'ar' ? prevSurah.name : prevSurah.englishName) : ''}</p>
                    </div>
                </button>

                <button
                    onClick={() => nextSurah && setSelectedSurah(nextSurah.number)}
                    disabled={!nextSurah}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <div className="text-right">
                        <p className="text-xs">{t('nextSurah')}</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{nextSurah ? (language === 'ar' ? nextSurah.name : nextSurah.englishName) : ''}</p>
                    </div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
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
