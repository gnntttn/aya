
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, PrayerTimesData } from '../types';
import { getPrayerTimes } from '../services/prayerTimeService';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

type Status = 'idle' | 'loading' | 'success' | 'error';

const PrayerTimes: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [status, setStatus] = useState<Status>('idle');
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);

    const fetchTimes = (latitude: number, longitude: number) => {
        setStatus('loading');
        getPrayerTimes(latitude, longitude)
            .then(data => {
                setPrayerTimes(data);
                setStatus('success');
            })
            .catch(err => {
                setError(err.message || 'An unknown error occurred.');
                setStatus('error');
            });
    };
    
    useEffect(() => {
        if (prayerTimes) {
            const now = new Date();
            const prayerSchedule = Object.entries(prayerTimes)
                .map(([name, time]) => ({ name, time: new Date(`${now.toDateString()} ${time}`) }))
                .sort((a, b) => a.time.getTime() - b.time.getTime());

            const upcomingPrayer = prayerSchedule.find(p => p.time > now);

            if (upcomingPrayer) {
                setNextPrayer({ name: t(`prayer${upcomingPrayer.name}`), time: upcomingPrayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
            } else {
                 // If all prayers for today are done, show Fajr for the next day
                const tomorrowFajr = prayerSchedule[0];
                setNextPrayer({ name: t(`prayer${tomorrowFajr.name}`), time: tomorrowFajr.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
            }
        }
    }, [prayerTimes, t]);

    const handleRequestLocation = () => {
        setStatus('loading');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchTimes(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    setError(t('prayerLocationDenied'));
                    setStatus('error');
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setStatus('error');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return <LoadingIndicator message={t('prayerFetching')} />;
            case 'error':
                return <ErrorMessage message={error || ''} />;
            case 'success':
                if (!prayerTimes) return null;
                const prayerOrder: (keyof PrayerTimesData)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                return (
                     <div className="w-full glass-card p-4 animate-fade-in divide-y divide-[var(--border-color)]">
                        {prayerOrder.map(prayerName => (
                             <div key={prayerName} className={`flex justify-between items-center py-3 px-2 ${nextPrayer?.name === t(`prayer${prayerName}`) ? 'text-[var(--accent-primary)] font-bold' : ''}`}>
                                <span className="text-lg">{t(`prayer${prayerName}`)}</span>
                                <span className="font-mono text-lg">{prayerTimes[prayerName]}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="text-center p-6 glass-card">
                        <p className="mb-4 text-lg text-[var(--text-secondary)]">{t('prayerTimesDescription')}</p>
                        <button onClick={handleRequestLocation} className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300">
                           {t('prayerAllowLocation')}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="w-full">
             <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('prayerTimesTitle')}</h2>
             {renderContent()}
        </div>
    );
};

export default PrayerTimes;