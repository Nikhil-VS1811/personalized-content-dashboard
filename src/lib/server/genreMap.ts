import { MovieGenre } from '@/types/content';

export const TMDB_GENRE_MAP: Record<MovieGenre, number> = {
  Action: 28,
  Animation: 16,
  Comedy: 35,
  Documentary: 99,
  Drama: 18,
  'Sci-Fi': 878, // TMDB ID for Science Fiction
};

export const TMDB_REVERSE_GENRE_MAP: Record<number, MovieGenre> = {
  28: 'Action',
  16: 'Animation',
  35: 'Comedy',
  99: 'Documentary',
  18: 'Drama',
  878: 'Sci-Fi',
};

/**
 * Converts user's selected MovieGenre array into comma-separated TMDB genre IDs.
 * Used for the `with_genres` parameter in TMDB Discover Movie endpoint.
 */
export function getTmdbGenreIds(genres: MovieGenre[]): string {
  const ids = genres
    .map((g) => TMDB_GENRE_MAP[g])
    .filter((id): id is number => typeof id === 'number');
  return ids.join('|'); // '|' represents OR in TMDB discover query
}

/**
 * Resolves the primary genre for a TMDB movie result based on its genre_ids
 */
export function resolveTmdbGenre(genreIds?: number[]): MovieGenre {
  if (!genreIds || genreIds.length === 0) return 'Drama';
  for (const id of genreIds) {
    if (TMDB_REVERSE_GENRE_MAP[id]) {
      return TMDB_REVERSE_GENRE_MAP[id];
    }
  }
  return 'Drama';
}
