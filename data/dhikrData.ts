import type { Language } from '../types';

export const dhikrData: { [key in Language]: string[] } = {
  en: [
    "Glory be to Allah", // SubhanAllah
    "Praise be to Allah", // Alhamdulillah
    "Allah is the Greatest", // Allahu Akbar
    "There is no god but Allah", // La ilaha illallah
    "Glory and praise be to Allah", // SubhanAllahi wa bihamdihi
    "I seek forgiveness from Allah", // Astaghfirullah
    "There is no power nor strength except with Allah", // La hawla wa la quwwata illa billah
  ],
  ar: [
    "سبحان الله",
    "الحمد لله",
    "الله أكبر",
    "لا إله إلا الله",
    "سبحان الله وبحمده",
    "أستغفر الله",
    "لا حول ولا قوة إلا بالله",
  ],
  fr: [
    "Gloire à Allah",
    "Louange à Allah",
    "Allah est le plus Grand",
    "Il n'y a de divinité qu'Allah",
    "Gloire et louange à Allah",
    "Je demande pardon à Allah",
    "Il n'y a de puissance ni de force qu'en Allah",
  ],
};
