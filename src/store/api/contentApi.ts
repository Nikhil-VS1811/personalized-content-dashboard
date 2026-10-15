import { baseApi } from './emptyApi';
import { PaginatedSourceResponse } from '@/types/api';
import { NewsItem, MovieItem, SocialItem } from '@/types/content';

export interface NewsQueryArgs {
  categories?: string[];
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface MoviesQueryArgs {
  genres?: string[];
  query?: string;
  mode?: 'discover' | 'trending';
  page?: number;
  pageSize?: number;
}

export interface SocialQueryArgs {
  query?: string;
  page?: number;
  pageSize?: number;
}

export const contentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<PaginatedSourceResponse<NewsItem>, NewsQueryArgs>({
      query: ({ categories = [], query = '', page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams();
        if (categories.length > 0) params.set('categories', categories.join(','));
        if (query.trim()) params.set('query', query.trim());
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());
        return `/news?${params.toString()}`;
      },
      providesTags: (result) =>
        result ? [{ type: 'News' as const, id: 'LIST' }] : ['News'],
    }),

    getMovies: builder.query<PaginatedSourceResponse<MovieItem>, MoviesQueryArgs>({
      query: ({ genres = [], query = '', mode = 'discover', page = 1, pageSize = 20 }) => {
        const params = new URLSearchParams();
        if (genres.length > 0) params.set('genres', genres.join(','));
        if (query.trim()) params.set('query', query.trim());
        if (mode) params.set('mode', mode);
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());
        return `/movies?${params.toString()}`;
      },
      providesTags: (result) =>
        result ? [{ type: 'Movies' as const, id: 'LIST' }] : ['Movies'],
    }),

    getTrendingMovies: builder.query<PaginatedSourceResponse<MovieItem>, { page?: number }>({
      query: ({ page = 1 } = {}) => `/movies?mode=trending&page=${page}`,
      providesTags: [{ type: 'Movies', id: 'TRENDING' }],
    }),

    getSocial: builder.query<PaginatedSourceResponse<SocialItem>, SocialQueryArgs>({
      query: ({ query = '', page = 1, pageSize = 5 } = {}) => {
        const params = new URLSearchParams();
        if (query.trim()) params.set('query', query.trim());
        params.set('page', page.toString());
        params.set('pageSize', pageSize.toString());
        return `/social?${params.toString()}`;
      },
      providesTags: (result) =>
        result ? [{ type: 'Social' as const, id: 'LIST' }] : ['Social'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNewsQuery,
  useLazyGetNewsQuery,
  useGetMoviesQuery,
  useLazyGetMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetSocialQuery,
  useLazyGetSocialQuery,
} = contentApi;
