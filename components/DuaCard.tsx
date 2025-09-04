
import React, { useContext } from 'react';
import type { Dua, LanguageContextType } from '../types';
import { LanguageContext } from '../types';

interface DuaCardProps {
  dua: Dua;
  onSave?: (dua: Dua) => void;
  onRemove?: (duaId: string) => void;
  isSaved?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua, onSave, onRemove, isSaved }) => {
  const { t, language } = useContext(LanguageContext) as LanguageContextType;
  
  const handleSaveClick = () => {
    if (onSave && !isSaved) {
      onSave(dua);
    } else if (onRemove && isSaved && dua.id) {
       onRemove(dua.id);
    }
  };

  const handleRemoveClick = () => {
    if (onRemove && dua.id) {
        onRemove(dua.id);
    }
  };
  
  return (
    <div className="w-full max-w-2xl glass-card p-6 md:p-8 text-left animate-fade-in">
      <div className="flex justify-between items-start">
        <h3 className={`font-lora text-2xl font-bold text-[var(--accent-primary)] mb-4 ${language === 'ar' ? 'text-right' : ''}`}>{dua.title}</h3>
        {onSave && (
          <button onClick={handleSaveClick} className="p-2 text-amber-400 hover:text-amber-300 transition-colors rounded-full" title={isSaved ? t('duaUnsave') : t('duaSave')}>
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            )}
          </button>
        )}
      </div>

      <div className="space-y-4 text-[var(--text-primary)]">
        
        {dua.duaArabic && (
            <p dir="rtl" className="text-2xl leading-relaxed whitespace-pre-wrap font-amiri text-right my-4 p-4 bg-black/5 dark:bg-white/5 rounded-md">{dua.duaArabic}</p>
        )}
        
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{dua.duaText}</p>
        
        {dua.duaTransliteration && (
          <div>
            <h4 className="font-semibold text-sm text-[var(--accent-primary)] uppercase tracking-wider">{t('duaCardTransliteration')}</h4>
            <p className="italic text-[var(--text-secondary)]">{dua.duaTransliteration}</p>
          </div>
        )}

        {dua.reference && (
          <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
            <h4 className="font-semibold text-sm text-[var(--accent-primary)] uppercase tracking-wider">{t('duaCardReference')}</h4>
            <p className="text-sm text-[var(--text-secondary)]">{dua.reference}</p>
          </div>
        )}
      </div>
       {onRemove && dua.id && (
          <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-right">
              <button onClick={handleRemoveClick} className="text-red-400 hover:text-red-300 text-sm font-semibold p-2">
                  Delete
              </button>
          </div>
        )}
    </div>
  );
};

export default DuaCard;
