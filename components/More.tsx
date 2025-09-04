
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import Settings from './Settings';
import Quiz from './Quiz';
import PrayerTimes from './PrayerTimes';
import AsmaulHusna from './AsmaulHusna';
import Qibla from './Qibla';

type SubView = 'menu' | 'settings' | 'quiz' | 'prayer' | 'asma' | 'qibla';

const More: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [subView, setSubView] = useState<SubView>('menu');

    const menuItems = [
        { 
            id: 'quiz' as SubView, 
            title: t('navQuiz'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'bg-blue-500/10 text-blue-400',
            soon: false,
        },
        {
            id: 'qibla' as SubView,
            title: t('moreQibla'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L6 22l6-4 6 4V2zM12 2v6" /></svg>,
            color: 'bg-green-500/10 text-green-400',
            soon: false,
        },
        {
            id: 'prayer' as SubView,
            title: t('morePrayerTimes'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'bg-purple-500/10 text-purple-400',
            soon: false,
        },
        {
            id: 'asma' as SubView,
            title: t('moreAsmaulHusna'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            color: 'bg-pink-500/10 text-pink-400',
            soon: false,
        },
        { 
            id: 'settings' as SubView, 
            title: t('navSettings'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            color: 'bg-amber-500/10 text-amber-400',
            soon: false,
        },
    ];
    
    const renderSubView = () => {
        switch (subView) {
            case 'settings':
                return <Settings />;
            case 'quiz':
                return <Quiz />;
            case 'prayer':
                return <PrayerTimes />;
            case 'asma':
                return <AsmaulHusna />;
            case 'qibla':
                return <Qibla />;
            default:
                return null;
        }
    }

    if (subView !== 'menu') {
        return (
            <div className="w-full animate-fade-in">
                 <button onClick={() => setSubView('menu')} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-2 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                     {t('back')}
                </button>
                {renderSubView()}
            </div>
        )
    }

    return (
        <div className="w-full animate-fade-in">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('moreTitle')}</h2>
            <div className="space-y-3">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.soon) return;
                            setSubView(item.id);
                        }}
                        disabled={item.soon}
                        className="w-full text-left glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color} shrink-0`}>
                                {item.icon}
                            </div>
                            <span className="font-semibold text-base text-[var(--text-primary)]">{item.title}</span>
                        </div>
                        {item.soon ? (
                            <span className="text-xs font-semibold bg-black/10 dark:bg-white/10 text-[var(--text-secondary)] px-2 py-1 rounded-full">{t('comingSoon')}</span>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default More;
