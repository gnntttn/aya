import React, { useContext, useState } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import { recitersData } from '../data/recitersData';
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

interface SettingsProps {
    onNavigate: (view: 'admin') => void;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
    const { t, language, setLanguage, theme, setTheme, reciter, setReciter, notificationPermission, setNotificationPermission } = useContext(LanguageContext) as LanguageContextType;
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

    const handleRequestNotificationPermission = async () => {
        if (typeof Notification !== 'undefined') {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };

    const getNotificationButton = () => {
        switch (notificationPermission) {
            case 'granted':
                return <span className="text-sm font-semibold text-green-400">{t('notifEnabled')}</span>;
            case 'denied':
                return (
                    <div className="text-right">
                        <span className="text-sm font-semibold text-red-400">{t('notifBlocked')}</span>
                        <p className="text-xs text-[var(--text-secondary)] max-w-[150px]">{t('notifBlockedHelp')}</p>
                    </div>
                );
            default:
                return (
                     <button onClick={handleRequestNotificationPermission} className="flex items-center justify-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] font-semibold rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm">
                        {t('notifEnable')}
                    </button>
                );
        }
    };

    return (
        <div className="w-full">
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

                {/* Reciter Setting Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/10 text-purple-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                        </div>
                        <label id="reciter-label" className="font-semibold text-base text-[var(--text-primary)]">{t('settingsReciter')}</label>
                    </div>
                    <div className="w-auto sm:w-56 shrink-0 select-with-chevron">
                        <select
                            id="reciter-select-settings"
                            value={reciter.identifier}
                            onChange={(e) => {
                                const selectedIdentifier = e.target.value;
                                const selectedReciter = recitersData.find(r => r.identifier === selectedIdentifier);
                                if (selectedReciter) {
                                    setReciter(selectedReciter);
                                }
                            }}
                            className="w-full px-4 py-2 text-sm text-[var(--text-primary)] bg-black/5 dark:bg-white/5 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] transition-colors duration-200"
                        >
                            {recitersData.map(r => (
                                <option key={r.identifier} value={r.identifier} className="bg-[var(--bg-secondary-solid)] text-[var(--text-primary)]">
                                    {r.name[language]}
                                </option>
                            ))}
                        </select>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>

                 {/* Notification Settings Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </div>
                         <span className="font-semibold text-base text-[var(--text-primary)]">{t('settingsNotifications')}</span>
                    </div>
                    {getNotificationButton()}
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

                {/* Admin Dashboard Row */}
                <div className="flex items-center justify-between gap-4 py-3 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-500/10 text-gray-400 shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                         <span className="font-semibold text-base text-[var(--text-primary)]">{t('navAdmin')}</span>
                    </div>
                     <button onClick={() => onNavigate('admin')} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;