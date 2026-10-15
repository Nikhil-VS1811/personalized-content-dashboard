import { NextRequest, NextResponse } from 'next/server';
import { fetchSocialService } from '@/lib/server/socialService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(
      20,
      Math.max(1, parseInt(searchParams.get('pageSize') || '5', 10) || 5)
    );
    const query = searchParams.get('query') || '';

    const result = await fetchSocialService({
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
    return NextResponse.json(
      {
        error: 'Failed to fetch mock social stream',
        details: error.message || 'Social mock service error',
        statusCode: 500,
        source: 'social',
      },
      { status: 500 }
    );
  }
}
