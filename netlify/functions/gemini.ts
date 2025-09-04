
import { GoogleGenAI, Type } from "@google/genai";
import type { Dua, QuizQuestion, Language, Ayah, Hadith, ProphetStory, FiqhAnswer, InheritanceInput, SahabiStory, TravelInfo, DreamInterpretation, HadithSearchResult, InheritanceResult } from "../../types";

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

// --- HADITH OF THE DAY ---
const getHadithSchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        hadithText: { type: Type.STRING, description: `The text of the Hadith, translated into ${languageName}.` },
        narrator: { type: Type.STRING, description: `The primary narrator(s) of the Hadith, in ${languageName}.` },
        reference: { type: Type.STRING, description: `The source of the Hadith (e.g., Sahih al-Bukhari 52, Jami' at-Tirmidhi 197), in ${languageName}.` },
        briefExplanation: { type: Type.STRING, description: `A concise, easy-to-understand explanation of the Hadith's meaning and lesson, in ${languageName}.` },
    },
    required: ['hadithText', 'narrator', 'reference', 'briefExplanation']
});
const getHadithSystemInstruction = (languageName: string) => `You are an expert Islamic scholar specializing in Hadith. Your task is to select one authentic, impactful, and relatively short Hadith (from Sahih al-Bukhari, Sahih Muslim, Jami' at-Tirmidhi, etc.). Provide the Hadith and its details in ${languageName}, adhering strictly to the provided JSON schema. The explanation should be clear and accessible for a general audience.`;

// --- PROPHET STORY ---
const getProphetStorySchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        prophetName: { type: Type.STRING, description: `The name of the prophet in ${languageName}.` },
        story: { type: Type.STRING, description: `A concise, engaging, and well-structured story of the prophet in ${languageName}, suitable for a general audience.` },
        lessons: { type: Type.ARRAY, items: { type: Type.STRING }, description: `A list of 3-5 key lessons or morals from the prophet's story, in ${languageName}.` }
    },
    required: ['prophetName', 'story', 'lessons']
});
const getProphetStorySystemInstruction = (languageName: string) => `You are a master storyteller specializing in the lives of the prophets of Islam. Your task is to generate a summary of a prophet's story in ${languageName}, based on the user's request. The story should be accurate according to Islamic sources, written in a clear and captivating manner, and highlight the main events and trials of their life. Conclude with a list of key lessons. Adhere strictly to the provided JSON schema.`;

// --- SAHABA STORY ---
const getSahabiStorySchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        sahabiName: { type: Type.STRING, description: `The name of the Sahabi in ${languageName}.` },
        story: { type: Type.STRING, description: `A concise, engaging, and well-structured story of the Sahabi in ${languageName}, focusing on a key event or their character.` },
        lessons: { type: Type.ARRAY, items: { type: Type.STRING }, description: `A list of 3-5 key lessons or virtues from the Sahabi's life, in ${languageName}.` }
    },
    required: ['sahabiName', 'story', 'lessons']
});
const getSahabiStorySystemInstruction = (languageName: string) => `You are a master storyteller specializing in the lives of the Sahaba (Companions of the Prophet Muhammad PBUH). Your task is to generate a summary of a Sahabi's story in ${languageName}. The story should be accurate, captivating, and highlight their faith, character, and contributions to Islam. Conclude with a list of key lessons and virtues. Adhere strictly to the provided JSON schema.`;

// --- FIQH Q&A ---
const getFiqhQASchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "The user's original question." },
        answer: { type: Type.STRING, description: `A clear, concise, and helpful answer to the user's question in ${languageName}, based on mainstream Islamic scholarship.` },
        disclaimer: { type: Type.STRING, description: `The mandatory disclaimer, exactly as provided in the system instruction, translated into ${languageName}.` }
    },
    required: ['question', 'answer', 'disclaimer']
});
const getFiqhQASystemInstruction = (languageName: string) => `You are a helpful Islamic studies assistant. Your task is to answer user questions on various Islamic topics (Fiqh, Aqeedah, Seerah, etc.) in ${languageName}. Your answers should be accurate, neutral, and based on mainstream Sunni sources. CRITICALLY, you must include a disclaimer at the beginning of your response.
The disclaimer for ${languageName} is:
- English: "Disclaimer: This AI is for informational purposes only and is not a qualified scholar. Always consult a local scholar for formal religious rulings (fatwa)."
- Arabic: "إخلاء مسؤولية: هذا الذكاء الاصطناعي هو لأغراض معلوماتية فقط وليس عالمًا مؤهلاً. استشر دائمًا عالمًا محليًا للحصول على أحكام دينية رسمية (فتوى)."
- French: "Avertissement : Cette IA est à titre informatif uniquement et n'est pas un savant qualifié. Consultez toujours un savant local pour des décisions religieuses formelles (fatwa)."
Adhere strictly to the provided JSON schema. The 'disclaimer' field in the JSON must contain this exact text. The 'answer' field should start with the substance of the answer itself.`;

// --- INHERITANCE CALCULATOR ---
const getInheritanceSchema = (languageName: string) => ({
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            heir: { type: Type.STRING, description: `The name of the heir in ${languageName} (e.g., 'Wife', 'Son', 'Daughter').` },
            share: { type: Type.STRING, description: `The fractional share of the heir (e.g., '1/8', '2/3', 'Asabah').` },
            amount: { type: Type.NUMBER, description: "The calculated monetary amount for the heir." }
        },
        required: ['heir', 'share', 'amount']
    }
});
const getInheritanceSystemInstruction = (languageName: string) => `You are an expert system in Islamic inheritance law (Ilm al-Fara'id) according to Sunni jurisprudence. Your task is to calculate the precise distribution of an estate based on the provided heirs and total value.
**Rules to Follow:**
1.  **Quranic Heirs (Aṣḥāb al-Furūḍ):** Apply the fixed shares specified in the Quran first (e.g., wife gets 1/8 if there are children, mother gets 1/6 if there are children, etc.).
2.  **Residuary Heirs ('Asabah):** Distribute the remainder of the estate to the 'Asabah (e.g., sons, father). A son inherits twice the share of a daughter.
3.  **Blocking Rules (Hajb):** Apply the rules of exclusion. For example, the presence of a son excludes brothers and sisters. The presence of a father excludes the grandfather.
4.  **Special Cases:** Correctly handle cases like 'Radd' (return) and 'Awal' (increase) if they arise.
5.  **Output:** Provide the result as a JSON array where each object represents an heir, their fractional share, and the calculated monetary amount, all in ${languageName}. If an heir is blocked, do not include them in the final list.`;

// --- HALAL TRAVEL ---
const getHalalTravelSchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        mosques: { type: Type.ARRAY, items: { type: Type.STRING }, description: `A list of 3-5 well-known mosques or prayer places in the specified city, in ${languageName}.` },
        halalRestaurants: { type: Type.ARRAY, items: { type: Type.STRING }, description: `A list of 3-5 popular halal restaurants or food types in the city, in ${languageName}.` },
        generalTips: { type: Type.STRING, description: `A short paragraph with general tips for a Muslim traveler in that city (e.g., cultural norms, ease of finding halal food), in ${languageName}.` }
    },
    required: ['mosques', 'halalRestaurants', 'generalTips']
});
const getHalalTravelSystemInstruction = (languageName: string) => `You are a helpful Halal travel guide. Based on the user's specified city, provide a concise list of well-known mosques, popular halal restaurants, and some general tips for a Muslim traveler. Provide the response in ${languageName} and adhere strictly to the provided JSON schema.`;

// --- DREAM INTERPRETATION ---
const getDreamInterpretationSchema = (languageName: string) => ({
    type: Type.OBJECT,
    properties: {
        interpretation: { type: Type.STRING, description: `A possible interpretation of the dream based on common symbols in Islamic dream interpretation literature (like Ibn Sirin), provided in ${languageName}. The interpretation should be thoughtful and avoid making definitive claims.` },
        disclaimer: { type: Type.STRING, description: `The mandatory disclaimer in ${languageName}.` }
    },
    required: ['interpretation', 'disclaimer']
});
const getDreamInterpretationSystemInstruction = (languageName: string) => `You are an AI assistant knowledgeable in the symbolic interpretations of dreams found in classical Islamic literature. A user will describe a dream. Your task is to provide a potential, symbolic interpretation based on this knowledge.
**CRITICAL RULES:**
1.  **NEVER** present the interpretation as a fact or a prophecy. Use cautious language (e.g., "This could symbolize...", "It might suggest...", "Often, this represents...").
2.  Your response MUST begin with a mandatory disclaimer. The disclaimer for ${languageName} is:
    - English: "Disclaimer: Dream interpretations are symbolic and not definitive truth. Only Allah knows the unseen. This is for reflection only."
    - Arabic: "إخلاء مسؤولية: تفسير الأحلام رمزي وليس حقيقة مطلقة. الغيب لا يعلمه إلا الله. هذا للتأمل فقط."
    - French: "Avertissement : Les interprétations de rêves sont symboliques et non une vérité définitive. Seul Allah connaît l'invisible. Ceci est pour la réflexion seulement."
3.  Adhere strictly to the JSON schema. The 'disclaimer' field must contain the exact text above.`;

// --- HADITH SEARCH ---
const getHadithSearchSchema = (languageName: string) => ({
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            hadithText: { type: Type.STRING, description: `The text of the Hadith, translated into ${languageName}.` },
            reference: { type: Type.STRING, description: `The source of the Hadith (e.g., Sahih al-Bukhari 52), in ${languageName}.` },
            explanation: { type: Type.STRING, description: `A concise explanation of the Hadith, in ${languageName}.` }
        },
        required: ['hadithText', 'reference', 'explanation']
    }
});
const getHadithSearchSystemInstruction = (languageName: string) => `You are an expert Islamic scholar AI with access to a vast collection of authentic Hadith. The user will provide a topic. Your task is to find 3-5 relevant, authentic Hadith related to that topic. For each Hadith, provide its text, reference, and a brief explanation in ${languageName}. Adhere strictly to the provided JSON schema. If no relevant Hadith are found, return an empty array.`;


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
    const languageName = languageMap[payload.language] || 'English';


    if (type === 'dua') {
      const { prompt, language } = payload;
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
        const { ayah } = payload as { ayah: Ayah };
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
        const { name } = payload as { name: string };
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
        const { feeling } = payload as { feeling: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `The user is feeling: "${feeling}".`,
            config: {
                systemInstruction: getReflectionSystemInstruction(languageName),
            },
        });
        result = { reflection: response.text };

    } else if (type === 'recitation') {
        const { recitedText, actualVerseText } = payload as { recitedText: string; actualVerseText: string };
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

    } else if (type === 'hadith') {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Please provide a Hadith of the Day in ${languageName}.`,
            config: {
                systemInstruction: getHadithSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getHadithSchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'prophetStory') {
        const { prophetName } = payload as { prophetName: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate a story about the prophet ${prophetName} in ${languageName}.`,
            config: {
                systemInstruction: getProphetStorySystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getProphetStorySchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'fiqhQA') {
        const { question } = payload as { question: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `The user asks: "${question}". Please answer in ${languageName}.`,
            config: {
                systemInstruction: getFiqhQASystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getFiqhQASchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'sahabiStory') {
        const { sahabiName } = payload as { sahabiName: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate a story about the Sahabi ${sahabiName} in ${languageName}.`,
            config: {
                systemInstruction: getSahabiStorySystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getSahabiStorySchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'inheritance') {
        const { input } = payload as { input: InheritanceInput };
        const prompt = `Calculate the inheritance for an estate of ${input.totalEstate} with the following heirs: Spouse present: ${input.hasSpouse}, Sons: ${input.sons}, Daughters: ${input.daughters}, Father present: ${input.hasFather}, Mother present: ${input.hasMother}. Provide the results in ${languageName}.`;
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                systemInstruction: getInheritanceSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getInheritanceSchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'halalTravel') {
        const { city } = payload as { city: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Provide halal travel information for ${city} in ${languageName}.`,
            config: {
                systemInstruction: getHalalTravelSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getHalalTravelSchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'dream') {
        const { dream } = payload as { dream: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `The user's dream is: "${dream}". Provide a symbolic interpretation in ${languageName}.`,
            config: {
                systemInstruction: getDreamInterpretationSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getDreamInterpretationSchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'hadithSearch') {
        const { topic } = payload as { topic: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Find Hadith about "${topic}" and present them in ${languageName}.`,
            config: {
                systemInstruction: getHadithSearchSystemInstruction(languageName),
                responseMimeType: "application/json",
                responseSchema: getHadithSearchSchema(languageName),
            },
        });
        result = JSON.parse(response.text);
    } else if (type === 'hajjUmrahQA') {
        const { question } = payload as { question: string };
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `The user has a question about Hajj/Umrah: "${question}". Please answer it concisely in ${languageName}.`,
            config: {
                systemInstruction: `You are a knowledgeable guide for Hajj and Umrah. Answer the user's question clearly and concisely in ${languageName}.`
            },
        });
        result = { answer: response.text };
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
