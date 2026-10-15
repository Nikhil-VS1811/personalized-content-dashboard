import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types/content';
import { DEMO_NEWS_ITEMS } from '@/fixtures/newsData';
import { DEMO_MOVIE_ITEMS } from '@/fixtures/moviesData';

interface FavoritesState {
  favoriteIds: string[];
  savedItems: Record<string, ContentItem>;
  isHydrated: boolean;
}

const defaultItems: Record<string, ContentItem> = {
  'news-101': DEMO_NEWS_ITEMS[0],
  'movie-201': DEMO_MOVIE_ITEMS[0],
};

const initialState: FavoritesState = {
  favoriteIds: ['news-101', 'movie-201'],
  savedItems: defaultItems,
  isHydrated: false,
};

const STORAGE_KEY = 'content_dashboard_favorites_v2';
const LEGACY_STORAGE_KEY = 'content_dashboard_favorites_v1';

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavoriteItem: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const id = item.id;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
        delete state.savedItems[id];
      } else {
        state.favoriteIds.push(id);
        state.savedItems[id] = item;
      }
      persistFavorites(state);
    },
    // Backwards compatible action for string IDs
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
        delete state.savedItems[id];
      } else {
        state.favoriteIds.push(id);
      }
      persistFavorites(state);
    },
    hydrateFavoritesPayload: (
      state,
      action: PayloadAction<{ favoriteIds: string[]; savedItems?: Record<string, ContentItem> }>
    ) => {
      state.favoriteIds = action.payload.favoriteIds || [];
      state.savedItems = {
        ...defaultItems,
        ...(action.payload.savedItems || {}),
      };
      state.isHydrated = true;
    },
    hydrateFavorites: (state, action: PayloadAction<string[]>) => {
      state.favoriteIds = action.payload;
      state.isHydrated = true;
    },
    markFavoritesHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

function persistFavorites(state: FavoritesState) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          favoriteIds: state.favoriteIds,
          savedItems: state.savedItems,
        })
      );
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage', e);
    }
  }
}

export const {
  toggleFavoriteItem,
  toggleFavorite,
  hydrateFavoritesPayload,
  hydrateFavorites,
  markFavoritesHydrated,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
