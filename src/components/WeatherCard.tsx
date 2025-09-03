import React from 'react';
import { WeatherData } from '../types/weather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  ThermometerSun,
  MapPin,
  Clock,
  Heart
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const [favorites, setFavorites] = useLocalStorage<Array<{name: string, country: string, lat: number, lon: number}>>('weather-favorites', []);

  const isFavorite = () => {
    return favorites.some(fav => fav.name === weather.location && fav.country === weather.country);
  };

  const toggleFavorite = () => {
    const favorite = {
      name: weather.location,
      country: weather.country,
      lat: 0, // We don't have lat/lon in WeatherData, but we can still add to favorites
      lon: 0
    };

    if (isFavorite()) {
      setFavorites(favorites.filter(fav => !(fav.name === weather.location && fav.country === weather.country)));
    } else {
      setFavorites([...favorites, favorite]);
    }
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-400';
    if (temp < 10) return 'text-blue-500';
    if (temp < 20) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConditionGradient = (condition: string) => {
    switch (condition) {
      case 'clear':
        return 'from-yellow-400 to-orange-500';
      case 'clouds':
        return 'from-gray-400 to-gray-600';
      case 'rain':
        return 'from-blue-400 to-blue-600';
      case 'snow':
        return 'from-blue-200 to-blue-400';
      case 'thunderstorm':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="weather-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {weather.location}
            </h2>
            <p className="text-sm text-gray-500">{weather.country}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-all duration-300 ${
              isFavorite() 
                ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
            }`}
            title={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite() ? 'fill-current' : ''}`} />
          </button>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTime(weather.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temperature and Condition */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={weather.icon}
                alt={weather.description}
                className="w-24 h-24 weather-icon"
              />
            </div>
            <div>
              <div className={`text-6xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                {weather.temperature}°
              </div>
              <div className="text-xl text-gray-600 capitalize">
                {weather.description}
              </div>
              <div className="flex items-center space-x-2 text-gray-500 mt-2">
                <ThermometerSun className="w-4 h-4" />
                <span>Feels like {weather.feelsLike}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-effect rounded-xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.humidity}%</div>
              <div className="text-sm text-gray-500">Humidity</div>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <Wind className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.windSpeed}</div>
              <div className="text-sm text-gray-500">km/h</div>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <Gauge className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.pressure}</div>
              <div className="text-sm text-gray-500">hPa</div>
            </div>
            
            <div className="glass-effect rounded-xl p-4 text-center">
              <Eye className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{weather.visibility}</div>
              <div className="text-sm text-gray-500">km</div>
            </div>
          </div>
        </div>
      </div>

      {/* Condition Bar */}
      <div className="mt-6">
        <div className={`h-2 rounded-full bg-gradient-to-r ${getConditionGradient(weather.condition)} opacity-20`}></div>
      </div>
    </div>
  );
};
