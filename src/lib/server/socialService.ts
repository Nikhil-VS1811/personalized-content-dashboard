import { SocialItem } from '@/types/content';
import { PaginatedSourceResponse } from '@/types/api';
import { DEMO_SOCIAL_ITEMS } from '@/fixtures/socialData';
import { normalizeSocialPost } from './normalizers';

interface FetchSocialOptions {
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchSocialService({
  query = '',
  page = 1,
  pageSize = 5,
}: FetchSocialOptions): Promise<PaginatedSourceResponse<SocialItem>> {
  let filtered = DEMO_SOCIAL_ITEMS;

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        item.handle.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);
  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;

  const items: SocialItem[] = paginated.map((post, idx) =>
    normalizeSocialPost(post, startIdx + idx)
  );

  return {
    items,
    page,
    pageSize,
    totalResults,
    totalPages,
    hasMore: page < totalPages,
    isDemo: true,
    demoReason: 'Explicitly labeled Mock Social API Route',
    source: 'social',
  };
}
