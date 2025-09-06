
import type { Dua, QuizQuestion, Language, Ayah, Reflection, Tafsir, RecitationFeedback, Hadith, ProphetStory, FiqhAnswer, SahabiStory, InheritanceInput, InheritanceResult, TravelInfo, DreamInterpretation, HadithSearchResult } from '../types';
import { logApiCall } from './trackingService';

/**
 * Checks if the API key is available by querying a secure serverless function.
 * @returns {Promise<boolean>} True if the API key is configured on the server.
 */
export const isApiKeyAvailable = async (): Promise<boolean> => {
  const startTime = Date.now();
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'diag' })
    });
    const success = response.ok;
    logApiCall('diag', Date.now() - startTime, success);
    if (!success) {
        console.error("Diag check failed with status:", response.status);
        return false;
    }
    const data = await response.json();
    return data.hasApiKey === true;
  } catch (e) {
    logApiCall('diag', Date.now() - startTime, false);
    console.error("API key check failed:", e);
    return false;
  }
};

const callGeminiApi = async (type: string, payload: any) => {
    const startTime = Date.now();
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, payload })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `Failed to call API for type: ${type}.`);
        }
        logApiCall(type, Date.now() - startTime, true);
        return data;
    } catch (err) {
        logApiCall(type, Date.now() - startTime, false);
        throw err;
    }
};

export const generateDua = (prompt: string, language: string): Promise<Dua> => callGeminiApi('dua', { prompt, language });
export const generateQuizQuestions = (): Promise<QuizQuestion[]> => callGeminiApi('quiz', {});
export const getTafsir = (ayah: Ayah, language: Language): Promise<Tafsir> => callGeminiApi('tafsir', { ayah, language });
export const getAsmaulHusnaExplanation = async (name: string, language: Language): Promise<string> => {
    const data = await callGeminiApi('asmaulhusna', { name, language });
    return data.explanation;
};
export const getSpiritualReflection = async (feeling: string, language: Language): Promise<string> => {
    const data = await callGeminiApi('reflection', { feeling, language });
    return data.reflection;
};
export const getRecitationFeedback = (recitedText: string, actualVerseText: string, language: Language): Promise<RecitationFeedback> => callGeminiApi('recitation', { recitedText, actualVerseText, language });
export const getHadithOfTheDay = (language: Language): Promise<Hadith> => callGeminiApi('hadith', { language });
export const getProphetStory = (prophetName: string, language: Language): Promise<ProphetStory> => callGeminiApi('prophetStory', { prophetName, language });
export const getSahabiStory = (sahabiName: string, language: Language): Promise<SahabiStory> => callGeminiApi('sahabiStory', { sahabiName, language });
export const getFiqhAnswer = (question: string, language: Language): Promise<FiqhAnswer> => callGeminiApi('fiqhQA', { question, language });
export const calculateInheritance = (input: InheritanceInput, language: Language): Promise<InheritanceResult[]> => callGeminiApi('inheritance', { input, language });
export const getHalalTravelInfo = (city: string, language: Language): Promise<TravelInfo> => callGeminiApi('halalTravel', { city, language });
export const getDreamInterpretation = (dream: string, language: Language): Promise<DreamInterpretation> => callGeminiApi('dream', { dream, language });
export const searchHadith = (topic: string, language: Language): Promise<HadithSearchResult[]> => callGeminiApi('hadithSearch', { topic, language });
export const getHajjUmrahQa = async (question: string, language: Language): Promise<string> => {
    const data = await callGeminiApi('hajjUmrahQA', { question, language });
    return data.answer;
};
