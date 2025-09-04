
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, FiqhAnswer } from '../types';
import { getFiqhAnswer } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const FiqhQA: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<FiqhAnswer | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnswer(null);
        try {
            const result = await getFiqhAnswer(question, language);
            setAnswer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get an answer.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('fiqhQATitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('fiqhQADescription')}</p>
            </div>
            
             <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 glass-card p-4">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('fiqhQAPlaceholder')}
                    className="w-full h-24 p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                    disabled={isLoading}
                    aria-label={t('fiqhQADescription')}
                />
                <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="mt-4 w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                    {isLoading ? t('generatingButton') : t('fiqhQASubmit')}
                </button>
            </form>

            <div className="w-full max-w-2xl mt-4">
                {isLoading && <LoadingIndicator message={t('generatingButton')} />}
                {error && <ErrorMessage message={error} />}
                {answer && (
                    <div className="glass-card p-6 animate-fade-in">
                        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-amber-300 text-sm font-semibold">{answer.disclaimer}</p>
                        </div>
                        <h3 className="font-lora text-lg font-semibold text-[var(--text-primary)] mb-3">{answer.question}</h3>
                        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{answer.answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FiqhQA;
