import axios from 'axios';

export interface GeoLocationData {
  country: string;
  region: string;
  city: string;
  [key: string]: any; // additional properties can be added if needed
}

export const getCountry = async (): Promise<string | null> => {
  try {
    var token = import.meta.env.IPINFO_TOKEN;
    const response = await axios.get<GeoLocationData>('https://ipinfo.io?token='+token); // Replace with your API endpoint and token
    return response.data.country; // Returns the country code like 'US', 'CA', etc.
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return null;
  }
};