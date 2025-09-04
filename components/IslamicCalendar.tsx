
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface HijriDate {
    date: string; // e.g., "14-01-1446"
    day: string; // e.g., "14"
    weekday: { en: string; ar: string };
    month: { en: string; ar: string };
    year: string;
}

const IslamicCalendar: React.FC = () => {
    const { language } = useContext(LanguageContext) as LanguageContextType;
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [gregorianDate, setGregorianDate] = useState('');

    useEffect(() => {
        const fetchHijriDate = async () => {
            try {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                
                // Format Gregorian date for display
                setGregorianDate(now.toLocaleDateString(language === 'ar' ? 'ar-SA' : language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));

                const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`);
                if (!response.ok) throw new Error('Failed to fetch Hijri date');
                
                const data = await response.json();
                if (data.code === 200 && data.data) {
                    setHijriDate(data.data.hijri);
                }
            } catch (error) {
                console.error("Error fetching Hijri date:", error);
            }
        };

        fetchHijriDate();
    }, [language]);

    if (!hijriDate) {
        return (
            <div className="w-full p-4 text-center glass-card animate-pulse">
                <div className="h-4 bg-[var(--border-color)] rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-[var(--border-color)] rounded w-1/2 mx-auto mt-2"></div>
            </div>
        );
    }

    const displayedMonth = language === 'fr' ? hijriDate.month.en : hijriDate.month[language];
    const displayedWeekday = language === 'fr' ? hijriDate.weekday.en : hijriDate.weekday[language];

    return (
        <div className="w-full p-4 text-center glass-card">
            <p className="font-bold text-2xl text-[var(--accent-primary)] font-lora">
                {hijriDate.day} {displayedMonth}, {hijriDate.year} AH
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
                {displayedWeekday} • {gregorianDate}
            </p>
        </div>
    );
};

export default IslamicCalendar;
