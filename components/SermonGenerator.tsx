import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SermonOutline } from '../types';
import { generateSermonOutline } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const SermonGenerator: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [topic, setTopic] = useState('');
    const [outline, setOutline] = useState<SermonOutline | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setOutline(null);
        try {
            const result = await generateSermonOutline(topic, language);
            setOutline(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate sermon outline.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('sermonGeneratorTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('sermonGeneratorDescription')}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6 glass-card p-4">
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('sermonGeneratorPlaceholder')}
                    className="w-full h-24 p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                    disabled={isLoading}
                    aria-label={t('sermonGeneratorDescription')}
                />
                <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="mt-4 w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                    {isLoading ? t('sermonGeneratorLoading') : t('sermonGeneratorSubmit')}
                </button>
            </form>

            <div className="w-full max-w-2xl mt-4">
                {isLoading && <LoadingIndicator message={t('sermonGeneratorLoading')} />}
                {error && <ErrorMessage message={error} />}
                {outline && (
                    <div className="glass-card p-6 animate-fade-in space-y-5 text-left">
                        <h3 className="font-lora text-2xl font-bold text-center text-[var(--accent-primary)] mb-4">{outline.title}</h3>
                        
                        <div>
                            <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-2 border-b border-[var(--border-color)] pb-1">{t('sermonIntro')}</h4>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed">{outline.introduction}</p>
                        </div>
                        
                        <div>
                             <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-3 border-b border-[var(--border-color)] pb-1">{t('sermonPoints')}</h4>
                             <div className="space-y-4">
                                {outline.points.map((p, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-black/5 dark:bg-white/5">
                                        <p className="font-semibold text-[var(--text-primary)]"> <span className="text-[var(--accent-primary)]">{index + 1}.</span> {p.point}</p>
                                        <p className="mt-1 pl-5 text-sm italic text-[var(--text-secondary)] border-l-2 border-[var(--accent-primary)] ml-2 pl-3">
                                            {p.evidence}
                                        </p>
                                    </div>
                                ))}
                             </div>
                        </div>

                         <div>
                            <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-2 border-b border-[var(--border-color)] pb-1">{t('sermonConclusion')}</h4>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed">{outline.conclusion}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-2 border-b border-[var(--border-color)] pb-1">{t('sermonDua')}</h4>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed italic">{outline.dua}</p>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SermonGenerator;
