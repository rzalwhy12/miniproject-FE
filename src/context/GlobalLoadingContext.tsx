"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const GlobalLoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface GlobalLoadingProviderProps {
  children: ReactNode;
}

export const GlobalLoadingProvider: React.FC<GlobalLoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoading = (message: string = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const updateLoadingMessage = (message: string) => {
    setLoadingMessage(message);
  };

  return (
    <GlobalLoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        showLoading,
        hideLoading,
        setLoadingMessage: updateLoadingMessage,
      }}
    >
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = (): LoadingContextType => {
  const context = useContext(GlobalLoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};
