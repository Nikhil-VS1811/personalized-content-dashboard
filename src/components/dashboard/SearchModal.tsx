'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeSearchModal, setSearchPreviewQuery } from '@/store/slices/navigationSlice';
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery,
} from '@/store/api/contentApi';
import { ContentCard } from '@/components/cards/ContentCard';
import { CardSkeleton } from '@/components/common/CardSkeleton';
import { SourceAlert } from '@/components/common/SourceAlert';
import { Search, X, Loader2, Sparkles, Filter, Newspaper, Film, MessageCircle } from 'lucide-react';
import { ContentItem, ContentType } from '@/types/content';
import { useFocusTrap } from '@/lib/useFocusTrap';

export const SearchModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.navigation.searchModalOpen);
  const inputQuery = useAppSelector((state) => state.navigation.searchPreviewQuery);

  const [debouncedQuery, setDebouncedQuery] = useState(inputQuery);
  const [selectedTab, setSelectedTab] = useState<'all' | ContentType>('all');
  const latestQueryRef = useRef(debouncedQuery);

  const trapRef = useFocusTrap(isOpen, () => dispatch(closeSearchModal()));

  // Debounce input by ~350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputQuery.trim());
      latestQueryRef.current = inputQuery.trim();
    }, 350);
    return () => clearTimeout(timer);
  }, [inputQuery]);

  const hasSearchTerm = debouncedQuery.length > 0;

  // 1. Search News
  const {
    data: newsData,
    isLoading: isNewsLoading,
    isFetching: isNewsFetching,
    isError: isNewsError,
    refetch: refetchNews,
  } = useGetNewsQuery(
    { query: debouncedQuery, page: 1, pageSize: 6 },
    { skip: !hasSearchTerm || !isOpen }
  );

  // 2. Search Movies
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    isFetching: isMoviesFetching,
    isError: isMoviesError,
    refetch: refetchMovies,
  } = useGetMoviesQuery(
    { query: debouncedQuery, page: 1, pageSize: 6 },
    { skip: !hasSearchTerm || !isOpen }
  );

  // 3. Search Social
  const {
    data: socialData,
    isLoading: isSocialLoading,
    isFetching: isSocialFetching,
    isError: isSocialError,
    refetch: refetchSocial,
  } = useGetSocialQuery(
    { query: debouncedQuery, page: 1, pageSize: 4 },
    { skip: !hasSearchTerm || !isOpen }
  );

  const isSearching =
    hasSearchTerm && (isNewsFetching || isMoviesFetching || isSocialFetching);

  // Merge search results across sources
  const combinedResults = useMemo(() => {
    if (!hasSearchTerm) return [];
    const news = newsData?.items || [];
    const movies = moviesData?.items || [];
    const social = socialData?.items || [];

    const list: ContentItem[] = [];
    const maxLen = Math.max(news.length, movies.length, social.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < news.length) list.push(news[i]);
      if (i < movies.length) list.push(movies[i]);
      if (i < social.length) list.push(social[i]);
    }

    if (selectedTab === 'all') return list;
    return list.filter((i) => i.type === selectedTab);
  }, [hasSearchTerm, newsData, moviesData, socialData, selectedTab]);

  if (!isOpen) return null;

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:pt-16 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
      onClick={() => dispatch(closeSearchModal())}
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 flex-shrink-0" aria-hidden="true" />
          <input
            id="search-modal-input"
            type="search"
            autoFocus
            value={inputQuery}
            onChange={(e) => dispatch(setSearchPreviewQuery(e.target.value))}
            placeholder="Search live articles, movies, topics, or authors..."
            className="flex-1 bg-transparent text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
          )}
          {inputQuery && (
            <button
              type="button"
              onClick={() => dispatch(setSearchPreviewQuery(''))}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => dispatch(closeSearchModal())}
            aria-label="Close search modal"
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Source Filtering Tabs */}
        {hasSearchTerm && (
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTab('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTab === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Sources
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('news')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTab === 'news'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                News
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('movie')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTab === 'movie'
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Movies
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('social')}
                className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  selectedTab === 'social'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Social
              </button>
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              {combinedResults.length} matches for &quot;{debouncedQuery}&quot;
            </span>
          </div>
        )}

        {/* Source Alerts if any provider errors */}
        <div className="px-5">
          {isNewsError && hasSearchTerm && (
            <SourceAlert
              sourceName="News Search"
              errorMessage="News search endpoint returned an error."
              onRetry={refetchNews}
            />
          )}
          {isMoviesError && hasSearchTerm && (
            <SourceAlert
              sourceName="TMDB Search"
              errorMessage="TMDB movie search returned an error."
              onRetry={refetchMovies}
            />
          )}
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {!hasSearchTerm ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Search Across News, Movies & Community
              </p>
              <p className="text-xs mt-1 max-w-sm mx-auto">
                Type keywords like &quot;Interstellar&quot;, &quot;Technology&quot;, &quot;Architecture&quot;, or &quot;Science&quot; to perform live debounced queries.
              </p>
            </div>
          ) : isSearching && combinedResults.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} compact={true} />
              ))}
            </div>
          ) : combinedResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No matches found for &quot;{debouncedQuery}&quot;</p>
              <p className="text-xs mt-1">Try another keyword or search in a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {combinedResults.map((item) => (
                <ContentCard key={item.id} item={item} compact={true} />
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Multi-Source Live Querying • Debounced 350ms</span>
          </div>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
