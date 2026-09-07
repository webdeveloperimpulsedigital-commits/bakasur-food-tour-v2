import { NextResponse } from 'next/server';
import { db, Restaurant } from '@/lib/db';
import { searchLivePlaces } from '@/lib/livePlaces';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || searchParams.get('query') || '';
    const city = searchParams.get('city') || undefined;
    const lat = parseFloat(searchParams.get('lat') || searchParams.get('latitude') || '');
    const lng = parseFloat(searchParams.get('lng') || searchParams.get('longitude') || '');

    if (!query.trim()) {
      const topDefaults = await db.getRestaurants({ city, limit: 8 });
      return NextResponse.json({ success: true, count: topDefaults.length, data: topDefaults });
    }

    // 1. Search Curated DB Spots
    const dbMatched = await db.getRestaurants({ search: query, city, limit: 12 });

    // 2. Fetch Live Real Places from OpenStreetMap Live API
    let liveSpots: Restaurant[] = [];
    try {
      liveSpots = await searchLivePlaces({
        query,
        city,
        lat: !isNaN(lat) ? lat : undefined,
        lng: !isNaN(lng) ? lng : undefined
      });
    } catch {
      liveSpots = [];
    }

    // 3. Deduplicate and merge (prioritizing DB curated spots)
    const existingNames = new Set(dbMatched.map(r => r.name.toLowerCase().trim()));
    const uniqueLiveSpots = liveSpots.filter(l => !existingNames.has(l.name.toLowerCase().trim()));

    const combined = [...dbMatched, ...uniqueLiveSpots];

    return NextResponse.json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
