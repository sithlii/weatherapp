import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, ThermometerSun } from 'lucide-react';
import { useTemperatureUnit } from '../contexts/TemperatureUnitContext';

export const TemperatureUnitToggle: React.FC = () => {
  const { unit, toggleUnit } = useTemperatureUnit();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleUnit}
      className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-effect hover:bg-white/50 transition-all duration-300"
      title={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      {unit === 'celsius' ? (
        <Thermometer className="w-5 h-5 text-blue-500" />
      ) : (
        <ThermometerSun className="w-5 h-5 text-orange-500" />
      )}
      <span className="font-semibold text-gray-700">
        {unit === 'celsius' ? '°C' : '°F'}
      </span>
    </motion.button>
  );
};
