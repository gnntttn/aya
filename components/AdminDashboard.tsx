import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import { isApiKeyAvailable } from '../services/geminiService';

interface Stat {
    language: string;
    theme: string;
    duas: number;
    bookmarks: number;
    goals: number;
}

interface DeviceInfo {
    os: string;
    browser: string;
}

const StatItem: React.FC<{ label: string; value: string | number; icon: JSX.Element; }> = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="text-[var(--accent-primary)]">{icon}</div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        </div>
        <span className="font-semibold text-sm text-[var(--text-primary)]">{value}</span>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [stats, setStats] = useState<Stat | null>(null);
    const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [clearMessage, setClearMessage] = useState('');

    useEffect(() => {
        // Load stats from localStorage
        const lang = localStorage.getItem('aya-lang') || 'not set';
        const theme = localStorage.getItem('aya-theme') || 'not set';
        const duas = JSON.parse(localStorage.getItem('aya-saved-duas') || '[]').length;
        const bookmarks = JSON.parse(localStorage.getItem('aya-bookmarks') || '[]').length;
        const goals = JSON.parse(localStorage.getItem('aya-goals') || '[]').length;
        setStats({ language: lang, theme, duas, bookmarks, goals });

        // Get API Status
        isApiKeyAvailable().then(available => {
            setApiStatus(available ? 'available' : 'unavailable');
        });

        // Get Device Info
        const ua = navigator.userAgent;
        let os = "Unknown";
        if (/Windows/.test(ua)) os = "Windows";
        if (/Mac/.test(ua)) os = "macOS";
        if (/Android/.test(ua)) os = "Android";
        if (/Linux/.test(ua)) os = "Linux";
        if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

        let browser = "Unknown";
        if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
        else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
        else if (ua.includes("Edge")) browser = "Edge";
        else if (ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Safari")) browser = "Safari";
        
        setDeviceInfo({ os, browser });

    }, []);
    
    const handleClearData = () => {
        if (window.confirm(t('adminConfirmClear'))) {
            localStorage.clear();
            setClearMessage(t('adminDataCleared'));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    const icons = {
        lang: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M7.5 21L3 16.5m1.5-10.5L7 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        theme: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        dua: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5V4H4zm0 10h5v5H4v-5zm10 0h5v5h-5v-5zm10-5a5 5 0 00-5-5h-5v5h5a5 5 0 005-5z" /></svg>,
        bookmark: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
        goal: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
        os: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        browser: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 00-9-9" /></svg>,
    };

    return (
        <div className="w-full animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('adminTitle')}</h2>

            <div className="space-y-6">
                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminUsageStats')}</h3>
                    {stats && (
                        <div className="space-y-2">
                            <StatItem label={t('adminLanguage')} value={stats.language.toUpperCase()} icon={icons.lang} />
                            <StatItem label={t('adminTheme')} value={stats.theme} icon={icons.theme} />
                            <StatItem label={t('adminSavedDuas')} value={stats.duas} icon={icons.dua} />
                            <StatItem label={t('adminBookmarks')} value={stats.bookmarks} icon={icons.bookmark} />
                            <StatItem label={t('adminGoals')} value={stats.goals} icon={icons.goal} />
                        </div>
                    )}
                </div>
                
                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminApiStatus')}</h3>
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${apiStatus === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className={`h-3 w-3 rounded-full ${apiStatus === 'available' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        <span className="font-semibold text-sm">
                            {apiStatus === 'checking' ? 'Checking...' : (apiStatus === 'available' ? t('adminApiAvailable') : t('adminApiUnavailable'))}
                        </span>
                    </div>
                </div>

                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminDeviceData')}</h3>
                    {deviceInfo && (
                         <div className="space-y-2">
                            <StatItem label={t('adminOS')} value={deviceInfo.os} icon={icons.os} />
                            <StatItem label={t('adminBrowser')} value={deviceInfo.browser} icon={icons.browser} />
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleClearData}
                        className="w-full px-4 py-2 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        {clearMessage || t('adminClearData')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
