import React, { useRef } from 'react';  

type ContextType = {
  loader: any;
  showLoader: () => void;
  hideLoader: () => void;
};

export const LoadingContext = React.createContext<ContextType>({
  loader: null,
  showLoader: () => {},
  hideLoader: () => {},
});

interface LoadingProviderProps {};

const LoadingProvider:  React.FC<LoadingProviderProps> = ({ children }) => {
  const loader = useRef<any>();
  return (
    <LoadingContext.Provider
      value={{
        loader,
        showLoader: () => {
          loader.current.style.display = 'block'
        },
        hideLoader: () => {
          loader.current.style.display = 'none'
        },
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
};

export default LoadingProvider;