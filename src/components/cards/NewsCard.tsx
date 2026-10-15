'use client';

import React from 'react';
import { NewsItem } from '@/types/content';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Badge } from '@/components/common/Badge';
import { Bookmark, Clock, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavoriteItem } from '@/store/slices/favoritesSlice';

interface NewsCardProps {
  item: NewsItem;
  compact?: boolean;
  reorderControl?: React.ReactNode;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  item,
  compact = false,
  reorderControl,
}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(item.id);

  return (
    <article
      aria-label={`News: ${item.title}`}
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
          <Badge variant="news">News</Badge>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white">
            {item.category}
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
      </div>

      {/* Meta Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
        <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[60%]">
          {item.source}
        </span>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{item.readTimeMinutes} min read</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-2">
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-grow">
        {item.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {item.createdAt}
        </span>
        <a
          href={item.sourceUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Read source</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};
