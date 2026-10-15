import { NewsItem, MovieItem, SocialItem, NewsCategory, MovieGenre } from '@/types/content';
import { resolveTmdbGenre } from './genreMap';

const FALLBACK_NEWS_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
const FALLBACK_MOVIE_IMAGE =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

/**
 * Normalizes an external NewsAPI article into the standardized NewsItem model.
 * Produces stable, source-prefixed IDs (e.g. news-hash or news-url).
 */
export function normalizeNewsArticle(
  article: any,
  fallbackCategory: NewsCategory = 'Technology',
  index: number = 0
): NewsItem | null {
  if (!article || (!article.title && !article.description)) {
    return null;
  }

  // Derive stable ID from url or title
  const rawId = article.url
    ? article.url.replace(/[^a-zA-Z0-9]/g, '').slice(-32)
    : `art-${index}-${Date.now()}`;
  const id = `news-${rawId || index}`;

  const cleanTitle = (article.title || 'Untitled Article')
    .replace(/ - [^-]+$/, '') // Clean trailing source suffix if present
    .trim();

  // Estimate read time based on word count of title + description + content
  const fullText = `${article.title || ''} ${article.description || ''} ${article.content || ''}`;
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(2, Math.min(15, Math.ceil(wordCount / 100)));

  // Relative or clean date
  let createdAt = 'Recent update';
  if (article.publishedAt) {
    try {
      const date = new Date(article.publishedAt);
      if (!isNaN(date.getTime())) {
        const diffMs = Date.now() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 1) {
          createdAt = 'Just now';
        } else if (diffHours < 24) {
          createdAt = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
          const diffDays = Math.floor(diffHours / 24);
          createdAt = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
      }
    } catch {
      createdAt = 'Recent update';
    }
  }

  const tags: string[] = [fallbackCategory];
  if (article.source?.name) tags.push(article.source.name.replace(/\s+/g, ''));

  return {
    id,
    type: 'news',
    category: fallbackCategory,
    title: cleanTitle,
    description:
      article.description ||
      article.content ||
      'No summary provided by the publisher for this reporting piece.',
    imageUrl: article.urlToImage || FALLBACK_NEWS_IMAGE,
    source: article.source?.name || 'Global News Desk',
    author: article.author || article.source?.name || 'Staff Reporter',
    readTimeMinutes,
    createdAt,
    tags,
    sourceUrl: article.url || undefined,
    isTrending: index < 2,
    trendingRank: index < 2 ? index + 1 : undefined,
  };
}

/**
 * Normalizes a TMDB movie result into the standardized MovieItem model.
 * Produces stable source-prefixed IDs: `movie-${tmdbId}`.
 */
export function normalizeTmdbMovie(movie: any, index: number = 0): MovieItem | null {
  if (!movie || (!movie.id && !movie.title)) {
    return null;
  }

  const id = `movie-${movie.id}`;
  const genre = resolveTmdbGenre(movie.genre_ids);

  let releaseYear = new Date().getFullYear();
  if (movie.release_date) {
    const year = parseInt(movie.release_date.split('-')[0], 10);
    if (!isNaN(year)) releaseYear = year;
  }

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : FALLBACK_MOVIE_IMAGE;

  const rating = typeof movie.vote_average === 'number' ? Math.round(movie.vote_average * 10) / 10 : 7.5;

  return {
    id,
    type: 'movie',
    genre,
    title: movie.title || movie.original_title || 'Untitled Feature',
    description:
      movie.overview ||
      'No synopsis currently provided for this theatrical release entry.',
    imageUrl,
    source: 'TMDB Cinephile Index',
    createdAt: `${releaseYear} Release`,
    tags: [genre, `${releaseYear}`, 'Cinema'],
    isTrending: index < 3,
    trendingRank: index < 3 ? index + 2 : undefined,
    rating,
    releaseYear,
    director: movie.director || undefined,
    duration: movie.runtime ? `${movie.runtime} min` : undefined,
    synopsis: movie.overview || 'Detailed overview pending verification.',
    cast: Array.isArray(movie.cast) && movie.cast.length > 0 ? movie.cast : undefined,
    streamingNotice:
      'Informational recommendation only. Streaming playback and video hosting are not provided on this dashboard.',
  };
}

/**
 * Normalizes a mock social post item.
 */
export function normalizeSocialPost(post: any, index: number = 0): SocialItem {
  const cleanId = String(post.id || index).replace(/^social-/, '');
  return {
    id: `social-${cleanId}`,
    type: 'social',
    platform: post.platform || 'Twitter / X',
    title: post.title || 'Community Insight',
    description: post.description || '',
    imageUrl: post.imageUrl || '',
    source: post.source || 'Social Feed',
    createdAt: post.createdAt || 'Recent',
    tags: post.tags || ['Community'],
    isTrending: post.isTrending ?? false,
    trendingRank: post.trendingRank,
    handle: post.handle || '@contributor',
    authorName: post.authorName || 'Community Member',
    authorAvatar:
      post.authorAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likesCount: post.likesCount || 0,
    sharesCount: post.sharesCount || 0,
    commentsCount: post.commentsCount || 0,
  };
}
