import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, HistorySummary } from '../types';
import { getIslamicHistorySummary } from '../services/geminiService';
import { historyTopics } from '../data/historyData';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const IslamicHistory: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [summary, setSummary] = useState<HistorySummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topicList = historyTopics[language];

    useEffect(() => {
        if (!selectedTopic) return;

        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            setSummary(null);
            try {
                const result = await getIslamicHistorySummary(selectedTopic, language);
                setSummary(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load summary.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();

    }, [selectedTopic, language]);
    
    if (selectedTopic) {
        return (
             <div className="w-full animate-fade-in">
                 <button onClick={() => setSelectedTopic(null)} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                     {t('back')}
                </button>
                <div className="text-center mb-8">
                     <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{selectedTopic}</h2>
                </div>
                 {isLoading && <LoadingIndicator message={t('islamicHistoryLoading')} />}
                 {error && <ErrorMessage message={error} />}
                 {summary && (
                     <div className="glass-card p-6 space-y-5 animate-fade-in text-left">
                        <div>
                            <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)] mb-2">{t('historySummary')}</h3>
                            <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{summary.summary}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                            <div>
                                <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)] mb-2">{t('historyKeyFigures')}</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-primary)]">
                                    {summary.keyFigures.map((figure, i) => <li key={i}>{figure}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)] mb-2">{t('historyKeyEvents')}</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-primary)]">
                                    {summary.keyEvents.map((event, i) => <li key={i}>{event}</li>)}
                                </ul>
                            </div>
                        </div>
                         <div className="pt-4 border-t border-[var(--border-color)]">
                             <h3 className="font-lora font-bold text-lg text-[var(--accent-primary)] mb-2">{t('historySignificance')}</h3>
                             <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{summary.significance}</p>
                        </div>
                     </div>
                 )}
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('islamicHistoryTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('islamicHistoryDescription')}</p>
            </div>

            <div className="space-y-3">
                {topicList.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className="w-full text-left glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group"
                    >
                        <span className="font-semibold text-base text-[var(--text-primary)]">{topic}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IslamicHistory;
