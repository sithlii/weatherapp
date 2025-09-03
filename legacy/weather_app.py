#!/usr/bin/env python3
"""
Weather App using OpenWeatherMap API
Provides current weather and 7-day forecast for any location
"""

import os
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class WeatherApp:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Weather App with OpenWeatherMap API key
        
        Args:
            api_key: OpenWeatherMap API key. If not provided, will try to load from environment
        """
        self.api_key = api_key or os.getenv('OPENWEATHER_API_KEY')
        if not self.api_key:
            raise ValueError("OpenWeatherMap API key is required. Set OPENWEATHER_API_KEY environment variable or pass it directly.")
        
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    def get_current_weather(self, city: str, country_code: str = None) -> Dict:
        """
        Get current weather for a city
        
        Args:
            city: City name (e.g., "London")
            country_code: Optional country code (e.g., "GB" for Great Britain)
        
        Returns:
            Dictionary containing current weather data
        """
        location = f"{city},{country_code}" if country_code else city
        url = f"{self.base_url}/weather"
        params = {
            'q': location,
            'appid': self.api_key,
            'units': 'metric'  # Use Celsius
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            return {
                'location': f"{data['name']}, {data['sys']['country']}",
                'temperature': round(data['main']['temp'], 1),
                'feels_like': round(data['main']['feels_like'], 1),
                'condition': data['weather'][0]['description'].title(),
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
        except requests.exceptions.RequestException as e:
            return {'error': f"Failed to fetch current weather: {str(e)}"}
    
    def get_forecast(self, city: str, country_code: str = None, days: int = 7) -> Dict:
        """
        Get weather forecast for a city
        
        Args:
            city: City name (e.g., "London")
            country_code: Optional country code (e.g., "GB" for Great Britain)
            days: Number of days to forecast (up to 5 days with free tier)
        
        Returns:
            Dictionary containing forecast data
        """
        location = f"{city},{country_code}" if country_code else city
        url = f"{self.base_url}/forecast"
        params = {
            'q': location,
            'appid': self.api_key,
            'units': 'metric'  # Use Celsius
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Process forecast data - group by day
            daily_forecasts = {}
            
            for item in data['list']:
                date = datetime.fromtimestamp(item['dt']).date()
                date_str = date.strftime('%Y-%m-%d')
                
                if date_str not in daily_forecasts:
                    daily_forecasts[date_str] = {
                        'date': date_str,
                        'day_name': date.strftime('%A'),
                        'forecasts': []
                    }
                
                daily_forecasts[date_str]['forecasts'].append({
                    'time': datetime.fromtimestamp(item['dt']).strftime('%H:%M'),
                    'temperature': round(item['main']['temp'], 1),
                    'condition': item['weather'][0]['description'].title(),
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed']
                })
            
            # Calculate daily summaries (min/max temp, most common condition)
            forecast_summary = []
            for date_str, day_data in list(daily_forecasts.items())[:days]:
                temps = [f['temperature'] for f in day_data['forecasts']]
                conditions = [f['condition'] for f in day_data['forecasts']]
                
                # Get most common condition
                most_common_condition = max(set(conditions), key=conditions.count)
                
                forecast_summary.append({
                    'date': day_data['date'],
                    'day_name': day_data['day_name'],
                    'min_temp': min(temps),
                    'max_temp': max(temps),
                    'condition': most_common_condition,
                    'detailed_forecasts': day_data['forecasts']
                })
            
            return {
                'location': f"{data['city']['name']}, {data['city']['country']}",
                'forecast_days': forecast_summary,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
        except requests.exceptions.RequestException as e:
            return {'error': f"Failed to fetch forecast: {str(e)}"}
    
    def print_current_weather(self, city: str, country_code: str = None):
        """Print formatted current weather information"""
        weather = self.get_current_weather(city, country_code)
        
        if 'error' in weather:
            print(f"❌ {weather['error']}")
            return
        
        print(f"\n🌤️  Current Weather for {weather['location']}")
        print(f"📅 {weather['timestamp']}")
        print(f"🌡️  Temperature: {weather['temperature']}°C (feels like {weather['feels_like']}°C)")
        print(f"☁️  Condition: {weather['condition']}")
        print(f"💧 Humidity: {weather['humidity']}%")
        print(f"💨 Wind Speed: {weather['wind_speed']} m/s")
    
    def print_forecast(self, city: str, country_code: str = None, days: int = 7):
        """Print formatted forecast information"""
        forecast = self.get_forecast(city, country_code, days)
        
        if 'error' in forecast:
            print(f"❌ {forecast['error']}")
            return
        
        print(f"\n📅 {days}-Day Forecast for {forecast['location']}")
        print(f"🕐 Generated: {forecast['timestamp']}")
        print("-" * 60)
        
        for day in forecast['forecast_days']:
            print(f"\n📆 {day['day_name']}, {day['date']}")
            print(f"🌡️  {day['min_temp']}°C - {day['max_temp']}°C")
            print(f"☁️  {day['condition']}")
            
            # Show detailed hourly forecasts for today and tomorrow
            if day['day_name'] in ['Today', 'Tomorrow'] or len(day['detailed_forecasts']) <= 4:
                print("   Hourly:")
                for hourly in day['detailed_forecasts'][:4]:  # Show first 4 hours
                    print(f"   {hourly['time']}: {hourly['temperature']}°C, {hourly['condition']}")


def main():
    """Main function to demonstrate the weather app"""
    try:
        # Initialize the weather app
        app = WeatherApp()
        
        # Get weather for London, England
        print("=" * 60)
        print("🌍 WEATHER APP - LONDON, ENGLAND")
        print("=" * 60)
        
        # Current weather
        app.print_current_weather("London", "GB")
        
        # 5-day forecast (OpenWeatherMap free tier limit)
        app.print_forecast("London", "GB", 5)
        
    except ValueError as e:
        print(f"❌ Configuration Error: {e}")
        print("\nTo fix this:")
        print("1. Create a .env file in the project directory")
        print("2. Add your OpenWeatherMap API key: OPENWEATHER_API_KEY=your_key_here")
        print("3. Or pass the API key directly to WeatherApp(api_key='your_key')")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


if __name__ == "__main__":
    main()
