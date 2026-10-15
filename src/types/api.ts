import { NewsItem, MovieItem, SocialItem, ContentItem } from './content';

export interface PaginatedSourceResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasMore: boolean;
  isDemo?: boolean;
  demoReason?: string;
  source: 'news' | 'movies' | 'social';
}

export interface ApiErrorResponse {
  error: string;
  statusCode: number;
  details?: string;
  source: 'news' | 'movies' | 'social';
}

export interface FeedQueryArgs {
  newsCategories?: string[];
  movieGenres?: string[];
  searchQuery?: string;
  newsPage?: number;
  moviesPage?: number;
  socialPage?: number;
}
