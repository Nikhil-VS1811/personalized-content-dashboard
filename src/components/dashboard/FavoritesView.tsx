'use client';

import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ALL_DEMO_CONTENT } from '@/fixtures';
import { ContentCard } from '@/components/cards/ContentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { setActiveSection } from '@/store/slices/navigationSlice';
import { Bookmark, FolderHeart } from 'lucide-react';
import { ContentItem } from '@/types/content';

export const FavoritesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const savedItems = useAppSelector((state) => state.favorites.savedItems);
  const preferences = useAppSelector((state) => state.preferences.preferences);

  // Reconcile saved full items from Redux + fallback to demo fixtures
  const favoritedItems = useMemo(() => {
    const list: ContentItem[] = [];
    const fixtureMap = new Map(ALL_DEMO_CONTENT.map((i) => [i.id, i]));

    for (const id of favoriteIds) {
      if (savedItems && savedItems[id]) {
        list.push(savedItems[id]);
      } else if (fixtureMap.has(id)) {
        list.push(fixtureMap.get(id)!);
      }
    }
    return list;
  }, [favoriteIds, savedItems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Saved Favorites
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Articles, movie picks, and community posts saved for your review. Persisted across reloads.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 self-start sm:self-auto">
          <span>{favoritedItems.length} Saved {favoritedItems.length === 1 ? 'Item' : 'Items'}</span>
        </div>
      </div>

      {/* Favorited Items Grid or Empty State */}
      {favoritedItems.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No favorites saved yet"
          description="Click the bookmark icon on any news card, movie recommendation, or social post to save it to your personal library."
          action={{
            label: 'Explore Feed',
            onClick: () => dispatch(setActiveSection('feed')),
          }}
        />
      ) : (
        <div
          className={`grid gap-5 sm:gap-6 ${
            preferences.compactView
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {favoritedItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              compact={preferences.compactView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
