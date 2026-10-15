import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/preferences';
import { NewsCategory, MovieGenre } from '@/types/content';

interface PreferencesState {
  preferences: UserPreferences;
  isHydrated: boolean;
}

const initialState: PreferencesState = {
  preferences: DEFAULT_PREFERENCES,
  isHydrated: false,
};

const STORAGE_KEY = 'content_dashboard_preferences_v1';

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleNewsCategory: (state, action: PayloadAction<NewsCategory>) => {
      const category = action.payload;
      const current = state.preferences.selectedNewsCategories;
      if (current.includes(category)) {
        // Keep at least one category selected
        if (current.length > 1) {
          state.preferences.selectedNewsCategories = current.filter((c) => c !== category);
        }
      } else {
        state.preferences.selectedNewsCategories.push(category);
      }
      persistPreferences(state.preferences);
    },
    toggleMovieGenre: (state, action: PayloadAction<MovieGenre>) => {
      const genre = action.payload;
      const current = state.preferences.selectedMovieGenres;
      if (current.includes(genre)) {
        // Keep at least one genre selected
        if (current.length > 1) {
          state.preferences.selectedMovieGenres = current.filter((g) => g !== genre);
        }
      } else {
        state.preferences.selectedMovieGenres.push(genre);
      }
      persistPreferences(state.preferences);
    },
    toggleContentTypeFilter: (
      state,
      action: PayloadAction<'showNews' | 'showMovies' | 'showSocial'>
    ) => {
      const key = action.payload;
      state.preferences.contentFilters[key] = !state.preferences.contentFilters[key];
      persistPreferences(state.preferences);
    },
    toggleCompactView: (state) => {
      state.preferences.compactView = !state.preferences.compactView;
      persistPreferences(state.preferences);
    },
    resetPreferences: (state) => {
      state.preferences = DEFAULT_PREFERENCES;
      persistPreferences(state.preferences);
    },
    hydratePreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
      state.isHydrated = true;
    },
    markPreferencesHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

function persistPreferences(prefs: UserPreferences) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save preferences to localStorage', e);
    }
  }
}

export const {
  toggleNewsCategory,
  toggleMovieGenre,
  toggleContentTypeFilter,
  toggleCompactView,
  resetPreferences,
  hydratePreferences,
  markPreferencesHydrated,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
