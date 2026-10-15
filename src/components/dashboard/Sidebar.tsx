'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveSection } from '@/store/slices/navigationSlice';
import { NavigationSection, NAV_ITEMS } from '@/types/navigation';
import { LayoutGrid, Flame, Bookmark, Sliders, Sparkles, Database } from 'lucide-react';

const iconMap = {
  feed: LayoutGrid,
  trending: Flame,
  favorites: Bookmark,
  settings: Sliders,
};

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector((state) => state.navigation.activeSection);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 flex-shrink-0 min-h-[calc(100vh-4rem)]"
    >
      {/* Brand Title */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
          PD
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            PulseDash
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Personalized Content
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = activeSection === item.id;
          const showBadge = item.id === 'favorites' && favoriteIds.length > 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => dispatch(setActiveSection(item.id))}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </div>

              {showBadge && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {favoriteIds.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
