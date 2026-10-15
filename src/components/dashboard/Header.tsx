'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { toggleMobileMenu, openSearchModal, setSearchPreviewQuery } from '@/store/slices/navigationSlice';
import { DEMO_USER_PROFILE } from '@/fixtures';
import { Search, Sun, Moon, Menu, Sparkles, UserCheck } from 'lucide-react';
import Image from 'next/image';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const searchPreviewQuery = useAppSelector((state) => state.navigation.searchPreviewQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(openSearchModal());
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + App Brand on Mobile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              PD
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
              Pulse
            </span>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-lg mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative">
            <label htmlFor="dashboard-search-input" className="sr-only">
              Search content
            </label>
            <div className="relative flex items-center">
              <Search
                className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="dashboard-search-input"
                type="search"
                value={searchPreviewQuery}
                onChange={(e) => dispatch(setSearchPreviewQuery(e.target.value))}
                onClick={() => dispatch(openSearchModal())}
                placeholder="Search articles, movies, or community topics..."
                className="w-full pl-10 pr-16 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
              />
              <kbd className="hidden sm:inline-flex absolute right-2.5 px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200 dark:bg-slate-700/60 rounded border border-slate-300 dark:border-slate-600">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right: Theme Toggle & Demo Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} theme`}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
            )}
          </button>

          {/* Clearly Labeled Demo Profile Badge */}
          <div
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80"
            title={`${DEMO_USER_PROFILE.name} (${DEMO_USER_PROFILE.role})`}
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-indigo-200 flex-shrink-0">
              <Image
                src={DEMO_USER_PROFILE.avatar}
                alt={DEMO_USER_PROFILE.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[110px]">
                  {DEMO_USER_PROFILE.name}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Demo
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {DEMO_USER_PROFILE.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
