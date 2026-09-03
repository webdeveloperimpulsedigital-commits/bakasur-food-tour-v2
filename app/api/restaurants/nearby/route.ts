import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('latitude') || searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('longitude') || searchParams.get('lng') || '');
    const city = searchParams.get('city') || '';
    const area = searchParams.get('area') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const allRestaurants = await db.getRestaurants({
      city: city || undefined,
      area: area && area !== 'All' && area !== 'All Areas' ? area : undefined
    });

    let results = allRestaurants.map(r => {
      let distanceKm: number | null = null;
      if (!isNaN(lat) && !isNaN(lng)) {
        distanceKm = Math.round(calculateDistance(lat, lng, r.latitude, r.longitude) * 10) / 10;
      }
      return {
        ...r,
        distanceKm: distanceKm ?? 1.2
      };
    });

    if (!isNaN(lat) && !isNaN(lng)) {
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      results.sort((a, b) => b.rating - a.rating || (b.total_visits || 0) - (a.total_visits || 0));
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results.slice(0, limit)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch nearby restaurants';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
