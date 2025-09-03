export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex?: number;
  timestamp: string;
  icon: string;
  lat?: number;
  lon?: number;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  hourly: HourlyForecast[];
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface WeatherForecast {
  location: string;
  country: string;
  current: WeatherData;
  forecast: ForecastDay[];
  timestamp: string;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export interface SearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export type WeatherCondition = 
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'drizzle'
  | 'mist'
  | 'fog'
  | 'haze'
  | 'dust'
  | 'sand'
  | 'ash'
  | 'squall'
  | 'tornado';
