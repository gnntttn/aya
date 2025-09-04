
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface InstallGuideModalProps {
    onClose: () => void;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ onClose }) => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/android/i.test(userAgent)) {
            setOs("android");
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setOs("ios");
        }
    }, []);

    const IOSInstructions = () => (
        <div className="space-y-4">
            <p className="text-sm text-center text-[var(--text-secondary)]">{t('installAppDescriptionIOS')}</p>
            <ol className="space-y-3 text-sm text-[var(--text-primary)]">
                <li className="flex items-center gap-3">
                    <span className="font-bold text-[var(--accent-primary)]">1.</span>
                    <span>{t('installAppIOSStep1')}</span>
                    <div className="ml-auto p-1.5 bg-black/5 dark:bg-white/10 rounded-md">
                        {/* iOS Share Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </div>
                </li>
                <li className="flex items-center gap-3">
                    <span className="font-bold text-[var(--accent-primary)]">2.</span>
                    <span>{t('installAppIOSStep2')}</span>
                     <div className="ml-auto p-1.5 bg-black/5 dark:bg-white/10 rounded-md">
                        {/* Add to Home Screen Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </div>
                </li>
                <li className="flex items-center gap-3">
                    <span className="font-bold text-[var(--accent-primary)]">3.</span>
                    <span>{t('installAppIOSStep3')}</span>
                </li>
            </ol>
        </div>
    );
    
    const AndroidInstructions = () => (
         <div className="space-y-4">
            <p className="text-sm text-center text-[var(--text-secondary)]">{t('installAppDescriptionAndroid')}</p>
            <ol className="space-y-3 text-sm text-[var(--text-primary)]">
                <li className="flex items-center gap-3">
                    <span className="font-bold text-[var(--accent-primary)]">1.</span>
                    <span>{t('installAppAndroidStep1')}</span>
                    <div className="ml-auto p-1.5">
                        {/* Three Dots Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                </li>
                <li className="flex items-center gap-3">
                    <span className="font-bold text-[var(--accent-primary)]">2.</span>
                    <span>{t('installAppAndroidStep2')}</span>
                </li>
            </ol>
        </div>
    );


    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
        >
            <div 
                className="w-full max-w-sm glass-card p-6 rounded-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-4 text-center">
                    <h2 id="install-title" className="font-lora text-xl font-bold text-[var(--accent-primary)]">
                        {t('installAppTitle')}
                    </h2>
                </header>
                
                <div className="flex-grow my-2">
                    {os === 'ios' && <IOSInstructions />}
                    {os === 'android' && <AndroidInstructions />}
                    {os === 'other' && <AndroidInstructions />} 
                </div>

                <footer className="flex-shrink-0 pt-4 text-center">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
                        aria-label={t('close')}
                    >
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InstallGuideModal;
