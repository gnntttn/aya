import type { Surah, Language, SurahDetailData, Ayah } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export const getSurahList = async (): Promise<Surah[]> => {
  const response = await fetch(`${API_BASE_URL}/surah`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  if (json.code !== 200 || !json.data) {
    throw new Error('Failed to fetch surah list from API');
  }
  return json.data as Surah[];
};

const getEditionIdentifier = (language: Language): string => {
    switch(language) {
        case 'en': return 'en.sahih';
        case 'fr': return 'fr.hamidullah';
        case 'ar': return 'ar.muyassar'; // Using Tafsir for Arabic 'translation'
        default: return 'en.sahih';
    }
}

export const getSurahDetail = async (surahNumber: number, reciterIdentifier: string): Promise<SurahDetailData> => {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${reciterIdentifier}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    if (json.code !== 200 || !json.data) {
        throw new Error(`Failed to fetch details for Surah ${surahNumber}`);
    }

    // The API can be inconsistent. Sometimes `data` is the array of editions,
    // but sometimes it's an object containing an `editions` array. This handles both.
    const editions = Array.isArray(json.data) ? json.data : (json.data.editions || []);

    if (editions.length === 0) {
      throw new Error(`Could not find a valid array of editions for Surah ${surahNumber}`);
    }

    const arabicEdition = editions.find((e: any) => e.edition.identifier === 'quran-uthmani');
    const audioEdition = editions.find((e: any) => e.edition.identifier === reciterIdentifier);

    if (!arabicEdition || !arabicEdition.ayahs || arabicEdition.ayahs.length === 0) {
        throw new Error(`API returned no ayahs for Surah ${surahNumber}`);
    }

    const mergedAyahs = arabicEdition.ayahs.map((ayah: Ayah, index: number) => ({
        ...ayah,
        audio: audioEdition?.ayahs[index]?.audio || '',
    }));

    const result: SurahDetailData = {
        number: arabicEdition.number,
        name: arabicEdition.name,
        englishName: arabicEdition.englishName,
        englishNameTranslation: arabicEdition.englishNameTranslation,
        revelationType: arabicEdition.revelationType,
        juz: arabicEdition.ayahs[0]?.juz || 0,
        ayahs: mergedAyahs,
    };
    
    return result;
};

export const getAyahDetail = async (surahNumber: number, ayahInSurah: number, language: Language): Promise<Ayah | null> => {
    const translationEditionId = getEditionIdentifier(language);
    const editionsToFetch = `quran-uthmani,${translationEditionId}`;
    const response = await fetch(`${API_BASE_URL}/ayah/${surahNumber}:${ayahInSurah}/editions/${editionsToFetch}`);
    
     if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    if (json.code !== 200 || !json.data) {
        console.error(`Failed to fetch Ayah ${surahNumber}:${ayahInSurah}`);
        return null;
    }

    // The API can return data in different shapes. This handles it robustly.
    const editionsData = Array.isArray(json.data) ? json.data : (json.data.editions || []);

    if (editionsData.length === 0) {
        return null;
    }

    const arabicData = editionsData.find((e: any) => e.edition.identifier === 'quran-uthmani');
    const translationData = editionsData.find((e: any) => e.edition.identifier === translationEditionId);

    if (!arabicData || !translationData) {
        console.error(`Missing required edition for Ayah ${surahNumber}:${ayahInSurah}`);
        return null;
    }


    return {
        number: arabicData.number,
        numberInSurah: arabicData.numberInSurah,
        text: arabicData.text,
        translationText: translationData.text,
        surah: {
            number: arabicData.surah.number,
            name: arabicData.surah.name,
            englishName: arabicData.surah.englishName,
        }
    };
};