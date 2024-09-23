import axios from 'axios';

export interface InsightsData {
  insights: string;
}

export const getCountryInfo = async (country: string): Promise<string> => {
  try {
    const response = await axios.get<InsightsData>(`https://icy-moon-bd8e.valentyn-ivankov-37d.workers.dev?country=${country}`); 
    return response.data.insights; 
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return '';
  }
};