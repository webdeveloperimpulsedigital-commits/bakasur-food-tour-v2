import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await Promise.resolve(context.params);
    const restId = parseInt(params.id, 10);
    if (isNaN(restId)) {
      return NextResponse.json({ success: false, error: 'Invalid restaurant id' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';

    const dishes = await db.getDishesByRestaurant(restId, { search: query });

    return NextResponse.json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search dishes';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
