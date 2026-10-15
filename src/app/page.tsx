'use client';

import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { FeedView } from '@/components/dashboard/FeedView';
import { TrendingView } from '@/components/dashboard/TrendingView';
import { FavoritesView } from '@/components/dashboard/FavoritesView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { MovieDetailsModal } from '@/components/cards/MovieDetailsModal';
import { SearchModal } from '@/components/dashboard/SearchModal';

export default function DashboardPage() {
  const activeSection = useAppSelector((state) => state.navigation.activeSection);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'feed':
        return <FeedView />;
      case 'trending':
        return <TrendingView />;
      case 'favorites':
        return <FavoritesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Header */}
      <Header />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 min-w-0 focus:outline-none flex flex-col justify-between"
        >
          <div>{renderActiveSection()}</div>

          {/* Provider Attribution & Legal Notice */}
          <footer className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500">
            <p>
              PulseDash Content Dashboard • News sourced via NewsAPI • Film metadata powered by{' '}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                TMDB
              </a>
              . This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Overlays / Modals */}
      <MovieDetailsModal />
      <SearchModal />
    </div>
  );
}
