import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t, language } = useContext(LanguageContext) as LanguageContextType;
  
  const isApiKeyError = message && message.includes("Please configure the API_KEY");

  if (isApiKeyError) {
    const texts = {
      en: {
        title: "Configuration Issue",
        p1: "AI features are disabled because the API Key was not found.",
        p2: 'If you are deploying this application on a platform like Netlify, you must add your API Key as an "Environment Variable" in your site settings:',
        step1: "Go to: Site configuration > Build & deploy > Environment",
        step2: "Add a new variable with the following details:",
        key: "Key:",
        value: "Value: [Paste your Google Gemini API Key here]",
        step3: "After adding the key, you must re-deploy your site using 'Trigger deploy'.",
        note: "Important: For environment variables to be included in a static site, your project may need a build process (e.g., using Vite or Next.js). If this still doesn't work, this is likely the reason."
      },
      ar: {
        title: "مشكلة في الإعداد",
        p1: "تم تعطيل ميزات الذكاء الاصطناعي لأنه لم يتم العثور على مفتاح API.",
        p2: 'إذا كنت تقوم بنشر هذا التطبيق على منصة مثل Netlify، فيجب عليك إضافة مفتاح API الخاص بك كـ "متغير بيئة" في إعدادات موقعك:',
        step1: "اذهب إلى: Site configuration > Build & deploy > Environment",
        step2: "أضف متغيرًا جديدًا بالتفاصيل التالية:",
        key: "المفتاح (Key):",
        value: "القيمة (Value): [ألصق مفتاح Google Gemini API الخاص بك هنا]",
        step3: "بعد إضافة المفتاح، يجب عليك إعادة نشر موقعك باستخدام 'Trigger deploy'.",
        note: "ملاحظة هامة: لكي تعمل متغيرات البيئة في موقع ثابت، قد يحتاج مشروعك إلى عملية بناء (build process) (مثل استخدام Vite أو Next.js). إذا استمرت المشكلة، فهذا هو السبب على الأرجح."
      },
      fr: {
        title: "Problème de configuration",
        p1: "Les fonctionnalités d'IA sont désactivées car la clé API n'a pas été trouvée.",
        p2: "Si vous déployez cette application sur une plateforme comme Netlify, vous devez ajouter votre clé API en tant que \"Variable d'environnement\" dans les paramètres de votre site :",
        step1: "Allez à : Site configuration > Build & deploy > Environment",
        step2: "Ajoutez une nouvelle variable avec les détails suivants :",
        key: "Clé (Key) :",
        value: "Valeur (Value) : [Collez votre clé API Google Gemini ici]",
        step3: "Après avoir ajouté la clé, vous devez redéployer votre site en utilisant 'Trigger deploy'.",
        note: "Important : Pour que les variables d'environnement soient incluses dans un site statique, votre projet peut nécessiter un processus de build (par exemple, en utilisant Vite ou Next.js). Si cela ne fonctionne toujours pas, c'est probablement la raison."
      }
    };
    
    const currentTexts = texts[language] || texts['en'];

    return (
      <div className="w-full max-w-2xl bg-amber-500/10 border border-amber-500/50 text-amber-200 px-4 py-3 rounded-lg relative text-left animate-fade-in" role="alert">
        <strong className="font-bold">{t('errorTitle')} {currentTexts.title}</strong>
        <p className="mt-2 text-sm">{currentTexts.p1}</p>
        <p className="mt-2 text-sm">{currentTexts.p2}</p>
        <ul className="list-disc list-inside mt-2 text-xs space-y-1 font-mono">
          <li>{currentTexts.step1}</li>
          <li>{currentTexts.step2}</li>
          <li className="pl-4">{currentTexts.key} <code className="bg-black/20 px-1 rounded">API_KEY</code></li>
          <li className="pl-4">{currentTexts.value}</li>
          <li>{currentTexts.step3}</li>
        </ul>
        <p className="mt-3 text-xs opacity-80">{currentTexts.note}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">{t('errorTitle')} </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;