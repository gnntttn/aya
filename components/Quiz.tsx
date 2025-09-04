
import React, { useState, useContext, useEffect } from 'react';
import { generateQuizQuestions, isApiKeyAvailable } from '../services/geminiService';
import { LanguageContext } from '../types';
import type { LanguageContextType, QuizQuestion, QuizState } from '../types';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

type ApiKeyStatus = 'checking' | 'available' | 'unavailable';

const Quiz: React.FC = () => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [quizState, setQuizState] = useState<QuizState>('idle');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>('checking');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    useEffect(() => {
        const checkKey = async () => {
            const available = await isApiKeyAvailable();
            setApiKeyStatus(available ? 'available' : 'unavailable');
        };
        checkKey();
    }, []);

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
            setQuizState('idle');
        }
    };

    const IdleState = () => (
        <div className="w-full text-center flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="mb-6 text-[var(--accent-primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-4">{t('quizTitle')}</h2>
            <p className="text-md text-[var(--text-secondary)] mb-8 max-w-md">{t('quizIntro')}</p>
            
            {apiKeyStatus === 'checking' && <div className="mb-4"><LoadingIndicator message={t('checkingConfig')} /></div>}

            {apiKeyStatus === 'unavailable' && (
                <div className="mb-4 w-full">
                    <ErrorMessage message="Please configure the API_KEY." />
                </div>
            )}
            
            {error && <div className="mb-4 w-full"><ErrorMessage message={error} /></div>}

            {apiKeyStatus === 'available' && (
                <button
                    onClick={fetchQuiz}
                    className="w-full max-w-xs px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-lg hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {t('quizStart')}
                </button>
            )}
        </div>
    );

    const ResultsState = () => (
        <div className="w-full text-center glass-card p-8 animate-fade-in">
            <h2 className="font-lora text-2xl font-bold text-[var(--text-primary)] mb-2">{t('quizResults')}</h2>
            <p className="text-4xl font-bold my-4 text-[var(--accent-primary)]">{Math.round((score/questions.length)*100)}%</p>
            <p className="text-lg mb-6 text-[var(--text-secondary)]">{t('quizScore', { score, total: questions.length })}</p>
            <button
                onClick={fetchQuiz}
                className="w-full max-w-xs px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300"
            >
                {t('quizRestart')}
            </button>
        </div>
    );
    
    if (quizState === 'idle') return <IdleState />;
    if (quizState === 'loading') return <LoadingIndicator message={t('quizGenerating')} />;
    if (quizState === 'results') return <ResultsState />;
    if (quizState !== 'active' || questions.length === 0) return <IdleState />; // Fallback to idle if something is wrong

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
            <div className="text-center mb-6">
                <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">{t('quizQuestion')} {currentQuestionIndex + 1}{t('quizOf')}{questions.length}</p>
            </div>
            
            <div className="glass-card p-6">
                <h3 className={`font-lora text-xl font-semibold mb-6 min-h-[6rem] ${language === 'ar' ? 'text-right' : 'text-left'}`}>{currentQuestion.question[language]}</h3>

                <div className="space-y-3">
                    {currentQuestion.options[language].map((option, index) => {
                        let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ';
                        if (isAnswered) {
                            if (index === currentQuestion.correctAnswerIndex) buttonClass += 'bg-green-500/20 border-green-500 font-semibold';
                            else if (selectedAnswer === index) buttonClass += 'bg-red-500/20 border-red-500 opacity-70';
                            else buttonClass += 'bg-transparent border-transparent text-[var(--text-secondary)] opacity-60';
                        } else {
                             buttonClass += 'bg-black/5 dark:bg-white/5 border-transparent hover:border-[var(--accent-primary)]';
                        }
                        return (
                            <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isAnswered} className={buttonClass}>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 rounded-lg bg-black/5 dark:bg-white/5 animate-fade-in">
                        <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswerIndex ? 'text-green-400' : 'text-red-400'}`}>{selectedAnswer === currentQuestion.correctAnswerIndex ? t('quizCorrect') : t('quizIncorrect')}</p>
                        <p className="text-sm mt-1 text-[var(--text-secondary)]">{currentQuestion.explanation[language]}</p>
                    </div>
                )}
                
                <div className="mt-8 text-center">
                    {isAnswered && (
                         <button
                            onClick={handleNext}
                            className="w-full px-8 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transition-all duration-300"
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
