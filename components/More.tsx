import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import { trackFeatureUsage } from '../services/trackingService';
import Settings from './Settings';
import Quiz from './Quiz';
import AsmaulHusna from './AsmaulHusna';
import Qibla from './Qibla';
import Adhkar from './Adhkar';
import ProphetStories from './ProphetStories';
import ZakatCalculator from './ZakatCalculator';
import SahabaStories from './SahabaStories';
import InheritanceCalculator from './InheritanceCalculator';
import HajjUmrahGuide from './HajjUmrahGuide';
import HalalTravel from './HalalTravel';
import DreamInterpreter from './DreamInterpreter';
import SalawatCounter from './SalawatCounter';
import HadithSearch from './HadithSearch';
import SpiritualGoals from './SpiritualGoals';
import Tasbih from './Tasbih';
import PrayerTimes from './PrayerTimes';
import LiveBroadcast from './LiveBroadcast';
import AdminDashboard from './AdminDashboard';
import KhatmahTracker from './KhatmahTracker';
import SermonGenerator from './SermonGenerator';
import IslamicHistory from './IslamicHistory';
import BackButton from './BackButton';


type SubView = 'menu' | 'settings' | 'allFeatures' | 'quiz' | 'tasbih' | 'asma' | 'qibla' | 'adhkar' | 'prophets' | 'zakat' | 'sahaba' | 'inheritance' | 'hajj' | 'travel' | 'dream' | 'salawat' | 'hadith' | 'goals' | 'prayer' | 'live' | 'admin' | 'khatmah' | 'sermon' | 'history';

const PlaceholderFeature: React.FC<{title: string; description: string}> = ({title, description}) => (
    <div className="text-center p-8 bg-[var(--bg-secondary-solid)] rounded-lg">
        <h3 className="font-lora text-2xl font-bold mb-4">{title}</h3>
        <p className="text-[var(--text-secondary)]">{description}</p>
        <p className="mt-4 text-sm font-semibold text-[var(--accent-primary)]">Coming Soon!</p>
    </div>
);

const More: React.FC = () => {
    const { t, initialMoreView, setInitialMoreView, setView } = useContext(LanguageContext) as LanguageContextType;
    const [subView, setSubView] = useState<SubView>(initialMoreView as SubView);

    useEffect(() => {
        if (initialMoreView !== 'menu' && initialMoreView !== 'admin' && initialMoreView !== 'settings' && initialMoreView !== 'allFeatures') {
            trackFeatureUsage(initialMoreView);
        }
        return () => {
            if (initialMoreView !== 'menu') {
                setInitialMoreView('menu');
            }
        };
    }, [initialMoreView, setInitialMoreView]);

    const handleFeatureSelect = (view: SubView) => {
        trackFeatureUsage(view);
        setSubView(view);
    };

    const allFeaturesItems = [
         { 
            id: 'sermon' as SubView, 
            title: t('moreSermonGenerator'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
            color: 'bg-orange-500/10 text-orange-400',
        },
        { 
            id: 'history' as SubView, 
            title: t('moreIslamicHistory'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            color: 'bg-yellow-500/10 text-yellow-400',
        },
        { 
            id: 'khatmah' as SubView, 
            title: t('moreKhatmahTracker'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m4 4H9m2-8H9" /></svg>,
            color: 'bg-teal-500/10 text-teal-400',
        },
        { 
            id: 'goals' as SubView, 
            title: t('moreSpiritualGoals'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
            color: 'bg-green-500/10 text-green-400',
        },
        { 
            id: 'prayer' as SubView, 
            title: t('morePrayerTimes'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M2 22h20M6 18V9.282c0-2.022 1.234-3.834 3.09-4.633L12 3l2.91 1.649c1.856.799 3.09 2.611 3.09 4.633V18M10 22v-3.455c0-.448.349-.817.785-.817h2.43c.436 0 .785.369.785.817V22"/></svg>,
            color: 'bg-red-500/10 text-red-400',
        },
        { 
            id: 'quiz' as SubView, 
            title: t('navQuiz'), 
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'bg-blue-500/10 text-blue-400',
        },
        {
            id: 'hadith' as SubView,
            title: t('moreHadithSearch'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path d="M15 15l-5-5" /></svg>,
            color: 'bg-orange-500/10 text-orange-400',
        },
        {
            id: 'prophets' as SubView,
            title: t('moreProphetStories'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            color: 'bg-indigo-500/10 text-indigo-400',
        },
        {
            id: 'sahaba' as SubView,
            title: t('moreSahabaStories'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
            color: 'bg-sky-500/10 text-sky-400',
        },
        {
            id: 'adhkar' as SubView,
            title: t('moreAdhkar'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            color: 'bg-rose-500/10 text-rose-400',
        },
        {
            id: 'tasbih' as SubView,
            title: t('moreTasbih'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            color: 'bg-yellow-500/10 text-yellow-400',
        },
        {
            id: 'salawat' as SubView,
            title: t('moreSalawatCounter'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            color: 'bg-pink-500/10 text-pink-400',
        },
        {
            id: 'zakat' as SubView,
            title: t('moreZakatCalculator'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M9 11h.01M12 11h.01M15 11h.01M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>,
            color: 'bg-emerald-500/10 text-emerald-400',
        },
        {
            id: 'inheritance' as SubView,
            title: t('moreInheritance'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9.243L12 12.586l-5-3.343M12 21v-8.414M12 21L4 16m8 5l8-5" /></svg>,
            color: 'bg-gray-500/10 text-gray-400',
        },
        {
            id: 'qibla' as SubView,
            title: t('moreQibla'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 9.045l1.414-1.414a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-1.414 1.414M6.323 12.456l-2.828 2.828a2 2 0 000 2.828l1.414 1.414a2 2 0 002.828 0L10.586 17" /></svg>,
            color: 'bg-cyan-500/10 text-cyan-400',
        },
        {
            id: 'asma' as SubView,
            title: t('moreAsmaulHusna'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            color: 'bg-red-500/10 text-red-400',
        },
        {
            id: 'hajj' as SubView,
            title: t('moreHajjGuide'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a4 4 0 100-5.656 4 4 0 000 5.656z" /><path d="M12 12h.01" /></svg>,
            color: 'bg-lime-500/10 text-lime-400',
        },
        {
            id: 'travel' as SubView,
            title: t('moreHalalTravel'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            color: 'bg-fuchsia-500/10 text-fuchsia-400',
        },
        {
            id: 'dream' as SubView,
            title: t('moreDreamInterpreter'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
            color: 'bg-violet-500/10 text-violet-400',
        },
    ];
    
    const renderSubView = () => {
        switch (subView) {
            case 'settings': return <Settings onNavigate={setSubView} />;
            case 'quiz': return <Quiz />;
            case 'tasbih': return <Tasbih />;
            case 'asma': return <AsmaulHusna />;
            case 'qibla': return <Qibla />;
            case 'adhkar': return <Adhkar />;
            case 'prophets': return <ProphetStories />;
            case 'zakat': return <ZakatCalculator />;
            case 'live': return <LiveBroadcast />;
            case 'sahaba': return <SahabaStories />;
            case 'inheritance': return <InheritanceCalculator />;
            case 'hajj': return <HajjUmrahGuide />;
            case 'travel': return <HalalTravel />;
            case 'dream': return <DreamInterpreter />;
            case 'salawat': return <SalawatCounter />;
            case 'hadith': return <HadithSearch />;
            case 'goals': return <SpiritualGoals />;
            case 'prayer': return <PrayerTimes />;
            case 'admin': return <AdminDashboard />;
            case 'khatmah': return <KhatmahTracker />;
            case 'sermon': return <SermonGenerator />;
            case 'history': return <IslamicHistory />;
            default: return null;
        }
    }

    const handleBackToMenu = () => {
        if (subView === 'admin') {
            setSubView('settings');
        } else if (subView === 'settings' || subView === 'allFeatures') {
            setSubView('menu');
        } else {
            // It's a feature, go back to the list of features
            setSubView('allFeatures');
        }
    };

    if (subView === 'menu') {
        return (
            <div className="w-full animate-fade-in pt-12">
                <BackButton onClick={() => setView('home')} />
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('moreTitle')}</h2>
                <div className="space-y-3">
                    <button
                        onClick={() => setSubView('settings')}
                        className="w-full text-left bg-[var(--bg-secondary-solid)] p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group rounded-lg border border-transparent"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <span className="font-semibold text-base text-[var(--text-primary)]">{t('navSettings')}</span>
                        </div>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                     <button
                        onClick={() => setSubView('allFeatures')}
                        className="w-full text-left bg-[var(--bg-secondary-solid)] p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group rounded-lg border border-transparent"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-teal-500/10 text-teal-400 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <span className="font-semibold text-base text-[var(--text-primary)]">{t('moreAllFeatures')}</span>
                        </div>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        );
    }
    
    if (subView === 'allFeatures') {
         return (
            <div className="w-full animate-fade-in pt-12">
                 <BackButton onClick={() => setSubView('menu')} text={t('back')} />
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('moreAllFeatures')}</h2>
                <div className="space-y-3">
                    {allFeaturesItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleFeatureSelect(item.id)}
                            className="w-full text-left bg-[var(--bg-secondary-solid)] p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] group rounded-lg border border-transparent"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color} shrink-0`}>
                                    {item.icon}
                                </div>
                                <span className="font-semibold text-base text-[var(--text-primary)]">{item.title}</span>
                            </div>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in pt-12">
             <BackButton onClick={handleBackToMenu} text={t('back')} />
            {renderSubView()}
        </div>
    );
};

export default More;