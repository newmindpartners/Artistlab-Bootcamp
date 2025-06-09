import React, { useState } from 'react';
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

  const handlePlay = () => {
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return (
      <div 
        className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-xl cursor-pointer relative group"
        onClick={handlePlay}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center group-hover:bg-black/20 transition-colors">
          <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-white fill-current" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-xl"
      />
    </div>
  );
};

export default YouTubeEmbed;