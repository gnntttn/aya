import type { Language } from '../types';

export const historyTopics: { [key in Language]: string[] } = {
  en: [
    "Seerah of Prophet Muhammad (PBUH)",
    "The Four Rightly Guided Caliphs",
    "The Umayyad Dynasty",
    "The Abbasid Golden Age",
    "Islamic Spain (Al-Andalus)",
    "The Ottoman Empire",
    "The Fatimid Caliphate",
    "The Age of the Crusades",
    "The Mughal Empire",
  ],
  ar: [
    "السيرة النبوية",
    "الخلفاء الراشدون",
    "الدولة الأموية",
    "العصر الذهبي للخلافة العباسية",
    "الأندلس",
    "الإمبراطورية العثمانية",
    "الخلافة الفاطمية",
    "عصر الحروب الصليبية",
    "إمبراطورية المغول الإسلامية",
  ],
  fr: [
    "La Sîra du Prophète Muhammad (PSL)",
    "Les Quatre Califes Bien-Guidés",
    "La Dynastie des Omeyyades",
    "L'Âge d'Or des Abbassides",
    "L'Espagne Musulmane (Al-Andalus)",
    "L'Empire Ottoman",
    "Le Califat Fatimide",
    "L'Époque des Croisades",
    "L'Empire Moghol",
  ],
};
