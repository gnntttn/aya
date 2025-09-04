
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, SpiritualGoal } from '../types';

const SpiritualGoals: React.FC = () => {
    const { t, goals, addGoal, updateGoal, removeGoal } = useContext(LanguageContext) as LanguageContextType;
    const [newGoalText, setNewGoalText] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalText.trim()) {
            addGoal(newGoalText.trim());
            setNewGoalText('');
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('goalsTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('goalsDescription')}</p>
            </div>

            <form onSubmit={handleAddGoal} className="w-full max-w-lg mx-auto glass-card p-4 flex items-center gap-2 mb-6">
                <input
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder={t('goalsAddPlaceholder')}
                    className="w-full p-3 border-none rounded-lg bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
                <button
                    type="submit"
                    className="px-5 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-60"
                    disabled={!newGoalText.trim()}
                >
                    {t('goalsAddButton')}
                </button>
            </form>

            <div className="w-full max-w-lg mx-auto space-y-3">
                {goals.length > 0 ? goals.map(goal => (
                    <div key={goal.id} className={`glass-card p-3 flex items-center gap-3 transition-all duration-300 ${goal.completed ? 'bg-green-500/10' : ''}`}>
                        <input
                            type="checkbox"
                            id={`goal-${goal.id}`}
                            checked={goal.completed}
                            onChange={(e) => updateGoal(goal.id, e.target.checked)}
                            className="h-6 w-6 rounded-md border-2 border-[var(--border-color)] accent-[var(--accent-primary)] shrink-0"
                        />
                        <label htmlFor={`goal-${goal.id}`} className={`flex-grow text-base ${goal.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                            {goal.text}
                        </label>
                        <button onClick={() => removeGoal(goal.id)} className="text-red-400/50 hover:text-red-400 p-2 rounded-full shrink-0">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-[var(--text-secondary)] p-6 glass-card">{t('goalsEmpty')}</p>
                )}
            </div>
        </div>
    );
};

export default SpiritualGoals;
