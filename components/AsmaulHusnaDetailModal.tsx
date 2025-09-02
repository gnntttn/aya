
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, AsmaulHusna } from '../types';
import { getAsmaulHusnaExplanation, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

interface AsmaulHusnaDetailModalProps {
    name: AsmaulHusna;
    onClose: () => void;
}

const AsmaulHusnaDetailModal: React.FC<AsmaulHusnaDetailModalProps> = ({ name, onClose }) => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoading(true);
            setError(null);
            const keyAvailable = await isApiKeyAvailable();
            if (!keyAvailable) {
                setError("Please configure the API_KEY.");
                setIsLoading(false);
                return;
            }

            try {
                const nameIdentifier = language === 'en' ? name.en.name : name.transliteration;
                const result = await getAsmaulHusnaExplanation(nameIdentifier, language);
                setExplanation(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('errorMessage'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchExplanation();
    }, [name, language, t]);
    
    const displayName = language === 'ar' ? name.ar : name.en.name;
    const subDisplayName = language === 'ar' ? name.en.name : name.ar;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="asma-title"
        >
            <div 
                className="w-full max-w-lg glass-card p-6 rounded-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-4 border-b border-[var(--border-color)] text-center">
                    <h2 id="asma-title" className={`font-lora text-3xl font-bold text-[var(--accent-primary)] ${language === 'ar' ? 'font-amiri' : ''}`}>
                        {displayName}
                    </h2>
                     <p className="text-lg mt-1 text-[var(--text-secondary)]">{subDisplayName}</p>
                </header>
                
                <div className="flex-grow overflow-y-auto my-4 pr-2">
                    {isLoading ? (
                        <LoadingIndicator message={t('asmaulHusnaLoading')} />
                    ) : error ? (
                        <ErrorMessage message={error} />
                    ) : (
                        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                            {explanation}
                        </p>
                    )}
                </div>

                <footer className="flex-shrink-0 pt-4 text-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
                        aria-label="Close modal"
                    >
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AsmaulHusnaDetailModal;