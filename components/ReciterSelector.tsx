
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Reciter } from '../types';
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
                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
            >
                {recitersData.map(r => (
                    <option key={r.identifier} value={r.identifier}>
                        {r.name[language]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ReciterSelector;
