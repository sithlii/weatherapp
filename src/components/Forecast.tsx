import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForecastDay } from '../types/weather';
import { useTemperatureUnit } from '../contexts/TemperatureUnitContext';
import { 
  getTemperatureColor, 
  getConditionGradient, 
  formatDate 
} from '../utils/weatherUtils';
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
  const { getUnitSymbol } = useTemperatureUnit();

  const toggleExpanded = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="weather-card"
    >
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-6"
      >
        5-Day Forecast
      </motion.h3>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="space-y-4"
      >
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`glass-effect rounded-xl transition-all duration-300 ${
              expandedDay === index ? 'shadow-lg' : 'hover:shadow-md'
            }`}
          >
            {/* Day Header */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleExpanded(index)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center min-w-[80px]">
                  <div className="text-sm font-medium text-gray-600">
                    {day.dayName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(day.date)}
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
                      {day.maxTemp}{getUnitSymbol()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <span className={`text-lg font-bold ${getTemperatureColor(day.minTemp)}`}>
                      {day.minTemp}{getUnitSymbol()}
                    </span>
                  </div>
                </div>
                
                {expandedDay === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </motion.button>

            {/* Expanded Hourly Forecast */}
            <AnimatePresence>
              {expandedDay === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="px-4 pb-4 overflow-hidden"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`h-px bg-gradient-to-r ${getConditionGradient(day.condition, 0.2)} mb-4 origin-left`}
                  ></motion.div>
                
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                  >
                    {day.hourly.slice(0, 12).map((hour, hourIndex) => (
                      <motion.div
                        key={hourIndex}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: { opacity: 1, scale: 1 }
                        }}
                        whileHover={{ scale: 1.05 }}
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
                        {hour.temperature}{getUnitSymbol()}
                      </div>
                      <div className="text-xs text-gray-500 capitalize truncate">
                        {hour.description}
                      </div>
                      <div className="flex items-center justify-center space-x-1 mt-1 text-xs text-gray-400">
                        <Droplets className="w-3 h-3" />
                        <span>{hour.humidity}%</span>
                      </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
