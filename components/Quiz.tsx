
import React, { useState, useContext } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { LanguageContext } from '../types';
import type { LanguageContextType, QuizQuestion, QuizState } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const Quiz: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    const fetchQuiz = async () => {
        setQuizState('loading');
        setError(null);
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        try {
            const quiz = await generateQuizQuestions();
            setQuestions(quiz);
            setQuizState('active');
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate a new quiz. Please try again.";
            setError(message);
            console.error(err);
            setQuizState('idle'); // Revert to idle on error
        }
    };

    if (quizState === 'idle') {
        return (
            <div className="w-full text-center flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="mb-6 text-[var(--accent-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.455L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.455l.398-1.178.398 1.178a3.375 3.375 0 002.455 2.455l1.178.398-1.178.398a3.375 3.375 0 00-2.455 2.455z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-4">{t('quizTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] mb-8 max-w-md">{t('quizIntro')}</p>
                {error && <div className="mb-4 w-full"><ErrorMessage message={error} /></div>}
                <button
                    onClick={fetchQuiz}
                    className="w-full max-w-xs px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-lg hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300"
                >
                    {t('quizStart')}
                </button>
            </div>
        );
    }
    
    if (quizState === 'loading') {
        return <LoadingIndicator message={t('quizGenerating')} />;
    }

    if (quizState === 'results') {
        return (
            <div className="w-full text-center bg-[var(--bg-secondary)] p-8 rounded-lg shadow-xl animate-fade-in">
                <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">{t('quizResults')}</h2>
                <p className="text-lg mb-6">{t('quizScore', { score, total: questions.length })}</p>
                <button
                    onClick={fetchQuiz}
                    className="w-full max-w-xs px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300"
                >
                    {t('quizRestart')}
                </button>
            </div>
        );
    }
    
    if (quizState !== 'active' || questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (answerIndex: number) => {
        if (isAnswered) return;
        setSelectedAnswer(answerIndex);
        setIsAnswered(true);
        if (answerIndex === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setQuizState('results');
        }
    };

    return (
        <div className="w-full animate-fade-in">
            <h2 className="text-3xl font-bold text-[var(--accent-primary)] mb-4 text-center">{t('quizTitle')}</h2>
            
            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow-lg border border-[var(--border-color)]">
                <div className="mb-6">
                    <p className="text-sm text-[var(--text-secondary)]">{t('quizQuestion')} {currentQuestionIndex + 1} {t('quizOf')} {questions.length}</p>
                    <h3 className={`text-xl font-semibold mt-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>{currentQuestion.question[language]}</h3>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options[language].map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ';
                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswerIndex) {
                                buttonClass += 'bg-green-500/20 border-green-500 text-green-300 font-semibold';
                            } else if (isSelected) {
                                buttonClass += 'bg-red-500/20 border-red-500 text-red-300 opacity-70';
                            } else {
                                buttonClass += 'bg-[var(--bg-primary)] border-transparent text-[var(--text-secondary)] opacity-60';
                            }
                        } else {
                            buttonClass += 'bg-[var(--bg-primary)] border-transparent hover:border-[var(--accent-primary)] hover:bg-teal-500/10';
                        }
                        
                        return (
                            <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isAnswered} className={buttonClass}>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 rounded-lg bg-black/20 animate-fade-in">
                        <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'text-green-400' : 'text-red-400'}`}>{selectedAnswer === currentQuestion.correctAnswerIndex ? t('quizCorrect') : t('quizIncorrect')}</p>
                        <p className="text-sm mt-1 text-[var(--text-secondary)]">{currentQuestion.explanation[language]}</p>
                    </div>
                )}
                
                <div className="mt-8 text-center">
                    {isAnswered && (
                         <button
                            onClick={handleNext}
                            className="w-full px-8 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                        >
                            {currentQuestionIndex < questions.length - 1 ? t('quizNext') : t('quizResults')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;