
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../types';
import type { LanguageContextType } from '../types';
import LoadingIndicator from './common/LoadingIndicator';
import ErrorMessage from './common/ErrorMessage';

type Status = 'idle' | 'requesting' | 'calibrating' | 'ready' | 'error';

const Qibla: React.FC = () => {
    const { t } = useContext(LanguageContext) as LanguageContextType;
    const [status, setStatus] = useState<Status>('idle');
    const [heading, setHeading] = useState<number | null>(null);
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const KAABA_LAT = 21.4225;
    const KAABA_LON = 39.8262;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const calculateQiblaDirection = (lat: number, lon: number) => {
        const userLatRad = toRad(lat);
        const kaabaLatRad = toRad(KAABA_LAT);
        const lonDiffRad = toRad(KAABA_LON - lon);

        const y = Math.sin(lonDiffRad) * Math.cos(kaabaLatRad);
        const x = Math.cos(userLatRad) * Math.sin(kaabaLatRad) - Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(lonDiffRad);

        const bearingRad = Math.atan2(y, x);
        const bearingDeg = (toDeg(bearingRad) + 360) % 360;
        setQiblaDirection(bearingDeg);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
        const compassHeading = (event as any).webkitCompassHeading || event.alpha;
        if (compassHeading !== null) {
            setHeading(compassHeading);
            if (status !== 'ready') setStatus('ready');
        } else if (status === 'requesting') {
            setStatus('calibrating');
        }
    };

    const startCompass = () => {
        setStatus('requesting');
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: 'granted' | 'denied' | 'prompt') => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        setError(t('qiblaMotionDenied'));
                        setStatus('error');
                    }
                })
                .catch((err) => {
                    setError(err.message);
                    setStatus('error');
                });
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    };
    
    const initQibla = () => {
        setStatus('requesting');
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                calculateQiblaDirection(position.coords.latitude, position.coords.longitude);
                startCompass();
            },
            (geoError) => {
                setError(t('qiblaAllowLocation'));
                setStatus('error');
            }
        );
    };

    useEffect(() => {
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const rotation = (qiblaDirection !== null && heading !== null) ? qiblaDirection - heading : 0;
    
    const renderContent = () => {
        if (status === 'error') {
            return <ErrorMessage message={error || 'An unknown error occurred.'} />;
        }
        if (status === 'idle') {
            return (
                <div className="text-center p-6 glass-card">
                    <p className="mb-4 text-lg text-[var(--text-secondary)]">{t('qiblaDescription')}</p>
                    <button onClick={initQibla} className="px-6 py-3 bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold rounded-lg shadow-md hover:bg-[var(--accent-secondary)] transform hover:scale-105 transition-all duration-300">
                       {t('qiblaFind')}
                    </button>
                </div>
            );
        }
        if (status === 'requesting' || status === 'calibrating' || qiblaDirection === null) {
            return <LoadingIndicator message={t('qiblaCalibrating')} />;
        }

        return (
            <div className="flex flex-col items-center">
                 <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                    {/* Compass Dial */}
                    <div 
                        className="w-full h-full bg-[var(--bg-secondary-solid)] rounded-full shadow-inner transition-transform duration-200 ease-linear"
                        style={{ transform: `rotate(${-heading}deg)` }}
                    >
                         <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-lg text-[var(--accent-primary)]">{t('qiblaNorth')}</span>
                         <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-lg text-[var(--text-secondary)]">{t('qiblaSouth')}</span>
                         <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-lg text-[var(--text-secondary)]">{t('qiblaEast')}</span>
                         <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-lg text-[var(--text-secondary)]">{t('qiblaWest')}</span>
                         {/* Dial markings */}
                         {[...Array(12)].map((_, i) => (
                            <div key={i} className="absolute w-0.5 h-2 bg-[var(--text-secondary)] top-0 left-1/2 -translate-x-1/2" style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '0 128px' }}></div>
                         ))}
                    </div>
                    {/* Qibla Arrow */}
                    <div 
                        className="absolute inset-0 flex justify-center transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                         <div className="w-4 h-1/2">
                            <svg className="w-full h-full text-[var(--accent-primary)] drop-shadow-lg" viewBox="0 0 40 160" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 0L0 160L20 120L40 160L20 0Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center glass-card p-4">
                    <p className="text-4xl font-mono font-bold text-[var(--text-primary)]">
                        {Math.round(qiblaDirection)}°
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">Direction of Qibla</p>
                </div>
            </div>
        );
    }
    

    return (
        <div className="w-full">
            <h2 className="font-lora text-3xl font-bold text-[var(--text-primary)] mb-10 text-center">{t('qiblaTitle')}</h2>
            {renderContent()}
        </div>
    );
};

export default Qibla;
