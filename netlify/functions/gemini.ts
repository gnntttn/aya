import { GoogleGenAI, Type } from "@google/genai";
import type { Dua, QuizQuestion, Language, Ayah } from "../../types";

// Define TypeScript interfaces for the Lambda event and response
interface HandlerEvent {
  httpMethod: string;
  body: string | null;
}
interface HandlerResponse {
  statusCode: number;
  headers?: { [key: string]: string };
  body: string;
}

const modelName = "gemini-2.5-flash";

// --- DUA GENERATION SCHEMAS ---
const getDuaSchema = (languageName: string) => ({
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: `A short, relevant title for the dua in ${languageName}.` },
    duaText: { type: Type.STRING, description: `The full text of the supplication in ${languageName}. If the original dua is in Arabic, this field should contain the translation.` },
    duaArabic: { type: Type.STRING, description: "The original Arabic text of the dua, if it is from a traditional source (Quran/Hadith). Provide an empty string if it has no original Arabic text." },
    duaTransliteration: { type: Type.STRING, description: "The transliteration of the Arabic text. Provide an empty string if duaArabic is empty." },
    reference: { type: Type.STRING, description: `A reference to a Quranic verse or Hadith that inspired the dua, if applicable. E.g., 'Inspired by Surah Al-Baqarah, Ayah 286'. Provide an empty string if not applicable. The reference should be in ${languageName}.` },
  },
  required: ['title', 'duaText', 'duaArabic', 'duaTransliteration', 'reference'],
});
const getDuaSystemInstruction = (languageName: string) => `You are a compassionate Islamic scholar. Your task is to generate a heartfelt supplication (dua) based on the user's request, in ${languageName}. The dua should be eloquent, comforting, and rooted in Islamic principles. If appropriate, include the original Arabic text from the Quran or Hadith, its transliteration, and its translation. Provide the response in a structured JSON format according to the provided schema.`;

// --- QUIZ GENERATION SCHEMAS ---
const getQuizSchema = () => ({
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.OBJECT,
        properties: { en: { type: Type.STRING }, ar: { type: Type.STRING }, fr: { type: Type.STRING } },
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
      correctAnswerIndex: { type: Type.INTEGER, description: 'The index (0-3) of the correct answer in the options array.' },
      explanation: {
        type: Type.OBJECT,
        properties: { en: { type: Type.STRING }, ar: { type: Type.STRING }, fr: { type: Type.STRING } },
        required: ['en', 'ar', 'fr'],
        description: 'A brief explanation for the correct answer, translated into all three languages.',
      },
    },
    required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
  },
});
const getQuizSystemInstruction = () => `You are an expert Islamic studies educator. Generate a set of 5 unique, multiple-choice quiz questions about Islam. Topics should be diverse: Quran, Hadith, Prophets, Islamic history, and pillars of Islam, with varied difficulty. For each question, provide the question text, 4 answer options, the correct answer's index, and a brief explanation. CRITICALLY, you must provide all text (questions, options, explanations) fully translated into English, Arabic, and French. Adhere strictly to the provided JSON schema.`;

// --- TAFSIR GENERATION ---
const getTafsirSystemInstruction = (languageName: string) => `You are a knowledgeable and clear Islamic studies teacher specializing in Tafsir (Quranic exegesis). Your task is to provide a concise, easy-to-understand explanation for a specific Quranic verse, in ${languageName}. Your explanation should cover the verse's meaning, context, and key lessons. Avoid overly academic language and make it accessible to a general audience seeking spiritual insight.`;

// --- ASMA'UL HUSNA EXPLANATION ---
const getAsmaulHusnaSystemInstruction = (languageName: string) => `You are a deeply knowledgeable Islamic scholar with a gift for explaining spiritual concepts. Your task is to provide a profound and inspiring explanation of one of the 99 Names of Allah (Asma'ul Husna), in ${languageName}. The explanation should be rich in meaning, covering the linguistic roots and spiritual implications of the name, and how a believer can reflect on this attribute in their life. Make it accessible and moving for a general audience.`;

// --- SPIRITUAL REFLECTION ---
const getReflectionSystemInstruction = (languageName: string) => `You are a wise and empathetic spiritual companion. A user will tell you how they are feeling. Your task is to respond with a short, comforting, and uplifting reflection in ${languageName}. Your response should include a relevant verse from the Quran or a Hadith that connects to their feeling. Format the response beautifully, perhaps with the verse/hadith on a new line and clearly cited. Your tone should be gentle and reassuring. Do not ask questions back.`;

// --- RECITATION FEEDBACK ---
const getRecitationSystemInstruction = (languageName: string) => `You are an expert Quran teacher AI. Your task is to compare a user's recitation (provided as transcribed text) with the original Arabic text of a Quranic verse. 
1.  Analyze the two texts for any differences (missing words, incorrect words, extra words).
2.  If the recitation is identical to the verse, respond with a positive and encouraging confirmation like "Masha'Allah, your recitation is correct."
3.  If there are mistakes, provide gentle, simple, and clear feedback. For example: "Good effort. It seems you may have missed or mispronounced a word. Please check the original text and try again." Do NOT provide a word-by-word breakdown unless it's a single, obvious error. Keep the feedback concise and encouraging.
4.  Your entire response must be in ${languageName}. Do not respond in JSON format.`;


export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Please configure the API_KEY." }) };
    }

    const ai = new GoogleGenAI({ apiKey });
    const { type, payload } = JSON.parse(event.body || "{}");

    let result;
    const languageMap: { [key in Language]: string } = { en: 'English', ar: 'Arabic', fr: 'French' };

    if (type === 'dua') {
      const { prompt, language } = payload;
      const languageName = languageMap[language] || 'English';

      const response = await ai.models.generateContent({
        model: modelName,
        contents: `User's need: "${prompt}". Generate a dua in ${languageName}.`,
        config: {
          systemInstruction: getDuaSystemInstruction(languageName),
          responseMimeType: "application/json",
          responseSchema: getDuaSchema(languageName),
        },
      });
      result = JSON.parse(response.text);

    } else if (type === 'quiz') {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Generate 5 new, interesting, and varied quiz questions about Islam.",
        config: {
            systemInstruction: getQuizSystemInstruction(),
            responseMimeType: "application/json",
            responseSchema: getQuizSchema(),
        },
      });
      result = JSON.parse(response.text);

    } else if (type === 'tafsir') {
        const { ayah, language } = payload as { ayah: Ayah; language: Language };
        const languageName = languageMap[language] || 'English';
        
        const prompt = `Provide a tafsir (explanation) for this verse: Surah ${ayah.surah?.englishName} (${ayah.surah?.name}), Ayah ${ayah.numberInSurah}, which reads: "${ayah.text}". Please provide the explanation in ${languageName}.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getTafsirSystemInstruction(languageName),
            },
        });
        result = { tafsir: response.text };

    } else if (type === 'asmaulhusna') {
        const { name, language } = payload as { name: string; language: Language };
        const languageName = languageMap[language] || 'English';

        const prompt = `Provide an explanation for the name of Allah: "${name}". The explanation should be in ${languageName}.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getAsmaulHusnaSystemInstruction(languageName),
            },
        });
        result = { explanation: response.text };

    } else if (type === 'reflection') {
        const { feeling, language } = payload as { feeling: string; language: Language };
        const languageName = languageMap[language] || 'English';
        
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `The user is feeling: "${feeling}".`,
            config: {
                systemInstruction: getReflectionSystemInstruction(languageName),
            },
        });
        result = { reflection: response.text };

    } else if (type === 'recitation') {
        const { recitedText, actualVerseText, language } = payload as { recitedText: string; actualVerseText: string, language: Language };
        const languageName = languageMap[language] || 'English';

        const prompt = `Original Verse: "${actualVerseText}"\nUser's Recitation (transcribed): "${recitedText}"\n\nPlease compare them and provide feedback in ${languageName}.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getRecitationSystemInstruction(languageName),
            },
        });
        result = { feedback: response.text };

    } else {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid request type" }) };
    }
    
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };

  } catch (e) {
    console.error("Gemini function error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown server error occurred.";
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: errorMessage }) };
  }
};