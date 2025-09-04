
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, HadithSearchResult } from '../types';
import { searchHadith } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const HadithSearch: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [topic, setTopic] = useState('');
    const [results, setResults] = useState<HadithSearchResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const searchResults = await searchHadith(topic, language);
            setResults(searchResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search for Hadith.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('hadithSearchTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('hadithSearchDescription')}</p>
            </div>
            
             <form onSubmit={handleSubmit} className="w-full max-w-lg mb-6 glass-card p-4 flex items-center gap-2">
                <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('hadithSearchPlaceholder')}
                    className="w-full p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60"
                >
                    {t('hadithSearchSubmit')}
                </button>
            </form>

            <div className="w-full max-w-2xl mt-4">
                {isLoading && <LoadingIndicator message={t('hadithSearchLoading')} />}
                {error && <ErrorMessage message={error} />}
                {results && (
                    <div className="space-y-4">
                        {results.length > 0 ? results.map((hadith, index) => (
                            <div key={index} className="glass-card p-4 animate-fade-in">
                                <p className="mb-2 text-lg">"{hadith.hadithText}"</p>
                                <p className="text-xs text-[var(--text-secondary)] font-medium mb-3">{hadith.reference}</p>
                                <div className="pt-3 border-t border-[var(--border-color)]">
                                    <h4 className="font-semibold text-xs text-[var(--accent-primary)] uppercase tracking-wider">{t('hadithExplanation')}</h4>
                                    <p className="text-sm mt-1">{hadith.explanation}</p>
                                </div>
                            </div>
                        )) : <p className="text-center text-[var(--text-secondary)]">{t('hadithSearchNoResults')}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HadithSearch;
