'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import {
  hydrateFavoritesPayload,
  hydrateFavorites,
  markFavoritesHydrated,
} from '@/store/slices/favoritesSlice';
import { hydratePreferences, markPreferencesHydrated } from '@/store/slices/preferencesSlice';
import { hydrateTheme, markThemeHydrated, ThemeMode } from '@/store/slices/themeSlice';
import { hydrateFeedOrder, markFeedOrderHydrated } from '@/store/slices/feedOrderSlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (!storeRef.current) return;
    const store = storeRef.current;

    // 1. Safely hydrate favorites (v2 with full objects or fallback v1 array)
    try {
      const storedFavoritesV2 = localStorage.getItem('content_dashboard_favorites_v2');
      if (storedFavoritesV2) {
        const parsed = JSON.parse(storedFavoritesV2);
        if (parsed && Array.isArray(parsed.favoriteIds)) {
          store.dispatch(hydrateFavoritesPayload(parsed));
        } else {
          store.dispatch(markFavoritesHydrated());
        }
      } else {
        const storedFavoritesV1 = localStorage.getItem('content_dashboard_favorites_v1');
        if (storedFavoritesV1) {
          const parsed = JSON.parse(storedFavoritesV1);
          if (Array.isArray(parsed)) {
            store.dispatch(hydrateFavorites(parsed));
          } else {
            store.dispatch(markFavoritesHydrated());
          }
        } else {
          store.dispatch(markFavoritesHydrated());
        }
      }
    } catch {
      store.dispatch(markFavoritesHydrated());
    }

    // 2. Safely hydrate preferences
    try {
      const storedPrefs = localStorage.getItem('content_dashboard_preferences_v1');
      if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs);
        if (parsed && typeof parsed === 'object') {
          store.dispatch(hydratePreferences(parsed));
        } else {
          store.dispatch(markPreferencesHydrated());
        }
      } else {
        store.dispatch(markPreferencesHydrated());
      }
    } catch {
      store.dispatch(markPreferencesHydrated());
    }

    // 3. Safely hydrate theme
    try {
      const storedTheme = localStorage.getItem('content_dashboard_theme_v1') as ThemeMode | null;
      if (storedTheme === 'dark' || storedTheme === 'light') {
        store.dispatch(hydrateTheme(storedTheme));
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: ThemeMode = prefersDark ? 'dark' : 'light';
        store.dispatch(hydrateTheme(initialTheme));
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    } catch {
      store.dispatch(markThemeHydrated());
    }

    // 4. Safely hydrate custom feed card order
    try {
      const storedOrder = localStorage.getItem('content_dashboard_feed_order_v1');
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);
        if (Array.isArray(parsed)) {
          store.dispatch(hydrateFeedOrder(parsed));
        } else {
          store.dispatch(markFeedOrderHydrated());
        }
      } else {
        store.dispatch(markFeedOrderHydrated());
      }
    } catch {
      store.dispatch(markFeedOrderHydrated());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
