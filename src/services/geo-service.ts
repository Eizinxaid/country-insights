import axios from 'axios';

export interface GeoLocationData {
  country: string;
  region: string;
  city: string;
  [key: string]: any; // additional properties can be added if needed
}

export const getCountry = async (): Promise<string | null> => {
  try {
    const response = await axios.get<GeoLocationData>('https://ipinfo.io?token=bd3bc3bc9ce7eb'); // Replace with your API endpoint and token
    return response.data.country; // Returns the country code like 'US', 'CA', etc.
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return null;
  }
};