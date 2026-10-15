import { describe, it, expect } from 'vitest';
import {
  normalizeNewsArticle,
  normalizeTmdbMovie,
  normalizeSocialPost,
} from '@/lib/server/normalizers';

describe('Response Normalization & Malformed Input Handling', () => {
  describe('normalizeNewsArticle', () => {
    it('normalizes valid NewsAPI article into NewsItem model with stable source-prefixed ID', () => {
      const rawArticle = {
        title: 'Breakthrough in Quantum Computing - TechDaily',
        description: 'Engineers achieve quantum coherence at room temperature.',
        url: 'https://example.com/quantum-breakthrough',
        urlToImage: 'https://example.com/image.jpg',
        publishedAt: '2026-10-14T10:00:00Z',
        source: { id: 'tech-daily', name: 'TechDaily' },
        author: 'Dr. John Doe',
        content: 'Full article text discussing qubits...',
      };

      const result = normalizeNewsArticle(rawArticle, 'Technology', 0);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('news');
      expect(result?.id).toMatch(/^news-/);
      expect(result?.category).toBe('Technology');
      expect(result?.title).toBe('Breakthrough in Quantum Computing'); // Source suffix stripped
      expect(result?.source).toBe('TechDaily');
      expect(result?.author).toBe('Dr. John Doe');
      expect(result?.imageUrl).toBe('https://example.com/image.jpg');
      expect(result?.tags).toContain('Technology');
    });

    it('handles malformed or missing fields with reliable fallbacks', () => {
      const malformedArticle = {
        title: 'Minimal Article',
      };

      const result = normalizeNewsArticle(malformedArticle, 'Science', 2);
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Minimal Article');
      expect(result?.author).toBe('Staff Reporter');
      expect(result?.imageUrl).toContain('images.unsplash.com'); // Fallback image applied
      expect(result?.source).toBe('Global News Desk');
    });

    it('rejects completely invalid empty objects', () => {
      expect(normalizeNewsArticle(null)).toBeNull();
      expect(normalizeNewsArticle({})).toBeNull();
    });
  });

  describe('normalizeTmdbMovie', () => {
    it('normalizes TMDB movie with genre mapping and stable movie-ID', () => {
      const rawMovie = {
        id: 603,
        title: 'The Matrix',
        overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
        backdrop_path: '/7u3DUTNuqBpyyzv1g52v8sKj8Fv.jpg',
        release_date: '1999-03-31',
        genre_ids: [878, 28], // Sci-Fi (878), Action (28)
        vote_average: 8.234,
      };

      const result = normalizeTmdbMovie(rawMovie, 0);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('movie');
      expect(result?.id).toBe('movie-603');
      expect(result?.genre).toBe('Sci-Fi');
      expect(result?.releaseYear).toBe(1999);
      expect(result?.rating).toBe(8.2);
      expect(result?.imageUrl).toBe('https://image.tmdb.org/t/p/w780/7u3DUTNuqBpyyzv1g52v8sKj8Fv.jpg');
      expect(result?.streamingNotice).toContain('Streaming playback and video hosting are not provided');
    });

    it('handles fallback images and missing release dates in TMDB response', () => {
      const missingDetails = {
        id: 99999,
        title: 'Indie Documentary',
        genre_ids: [99], // Documentary
      };

      const result = normalizeTmdbMovie(missingDetails, 1);
      expect(result).not.toBeNull();
      expect(result?.genre).toBe('Documentary');
      expect(result?.imageUrl).toContain('images.unsplash.com');
      expect(result?.rating).toBe(7.5); // Default fallback
    });

    it('omits unavailable director, duration, and cast without inventing placeholders', () => {
      const tmdbDiscoverMovie = {
        id: 12345,
        title: 'Discover Movie',
        overview: 'A movie from discover endpoint without credits',
        vote_average: 7.8,
        release_date: '2025-05-01',
        genre_ids: [28],
      };

      const result = normalizeTmdbMovie(tmdbDiscoverMovie, 0);
      expect(result).not.toBeNull();
      expect(result?.director).toBeUndefined();
      expect(result?.duration).toBeUndefined();
      expect(result?.cast).toBeUndefined();

      // When details are provided, they are preserved
      const tmdbWithDetails = {
        ...tmdbDiscoverMovie,
        director: 'Greta Gerwig',
        runtime: 114,
        cast: ['Margot Robbie', 'Ryan Gosling'],
      };
      const detailedResult = normalizeTmdbMovie(tmdbWithDetails, 0);
      expect(detailedResult?.director).toBe('Greta Gerwig');
      expect(detailedResult?.duration).toBe('114 min');
      expect(detailedResult?.cast).toEqual(['Margot Robbie', 'Ryan Gosling']);
    });

    it('rejects completely empty movie objects', () => {
      expect(normalizeTmdbMovie(null)).toBeNull();
      expect(normalizeTmdbMovie({})).toBeNull();
    });
  });

  describe('normalizeSocialPost', () => {
    it('normalizes social post and retains platform and metrics', () => {
      const rawPost = {
        id: 'tw-55',
        platform: 'Twitter / X',
        description: 'Testing modern React 18 concurrent features.',
        authorName: 'Alex Rivera',
        likesCount: 150,
      };

      const result = normalizeSocialPost(rawPost, 0);
      expect(result.type).toBe('social');
      expect(result.id).toBe('social-tw-55');
      expect(result.platform).toBe('Twitter / X');
      expect(result.likesCount).toBe(150);
    });

    it('avoids double-prefixing if social post ID already starts with social-', () => {
      const alreadyPrefixed = {
        id: 'social-301',
        description: 'Post with prefix',
      };
      const result = normalizeSocialPost(alreadyPrefixed, 0);
      expect(result.id).toBe('social-301');
    });
  });
});
