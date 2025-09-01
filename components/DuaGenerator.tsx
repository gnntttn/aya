
import React, { useState, useCallback, useContext } from 'react';
import type { Dua, LanguageContextType } from '../types';
import { LanguageContext } from '../types';
import { generateDua } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import DuaCard from './DuaCard';
import ErrorMessage from './ErrorMessage';

const DuaGenerator: React.FC = () => {
  const { language, t } = useContext(LanguageContext) as LanguageContextType;
  const [prompt, setPrompt] = useState<string>('');
  const [dua, setDua] = useState<Dua | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      setDua(generatedDua);
    } catch (err) {
      console.error(err);
      setError(t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language, t]);
  
  const examplePrompts = [
      t('example1'),
      t('example2'),
      t('example3'),
      t('example4')
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="w-full text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-3">{t('pageTitle')}</h2>
      <p className="text-md text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
        {t('pageDescription')}
      </p>

      <form onSubmit={handleSubmit} className="w-full mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('textareaPlaceholder')}
          className="w-full h-28 p-3 border border-[var(--border-color)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--accent-glow)] focus:border-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          disabled={isLoading}
          aria-label={t('pageDescription')}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
        >
          {isLoading ? t('generatingButton') : t('generateButton')}
        </button>
      </form>
      
      <div className="mb-8">
        <p className="text-sm text-[var(--text-secondary)] mb-3">{t('tryExamples')}</p>
        <div className="flex flex-wrap justify-center gap-2">
            {examplePrompts.map((p, index) => (
                <button 
                    key={index} 
                    onClick={() => handleExampleClick(p)} 
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs bg-black/10 dark:bg-white/10 text-[var(--text-secondary)] rounded-full hover:bg-[var(--accent-primary)] hover:text-[var(--accent-text)] transition-colors duration-200"
                >
                    {p}
                </button>
            ))}
        </div>
      </div>

      {isLoading && <LoadingIndicator message={t('loadingMessage')} />}
      {error && <ErrorMessage message={error} />}
      {dua && !isLoading && <DuaCard dua={dua} />}
    </div>
  );
};

export default DuaGenerator;