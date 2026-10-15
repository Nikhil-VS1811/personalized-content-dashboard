'use client';

import React, { useMemo } from 'react';
import {
  useGetTrendingMoviesQuery,
  useGetNewsQuery,
  useGetSocialQuery,
} from '@/store/api/contentApi';
import { ContentCard } from '@/components/cards/ContentCard';
import { CardSkeleton } from '@/components/common/CardSkeleton';
import { SourceAlert } from '@/components/common/SourceAlert';
import { useAppSelector } from '@/store/hooks';
import { Flame, TrendingUp, Sparkles } from 'lucide-react';
import { ContentItem } from '@/types/content';

export const TrendingView: React.FC = () => {
  const preferences = useAppSelector((state) => state.preferences.preferences);

  // 1. Fetch trending movies from TMDB /trending/movie/day
  const {
    data: trendingMoviesData,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
    refetch: refetchMovies,
  } = useGetTrendingMoviesQuery({ page: 1 });

  // 2. Fetch top news headlines
  const {
    data: newsData,
    isLoading: isNewsLoading,
    isError: isNewsError,
    refetch: refetchNews,
  } = useGetNewsQuery({
    categories: ['Technology', 'Business', 'Science'],
    page: 1,
    pageSize: 6,
  });

  // 3. Fetch mock social content (clearly identified)
  const {
    data: socialData,
    isLoading: isSocialLoading,
    isError: isSocialError,
    refetch: refetchSocial,
  } = useGetSocialQuery({ page: 1, pageSize: 3 });

  const isLoading = isMoviesLoading || isNewsLoading || isSocialLoading;

  // Interleave and rank trending items
  const rankedItems = useMemo(() => {
    const movies = trendingMoviesData?.items || [];
    const news = newsData?.items || [];
    const social = socialData?.items || [];

    const combined: ContentItem[] = [];
    const maxLen = Math.max(movies.length, news.length, social.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < movies.length) combined.push(movies[i]);
      if (i < news.length) combined.push(news[i]);
      if (i < social.length) combined.push(social[i]);
    }

    return combined.slice(0, 12).map((item, idx) => ({
      ...item,
      isTrending: true,
      trendingRank: idx + 1,
    }));
  }, [trendingMoviesData, newsData, socialData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Trending Content
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Top-ranked content aggregated from TMDB daily trends, breaking headlines, and community posts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Real-time provider streams (Social is Mock)</span>
        </div>
      </div>

      {/* Partial failure warnings */}
      {isMoviesError && (
        <SourceAlert
          sourceName="TMDB Trending"
          errorMessage="Could not retrieve TMDB daily trends."
          onRetry={refetchMovies}
        />
      )}
      {isNewsError && (
        <SourceAlert
          sourceName="News Headlines"
          errorMessage="Could not retrieve top news headlines."
          onRetry={refetchNews}
        />
      )}

      {/* Loading Skeletons */}
      {isLoading && rankedItems.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} compact={preferences.compactView} />
          ))}
        </div>
      )}

      {/* Grid of Ranked Trending Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedItems.map((item) => (
            <div key={item.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-md border-2 border-white dark:border-slate-900">
                #{item.trendingRank}
              </div>
              <ContentCard item={item} compact={preferences.compactView} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
