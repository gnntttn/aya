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

    const arabicEdition = json.data.find((e: any) => e.edition.identifier === 'quran-uthmani');
    const audioEdition = json.data.find((e: any) => e.edition.identifier === reciterIdentifier);

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
    const translationEdition = getEditionIdentifier(language);
    const editions = `quran-uthmani,${translationEdition}`;
    const response = await fetch(`${API_BASE_URL}/ayah/${surahNumber}:${ayahInSurah}/editions/${editions}`);
     if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    if (json.code !== 200 || !json.data || json.data.length < 2) {
        return null;
    }
    const arabicData = json.data[0];
    const translationData = json.data[1];

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