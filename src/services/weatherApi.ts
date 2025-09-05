import axios from 'axios';
import { WeatherData, WeatherForecast, WeatherError, SearchResult, ForecastDay } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// API key loaded from environment

if (!API_KEY) {
  console.warn('OpenWeatherMap API key not found. Please set VITE_OPENWEATHER_API_KEY in your environment variables.');
}

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Helper function to get weather icon
const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Helper function to get weather condition
const getWeatherCondition = (weatherId: number): string => {
  if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
  if (weatherId >= 300 && weatherId < 400) return 'drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'mist';
  if (weatherId === 800) return 'clear';
  if (weatherId > 800) return 'clouds';
  return 'clear';
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
};

// Helper function to get day name
const getDayName = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const weatherService = {
  // Search for cities
  async searchCities(query: string): Promise<SearchResult[]> {
    try {
      const response = await weatherApi.get('/find', {
        params: {
          q: query,
          appid: API_KEY,
          type: 'like',
          sort: 'population',
          cnt: 10 // Get more results to filter duplicates
        }
      });

      const cities = response.data.list.map((city: any) => ({
        name: city.name,
        country: city.sys.country,
        state: city.state,
        lat: city.coord.lat,
        lon: city.coord.lon
      }));

      // Remove duplicates based on name and country, keeping the most populated one
      const uniqueCities = new Map<string, SearchResult>();
      
      cities.forEach((city: SearchResult) => {
        const key = `${city.name},${city.country}`;
        if (!uniqueCities.has(key)) {
          uniqueCities.set(key, city);
        }
      });

      return Array.from(uniqueCities.values()).slice(0, 5);
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  },

  // Get current weather by coordinates
  async getCurrentWeatherByCoords(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherData | WeatherError> {
    try {
      const response = await weatherApi.get('/weather', {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: unit
        }
      });

      const data = response.data;
      return {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: getWeatherCondition(data.weather[0].id),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: unit === 'metric' ? Math.round(data.wind.speed * 3.6) : Math.round(data.wind.speed), // Convert m/s to km/h for metric, keep mph for imperial
        pressure: data.main.pressure,
        visibility: unit === 'metric' ? Math.round(data.visibility / 1000) : Math.round(data.visibility * 0.000621371), // Convert m to km for metric, m to miles for imperial
        timestamp: new Date().toISOString(),
        icon: getWeatherIcon(data.weather[0].icon),
        lat: data.coord.lat,
        lon: data.coord.lon
      };
    } catch (error: any) {
      console.error('Weather API Error (coords):', error.response?.data || error.message);
      return {
        message: error.response?.data?.message || error.message || 'Failed to fetch current weather',
        code: error.response?.status?.toString()
      };
    }
  },

  // Get current weather by city name
  async getCurrentWeatherByCity(city: string, country?: string, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherData | WeatherError> {
    try {
      const query = country ? `${city},${country}` : city;
      const response = await weatherApi.get('/weather', {
        params: {
          q: query,
          appid: API_KEY,
          units: unit
        }
      });

      const data = response.data;
      return {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: getWeatherCondition(data.weather[0].id),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: unit === 'metric' ? Math.round(data.wind.speed * 3.6) : Math.round(data.wind.speed),
        pressure: data.main.pressure,
        visibility: unit === 'metric' ? Math.round(data.visibility / 1000) : Math.round(data.visibility * 0.000621371),
        timestamp: new Date().toISOString(),
        icon: getWeatherIcon(data.weather[0].icon),
        lat: data.coord.lat,
        lon: data.coord.lon
      };
    } catch (error: any) {
      console.error('Weather API Error (city):', error.response?.data || error.message);
      return {
        message: error.response?.data?.message || error.message || 'Failed to fetch current weather',
        code: error.response?.status?.toString()
      };
    }
  },

  // Get 5-day forecast
  async getForecast(lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric'): Promise<WeatherForecast | WeatherError> {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        weatherApi.get('/weather', {
          params: { lat, lon, appid: API_KEY, units: unit }
        }),
        weatherApi.get('/forecast', {
          params: { lat, lon, appid: API_KEY, units: unit }
        })
      ]);

      const currentData = currentResponse.data;
      const forecastData = forecastResponse.data;

      // Process current weather
      const current: WeatherData = {
        location: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        condition: getWeatherCondition(currentData.weather[0].id),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: unit === 'metric' ? Math.round(currentData.wind.speed * 3.6) : Math.round(currentData.wind.speed),
        pressure: currentData.main.pressure,
        visibility: unit === 'metric' ? Math.round(currentData.visibility / 1000) : Math.round(currentData.visibility * 0.000621371),
        timestamp: new Date().toISOString(),
        icon: getWeatherIcon(currentData.weather[0].icon),
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      };

      // Process forecast data - group by day
      const dailyForecasts: { [key: string]: any } = {};

      forecastData.list.forEach((item: any) => {
        const date = formatDate(item.dt);
        const dayName = getDayName(item.dt);
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            dayName,
            temps: [],
            conditions: [],
            humidities: [],
            windSpeeds: [],
            hourly: []
          };
        }

        dailyForecasts[date].temps.push(item.main.temp);
        dailyForecasts[date].conditions.push(item.weather[0]);
        dailyForecasts[date].humidities.push(item.main.humidity);
        dailyForecasts[date].windSpeeds.push(item.wind.speed);

        dailyForecasts[date].hourly.push({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          temperature: Math.round(item.main.temp),
          condition: getWeatherCondition(item.weather[0].id),
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: unit === 'metric' ? Math.round(item.wind.speed * 3.6) : Math.round(item.wind.speed),
          icon: getWeatherIcon(item.weather[0].icon)
        });
      });

      // Convert to ForecastDay array
      const forecast: ForecastDay[] = Object.values(dailyForecasts).map((day: any) => ({
        date: day.date,
        dayName: day.dayName,
        minTemp: Math.round(Math.min(...day.temps)),
        maxTemp: Math.round(Math.max(...day.temps)),
        condition: getWeatherCondition(day.conditions[0].id),
        description: day.conditions[0].description,
        humidity: Math.round(day.humidities.reduce((a: number, b: number) => a + b, 0) / day.humidities.length),
        windSpeed: unit === 'metric' ? Math.round(day.windSpeeds.reduce((a: number, b: number) => a + b, 0) / day.windSpeeds.length * 3.6) : Math.round(day.windSpeeds.reduce((a: number, b: number) => a + b, 0) / day.windSpeeds.length),
        icon: getWeatherIcon(day.conditions[0].icon),
        hourly: day.hourly
      }));

      return {
        location: currentData.name,
        country: currentData.sys.country,
        current,
        forecast: forecast.slice(0, 5), // Limit to 5 days
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Weather API Error (forecast):', error.response?.data || error.message);
      return {
        message: error.response?.data?.message || error.message || 'Failed to fetch forecast',
        code: error.response?.status?.toString()
      };
    }
  },

  // Get user's current location
  async getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
};
