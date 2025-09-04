import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import { recitersData } from '../data/recitersData';

const ReciterSelector: React.FC = () => {
    const { t, reciter, setReciter, language } = useContext(LanguageContext) as LanguageContextType;
    
    const handleReciterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIdentifier = e.target.value;
        const selectedReciter = recitersData.find(r => r.identifier === selectedIdentifier);
        if (selectedReciter) {
            setReciter(selectedReciter);
        }
    };

    return (
        <div className="relative flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-full sm:w-auto w-full max-w-[200px]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <label htmlFor="reciter-select" className="sr-only">{t('selectReciter')}</label>
            <select
                id="reciter-select"
                value={reciter.identifier}
                onChange={handleReciterChange}
                className="w-full pl-1 pr-8 py-2 text-sm text-[var(--text-primary)] bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors duration-200 appearance-none text-left truncate"
            >
                {recitersData.map(r => (
                    <option key={r.identifier} value={r.identifier} className="bg-[var(--bg-secondary-solid)] text-[var(--text-primary)]">
                        {r.name[language]}
                    </option>
                ))}
            </select>
            <svg className="h-5 w-5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>
    );
};

export default ReciterSelector;
