'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
  priority?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-video',
  priority = false,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${aspectRatioClass} ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="sr-only">Loading image...</span>
        </div>
      )}

      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className={`object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4 text-center">
          <ImageOff className="w-8 h-8 mb-1" aria-hidden="true" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
