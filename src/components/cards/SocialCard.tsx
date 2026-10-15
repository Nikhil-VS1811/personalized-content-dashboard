'use client';

import React, { useState } from 'react';
import { SocialItem } from '@/types/content';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Badge } from '@/components/common/Badge';
import { Bookmark, Heart, MessageSquare, Repeat2, Share2, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavoriteItem } from '@/store/slices/favoritesSlice';
import Image from 'next/image';

interface SocialCardProps {
  item: SocialItem;
  compact?: boolean;
  reorderControl?: React.ReactNode;
}

export const SocialCard: React.FC<SocialCardProps> = ({
  item,
  compact = false,
  reorderControl,
}) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(item.id);
  const [likes, setLikes] = useState(item.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(item.title);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // noop
    }
  };

  return (
    <article
      aria-label={`Social post by ${item.authorName}`}
      className={`group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Author Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
            <Image
              src={item.authorAvatar}
              alt={item.authorName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {item.authorName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {item.handle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="social">{item.platform}</Badge>
          {reorderControl}
          <button
            type="button"
            onClick={() => dispatch(toggleFavoriteItem(item))}
            aria-label={isFavorited ? `Remove post from favorites` : `Save post to favorites`}
            aria-pressed={isFavorited}
            className={`p-1.5 rounded-full transition-colors ${
              isFavorited
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Post text */}
      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200 mb-2 leading-relaxed">
        {item.description}
      </h3>

      {/* Optional attached image */}
      {item.imageUrl && (
        <div className="relative rounded-xl overflow-hidden mb-3">
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.title}
            aspectRatioClass="aspect-[16/9]"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Engagement Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <button
          type="button"
          onClick={handleLike}
          aria-label={`${likes} likes. Click to ${hasLiked ? 'unlike' : 'like'}`}
          className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${
            hasLiked ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} aria-hidden="true" />
          <span>{likes.toLocaleString()}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{item.commentsCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Repeat2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{item.sharesCount}</span>
        </div>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy post link"
          className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
