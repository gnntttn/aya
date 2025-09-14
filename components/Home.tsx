import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, PrayerTimesData } from '../types';
import { getPrayerTimes } from '../services/prayerTimeService';
import LoadingIndicator from './LoadingIndicator';

interface HijriDate {
    date: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { en: string; ar: string };
    year: string;
}

const QuickActionCard: React.FC<{ icon: JSX.Element; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="glass-card p-4 flex flex-col items-center justify-center space-y-2 text-center text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all duration-200">
        <div className="w-8 h-8 text-[var(--accent-primary)]">{icon}</div>
        <span className="text-sm font-semibold">{label}</span>
    </button>
);


const Home: React.FC = () => {
    const { t, language, setView, setInitialMoreView } = useContext(LanguageContext) as LanguageContextType;
    
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; time: Date, nameKey: string } | null>(null);
    const [countdown, setCountdown] = useState('');
    const [locationName, setLocationName] = useState<string>('');
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [gregorianDate, setGregorianDate] = useState('');

    const calculateNextPrayer = useCallback((times: PrayerTimesData) => {
        const now = new Date();
        const prayerSchedule = Object.entries(times)
            .filter(([name]) => name !== 'Sunrise')
            .map(([name, time]) => ({ nameKey: name, name: t(`prayer${name}`), time: new Date(`${now.toDateString()} ${time}`) }))
            .sort((a, b) => a.time.getTime() - b.time.getTime());

        let upcomingPrayer = prayerSchedule.find(p => p.time > now);

        if (!upcomingPrayer) {
            const tomorrowFajr = prayerSchedule[0];
            if (tomorrowFajr) {
                tomorrowFajr.time.setDate(tomorrowFajr.time.getDate() + 1);
                upcomingPrayer = tomorrowFajr;
            }
        }
        
        setNextPrayerInfo(upcomingPrayer || null);
    }, [t]);
    
    const fetchLocationAndPrayerTimes = useCallback(() => {
        const cachedTimes = localStorage.getItem('aya-prayer-times-cache');
        if (cachedTimes) {
            const parsed = JSON.parse(cachedTimes);
            if (new Date(parsed.timestamp).toDateString() === new Date().toDateString()) {
                setPrayerTimes(parsed.times);
                calculateNextPrayer(parsed.times);
                // No location name in old cache, so we just proceed
                return;
            }
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const times = await getPrayerTimes(latitude, longitude);
                    setPrayerTimes(times);
                    calculateNextPrayer(times);
                    localStorage.setItem('aya-prayer-times-cache', JSON.stringify({
                        timestamp: Date.now(),
                        coords: { latitude, longitude },
                        times: times,
                    }));
                    
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
                    const geoData = await geoResponse.json();
                    setLocationName(`${geoData.address.city || geoData.address.town || geoData.address.village}, ${geoData.address.country}`);

                } catch (error) { console.error("Error fetching prayer times:", error); }
            },
            (error) => { console.error("Geolocation error:", error); }
        );
    }, [calculateNextPrayer]);

    const fetchHijriDate = useCallback(() => {
        const now = new Date();
        setGregorianDate(now.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`)
            .then(res => res.json())
            .then(data => {
                if (data.code === 200 && data.data) setHijriDate(data.data.hijri);
            })
            .catch(err => console.error("Could not fetch Hijri date", err));
    }, [language]);

    useEffect(() => {
        fetchLocationAndPrayerTimes();
        fetchHijriDate();
    }, [fetchLocationAndPrayerTimes, fetchHijriDate]);

    useEffect(() => {
        if (!nextPrayerInfo) return;

        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = nextPrayerInfo.time.getTime() - now.getTime();

            if (diff < 0) {
                if (prayerTimes) calculateNextPrayer(prayerTimes);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [nextPrayerInfo, prayerTimes, calculateNextPrayer]);
    
    const handleNavigate = (view: 'quran' | 'assistant' | 'more', subView?: string) => {
        if (subView) setInitialMoreView(subView);
        setView(view);
    };
    
    const quickActions = [
        { id: 'quran', label: t('qaAlQuran'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, action: () => handleNavigate('quran') },
        { id: 'dua', label: t('qaDuaAssistant'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5c0-1.243 1.007-2.25 2.25-2.25S11.5 10.257 11.5 11.5m-4.5 2.5V14m0-2.5h-1M15.5 11.5V14m0-2.5c0-1.243 1.007-2.25 2.25-2.25s2.25 1.007 2.25 2.25m-4.5 2.5V14m0-2.5h-1" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v1.5H3.75V6zM3.75 18v2.25A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25V18M17.25 10.5c0 1.933-1.007 3.5-2.25 3.5s-2.25-1.567-2.25-3.5" /></svg>, action: () => handleNavigate('assistant') },
        { id: 'live', label: t('moreLiveBroadcast'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, action: () => setView('live') },
        { id: 'qibla', label: t('qaQibla'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 18.272l-4.14-7.527a5.5 5.5 0 119.28 0L13 18.272M12 21v-2.728" /><path d="M12 12.023a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>, action: () => handleNavigate('more', 'qibla') },
        { id: 'tasbih', label: t('qaTasbih'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, action: () => handleNavigate('more', 'tasbih') },
        { id: 'settings', label: t('qaSettings'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, action: () => handleNavigate('more', 'settings') },
    ];
    
    return (
        <div className="w-full flex flex-col min-h-[calc(100dvh-3rem)] space-y-5 animate-fade-in">
            {/* Header */}
            <header className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2 text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    <span className="font-semibold text-sm">{locationName || "Loading..."}</span>
                </div>
            </header>

            {/* Main Display Card */}
            <div className="glass-card p-5 text-center">
                {!nextPrayerInfo ? <div className="h-32 flex items-center justify-center"><LoadingIndicator message={t('homePrayerTimesLoading')} /></div> : (
                    <>
                        <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t('homeNextPrayer')} - {nextPrayerInfo.name}</p>
                        <p className="text-5xl font-bold my-1 text-white">{nextPrayerInfo.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                        <p className="font-mono text-lg text-[var(--accent-primary)]">{t('homeNextPrayerIn')} {countdown}</p>
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-1">
                            <p>{gregorianDate}</p>
                            {hijriDate && <p>{hijriDate.day} {language === 'ar' ? hijriDate.month.ar : hijriDate.month.en}, {hijriDate.year} {language === 'ar' ? 'هـ' : 'AH'}</p>}
                        </div>
                    </>
                )}
            </div>
            
            {/* Daily Timetable */}
            <div>
                <h2 className="text-lg font-bold text-white mb-2 px-2">{t('homeDailyTimetable')}</h2>
                <div className="flex overflow-x-auto hide-scrollbar -mx-4 px-4 space-x-2">
                    {prayerTimes ? Object.entries(prayerTimes).filter(([name]) => name !== "Sunrise").map(([name, time]) => {
                        const isNext = nextPrayerInfo?.nameKey === name;
                        return (
                            <div key={name} className={`flex-shrink-0 w-24 text-center p-3 rounded-xl transition-colors ${isNext ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'glass-card'}`}>
                                <p className="text-sm font-bold">{t(`prayer${name}`)}</p>
                                <p className="text-xs font-mono mt-1">{time}</p>
                            </div>
                        )
                    }) : Array(5).fill(0).map((_, i) => <div key={i} className="flex-shrink-0 w-24 h-[62px] glass-card animate-pulse"></div>)}
                </div>
            </div>

            {/* Quick Actions */}
             <div>
                <h2 className="text-lg font-bold text-white mb-2 px-2">{t('homeQuickActions')}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map(action => (
                        <QuickActionCard key={action.id} icon={action.icon} label={action.label} onClick={action.action} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
