import axios from 'axios';

export interface GeoLocationData {
  country: string;
  region: string;
  city: string;
  [key: string]: any;
}

export interface CountryStatistics {
  data: Data; 
  [key: string]: any;
}

export interface Sentiment {
  nsr: number;
  values: Value[];
  otherCount: number;
}

export interface DateValue {
  date: string;
  dateAsUtc: string;
  key: string;
  count: number;
  metricValue: number;
  sentiment: Sentiment;
  authorsCount: number;
}

export interface Aggregations {
  dates: {
    values: DateValue[];
    otherCount: number;
  };
  sentiment: Sentiment;
  authorsCount: number;
}

export interface Data {
  totalCount: number;
  aggregations: Aggregations;
  entities: Record<string, unknown>;
}

export interface CountryWordMap {
  data: Root;
  [key: string]: any;
}

export interface Root {
  actions: MetricWord[]
  characteristics: MetricWord[]
  objects: MetricWord[]
  phrases: MetricWord[]
  persons: MetricWord[]
  organizations: MetricWord[]
  locations: MetricWord[]
}

export interface MetricWord {
  key: string
  metricValue: number
}

export interface Sentiment {
  nsr: number
  values: Value[]
  otherCount: number
}

export interface Language {
  values: Value[]
  otherCount: number
}

export interface Value {
  key: string
  count: number
  metricValue: number
}

//region general stat
// Country value interface
interface CountryValue {
  key: string;
  count: number;
}

// Countries aggregation interface
interface CountriesAggregation {
  values: CountryValue[];
}

// Aggregations interface
interface CountryAggregations {
  countries: CountriesAggregation;
}

// Main DTO interface
export interface GeneralStatistics {
  totalCount: number;
  aggregations: CountryAggregations;
}
//end general stat

export const getCountry = async (): Promise<string | undefined> => {
  try {
    const response = await axios.get<GeoLocationData>('https://ipinfo.io?token=bd3bc3bc9ce7eb'); // Replace with your API endpoint and token
    return response.data.country; // Returns the country code like 'US', 'CA', etc.
  } catch (error) {
    console.error('Error fetching geolocation data:', error);
    return undefined;
  }
};

export const getCountryStatistics = async (countryCode: string): Promise<CountryStatistics | null> => {
  try {
    const response = await axios.get<CountryStatistics>(`https://icy-moon-bd8e.valentyn-ivankov-37d.workers.dev/?country=${countryCode}&method=statistics`); // Replace with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching country statistics info:', error);
    return null;
  }
};

export const getCountryWordCloud = async(countryCode: string): Promise<CountryWordMap | null> => {
  try {
    const response = await axios.get<CountryWordMap>(`https://icy-moon-bd8e.valentyn-ivankov-37d.workers.dev/?country=${countryCode}&method=wordcloud`); // Replace with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching country wordcloud info:', error);
    return null;
  }
}

export const getGeneralStatistics = async(): Promise<GeneralStatistics | undefined> => {
  try{
    const response = await axios.get<GeneralStatistics>(`https://icy-moon-bd8e.valentyn-ivankov-37d.workers.dev/?method=globalstatistics`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching general statistics info:', error);
    return undefined;
  }
}

export const getNewsStatistics = async(): Promise<GeneralStatistics | undefined> => {
  try{
    const response = await axios.get<GeneralStatistics>(`https://icy-moon-bd8e.valentyn-ivankov-37d.workers.dev/?method=globalstatisticnews`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching general statistics info:', error);
    return undefined;
  }
}