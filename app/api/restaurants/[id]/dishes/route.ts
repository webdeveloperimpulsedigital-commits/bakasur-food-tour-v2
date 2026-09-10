import { NextResponse } from 'next/server';
import { db, Dish } from '@/lib/db';
import { generateLiveMenuForRestaurant } from '@/lib/liveMenu';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await Promise.resolve(context.params);
    const restId = parseInt(params.id, 10);
    const { searchParams } = new URL(request.url);
    const restName = searchParams.get('name') || '';
    const restArea = searchParams.get('area') || '';
    const restCity = searchParams.get('city') || '';

    if (isNaN(restId)) {
      return NextResponse.json({ success: false, error: 'Invalid restaurant id' }, { status: 400 });
    }

    // 1. Fetch restaurant profile (from DB or query params)
    let restInfo = await db.getRestaurantById(restId);
    const requestedName = (restName || '').trim();
    const isExactDbMatch = Boolean(
      restInfo && requestedName && restInfo.name.toLowerCase().trim() === requestedName.toLowerCase()
    );

    let dbDishes: Dish[] = [];
    if (isExactDbMatch) {
      try {
        dbDishes = await db.getDishesByRestaurant(restId);
      } catch {
        dbDishes = [];
      }
    }

    if (!restInfo || !isExactDbMatch) {
      restInfo = {
        id: restId,
        name: requestedName || restInfo?.name || 'Iconic Food Joint',
        area: restArea || restInfo?.area || 'Local Area',
        city: restCity || restInfo?.city || 'Pune',
        description: 'Authentic culinary specialty & live menu',
        address: `${restArea ? restArea + ', ' : ''}${restCity || 'Pune'}`,
        latitude: 18.5204,
        longitude: 73.8407,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        is_campaign_active: 1,
        total_visits: 1200,
        status: 'active'
      };
    }

    // 2. Generate accurate live menu specifically tailored to this restaurant's identity & cuisine
    const liveDishes = generateLiveMenuForRestaurant(restInfo);

    // 3. Merge dishes seamlessly (deduped by dish name, keeping all live items)
    const seenNames = new Set<string>();
    const finalDishes: Dish[] = [];

    const sourceList = [...dbDishes, ...liveDishes];
    for (const d of sourceList) {
      const cleanName = d.name.toLowerCase().trim();
      if (!seenNames.has(cleanName)) {
        seenNames.add(cleanName);
        finalDishes.push(d);
      }
    }

    return NextResponse.json({
      success: true,
      count: finalDishes.length,
      data: finalDishes
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dishes';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
