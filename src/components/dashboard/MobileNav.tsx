'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveSection, setMobileMenuOpen } from '@/store/slices/navigationSlice';
import { NAV_ITEMS } from '@/types/navigation';
import { LayoutGrid, Flame, Bookmark, Sliders, X, Sparkles } from 'lucide-react';
import { DEMO_USER_PROFILE } from '@/fixtures';
import Image from 'next/image';

const iconMap = {
  feed: LayoutGrid,
  trending: Flame,
  favorites: Bookmark,
  settings: Sliders,
};

export const MobileNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector((state) => state.navigation.activeSection);
  const mobileMenuOpen = useAppSelector((state) => state.navigation.mobileMenuOpen);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  return (
    <>
      {/* 1. Mobile Bottom Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
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
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {favoriteIds.length}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 2. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="md:hidden fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => dispatch(setMobileMenuOpen(false))}
        >
          <div
            className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  PD
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    PulseDash
                  </h2>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Phase 1 Demo
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dispatch(setMobileMenuOpen(false))}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile snapshot in drawer */}
            <div className="my-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100">
                <Image
                  src={DEMO_USER_PROFILE.avatar}
                  alt={DEMO_USER_PROFILE.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {DEMO_USER_PROFILE.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {DEMO_USER_PROFILE.role}
                </div>
              </div>
            </div>

            {/* Drawer Links */}
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.id];
                const isActive = activeSection === item.id;
                const showBadge = item.id === 'favorites' && favoriteIds.length > 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => dispatch(setActiveSection(item.id))}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {showBadge && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
                        {favoriteIds.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
