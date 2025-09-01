import React, { useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useContext(LanguageContext) as LanguageContextType;
  return (
    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">{t('errorTitle')} </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;