import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, View } from '../types';

interface NavItemProps {
    viewName: View;
    label: string;
    icon: JSX.Element;
    activeIcon: JSX.Element;
}

const NavItem: React.FC<NavItemProps> = ({ viewName, label, icon, activeIcon }) => {
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
                {isActive ? activeIcon : icon}
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-fade-in shadow-[0_0_8px_var(--accent-primary)]"></span>}
            </div>
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;

    const navItems = [
        {
            viewName: 'home' as View,
            label: t('navHome'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.781V21h5.25v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21H19V10.781l-7-6.998-8 6.998zM21.75 12l-9.75-9.75L2.25 12h2.25v9h15v-9h2.25z"/></svg>
        },
        {
            viewName: 'fiqh' as View,
            label: t('navFiqh'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.98-3.033c1.146-1.025 3.016-1.025 4.162 0 1.146 1.025 1.146 2.688 0 3.712-.204.18-.438.33-.69.442-1.015.492-1.464 1.353-1.464 2.392v.946a.75.75 0 01-1.5 0v-.946c0-1.358.734-2.523 1.776-3.131.25-.12.483-.264.686-.442 1.147-1.025.29-2.836-1.282-2.25-1.033.39-1.288 1.728-.593 2.454a.75.75 0 01-1.139.966c-.529-.623-.39-1.66.529-2.126zM12 15.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
        },
        {
            viewName: 'quran' as View,
            label: t('navQuran'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>,
        },
        {
            viewName: 'assistant' as View,
            label: t('navAssistant'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.6l1.9 4 4.4.6-3.2 3.1.8 4.4-3.9-2-3.9 2 .8-4.4-3.2-3.1 4.4-.6L9.5 2.6zM16 10l-1.3 2.6-2.9.4 2.1 2.1-.5 2.9 2.6-1.4 2.6 1.4-.5-2.9 2.1-2.1-2.9-.4L16 10z"/></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/></svg>,
        },
        {
            viewName: 'live' as View,
            label: t('navLive'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>,
        },
        {
            viewName: 'more' as View,
            label: t('navMore'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
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