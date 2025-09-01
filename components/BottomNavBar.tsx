
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, View } from '../types';

interface NavItemProps {
    viewName: View;
    label: string;
    icon: (isActive: boolean) => JSX.Element;
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
                {icon(isActive)}
                {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent-glow)] rounded-full animate-fade-in shadow-[0_0_8px_var(--accent-glow)]"></span>}
            </div>
            <span className={`text-xs font-medium transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;

    const navItems: Omit<NavItemProps, 'isActive' | 'onClick'>[] = [
        {
            viewName: 'home',
            label: t('navHome'),
            icon: (isActive) => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  {isActive ? <path d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 101.061 1.06l8.69-8.69z" /> : <path fillRule="evenodd" d="M11.47 3.841a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.061l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" clipRule="evenodd" />}
                  <path fillRule="evenodd" d="M12 5.432l8.25 8.25v5.194a2.25 2.25 0 01-2.25 2.25H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.25a2.25 2.25 0 01-2.25-2.25v-5.194l8.25-8.25z" clipRule="evenodd" />
                </svg>
            ),
        },
        {
            viewName: 'quran',
            label: t('navQuran'),
            icon: (isActive) => (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                   {isActive ? <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> : <path fillRule="evenodd" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" clipRule="evenodd" />}
                 </svg>
            ),
        },
        {
            viewName: 'dua',
            label: t('navDua'),
            icon: (isActive) => (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  {isActive ? <path d="M12 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l.66.66a.75.75 0 01-1.06 1.06l-.66-.66a.75.75 0 010-1.06zm12.728 0a.75.75 0 010 1.06l-.66.66a.75.75 0 01-1.06-1.06l.66-.66a.75.75 0 011.06 0zm-1.06 12.064a.75.75 0 011.06 0l.66.66a.75.75 0 01-1.06 1.06l-.66-.66a.75.75 0 010-1.06zM12 21a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 21zm-6.424-2.828a.75.75 0 011.06-1.06l.66.66a.75.75 0 11-1.06 1.06l-.66-.66zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM6.696 17.364a.75.75 0 010 1.06l-.66.66a.75.75 0 01-1.06-1.06l.66-.66a.75.75 0 011.06 0z" /> : <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l.66.66a.75.75 0 01-1.06 1.06l-.66-.66a.75.75 0 010-1.06zm12.728 0a.75.75 0 010 1.06l-.66.66a.75.75 0 01-1.06-1.06l.66-.66a.75.75 0 011.06 0zm-1.06 12.064a.75.75 0 011.06 0l.66.66a.75.75 0 01-1.06 1.06l-.66-.66a.75.75 0 010-1.06zM12 21a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 21zm-6.424-2.828a.75.75 0 011.06-1.06l.66.66a.75.75 0 11-1.06 1.06l-.66-.66zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-5.25 5.25a.75.75 0 011.06 0l.66.66a.75.75 0 01-1.06 1.06l-.66-.66a.75.75 0 010-1.06z" clipRule="evenodd" />}
                </svg>
            ),
        },
        {
            viewName: 'quiz',
            label: t('navQuiz'),
            icon: (isActive) => (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    {isActive ? <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 003-3V4.875C23.25 3.839 22.41 3 21.375 3H4.125zM12 9.75a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H12zm-3-1.5a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zM12 15a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H12z" clipRule="evenodd" /> : <path d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 003-3V4.875C23.25 3.839 22.41 3 21.375 3H4.125zM12 9.75a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H12zm-3-1.5a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zM12 15a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H12z" />}
                 </svg>
            ),
        },
        {
            viewName: 'more',
            label: t('navMore'),
            icon: (isActive) => (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  {isActive ? <path fillRule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" /> : <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />}
                 </svg>
            ),
        },
    ];

    return (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-[var(--bg-secondary)]/70 backdrop-blur-lg z-20" style={{ boxShadow: '0 -4px 30px rgba(var(--shadow-color), 0.1)' }}>
            <div className="flex justify-around items-center">
                {navItems.map(item => (
                    <NavItem key={item.viewName} {...item} />
                ))}
            </div>
        </footer>
    );
};

export default BottomNavBar;
