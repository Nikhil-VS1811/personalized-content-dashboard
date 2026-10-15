import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isHydrated: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  isHydrated: false,
};

const STORAGE_KEY = 'content_dashboard_theme_v1';

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, action.payload);
          if (action.payload === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {
          console.warn('Failed to save theme to localStorage', e);
        }
      }
    },
    toggleTheme: (state) => {
      const nextMode: ThemeMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = nextMode;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, nextMode);
          if (nextMode === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {
          console.warn('Failed to save theme to localStorage', e);
        }
      }
    },
    hydrateTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isHydrated = true;
    },
    markThemeHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

export const { setTheme, toggleTheme, hydrateTheme, markThemeHydrated } = themeSlice.actions;

export default themeSlice.reducer;
