
import type { Dua, QuizQuestion, Language, Ayah, Reflection, Tafsir, RecitationFeedback, Hadith, ProphetStory, FiqhAnswer, SahabiStory, InheritanceInput, InheritanceResult, TravelInfo, DreamInterpretation, HadithSearchResult } from '../types';

/**
 * Checks if the API key is available by querying a secure serverless function.
 * @returns {Promise<boolean>} True if the API key is configured on the server.
 */
export const isApiKeyAvailable = async (): Promise<boolean> => {
  try {
    // This endpoint is a serverless function that checks for process.env.API_KEY.
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'diag' })
    });
    if (!response.ok) {
        console.error("Diag check failed with status:", response.status);
        return false;
    }
    const data = await response.json();
    return data.hasApiKey === true;
  } catch (e) {
    console.error("API key check failed:", e);
    return false;
  }
};

/**
 * Generates a dua by sending a request to the secure serverless proxy.
 * @param {string} prompt - The user's prompt for the dua.
 * @param {string} language - The requested language.
 * @returns {Promise<Dua>} The generated dua object.
 */
export const generateDua = async (prompt: string, language: string): Promise<Dua> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'dua',
      payload: { prompt, language }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    // The serverless function sends back a JSON object with an 'error' key.
    throw new Error(data.error || 'Failed to generate dua.');
  }
  return data as Dua;
};

/**
 * Generates quiz questions by sending a request to the secure serverless proxy.
 * @returns {Promise<QuizQuestion[]>} An array of generated quiz questions.
 */
export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'quiz',
            payload: {} // No specific payload needed for quiz generation
        })
    });
    
    const data = await response.json();
    if (!response.ok) {
        // The serverless function sends back a JSON object with an 'error' key.
        throw new Error(data.error || 'Failed to generate quiz.');
    }
    return data as QuizQuestion[];
}

/**
 * Gets AI-powered tafsir for a specific Ayah.
 * @param {Ayah} ayah - The Ayah object.
 * @param {Language} language - The requested language for the explanation.
 * @returns {Promise<Tafsir>} The structured tafsir object.
 */
export const getTafsir = async (ayah: Ayah, language: Language): Promise<Tafsir> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'tafsir',
      payload: { ayah, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate tafsir.');
  }
  return data as Tafsir;
};

/**
 * Gets AI-powered explanation for one of Allah's names.
 * @param {string} name - The name of Allah (e.g., "Ar-Rahman").
 * @param {Language} language - The requested language for the explanation.
 * @returns {Promise<string>} The explanation text.
 */
export const getAsmaulHusnaExplanation = async (name: string, language: Language): Promise<string> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify