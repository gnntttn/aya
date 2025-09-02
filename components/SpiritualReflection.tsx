import React, { useState, useContext, useEffect } from 'react';
import type { LanguageContextType, Reflection } from '../types';
import { LanguageContext } from '../types';
import { getSpiritualReflection, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

const SpiritualReflection: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [feeling, setFeeling] = useState('');
    const [reflection, setReflection] = useState<Reflection | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiKeyAvailable, setApiKeyAvailable] = useState(true); // Assume available initially

    // Check for today's reflection in local storage on component mount
    useEffect(() => {
        const checkApiKey = async () => {
            const available = await isApiKeyAvailable();
            setApiKeyAvailable(available);
             if (!available) {
                // If API key is not available, don't attempt to load reflection
                return;
            }
        };
        checkApiKey();

        const storedReflection = localStorage.getItem('daily-reflection');
        if (storedReflection) {
            const parsed = JSON.parse(storedReflection) as Reflection;
            const today = new Date().toDateString();
            if (parsed.date === today) {
                setReflection(parsed);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feeling.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const responseText = await getSpiritualReflection(feeling, language);
            const newReflection: Reflection = {
                feeling,
                response: responseText,
                date: new Date().toDateString()
            };
            setReflection(newReflection);
            localStorage.setItem('daily-reflection', JSON.stringify(newReflection));
        } catch (err) {
            setError(err instanceof Error ? err.message : t('errorMessage'));
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKeyAvailable) {
        // Don't render the component if the API key is missing
        return null;
    }

    if (reflection) {
        return (
            <div className="w-full glass-card p-5 animate-fade-in">
                <h3 className="font-lora font-semibold text-lg text-[var(--text-primary)] mb-3 text-center">{t('spiritualCompanionToday')}</h3>
                <div className="text-sm text-[var(--text-secondary)] mb-3 text-center italic">
                   {t('spiritualCompanionPrompt')} "{reflection.feeling}"
                </div>
                <p className="text-base text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{reflection.response}</p>
            </div>
        );
    }
    
    return (
        <div className="w-full glass-card p-5 animate-fade-in">
            <h3 className="font-lora font-semibold text-lg text-[var(--text-primary)] mb-2 text-center">{t('spiritualCompanionTitle')}</h3>
            <p className="text-sm text-center text-[var(--text-secondary)] mb-4">{t('spiritualCompanionPrompt')}</p>

            {isLoading ? (
                <LoadingIndicator message={t('spiritualCompanionLoading')} />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={feeling}
                        onChange={(e) => setFeeling(e.target.value)}
                        placeholder={t('spiritualCompanionPlaceholder')}
                        className="flex-grow p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !feeling.trim()}
                        className="px-5 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        {t('spiritualCompanionSubmit')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default SpiritualReflection;