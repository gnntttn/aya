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
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Network response was not ok');
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

    // Initialize and manage audio player lifecycle
    useEffect(() => {
        audioRef.current = new Audio();
        const audioElement = audioRef.current;

        // When playback ends naturally, update the UI state
        const onEnded = () => setPlayingStationId(null);
        audioElement.addEventListener('ended', onEnded);

        // Cleanup on unmount
        return () => {
            audioElement.pause();
            audioElement.removeEventListener('ended', onEnded);
        };
    }, []);

    const handleRadioPlay = (station: RadioStation) => {
        if (!audioRef.current) return;
        
        if (playingStationId === station.id) {
            audioRef.current.pause();
            setPlayingStationId(null);
        } else {
            audioRef.current.src = station.url;
            audioRef.current.play().catch(e => {
                console.error("Audio play failed:", e);
                setPlayingStationId(null);
            });
            setPlayingStationId(station.id);
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

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-2">{t('liveTitle')}</h2>
                <p className="text-md text-[var(--text-secondary)] max-w-xl mx-auto">{t('liveDescription')}</p>
            </div>

            <div className="sticky top-4 z-10 mb-6 space-y-4">
                 <div className="bg-[var(--bg-secondary-solid)] rounded-full p-1 flex items-center shadow-md">
                     <button onClick={() => setActiveTab('radio')} className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none ${activeTab === 'radio' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}>
                         <span className="flex items-center justify-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.375V6.75M8.25 12.75l-2.625 2.625M17.625 10.125l-2.625-2.625M12 21.75c5.625 0 10.125-4.5 10.125-10.125S17.625 1.5 12 1.5 1.875 6 1.875 11.625 6.375 21.75 12 21.75z" /></svg>
                             {t('liveRadio')}
                         </span>
                    </button>
                    <button onClick={() => setActiveTab('tv')} className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none ${activeTab === 'tv' ? 'bg-[var(--accent-primary)] text-[var(--accent-text)]' : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5'}`}>
                        <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {t('liveTv')}
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
                    {radioStatus === 'success' && filteredRadioStations.map((station, index) => {
                        const isPlaying = playingStationId === station.id;
                        return (
                             <button
                                key={station.id}
                                onClick={() => handleRadioPlay(station)}
                                aria-pressed={isPlaying}
                                title={station.name}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className="w-full bg-slate-100 dark:bg-slate-800 p-3 flex items-center justify-between transition-all duration-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 animate-fade-in focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-900/50 flex items-center justify-center flex-shrink-0">
                                    <div className={`w-4 h-4 rounded-full bg-slate-500 dark:bg-slate-200 ${isPlaying ? 'animate-pulse' : ''}`} />
                                </div>
            
                                <div className="min-w-0 text-right">
                                    <h3 className="font-amiri font-semibold text-xl text-[var(--text-primary)] truncate">{station.name}</h3>
                                    <div className="flex items-center justify-end gap-2 mt-1">
                                        <span className="text-xs text-red-500 font-bold tracking-wider">LIVE</span>
                                        <span className="relative flex h-2 w-2">
                                            {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </div>
                                </div>
                            </button>
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
                         <button key={channel.id} onClick={() => handleTvSelect(channel)} className={`w-full text-left glass-card p-4 flex items-center justify-between hover:border-[var(--accent-primary)] transition-all duration-300 ${selectedChannel?.id === channel.id ? 'border-[var(--accent-primary)]' : ''}`}>
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