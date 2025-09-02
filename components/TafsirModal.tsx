import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, Tafsir } from '../types';
import { getTafsir, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

interface TafsirModalProps {
    ayah: Ayah;
    onClose: () => void;
}

const TafsirSection: React.FC<{title: string; content: string;}> = ({ title, content }) => (
    <div>
        <h4 className="font-lora font-bold text-md text-[var(--accent-primary)] mb-2">{title}</h4>
        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
);


const TafsirModal: React.FC<TafsirModalProps> = ({ ayah, onClose }) => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [tafsir, setTafsir] = useState<Tafsir | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiKeyAvailable, setApiKeyAvailable] = useState(false);

    useEffect(() => {
        const checkKeyAndFetchTafsir = async () => {
            setIsLoading(true);
            setError(null);
            const keyAvailable = await isApiKeyAvailable();
            setApiKeyAvailable(keyAvailable);

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
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tafsir-title"
        >
            <div 
                className="w-full max-w-lg glass-card p-6 rounded-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-4 border-b border-[var(--border-color)]">
                    <h2 id="tafsir-title" className="font-lora text-xl font-bold text-center text-[var(--accent-primary)]">
                        {t('tafsirTitle', { number: ayah.numberInSurah })}
                    </h2>
                     <p dir="rtl" className="font-amiri text-lg text-center mt-2 text-[var(--text-secondary)]">{ayah.surah?.name} ({ayah.surah?.englishName})</p>
                </header>
                
                <div className="flex-grow overflow-y-auto my-4 pr-2">
                    {isLoading ? (
                        <LoadingIndicator message={t('tafsirGenerating')} />
                    ) : error ? (
                        <ErrorMessage message={error} />
                    ) : tafsir ? (
                        <div className="space-y-6">
                             <p dir="rtl" className="font-amiri text-2xl bg-black/5 dark:bg-white/5 p-4 rounded-lg text-right">
                                {ayah.text}
                            </p>
                            <TafsirSection title={t('tafsirLiteralTranslation')} content={tafsir.literalTranslation} />
                            <TafsirSection title={t('tafsirContext')} content={tafsir.context} />
                            <TafsirSection title={t('tafsirExplanation')} content={tafsir.explanation} />
                            <TafsirSection title={t('tafsirLessons')} content={tafsir.lessons} />
                        </div>
                    ) : null}
                </div>

                <footer className="flex-shrink-0 pt-4 text-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
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