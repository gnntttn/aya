
import type { PrayerTimesData } from '../types';

const API_BASE_URL = 'https://api.aladhan.com/v1';

/**
 * Fetches prayer times for a given latitude and longitude.
 * @param {number} latitude - The user's latitude.
 * @param {number} longitude - The user's longitude.
 * @returns {Promise<PrayerTimesData>} An object containing the prayer times.
 */
export const getPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTimesData> => {
  // Using method 2 (ISNA) as a common calculation method.
  // Docs: https://aladhan.com/prayer-times-api#GetTimings
  const response = await fetch(`${API_BASE_URL}/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch prayer times. Network response was not ok.');
  }

  const json = await response.json();

  if (json.code !== 200 || !json.data || !json.data.timings) {
    throw new Error('API returned invalid data for prayer times.');
  }
  
  // The API returns more times than we need, so we select the ones we want to display.
  const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = json.data.timings;
  
  return { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha };
};
