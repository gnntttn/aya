
import type { Dua, QuizQuestion, Language, Ayah, Reflection, Tafsir, RecitationFeedback, Hadith, ProphetStory, FiqhAnswer, SahabiStory, InheritanceInput, InheritanceResult, TravelInfo, DreamInterpretation, HadithSearchResult } from '../types';

/**
 * Checks if the API key is available by querying a secure serverless function.
 * @returns {Promise<boolean>} True if the API key is configured on the server.
 */
export const isApiKeyAvailable = async (): Promise<boolean> => {
  try {
    // This endpoint is a serverless function that checks for process.env.API_KEY.
    const response = await fetch('/.netlify/functions/diag');
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
    body: JSON.stringify({
      type: 'asmaulhusna',
      payload: { name, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate explanation.');
  }
  return data.explanation as string;
};

/**
 * Gets a spiritual reflection based on the user's feeling.
 * @param {string} feeling - The user's described feeling.
 * @param {Language} language - The requested language for the reflection.
 * @returns {Promise<string>} The reflection text.
 */
export const getSpiritualReflection = async (feeling: string, language: Language): Promise<string> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'reflection',
      payload: { feeling, language }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate reflection.');
  }
  return data.reflection as string;
};

/**
 * Gets AI feedback on a user's recitation of a Quranic verse.
 * @param {string} recitedText - The text transcribed from the user's speech.
 * @param {string} actualVerseText - The correct text of the verse.
 * @param {Language} language - The language for the feedback.
 * @returns {Promise<RecitationFeedback>} The structured feedback object.
 */
export const getRecitationFeedback = async (recitedText: string, actualVerseText: string, language: Language): Promise<RecitationFeedback> => {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'recitation',
            payload: { recitedText, actualVerseText, language }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to get recitation feedback.');
    }
    return data as RecitationFeedback;
};

/**
 * Gets an AI-powered Hadith of the Day.
 * @param {Language} language - The requested language for the Hadith.
 * @returns {Promise<Hadith>} The structured Hadith object.
 */
export const getHadithOfTheDay = async (language: Language): Promise<Hadith> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'hadith',
      payload: { language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate Hadith.');
  }
  return data as Hadith;
};


/**
 * Gets an AI-powered story of a prophet.
 * @param {string} prophetName - The name of the prophet.
 * @param {Language} language - The requested language for the story.
 * @returns {Promise<ProphetStory>} The structured prophet story object.
 */
export const getProphetStory = async (prophetName: string, language: Language): Promise<ProphetStory> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'prophetStory',
      payload: { prophetName, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate Prophet Story.');
  }
  return data as ProphetStory;
};


/**
 * Gets an AI-powered answer to a Fiqh question.
 * @param {string} question - The user's question.
 * @param {Language} language - The requested language for the answer.
 * @returns {Promise<FiqhAnswer>} The structured answer object.
 */
export const getFiqhAnswer = async (question: string, language: Language): Promise<FiqhAnswer> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'fiqhQA',
      payload: { question, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate Fiqh answer.');
  }
  return data as FiqhAnswer;
};

/**
 * Gets an AI-powered story of a Sahabi.
 * @param {string} sahabiName - The name of the companion.
 * @param {Language} language - The requested language for the story.
 * @returns {Promise<SahabiStory>} The structured Sahabi story object.
 */
export const getSahabiStory = async (sahabiName: string, language: Language): Promise<SahabiStory> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'sahabiStory',
      payload: { sahabiName, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate Sahabi Story.');
  }
  return data as SahabiStory;
};

/**
 * Calculates Islamic inheritance.
 * @param {InheritanceInput} input - The details of the estate and heirs.
 * @param {Language} language - The requested language for the results.
 * @returns {Promise<InheritanceResult[]>} The distribution of the inheritance.
 */
export const calculateInheritance = async (input: InheritanceInput, language: Language): Promise<InheritanceResult[]> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'inheritance',
      payload: { input, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to calculate inheritance.');
  }
  return data as InheritanceResult[];
};

/**
 * Gets Halal travel information for a city.
 * @param {string} city - The name of the city.
 * @param {Language} language - The requested language for the information.
 * @returns {Promise<TravelInfo>} Halal travel info.
 */
export const getHalalTravelInfo = async (city: string, language: Language): Promise<TravelInfo> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'halalTravel',
      payload: { city, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get travel info.');
  }
  return data as TravelInfo;
};

/**
 * Gets an Islamic interpretation of a dream.
 * @param {string} dream - The description of the dream.
 * @param {Language} language - The requested language for the interpretation.
 * @returns {Promise<DreamInterpretation>} The dream interpretation.
 */
export const getDreamInterpretation = async (dream: string, language: Language): Promise<DreamInterpretation> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'dream',
      payload: { dream, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to interpret dream.');
  }
  return data as DreamInterpretation;
};

/**
 * Searches for Hadith based on a topic.
 * @param {string} topic - The topic to search for.
 * @param {Language} language - The requested language for the results.
 * @returns {Promise<HadithSearchResult[]>} A list of relevant Hadith.
 */
export const searchHadith = async (topic: string, language: Language): Promise<HadithSearchResult[]> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'hadithSearch',
      payload: { topic, language }
    })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to search Hadith.');
  }
  return data as HadithSearchResult[];
};

/**
 * Gets an AI answer to a specific Hajj/Umrah question.
 * @param {string} question - The user's question.
 * @param {Language} language - The language for the answer.
 * @returns {Promise<string>} The answer text.
 */
export const getHajjUmrahQa = async (question: string, language: Language): Promise<string> => {
  const response = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'hajjUmrahQA',
      payload: { question, language }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get answer.');
  }
  return data.answer as string;
};
