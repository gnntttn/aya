
import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, RecitationFeedback } from '../types';
import { getRecitationFeedback, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

interface RecitationPracticeModalProps {
    ayah: Ayah;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

type MicPermission = 'idle' | 'prompting' | 'granted' | 'denied';
type RecitationStatus = 'idle' | 'recording' | 'analyzing' | 'feedback';

const RecitationPracticeModal: React.FC<RecitationPracticeModalProps> = ({ ayah, onClose, anchorEl }) => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [permission, setPermission] = useState<MicPermission>('idle');
    const [status, setStatus] = useState<RecitationStatus>('idle');
    const [feedback, setFeedback] = useState<RecitationFeedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apiKeyAvailable, setApiKeyAvailable] = useState(true);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({ opacity: 0 });

    const recognitionRef = useRef<any>(null);

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
        const checkApiKey = async () => {
            const available = await isApiKeyAvailable();
            setApiKeyAvailable(available);
            if (!available) {
                setError("Please configure the API_KEY.");
            }
        };
        checkApiKey();

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'ar-SA';
            recognition.interimResults = false;
            
            recognition.onstart = () => setStatus('recording');
            recognition.onend = () => {
                if (status !== 'analyzing') {
                    setStatus('idle');
                }
            };
            recognition.onerror = (event: any) => {
                setError(`Speech recognition error: ${event.error}`);
                setStatus('idle');
            };
            
            recognition.onresult = async (event: any) => {
                const transcript = event.results[0][0].transcript;
                setStatus('analyzing');
                try {
                    const aiFeedback = await getRecitationFeedback(transcript, ayah.text, language);
                    setFeedback(aiFeedback);
                } catch (err) {
                    setError(err instanceof Error ? err.message : t('errorMessage'));
                } finally {
                    setStatus('feedback');
                }
            };
            recognitionRef.current = recognition;
        } else {
            setError("Speech recognition is not supported by this browser.");
        }
    }, [language, ayah.text, t, status]);

    const requestMicPermission = async () => {
        setPermission('prompting');
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermission('granted');
        } catch (err) {
            setPermission('denied');
        }
    };
    
    const handleRecordClick = () => {
        if (status === 'recording') {
            recognitionRef.current?.stop();
        } else {
            setFeedback(null);
            setError(null);
            recognitionRef.current?.start();
        }
    };
    
    const renderContent = () => {
        if (!apiKeyAvailable) return <ErrorMessage message={error || ''} />;
        if (permission === 'idle' || permission === 'prompting') {
            return (
                <div className="text-center">
                    <p className="text-md text-[var(--text-secondary)] mb-4">{t('recitationPracticeIntro')}</p>
                    <button onClick={requestMicPermission} className="px-5 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg text-sm">
                        {t('recitationAllowMic')}
                    </button>
                </div>
            );
        }
        if (permission === 'denied') return <ErrorMessage message={t('recitationMicDenied')} />;

        if (status === 'analyzing') return <LoadingIndicator message={t('recitationAnalyzing')} />;

        return (
            <div className="flex flex-col items-center justify-center w-full">
                 <button 
                    onClick={handleRecordClick}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)]"
                    style={{ background: status === 'recording' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-secondary-solid)' }}
                    aria-label={status === 'recording' ? t('recitationStop') : t('recitationStart')}
                 >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-red-500 bg-[var(--bg-primary)]`}>
                        {status === 'recording' ?
                            <div className="w-6 h-6 bg-red-500 rounded-md animate-pulse"></div> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"></path></svg>
                        }
                    </div>
                </button>
                <p className="mt-3 text-md text-[var(--text-secondary)] font-semibold min-h-[1.5rem]">
                    {status === 'recording' ? t('recitationRecording') : (status === 'idle' ? t('recitationStart') : '')}
                </p>

                {error && <div className="mt-3 w-full"><ErrorMessage message={error} /></div>}
                {status === 'feedback' && feedback && (
                    <div className="mt-4 p-3 w-full rounded-lg bg-black/5 dark:bg-white/5 animate-fade-in text-center space-y-2">
                        <p className={`font-bold text-base ${feedback.isCorrect ? 'text-green-400' : 'text-amber-400'}`}>{feedback.feedbackMessage}</p>
                        
                        {!feedback.isCorrect && feedback.recitedText && (
                             <div>
                                <p className="text-xs font-semibold text-[var(--text-secondary)]">{t('recitationYourRecitation')}</p>
                                <p dir="rtl" className="font-amiri text-base p-2 bg-black/10 dark:bg-white/10 rounded-md mt-1">{feedback.recitedText}</p>
                            </div>
                        )}
                         {!feedback.isCorrect && feedback.correctionDetails && (
                            <p className="text-sm text-red-400 font-semibold">{t('recitationCorrection', { mistake: feedback.correctionDetails.mistake, correct: feedback.correctionDetails.correct })}</p>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div 
            className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recitation-title"
        >
            <div 
                ref={modalRef}
                style={positionStyle}
                className="w-full max-w-sm glass-card p-4 rounded-xl flex flex-col max-h-[80vh] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-3 border-b border-[var(--border-color)] text-center">
                    <h2 id="recitation-title" className="font-lora text-lg font-bold text-[var(--accent-primary)]">
                        {t('recitationPracticeTitle')}
                    </h2>
                     <p dir="rtl" className="font-amiri text-base mt-1 text-[var(--text-secondary)]">{ayah.surah?.name}, Ayah {ayah.numberInSurah}</p>
                </header>
                
                <div className="flex-grow my-4 flex flex-col items-center justify-center">
                    <p dir="rtl" className="font-amiri text-xl bg-black/5 dark:bg-white/5 p-3 rounded-lg text-right mb-4 w-full">
                        {ayah.text}
                    </p>
                    {renderContent()}
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

export default RecitationPracticeModal;
