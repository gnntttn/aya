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
const getTafsirSchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        literalTranslation: { type: Type.STRING, description: `A direct, literal translation of the verse in ${languageName}.` },
        context: { type: Type.STRING, description: `A brief explanation of the context of revelation (Asbab al-Nuzul) for this verse in ${languageName}.` },
        explanation: { type: Type.STRING, description: `A detailed explanation and interpretation of the verse's meaning and message in ${languageName}.` },
        lessons: { type: Type.STRING, description: `A few key lessons or practical takeaways from the verse for a believer's life, in ${languageName}.` }
    },
    required: ['literalTranslation', 'context', 'explanation', 'lessons']
});
const getTafsirSystemInstruction = (languageName: string) => `You are a knowledgeable and clear Islamic scholar specializing in Tafsir (Quranic exegesis). Your task is to provide a comprehensive, structured explanation for a specific Quranic verse in ${languageName}, adhering strictly to the provided JSON schema. Your explanation must be broken down into four parts: a literal translation, the context of revelation (Asbab al-Nuzul), a detailed explanation of the meaning, and key lessons. Make the content accessible to a general audience seeking deep spiritual insight.`;


// --- ASMA'UL HUSNA EXPLANATION ---
const getAsmaulHusnaSystemInstruction = (languageName: string) => `You are a deeply knowledgeable Islamic scholar with a gift for explaining spiritual concepts. Your task is to provide a profound and inspiring explanation of one of the 99 Names of Allah (Asma'ul Husna), in ${languageName}. The explanation should be rich in meaning, covering the linguistic roots and spiritual implications of the name, and how a believer can reflect on this attribute in their life. Make it accessible and moving for a general audience.`;

// --- SPIRITUAL REFLECTION ---
const getReflectionSystemInstruction = (languageName: string) => `You are a wise and empathetic spiritual companion. A user will tell you how they are feeling. Your task is to respond with a short, comforting, and uplifting reflection in ${languageName}. Your response should include a relevant verse from the Quran or a Hadith that connects to their feeling. Format the response beautifully, perhaps with the verse/hadith on a new line and clearly cited. Your tone should be gentle and reassuring. Do not ask questions back.`;

// --- RECITATION FEEDBACK ---
const getRecitationFeedbackSchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        isCorrect: { type: Type.BOOLEAN, description: "True if the user's recitation perfectly matches the original verse, otherwise false." },
        feedbackMessage: { type: Type.STRING, description: `A general, encouraging feedback message in ${languageName}. E.g., "Masha'Allah, perfect recitation!" or "Good effort, let's look at a small correction."` },
        recitedText: { type: Type.STRING, description: "The transcribed text of what the user recited." },
        correctionDetails: {
            type: Type.OBJECT,
            properties: {
                mistake: { type: Type.STRING, description: "The specific word(s) the user recited incorrectly." },
                correct: { type: Type.STRING, description: "The corresponding correct word(s) from the verse." }
            },
            description: "Provide this object only if a mistake is found."
        }
    },
    required: ['isCorrect', 'feedbackMessage']
});
const getRecitationSystemInstruction = (languageName: string) => `You are an expert Quran teacher AI with a precise ear. Your task is to meticulously compare a user's recitation (provided as transcribed text) with the original Arabic text of a Quranic verse and provide structured feedback in JSON format.
1.  **Analyze:** Compare the texts for any differences (missing words, incorrect words, extra words).
2.  **Determine Correctness:** If the recitation is identical, set 'isCorrect' to true. Otherwise, set it to false.
3.  **Provide Feedback Message:** Write a gentle, encouraging message in ${languageName} that reflects the result.
4.  **Detail Corrections:** If 'isCorrect' is false, you MUST identify the specific mistake. Populate 'correctionDetails' with the incorrect word(s) the user said and the correct word(s) they should have said. If there are multiple errors, focus on the first significant one. Include the full 'recitedText' from the user.
5.  **Adhere to Schema:** Your entire response must be a single JSON object that strictly follows the provided schema.`;


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
        
        const prompt = `Provide a structured tafsir for this verse: Surah ${ayah.surah?.englishName} (${ayah.surah?.name}), Ayah ${ayah.numberInSurah}, which reads: "${ayah.text}". Please provide the full explanation in ${languageName}.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getTafsirSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getTafsirSchema(languageName),
            },
        });
        result = JSON.parse(response.text);

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

        const prompt = `Original Verse: "${actualVerseText}"\nUser's Recitation (transcribed): "${recitedText}"\n\nPlease compare them and provide structured feedback in ${languageName} according to the schema.`;

        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getRecitationSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getRecitationFeedbackSchema(languageName),
            },
        });
        result = JSON.parse(response.text);

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