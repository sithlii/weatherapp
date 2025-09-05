import { ForecastDay } from '../types/weather';

export interface ChartConfig {
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter';
  dataKey: string;
  title: string;
  xAxisKey: string;
  yAxisLabel: string;
  color: string;
  description: string;
}

export interface ParsedChartRequest {
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'scatter';
  dataType: 'temperature' | 'humidity' | 'wind' | 'pressure' | 'forecast' | 'hourly';
  timeRange: 'today' | 'week' | 'all';
  title: string;
  description: string;
  config: ChartConfig;
}

export class ChartParser {
  private static chartTypeKeywords = {
    bar: ['bar', 'bars', 'column', 'columns', 'vertical', 'histogram'],
    line: ['line', 'lines', 'trend', 'trends', 'charting', 'chart', 'graph'],
    area: ['area', 'filled', 'shaded', 'stacked'],
    pie: ['pie', 'circle', 'donut', 'percentage', 'proportion', 'distribution'],
    scatter: ['scatter', 'points', 'dots', 'correlation', 'plot']
  };

  private static dataTypeKeywords = {
    temperature: ['temperature', 'temp', 'hot', 'cold', 'warm', 'cool', 'degrees', 'celsius', 'fahrenheit'],
    humidity: ['humidity', 'moisture', 'damp', 'wet', 'dry', 'moist'],
    wind: ['wind', 'breeze', 'gust', 'speed', 'velocity'],
    pressure: ['pressure', 'atmospheric', 'barometric', 'hpa'],
    forecast: ['forecast', 'prediction', 'expected', 'upcoming', 'future', 'weekly'],
    hourly: ['hourly', 'hour', 'hours', 'today', 'current', 'now']
  };

  private static timeRangeKeywords = {
    today: ['today', 'current', 'now', 'hourly'],
    week: ['week', 'weekly', '7 days', 'seven days', 'forecast'],
    all: ['all', 'everything', 'complete', 'full']
  };

  static parsePrompt(prompt: string, forecast: ForecastDay[]): ParsedChartRequest {
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine chart type
    const chartType = this.detectChartType(lowerPrompt);
    
    // Determine data type
    const dataType = this.detectDataType(lowerPrompt);
    
    // Determine time range
    const timeRange = this.detectTimeRange(lowerPrompt);
    
    // Generate title and description
    const title = this.generateTitle(chartType, dataType, timeRange);
    const description = this.generateDescription(chartType, dataType, timeRange);
    
    // Create chart configuration
    const config = this.createChartConfig(chartType, dataType, timeRange, forecast);
    
    return {
      chartType,
      dataType,
      timeRange,
      title,
      description,
      config
    };
  }

  private static detectChartType(prompt: string): 'bar' | 'line' | 'area' | 'pie' | 'scatter' {
    for (const [type, keywords] of Object.entries(this.chartTypeKeywords)) {
      if (keywords.some(keyword => prompt.includes(keyword))) {
        return type as any;
      }
    }
    return 'line'; // Default to line chart
  }

  private static detectDataType(prompt: string): 'temperature' | 'humidity' | 'wind' | 'pressure' | 'forecast' | 'hourly' {
    for (const [type, keywords] of Object.entries(this.dataTypeKeywords)) {
      if (keywords.some(keyword => prompt.includes(keyword))) {
        return type as any;
      }
    }
    return 'temperature'; // Default to temperature
  }

  private static detectTimeRange(prompt: string): 'today' | 'week' | 'all' {
    for (const [range, keywords] of Object.entries(this.timeRangeKeywords)) {
      if (keywords.some(keyword => prompt.includes(keyword))) {
        return range as any;
      }
    }
    return 'week'; // Default to week
  }

  private static generateTitle(chartType: string, dataType: string, timeRange: string): string {
    const dataTypeLabels = {
      temperature: 'Temperature',
      humidity: 'Humidity',
      wind: 'Wind Speed',
      pressure: 'Pressure',
      forecast: 'Forecast',
      hourly: 'Hourly Data'
    };

    const timeRangeLabels = {
      today: 'Today',
      week: 'Weekly',
      all: 'Complete'
    };

    const chartTypeLabels = {
      bar: 'Bar Chart',
      line: 'Line Chart',
      area: 'Area Chart',
      pie: 'Pie Chart',
      scatter: 'Scatter Plot'
    };

    return `${timeRangeLabels[timeRange as keyof typeof timeRangeLabels]} ${dataTypeLabels[dataType as keyof typeof dataTypeLabels]} - ${chartTypeLabels[chartType as keyof typeof chartTypeLabels]}`;
  }

  private static generateDescription(chartType: string, dataType: string, timeRange: string): string {
    const descriptions = {
      temperature: {
        bar: 'Shows temperature variations across different time periods',
        line: 'Displays temperature trends over time',
        area: 'Illustrates temperature ranges with filled areas',
        pie: 'Shows temperature distribution in segments',
        scatter: 'Plots temperature data points for analysis'
      },
      humidity: {
        bar: 'Compares humidity levels across different days',
        line: 'Tracks humidity changes over time',
        area: 'Visualizes humidity ranges with filled areas',
        pie: 'Shows humidity distribution percentages',
        scatter: 'Plots humidity data points for correlation analysis'
      },
      wind: {
        bar: 'Compares wind speeds across different periods',
        line: 'Shows wind speed trends over time',
        area: 'Illustrates wind speed variations with filled areas',
        pie: 'Displays wind speed distribution',
        scatter: 'Plots wind speed data for pattern analysis'
      }
    };

    const dataTypeDesc = descriptions[dataType as keyof typeof descriptions] || descriptions.temperature;
    return dataTypeDesc[chartType as keyof typeof dataTypeDesc] || 'Weather data visualization';
  }

  private static createChartConfig(
    chartType: string, 
    dataType: string, 
    timeRange: string, 
    forecast: ForecastDay[]
  ): ChartConfig {
    const dataKeyMap = {
      temperature: 'maxTemp',
      humidity: 'humidity',
      wind: 'windSpeed',
      pressure: 'pressure',
      forecast: 'maxTemp'
    };

    const colorMap = {
      temperature: '#ef4444',
      humidity: '#3b82f6',
      wind: '#10b981',
      pressure: '#8b5cf6',
      forecast: '#f59e0b'
    };

    const yAxisLabelMap = {
      temperature: '°C',
      humidity: '%',
      wind: 'km/h',
      pressure: 'hPa',
      forecast: '°C'
    };

    return {
      type: chartType as any,
      dataKey: dataKeyMap[dataType as keyof typeof dataKeyMap] || 'maxTemp',
      title: this.generateTitle(chartType, dataType, timeRange),
      xAxisKey: 'date',
      yAxisLabel: yAxisLabelMap[dataType as keyof typeof yAxisLabelMap] || '°C',
      color: colorMap[dataType as keyof typeof colorMap] || '#ef4444',
      description: this.generateDescription(chartType, dataType, timeRange)
    };
  }
}
