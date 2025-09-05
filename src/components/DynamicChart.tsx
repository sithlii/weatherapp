import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ForecastDay } from '../types/weather';
import { ParsedChartRequest } from '../utils/chartParser';
import { X, Trash2 } from 'lucide-react';

interface DynamicChartProps {
  request: ParsedChartRequest;
  forecast: ForecastDay[];
  isLoading?: boolean;
  onDelete?: () => void;
}

export const DynamicChart: React.FC<DynamicChartProps> = ({ 
  request, 
  forecast, 
  isLoading = false,
  onDelete
}) => {
  // Prepare data based on the request
  const chartData = React.useMemo(() => {
    if (request.timeRange === 'today' && forecast[0]?.hourly) {
      // For hourly data, use the first day's hourly forecast
      return forecast[0].hourly.map(hour => ({
        time: hour.time,
        date: hour.time,
        maxTemp: hour.temperature,
        minTemp: hour.temperature,
        avgTemp: hour.temperature,
        humidity: hour.humidity,
        windSpeed: hour.windSpeed,
        pressure: 1013, // Default pressure if not available
        ...hour
      }));
    } else {
      // For weekly data, use the forecast days
      return forecast.map(day => ({
        day: day.dayName,
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: day.maxTemp,
        minTemp: day.minTemp,
        avgTemp: Math.round((day.maxTemp + day.minTemp) / 2),
        humidity: day.humidity,
        windSpeed: day.windSpeed,
        pressure: 1013, // Default pressure if not available
        ...day
      }));
    }
  }, [request, forecast]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}{request.config.yAxisLabel}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (request.chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={request.config.xAxisKey} 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: request.config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={request.config.dataKey} 
              fill={request.config.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={request.config.xAxisKey} 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: request.config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={request.config.dataKey}
              stroke={request.config.color}
              strokeWidth={3}
              dot={{ fill: request.config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: request.config.color, strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={request.config.xAxisKey} 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: request.config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={request.config.dataKey}
              stroke={request.config.color}
              fill={request.config.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'pie':
        const pieData = chartData.map(item => ({
          name: item[request.config.xAxisKey as keyof typeof item],
          value: item[request.config.dataKey as keyof typeof item]
        }));

        const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={request.config.xAxisKey} 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: request.config.yAxisLabel, angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              dataKey={request.config.dataKey} 
              fill={request.config.color}
            />
          </ScatterChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Unsupported chart type: {request.chartType}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 relative group mt-4">
      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
          title="Delete chart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
          {request.title}
        </h4>
        <p className="text-sm text-gray-600">
          {request.description}
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
