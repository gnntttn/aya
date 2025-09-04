
import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, Tafsir } from '../types';
import { getTafsir, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

interface TafsirModalProps {
    ayah: Ayah;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

const TafsirSection: React.FC<{title: string; content: string;}> = ({ title, content }) => (
    <div>
        <h4 className="font-lora font-bold text-sm text-[var(--accent-primary)] mb-1">{title}</h4>
        <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
);


const TafsirModal: React.FC<TafsirModalProps> = ({ ayah, onClose, anchorEl }) => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [tafsir, setTafsir] = useState<Tafsir | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({ opacity: 0 });

    useLayoutEffect(() => {
        if (anchorEl && modalRef.current) {
            const anchorRect = anchorEl.getBoundingClientRect();
            // Use a copy of the element to measure without affecting layout
            const modalClone = modalRef.current.cloneNode(true) as HTMLElement;
            modalClone.style.visibility = 'hidden';
            modalClone.style.position = 'absolute';
            document.body.appendChild(modalClone);
            const modalRect = modalClone.getBoundingClientRect();
            document.body.removeChild(modalClone);

            const viewportMargin = 16;

            let top = anchorRect.bottom + 8;
            let left = anchorRect.left + (anchorRect.width / 2) - (modalRect.width / 2);

            if (left < viewportMargin) left = viewportMargin;
            if (left + modalRect.width > window.innerWidth - viewportMargin) {
                left = window.innerWidth - modalRect.width - viewportMargin;
            }
            if (top + modalRect.height > window.innerHeight - viewportMargin) {
                top = anchorRect.top - modalRect.height - 8;
            }

            setPositionStyle({
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
                transition: 'opacity 0.2s ease-out',
            });
        }
    }, [anchorEl]);

    useEffect(() => {
        const checkKeyAndFetchTafsir = async () => {
            setIsLoading(true);
            setError(null);
            const keyAvailable = await isApiKeyAvailable();

            if (keyAvailable) {
                try {
                    const explanation = await getTafsir(ayah, language);
                    setTafsir(explanation);
                } catch (err) {
                    setError(err instanceof Error ? err.message : t('errorMessage'));
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("Please configure the API_KEY.");
                setIsLoading(false);
            }
        };

        checkKeyAndFetchTafsir();
    }, [ayah, language, t]);

    return (
        <div 
            className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tafsir-title"
        >
            <div 
                ref={modalRef}
                style={positionStyle}
                className="w-full max-w-sm glass-card p-4 rounded-xl flex flex-col max-h-[75vh] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-3 border-b border-[var(--border-color)]">
                    <h2 id="tafsir-title" className="font-lora text-lg font-bold text-center text-[var(--accent-primary)]">
                        {t('tafsirTitle', { number: ayah.numberInSurah })}
                    </h2>
                     <p dir="rtl" className="font-amiri text-base text-center mt-1 text-[var(--text-secondary)]">{ayah.surah?.name} ({ayah.surah?.englishName})</p>
                </header>
                
                <div className="flex-grow overflow-y-auto my-3 pr-2">
                    {isLoading ? (
                        <LoadingIndicator message={t('tafsirGenerating')} />
                    ) : error ? (
                        <ErrorMessage message={error} />
                    ) : tafsir ? (
                        <div className="space-y-4">
                             <p dir="rtl" className="font-amiri text-xl bg-black/5 dark:bg-white/5 p-3 rounded-lg text-right">
                                {ayah.text}
                            </p>
                            <TafsirSection title={t('tafsirLiteralTranslation')} content={tafsir.literalTranslation} />
                            <TafsirSection title={t('tafsirContext')} content={tafsir.context} />
                            <TafsirSection title={t('tafsirExplanation')} content={tafsir.explanation} />
                            <TafsirSection title={t('tafsirLessons')} content={tafsir.lessons} />
                        </div>
                    ) : null}
                </div>

                <footer className="flex-shrink-0 pt-3 text-center">
                    <button 
                        onClick={onClose}
                        className="px-5 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full text-sm shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
                        aria-label={t('close')}
                    >
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TafsirModal;
