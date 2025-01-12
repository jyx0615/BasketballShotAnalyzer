import { useState, useCallback } from 'react';

export function useDelayedAction(delay: number = 3000) {
  const [isLoading, setIsLoading] = useState(false);

  const executeWithDelay = useCallback((action: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      action();
    }, delay);
  }, [delay]);

  return { isLoading, executeWithDelay };
}