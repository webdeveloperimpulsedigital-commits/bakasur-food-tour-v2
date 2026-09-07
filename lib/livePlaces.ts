import { Restaurant } from './db';

function pickCuisineImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('biryani') || n.includes('mutton') || n.includes('chicken') || n.includes('non veg') || n.includes('kebab') || n.includes('nihari') || n.includes('handi')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('dosa') || n.includes('idli') || n.includes('udupi') || n.includes('south') || n.includes('bhavan') || n.includes('wada') || n.includes('vada')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('misal') || n.includes('katakirr') || n.includes('maratha') || n.includes('kolhapuri') || n.includes('bedekar')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('cafe') || n.includes('bakery') || n.includes('coffee') || n.includes('chai') || n.includes('tea') || n.includes('irani')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('fish') || n.includes('seafood') || n.includes('malvan') || n.includes('surmai') || n.includes('prawns')) {
    return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('pav bhaji') || n.includes('bhel') || n.includes('chaat') || n.includes('sweets') || n.includes('snack') || n.includes('spdp')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('chinese') || n.includes('noodle') || n.includes('momos') || n.includes('pizza') || n.includes('burger')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
}

interface NominatimItem {
  place_id?: number | string;
  name?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    road?: string;
    quarter?: string;
    residential?: string;
    city?: string;
    town?: string;
    state?: string;
  };
}

async function queryNominatim(searchQuery: string, limit = 8): Promise<NominatimItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=in&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BakasurFoodTourApp/2.0 (foodtour@campaign.local)'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = (await res.json()) as NominatimItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function searchLivePlaces(options: {
  query?: string;
  city?: string;
  lat?: number;
  lng?: number;
}): Promise<Restaurant[]> {
  const { query, city = 'Pune', lat, lng } = options;
  if (!query && isNaN(lat || NaN)) return [];

  try {
    let items: NominatimItem[] = [];

    if (query && query.trim()) {
      const q = query.trim();
      // Try primary search: "query city"
      items = await queryNominatim(`${q} ${city}`, 6);

      // If empty and user didn't write city in query, try "query restaurant city"
      if (items.length === 0 && !q.toLowerCase().includes('hotel') && !q.toLowerCase().includes('restaurant')) {
        items = await queryNominatim(`hotel ${q} ${city}`, 6);
      }

      // If still empty, try just "query"
      if (items.length === 0) {
        items = await queryNominatim(q, 4);
      }
    } else if (!isNaN(lat || NaN) && !isNaN(lng || NaN)) {
      items = await queryNominatim(`restaurant near ${lat},${lng}`, 6);
    }

    if (!items || items.length === 0) return [];

    const liveSpots: Restaurant[] = [];
    const seenNames = new Set<string>();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const addr = item.address || {};
      const rawName = item.name || item.display_name?.split(',')[0] || query || 'Local Hotel';
      const cleanName = rawName.length > 50 ? rawName.slice(0, 48) + '...' : rawName;
      const lower = cleanName.toLowerCase();

      if (seenNames.has(lower)) continue;
      seenNames.add(lower);

      const sublocality = addr.suburb || addr.neighbourhood || addr.road || addr.quarter || addr.residential || `${city} Area`;
      const cityName = addr.city || addr.town || city;
      const itemLat = parseFloat(item.lat || String(lat || 18.5204));
      const itemLng = parseFloat(item.lon || String(lng || 73.8407));

      liveSpots.push({
        id: 700000 + i + Math.floor(Math.random() * 1000),
        name: cleanName,
        description: `Live culinary spot in ${sublocality}, ${cityName}`,
        address: `${sublocality}, ${cityName}`,
        area: sublocality,
        city: cityName,
        latitude: itemLat,
        longitude: itemLng,
        rating: Math.round((4.6 + Math.random() * 0.3) * 10) / 10,
        image: pickCuisineImage(cleanName),
        is_campaign_active: 1,
        total_visits: Math.floor(800 + Math.random() * 1200),
        status: 'active' as const
      });
    }

    return liveSpots;
  } catch {
    return [];
  }
}
