import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureUnitContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  toggleUnit: () => void;
  convertTemperature: (temp: number) => number;
  getUnitSymbol: () => string;
}

const TemperatureUnitContext = createContext<TemperatureUnitContextType | undefined>(undefined);

interface TemperatureUnitProviderProps {
  children: ReactNode;
}

export const TemperatureUnitProvider: React.FC<TemperatureUnitProviderProps> = ({ children }) => {
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>('temperature-unit', 'celsius');

  const convertTemperature = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getUnitSymbol = (): string => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const value: TemperatureUnitContextType = {
    unit,
    setUnit,
    toggleUnit,
    convertTemperature,
    getUnitSymbol
  };

  return (
    <TemperatureUnitContext.Provider value={value}>
      {children}
    </TemperatureUnitContext.Provider>
  );
};

export const useTemperatureUnit = (): TemperatureUnitContextType => {
  const context = useContext(TemperatureUnitContext);
  if (context === undefined) {
    throw new Error('useTemperatureUnit must be used within a TemperatureUnitProvider');
  }
  return context;
};
