
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Dhikr } from '../types';
import { adhkarData } from '../data/adhkarData';

const DhikrCard: React.FC<{ dhikr: Dhikr }> = ({ dhikr }) => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [currentCount, setCurrentCount] = useState(0);

    const handleTap = () => {
        if (currentCount < dhikr.count) {
            setCurrentCount(c => c + 1);
            if (navigator.vibrate) navigator.vibrate(50);
        }
    };
    
    const isComplete = currentCount >= dhikr.count;

    return (
        <div className={`glass-card p-4 transition-all duration-300 ${isComplete ? 'opacity-50' : ''}`}>
            <p dir="rtl" className="font-amiri text-2xl leading-relaxed text-right text-[var(--text-primary)] mb-3">{dhikr.arabic}</p>
            <p className="italic text-sm text-[var(--text-secondary)] mb-2">{dhikr.transliteration}</p>
            <p className="text-sm text-[var(--text-primary)] mb-4">{dhikr.translation}</p>
            
            <div className="pt-4 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2"><span className="font-semibold text-[var(--accent-primary)]">{t('adhkarVirtue')}:</span> {dhikr.virtue}</p>
                
                <div className="flex items-center justify-between mt-2">
                    <div className="text-sm font-semibold">
                        {t('adhkarCount')}: <span className="text-[var(--accent-primary)]">{dhikr.count}</span>
                    </div>
                    <button 
                        onClick={handleTap} 
                        disabled={isComplete}
                        className="w-24 h-12 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 disabled:bg-green-500/20 group transition-colors"
                    >
                       <span className={`font-bold text-lg ${isComplete ? 'text-green-400' : 'text-[var(--text-primary)]'}`}>
                            {isComplete ? '✓' : currentCount}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};


const Adhkar: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

    const content = activeTab === 'morning' ? adhkarData.morning[language] : adhkarData.evening[language];

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('adhkarTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('adhkarDescription')}</p>
            </div>

            <div className="mb-6 bg-black/5 dark:bg-white/5 rounded-full p-1 flex items-center" role="tablist">
                <button
                    onClick={() => setActiveTab('morning')}
                    role="tab"
                    aria-selected={activeTab === 'morning'}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] ${activeTab === 'morning' ? 'text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
                >
                    {activeTab === 'morning' && <span className="absolute inset-0 bg-[var(--accent-primary)] rounded-full shadow -z-10"></span>}
                    <span className="relative">{t('adhkarMorning')}</span>
                </button>
                 <button
                    onClick={() => setActiveTab('evening')}
                    role="tab"
                    aria-selected={activeTab === 'evening'}
                    className={`w-full py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary-solid)] focus:ring-[var(--accent-primary)] ${activeTab === 'evening' ? 'text-[var(--accent-text)]' : 'text-[var(--text-secondary)]'}`}
                >
                    {activeTab === 'evening' && <span className="absolute inset-0 bg-[var(--accent-primary)] rounded-full shadow -z-10"></span>}
                    <span className="relative">{t('adhkarEvening')}</span>
                </button>
            </div>

            <div className="space-y-4">
                {content.map((dhikr, index) => (
                    <DhikrCard key={`${activeTab}-${index}`} dhikr={dhikr} />
                ))}
            </div>
        </div>
    );
};

export default Adhkar;
