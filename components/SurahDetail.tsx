
import React, { useState, useEffect, useContext, useRef } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SurahDetailData, Ayah } from '../types';
import { getSurahDetail } from '../services/quranService';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';
import ReciterSelector from './ReciterSelector';
import TafsirModal from './TafsirModal';
import RecitationPracticeModal from './RecitationPracticeModal';

interface SurahDetailProps {
  surahNumber: number;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber }) => {
    const { t, language, setSelectedSurah, surahs, reciter, bookmarks, addBookmark, removeBookmark } = useContext(LanguageContext) as LanguageContextType;
    const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPlayingAyahIndex, setCurrentPlayingAyahIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [activeModal, setActiveModal] = useState<{type: 'tafsir' | 'recitation', ayah: Ayah, anchor: HTMLElement} | null>(null);
    
    const isBookmarked = bookmarks.includes(surahNumber);

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
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [surahNumber, reciter.identifier]);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        const handleAudioEnd = () => {
            if (surahData && currentPlayingAyahIndex !== null && currentPlayingAyahIndex < surahData.ayahs.length - 1) {
                playAyahByIndex(currentPlayingAyahIndex + 1);
            } else {
                setIsPlaying(false);
                setCurrentPlayingAyahIndex(null);
            }
        };
        
        audioEl.addEventListener('ended', handleAudioEnd);
        return () => audioEl.removeEventListener('ended', handleAudioEnd);

    }, [currentPlayingAyahIndex, surahData]);
    
    const playAyahByIndex = (index: number) => {
        if (!surahData || !audioRef.current) return;
        const ayah = surahData.ayahs[index];
        if (ayah && ayah.audio) {
            setCurrentPlayingAyahIndex(index);
            audioRef.current.src = ayah.audio;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            setIsPlaying(true);
        }
    };
    
    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            const indexToPlay = currentPlayingAyahIndex ?? 0;
            playAyahByIndex(indexToPlay);
        }
    };

    const jumpToAyah = (index: number) => {
        playAyahByIndex(index);
    }

    const getAyahWithContext = (ayah: Ayah) => {
        return {
            ...ayah,
            surah: {
                number: surahData!.number,
                name: surahData!.name,
                englishName: surahData!.englishName,
            }
        };
    }
    
    const handleTafsirClick = (event: React.MouseEvent<HTMLButtonElement>, ayah: Ayah) => {
        setActiveModal({ type: 'tafsir', ayah: getAyahWithContext(ayah), anchor: event.currentTarget });
    };

    const handlePracticeClick = (event: React.MouseEvent<HTMLButtonElement>, ayah: Ayah) => {
        setActiveModal({ type: 'recitation', ayah: getAyahWithContext(ayah), anchor: event.currentTarget });
    };
    
    const handleBookmarkToggle = () => {
        if (isBookmarked) {
            removeBookmark(surahNumber);
        } else {
            addBookmark(surahNumber);
        }
    }

    const closeModal = () => {
        setActiveModal(null);
    };


    if (isLoading) return <div className="pt-20"><LoadingIndicator message={t('loadingSurah')} /></div>;
    if (error || !surahData) return <ErrorMessage message={error || "Could not load Surah data."} />;
    
    const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

    const currentSurahIndex = surahs.findIndex(s => s.number === surahData.number);
    const prevSurah = currentSurahIndex > 0 ? surahs[currentSurahIndex - 1] : null;
    const nextSurah = currentSurahIndex < surahs.length - 1 ? surahs[currentSurahIndex + 1] : null;

    return (
        <div className="w-full animate-fade-in pb-12">
            {activeModal?.type === 'tafsir' && (
                <TafsirModal 
                    ayah={activeModal.ayah} 
                    onClose={closeModal} 
                    anchorEl={activeModal.anchor}
                />
            )}
            {activeModal?.type === 'recitation' && (
                <RecitationPracticeModal
                    ayah={activeModal.ayah}
                    onClose={closeModal}
                    anchorEl={activeModal.anchor}
                />
            )}
            <header className="text-center mb-6 relative flex items-center justify-center">
                <button onClick={() => setSelectedSurah(null)} className="absolute top-1/2 -translate-y-1/2 left-0 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)]">{language === 'ar' ? surahData.name : surahData.englishName}</h2>
                    <p className="text-[var(--text-secondary)]">{language === 'ar' ? surahData.englishNameTranslation : surahData.name}</p>
                </div>
                <button onClick={handleBookmarkToggle} className="absolute top-1/2 -translate-y-1/2 right-0 text-amber-400 hover:text-amber-300 transition-colors p-2 rounded-full" title={isBookmarked ? t('unbookmarkSurah') : t('bookmarkSurah')}>
                    {isBookmarked ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    )}
                </button>
            </header>
            
            <div className="glass-card p-4 sm:p-6">
                <div className="mb-6 p-2 bg-black/5 dark:bg-white/5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <ReciterSelector />
                    <button onClick={handlePlayPause} className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-semibold rounded-full text-sm shadow-md hover:bg-[var(--accent-secondary)] transition-colors transform hover:scale-105">
                        {isPlaying ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                {t('pause')}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                {t('playAll')}
                            </>
                        )}
                    </button>
                </div>

                {surahData.number !== 1 && surahData.number !== 9 && (
                     <p className="text-center font-amiri text-2xl my-6 text-[var(--text-primary)]">
                        {BISMILLAH}
                    </p>
                )}

                <div className="space-y-6">
                    {surahData.ayahs.map((ayah, index) => (
                        <div 
                            key={ayah.number}
                            className={`p-3 rounded-lg transition-colors duration-300 ${
                                currentPlayingAyahIndex === index ? 'bg-yellow-400/10' : ''
                            }`}
                        >
                            <p 
                                dir="rtl" 
                                className="font-amiri text-3xl leading-[2.5] text-right text-[var(--text-primary)] mb-3" 
                                style={{ wordSpacing: '8px' }}
                            >
                                {ayah.text}
                            </p>
                            <div className="flex items-center justify-end gap-1" dir="rtl">
                                <div className="flex items-center gap-2 border-l-2 border-[var(--border-color)] pl-3 ml-3">
                                    <span className="font-sans font-bold text-sm text-[var(--accent-primary)]">{ayah.numberInSurah}</span>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        if (currentPlayingAyahIndex === index && isPlaying) {
                                            audioRef.current?.pause();
                                        } else {
                                            jumpToAyah(index);
                                        }
                                    }} 
                                    className="relative inline-flex items-center justify-center w-10 h-10 text-[var(--text-secondary)] align-middle hover:text-[var(--accent-primary)] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5" 
                                    title={currentPlayingAyahIndex === index && isPlaying ? t('pause') : t('playAyah')}
                                >
                                    {currentPlayingAyahIndex === index && isPlaying ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                                    )}
                                </button>

                                <button onClick={(e) => handleTafsirClick(e, ayah)} className="relative inline-flex items-center justify-center w-10 h-10 text-[var(--text-secondary)] align-middle hover:text-[var(--accent-primary)] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5" title={t('getTafsirTitle')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </button>

                                <button onClick={(e) => handlePracticeClick(e, ayah)} className="relative inline-flex items-center justify-center w-10 h-10 text-[var(--text-secondary)] align-middle hover:text-[var(--accent-primary)] transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5" title={t('recitationPracticeTooltip')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                </button>
                            </div>
                        </div>
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
                className="hidden"
            />
        </div>
    );
};

export default SurahDetail;
