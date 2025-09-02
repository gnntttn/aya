
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
        <div className="w-full sm:w-auto">
            <label htmlFor="reciter-select" className="sr-only">{t('selectReciter')}</label>
            <select
                id="reciter-select"
                value={reciter.identifier}
                onChange={handleReciterChange}
                className="w-full px-3 py-2 text-sm text-[var(--text-primary)] bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors duration-200 appearance-none text-center sm:text-left"
            >
                {recitersData.map(r => (
                    <option key={r.identifier} value={r.identifier} className="bg-[var(--bg-secondary-solid)] text-[var(--text-primary)]">
                        {r.name[language]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ReciterSelector;
