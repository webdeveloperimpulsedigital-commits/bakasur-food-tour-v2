import { Restaurant } from './db';

function pickCuisineImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('biryani') || n.includes('mutton') || n.includes('chicken') || n.includes('non veg') || n.includes('kebab') || n.includes('nihari') || n.includes('handi')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('dosa') || n.includes('idli') || n.includes('udupi') || n.includes('south') || n.includes('bhavan') || n.includes('wada') || n.includes('vada')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('khaman') || n.includes('dhokla') || n.includes('fafda') || n.includes('jalebi') || n.includes('locho') || n.includes('gujarat') || n.includes('kathiyawad') || n.includes('undhiyu')) {
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('dal baati') || n.includes('kachori') || n.includes('ghevar') || n.includes('rajasthan') || n.includes('marwar') || n.includes('chokhi dhani') || n.includes('rawat')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
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
  const { query, city = '', lat, lng } = options;
  if (!query && isNaN(lat || NaN)) return [];

  try {
    let items: NominatimItem[] = [];

    if (query && query.trim()) {
      const q = query.trim();
      
      // 1. First search EXACT user query across India (e.g. "gajanan vadapav thane", "mamledar misal thane", "anand stall vile parle")
      items = await queryNominatim(q, 8);

      // 2. If nothing found and city was provided without already being in query, try "query city"
      if (items.length === 0 && city && !q.toLowerCase().includes(city.toLowerCase())) {
        items = await queryNominatim(`${q} ${city}`, 6);
      }

      // 3. If still empty, try "hotel/restaurant query"
      if (items.length === 0 && !q.toLowerCase().includes('hotel') && !q.toLowerCase().includes('restaurant')) {
        items = await queryNominatim(`restaurant ${q}`, 6);
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

      const cityName = addr.city || addr.town || addr.municipality || addr.city_district || addr.county || addr.state_district || city || 'Local';
      const sublocality = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.road || addr.village || `${cityName}`;
      const itemLat = parseFloat(item.lat || String(lat || 19.1860));
      const itemLng = parseFloat(item.lon || String(lng || 72.9750));

      liveSpots.push({
        id: 700000 + i + Math.floor(Math.random() * 1000),
        name: cleanName,
        description: `Famous food spot in ${sublocality}, ${cityName}`,
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

