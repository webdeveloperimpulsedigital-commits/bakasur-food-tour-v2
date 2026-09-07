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

    // 1. Check existing DB dishes
    let dbDishes: Dish[] = [];
    try {
      dbDishes = await db.getDishesByRestaurant(restId);
    } catch {
      dbDishes = [];
    }

    // 2. Fetch restaurant profile (from DB or query params)
    let restInfo = await db.getRestaurantById(restId);
    if (!restInfo) {
      restInfo = {
        id: restId,
        name: restName || 'Iconic Food Joint',
        area: restArea || 'Local Adda',
        city: restCity || 'Pune',
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
    } else if (restName && (!restInfo.name || restInfo.name === 'Local Hotel')) {
      restInfo.name = restName;
    }

    // 3. Generate dynamic live menu based on hotel cuisine & specialty
    const liveDishes = generateLiveMenuForRestaurant(restInfo);

    // 4. Merge DB dishes + Live Dishes seamlessly (deduped by dish name)
    const seenNames = new Set<string>();
    const finalDishes: Dish[] = [];

    for (const d of [...dbDishes, ...liveDishes]) {
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
