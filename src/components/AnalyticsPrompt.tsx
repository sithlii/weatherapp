import React, { useState } from 'react';
import { Send, BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';

interface AnalyticsPromptProps {
  onGenerateChart: (prompt: string) => void;
  isLoading?: boolean;
}

export const AnalyticsPrompt: React.FC<AnalyticsPromptProps> = ({ 
  onGenerateChart, 
  isLoading = false 
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerateChart(prompt.trim());
      setPrompt('');
    }
  };

  const quickPrompts = [
    "Show me a bar graph of the expected weekly forecast",
    "Give me a line graph charting today's temperature",
    "Create a pie chart of humidity levels",
    "Show temperature trends over the week"
  ];

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    onGenerateChart(quickPrompt);
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-900">Dynamic Analytics</h3>
        <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
          AI-Powered
        </span>
      </div>
      
      <p className="text-gray-600 mb-6">
        Ask for any weather chart using natural language. Describe what you want to see and we'll create it for you!
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Show me a bar graph of the expected weekly forecast'"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(quickPrompt)}
              disabled={isLoading}
              className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <BarChart3 className="w-4 h-4" />
          <span>Bar Charts</span>
        </div>
        <div className="flex items-center space-x-1">
          <LineChart className="w-4 h-4" />
          <span>Line Charts</span>
        </div>
        <div className="flex items-center space-x-1">
          <PieChart className="w-4 h-4" />
          <span>Pie Charts</span>
        </div>
      </div>
    </div>
  );
};
