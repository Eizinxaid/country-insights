import axios from 'axios';

export interface GeoLocationData {
  country: string;
  region: string;
  city: string;
  [key: string]: any; // additional properties can be added if needed
}

export interface CountryInfo {
  data: string; // Adjust based on the response structure you expect from the second API
  [key: string]: any;
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

export const getCountryInfo = async (countryCode: string): Promise<CountryInfo | null> => {
  try {
    const response = await axios.get<CountryInfo>(`https://example.com/api/info?country=${countryCode}`); // Replace with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching country-specific info:', error);
    return null;
  }
};