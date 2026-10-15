import { describe, it, expect } from 'vitest';
import feedOrderReducer, {
  setCustomOrderIds,
  moveCardKeyboard,
  resetFeedOrder,
} from '@/store/slices/feedOrderSlice';

describe('Feed Card Reordering & Accessibility Slices', () => {
  const initial = {
    customOrderIds: [],
    lastAnnouncement: '',
    isHydrated: true,
  };

  it('updates customOrderIds when setCustomOrderIds is dispatched', () => {
    const updated = feedOrderReducer(initial, setCustomOrderIds(['card-3', 'card-1', 'card-2']));
    expect(updated.customOrderIds).toEqual(['card-3', 'card-1', 'card-2']);
  });

  it('handles keyboard move up correctly and generates assistive announcement', () => {
    const state = {
      customOrderIds: ['card-1', 'card-2', 'card-3'],
      lastAnnouncement: '',
      isHydrated: true,
    };

    const next = feedOrderReducer(
      state,
      moveCardKeyboard({
        cardId: 'card-2',
        cardTitle: 'WebAssembly Deep Dive',
        currentIndex: 1,
        targetIndex: 0,
        visibleIds: ['card-1', 'card-2', 'card-3'],
      })
    );

    expect(next.customOrderIds).toEqual(['card-2', 'card-1', 'card-3']);
    expect(next.lastAnnouncement).toBe('Moved WebAssembly Deep Dive to position 1 of 3.');
  });

  it('handles keyboard move down correctly', () => {
    const state = {
      customOrderIds: ['card-1', 'card-2', 'card-3'],
      lastAnnouncement: '',
      isHydrated: true,
    };

    const next = feedOrderReducer(
      state,
      moveCardKeyboard({
        cardId: 'card-1',
        cardTitle: 'First Card',
        currentIndex: 0,
        targetIndex: 1,
        visibleIds: ['card-1', 'card-2', 'card-3'],
      })
    );

    expect(next.customOrderIds).toEqual(['card-2', 'card-1', 'card-3']);
    expect(next.lastAnnouncement).toBe('Moved First Card to position 2 of 3.');
  });

  it('resets custom order and produces a reset announcement', () => {
    const state = {
      customOrderIds: ['card-2', 'card-1'],
      lastAnnouncement: 'Something moved',
      isHydrated: true,
    };

    const reset = feedOrderReducer(state, resetFeedOrder());
    expect(reset.customOrderIds).toEqual([]);
    expect(reset.lastAnnouncement).toContain('reset');
  });

  it('ignores invalid keyboard move bounds', () => {
    const state = {
      customOrderIds: ['card-1', 'card-2'],
      lastAnnouncement: '',
      isHydrated: true,
    };

    const outOfBounds = feedOrderReducer(
      state,
      moveCardKeyboard({
        cardId: 'card-1',
        cardTitle: 'First Card',
        currentIndex: 0,
        targetIndex: -1,
        visibleIds: ['card-1', 'card-2'],
      })
    );

    expect(outOfBounds.customOrderIds).toEqual(['card-1', 'card-2']);
  });
});
