
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

const ZakatCalculator: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [wealth, setWealth] = useState('');
    const [zakatAmount, setZakatAmount] = useState<number | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setZakatAmount(null);

        const amount = parseFloat(wealth);
        if (isNaN(amount) || amount < 0) {
            setError(t('zakatError'));
            return;
        }

        const zakat = amount * 0.025;
        setZakatAmount(zakat);
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('zakatTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('zakatDescription')}</p>
            </div>

            <form onSubmit={handleCalculate} className="w-full max-w-md mx-auto glass-card p-6 space-y-4">
                <div>
                    <label htmlFor="wealth" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                        {t('zakatTotalWealth')}
                    </label>
                    <input
                        type="number"
                        id="wealth"
                        value={wealth}
                        onChange={(e) => setWealth(e.target.value)}
                        placeholder="e.g., 10000"
                        className="w-full p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                        required
                    />
                     <p className="text-xs text-[var(--text-secondary)] mt-2">{t('zakatNisabInfo')}</p>
                </div>
                
                 {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300"
                >
                    {t('zakatCalculate')}
                </button>
            </form>

            {zakatAmount !== null && (
                <div className="mt-6 text-center max-w-md mx-auto glass-card p-6 animate-fade-in">
                    <p className="text-lg text-[var(--text-secondary)]">{t('zakatAmount')}</p>
                    <p className="text-4xl font-bold text-[var(--accent-primary)] mt-2">
                        {zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ZakatCalculator;
