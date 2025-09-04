
import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t, language } = useContext(LanguageContext) as LanguageContextType;
  
  const isApiKeyError = message && message.includes("Please configure the API_KEY");
  const directionClass = language === 'ar' ? 'text-right' : 'text-left';

  if (isApiKeyError) {
    const texts = {
      en: {
        title: "Configuration Needed",
        p1: "AI features are currently disabled. To enable them, an API Key is required.",
        p2: 'If you are deploying this app, add your API Key as an "Environment Variable" in your hosting provider settings:',
        step1: "Go to: Site Settings > Build & deploy > Environment",
        step2: "Add a variable:",
        key: "Key:",
        value: "Value: [Your Google Gemini API Key]",
        step3: "Re-deploy your site to apply the changes.",
      },
      ar: {
        title: "الإعداد مطلوب",
        p1: "ميزات الذكاء الاصطناعي معطلة حاليًا. لتمكينها، يلزم وجود مفتاح API.",
        p2: 'إذا كنت تقوم بنشر هذا التطبيق، أضف مفتاح API الخاص بك كـ "متغير بيئة" في إعدادات الاستضافة:',
        step1: "اذهب إلى: إعدادات الموقع > بناء ونشر > البيئة",
        step2: "أضف متغيرًا:",
        key: "المفتاح (Key):",
        value: "القيمة (Value): [مفتاح Google Gemini API الخاص بك]",
        step3: "أعد نشر موقعك لتطبيق التغييرات.",
      },
      fr: {
        title: "Configuration requise",
        p1: "Les fonctionnalités d'IA sont désactivées. Pour les activer, une clé API est nécessaire.",
        p2: "Si vous déployez cette application, ajoutez votre clé API en tant que \"Variable d'environnement\" dans les paramètres de votre hébergeur :",
        step1: "Allez à : Paramètres du site > Build & deploy > Environnement",
        step2: "Ajoutez une variable :",
        key: "Clé (Key) :",
        value: "Valeur (Value) : [Votre clé API Google Gemini]",
        step3: "Redéployez votre site pour appliquer les modifications.",
      }
    };
    
    const currentTexts = texts[language] || texts['en'];

    return (
      <div className={`w-full max-w-2xl glass-card text-[var(--text-primary)] p-4 rounded-lg relative ${directionClass} animate-fade-in`} role="alert">
        <strong className="font-bold font-lora text-[var(--accent-primary)]">{currentTexts.title}</strong>
        <p className="mt-2 text-sm">{currentTexts.p1}</p>
        <p className="mt-2 text-sm">{currentTexts.p2}</p>
        <ul className="list-disc list-inside mt-2 text-xs space-y-1 font-mono text-[var(--text-secondary)]">
          <li>{currentTexts.step1}</li>
          <li>{currentTexts.step2}</li>
          <li className="pl-4">{currentTexts.key} <code className="bg-black/20 px-1 rounded">API_KEY</code></li>
          <li className="pl-4">{currentTexts.value}</li>
          <li>{currentTexts.step3}</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg relative ${directionClass}`} role="alert">
      <strong className="font-bold">{t('errorTitle')}: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
