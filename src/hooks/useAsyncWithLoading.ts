'use client';
import { useCallback } from 'react';
import { useGlobalLoading } from '@/context/GlobalLoadingContext';

export const useAsyncWithLoading = () => {
  const { showLoading, hideLoading, setLoadingMessage } = useGlobalLoading();

  const executeWithLoading = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      loadingMessage: string = 'Loading...'
    ): Promise<T> => {
      try {
        showLoading(loadingMessage);
        const result = await asyncFunction();
        return result;
      } catch (error) {
        throw error;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  const executeWithCustomLoading = useCallback(
    async <T>(
      asyncFunction: () => Promise<T>,
      options: {
        startMessage?: string;
        successMessage?: string;
        errorMessage?: string;
        showSuccess?: boolean;
        successDuration?: number;
      } = {}
    ): Promise<T> => {
      const {
        startMessage = 'Loading...',
        successMessage = 'Success!',
        showSuccess = false,
        successDuration = 1000,
      } = options;

      try {
        showLoading(startMessage);
        const result = await asyncFunction();
        
        if (showSuccess) {
          setLoadingMessage(successMessage);
          await new Promise(resolve => setTimeout(resolve, successDuration));
        }
        
        return result;
      } catch (error) {
        throw error;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading, setLoadingMessage]
  );

  return {
    executeWithLoading,
    executeWithCustomLoading,
    showLoading,
    hideLoading,
    setLoadingMessage,
  };
};
