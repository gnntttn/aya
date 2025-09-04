
import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, ProphetStory } from '../types';
import { getProphetStory } from '../services/geminiService';
import { prophetsData } from '../data/prophetsData';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

const ProphetStories: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [selectedProphet, setSelectedProphet] = useState<string | null>(null);
    const [story, setStory] = useState<ProphetStory | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const prophetList = prophetsData[language];

    useEffect(() => {
        if (!selectedProphet) return;

        const fetchStory = async () => {
            setIsLoading(true);
            setError(null);
            setStory(null);
            try {
                const result = await getProphetStory(selectedProphet, language);
                setStory(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load story.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStory();

    }, [selectedProphet, language]);
    
    if (selectedProphet) {
        return (
             <div className="w-full animate-fade-in">
                 <button onClick={() => setSelectedProphet(null)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                     {t('back')}
                </button>
                <div className="text-center mb-8">
                     <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{selectedProphet}</h2>
                </div>
                 {isLoading && <LoadingIndicator message={t('prophetStoriesLoading')} />}
                 {error && <ErrorMessage message={error} />}
                 {story && (
                     <div className="glass-card p-6 space-y-4 animate-fade-in">
                        <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{story.story}</p>
                        <div className="pt-4 border-t border-[var(--border-color)]">
                             <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)] mb-2">{t('prophetStoriesLessons')}</h3>
                             <ul className="list-disc list-inside space-y-2 text-sm text-[var(--text-primary)]">
                                 {story.lessons.map((lesson, i) => <li key={i}>{lesson}</li>)}
                             </ul>
                        </div>
                     </div>
                 )}
            </div>
        );
    }


    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('prophetStoriesTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('prophetStoriesDescription')}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {prophetList.map((prophetName) => (
                    <button
                        key={prophetName}
                        onClick={() => setSelectedProphet(prophetName)}
                        className="w-full text-center glass-card p-4 hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group"
                    >
                        <p className="font-semibold text-base text-[var(--text-primary)]">{prophetName}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProphetStories;
