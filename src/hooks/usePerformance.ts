import { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '../utils/performance';

export const usePerformanceTracking = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    return () => {
      monitor.trackRender(componentName, startTime.current);
    };
  }, [componentName, monitor]);
};

export const useApiPerformance = () => {
  const monitor = PerformanceMonitor.getInstance();

  const trackApiCall = async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      monitor.trackApiCall(endpoint, startTime, true);
      return result;
    } catch (error) {
      monitor.trackApiCall(endpoint, startTime, false);
      throw error;
    }
  };

  return { trackApiCall };
};