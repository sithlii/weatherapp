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
  // Error boundary for individual charts
  try {
    // Prepare data based on the request
    const chartData = React.useMemo(() => {
    if (request.timeRange === 'today' && forecast[0]?.hourly) {
      // For hourly data, use the first day's hourly forecast
      return forecast[0].hourly.map(hour => ({
        ...hour,
        date: hour.time,
        maxTemp: hour.temperature,
        minTemp: hour.temperature,
        avgTemp: hour.temperature,
        pressure: 1013 // Default pressure if not available
      }));
    } else {
      // For weekly data, use the forecast days
      return forecast.map(day => ({
        ...day,
        day: day.dayName,
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avgTemp: Math.round((day.maxTemp + day.minTemp) / 2),
        pressure: 1013 // Default pressure if not available
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
        // Create meaningful pie chart data based on data type
        let pieData;
        if (request.dataType === 'humidity') {
          // Group humidity into ranges
          const ranges = [
            { name: 'Low (0-30%)', min: 0, max: 30 },
            { name: 'Medium (30-60%)', min: 30, max: 60 },
            { name: 'High (60-80%)', min: 60, max: 80 },
            { name: 'Very High (80-100%)', min: 80, max: 100 }
          ];
          
          pieData = ranges.map(range => {
            const count = chartData.filter(item => {
              const value = item[request.config.dataKey as keyof typeof item] as number;
              return value >= range.min && value < range.max;
            }).length;
            return { name: range.name, value: count };
          }).filter(item => item.value > 0);
        } else if (request.dataType === 'temperature') {
          // Group temperature into ranges
          const ranges = [
            { name: 'Cold (< 10°C)', min: -50, max: 10 },
            { name: 'Cool (10-20°C)', min: 10, max: 20 },
            { name: 'Warm (20-30°C)', min: 20, max: 30 },
            { name: 'Hot (> 30°C)', min: 30, max: 50 }
          ];
          
          pieData = ranges.map(range => {
            const count = chartData.filter(item => {
              const value = item[request.config.dataKey as keyof typeof item] as number;
              return value >= range.min && value < range.max;
            }).length;
            return { name: range.name, value: count };
          }).filter(item => item.value > 0);
        } else if (request.dataType === 'wind') {
          // Group wind speed into ranges
          const ranges = [
            { name: 'Calm (0-10 km/h)', min: 0, max: 10 },
            { name: 'Light (10-20 km/h)', min: 10, max: 20 },
            { name: 'Moderate (20-30 km/h)', min: 20, max: 30 },
            { name: 'Strong (> 30 km/h)', min: 30, max: 100 }
          ];
          
          pieData = ranges.map(range => {
            const count = chartData.filter(item => {
              const value = item[request.config.dataKey as keyof typeof item] as number;
              return value >= range.min && value < range.max;
            }).length;
            return { name: range.name, value: count };
          }).filter(item => item.value > 0);
        } else {
          // Default: use day names for forecast data
          pieData = chartData.map(item => ({
            name: item.day || item.date,
            value: item[request.config.dataKey as keyof typeof item] as number
          }));
        }

        // Handle empty pie data
        if (!pieData || pieData.length === 0) {
          return (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No data available for pie chart</p>
            </div>
          );
        }

        const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

        return (
          <PieChart width={400} height={300}>
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
  } catch (error) {
    console.error('Error rendering chart:', error);
    return (
      <div className="glass-effect rounded-xl p-6 relative group mt-4">
        <div className="text-center text-red-500">
          <p className="font-semibold">Chart Error</p>
          <p className="text-sm">Failed to render chart. Please try again.</p>
        </div>
      </div>
    );
  }
};
