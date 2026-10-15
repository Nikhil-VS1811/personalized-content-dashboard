'use client';

import React from 'react';
import { MovieItem } from '@/types/content';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Badge } from '@/components/common/Badge';
import { Bookmark, Star, Info, Film } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavoriteItem } from '@/store/slices/favoritesSlice';
import { openMovieModal } from '@/store/slices/navigationSlice';

interface MovieCardProps {
  item: MovieItem;
  compact?: boolean;
  reorderControl?: React.ReactNode;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  item,
  compact = false,
  reorderControl,
}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(item.id);

  return (
    <article
      aria-label={`Movie recommendation: ${item.title}`}
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Image container */}
      <div className="relative rounded-xl overflow-hidden mb-3.5">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.title}
          aspectRatioClass={compact ? 'aspect-[16/9]' : 'aspect-[16/10]'}
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <Badge variant="movie">Movie</Badge>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white">
            {item.genre}
          </span>
        </div>

        {/* Top Right Action & Reorder Controls */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          {reorderControl}
          <button
            type="button"
            onClick={() => dispatch(toggleFavoriteItem(item))}
            aria-label={isFavorited ? `Remove ${item.title} from favorites` : `Save ${item.title} to favorites`}
            aria-pressed={isFavorited}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-900/80 text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Rating overlay badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-amber-400 text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Meta Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
          {item.releaseYear}{item.duration ? ` • ${item.duration}` : ''}
        </span>
        {item.director && (
          <span className="text-slate-400 dark:text-slate-500 truncate max-w-[50%]">
            Dir. {item.director}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1 leading-snug mb-2">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
        {item.description}
      </p>

      {/* Informational Disclaimer Banner */}
      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-3 text-[11px] text-slate-500 dark:text-slate-400">
        <Film className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" aria-hidden="true" />
        <span className="truncate">Informational recommendation • No streaming</span>
      </div>

      {/* Action Button: Open Details */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Curated {item.createdAt}
        </span>
        <button
          type="button"
          onClick={() => dispatch(openMovieModal(item))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 dark:text-purple-300 transition-colors"
        >
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span>View Details</span>
        </button>
      </div>
    </article>
  );
};
