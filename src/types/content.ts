/**
 * Shared Content Model (Discriminated Union)
 * 
 * Defines standardized content shapes with stable IDs.
 * Prepared for clean replacement by RTK Query endpoints in Phase 2.
 */

export type ContentType = 'news' | 'movie' | 'social';

export type NewsCategory = 'Technology' | 'Business' | 'Design' | 'Science' | 'Health';

export type MovieGenre = 'Sci-Fi' | 'Drama' | 'Action' | 'Comedy' | 'Animation' | 'Documentary';

export type SocialPlatform = 'Twitter / X' | 'LinkedIn' | 'Threads' | 'Bluesky';

interface BaseContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  createdAt: string;
  tags: string[];
  isTrending?: boolean;
  trendingRank?: number;
}

export interface NewsItem extends BaseContentItem {
  type: 'news';
  category: NewsCategory;
  readTimeMinutes: number;
  author: string;
  sourceUrl?: string;
}

export interface MovieItem extends BaseContentItem {
  type: 'movie';
  genre: MovieGenre;
  rating: number; // e.g. 8.8 / 10
  releaseYear: number;
  director?: string;
  duration?: string;
  synopsis: string;
  cast?: string[];
  streamingNotice: string; // Explains streaming is not available
}

export interface SocialItem extends BaseContentItem {
  type: 'social';
  platform: SocialPlatform;
  handle: string;
  authorName: string;
  authorAvatar: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
}

export type ContentItem = NewsItem | MovieItem | SocialItem;
