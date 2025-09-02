
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, View } from '../types';

interface NavItemProps {
    viewName: View;
    label: string;
    icon: JSX.Element;
}

const NavItem: React.FC<NavItemProps> = ({ viewName, label, icon }) => {
    const { view, setView } = useContext(LanguageContext) as LanguageContextType;
    const isActive = view === viewName;

    return (
        <button
            onClick={() => setView(viewName)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-300 group transform focus:outline-none focus:scale-110 active:scale-95 ${
                isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <div className={`w-7 h-7 mb-1 relative transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {icon}
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-fade-in shadow-[0_0_8px_var(--accent-primary)]"></span>}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;

    const navItems: NavItemProps[] = [
        {
            viewName: 'home',
            label: t('navHome'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        },
        {
            viewName: 'quran',
            label: t('navQuran'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        },
        {
            viewName: 'dua',
            label: t('navDua'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        },
        {
            viewName: 'tasbih',
            label: t('navTasbih'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        },
        {
            viewName: 'more',
            label: t('navMore'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
        },
    ];

    return (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg glass-nav z-20">
            <div className="flex justify-around items-center">
                {navItems.map(item => (
                    <NavItem key={item.viewName} {...item} />
                ))}
            </div>
        </footer>
    );
};

export default BottomNavBar;