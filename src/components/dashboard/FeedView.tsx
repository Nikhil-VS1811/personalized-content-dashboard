'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} from '@/store/api/contentApi';
import { ContentCard } from '@/components/cards/ContentCard';
import { CardDragHandle } from '@/components/cards/CardDragHandle';
import { CardSkeleton } from '@/components/common/CardSkeleton';
import { SourceAlert } from '@/components/common/SourceAlert';
import { EmptyState } from '@/components/common/EmptyState';
import { setActiveSection } from '@/store/slices/navigationSlice';
import { resetPreferences } from '@/store/slices/preferencesSlice';
import {
  setCustomOrderIds,
  moveCardKeyboard,
  resetFeedOrder,
} from '@/store/slices/feedOrderSlice';
import { ContentItem, ContentType, NewsItem, MovieItem, SocialItem } from '@/types/content';
import {
  SlidersHorizontal,
  Sparkles,
  Filter,
  Newspaper,
  Film,
  MessageCircle,
  Loader2,
  Info,
  ChevronDown,
  RotateCcw,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FeedView: React.FC = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences.preferences);
  const customOrderIds = useAppSelector((state) => state.feedOrder.customOrderIds);
  const lastAnnouncement = useAppSelector((state) => state.feedOrder.lastAnnouncement);

  // Tab filter: 'all' | 'news' | 'movie' | 'social'
  const [selectedTypeTab, setSelectedTypeTab] = useState<'all' | ContentType>('all');

  // Independent source pagination pages
  const [newsPage, setNewsPage] = useState(1);
  const [moviesPage, setMoviesPage] = useState(1);
  const [socialPage, setSocialPage] = useState(1);

  // Drag and drop state
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  // Accumulated items to support append-only Load More with deduplication
  const [accumulatedNews, setAccumulatedNews] = useState<NewsItem[]>([]);
  const [accumulatedMovies, setAccumulatedMovies] = useState<MovieItem[]>([]);
  const [accumulatedSocial, setAccumulatedSocial] = useState<SocialItem[]>([]);

  // Track previous preferences to reset pagination on changes
  const prevPrefsRef = useRef(preferences);

  useEffect(() => {
    const prev = prevPrefsRef.current;
    const categoriesChanged =
      JSON.stringify(prev.selectedNewsCategories) !==
      JSON.stringify(preferences.selectedNewsCategories);
    const genresChanged =
      JSON.stringify(prev.selectedMovieGenres) !==
      JSON.stringify(preferences.selectedMovieGenres);
    const filtersChanged =
      JSON.stringify(prev.contentFilters) !==
      JSON.stringify(preferences.contentFilters);

    if (categoriesChanged || genresChanged || filtersChanged) {
      prevPrefsRef.current = preferences;
      // Reset pagination and accumulated state
      setNewsPage(1);
      setMoviesPage(1);
      setSocialPage(1);
      setAccumulatedNews([]);
      setAccumulatedMovies([]);
      setAccumulatedSocial([]);
    }
  }, [preferences]);

  // 1. News RTK Query
  const {
    data: newsData,
    isLoading: isNewsInitialLoading,
    isFetching: isNewsFetching,
    isError: isNewsError,
    error: newsErrorObj,
    refetch: refetchNews,
  } = useGetNewsQuery(
    {
      categories: preferences.selectedNewsCategories,
      page: newsPage,
      pageSize: 6,
    },
    { skip: !preferences.contentFilters.showNews }
  );

  // 2. Movies RTK Query
  const {
    data: moviesData,
    isLoading: isMoviesInitialLoading,
    isFetching: isMoviesFetching,
    isError: isMoviesError,
    error: moviesErrorObj,
    refetch: refetchMovies,
  } = useGetMoviesQuery(
    {
      genres: preferences.selectedMovieGenres,
      page: moviesPage,
      pageSize: 6,
      mode: 'discover',
    },
    { skip: !preferences.contentFilters.showMovies }
  );

  // 3. Social RTK Query (mock endpoint)
  const {
    data: socialData,
    isLoading: isSocialInitialLoading,
    isFetching: isSocialFetching,
    isError: isSocialError,
    refetch: refetchSocial,
  } = useGetSocialQuery(
    {
      page: socialPage,
      pageSize: 4,
    },
    { skip: !preferences.contentFilters.showSocial }
  );

  // Accumulate News items with ID deduplication
  useEffect(() => {
    if (newsData?.items) {
      setAccumulatedNews((prev) => {
        if (newsPage === 1) return newsData.items;
        const existingIds = new Set(prev.map((i) => i.id));
        const newUnique = newsData.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newUnique];
      });
    }
  }, [newsData, newsPage]);

  // Accumulate Movies items with ID deduplication
  useEffect(() => {
    if (moviesData?.items) {
      setAccumulatedMovies((prev) => {
        if (moviesPage === 1) return moviesData.items;
        const existingIds = new Set(prev.map((i) => i.id));
        const newUnique = moviesData.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newUnique];
      });
    }
  }, [moviesData, moviesPage]);

  // Accumulate Social items with ID deduplication
  useEffect(() => {
    if (socialData?.items) {
      setAccumulatedSocial((prev) => {
        if (socialPage === 1) return socialData.items;
        const existingIds = new Set(prev.map((i) => i.id));
        const newUnique = socialData.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newUnique];
      });
    }
  }, [socialData, socialPage]);

  // Interleave accumulated items into a unified balanced feed
  const unifiedFeedItems = useMemo(() => {
    const newsList = preferences.contentFilters.showNews ? accumulatedNews : [];
    const movieList = preferences.contentFilters.showMovies ? accumulatedMovies : [];
    const socialList = preferences.contentFilters.showSocial ? accumulatedSocial : [];

    const result: ContentItem[] = [];
    const maxLen = Math.max(newsList.length, movieList.length, socialList.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < newsList.length) result.push(newsList[i]);
      if (i < movieList.length) result.push(movieList[i]);
      if (i < socialList.length) result.push(socialList[i]);
    }

    if (selectedTypeTab === 'all') return result;
    return result.filter((item) => item.type === selectedTypeTab);
  }, [
    accumulatedNews,
    accumulatedMovies,
    accumulatedSocial,
    preferences.contentFilters,
    selectedTypeTab,
  ]);

  // Apply custom card reordering (preserves user reordered IDs across navigation/reloads)
  const orderedFeedItems = useMemo(() => {
    if (customOrderIds.length === 0) return unifiedFeedItems;

    const orderMap = new Map<string, number>();
    customOrderIds.forEach((id, index) => orderMap.set(id, index));

    return [...unifiedFeedItems].sort((a, b) => {
      const aIndex = orderMap.has(a.id) ? orderMap.get(a.id)! : 1000000;
      const bIndex = orderMap.has(b.id) ? orderMap.get(b.id)! : 1000000;
      return aIndex - bIndex;
    });
  }, [unifiedFeedItems, customOrderIds]);

  // Check if any source is running in demo mode
  const isAnyDemo =
    Boolean(newsData?.isDemo && preferences.contentFilters.showNews) ||
    Boolean(moviesData?.isDemo && preferences.contentFilters.showMovies) ||
    Boolean(socialData?.isDemo && preferences.contentFilters.showSocial);

  const demoReasons = [
    newsData?.isDemo ? `News: ${newsData.demoReason || 'Demo mode'}` : null,
    moviesData?.isDemo ? `Movies: ${moviesData.demoReason || 'Demo mode'}` : null,
    socialData?.isDemo ? 'Social: Mock Route' : null,
  ]
    .filter(Boolean)
    .join(' • ');

  // Loading flags
  const isInitialLoading =
    (preferences.contentFilters.showNews && isNewsInitialLoading && accumulatedNews.length === 0) ||
    (preferences.contentFilters.showMovies && isMoviesInitialLoading && accumulatedMovies.length === 0) ||
    (preferences.contentFilters.showSocial && isSocialInitialLoading && accumulatedSocial.length === 0);

  const isAnyFetching = isNewsFetching || isMoviesFetching || isSocialFetching;

  // Pagination availability per source
  const newsHasMore = preferences.contentFilters.showNews ? (newsData?.hasMore ?? true) : false;
  const moviesHasMore = preferences.contentFilters.showMovies ? (moviesData?.hasMore ?? true) : false;
  const socialHasMore = preferences.contentFilters.showSocial ? (socialData?.hasMore ?? true) : false;

  const canLoadMore = newsHasMore || moviesHasMore || socialHasMore;

  const handleLoadMore = () => {
    if (isAnyFetching) return;
    if (newsHasMore) setNewsPage((p) => p + 1);
    if (moviesHasMore) setMoviesPage((p) => p + 1);
    if (socialHasMore) setSocialPage((p) => p + 1);
  };

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    }
    setDraggedCardId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (draggedCardId && draggedCardId !== id) {
      setDragOverCardId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer?.getData('text/plain') || draggedCardId;
    if (!sourceId || sourceId === targetId) {
      handleDragEnd();
      return;
    }

    const currentVisibleIds = orderedFeedItems.map((i) => i.id);
    const fromIdx = currentVisibleIds.indexOf(sourceId);
    const toIdx = currentVisibleIds.indexOf(targetId);

    if (fromIdx !== -1 && toIdx !== -1) {
      const updated = [...currentVisibleIds];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);

      // Merge with remaining IDs in customOrderIds not currently visible
      const remainingCustom = customOrderIds.filter((id) => !currentVisibleIds.includes(id));
      dispatch(setCustomOrderIds([...updated, ...remainingCustom]));
    }
    handleDragEnd();
  };

  // Keyboard reordering handlers
  const handleMoveUp = (card: ContentItem, idx: number) => {
    if (idx <= 0) return;
    dispatch(
      moveCardKeyboard({
        cardId: card.id,
        cardTitle: card.title,
        currentIndex: idx,
        targetIndex: idx - 1,
        visibleIds: orderedFeedItems.map((i) => i.id),
      })
    );
  };

  const handleMoveDown = (card: ContentItem, idx: number) => {
    if (idx >= orderedFeedItems.length - 1) return;
    dispatch(
      moveCardKeyboard({
        cardId: card.id,
        cardTitle: card.title,
        currentIndex: idx,
        targetIndex: idx + 1,
        visibleIds: orderedFeedItems.map((i) => i.id),
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Screen Reader Live Region for position announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {lastAnnouncement}
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Personalized Feed
            </h2>
            {isAnyDemo && (
              <span
                title={demoReasons}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800 cursor-help"
              >
                Demo Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time feed streaming from NewsAPI, TMDB, and mock community routes. Cards can be reordered.
          </p>
        </div>

        {/* Action Buttons: Reset Order & Preferences */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {customOrderIds.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(resetFeedOrder())}
              aria-label="Reset card order to default"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Order</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => dispatch(setActiveSection('settings'))}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Customize Preferences</span>
          </button>
        </div>
      </div>

      {/* Independent Source Errors */}
      {isNewsError && preferences.contentFilters.showNews && (
        <SourceAlert
          sourceName="News"
          errorMessage={
            (newsErrorObj as any)?.data?.details ||
            (newsErrorObj as any)?.error ||
            'Failed to retrieve news headlines.'
          }
          onRetry={refetchNews}
          isRetrying={isNewsFetching}
        />
      )}

      {isMoviesError && preferences.contentFilters.showMovies && (
        <SourceAlert
          sourceName="Movies (TMDB)"
          errorMessage={
            (moviesErrorObj as any)?.data?.details ||
            (moviesErrorObj as any)?.error ||
            'Failed to retrieve TMDB movie recommendations.'
          }
          onRetry={refetchMovies}
          isRetrying={isMoviesFetching}
        />
      )}

      {isSocialError && preferences.contentFilters.showSocial && (
        <SourceAlert
          sourceName="Social"
          errorMessage="Failed to retrieve mock community posts."
          onRetry={refetchSocial}
          isRetrying={isSocialFetching}
        />
      )}

      {/* Sub-header Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTypeTab === 'all'}
            onClick={() => setSelectedTypeTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTypeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Content
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTypeTab === 'news'}
            onClick={() => setSelectedTypeTab('news')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTypeTab === 'news'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Articles</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTypeTab === 'movie'}
            onClick={() => setSelectedTypeTab('movie')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTypeTab === 'movie'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTypeTab === 'social'}
            onClick={() => setSelectedTypeTab('social')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTypeTab === 'social'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Social</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {customOrderIds.length > 0 && (
            <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
              <ArrowUpDown className="w-3 h-3" />
              <span>Custom Order Active</span>
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Loaded <strong>{orderedFeedItems.length}</strong> items
            </span>
          </div>
        </div>
      </div>

      {/* Initial Loading Skeletons */}
      {isInitialLoading && (
        <div
          className={`grid gap-5 sm:gap-6 ${
            preferences.compactView
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} compact={preferences.compactView} />
          ))}
        </div>
      )}

      {/* Cards Grid with Framer Motion Spring Layout Transitions */}
      {!isInitialLoading && orderedFeedItems.length > 0 && (
        <div
          className={`grid gap-5 sm:gap-6 ${
            preferences.compactView
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {orderedFeedItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              className={`transition-all duration-150 ${
                draggedCardId === item.id
                  ? 'opacity-60 scale-[0.98] ring-2 ring-indigo-500 rounded-2xl shadow-xl'
                  : dragOverCardId === item.id
                  ? 'ring-2 ring-dashed ring-indigo-400 rounded-2xl'
                  : ''
              }`}
            >
              <ContentCard
                item={item}
                compact={preferences.compactView}
                reorderControl={
                  <CardDragHandle
                    cardId={item.id}
                    cardTitle={item.title}
                    currentIndex={idx}
                    totalCount={orderedFeedItems.length}
                    onMoveUp={() => handleMoveUp(item, idx)}
                    onMoveDown={() => handleMoveDown(item, idx)}
                    isDragging={draggedCardId === item.id}
                    dragListeners={{
                      draggable: true,
                      onDragStart: (e: any) => handleDragStart(e, item.id),
                      onDragEnd: handleDragEnd,
                    }}
                  />
                }
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isInitialLoading && orderedFeedItems.length === 0 && (
        <EmptyState
          icon={Filter}
          title="No content available for current filters"
          description="Your current category or genre selections in Settings did not return any results, or the selected sources are disabled."
          action={{
            label: 'Reset Preferences',
            onClick: () => dispatch(resetPreferences()),
          }}
        />
      )}

      {/* Load More Pagination Interaction */}
      {!isInitialLoading && orderedFeedItems.length > 0 && (
        <div className="pt-6 pb-2 flex flex-col items-center justify-center">
          {canLoadMore ? (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isAnyFetching}
              aria-label="Load more feed results"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isAnyFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading more items...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Load More Content</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>You have reached the end of the current stream.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
