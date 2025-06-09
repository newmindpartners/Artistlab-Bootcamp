import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  videoId, 
  title = "Artist Lab CAMPUS Presentation" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Preload thumbnail
  useEffect(() => {
    const img = new Image();
    img.onload = () => setThumbnailLoaded(true);
    img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId]);

  const handlePlay = () => {
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return (
      <div 
        className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-xl cursor-pointer relative group min-h-[300px] flex items-center justify-center"
        onClick={handlePlay}
      >
        {thumbnailLoaded ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform shadow-lg">
                <Play className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-white/70 text-xs mt-1">Click to play video</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Loading video preview...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-w-16 aspect-h-9 min-h-[300px]">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-xl"
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;