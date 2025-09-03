import React, { useState } from 'react';
import { ForecastDay } from '../types/weather';
import { 
  ChevronDown, 
  ChevronUp, 
  Droplets, 
  Wind, 
  Thermometer,
  ThermometerSun
} from 'lucide-react';

interface ForecastProps {
  forecast: ForecastDay[];
}

export const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const getDayGradient = (condition: string) => {
    switch (condition) {
      case 'clear':
        return 'from-yellow-400/20 to-orange-500/20';
      case 'clouds':
        return 'from-gray-400/20 to-gray-600/20';
      case 'rain':
        return 'from-blue-400/20 to-blue-600/20';
      case 'snow':
        return 'from-blue-200/20 to-blue-400/20';
      case 'thunderstorm':
        return 'from-purple-500/20 to-indigo-600/20';
      default:
        return 'from-gray-400/20 to-gray-600/20';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return 'text-blue-400';
    if (temp < 10) return 'text-blue-500';
    if (temp < 20) return 'text-green-500';
    if (temp < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="weather-card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className={`glass-effect rounded-xl transition-all duration-300 ${
              expandedDay === index ? 'shadow-lg' : 'hover:shadow-md'
            }`}
          >
            {/* Day Header */}
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[80px]">
                  <div className="text-sm font-medium text-gray-600">
                    {day.dayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <img
                  src={day.icon}
                  alt={day.description}
                  className="w-12 h-12 weather-icon"
                />
                
                <div className="text-left">
                  <div className="font-medium text-gray-900 capitalize">
                    {day.description}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3" />
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wind className="w-3 h-3" />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <ThermometerSun className="w-4 h-4 text-red-500" />
                    <span className={`text-lg font-bold ${getTemperatureColor(day.maxTemp)}`}>
                      {day.maxTemp}°
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <span className={`text-lg font-bold ${getTemperatureColor(day.minTemp)}`}>
                      {day.minTemp}°
                    </span>
                  </div>
                </div>
                
                {expandedDay === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded Hourly Forecast */}
            {expandedDay === index && (
              <div className="px-4 pb-4 animate-slide-up">
                <div className={`h-px bg-gradient-to-r ${getDayGradient(day.condition)} mb-4`}></div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {day.hourly.slice(0, 12).map((hour, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="glass-effect rounded-lg p-3 text-center hover:bg-white/50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        {hour.time}
                      </div>
                      <img
                        src={hour.icon}
                        alt={hour.description}
                        className="w-8 h-8 mx-auto mb-2 weather-icon"
                      />
                      <div className={`text-lg font-bold ${getTemperatureColor(hour.temperature)}`}>
                        {hour.temperature}°
                      </div>
                      <div className="text-xs text-gray-500 capitalize truncate">
                        {hour.description}
                      </div>
                      <div className="flex items-center justify-center space-x-1 mt-1 text-xs text-gray-400">
                        <Droplets className="w-3 h-3" />
                        <span>{hour.humidity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
