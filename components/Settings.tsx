
import React, { useContext, useState } from 'react';
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
    const [linkCopied, setLinkCopied] = useState(false);
    
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

    const handleShare = async () => {
        const shareData = {
            title: t('welcomeTitle'),
            text: t('welcomeDescription'),
            url: 'https://play.google.com/store/apps/details?id=aya.aplicyfd'
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareData.url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

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
                <div className="glass-card p-4">
                    <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)] px-2">{t('settingsShareTitle')}</h3>
                     <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                        {linkCopied ? t('settingsLinkCopied') : t('settingsShareButton')}
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Settings;
