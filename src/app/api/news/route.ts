import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsService } from '@/lib/server/newsService';
import { NewsCategory } from '@/types/content';
import { ALL_NEWS_CATEGORIES } from '@/types/preferences';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate categories
    const categoriesParam = searchParams.get('categories') || '';
    const rawCategories = categoriesParam ? categoriesParam.split(',') : [];
    const validCategories = rawCategories.filter((c): c is NewsCategory =>
      ALL_NEWS_CATEGORIES.includes(c as NewsCategory)
    );
    const categories: NewsCategory[] =
      validCategories.length > 0 ? validCategories : ['Technology'];

    // Parse and validate pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10) || 10)
    );
    const query = searchParams.get('query') || '';

    const result = await fetchNewsService({
      categories,
      query,
      page,
      pageSize,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch news stream',
        details: error.message || 'Upstream provider request failed',
        statusCode,
        source: 'news',
      },
      { status: statusCode }
    );
  }
}
