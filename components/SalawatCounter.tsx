
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

const SalawatCounter: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;

    const [count, setCount] = useState<number>(() => {
        const savedCount = localStorage.getItem('salawat-count');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('salawat-count', count.toString());
    }, [count]);

    const handleIncrement = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setCount(c => c + 1);
    };
    
    const handleReset = () => {
        setCount(0);
    }
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fade-in p-4">
            <header className="mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('salawatTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)]">{t('salawatDescription')}</p>
            </header>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <button 
                    onClick={handleIncrement} 
                    className="w-56 h-56 sm:w-72 sm:h-72 rounded-full glass-card flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] transform active:scale-95 transition-transform duration-150"
                    aria-label="Increment salawat count"
                >
                    <span className="font-lora text-7xl sm:text-8xl font-bold text-[var(--text-primary)]">{count}</span>
                </button>
            </div>
            
            <div className="mt-8 min-h-[4rem] flex flex-col items-center justify-center">
                <p className="font-amiri text-2xl text-center text-[var(--text-primary)] transition-opacity duration-300">
                    {t('salawatText')}
                </p>
            </div>

            <button
                onClick={handleReset}
                className="mt-6 px-5 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
                {t('tasbihReset')}
            </button>
        </div>
    );
};

export default SalawatCounter;
