
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

const SegmentedControl: React.FC<{
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: any) => void;
    id: string;
}> = ({ options, selectedValue, onChange, id }) => {
    return (
        <div className="bg-black/5 dark:bg-white/5 rounded-full p-1 flex items-center" role="group" aria-label={id}>
            {options.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`w-full px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] ${
                        selectedValue === value
                            ? 'text-[var(--accent-text)]'
                            : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    aria-pressed={selectedValue === value}
                >
                    {selectedValue === value && <span className="absolute inset-0 bg-[var(--accent-primary)] rounded-full shadow -z-10"></span>}
                    <span className="relative">{label}</span>
                </button>
            ))}
        </div>
    );
};


const Settings: React.FC = () => {
    const { t, language, setLanguage, theme, setTheme } = useContext(LanguageContext) as LanguageContextType;
    
    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'ar', label: 'العربية' },
        { value: 'fr', label: 'Français' },
    ];
    
    const themeOptions = [
        { value: 'light', label: t('themeLight') },
        { value: 'dark', label: t('themeDark') },
        { value: 'system', label: t('themeSystem') },
    ];

    return (
        <div className="w-full animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('settingsTitle')}</h2>

            <div className="space-y-6">
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)] px-2">{t('chooseLanguage')}</h3>
                    <SegmentedControl id="language-selector" options={languageOptions} selectedValue={language} onChange={setLanguage} />
                </div>
                 <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)] px-2">{t('themeTitle')}</h3>
                    <SegmentedControl id="theme-selector" options={themeOptions} selectedValue={theme} onChange={setTheme} />
                </div>
            </div>
        </div>
    )
};

export default Settings;
