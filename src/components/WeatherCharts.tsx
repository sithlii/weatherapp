import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { ForecastDay } from '../types/weather';
import { TrendingUp, Droplets, Wind } from 'lucide-react';

interface WeatherChartsProps {
  forecast: ForecastDay[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ forecast }) => {
  // Prepare data for charts
  const temperatureData = forecast.map(day => ({
    day: day.dayName,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    avgTemp: Math.round((day.maxTemp + day.minTemp) / 2),
    humidity: day.humidity,
    windSpeed: day.windSpeed
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}°C
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const HumidityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-500 text-sm">
            Humidity: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const WindTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-green-500 text-sm">
            Wind Speed: {payload[0].value} km/h
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="weather-card">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        <h3 className="text-2xl font-bold text-gray-900">Weather Analytics</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="glass-effect rounded-xl p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="maxTemp"
                fill="url(#temperatureGradient)"
                fillOpacity={0.3}
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="maxTemp"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Low</span>
            </div>
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h4 className="text-lg font-semibold text-gray-900">Humidity</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<HumidityTooltip />} />
              <Bar 
                dataKey="humidity" 
                fill="url(#humidityGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed Chart */}
        <div className="glass-effect rounded-xl p-4 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Wind className="w-5 h-5 text-green-500" />
            <h4 className="text-lg font-semibold text-gray-900">Wind Speed</h4>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ value: 'km/h', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<WindTooltip />} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#10b981"
                fill="url(#windGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
