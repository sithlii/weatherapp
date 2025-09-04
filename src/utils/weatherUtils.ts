/**
 * Shared utility functions for weather-related operations
 * Following DRY principles to eliminate code duplication
 */

/**
 * Get temperature color based on temperature value
 */
export const getTemperatureColor = (temp: number): string => {
  if (temp < 0) return 'text-blue-400';
  if (temp < 10) return 'text-blue-500';
  if (temp < 20) return 'text-green-500';
  if (temp < 30) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Get condition-based gradient for backgrounds
 */
export const getConditionGradient = (condition: string, opacity: number = 1): string => {
  const opacitySuffix = opacity < 1 ? `/${Math.round(opacity * 100)}` : '';
  
  switch (condition.toLowerCase()) {
    case 'clear':
      return `from-yellow-400${opacitySuffix} to-orange-500${opacitySuffix}`;
    case 'clouds':
      return `from-gray-400${opacitySuffix} to-gray-600${opacitySuffix}`;
    case 'rain':
      return `from-blue-400${opacitySuffix} to-blue-600${opacitySuffix}`;
    case 'snow':
      return `from-blue-200${opacitySuffix} to-blue-400${opacitySuffix}`;
    case 'thunderstorm':
      return `from-purple-500${opacitySuffix} to-indigo-600${opacitySuffix}`;
    default:
      return `from-gray-400${opacitySuffix} to-gray-600${opacitySuffix}`;
  }
};

/**
 * Format timestamp to readable time string
 */
export const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date to readable date string
 */
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Get weather condition icon based on condition
 */
export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'thunderstorm': '⛈️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️'
  };
  
  return iconMap[condition.toLowerCase()] || '🌤️';
};

/**
 * Convert temperature between units
 */
export const convertTemperature = (temp: number, fromUnit: 'C' | 'F' | 'K', toUnit: 'C' | 'F' | 'K'): number => {
  // Convert to Celsius first
  let celsius: number;
  switch (fromUnit) {
    case 'F':
      celsius = (temp - 32) * 5/9;
      break;
    case 'K':
      celsius = temp - 273.15;
      break;
    case 'C':
    default:
      celsius = temp;
  }
  
  // Convert from Celsius to target unit
  switch (toUnit) {
    case 'F':
      return celsius * 9/5 + 32;
    case 'K':
      return celsius + 273.15;
    case 'C':
    default:
      return celsius;
  }
};

/**
 * Get wind direction from degrees
 */
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Get UV index description
 */
export const getUVIndexDescription = (uvIndex: number): { level: string; color: string; description: string } => {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500', description: 'Minimal protection required' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500', description: 'Some protection required' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500', description: 'Protection required' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500', description: 'Extra protection required' };
  return { level: 'Extreme', color: 'text-purple-500', description: 'Avoid sun exposure' };
};

/**
 * Common animation configurations for consistent transitions
 */
export const animationConfig = {
  // Standard transition durations
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  
  // Standard delays for staggered animations
  stagger: 0.1,
  
  // Common transition object
  standardTransition: {
    duration: 0.3,
    ease: 'easeOut' as const
  },
  
  // Fast transition for hover effects
  fastTransition: {
    duration: 0.2,
    ease: 'easeOut' as const
  },
  
  // Slow transition for entrance animations
  slowTransition: {
    duration: 0.5,
    ease: 'easeOut' as const
  }
};
