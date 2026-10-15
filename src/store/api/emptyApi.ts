import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query Base API Foundation
 * 
 * Ready for Phase 2 API integrations (e.g. NewsAPI, TMDB, or custom backend).
 * Endpoints will be injected in Phase 2 using `baseApi.injectEndpoints()`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  }),
  tagTypes: ['News', 'Movies', 'Social', 'Preferences'],
  endpoints: () => ({}),
});
