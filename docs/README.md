# Weather App - Modern TypeScript Edition

A sleek, modern weather application built with React, TypeScript, and Tailwind CSS. Features real-time weather data, interactive charts, and a beautiful user interface.

## ✨ Features

- 🌤️ **Real-time Weather Data** - Current conditions with detailed metrics
- 📅 **5-Day Forecast** - Extended weather predictions with hourly breakdowns
- 📊 **Interactive Charts** - Temperature trends, humidity, and wind speed visualizations
- 🔍 **Smart Search** - City search with autocomplete and suggestions
- 📍 **Location Services** - Automatic location detection
- 🎨 **Modern UI** - Glass morphism design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Get your OpenWeatherMap API key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key

3. **Configure your API key:**
   ```bash
   cp env.example .env
   # Edit .env and add your API key
   # IMPORTANT: No spaces around the equals sign!
   # VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── SearchBar.tsx   # City search with autocomplete
│   ├── WeatherCard.tsx # Current weather display
│   ├── Forecast.tsx    # 5-day forecast
│   ├── WeatherCharts.tsx # Data visualizations
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── services/           # API integration
│   └── weatherApi.ts   # OpenWeatherMap API service
├── types/              # TypeScript definitions
│   └── weather.ts      # Weather data types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind
```

## 🎨 Design Features

### Glass Morphism UI
- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Modern, clean aesthetic

### Interactive Elements
- Hover animations and transitions
- Smooth loading states
- Responsive feedback

### Data Visualization
- Temperature trend charts
- Humidity bar charts
- Wind speed area charts
- Interactive tooltips

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# IMPORTANT: No spaces around the equals sign!
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### API Configuration

The app uses OpenWeatherMap API with the following endpoints:
- Current weather: `/weather`
- 5-day forecast: `/forecast`
- City search: `/find`

## 📊 API Limits

- **Free tier**: 1,000 calls/day, 5-day forecast maximum
- **Paid tiers**: Higher limits and extended forecasts available

## 🎯 Key Components

### SearchBar
- Real-time city search with debouncing
- Keyboard navigation support
- Autocomplete suggestions
- Location-based results

### WeatherCard
- Current temperature and conditions
- Detailed weather metrics
- Weather icons and descriptions
- Responsive layout

### Forecast
- Expandable daily forecasts
- Hourly weather breakdowns
- Temperature ranges
- Weather condition indicators

### WeatherCharts
- Temperature trend visualization
- Humidity bar charts
- Wind speed area charts
- Interactive tooltips

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🛡️ Error Handling

The app includes comprehensive error handling for:
- Invalid API keys
- Network connectivity issues
- Invalid city names
- API rate limits
- Location access denied
- Malformed responses

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for global styles
- Component-specific styles use Tailwind classes

### API Integration
- Extend `src/services/weatherApi.ts` for additional endpoints
- Add new weather data types in `src/types/weather.ts`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [React](https://reactjs.org/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
