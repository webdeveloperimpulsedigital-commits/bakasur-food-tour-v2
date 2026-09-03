import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mapPoints = await db.getMapData();
    const totalCampaignVisits = mapPoints.reduce((sum, p) => sum + (p.total_visits || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        totalCampaignVisits,
        totalRestaurants: mapPoints.length,
        points: mapPoints
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch map data';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
