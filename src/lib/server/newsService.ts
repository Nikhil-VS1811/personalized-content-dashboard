import { NewsItem, NewsCategory } from '@/types/content';
import { PaginatedSourceResponse } from '@/types/api';
import { normalizeNewsArticle } from './normalizers';
import { DEMO_NEWS_ITEMS } from '@/fixtures/newsData';

const NEWS_API_BASE = 'https://newsapi.org/v2';

// Map app categories to NewsAPI top-headlines category identifiers
const NEWS_CATEGORY_TO_API_MAP: Record<NewsCategory, string> = {
  Technology: 'technology',
  Business: 'business',
  Science: 'science',
  Health: 'health',
  Design: 'general', // NewsAPI doesn't have a 'design' category, general or query 'design' is used
};

interface FetchNewsOptions {
  categories?: NewsCategory[];
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchNewsService({
  categories = ['Technology'],
  query = '',
  page = 1,
  pageSize = 10,
}: FetchNewsOptions): Promise<PaginatedSourceResponse<NewsItem>> {
  const apiKey = process.env.NEWS_API_KEY?.trim();
  const isDemoExplicit = process.env.DEMO_MODE === 'true';

  // Demo fallback mode when credentials are missing or demo mode is forced
  if (!apiKey || apiKey === 'your_news_api_key_here' || isDemoExplicit) {
    const demoReason = !apiKey || apiKey === 'your_news_api_key_here'
      ? 'No NEWS_API_KEY configured in environment'
      : 'DEMO_MODE explicitly enabled';

    let filtered = DEMO_NEWS_ITEMS;
    if (categories.length > 0) {
      filtered = filtered.filter((item) => categories.includes(item.category));
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const startIdx = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);
    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / pageSize) || 1;

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalResults,
      totalPages,
      hasMore: page < totalPages,
      isDemo: true,
      demoReason,
      source: 'news',
    };
  }

  // Live upstream API request using validated credentials
  const primaryCategory = categories[0] || 'Technology';
  const apiCategory = NEWS_CATEGORY_TO_API_MAP[primaryCategory] || 'technology';

  let url = '';
  if (query.trim()) {
    url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(
      query.trim()
    )}&page=${page}&pageSize=${pageSize}&sortBy=publishedAt`;
  } else {
    url = `${NEWS_API_BASE}/top-headlines?category=${apiCategory}&language=en&page=${page}&pageSize=${pageSize}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey,
        'User-Agent': 'PulseDash-Frontend-Assignment/1.0',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetails = `News upstream error HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.message) errorDetails = errorJson.message;
      } catch {
        // noop
      }
      const err = new Error(errorDetails);
      (err as any).statusCode = response.status;
      throw err;
    }

    const data = await response.json();
    if (data.status !== 'ok' || !Array.isArray(data.articles)) {
      throw new Error(data.message || 'Malformed response from News provider');
    }

    const items: NewsItem[] = data.articles
      .map((art: any, idx: number) => normalizeNewsArticle(art, primaryCategory, idx))
      .filter((item: NewsItem | null): item is NewsItem => item !== null);

    const totalResults = Math.min(data.totalResults || items.length, 100); // NewsAPI free tier limits to first 100
    const totalPages = Math.ceil(totalResults / pageSize) || 1;

    return {
      items,
      page,
      pageSize,
      totalResults,
      totalPages,
      hasMore: page < totalPages,
      isDemo: false,
      source: 'news',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('NewsAPI upstream request timed out after 8 seconds');
      (timeoutErr as any).statusCode = 504;
      throw timeoutErr;
    }
    throw error;
  }
}
