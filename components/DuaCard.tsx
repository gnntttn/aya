import React, { useContext } from 'react';
import type { Dua, LanguageContextType } from '../types';
import { LanguageContext } from '../types';

interface DuaCardProps {
  dua: Dua;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua }) => {
  const { t, language } = useContext(LanguageContext) as LanguageContextType;
  return (
    <div className="w-full max-w-2xl bg-[var(--bg-secondary)] rounded-xl shadow-lg p-6 md:p-8 text-left animate-fade-in border border-[var(--border-color)]">
      <h3 className={`text-2xl font-bold text-[var(--accent-primary)] mb-4 font-amiri ${language === 'ar' ? 'text-right' : ''}`}>{dua.title}</h3>
      
      <div className="space-y-4 text-[var(--text-primary)]">
        
        {dua.duaArabic && (
            <p dir="rtl" className="text-2xl leading-relaxed whitespace-pre-wrap font-amiri text-right my-4 p-4 bg-teal-500/10 rounded-md">{dua.duaArabic}</p>
        )}
        
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{dua.duaText}</p>
        
        {dua.duaTransliteration && (
          <div>
            <h4 className="font-semibold text-[var(--accent-primary)]">{t('duaCardTransliteration')}</h4>
            <p className="italic text-[var(--text-secondary)]">{dua.duaTransliteration}</p>
          </div>
        )}

        {dua.reference && (
          <div className="pt-4 border-t border-[var(--border-color)]">
            <h4 className="font-semibold text-[var(--accent-primary)]">{t('duaCardReference')}</h4>
            <p className="text-sm text-[var(--text-secondary)]">{dua.reference}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuaCard;