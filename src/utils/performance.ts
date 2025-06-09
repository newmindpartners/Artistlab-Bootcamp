// Performance utilities for monitoring and optimization
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('LCP', lastEntry.startTime);
          console.log('LCP:', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.set('FID', entry.processingStart - entry.startTime);
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.set('CLS', clsValue);
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
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

  // Track resource loading
  trackResourceLoad(resourceName: string, startTime: number) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    this.metrics.set(`resource_${resourceName}`, loadTime);
    
    if (loadTime > 2000) {
      console.warn(`Slow resource load: ${resourceName} took ${loadTime.toFixed(2)}ms`);
    }
  }

  // Get performance metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Report Core Web Vitals
  reportWebVitals() {
    // Report to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // This would integrate with a real monitoring service like Google Analytics
      console.log('Core Web Vitals:', this.getMetrics());
    }
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Resource preloading utility
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Critical resource preloading
export const preloadCriticalResources = () => {
  // Preload fonts
  preloadResource('https://use.typekit.net/af/ee7a9e/00000000000000007735a07e/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3', 'font', 'font/woff2');
  preloadResource('https://use.typekit.net/af/0e3514/00000000000000007735a088/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3', 'font', 'font/woff2');
  
  // Preload critical images
  preloadResource('https://images.pexels.com/photos/2773498/pexels-photo-2773498.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fm=webp', 'image');
  preloadResource('/Theo-Mahy-Ma-Somga.jpeg', 'image');
};

// Image optimization utility
export const optimizeImage = (src: string, width?: number, height?: number, format = 'webp') => {
  if (src.includes('pexels.com')) {
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', '80'); // Quality
    url.searchParams.set('fm', format); // Format
    return url.toString();
  }
  return src;
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

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis available via: npm run analyze');
  }
};