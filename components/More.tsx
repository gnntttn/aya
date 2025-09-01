
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { Language, LanguageContextType, Theme } from '../types';

const SegmentedControl: React.FC<{
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: any) => void;
}> = ({ options, selectedValue, onChange }) => {
    return (
        <div className="bg-black/10 dark:bg-white/10 rounded-full p-1 flex items-center space-x-1">
            {options.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`w-full px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                        selectedValue === value
                            ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] shadow'
                            : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    aria-pressed={selectedValue === value}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};


const More: React.FC = () => {
    const { t, language, setLanguage, theme, setTheme } = useContext(LanguageContext) as LanguageContextType;
    
    const languageOptions = [
        { value: 'en', label: 'EN' },
        { value: 'ar', label: 'AR' },
        { value: 'fr', label: 'FR' },
    ];
    
    const themeOptions = [
        { value: 'light', label: t('themeLight') },
        { value: 'dark', label: t('themeDark') },
        { value: 'system', label: t('themeSystem') },
    ];

    return (
        <div className="w-full animate-fade-in">
            <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-8 text-center">{t('moreTitle')}</h2>

            <div className="space-y-6">
                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md border border-[var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">{t('chooseLanguage')}</h3>
                    <SegmentedControl options={languageOptions} selectedValue={language} onChange={setLanguage} />
                </div>
                 <div className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-md border border-[var(--border-color)]">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">{t('themeTitle')}</h3>
                    <SegmentedControl options={themeOptions} selectedValue={theme} onChange={setTheme} />
                </div>
            </div>
        </div>
    )
};

export default More;