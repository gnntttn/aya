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
            viewName: 'prayer' as View,
            label: t('navPrayer'),
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M2 22h20M6 18V9.282c0-2.022 1.234-3.834 3.09-4.633L12 3l2.91 1.649c1.856.799 3.09 2.611 3.09 4.633V18M10 22v-3.455c0-.448.349-.817.785-.817h2.43c.436 0 .785.369.785.817V22"/></svg>,
            activeIcon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm.785 14.728H10.5V18h2.285v-1.272c0-1.222- .92-2.228-2.093-2.228h-.384c-1.173 0-2.093 1.006-2.093 2.228V18H6V9.282c0-1.517.925-2.874 2.318-3.475L12 4.05l3.682 1.757c1.393.601 2.318 1.958 2.318 3.475V18h-2.215v-1.272c0-1.222-.92-2.228-2.093-2.228h-.384c-1.173 0-2.093 1.006-2.093 2.228V18h-.715z M2 22h20v-2H2v2z"/></svg>
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