import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, name, mobile, email, city, restaurant_id, dish_id, consent, terms_accepted } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }
    if (!mobile?.trim() || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
    }
    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ success: false, error: 'City is required' }, { status: 400 });
    }
    if (!terms_accepted) {
      return NextResponse.json({ success: false, error: 'Please accept campaign terms and conditions' }, { status: 400 });
    }

    // Lookup restaurant and dish names for participation pass
    let restaurantName = body.restaurant_name || "Local Food Spot";
    let dishName = body.dish_name || "Signature Specialty";
    let restLat = body.latitude ? parseFloat(body.latitude) : 18.5204;
    let restLng = body.longitude ? parseFloat(body.longitude) : 73.8407;

    if (restaurant_id && (!body.restaurant_name || restaurantName === 'Local Food Spot')) {
      const rest = await db.getRestaurantById(parseInt(restaurant_id, 10));
      if (rest) {
        restaurantName = rest.name;
        restLat = rest.latitude;
        restLng = rest.longitude;
      }
    }

    if (dish_id && (!body.dish_name || dishName === 'Signature Specialty')) {
      const d = await db.getDishById(parseInt(dish_id, 10));
      if (d) {
        dishName = d.name;
      }
    }

    const participant = await db.createParticipant({
      session_id: session_id || `sess_${Date.now()}`,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      restaurant_name: restaurantName,
      dish_name: dishName,
      consent: consent ? 1 : 0,
      terms_accepted: 1
    });

    // Record visit on global map
    if (restaurant_id) {
      await db.recordVisit({
        session_id: participant.session_id,
        restaurant_id: parseInt(restaurant_id, 10),
        dish_id: dish_id ? parseInt(dish_id, 10) : null,
        city: city.trim(),
        latitude: restLat,
        longitude: restLng
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        participation_id: participant.participation_id,
        participant,
        message: "Congratulations! You have completed Bakasur Ka Food Tour and your contest participation is confirmed!"
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Participation submission failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
