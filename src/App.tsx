import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { Forecast } from './components/Forecast';
import { WeatherCharts } from './components/WeatherCharts';
import { Favorites } from './components/Favorites';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { weatherService } from './services/weatherApi';
import { WeatherForecast, WeatherError } from './types/weather';
import { MapPin, Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');

  // Load weather for user's current location on app start
  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await weatherService.getCurrentLocation();
      if (coords) {
        const result = await weatherService.getForecast(coords.lat, coords.lon);
        if ('message' in result) {
          setError(result.message);
        } else {
          setWeatherData(result);
          setCurrentLocation(`${result.location}, ${result.country}`);
        }
      } else {
        // Fallback to London if location access is denied
        const result = await weatherService.getForecast(51.5074, -0.1278);
        if ('message' in result) {
          setError(result.message);
        } else {
          setWeatherData(result);
          setCurrentLocation(`${result.location}, ${result.country}`);
        }
      }
    } catch (err) {
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city: string, country?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let result: WeatherForecast | WeatherError;
      
      if (country) {
        const currentWeather = await weatherService.getCurrentWeatherByCity(city, country);
        if ('message' in currentWeather) {
          setError(currentWeather.message);
          setLoading(false);
          return;
        }
        result = await weatherService.getForecast(currentWeather.lat || 0, currentWeather.lon || 0);
      } else {
        // Try to get coordinates first
        const cities = await weatherService.searchCities(city);
        if (cities.length === 0) {
          setError('City not found');
          setLoading(false);
          return;
        }
        
        const selectedCity = cities[0];
        result = await weatherService.getForecast(selectedCity.lat, selectedCity.lon);
      }
      
      if ('message' in result) {
        setError(result.message);
      } else {
        setWeatherData(result);
        setCurrentLocation(`${result.location}, ${result.country}`);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await weatherService.getForecast(lat, lon);
      if ('message' in result) {
        setError(result.message);
      } else {
        setWeatherData(result);
        setCurrentLocation(`${result.location}, ${result.country}`);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-200" />;
      case 'thunderstorm':
        return <Zap className="w-8 h-8 text-purple-500" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWeatherIcon(weatherData?.current.condition || 'clear')}
              <h1 className="text-2xl font-bold gradient-text">Weather App</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{currentLocation || 'Loading location...'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} onRetry={loadCurrentLocationWeather} />
          </div>
        )}

        {/* Weather Content */}
        {weatherData && !loading && (
          <div className="space-y-8">
            {/* Favorites */}
            <Favorites onLocationSelect={handleLocationSelect} />

            {/* Current Weather */}
            <WeatherCard weather={weatherData.current} />

            {/* Charts */}
            <WeatherCharts forecast={weatherData.forecast} />

            {/* Forecast */}
            <Forecast forecast={weatherData.forecast} />
          </div>
        )}

        {/* Welcome State */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-16">
            <div className="glass-effect rounded-3xl p-12 max-w-2xl mx-auto">
              <div className="mb-6">
                <Sun className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse-slow" />
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Welcome to Weather App
                </h2>
                <p className="text-gray-600 text-lg">
                  Get real-time weather information and forecasts for any city worldwide.
                  Search for a city or use your current location to get started.
                </p>
              </div>
              <button
                onClick={loadCurrentLocationWeather}
                className="btn-primary"
              >
                Get My Location Weather
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Built with React, TypeScript, and Tailwind CSS</p>
            <p className="text-sm mt-2">Powered by OpenWeatherMap API</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
