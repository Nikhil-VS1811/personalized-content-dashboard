import { MovieItem, MovieGenre } from '@/types/content';
import { PaginatedSourceResponse } from '@/types/api';
import { normalizeTmdbMovie } from './normalizers';
import { getTmdbGenreIds } from './genreMap';
import { DEMO_MOVIE_ITEMS } from '@/fixtures/moviesData';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';

interface FetchMoviesOptions {
  genres?: MovieGenre[];
  query?: string;
  mode?: 'discover' | 'trending';
  page?: number;
  pageSize?: number;
}

export async function fetchMoviesService({
  genres = ['Sci-Fi', 'Drama', 'Action'],
  query = '',
  mode = 'discover',
  page = 1,
  pageSize = 10,
}: FetchMoviesOptions): Promise<PaginatedSourceResponse<MovieItem>> {
  const apiKey = process.env.TMDB_API_KEY?.trim();
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  const isDemoExplicit = process.env.DEMO_MODE === 'true';

  const hasCredentials = Boolean(
    (apiKey && apiKey !== 'your_tmdb_api_key_here') ||
    (accessToken && accessToken !== 'your_v4_bearer_token_here')
  );

  // Demo fallback mode when credentials are missing or demo mode is forced
  if (!hasCredentials || isDemoExplicit) {
    const demoReason = !hasCredentials
      ? 'No TMDB_API_KEY or TMDB_ACCESS_TOKEN configured'
      : 'DEMO_MODE explicitly enabled';

    let filtered = DEMO_MOVIE_ITEMS;
    if (mode === 'trending') {
      filtered = filtered.filter((m) => m.isTrending);
    } else if (genres.length > 0) {
      filtered = filtered.filter((m) => genres.includes(m.genre));
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const startIdx = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);
    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / pageSize) || 1;

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalResults,
      totalPages,
      hasMore: page < totalPages,
      isDemo: true,
      demoReason,
      source: 'movies',
    };
  }

  // Build TMDB endpoint URL
  let endpoint = '';
  if (query.trim()) {
    endpoint = `${TMDB_API_BASE}/search/movie?query=${encodeURIComponent(
      query.trim()
    )}&page=${page}&include_adult=false`;
  } else if (mode === 'trending') {
    endpoint = `${TMDB_API_BASE}/trending/movie/day?page=${page}`;
  } else {
    const genreParam = getTmdbGenreIds(genres);
    endpoint = `${TMDB_API_BASE}/discover/movie?sort_by=popularity.desc&page=${page}&include_adult=false${
      genreParam ? `&with_genres=${genreParam}` : ''
    }`;
  }

  // Request Headers
  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (accessToken && accessToken !== 'your_v4_bearer_token_here') {
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (apiKey && apiKey !== 'your_tmdb_api_key_here') {
    endpoint += `${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(endpoint, {
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetails = `TMDB upstream error HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.status_message) errorDetails = errorJson.status_message;
      } catch {
        // noop
      }
      const err = new Error(errorDetails);
      (err as any).statusCode = response.status;
      throw err;
    }

    const data = await response.json();
    if (!Array.isArray(data.results)) {
      throw new Error('Malformed response received from TMDB');
    }

    const items: MovieItem[] = data.results
      .map((m: any, idx: number) => normalizeTmdbMovie(m, idx))
      .filter((item: MovieItem | null): item is MovieItem => item !== null);

    const totalPages = Math.min(data.total_pages || 1, 500); // TMDB caps page count to 500
    const totalResults = data.total_results || items.length;

    return {
      items,
      page,
      pageSize: 20, // TMDB returns 20 items per page
      totalResults,
      totalPages,
      hasMore: page < totalPages,
      isDemo: false,
      source: 'movies',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('TMDB upstream request timed out after 8 seconds');
      (timeoutErr as any).statusCode = 504;
      throw timeoutErr;
    }
    throw error;
  }
}
