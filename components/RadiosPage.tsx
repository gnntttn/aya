import React, { useState, useEffect, useContext } from 'react';
// FIX: Corrected import path for types.
import type { LanguageContextType, Radio } from '../types';
import { LanguageContext } from '../types';
import { RadioCard } from './radios/RadioCard';
import { AudioPlayer } from './audio/AudioPlayer';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const LoaderIcon = () => <div className="relative w-12 h-12"><div className="absolute border-4 border-solid border-transparent border-t-[var(--accent-primary)] rounded-full w-full h-full animate-spin"></div><div className="absolute border-4 border-solid border-transparent border-t-[var(--accent-primary)] rounded-full w-full h-full animate-spin opacity-50" style={{ animationDelay: '0.2s' }}></div></div>;
const RadioPageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375V6.75M8.25 12.75l-2.625 2.625M17.625 10.125l-2.625-2.625M12 21.75c5.625 0 10.125-4.5 10.125-10.125S17.625 1.5 12 1.5 1.875 6 1.875 11.625 6.375 21.75 12 21.75z" /></svg>;


export function RadiosPage() {
  const { t } = useContext(LanguageContext) as LanguageContextType;
  const [radios, setRadios] = useState<Radio[]>([]);
  const [filteredRadios, setFilteredRadios] = useState<Radio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentRadio, setCurrentRadio] = useState<Radio | null>(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const response = await fetch('/.netlify/functions/radios');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && Array.isArray(data.radios)) {
            const stations = data.radios.map((r: any) => ({ ...r, id: Number(r.id) }));
            setRadios(stations);
            setFilteredRadios(stations);
        }
      } catch (error) {
        console.error('Error fetching radios:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadios();
  }, []);

  useEffect(() => {
    const filtered = radios.filter(radio =>
      radio.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRadios(filtered);
  }, [searchQuery, radios]);

  const handlePlay = (radio: Radio) => {
    if (currentRadio?.id === radio.id) {
      setCurrentRadio(null);
    } else {
      setCurrentRadio(radio);
    }
  };

  return (
    <div className="w-full animate-fade-in pb-32">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-[var(--accent-primary)] mx-auto mb-4"><RadioPageIcon /></div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 font-lora">
            {t('radios_page_title')}
          </h1>
          <p className="text-[var(--text-secondary)]">
            {t('radios_page_subtitle')}
          </p>
        </div>

        <div
          className="mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-secondary)]"><SearchIcon/></div>
            <input
              type="text"
              placeholder={t('search_radio_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[var(--border-color)] bg-[var(--bg-secondary-solid)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)] text-right"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoaderIcon />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {filteredRadios.map((radio, index) => (
              <RadioCard
                key={radio.id}
                radio={radio}
                isPlaying={currentRadio?.id === radio.id}
                onPlay={() => handlePlay(radio)}
                index={index}
              />
            ))}
             {filteredRadios.length === 0 && (
              <p className="text-center text-[var(--text-secondary)] py-10 col-span-full">{t('no_results_found')}</p>
            )}
          </div>
        )}
      {currentRadio && (
        <AudioPlayer
          src={currentRadio.url}
          title={currentRadio.name}
          autoPlay
          onClose={() => setCurrentRadio(null)}
        />
      )}
    </div>
  );
}