import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const city = searchParams.get('city') || undefined;

    if (!query.trim()) {
      const topDefaults = await db.getRestaurants({ city, limit: 5 });
      return NextResponse.json({ success: true, count: topDefaults.length, data: topDefaults });
    }

    const matched = await db.getRestaurants({ search: query, city, limit: 10 });

    return NextResponse.json({
      success: true,
      count: matched.length,
      data: matched
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
