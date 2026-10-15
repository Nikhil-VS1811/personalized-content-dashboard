import { NextRequest, NextResponse } from 'next/server';
import { fetchMoviesService } from '@/lib/server/movieService';
import { MovieGenre } from '@/types/content';
import { ALL_MOVIE_GENRES } from '@/types/preferences';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate genres
    const genresParam = searchParams.get('genres') || '';
    const rawGenres = genresParam ? genresParam.split(',') : [];
    const validGenres = rawGenres.filter((g): g is MovieGenre =>
      ALL_MOVIE_GENRES.includes(g as MovieGenre)
    );
    const genres: MovieGenre[] =
      validGenres.length > 0 ? validGenres : ['Sci-Fi', 'Drama', 'Action'];

    // Mode: discover vs trending
    const modeParam = searchParams.get('mode');
    const mode: 'discover' | 'trending' =
      modeParam === 'trending' ? 'trending' : 'discover';

    // Parse and validate pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10) || 20)
    );
    const query = searchParams.get('query') || '';

    const result = await fetchMoviesService({
      genres,
      query,
      mode,
      page,
      pageSize,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch movie recommendations',
        details: error.message || 'Upstream TMDB provider request failed',
        statusCode,
        source: 'movies',
      },
      { status: statusCode }
    );
  }
}
