import { useCallback, useRef } from 'react';

/**
 * Custom hook for performance monitoring and optimization
 */
export const usePerformance = () => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  const trackRender = useCallback((componentName) => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    if (__DEV__) {
      console.log(`[Performance] ${componentName} rendered ${renderCountRef.current} times. Time since last render: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTimeRef.current = now;
  }, []);

  const measureFunction = useCallback((fn, functionName) => {
    return async (...args) => {
      const start = Date.now();
      try {
        const result = await fn(...args);
        const duration = Date.now() - start;
        
        if (__DEV__) {
          console.log(`[Performance] ${functionName} took ${duration}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        
        if (__DEV__) {
          console.log(`[Performance] ${functionName} failed after ${duration}ms`);
        }
        
        throw error;
      }
    };
  }, []);

  const resetRenderCount = useCallback(() => {
    renderCountRef.current = 0;
    lastRenderTimeRef.current = Date.now();
  }, []);

  return {
    trackRender,
    measureFunction,
    resetRenderCount,
    renderCount: renderCountRef.current,
  };
};
