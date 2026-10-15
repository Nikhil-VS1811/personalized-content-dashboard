'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeMovieModal } from '@/store/slices/navigationSlice';
import { toggleFavoriteItem } from '@/store/slices/favoritesSlice';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Badge } from '@/components/common/Badge';
import { X, Star, Bookmark, Calendar, Clock, Film, ShieldAlert, UserCheck } from 'lucide-react';

import { useFocusTrap } from '@/lib/useFocusTrap';

export const MovieDetailsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const movie = useAppSelector((state) => state.navigation.selectedMovieForModal);
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  const isFavorited = movie ? favoriteIds.includes(movie.id) : false;
  const trapRef = useFocusTrap(Boolean(movie), () => dispatch(closeMovieModal()));

  if (!movie) return null;

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => dispatch(closeMovieModal())}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Poster */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[2/1] overflow-hidden bg-slate-900">
          <ImageWithFallback
            src={movie.imageUrl}
            alt={movie.title}
            aspectRatioClass="aspect-[2/1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => dispatch(closeMovieModal())}
            aria-label="Close movie details dialog"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Metadata overlay */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="movie">{movie.genre}</Badge>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
            </div>
            <h2 id="movie-modal-title" className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Explicit Streaming Disclaimer Requirement */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Streaming Unavailable Notice</p>
              <p className="text-amber-800 dark:text-amber-300">
                {movie.streamingNotice}
              </p>
            </div>
          </div>

          {/* Key Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Released: <strong className="text-slate-900 dark:text-slate-100">{movie.releaseYear}</strong></span>
            </div>
            {movie.duration && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Runtime: <strong className="text-slate-900 dark:text-slate-100">{movie.duration}</strong></span>
              </div>
            )}
            {movie.director && (
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Film className="w-4 h-4 text-slate-400" />
                <span>Director: <strong className="text-slate-900 dark:text-slate-100 truncate">{movie.director}</strong></span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Synopsis
            </h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                Featured Cast
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => dispatch(toggleFavoriteItem(movie))}
            aria-pressed={isFavorited}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isFavorited
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span>{isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(closeMovieModal())}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
