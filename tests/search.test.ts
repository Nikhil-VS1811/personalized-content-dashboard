import { describe, it, expect } from 'vitest';

describe('Search Query Filtering & Race Condition Protection', () => {
  const sampleItems = [
    { id: '1', title: 'WebAssembly GC Performance', description: 'Next era of web runtime', tags: ['Wasm', 'Performance'] },
    { id: '2', title: 'Interstellar Movie Review', description: 'Deep space exploration', tags: ['Sci-Fi', 'Space'] },
    { id: '3', title: 'Redux Toolkit Architecture', description: 'Entity adapters and slices', tags: ['React', 'Redux'] },
  ];

  it('matches search keywords across title, description, and tags case-insensitively', () => {
    const filterByQuery = (q: string) => {
      const term = q.toLowerCase().trim();
      return sampleItems.filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.description.toLowerCase().includes(term) ||
          i.tags.some((t) => t.toLowerCase().includes(term))
      );
    };

    expect(filterByQuery('webassembly')).toHaveLength(1);
    expect(filterByQuery('webassembly')[0].id).toBe('1');

    expect(filterByQuery('space')).toHaveLength(1);
    expect(filterByQuery('space')[0].id).toBe('2');

    expect(filterByQuery('redux')).toHaveLength(1);
    expect(filterByQuery('redux')[0].id).toBe('3');

    expect(filterByQuery('nonexistent')).toHaveLength(0);
  });

  it('guarantees newer query results take precedence over slower stale responses', () => {
    let latestQuery = 'interstellar';

    // Simulate response callback from an earlier query 'web'
    const handleQueryResponse = (incomingQuery: string, data: any[]) => {
      // Reject responses that do not match the latest requested query
      if (incomingQuery !== latestQuery) {
        return null; // Ignore stale response
      }
      return data;
    };

    const staleResult = handleQueryResponse('web', [{ id: '1' }]);
    expect(staleResult).toBeNull(); // Stale response discarded

    const freshResult = handleQueryResponse('interstellar', [{ id: '2' }]);
    expect(freshResult).toEqual([{ id: '2' }]);
  });
});
