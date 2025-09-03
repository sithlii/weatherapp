import React from 'react';
import { Heart, MapPin, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface FavoriteLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface FavoritesProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ onLocationSelect }) => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteLocation[]>('weather-favorites', []);

  const removeFromFavorites = (lat: number, lon: number) => {
    setFavorites(favorites.filter(fav => !(fav.lat === lat && fav.lon === lon)));
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="weather-card">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Favorite Locations</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {favorites.map((favorite) => (
          <div
            key={`${favorite.lat}-${favorite.lon}`}
            className="glass-effect rounded-lg p-3 hover:bg-white/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => onLocationSelect(favorite.lat, favorite.lon)}
                className="flex items-center space-x-2 flex-1 text-left hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {favorite.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {favorite.country}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => removeFromFavorites(favorite.lat, favorite.lon)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                title="Remove from favorites"
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the utility functions for use in other components
export type { FavoriteLocation };
