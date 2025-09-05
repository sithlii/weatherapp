import React, { useState } from 'react';
import { ForecastDay } from '../types/weather';
import { TrendingUp, Trash2 } from 'lucide-react';
import { AnalyticsPrompt } from './AnalyticsPrompt';
import { DynamicChart } from './DynamicChart';
import { ChartParser, ParsedChartRequest } from '../utils/chartParser';

interface WeatherChartsProps {
  forecast: ForecastDay[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ forecast }) => {
  const [dynamicCharts, setDynamicCharts] = useState<ParsedChartRequest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateChart = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parsedRequest = ChartParser.parsePrompt(prompt, forecast);
      setDynamicCharts(prev => [parsedRequest, ...prev.slice(0, 4)]); // Keep only 5 most recent charts
    } catch (error) {
      console.error('Error generating chart:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteChart = (index: number) => {
    setDynamicCharts(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllCharts = () => {
    setDynamicCharts([]);
  };

  return (
    <div className="weather-card">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        <h3 className="text-2xl font-bold text-gray-900">Weather Analytics</h3>
      </div>

      {/* Dynamic Analytics Prompt */}
      <AnalyticsPrompt 
        onGenerateChart={handleGenerateChart} 
        isLoading={isGenerating} 
      />

      {/* Dynamic Charts */}
      {dynamicCharts.length > 0 && (
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h4 className="text-lg font-semibold text-gray-900">Your Custom Charts</h4>
              <span className="text-sm text-gray-500">
                {dynamicCharts.length} chart{dynamicCharts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={handleClearAllCharts}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Clear all charts"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dynamicCharts.map((chart, index) => (
              <DynamicChart
                key={`dynamic-${index}`}
                request={chart}
                forecast={forecast}
                isLoading={isGenerating}
                onDelete={() => handleDeleteChart(index)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
