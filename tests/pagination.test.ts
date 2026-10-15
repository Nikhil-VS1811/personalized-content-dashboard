import { describe, it, expect } from 'vitest';

describe('Pagination Deduplication & Bounds Logic', () => {
  it('deduplicates appended page items by ID without losing unique items', () => {
    const existing = [
      { id: 'news-1', title: 'First article' },
      { id: 'news-2', title: 'Second article' },
    ];

    const nextPage = [
      { id: 'news-2', title: 'Second article duplicate' },
      { id: 'news-3', title: 'Third article unique' },
    ];

    const existingIds = new Set(existing.map((i) => i.id));
    const newUnique = nextPage.filter((i) => !existingIds.has(i.id));
    const combined = [...existing, ...newUnique];

    expect(combined).toHaveLength(3);
    expect(combined.map((i) => i.id)).toEqual(['news-1', 'news-2', 'news-3']);
  });

  it('correctly calculates hasMore flag based on totalPages', () => {
    const checkHasMore = (page: number, totalPages: number) => page < totalPages;

    expect(checkHasMore(1, 5)).toBe(true);
    expect(checkHasMore(4, 5)).toBe(true);
    expect(checkHasMore(5, 5)).toBe(false);
    expect(checkHasMore(6, 5)).toBe(false);
  });
});
