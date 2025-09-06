import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, FeatureUsage, ApiLogEntry } from '../types';
import { isApiKeyAvailable } from '../services/geminiService';

const AdminDashboard: React.FC = () => {
    const { t, featureFlags, setFeatureFlag } = useContext(LanguageContext) as LanguageContextType;
    
    // --- LOCAL STATE ---
    const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
    const [clearMessage, setClearMessage] = useState('');
    
    // States for data read from localStorage on mount
    const [usageStats, setUsageStats] = useState<FeatureUsage | null>(null);
    const [apiLog, setApiLog] = useState<ApiLogEntry[]>([]);
    const [overrideVerse, setOverrideVerse] = useState<{ surah: string; ayah: string } | null>(null);

    // States for form inputs
    const [surahInput, setSurahInput] = useState('');
    const [ayahInput, setAyahInput] = useState('');

    useEffect(() => {
        // Load all data from localStorage
        const usage = localStorage.getItem('aya-feature-usage');
        setUsageStats(usage ? JSON.parse(usage) : null);

        const logs = localStorage.getItem('aya-api-log');
        setApiLog(logs ? JSON.parse(logs) : []);

        const override = localStorage.getItem('aya-verse-override');
        if (override) {
            const parsed = JSON.parse(override);
            setOverrideVerse(parsed);
            setSurahInput(parsed.surah);
            setAyahInput(parsed.ayah);
        }

        // Get API Status
        isApiKeyAvailable().then(available => {
            setApiStatus(available ? 'available' : 'unavailable');
        });
    }, []);

    const handleClearData = () => {
        if (window.confirm(t('adminConfirmClear'))) {
            const lang = localStorage.getItem('aya-lang');
            const theme = localStorage.getItem('aya-theme');
            const onboarding = localStorage.getItem('onboarding-complete');

            localStorage.clear();

            // Preserve essential settings
            if (lang) localStorage.setItem('aya-lang', lang);
            if (theme) localStorage.setItem('aya-theme', theme);
            if (onboarding) localStorage.setItem('onboarding-complete', onboarding);

            setClearMessage(t('adminDataCleared'));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    const handleSetOverride = (e: React.FormEvent) => {
        e.preventDefault();
        if (surahInput && ayahInput) {
            const newOverride = { surah: surahInput, ayah: ayahInput };
            localStorage.setItem('aya-verse-override', JSON.stringify(newOverride));
            setOverrideVerse(newOverride);
        }
    };

    const handleClearOverride = () => {
        localStorage.removeItem('aya-verse-override');
        setOverrideVerse(null);
        setSurahInput('');
        setAyahInput('');
    };

    return (
        <div className="w-full animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('adminTitle')}</h2>

            <div className="space-y-6">
                
                {/* Feature Usage Stats */}
                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminFeatureUsage')}</h3>
                    {usageStats && Object.keys(usageStats).length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(usageStats).sort(([, a], [, b]) => b - a).map(([feature, count]) => (
                                <div key={feature} className="flex justify-between items-center p-2 bg-black/5 dark:bg-white/5 rounded-md">
                                    <span className="font-medium text-[var(--text-secondary)] capitalize">{feature}</span>
                                    <span className="font-semibold text-[var(--text-primary)]">{count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-[var(--text-secondary)] py-4">{t('adminNoUsage')}</p>
                    )}
                </div>

                {/* API Performance Log */}
                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminApiLog')}</h3>
                    {apiLog.length > 0 ? (
                        <div className="text-xs space-y-1">
                            <div className="grid grid-cols-3 gap-2 font-bold text-[var(--text-secondary)] px-2">
                                <span>{t('adminLogType')}</span>
                                <span className="text-center">{t('adminLogDuration')}</span>
                                <span className="text-right">{t('adminLogStatus')}</span>
                            </div>
                            {apiLog.map(log => (
                                <div key={log.timestamp} className="grid grid-cols-3 gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-md items-center">
                                    <div>
                                        <p className="font-semibold capitalize text-[var(--text-primary)]">{log.type}</p>
                                        <p className="text-[var(--text-secondary)]">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                    <p className="text-center font-mono text-[var(--text-primary)]">{log.duration}ms</p>
                                    <p className={`text-right font-bold ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                                        {log.success ? t('adminLogSuccess') : t('adminLogFailed')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-center text-[var(--text-secondary)] py-4">{t('adminNoApiLogs')}</p>
                    )}
                </div>

                {/* Dynamic Content Management */}
                <div className="glass-card p-4">
                    <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-2">{t('adminDynamicContent')}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">{t('adminOverrideInstructions')}</p>
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 mb-3 text-sm">
                        <span className="font-semibold text-[var(--text-secondary)]">{t('adminCurrentOverride')}: </span>
                        {overrideVerse ? (
                            <span className="font-bold text-[var(--accent-primary)]">{`S${overrideVerse.surah}:A${overrideVerse.ayah}`}</span>
                        ) : (
                            <span className="font-bold text-[var(--text-primary)]">{t('adminNoOverride')}</span>
                        )}
                    </div>
                    <form onSubmit={handleSetOverride} className="flex items-stretch gap-2">
                        <input type="number" value={surahInput} onChange={e => setSurahInput(e.target.value)} placeholder={t('adminSurahNumber')} className="w-full p-2 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]" />
                        <input type="number" value={ayahInput} onChange={e => setAyahInput(e.target.value)} placeholder={t('adminAyahNumber')} className="w-full p-2 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]" />
                        <button type="submit" className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg">{t('adminSet')}</button>
                        <button type="button" onClick={handleClearOverride} className="px-4 py-2 bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold rounded-lg">{t('adminClear')}</button>
                    </form>
                </div>

                {/* Feature Flags */}
                <div className="glass-card p-4">
                     <h3 className="font-lora text-lg font-semibold text-[var(--accent-primary)] mb-3">{t('adminFeatureFlags')}</h3>
                     <div className="space-y-3">
                        <label htmlFor="newQuranUI" className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg cursor-pointer">
                            <div>
                                <p className="font-semibold text-sm text-[var(--text-primary)]">{t('adminFeatureNewQuranUI')}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{t('adminFeatureDescNewQuranUI')}</p>
                            </div>
                            <input type="checkbox" id="newQuranUI" checked={!!featureFlags.newQuranUI} onChange={e => setFeatureFlag('newQuranUI', e.target.checked)} className="h-5 w-5 rounded accent-[var(--accent-primary)]"/>
                        </label>
                     </div>
                </div>

                {/* General Admin Actions */}
                <div className="pt-4">
                    <h3 className="font-lora text-lg font-semibold text-center text-[var(--accent-primary)] mb-3">{t('adminDeviceData')}</h3>
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
