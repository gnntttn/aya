
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, AsmaulHusna as AsmaulHusnaType } from '../types';
import { asmaulHusnaData } from '../data/asmaulHusnaData';
import AsmaulHusnaDetailModal from './AsmaulHusnaDetailModal';

const AsmaulHusna: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [selectedName, setSelectedName] = useState<AsmaulHusnaType | null>(null);

    const handleNameClick = (name: AsmaulHusnaType) => {
        setSelectedName(name);
    };

    const handleCloseModal = () => {
        setSelectedName(null);
    };

    return (
        <div className="w-full animate-fade-in">
            {selectedName && (
                <AsmaulHusnaDetailModal
                    name={selectedName}
                    onClose={handleCloseModal}
                />
            )}
            <div className="text-center mb-10">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('asmaulHusnaTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('asmaulHusnaDescription')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {asmaulHusnaData.map((name) => (
                    <button
                        key={name.id}
                        onClick={() => handleNameClick(name)}
                        className="w-full text-left glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                                <svg className="absolute w-full h-full opacity-40 group-hover:opacity-80 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 0L61.226 21.434L85.355 25.004L69.341 42.19L71.696 66.212L50 55.45L28.304 66.212L30.659 42.19L14.645 25.004L38.774 21.434L50 0Z" fill="currentColor"/>
                                </svg>
                                <span className="z-10 text-[var(--accent-text)]">{name.id}</span>
                            </div>
                            <div>
                                <p className={`font-semibold text-base text-[var(--text-primary)] ${language === 'ar' ? 'font-amiri' : ''}`}>{language === 'ar' ? name.ar : name.en.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{language === 'ar' ? name.en.name : name.ar}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AsmaulHusna;