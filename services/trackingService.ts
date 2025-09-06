import type { ApiLogEntry, FeatureUsage } from '../types';

const MAX_LOG_ENTRIES = 10;

/**
 * Tracks usage of a specific feature by incrementing its counter in localStorage.
 * @param {string} featureName - The name of the feature being used.
 */
export const trackFeatureUsage = (featureName: string): void => {
    try {
        const usageString = localStorage.getItem('aya-feature-usage');
        const usage: FeatureUsage = usageString ? JSON.parse(usageString) : {};
        usage[featureName] = (usage[featureName] || 0) + 1;
        localStorage.setItem('aya-feature-usage', JSON.stringify(usage));
    } catch (error) {
        console.error("Failed to track feature usage:", error);
    }
};

/**
 * Logs an API call's performance details to localStorage.
 * @param {string} callType - The type of API call (e.g., 'dua', 'tafsir').
 * @param {number} duration - The duration of the call in milliseconds.
 * @param {boolean} success - Whether the call was successful or not.
 */
export const logApiCall = (callType: string, duration: number, success: boolean): void => {
    try {
        const logString = localStorage.getItem('aya-api-log');
        let log: ApiLogEntry[] = logString ? JSON.parse(logString) : [];
        
        const newEntry: ApiLogEntry = {
            type: callType,
            duration,
            success,
            timestamp: Date.now(),
        };

        // Add the new entry to the beginning of the array
        log.unshift(newEntry);

        // Keep only the last MAX_LOG_ENTRIES
        if (log.length > MAX_LOG_ENTRIES) {
            log = log.slice(0, MAX_LOG_ENTRIES);
        }

        localStorage.setItem('aya-api-log', JSON.stringify(log));
    } catch (error) {
        console.error("Failed to log API call:", error);
    }
};
