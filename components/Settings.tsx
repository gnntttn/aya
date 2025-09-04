
import React, { useContext, useState } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import InstallGuideModal from './InstallGuideModal';

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
    const [showInstallModal, setShowInstallModal] = useState(false);
    
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
            {showInstallModal && <InstallGuideModal onClose={() => setShowInstallModal(false)} />}
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('settingsTitle')}</h2>

            <div className="glass-card divide-y divide-[var(--border-color)] p-2">
                
                {/* Language Setting Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sky-500/10 text-sky-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M7.5 21L3 16.5m1.5-10.5L7 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <label id="language-label" className="font-semibold text-base text-[var(--text-primary)]">{t('chooseLanguage')}</label>
                    </div>
                    <div className="w-auto sm:w-56 shrink-0">
                         <SegmentedControl id="language-selector" options={languageOptions} selectedValue={language} onChange={setLanguage} />
                    </div>
                </div>

                {/* Theme Setting Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <label id="theme-label" className="font-semibold text-base text-[var(--text-primary)]">{t('themeTitle')}</label>
                    </div>
                    <div className="w-auto sm:w-56 shrink-0">
                        <SegmentedControl id="theme-selector" options={themeOptions} selectedValue={theme} onChange={setTheme} />
                    </div>
                </div>
                
                {/* Share App Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                         <span className="font-semibold text-base text-[var(--text-primary)]">{t('settingsShareTitle')}</span>
                    </div>
                     <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] font-semibold rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm"
                    >
                        <span>{linkCopied ? t('settingsLinkCopied') : t('settingsShareButton')}</span>
                    </button>
                </div>

                {/* Install App Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/10 text-green-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                         <span className="font-semibold text-base text-[var(--text-primary)]">{t('settingsInstallApp')}</span>
                    </div>
                     <button
                        onClick={() => setShowInstallModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] font-semibold rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm"
                    >
                        <span>{t('settingsInstallButton')}</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
