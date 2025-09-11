import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, PrayerTimesData } from '../types';
import { getPrayerTimes } from '../services/prayerTimeService';

interface PrayerTimesCache {
    timestamp: number;
    coords: { latitude: number; longitude: number; };
    times: PrayerTimesData;
}

const PrayerTimesWidget: React.FC = () => {
    const { t, setView, setInitialMoreView } = useContext(LanguageContext) as LanguageContextType;
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; time: Date } | null>(null);
    const [countdown, setCountdown] = useState('');

    const calculateNextPrayer = useCallback((times: PrayerTimesData) => {
        const now = new Date();
        const prayerSchedule = Object.entries(times)
            .filter(([name]) => name !== 'Sunrise') // Exclude Sunrise from being a "next prayer"
            .map(([name, time]) => ({ name, time: new Date(`${now.toDateString()} ${time}`) }))
            .sort((a, b) => a.time.getTime() - b.time.getTime());

        let upcomingPrayer = prayerSchedule.find(p => p.time > now);

        if (!upcomingPrayer) {
            // If all prayers for today are done, the next prayer is Fajr tomorrow
            const tomorrowFajr = prayerSchedule[0];
            tomorrowFajr.time.setDate(tomorrowFajr.time.getDate() + 1);
            upcomingPrayer = tomorrowFajr;
        }
        
        setNextPrayerInfo(upcomingPrayer || null);
    }, []);

    const fetchAndSetPrayerTimes = useCallback(async (latitude: number, longitude: number) => {
        setStatus('loading');
        try {
            const data = await getPrayerTimes(latitude, longitude);
            setPrayerTimes(data);
            const cache: PrayerTimesCache = {
                timestamp: new Date().getTime(),
                coords: { latitude, longitude },
                times: data,
            };
            localStorage.setItem('aya-prayer-times-cache', JSON.stringify(cache));
            setStatus('success');
            calculateNextPrayer(data);
        } catch (err) {
            setError(t('homePrayerTimesLocationError'));
            setStatus('error');
        }
    }, [t, calculateNextPrayer]);

    useEffect(() => {
        const cachedDataString = localStorage.getItem('aya-prayer-times-cache');
        if (cachedDataString) {
            const cache: PrayerTimesCache = JSON.parse(cachedDataString);
            const cacheDate = new Date(cache.timestamp).toDateString();
            const todayDate = new Date().toDateString();

            if (cacheDate === todayDate) {
                setPrayerTimes(cache.times);
                setStatus('success');
                calculateNextPrayer(cache.times);
            } else {
                // Cache is old, re-fetch with saved coords
                fetchAndSetPrayerTimes(cache.coords.latitude, cache.coords.longitude);
            }
        }
    }, [fetchAndSetPrayerTimes, calculateNextPrayer]);
    
    useEffect(() => {
        if (!nextPrayerInfo) return;

        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = nextPrayerInfo.time.getTime() - now.getTime();

            if (diff < 0) {
                // Time has passed, recalculate
                if(prayerTimes) calculateNextPrayer(prayerTimes);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [nextPrayerInfo, prayerTimes, calculateNextPrayer]);

    const handleRequestLocation = () => {
        setStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => fetchAndSetPrayerTimes(position.coords.latitude, position.coords.longitude),
            () => {
                setError(t('homePrayerTimesLocationError'));
                setStatus('error');
            }
        );
    };
    
    const handleWidgetClick = () => {
        setInitialMoreView('prayer');
        setView('more');
    };

    const PrayerTimeItem: React.FC<{ name: string; time: string; isNext: boolean }> = ({ name, time, isNext }) => (
        <div className={`text-center rounded-lg p-2 transition-all duration-300 ${isNext ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : ''}`}>
            <p className="text-xs font-semibold">{name}</p>
            <p className={`font-mono text-sm font-bold ${isNext ? '' : 'text-[var(--text-secondary)]'}`}>{time}</p>
        </div>
    );
    
    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <div className="h-24 flex items-center justify-center text-[var(--text-secondary)]">{t('homePrayerTimesLoading')}</div>;
            case 'error':
                 return <div className="h-24 flex items-center justify-center text-red-400 text-sm p-4 text-center">{error}</div>;
            case 'success':
                if (!prayerTimes || !nextPrayerInfo) return null;
                const prayerOrder: (keyof PrayerTimesData)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                return (
                    <div onClick={handleWidgetClick} className="cursor-pointer">
                        <div className="grid grid-cols-5 gap-1 md:gap-2 mb-4">
                            {prayerOrder.map(prayer => (
                                <PrayerTimeItem
                                    key={prayer}
                                    name={t(`prayer${prayer}`)}
                                    time={prayerTimes[prayer]}
                                    isNext={nextPrayerInfo.name === prayer}
                                />
                            ))}
                        </div>
                        <div className="text-center pt-3 border-t border-[var(--border-color)]">
                             <p className="text-sm text-[var(--text-secondary)]">{t('homePrayerTimesNextPrayer', { prayerName: t(`prayer${nextPrayerInfo.name}`) })}</p>
                             <p className="font-mono text-3xl font-bold text-[var(--text-primary)] tracking-wider">{countdown}</p>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="h-24 flex flex-col items-center justify-center p-4">
                        <button onClick={handleRequestLocation} className="px-5 py-2.5 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] font-bold rounded-lg shadow-md hover:bg-[var(--border-color)] transform hover:scale-105 transition-all duration-300">
                           {t('homePrayerTimesShow')}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="w-full p-4 glass-card" style={{ animationDelay: '50ms' }}>
             <h3 className="font-lora font-semibold text-lg text-[var(--text-primary)] mb-3 text-center flex items-center justify-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t('homePrayerTimesWidgetTitle')}
            </h3>
            {renderContent()}
        </div>
    );
};

export default PrayerTimesWidget;
