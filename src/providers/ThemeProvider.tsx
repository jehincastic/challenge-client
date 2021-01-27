import React, { useState } from 'react';  

type ContextType = {
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
};

export const ThemeContext = React.createContext<ContextType>({
  primaryColor: '#1976d2',
  secondaryColor: '#DC004E',
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
});

interface ThemeProviderProps {};

const ThemeProvider:  React.FC<ThemeProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#1976d2');
  const [secondaryColor, setSecondaryColor] = useState<string>('#DC004E');
  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        secondaryColor,
        setPrimaryColor: (color: string) => {
          setPrimaryColor(color);
        },
        setSecondaryColor: (color: string) => {
          setSecondaryColor(color);
        }
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
};

export default ThemeProvider;