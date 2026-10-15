import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from './slices/navigationSlice';
import favoritesReducer from './slices/favoritesSlice';
import preferencesReducer from './slices/preferencesSlice';
import themeReducer from './slices/themeSlice';
import feedOrderReducer from './slices/feedOrderSlice';
import { baseApi } from './api/emptyApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navigationReducer,
      favorites: favoritesReducer,
      preferences: preferencesReducer,
      theme: themeReducer,
      feedOrder: feedOrderReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
