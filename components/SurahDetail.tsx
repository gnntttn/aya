import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SurahDetailData, Ayah, Theme, Language } from '../types';
import { getSurahDetail, getAyahDetail } from '../services/quranService';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';
import ReciterSelector from './ReciterSelector';
import TafsirModal from './TafsirModal';
import RecitationPracticeModal from './RecitationPracticeModal';
import MemorizationModal from './MemorizationModal';

interface SurahDetailProps {
  surahNumber: number;
}

const toArabicNumerals = (num: number) => {
    return num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

// Helper function to generate Ayah image
const generateAyahImage = (
    ayah: Ayah, 
    surahData: SurahDetailData, 
    translationText: string,
    theme: Theme,
    language: Language
): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Ensure fonts from index.html are loaded before measuring text
            await document.fonts.ready;

            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            const style = getComputedStyle(document.documentElement);

            const cardWidth = 550;
            const padding = 30;

            const bgColor = style.getPropertyValue('--bg-secondary-solid').trim() || (isDark ? '#1E293B' : '#ffffff');
            const textColor = style.getPropertyValue('--text-primary').trim() || (isDark ? '#E2E8F0' : '#1A1A1A');
            const secondaryColor = style.getPropertyValue('--text-secondary').trim() || (isDark ? '#94A3B8' : '#6B6B6B');
            const accentColor = style.getPropertyValue('--accent-primary').trim() || (isDark ? '#2DD4BF' : '#D4AF37');
            const borderColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            const borderRadius = '16px';

            // Define shared content and styles
            const innerHtmlForCard = `
                <p dir="rtl" style="font-family: 'Amiri', serif; font-size: 28px; text-align: right; margin: 0 0 16px 0; line-height: 1.8; color: ${textColor}; word-wrap: break-word; white-space: pre-wrap;">
                    ${ayah.text}
                </p>
                <p style="font-size: 16px; margin: 0 0 24px 0; line-height: 1.6; color: ${secondaryColor}; ${language === 'ar' ? 'text-align: right;' : 'text-align: left;'} word-wrap: break-word; white-space: pre-wrap;">
                    ${translationText}
                </p>
                <div style="margin-top: auto; text-align: center; border-top: 1px solid ${borderColor}; padding-top: 12px; font-size: 15px; color: ${accentColor}; font-weight: 600; font-family: 'Inter', sans-serif;">
                    ${surahData.englishName} (${surahData.name}) : ${ayah.numberInSurah}
                </div>
            `;

            // --- Dynamic Height Calculation ---
            const measurementDiv = document.createElement('div');
            Object.assign(measurementDiv.style, {
                width: `${cardWidth}px`,
                padding: `${padding}px`,
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
                position: 'absolute',
                left: '-9999px',
                top: '0',
                visibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            });
            measurementDiv.innerHTML = innerHtmlForCard;
            document.body.appendChild(measurementDiv);
            
            // Allow browser to compute styles
            await new Promise(r => requestAnimationFrame(r));
            
            const contentHeight = measurementDiv.scrollHeight;
            document.body.removeChild(measurementDiv);
            const cardHeight = contentHeight;
            // --- End of Dynamic Height Calculation ---

            const htmlContainerStyle = `width: ${cardWidth}px; height: ${cardHeight}px; padding: ${padding}px; background-color: ${bgColor}; color: ${textColor}; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; justify-content: center; border-radius: ${borderRadius}; border: 1px solid ${isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.07)'}; box-shadow: 0 10px 25px rgba(0,0,0,0.1); box-sizing: border-box;`;

            const fullHtmlContent = `
                <div xmlns="http://www.w3.org/1999/xhtml" style="${htmlContainerStyle}">
                    ${innerHtmlForCard}
                </div>
            `;

            const svgString = `
                <svg width="${cardWidth}" height="${cardHeight}" xmlns="http://www.w3.org/2000/svg">
                    <foreignObject width="100%" height="100%">
                        ${fullHtmlContent}
                    </foreignObject>
                </svg>
            `;

            const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
            
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = 2; // Render at 2x for better quality
                canvas.width = cardWidth * scale;
                canvas.height = cardHeight * scale;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Canvas toBlob failed.'));
                        }
                    }, 'image/png');
                } else {
                    reject(new Error('Could not get canvas context.'));
                }
            };
            img.onerror = (e) => {
                console.error("Image loading error:", e);
                reject(new Error('Image failed to load from SVG data URL.'));
            };
            img.src = svgUrl;
        } catch (err) {
            console.error("Error generating Ayah image:", err);
            reject(err);
        }
    });
};

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber }) => {
    const { t, language, setSelectedSurah, surahs, reciter, bookmarks, addBookmark, removeBookmark, theme } = useContext(LanguageContext) as LanguageContextType;
    const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [currentPlayingAyahIndex, setCurrentPlayingAyahIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [activeModal, setActiveModal] = useState<{type: 'tafsir' | 'recitation' | 'memorization', ayah: Ayah, anchor: HTMLElement} | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState<number | null>(null);
    
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

    const handleMemorizeClick = (event: React.MouseEvent<HTMLButtonElement>, ayah: Ayah) => {
        setActiveModal({ type: 'memorization', ayah: getAyahWithContext(ayah), anchor: event.currentTarget });
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

    const handleShareAsImage = async (ayah: Ayah) => {
        if (!surahData) return;
        setIsGeneratingImage(ayah.numberInSurah);
        try {
            const detailedAyah = await getAyahDetail(surahNumber, ayah.numberInSurah, language);
            if (!detailedAyah || !detailedAyah.translationText) {
                throw new Error("Could not fetch Ayah translation.");
            }
            
            const imageBlob = await generateAyahImage(ayah, surahData, detailedAyah.translationText, theme, language);
            const imageFile = new File([imageBlob], `ayah_${surahData.number}_${ayah.numberInSurah}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [imageFile] })) {
                await navigator.share({
                    files: [imageFile],
                    title: `${surahData.englishName} ${ayah.numberInSurah}`,
                    text: `"${detailedAyah.translationText}" - Quran ${surahData.number}:${ayah.numberInSurah}`,
                });
            } else {
                try {
                    await navigator.clipboard.write([ new ClipboardItem({ 'image/png': imageBlob }) ]);
                    alert(t('imageCopied'));
                } catch (copyError) {
                    console.error('Clipboard API failed, falling back to download:', copyError);
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(imageBlob);
                    link.download = `ayah_${surahData.number}_${ayah.numberInSurah}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }
            }
        } catch (err) {
            console.error("Failed to generate or share image:", err);
            alert(t('shareError'));
        } finally {
            setIsGeneratingImage(null);
        }
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
            {activeModal?.type === 'memorization' && (
                <MemorizationModal
                    ayah={activeModal.ayah}
                    onClose={closeModal}
                    anchorEl={activeModal.anchor}
                />
            )}
            <header className="text-center mb-6 relative flex items-center justify-between">
                <button onClick={() => setSelectedSurah(null)} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <ReciterSelector />
                <button onClick={handleBookmarkToggle} className="text-amber-400 hover:text-amber-300 transition-colors p-2 rounded-full" title={isBookmarked ? t('unbookmarkSurah') : t('bookmarkSurah')}>
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
            
            <div className="quran-page-container">
                 <div className="surah-header">
                     <h2 className="font-lora text-3xl font-bold font-amiri text-[var(--text-primary)]">{surahData.name}</h2>
                     <p className="text-[var(--text-secondary)] text-sm">{surahData.englishNameTranslation}</p>
                     <p className="text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-wider">{t('surah')} {surahData.number} • JUZ {surahData.juz} • {surahData.ayahs.length} {t('ayahs')} • {surahData.revelationType}</p>
                </div>

                <div className="mb-6 flex items-center justify-center gap-4">
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
                     <p className="bismillah-text">
                        {BISMILLAH}
                    </p>
                )}

                <div>
                    {surahData.ayahs.map((ayah, index) => (
                        <div 
                            key={ayah.number}
                            className={`ayah-block ${currentPlayingAyahIndex === index ? 'bg-yellow-400/10 rounded-lg' : ''}`}
                        >
                            <p dir="rtl" className="ayah-text-container">
                                {ayah.text}
                                <span className="ayah-number-circle">{toArabicNumerals(ayah.numberInSurah)}</span>
                            </p>
                            <div className="ayah-actions">
                                <button 
                                    onClick={() => {
                                        if (currentPlayingAyahIndex === index && isPlaying) {
                                            audioRef.current?.pause();
                                        } else {
                                            jumpToAyah(index);
                                        }
                                    }} 
                                    title={currentPlayingAyahIndex === index && isPlaying ? t('pause') : t('playAyah')}
                                >
                                    {currentPlayingAyahIndex === index && isPlaying ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                                    )}
                                </button>

                                <button onClick={(e) => handleTafsirClick(e, ayah)} title={t('getTafsirTitle')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </button>
                                
                                <button onClick={() => handleShareAsImage(ayah)} title={t('shareAsImage')} disabled={isGeneratingImage === ayah.numberInSurah}>
                                    {isGeneratingImage === ayah.numberInSurah ? (
                                        <div className="w-5 h-5 border-2 border-transparent border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    )}
                                </button>

                                <button onClick={(e) => handlePracticeClick(e, ayah)} title={t('recitationPracticeTooltip')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                </button>
                                
                                <button onClick={(e) => handleMemorizeClick(e, ayah)} title={t('memorizationHelperTooltip')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" opacity="0.4" transform="translate(0, -4)"/><path d="M4 8.5C4 5.46243 6.46243 3 9.5 3C12.5376 3 15 5.46243 15 8.5V11H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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