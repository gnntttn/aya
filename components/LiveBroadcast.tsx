import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType, RadioStation, TvChannel } from '../types';
import { tvChannels } from '../data/liveStreamData';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';

const LiveBroadcast: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [activeTab, setActiveTab] = useState<'radio' | 'tv'>('radio');
    const [searchTerm, setSearchTerm] = useState('');

    const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
    const [radioStatus, setRadioStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const [playingStationId, setPlayingStationId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [selectedChannel, setSelectedChannel] = useState<TvChannel | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            setRadioStatus('loading');
            try {
                const response = await fetch('/.netlify/functions/radios');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data && data.radios) {
                    const stations: RadioStation[] = data.radios.map((s: any) => ({
                        id: s.id.toString(),
                        name: s.name,
                        url: s.url,
                    }));
                    setRadioStations(stations);
                    setRadioStatus('success');
                } else {
                    throw new Error('Invalid API response structure');
                }
            } catch (err) {
                console.error('Failed to fetch radio stations:', err);
                setRadioStatus('error');
            }
        };

        fetchStations();
    }, []);

    useEffect(() => {
        audioRef.current = new Audio();
        
        const handleAudioStateChange = () => {
            if (audioRef.current?.paused && playingStationId) {
                setPlayingStationId(null);
            }
        };

        audioRef.current.addEventListener('pause', handleAudioStateChange);
        audioRef.current.addEventListener('ended', handleAudioStateChange);

        return () => {
            audioRef.current?.pause();
            audioRef.current?.removeEventListener('pause', handleAudioStateChange);
            audioRef.current?.removeEventListener('ended', handleAudioStateChange);
            audioRef.current = null;
        };
    }, []);

    const handleRadioPlay = (station: RadioStation) => {
        if (playingStationId === station.id) {
            audioRef.current?.pause();
            setPlayingStationId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = station.url;
                audioRef.current.play().catch(e => {
                  console.error("Audio play failed:", e);
                  // If play fails, reset the state
                  setPlayingStationId(null);
                });
                setPlayingStationId(station.id);
            }
        }
    };
    
    const handleTvSelect = (channel: TvChannel) => {
        setSelectedChannel(channel);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const filteredRadioStations = useMemo(() => radioStations.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm, radioStations]);

    const filteredTvChannels = useMemo(() => tvChannels.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const LiveIcon = () => (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="absolute w-full h-full text-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <path d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="animate-ping-wave" style={{animationDelay: '0s'}}/>
                <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="animate-ping-wave" style={{animationDelay: '0.8s'}}/>
            </svg>
        </div>
    );
    
    return (
        <div className="w-full animate-fade-in" dir="rtl">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('liveTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('liveDescription')}</p>
            </div>

            <div className="sticky top-4 z-10 mb-6 space-y-4">
                 <div className="bg-[var(--bg-secondary-solid)] rounded-full p-1 flex items-center shadow-md">
                    <button onClick={() => setActiveTab('tv')} className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none ${activeTab === 'tv' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-white/5'}`}>
                        <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('liveTv')}
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('radio')} className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none ${activeTab === 'radio' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-white/5'}`}>
                         <span className="flex items-center justify-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.375V6.75M8.25 12.75l-2.625 2.625M17.625 10.125l-2.625-2.625M12 21.75c5.625 0 10.125-4.5 10.125-10.125S17.625 1.5 12 1.5 1.875 6 1.875 11.625 6.375 21.75 12 21.75z" /></svg>
                             {t('liveRadio')}
                         </span>
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="search"
                        placeholder={t('liveSearchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border-none rounded-full focus:ring-2 focus:ring-[var(--accent-primary)] transition-shadow duration-200 bg-[var(--bg-secondary-solid)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] shadow-sm"
                        aria-label={t('liveSearchPlaceholder')}
                    />
                    <svg className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            {activeTab === 'radio' && (
                <div className="space-y-3">
                    {radioStatus === 'loading' && <LoadingIndicator message={t('liveLoadingStations')} />}
                    {radioStatus === 'error' && <ErrorMessage message={t('liveErrorStations')} />}
                    {radioStatus === 'success' && filteredRadioStations.map(station => {
                        const isPlaying = playingStationId === station.id;
                        return (
                             <div key={station.id} className={`w-full text-right glass-card p-3 flex items-center justify-between transition-all duration-300 ${isPlaying ? 'border-[var(--accent-primary)]' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleRadioPlay(station)} className={`w-12 h-12 flex items-center justify-center rounded-full text-[var(--accent-text)] transition-colors ${isPlaying ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-secondary-solid)] hover:bg-[var(--border-color)]'}`}>
                                        {isPlaying ? (
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                        )}
                                    </button>
                                     <p className="font-semibold text-md text-[var(--text-primary)]">{station.name}</p>
                                </div>
                                <div className={`text-[var(--accent-primary)] ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                                    <LiveIcon />
                                </div>
                             </div>
                        )
                    })}
                </div>
            )}

            {activeTab === 'tv' && (
                <div className="space-y-4">
                    {selectedChannel && (
                        <div className="mb-6 animate-fade-in">
                             <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)]">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={selectedChannel.embedUrl}
                                    title={selectedChannel.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <h3 className="text-center font-bold text-lg mt-3">{selectedChannel.name}</h3>
                        </div>
                    )}
                     {filteredTvChannels.map(channel => (
                         <button key={channel.id} onClick={() => handleTvSelect(channel)} className={`w-full text-right glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 ${selectedChannel?.id === channel.id ? 'border-[var(--accent-primary)]' : ''}`}>
                             <p className="font-semibold text-md text-[var(--text-primary)]">{channel.name}</p>
                             <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-3 py-1 rounded-full">{t('liveWatchNow')}</span>
                         </button>
                     ))}
                </div>
            )}
        </div>
    );
};

export default LiveBroadcast;