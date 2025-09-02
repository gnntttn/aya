
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import { dhikrData } from '../data/dhikrData';

const Tasbih: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;

    const [count, setCount] = useState<number>(() => {
        const savedCount = localStorage.getItem('tasbih-count');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    const [dhikrIndex, setDhikrIndex] = useState<number>(() => {
        const savedIndex = localStorage.getItem('tasbih-dhikr-index');
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    });

    const [cycle, setCycle] = useState<number>(() => {
         const savedCycle = localStorage.getItem('tasbih-cycle');
        return savedCycle ? parseInt(savedCycle, 10) : 0;
    });
    
    const [showCycleComplete, setShowCycleComplete] = useState(false);
    
    const TARGET = 33;
    const currentDhikrList = dhikrData[language];

    useEffect(() => {
        localStorage.setItem('tasbih-count', count.toString());
        localStorage.setItem('tasbih-dhikr-index', dhikrIndex.toString());
        localStorage.setItem('tasbih-cycle', cycle.toString());
    }, [count, dhikrIndex, cycle]);

    const handleIncrement = () => {
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        if (count + 1 === TARGET) {
            setShowCycleComplete(true);
            setTimeout(() => setShowCycleComplete(false), 1500);
            
            const nextIndex = (dhikrIndex + 1) % currentDhikrList.length;
            setDhikrIndex(nextIndex);
            
            if (nextIndex === 0) {
                setCycle(c => c + 1);
            }
            setCount(0);
        } else {
            setCount(c => c + 1);
        }
    };
    
    const handleReset = () => {
        setCount(0);
        setDhikrIndex(0);
        setCycle(0);
    }
    
    const progressPercentage = (count / TARGET) * 100;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fade-in p-4">
            <header className="mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('tasbihTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)]">{t('tasbihTarget', { count: TARGET })}</p>
            </header>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Progress Ring */}
                 <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="stroke-current text-[var(--border-color)]" strokeWidth="4" fill="transparent" />
                    <circle
                        cx="50" cy="50" r="45"
                        className="stroke-current text-[var(--accent-primary)]"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={(2 * Math.PI * 45) * (1 - progressPercentage / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                
                <button 
                    onClick={handleIncrement} 
                    className="w-56 h-56 sm:w-72 sm:h-72 rounded-full glass-card flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] transform active:scale-95 transition-transform duration-150"
                    aria-label="Increment tasbih count"
                >
                    <span className="font-lora text-7xl sm:text-8xl font-bold text-[var(--text-primary)]">{count}</span>
                </button>
            </div>
            
            <div className="mt-8 min-h-[6rem] flex flex-col items-center justify-center">
                {showCycleComplete ? (
                    <p className="font-lora text-2xl font-semibold text-green-400 animate-fade-in">{t('tasbihCycleComplete')}</p>
                ) : (
                    <p className={`font-amiri text-3xl text-center text-[var(--text-primary)] transition-opacity duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                        {currentDhikrList[dhikrIndex]}
                    </p>
                )}
                 <p className="text-sm text-[var(--text-secondary)] mt-2">Cycle: {cycle + 1}</p>
            </div>

            <button
                onClick={handleReset}
                className="mt-6 px-5 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
                {t('tasbihReset')}
            </button>
        </div>
    );
};

export default Tasbih;
