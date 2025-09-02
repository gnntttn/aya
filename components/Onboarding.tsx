
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { Language, LanguageContextType } from '../types';

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const { setLanguage, t, language } = useContext(LanguageContext) as LanguageContextType;
    const [step, setStep] = useState(1);
    const [selectedLang, setSelectedLang] = useState<Language>(language);

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setStep(2);
    };

    const LanguageStep = () => (
        <div className="w-full max-w-sm text-center">
             <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M7.5 21L3 16.5m1.5-10.5L7 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="font-lora text-2xl font-bold text-white mb-2">Choose Your Language</h1>
            <p className="font-amiri text-2xl text-gray-300 mb-8">اختر لغتك</p>
            <div className="space-y-4">
                <button onClick={() => handleLanguageSelect('en')} className="w-full py-3 px-4 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold rounded-lg transition-colors duration-300">English</button>
                <button onClick={() => handleLanguageSelect('ar')} className="w-full py-3 px-4 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold rounded-lg transition-colors duration-300">العربية</button>
                <button onClick={() => handleLanguageSelect('fr')} className="w-full py-3 px-4 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold rounded-lg transition-colors duration-300">Français</button>
            </div>
        </div>
    );

    const WelcomeStep = () => (
        <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h1 className="font-lora text-3xl font-bold text-white mb-2">{t('welcomeTitle')}</h1>
            <p className="text-gray-300 mb-10">{t('welcomeDescription')}</p>
            
            <button onClick={onComplete} className="w-full py-3 px-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                {t('continueButton')}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4 animate-fade-in">
            {step === 1 ? <LanguageStep /> : <WelcomeStep />}
        </div>
    );
};

export default Onboarding;
