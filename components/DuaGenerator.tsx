
import React, { useState, useCallback, useContext, useEffect } from 'react';
import type { Dua, LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import { generateDua, isApiKeyAvailable } from '../services/geminiService';
import LoadingIndicator from './common/LoadingIndicator';
import DuaCard from './DuaCard';
import ErrorMessage from './common/ErrorMessage';
import { sampleDuas } from '../data/sampleDuas';

type ApiKeyStatus = 'checking' | 'available' | 'unavailable';

const DuaGenerator: React.FC = () => {
  const { language, t, savedDuas, addSavedDua, removeSavedDua } = useContext(LanguageContext) as LanguageContextType;
  const [prompt, setPrompt] = useState<string>('');
  const [dua, setDua] = useState<Dua | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>('checking');

  useEffect(() => {
    const checkKey = async () => {
        const available = await isApiKeyAvailable();
        setApiKeyStatus(available ? 'available' : 'unavailable');
    };
    checkKey();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError(t('promptError'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setDua(null);
    try {
      const generatedDua = await generateDua(prompt, language);
      const duaWithId = { ...generatedDua, id: new Date().toISOString() };
      setDua(duaWithId);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errorMessage');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language, t]);
  
  const FallbackContent = () => (
    <div className="w-full space-y-6">
        <div className="mb-4">
            <ErrorMessage message="Please configure the API_KEY." />
        </div>
        <h3 className="font-lora text-xl font-semibold text-[var(--text-primary)] text-center">{t('sampleDuasTitle')}</h3>
        <div className="space-y-4">
            {(sampleDuas[language] || sampleDuas['en']).map((sample, index) => (
                <DuaCard key={index} dua={sample} />
            ))}
        </div>
    </div>
  );

  return (
    <div className="w-full text-center animate-fade-in flex flex-col items-center">
      <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('pageTitleDua')}</h2>
      
      {apiKeyStatus === 'checking' && <LoadingIndicator message={t('checkingConfig')} />}

      {apiKeyStatus === 'unavailable' && (
         <>
            <p className="text-md text-[var(--text-secondary)] mb-8 max-w-xl">
              {t('pageDescriptionDua')}
            </p>
            <FallbackContent />
        </>
      )}

      {apiKeyStatus === 'available' && (
          <>
            <p className="text-md text-[var(--text-secondary)] mb-8 max-w-xl">
              {t('pageDescriptionDua')}
            </p>
            <form onSubmit={handleSubmit} className="w-full mb-6 glass-card p-4">
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('textareaPlaceholder')}
                className="w-full h-28 p-3 border-none rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] resize-none"
                disabled={isLoading}
                aria-label={t('pageDescriptionDua')}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                    {isLoading ? t('generatingButton') : t('generateButton')}
                </button>
            </form>

            <div className="w-full max-w-2xl mt-4">
                {isLoading && <LoadingIndicator message={t('loadingMessage')} />}
                {error && <ErrorMessage message={error} />}
                {dua && !isLoading && (
                  <DuaCard 
                    dua={dua} 
                    onSave={addSavedDua}
                    onRemove={removeSavedDua}
                    isSaved={savedDuas.some(d => d.id === dua.id)}
                  />
                )}
            </div>
            
            <div className="w-full max-w-2xl mt-12">
              <h3 className="font-lora text-2xl font-bold text-[var(--text-primary)] mb-6 text-center border-t border-[var(--border-color)] pt-8">{t('myDuasTitle')}</h3>
              {savedDuas.length > 0 ? (
                <div className="space-y-4">
                  {savedDuas.map(d => (
                    <DuaCard key={d.id} dua={d} onRemove={removeSavedDua} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--text-secondary)]">{t('myDuasEmpty')}</p>
              )}
            </div>
         </>
      )}
    </div>
  );
};

export default DuaGenerator;
