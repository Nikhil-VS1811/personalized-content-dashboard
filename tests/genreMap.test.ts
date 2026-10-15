import { describe, it, expect } from 'vitest';
import { getTmdbGenreIds, resolveTmdbGenre } from '@/lib/server/genreMap';

describe('TMDB Genre Mapping & Discover Parameters', () => {
  it('converts array of selected movie genres into piped TMDB genre IDs', () => {
    const ids = getTmdbGenreIds(['Sci-Fi', 'Action', 'Drama']);
    // TMDB IDs: Sci-Fi=878, Action=28, Drama=18
    expect(ids).toBe('878|28|18');
  });

  it('handles single genre selection', () => {
    expect(getTmdbGenreIds(['Comedy'])).toBe('35');
    expect(getTmdbGenreIds(['Animation'])).toBe('16');
    expect(getTmdbGenreIds(['Documentary'])).toBe('99');
  });

  it('resolves primary genre from TMDB genre_ids array', () => {
    expect(resolveTmdbGenre([878, 28])).toBe('Sci-Fi');
    expect(resolveTmdbGenre([18])).toBe('Drama');
    expect(resolveTmdbGenre([9999, 35])).toBe('Comedy');
    expect(resolveTmdbGenre([])).toBe('Drama'); // Default fallback
  });
});
