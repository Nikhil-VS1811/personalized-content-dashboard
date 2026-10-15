'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleNewsCategory,
  toggleMovieGenre,
  toggleContentTypeFilter,
  toggleCompactView,
  resetPreferences,
} from '@/store/slices/preferencesSlice';
import { ALL_NEWS_CATEGORIES, ALL_MOVIE_GENRES } from '@/types/preferences';
import {
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Film,
  Newspaper,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences.preferences);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const triggerSavedFeedback = () => {
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Content Preferences & Dashboard Settings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalize what appears in your Feed. Changes are automatically saved to localStorage.
          </p>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={() => {
            dispatch(resetPreferences());
            triggerSavedFeedback();
          }}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Auto-save notification banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span>
            Preferences are persisted locally in <code>localStorage</code> with SSR hydration safety.
          </span>
        </div>
        {showSavedFeedback && (
          <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      {/* Section 1: News Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Newspaper className="w-5 h-5 text-blue-500" />
          <h3>News Categories</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Select the reporting topics you wish to include in your personalized news stream. At least one must remain active.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {ALL_NEWS_CATEGORIES.map((category) => {
            const isSelected = preferences.selectedNewsCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  dispatch(toggleNewsCategory(category));
                  triggerSavedFeedback();
                }}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Movie Genres */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Film className="w-5 h-5 text-purple-500" />
          <h3>Movie Recommendation Genres</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Pick your preferred film genres. Recommendations open full details with director, cast, and synopsis.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {ALL_MOVIE_GENRES.map((genre) => {
            const isSelected = preferences.selectedMovieGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => {
                  dispatch(toggleMovieGenre(genre));
                  triggerSavedFeedback();
                }}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{genre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3: Content Types & Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Layers className="w-5 h-5 text-indigo-500" />
          <h3>Content Streams & Layout</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Control which types of content are rendered in your feed and configure display density.
        </p>

        <div className="space-y-3 pt-2">
          {/* Show News */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                News Articles Stream
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Include curated engineering, science, and industry reports
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.contentFilters.showNews}
              onChange={() => {
                dispatch(toggleContentTypeFilter('showNews'));
                triggerSavedFeedback();
              }}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          {/* Show Movies */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Movie Recommendations Stream
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Include curated cinematic reviews and informational releases
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.contentFilters.showMovies}
              onChange={() => {
                dispatch(toggleContentTypeFilter('showMovies'));
                triggerSavedFeedback();
              }}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          {/* Show Social */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Social Community Posts
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Include tech posts from Twitter/X, Bluesky, and LinkedIn
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.contentFilters.showSocial}
              onChange={() => {
                dispatch(toggleContentTypeFilter('showSocial'));
                triggerSavedFeedback();
              }}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
            />
          </label>

          {/* Compact View */}
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Compact Card Layout
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Display cards in a denser 4-column layout for widescreen monitors
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactView}
              onChange={() => {
                dispatch(toggleCompactView());
                triggerSavedFeedback();
              }}
              className="w-5 h-5 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
