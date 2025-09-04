
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, TravelInfo } from '../types';
import { getHalalTravelInfo } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

const HalalTravel: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [city, setCity] = useState('');
    const [info, setInfo] = useState<TravelInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setIsLoading(true);
        setError(null);
        setInfo(null);
        try {
            const result = await getHalalTravelInfo(city, language);
            setInfo(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get travel info.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('travelTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('travelDescription')}</p>
            </div>
            
             <form onSubmit={handleSubmit} className="w-full max-w-lg mb-6 glass-card p-4 flex items-center gap-2">
                <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('travelPlaceholder')}
                    className="w-full p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !city.trim()}
                    className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60"
                >
                    {t('travelSubmit')}
                </button>
            </form>

            <div className="w-full max-w-lg mt-4">
                {isLoading && <LoadingIndicator message={t('travelLoading')} />}
                {error && <ErrorMessage message={error} />}
                {info && (
                    <div className="glass-card p-6 animate-fade-in space-y-4">
                        <div>
                            <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-2">{t('travelMosques')}</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {info.mosques.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="pt-4 border-t border-[var(--border-color)]">
                            <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-2">{t('travelRestaurants')}</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {info.halalRestaurants.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="pt-4 border-t border-[var(--border-color)]">
                            <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-2">{t('travelTips')}</h3>
                            <p className="text-sm">{info.generalTips}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HalalTravel;
