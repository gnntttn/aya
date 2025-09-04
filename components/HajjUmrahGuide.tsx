
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, HajjGuideStep } from '../types';
import { hajjUmrahData } from '../data/hajjUmrahData';
import { getHajjUmrahQa } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const GuideStep: React.FC<{ step: HajjGuideStep; index: number }> = ({ step, index }) => {
    return (
        <div className="p-4 rounded-lg bg-black/5 dark:bg-white/5">
            <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)]">
                {step.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-primary)]">{step.description}</p>
        </div>
    );
};

const HajjUmrahGuide: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [activeTab, setActiveTab] = useState<'hajj' | 'umrah'>('hajj');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const guideData = activeTab === 'hajj' ? hajjUmrahData[language].hajj : hajjUmrahData[language].umrah;

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnswer('');
        try {
            const result = await getHajjUmrahQa(question, language);
            setAnswer(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get answer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('hajjGuideTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('hajjGuideDescription')}</p>
            </div>

            <div className="mb-6 bg-black/5 dark:bg-white/5 rounded-full p-1 flex items-center" role="tablist">
                <button
                    onClick={() => setActiveTab('hajj')}
                    role="tab"
                    aria-selected={activeTab === 'hajj'}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] ${activeTab === 'hajj' ? 'text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
                >
                    {activeTab === 'hajj' && <span className="absolute inset-0 bg-[var(--accent-primary)] rounded-full shadow -z-10"></span>}
                    <span className="relative">{t('hajjGuideHajj')}</span>
                </button>
                 <button
                    onClick={() => setActiveTab('umrah')}
                    role="tab"
                    aria-selected={activeTab === 'umrah'}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] ${activeTab === 'umrah' ? 'text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
                >
                    {activeTab === 'umrah' && <span className="absolute inset-0 bg-[var(--accent-primary)] rounded-full shadow -z-10"></span>}
                    <span className="relative">{t('hajjGuideUmrah')}</span>
                </button>
            </div>

            <div className="space-y-3 glass-card p-4">
                {guideData.map((step, index) => (
                    <GuideStep key={index} step={step} index={index} />
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                 <form onSubmit={handleAskQuestion} className="w-full max-w-2xl mx-auto glass-card p-4">
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t('hajjGuideAsk')}
                        className="w-full p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="mt-3 w-full px-6 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 transition-all"
                    >
                        {isLoading ? t('generatingButton') : t('fiqhQASubmit')}
                    </button>
                </form>
                <div className="w-full max-w-2xl mx-auto mt-4">
                    {isLoading && <LoadingIndicator message={t('generatingButton')} />}
                    {error && <ErrorMessage message={error} />}
                    {answer && (
                        <div className="glass-card p-4 animate-fade-in">
                            <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{answer}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HajjUmrahGuide;
