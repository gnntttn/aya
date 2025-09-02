
import type { Dua, Language } from '../types';

type SampleDuas = {
    [key in Language]: Dua[];
};

export const sampleDuas: SampleDuas = {
  en: [
    {
      title: 'Prayer for Guidance',
      duaText: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
      duaArabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
      duaTransliteration: 'Rabbana la tuzigh quloobana ba\'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal Wahhab.',
      reference: 'Surah Ali \'Imran, Ayah 8'
    },
    {
      title: 'Prayer for Parents',
      duaText: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
      duaArabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      duaTransliteration: 'Rabbi irhamhuma kama rabbayani sagheera.',
      reference: 'Surah Al-Isra, Ayah 24'
    }
  ],
  ar: [
    {
      title: 'دعاء الهداية',
      duaText: 'ربنا لا تصرف قلوبنا عن الحق بعد أن هديتنا إليه، وهب لنا من عندك رحمة واسعة. إنك أنت كثير العطاء.',
      duaArabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
      duaTransliteration: 'Rabbana la tuzigh quloobana ba\'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal Wahhab.',
      reference: 'سورة آل عمران، الآية 8'
    },
    {
      title: 'دعاء للوالدين',
      duaText: 'يا رب، ارحمهما برحمتك الواسعة كما اعتَنَيا بي في صغري.',
      duaArabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      duaTransliteration: 'Rabbi irhamhuma kama rabbayani sagheera.',
      reference: 'سورة الإسراء، الآية 24'
    }
  ],
  fr: [
    {
      title: 'Prière pour la Guidance',
      duaText: 'Seigneur, ne laisse pas nos cœurs dévier après que Tu nous aies guidés et accorde-nous Ta miséricorde. C\'est Toi, certes, le Grand Donateur.',
      duaArabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
      duaTransliteration: 'Rabbana la tuzigh quloobana ba\'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal Wahhab.',
      reference: 'Sourate Ali \'Imran, Verset 8'
    },
    {
      title: 'Prière pour les Parents',
      duaText: 'Ô mon Seigneur, fais-leur à tous deux miséricorde comme ils m\'ont élevé tout petit.',
      duaArabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      duaTransliteration: 'Rabbi irhamhuma kama rabbayani sagheera.',
      reference: 'Sourate Al-Isra, Verset 24'
    }
  ]
};
