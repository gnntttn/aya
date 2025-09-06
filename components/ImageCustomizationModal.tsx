import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, Ayah, SurahDetailData } from '../types';
import { getAyahDetail } from '../services/quranService';
import type { ImageStyleOptions } from './SurahDetail';

interface ImageCustomizationModalProps {
    ayah: Ayah;
    surahData: SurahDetailData;
    onClose: () => void;
    onGenerate: (options: ImageStyleOptions) => void;
}

const colorPalettes: { name: string; styles: ImageStyleOptions }[] = [
    {
        name: 'Classic Light',
        styles: {
            backgroundColor: '#FFFFFF',
            ayahColor: '#1A1A1A',
            translationColor: '#6B6B6B',
            accentColor: '#D4AF37',
            borderColor: 'rgba(0, 0, 0, 0.07)',
        },
    },
    {
        name: 'Classic Dark',
        styles: {
            backgroundColor: '#0F172A',
            ayahColor: '#E2E8F0',
            translationColor: '#94A3B8',
            accentColor: '#2DD4BF',
            borderColor: 'rgba(148, 163, 184, 0.2)',
        },
    },
    {
        name: 'Golden Hour',
        styles: {
            backgroundColor: '#FDF6E3',
            ayahColor: '#583E26',
            translationColor: '#856A54',
            accentColor: '#B58900',
            borderColor: 'rgba(181, 137, 0, 0.2)',
        },
    },
    {
        name: 'Serene Blue',
        styles: {
            backgroundColor: '#EBF4FF',
            ayahColor: '#003366',
            translationColor: '#4A6B8A',
            accentColor: '#336699',
            borderColor: 'rgba(51, 102, 153, 0.2)',
        },
    },
    {
        name: 'Minty Green',
        styles: {
            backgroundColor: '#F0FFF4',
            ayahColor: '#045D5D',
            translationColor: '#2F855A',
            accentColor: '#38A169',
            borderColor: 'rgba(56, 161, 105, 0.2)',
        },
    }
];

const ColorInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)]">{label}</label>
        <div className="relative w-10 h-10 border border-[var(--border-color)] rounded-md overflow-hidden">
             <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer border-0 p-0 bg-transparent"
            />
        </div>
    </div>
);


const ImageCustomizationModal: React.FC<ImageCustomizationModalProps> = ({ ayah, surahData, onClose, onGenerate }) => {
    const { t, language } = useContext(LanguageContext) as LanguageContextType;
    const [styles, setStyles] = useState<ImageStyleOptions>(colorPalettes[0].styles);
    const [translation, setTranslation] = useState<string | null>(null);

    useEffect(() => {
        const fetchTranslation = async () => {
            try {
                const detailedAyah = await getAyahDetail(surahData.number, ayah.numberInSurah, language);
                setTranslation(detailedAyah?.translationText || 'Translation not available.');
            } catch (e) {
                setTranslation('Could not load translation.');
            }
        };
        fetchTranslation();
    }, [surahData.number, ayah.numberInSurah, language]);
    
    const handleGenerate = () => {
        onGenerate(styles);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-lg glass-card p-5 rounded-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="font-lora text-xl font-bold text-center text-[var(--accent-primary)] mb-4">{t('imageCustomizationTitle')}</h2>

                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {/* Live Preview */}
                    <div className="p-4 rounded-lg flex flex-col justify-center" style={{ backgroundColor: styles.backgroundColor, border: `1px solid ${styles.borderColor}` }}>
                         <p dir="rtl" className="font-amiri text-2xl text-right whitespace-pre-wrap" style={{ color: styles.ayahColor, lineHeight: 1.8 }}>
                            {ayah.text}
                        </p>
                        {translation ? (
                            <p className="text-sm mt-3 whitespace-pre-wrap" style={{ color: styles.translationColor, lineHeight: 1.6, textAlign: language === 'ar' ? 'right' : 'left' }}>
                                {translation}
                            </p>
                        ) : (
                             <div className="h-8 bg-gray-500/20 rounded w-3/4 mt-3 animate-pulse"></div>
                        )}
                        <div className="mt-4 text-center border-t pt-2 text-xs font-semibold" style={{ borderColor: styles.borderColor, color: styles.accentColor }}>
                            {surahData.englishName} ({surahData.name}) : {ayah.numberInSurah}
                        </div>
                    </div>
                    
                    {/* Customization Controls */}
                    <div className="glass-card p-3 space-y-3">
                        <ColorInput label={t('ayahColor')} value={styles.ayahColor} onChange={(c) => setStyles(s => ({...s, ayahColor: c}))} />
                        <ColorInput label={t('translationColor')} value={styles.translationColor} onChange={(c) => setStyles(s => ({...s, translationColor: c}))} />
                        <ColorInput label={t('backgroundColor')} value={styles.backgroundColor} onChange={(c) => setStyles(s => ({...s, backgroundColor: c}))} />
                    </div>

                    {/* Presets */}
                    <div className="glass-card p-3">
                         <h4 className="text-sm font-medium text-center text-[var(--text-secondary)] mb-2">{t('colorPresets')}</h4>
                         <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {colorPalettes.map(p => (
                                <button key={p.name} onClick={() => setStyles(p.styles)} title={p.name} className="h-10 rounded-lg border-2" style={{ backgroundColor: p.styles.backgroundColor, borderColor: p.styles.borderColor }}></button>
                            ))}
                        </div>
                    </div>

                </div>

                <footer className="flex-shrink-0 pt-4 flex items-center justify-between">
                     <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold rounded-full text-sm shadow-md hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                        aria-label={t('close')}
                    >
                        {t('close')}
                    </button>
                    <button 
                        onClick={handleGenerate}
                        className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-full text-sm shadow-md hover:bg-[var(--accent-secondary)] transition-colors"
                    >
                        {t('generateAndShare')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ImageCustomizationModal;
