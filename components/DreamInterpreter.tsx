
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, DreamInterpretation } from '../types';
import { getDreamInterpretation } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

const DreamInterpreter: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [dream, setDream] = useState('');
    const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!dream.trim()) return;

        setIsLoading(true);
        setError(null);
        setInterpretation(null);
        try {
            const result = await getDreamInterpretation(dream, language);
            setInterpretation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get an interpretation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('dreamTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('dreamDescription')}</p>
            </div>
            
             <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 glass-card p-4">
                <textarea
                    value={dream}
                    onChange={(e) => setDream(e.target.value)}
                    placeholder={t('dreamPlaceholder')}
                    className="w-full h-28 p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !dream.trim()}
                    className="mt-4 w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 transition-all"
                >
                    {isLoading ? t('dreamLoading') : t('dreamSubmit')}
                </button>
            </form>

            <div className="w-full max-w-2xl mt-4">
                {isLoading && <LoadingIndicator message={t('dreamLoading')} />}
                {error && <ErrorMessage message={error} />}
                {interpretation && (
                    <div className="glass-card p-6 animate-fade-in">
                        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-amber-300 text-sm font-semibold">{interpretation.disclaimer}</p>
                        </div>
                        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{interpretation.interpretation}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DreamInterpreter;
