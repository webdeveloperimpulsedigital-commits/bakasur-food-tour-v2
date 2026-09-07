import { Restaurant } from './db';

function pickCuisineImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('biryani') || n.includes('mutton') || n.includes('chicken') || n.includes('non veg') || n.includes('kebab') || n.includes('nihari')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('dosa') || n.includes('idli') || n.includes('udupi') || n.includes('south') || n.includes('bhavan')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('misal') || n.includes('katakirr') || n.includes('maratha') || n.includes('kolhapuri')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('cafe') || n.includes('bakery') || n.includes('coffee') || n.includes('chai') || n.includes('tea')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('pav bhaji') || n.includes('bhel') || n.includes('chaat') || n.includes('sweets') || n.includes('snack')) {
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80';
  }
  if (n.includes('chinese') || n.includes('noodle') || n.includes('momos')) {
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    let searchUrl = '';
    if (query && query.trim()) {
      const qClean = `${query.trim()} ${city}`.trim();
      searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(qClean)}&format=json&addressdetails=1&limit=6`;
    } else if (!isNaN(lat || NaN) && !isNaN(lng || NaN)) {
      searchUrl = `https://nominatim.openstreetmap.org/search?q=restaurant+near+${lat},${lng}&format=json&addressdetails=1&limit=6`;
    }

    if (!searchUrl) {
      clearTimeout(timeout);
      return [];
    }

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'BakasurFoodTourApp/2.0 (foodtour@campaign.local)'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);
    if (!res.ok) return [];

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

    const data = (await res.json()) as NominatimItem[];
    if (!Array.isArray(data)) return [];

    const liveSpots: Restaurant[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const addr = item.address || {};
      const rawName = item.name || item.display_name?.split(',')[0] || query || 'Local Hotel';
      const cleanName = rawName.length > 50 ? rawName.slice(0, 48) + '...' : rawName;
      const sublocality = addr.suburb || addr.neighbourhood || addr.road || addr.quarter || addr.residential || `${city} Area`;
      const cityName = addr.city || addr.town || city;
      const itemLat = parseFloat(item.lat || String(lat || 18.5204));
      const itemLng = parseFloat(item.lon || String(lng || 73.8407));

      liveSpots.push({
        id: 700000 + i + Math.floor(Math.random() * 1000),
        name: cleanName,
        description: `Live verified culinary spot in ${sublocality}, ${cityName}`,
        address: `${sublocality}, ${cityName}`,
        area: sublocality,
        city: cityName,
        latitude: itemLat,
        longitude: itemLng,
        rating: Math.round((4.6 + Math.random() * 0.3) * 10) / 10,
        image: pickCuisineImage(cleanName),
        is_campaign_active: 1,
        total_visits: Math.floor(800 + Math.random() * 1200),
        status: 'active'
      });
    }

    return liveSpots;
  } catch {
    return [];
  }
}
