import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types/weather';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTemperatureUnit } from '../contexts/TemperatureUnitContext';
import { 
  getTemperatureColor, 
  getConditionGradient, 
  formatTime 
} from '../utils/weatherUtils';
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
  const { getUnitSymbol } = useTemperatureUnit();

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


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="weather-card"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <MapPin className="w-5 h-5 text-gray-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {weather.location}
            </h2>
            <p className="text-sm text-gray-500">{weather.country}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-all duration-300 ${
              isFavorite() 
                ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
            }`}
            title={isFavorite() ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite() ? 'fill-current' : ''}`} />
          </motion.button>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTime(weather.timestamp)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Weather Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Temperature and Condition */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              <img
                src={weather.icon}
                alt={weather.description}
                className="w-24 h-24 weather-icon"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <div className={`text-6xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                {weather.temperature}{getUnitSymbol()}
              </div>
              <div className="text-xl text-gray-600 capitalize">
                {weather.description}
              </div>
              <div className="flex items-center space-x-2 text-gray-500 mt-2">
                <ThermometerSun className="w-4 h-4" />
                <span>Feels like {weather.feelsLike}{getUnitSymbol()}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Weather Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Droplets, value: weather.humidity, unit: '%', label: 'Humidity', color: 'text-blue-500', delay: 0.8 },
              { icon: Wind, value: weather.windSpeed, unit: 'km/h', label: 'Wind Speed', color: 'text-green-500', delay: 0.9 },
              { icon: Gauge, value: weather.pressure, unit: 'hPa', label: 'Pressure', color: 'text-purple-500', delay: 1.0 },
              { icon: Eye, value: weather.visibility, unit: 'km', label: 'Visibility', color: 'text-indigo-500', delay: 1.1 }
            ].map(({ icon: Icon, value, unit, label, color, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4 text-center"
              >
                <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-gray-900">{value}{unit}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Condition Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
        className="mt-6"
      >
        <div className={`h-2 rounded-full bg-gradient-to-r ${getConditionGradient(weather.condition)} opacity-20`}></div>
      </motion.div>
    </motion.div>
  );
};
