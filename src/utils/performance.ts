// Performance utilities for monitoring and optimization
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render times
  trackRender(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    this.metrics.set(`render_${componentName}`, renderTime);
    
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track API call performance
  trackApiCall(endpoint: string, startTime: number, success: boolean) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.metrics.set(`api_${endpoint}`, duration);
    
    if (duration > 3000) {
      console.warn(`Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
    }
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Report Core Web Vitals
  reportWebVitals() {
    if ('web-vital' in window) {
      // This would integrate with a real monitoring service
      console.log('Core Web Vitals:', this.getMetrics());
    }
  }
}

// Lazy loading utility
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, height?: number) => {
  // In production, this would integrate with an image CDN
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', '80'); // Quality
  params.append('f', 'webp'); // Format
  
  return `${src}?${params.toString()}`;
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};