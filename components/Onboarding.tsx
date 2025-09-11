import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

const Onboarding: React.FC = () => {
    const { t, language, completeOnboarding } = useContext(LanguageContext) as LanguageContextType;

    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="mb-8 h-20 w-20 flex items-center justify-center rounded-full bg-white/5 text-[var(--accent-primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
            <h1 className={`font-lora text-4xl font-bold text-white mb-3 ${language === 'ar' ? 'font-amiri' : ''}`}>
                {t('welcomeTitle')}
            </h1>
            <p className="text-[var(--text-secondary)] mb-12 text-lg max-w-sm">
                {t('welcomeDescription')}
            </p>
            
            <button 
                onClick={completeOnboarding} 
                className="w-full max-w-sm py-4 px-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--accent-text)] font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
            >
                {t('continueButton')}
            </button>
        </div>
    );
};

export default Onboarding;