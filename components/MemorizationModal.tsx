
import React, { useState, useContext, useRef, useLayoutEffect } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah } from '../types';

interface MemorizationModalProps {
    ayah: Ayah;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

const MemorizationModal: React.FC<MemorizationModalProps> = ({ ayah, onClose, anchorEl }) => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [isVerseVisible, setIsVerseVisible] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({ opacity: 0 });

    useLayoutEffect(() => {
        if (anchorEl && modalRef.current) {
            const anchorRect = anchorEl.getBoundingClientRect();
            const modalClone = modalRef.current.cloneNode(true) as HTMLElement;
            modalClone.style.visibility = 'hidden';
            modalClone.style.position = 'absolute';
            document.body.appendChild(modalClone);
            const modalRect = modalClone.getBoundingClientRect();
            document.body.removeChild(modalClone);

            const viewportMargin = 16;
            let top = anchorRect.bottom + 8;
            let left = anchorRect.left + (anchorRect.width / 2) - (modalRect.width / 2);

            if (left < viewportMargin) left = viewportMargin;
            if (left + modalRect.width > window.innerWidth - viewportMargin) {
                left = window.innerWidth - modalRect.width - viewportMargin;
            }
            if (top + modalRect.height > window.innerHeight - viewportMargin) {
                top = anchorRect.top - modalRect.height - 8;
            }

            setPositionStyle({
                position: 'absolute',
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
                transition: 'opacity 0.2s ease-out',
            });
        }
    }, [anchorEl]);
    
    return (
        <div 
            className="fixed inset-0 bg-black/30 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="memorization-title"
        >
            <div 
                ref={modalRef}
                style={positionStyle}
                className="w-full max-w-sm glass-card p-4 rounded-xl flex flex-col max-h-[80vh] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 pb-3 border-b border-[var(--border-color)] text-center">
                    <h2 id="memorization-title" className="font-lora text-lg font-bold text-[var(--accent-primary)]">
                        {t('memorizationHelperTitle')}
                    </h2>
                    <p dir="rtl" className="font-amiri text-base mt-1 text-[var(--text-secondary)]">{ayah.surah?.name}, Ayah {ayah.numberInSurah}</p>
                </header>
                
                <div className="flex-grow my-4 flex flex-col items-center justify-center">
                    <p className="text-sm text-center text-[var(--text-secondary)] mb-4">{t('memorizationHelperIntro')}</p>
                    <div className="w-full min-h-[10rem] bg-black/5 dark:bg-white/5 p-3 rounded-lg flex items-center justify-center">
                        <p dir="rtl" className={`font-amiri text-xl text-right transition-opacity duration-300 ${isVerseVisible ? 'opacity-100' : 'opacity-0'}`}>
                            {ayah.text}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsVerseVisible(!isVerseVisible)}
                        className="mt-4 px-5 py-2 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] font-bold rounded-full text-sm shadow-md hover:bg-[var(--border-color)] transition-colors"
                    >
                        {isVerseVisible ? t('memorizationHide') : t('memorizationShow')}
                    </button>
                </div>

                <footer className="flex-shrink-0 pt-3 text-center">
                    <button 
                        onClick={onClose}
                        className="px-5 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full text-sm shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
                        aria-label={t('close')}
                    >
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MemorizationModal;
