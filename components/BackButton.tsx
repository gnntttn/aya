import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface BackButtonProps {
    onClick: () => void;
    text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, text }) => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    return (
        <button 
            onClick={onClick} 
            className="absolute top-4 left-4 z-10 flex items-center gap-1 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors p-2 rounded-full"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-sm">{text || t('back')}</span>
        </button>
    );
};

export default BackButton;
