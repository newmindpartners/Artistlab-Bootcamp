import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  sizes?: string;
  priority?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder,
  sizes = '100vw',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate optimized src with WebP format and responsive sizing
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('pexels.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp');
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('q', '80');
      return url.toString();
    }
    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {isInView && (
        <>
          <img
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } w-full h-full object-cover`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          
          {/* Error fallback */}
          {error && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-white/50 text-center">
                <div className="text-2xl mb-2">📷</div>
                <div className="text-sm">Image unavailable</div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Loading placeholder */}
      {(!isLoaded || !isInView) && !error && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;