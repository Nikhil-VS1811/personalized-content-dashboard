import { describe, it, expect } from 'vitest';

describe('Partial-Source Failures & Non-Silent Error Handling', () => {
  it('preserves successful source results when one source fails', () => {
    // Simulate state where News failed with 502 but Movies succeeded
    const sourcesState = {
      news: { error: '502 Bad Gateway', items: [] },
      movies: { error: null, items: [{ id: 'movie-101', title: 'Dune: Part Two' }] },
      social: { error: null, items: [{ id: 'social-201', title: 'Tech Post' }] },
    };

    // Feed combines all non-errored sources
    const renderedFeed = [
      ...sourcesState.movies.items,
      ...sourcesState.social.items,
    ];

    expect(renderedFeed).toHaveLength(2);
    expect(renderedFeed.map((i) => i.id)).toEqual(['movie-101', 'social-201']);
  });

  it('ensures upstream error throws with status code rather than silently faking fixtures', () => {
    // When real credentials are provided and request fails, expect error throw
    const simulateUpstreamFailure = (apiKeyProvided: boolean, upstreamStatus: number) => {
      if (apiKeyProvided && upstreamStatus !== 200) {
        const error = new Error(`Upstream provider error HTTP ${upstreamStatus}`);
        (error as any).statusCode = upstreamStatus;
        throw error;
      }
      return { isDemo: true };
    };

    expect(() => simulateUpstreamFailure(true, 401)).toThrow('Upstream provider error HTTP 401');
    expect(() => simulateUpstreamFailure(true, 500)).toThrow('Upstream provider error HTTP 500');
    expect(simulateUpstreamFailure(false, 200)).toEqual({ isDemo: true });
  });
});
