import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

const TOTAL_PAGES = 604;

const KhatmahTracker: React.FC = () => {
    const { t, khatmah, startKhatmah, updateKhatmahProgress, resetKhatmah } = useContext(LanguageContext) as LanguageContextType;
    const [targetDate, setTargetDate] = useState('');
    const [pagesToAdd, setPagesToAdd] = useState('');

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetDate) {
            startKhatmah(new Date(targetDate).toISOString());
        }
    };

    const handleAddProgress = (e: React.FormEvent) => {
        e.preventDefault();
        const pages = parseInt(pagesToAdd, 10);
        if (!isNaN(pages) && pages > 0) {
            updateKhatmahProgress(pages);
            setPagesToAdd('');
        }
    };

    // Setup or Completion View
    if (!khatmah || khatmah.pagesRead >= TOTAL_PAGES) {
        return (
            <div className="w-full animate-fade-in text-center">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{khatmah ? t('khatmahCompletedTitle') : t('khatmahTrackerTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">{khatmah ? t('khatmahCompletedDesc') : t('khatmahTrackerDesc')}</p>
                
                <div className="w-full max-w-sm mx-auto glass-card p-6 space-y-4">
                    {khatmah ? (
                         <button type="button" onClick={resetKhatmah} className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)]">
                            {t('khatmahStartNew')}
                        </button>
                    ) : (
                        <form onSubmit={handleStart} className="space-y-4">
                            <div>
                                <label htmlFor="targetDate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('khatmahTargetDate')}</label>
                                <input
                                    type="date"
                                    id="targetDate"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border-none rounded-lg bg-black/5 dark:bg-white/5 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)]">
                                {t('khatmahStartButton')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }
    
    // Progress View
    const progressPercentage = (khatmah.pagesRead / TOTAL_PAGES) * 100;
    const target = new Date(khatmah.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.max(0, target.getTime() - today.getTime());
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const pagesRemaining = TOTAL_PAGES - khatmah.pagesRead;
    const dailyGoal = daysLeft > 0 ? Math.ceil(pagesRemaining / daysLeft) : pagesRemaining;

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
        <div className="w-full animate-fade-in text-center">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-8">{t('khatmahProgressTitle')}</h2>
            
            <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} className="stroke-current text-[var(--border-color)]" strokeWidth="12" fill="transparent" />
                    <circle
                        cx="100" cy="100" r={radius}
                        className="stroke-current text-[var(--accent-primary)]"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                        transform="rotate(-90 100 100)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-bold text-5xl text-[var(--text-primary)]">{Math.round(progressPercentage)}%</span>
                    <span className="text-sm text-[var(--text-secondary)]">{t('khatmahPagesReadOf', { read: khatmah.pagesRead, total: TOTAL_PAGES })}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
                <div className="glass-card p-3">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{daysLeft}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{t('khatmahDaysLeft', { days: daysLeft })}</p>
                </div>
                 <div className="glass-card p-3">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{dailyGoal}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{t('khatmahDailyGoal', { pages: dailyGoal })}</p>
                </div>
            </div>

            <form onSubmit={handleAddProgress} className="w-full max-w-sm mx-auto glass-card p-4">
                 <label htmlFor="pagesToAdd" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('khatmahLogToday')}</label>
                 <div className="flex items-stretch gap-2">
                    <input
                        type="number"
                        id="pagesToAdd"
                        value={pagesToAdd}
                        onChange={(e) => setPagesToAdd(e.target.value)}
                        placeholder={t('khatmahLogPlaceholder')}
                        className="w-full p-3 border-none rounded-lg bg-black/5 dark:bg-white/5 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                        min="1"
                        required
                    />
                    <button type="submit" className="px-6 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)]">
                        {t('khatmahAddProgress')}
                    </button>
                 </div>
            </form>

             <button onClick={resetKhatmah} className="mt-4 text-xs text-red-400 hover:underline">
                {t('khatmahStartNew')}
            </button>
        </div>
    );
};

export default KhatmahTracker;
