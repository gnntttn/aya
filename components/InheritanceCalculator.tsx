
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, InheritanceInput, InheritanceResult } from '../types';
import { calculateInheritance } from '../services/geminiService';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const InheritanceCalculator: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [input, setInput] = useState<InheritanceInput>({
        totalEstate: 0,
        hasSpouse: false,
        sons: 0,
        daughters: 0,
        hasFather: false,
        hasMother: false,
    });
    const [result, setResult] = useState<InheritanceResult[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseInt(value) || 0,
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const calculation = await calculateInheritance(input, language);
            setResult(calculation);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('inheritanceTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('inheritanceDescription')}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto glass-card p-6 space-y-4">
                <div>
                    <label htmlFor="totalEstate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('inheritanceTotalEstate')}</label>
                    <input type="number" name="totalEstate" id="totalEstate" value={input.totalEstate || ''} onChange={handleInputChange} placeholder="200000" className="w-full p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]" required/>
                </div>
                
                <div className="pt-4 border-t border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">{t('inheritanceHeirs')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-2 rounded-md bg-black/5 dark:bg-white/5">
                            <input type="checkbox" id="hasSpouse" name="hasSpouse" checked={input.hasSpouse} onChange={handleInputChange} className="h-5 w-5 rounded accent-[var(--accent-primary)]"/>
                            <label htmlFor="hasSpouse" className="text-sm font-medium">{t('inheritanceSpouse')}</label>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-black/5 dark:bg-white/5">
                            <input type="checkbox" id="hasFather" name="hasFather" checked={input.hasFather} onChange={handleInputChange} className="h-5 w-5 rounded accent-[var(--accent-primary)]"/>
                            <label htmlFor="hasFather" className="text-sm font-medium">{t('inheritanceFather')}</label>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md bg-black/5 dark:bg-white/5">
                            <input type="checkbox" id="hasMother" name="hasMother" checked={input.hasMother} onChange={handleInputChange} className="h-5 w-5 rounded accent-[var(--accent-primary)]"/>
                            <label htmlFor="hasMother" className="text-sm font-medium">{t('inheritanceMother')}</label>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                             <label htmlFor="sons" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('inheritanceSons')}</label>
                             <input type="number" id="sons" name="sons" value={input.sons || ''} onChange={handleInputChange} min="0" className="w-full p-2 border-none rounded-lg bg-transparent text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"/>
                        </div>
                        <div>
                             <label htmlFor="daughters" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('inheritanceDaughters')}</label>
                             <input type="number" id="daughters" name="daughters" value={input.daughters || ''} onChange={handleInputChange} min="0" className="w-full p-2 border-none rounded-lg bg-transparent text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]"/>
                        </div>
                    </div>
                </div>
                 
                <button type="submit" disabled={isLoading} className="w-full px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60 transition-all duration-300">
                    {isLoading ? t('generatingButton') : t('inheritanceCalculate')}
                </button>
            </form>

            {isLoading && <div className="mt-4"><LoadingIndicator message={t('generatingButton')} /></div>}
            {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
            
            {result && (
                <div className="mt-6 w-full max-w-lg mx-auto glass-card p-6 animate-fade-in">
                     <h3 className="font-lora text-xl font-bold text-center mb-4 text-[var(--text-primary)]">{t('inheritanceResultTitle')}</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-[var(--text-secondary)] uppercase border-b border-[var(--border-color)]">
                                <tr>
                                    <th scope="col" className="px-4 py-2">{t('inheritanceHeir')}</th>
                                    <th scope="col" className="px-4 py-2 text-center">{t('inheritanceShare')}</th>
                                    <th scope="col" className="px-4 py-2 text-right">{t('inheritanceAmount')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((res, i) => (
                                    <tr key={i} className="border-b border-[var(--border-color)]">
                                        <td className="px-4 py-2 font-medium">{res.heir}</td>
                                        <td className="px-4 py-2 text-center font-mono">{res.share}</td>
                                        <td className="px-4 py-2 text-right font-mono">{res.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                     <p className="mt-4 text-xs text-center text-amber-400 p-2 bg-amber-500/10 rounded-md">{t('inheritanceWarning')}</p>
                </div>
            )}
        </div>
    );
};

export default InheritanceCalculator;
