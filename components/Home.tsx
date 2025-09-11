import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, PrayerTimesData } from '../types';
import { getPrayerTimes } from '../services/prayerTimeService';

interface HijriDate {
    date: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { en: string; ar: string };
    year: string;
}

const NavGridItem: React.FC<{ icon: JSX.Element; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center space-y-2 text-center text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors duration-200">
        <div className="w-10 h-10">{icon}</div>
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const Home: React.FC = () => {
    const { t, language, setView, setInitialMoreView } = useContext(LanguageContext) as LanguageContextType;
    
    // State for Prayer Times
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
    const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; time: Date, nameKey: string } | null>(null);
    const [locationName, setLocationName] = useState<string>('');

    // State for Calendar
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);

    const calculateNextPrayer = useCallback((times: PrayerTimesData) => {
        const now = new Date();
        const prayerSchedule = Object.entries(times)
            .filter(([name]) => name !== 'Sunrise')
            .map(([name, time]) => ({ nameKey: name, name: t(`prayer${name}`), time: new Date(`${now.toDateString()} ${time}`) }))
            .sort((a, b) => a.time.getTime() - b.time.getTime());

        let upcomingPrayer = prayerSchedule.find(p => p.time > now);

        if (!upcomingPrayer) {
            const tomorrowFajr = prayerSchedule[0];
            tomorrowFajr.time.setDate(tomorrowFajr.time.getDate() + 1);
            upcomingPrayer = tomorrowFajr;
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

                    // Fetch location name
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
                    const geoData = await geoResponse.json();
                    setLocationName(`${geoData.address.city || geoData.address.town || geoData.address.village}, ${geoData.address.country}`);

                } catch (error) {
                    console.error("Error fetching prayer times:", error);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
            }
        );
    }, [calculateNextPrayer]);

    const fetchHijriDate = useCallback(() => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`)
            .then(res => res.json())
            .then(data => {
                if (data.code === 200 && data.data) {
                    setHijriDate(data.data.hijri);
                }
            })
            .catch(err => console.error("Could not fetch Hijri date", err));
    }, [language]);

    useEffect(() => {
        fetchLocationAndPrayerTimes();
        fetchHijriDate();
    }, [fetchLocationAndPrayerTimes, fetchHijriDate]);

    const handleNavigate = (view: 'quran' | 'assistant' | 'more', subView?: string) => {
        if (subView) {
            setInitialMoreView(subView);
        }
        setView(view);
    };

    const icons = {
        prayer: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.33 44.333V25.138c0-5.32 4.49-9.638 10-9.638h3.34c5.51 0 10 4.318 10 9.638v19.195M6 44.333h36"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.84 44.333V39.2c0-1.12.87-2.027 1.94-2.027h6.44c1.07 0 1.94.908 1.94 2.028v5.132"></path></svg>,
        masjid: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M37.5 12.333a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M37.5 16.167v-5.91M24 4v10.5M34.42 21.833a11.96 11.96 0 0 0-10.42-7.5c-6.23 0-11.33 4.9-11.33 11v14.5h32v-11a11.23 11.23 0 0 0-10.25-7Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 44.333h36"></path></svg>,
        quran: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M24 8.5c-4.43 0-8.24 1.34-10.67 3.51-.5.44-1.13.78-1.81.99a4.8 4.8 0 0 0-3.85 4.67V36.5c0 1.94 1.56 3.5 3.5 3.5h.33a3.5 3.5 0 0 0 3.5-3.5v-10c0-1.93 1.57-3.5 3.5-3.5h3.34c1.93 0 3.5 1.57 3.5 3.5v10a3.5 3.5 0 0 0 3.5 3.5h.33c1.94 0 3.5-1.56 3.5-3.5V17.67c0-1.8-.75-3.47-2-4.67-.67-.6-1.5-.99-2.33-.99-4.43 0-8.24-1.34-10.67-3.51Z"></path></svg>,
        qibla: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M37.33 29.833V18.5H24.5v11.333h12.83Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.67 18.5v14.16a2.84 2.84 0 0 0 2.83 2.84h21a2.84 2.84 0 0 0 2.83-2.84v-2.83"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.67 18.5 24.5 12.33l12.83 6.17-12.83 6.16-13.83-6.16Z"></path></svg>,
        calendar: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.5 4v6.667m17-6.667v6.667M9.83 22.167h28.34M11.5 14.333h25c3.33 0 5 1.67 5 5v15c0 3.33-1.67 5-5 5h-25c-3.33 0-5-1.67-5-5v-15c0-3.33 1.67-5 5-5Z"></path></svg>,
        tasbeeh: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22.33 25.667a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12.33 35.667a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM25.67 12.333a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM35.67 22.333a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM32.33 35.667a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM22.33 45.667a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.15 22.447c-2.43-3.2-3.08-7.46.2-10.15s7.05-2.2 10.15.2c3.2 2.44 3.08 7.46-.2 10.15m-15.02 9.07c-3.2-2.43-3.69-7.05-.99-10.15s7.46-3.08 10.15-.2m-1.28 15.02c-2.44 3.2-7.46 3.7-10.15.99s-2.2-7.05.2-10.15"></path></svg>,
        pillars: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M41.33 14.333v21.34H6.67v-21.34L24 4l17.33 10.333Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.67 44.333V14.333m9.33 30V14.333m9.33 30V14.333"></path></svg>,
        duas: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.25 21.417s-1.5-6.5 4.5-11.25 10.5 1.5 10.5 1.5M32.75 21.417s1.5-6.5-4.5-11.25-10.5 1.5-10.5 1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.25 21.417C14.12 28.083 14 36.417 24 36.417s9.88-8.334 8.75-15m-17.5 0v-2.25c0-1.25 1.25-2.25 2.75-2.25s2.75 1 2.75 2.25V21.5m9.25-.083v-2.25c0-1.25 1.25-2.25 2.75-2.25s2.75 1 2.75 2.25v2.333"></path></svg>,
        about: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M24 39.333a15.33 15.33 0 1 0 0-30.666 15.33 15.33 0 0 0 0 30.666Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M24 31.333v-9.5M24 16.167a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path></svg>,
    };

    const navGridItems = [
        { id: 'prayer', label: t('navPrayerTimes'), icon: icons.prayer, action: () => handleNavigate('more', 'prayer') },
        { id: 'masjid', label: t('navMasjidFinder'), icon: icons.masjid, action: () => handleNavigate('more', 'qibla') },
        { id: 'quran', label: t('navAlQuran'), icon: icons.quran, action: () => handleNavigate('quran') },
        { id: 'qibla', label: t('navQibla'), icon: icons.qibla, action: () => handleNavigate('more', 'qibla') },
        { id: 'calendar', label: t('navCalendar'), icon: icons.calendar, action: () => handleNavigate('more', 'prayer') },
        { id: 'tasbeeh', label: t('navTasbeeh'), icon: icons.tasbeeh, action: () => handleNavigate('more', 'tasbih') },
        { id: 'pillars', label: t('nav5Pillars'), icon: icons.pillars, action: () => handleNavigate('more', 'hajj') },
        { id: 'duas', label: t('navDuas'), icon: icons.duas, action: () => handleNavigate('assistant') },
        { id: 'about', label: t('navAboutUs'), icon: icons.about, action: () => handleNavigate('more', 'settings') },
    ];
    
    return (
        <div className="w-full flex flex-col justify-between min-h-[calc(100dvh-3rem)]">
            {/* Header */}
            <header className="flex justify-between items-center w-full px-2 py-4">
                <div className="flex items-center gap-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    <span className="font-semibold text-sm">{locationName || "Loading..."}</span>
                </div>
                <button onClick={() => handleNavigate('more', 'settings')} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </header>

            {/* Main Display */}
            <div className="relative w-full max-w-sm mx-auto my-8">
                <img src="/prayer-time-bg.svg" alt="Prayer time background" className="w-full h-auto"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    {nextPrayerInfo ? (
                        <>
                            <p className="text-6xl font-semibold -mb-1 text-[var(--accent-primary)]">{nextPrayerInfo.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                            <p className="text-lg font-semibold uppercase tracking-widest text-[var(--accent-primary)]">{nextPrayerInfo.nameKey}</p>
                             {hijriDate && (
                                <div className="mt-4 text-white font-semibold text-sm space-y-1">
                                    <p>{hijriDate.weekday.en}, {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH</p>
                                    <p className="font-amiri">{hijriDate.weekday.ar}، {hijriDate.day} {hijriDate.month.ar} {hijriDate.year} هـ</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-white text-sm">Loading Prayer Times...</div>
                    )}
                </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-3 gap-y-8 gap-x-4 w-full px-4">
                {navGridItems.map(item => (
                    <NavGridItem key={item.id} icon={item.icon} label={item.label} onClick={item.action} />
                ))}
            </div>
        </div>
    );
};

export default Home;