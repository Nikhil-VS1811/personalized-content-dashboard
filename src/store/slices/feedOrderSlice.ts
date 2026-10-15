import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FeedOrderState {
  customOrderIds: string[];
  lastAnnouncement: string;
  isHydrated: boolean;
}

const initialState: FeedOrderState = {
  customOrderIds: [],
  lastAnnouncement: '',
  isHydrated: false,
};

const STORAGE_KEY = 'content_dashboard_feed_order_v1';

export const feedOrderSlice = createSlice({
  name: 'feedOrder',
  initialState,
  reducers: {
    setCustomOrderIds: (state, action: PayloadAction<string[]>) => {
      state.customOrderIds = action.payload;
      persistFeedOrder(state.customOrderIds);
    },
    moveCardKeyboard: (
      state,
      action: PayloadAction<{
        cardId: string;
        cardTitle: string;
        currentIndex: number;
        targetIndex: number;
        visibleIds: string[];
      }>
    ) => {
      const { cardId, cardTitle, currentIndex, targetIndex, visibleIds } = action.payload;
      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        currentIndex >= visibleIds.length ||
        targetIndex >= visibleIds.length ||
        currentIndex === targetIndex
      ) {
        return;
      }

      // Reorder the visible IDs array
      const updatedVisible = [...visibleIds];
      const [movedId] = updatedVisible.splice(currentIndex, 1);
      updatedVisible.splice(targetIndex, 0, movedId);

      // Merge into customOrderIds preserving any unseen/filtered IDs
      const remainingCustom = state.customOrderIds.filter((id) => !visibleIds.includes(id));
      state.customOrderIds = [...updatedVisible, ...remainingCustom];

      // Screen reader announcement
      state.lastAnnouncement = `Moved ${cardTitle} to position ${targetIndex + 1} of ${visibleIds.length}.`;

      persistFeedOrder(state.customOrderIds);
    },
    resetFeedOrder: (state) => {
      state.customOrderIds = [];
      state.lastAnnouncement = 'Feed card order has been reset to default.';
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn('Failed to clear feed order from localStorage', e);
        }
      }
    },
    hydrateFeedOrder: (state, action: PayloadAction<string[]>) => {
      state.customOrderIds = action.payload;
      state.isHydrated = true;
    },
    markFeedOrderHydrated: (state) => {
      state.isHydrated = true;
    },
  },
});

function persistFeedOrder(ids: string[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to persist feed order to localStorage', e);
    }
  }
}

export const {
  setCustomOrderIds,
  moveCardKeyboard,
  resetFeedOrder,
  hydrateFeedOrder,
  markFeedOrderHydrated,
} = feedOrderSlice.actions;

export default feedOrderSlice.reducer;
