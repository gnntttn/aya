
import { GoogleGenAI, Type } from "@google/genai";
import type { Dua, QuizQuestion, Language } from '../types';

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
// As per the project guidelines, we assume the execution environment handles this.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- DUA GENERATION ---

const getDuaSchema = (languageName: string) => ({
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: `A short, relevant title for the dua in ${languageName}.`
    },
    duaText: {
      type: Type.STRING,
      description: `The full text of the supplication in ${languageName}. If the original dua is in Arabic, this field should contain the translation.`
    },
     duaArabic: {
      type: Type.STRING,
      description: "The original Arabic text of the dua, if it is from a traditional source (Quran/Hadith). Provide an empty string if the dua is composed and has no original Arabic text."
    },
    duaTransliteration: {
      type: Type.STRING,
      description: "The transliteration of the Arabic text. Provide an empty string if duaArabic is empty."
    },
    reference: {
      type: Type.STRING,
      description: `A reference to a Quranic verse or Hadith that inspired the dua, if applicable. E.g., 'Inspired by Surah Al-Baqarah, Ayah 286'. Provide an empty string if not applicable. The reference should be in ${languageName}.`
    },
  },
  required: ['title', 'duaText', 'duaArabic', 'duaTransliteration', 'reference'],
});

const getDuaSystemInstruction = (languageName: string) => `You are a knowledgeable and compassionate Islamic scholar. Your task is to generate a heartfelt and authentic supplication (dua) based on the user's request, in the specified language: ${languageName}. The dua should be eloquent, comforting, and rooted in Islamic principles. Where appropriate, include the original Arabic text from the Quran or Hadith, its transliteration, and its translation into ${languageName}. Also, mention a relevant verse or hadith as a source of inspiration or reference. Provide the response in a structured JSON format according to the provided schema.`;


export const generateDua = async (prompt: string, language: string): Promise<Dua> => {
  try {
    const languageMap: { [key: string]: string } = { en: 'English', ar: 'Arabic', fr: 'French' };
    const languageName = languageMap[language] || 'English';

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user's need is: "${prompt}". Generate a dua for them in ${languageName}.`,
      config: {
        systemInstruction: getDuaSystemInstruction(languageName),
        responseMimeType: "application/json",
        responseSchema: getDuaSchema(languageName),
      },
    });

    let jsonString = response.text.trim();
    if (jsonString.startsWith('```') && jsonString.endsWith('```')) {
        jsonString = jsonString.slice(3, -3);
        if (jsonString.startsWith('json')) {
            jsonString = jsonString.slice(4).trim();
        }
    }
    const parsedDua: Dua = JSON.parse(jsonString);

    return parsedDua;

  } catch (error) {
    console.error("Error generating dua from Gemini API:", error);
    // Check if the error is related to the API key and throw a specific message for the UI to handle.
    if (error instanceof Error && /API_KEY/i.test(error.message)) {
      throw new Error("AI features are disabled. Please configure the API_KEY.");
    }
    throw error;
  }
};


// --- QUIZ GENERATION ---

const getQuizSchema = () => ({
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.OBJECT,
        properties: {
          en: { type: Type.STRING },
          ar: { type: Type.STRING },
          fr: { type: Type.STRING },
        },
        required: ['en', 'ar', 'fr'],
        description: 'The quiz question, translated into English, Arabic, and French.',
      },
      options: {
        type: Type.OBJECT,
        properties: {
          en: { type: Type.ARRAY, items: { type: Type.STRING } },
          ar: { type: Type.ARRAY, items: { type: Type.STRING } },
          fr: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['en', 'ar', 'fr'],
        description: 'An array of 4 possible answers, translated into English, Arabic, and French.',
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: 'The index (0-3) of the correct answer in the options array.',
      },
      explanation: {
        type: Type.OBJECT,
        properties: {
          en: { type: Type.STRING },
          ar: { type: Type.STRING },
          fr: { type: Type.STRING },
        },
        required: ['en', 'ar', 'fr'],
        description: 'A brief explanation for the correct answer, translated into all three languages.',
      },
    },
    required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
  },
});

const getQuizSystemInstruction = () => `You are an expert Islamic studies educator. Your task is to generate a set of 5 unique, multiple-choice quiz questions about Islam. The topics should be diverse and interesting, covering the Quran, Hadith, Prophets, Islamic history, and pillars of Islam. The questions should vary in difficulty. For each question, you must provide the question text, 4 answer options, the index of the correct answer, and a brief explanation. CRITICALLY, you must provide all text (questions, options, explanations) fully translated into English, Arabic, and French. Adhere strictly to the provided JSON schema.`;

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 5 new, interesting, and varied quiz questions about Islam.",
            config: {
                systemInstruction: getQuizSystemInstruction(),
                responseMimeType: "application/json",
                responseSchema: getQuizSchema(),
            },
        });

        let jsonString = response.text.trim();
        if (jsonString.startsWith('```') && jsonString.endsWith('```')) {
            jsonString = jsonString.slice(3, -3);
            if (jsonString.startsWith('json')) {
                jsonString = jsonString.slice(4).trim();
            }
        }
        const parsedQuiz: QuizQuestion[] = JSON.parse(jsonString);
        
        return parsedQuiz;

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        // Check if the error is related to the API key and throw a specific message for the UI to handle.
        if (error instanceof Error && /API_KEY/i.test(error.message)) {
          throw new Error("AI features are disabled. Please configure the API_KEY.");
        }
        throw error;
    }
}
