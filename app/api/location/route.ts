import { NextResponse } from 'next/server';
import { PUNE_AREAS, AreaInfo, calculateDistanceKm } from '@/lib/areas';

export const dynamic = 'force-dynamic';

const POPULAR_CITIES = [
  { name: "Pune", state: "Maharashtra", latitude: 18.5204, longitude: 73.8407, popularSpots: 35, description: "Cultural capital of Maharashtra, home of Vaishali & SPDP" },
  { name: "Mumbai", state: "Maharashtra", latitude: 18.9222, longitude: 72.8317, popularSpots: 42, description: "City of dreams, Leopold Cafe & Irani Chai" },
  { name: "Delhi", state: "NCR-Delhi", latitude: 28.6507, longitude: 77.2334, popularSpots: 38, description: "Capital of flavours, Karim's & Chandni Chowk street food" },
  { name: "Bengaluru", state: "Karnataka", latitude: 12.9452, longitude: 77.5704, popularSpots: 31, description: "Silicon City, Vidyarthi Bhavan Crispy Dosas & Filter Kaapi" },
  { name: "Kolkata", state: "West Bengal", latitude: 22.5528, longitude: 88.3533, popularSpots: 28, description: "City of Joy, Peter Cat Chelo Kebabs & Kathi Rolls" },
  { name: "Hyderabad", state: "Telangana", latitude: 17.4416, longitude: 78.4983, popularSpots: 35, description: "City of Pearls & Nizami Dum Biryani" },
  { name: "Lucknow", state: "Uttar Pradesh", latitude: 26.8467, longitude: 80.9462, popularSpots: 19, description: "City of Nawabs, Tunday Kebabs & Royal Awadhi Cuisine" }
];

async function reverseGeocodeCoords(lat: number, lng: number): Promise<{ sublocality?: string; city?: string; state?: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
      {
        headers: { 'User-Agent': 'BakasurFoodTourApp/2.0' },
        signal: controller.signal
      }
    );
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    const sublocality = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || addr.road || addr.village;
    const city = addr.city || addr.town || addr.municipality || addr.county || addr.state_district;
    return {
      sublocality,
      city,
      state: addr.state
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let userLat = parseFloat(searchParams.get('lat') || searchParams.get('latitude') || '');
  let userLng = parseFloat(searchParams.get('lng') || searchParams.get('longitude') || '');
  const requestedCity = searchParams.get('city') || '';

  let detectedCity = POPULAR_CITIES[0]; // Default to Pune
  let hasGPS = !isNaN(userLat) && !isNaN(userLng);
  let preciseSublocality: string | null = null;

  // If live GPS coordinates are provided, perform reverse geocode
  if (hasGPS) {
    const geoInfo = await reverseGeocodeCoords(userLat, userLng);
    if (geoInfo?.sublocality) {
      preciseSublocality = geoInfo.sublocality;
    }
    if (geoInfo?.city) {
      const match = POPULAR_CITIES.find(c => c.name.toLowerCase() === geoInfo.city?.toLowerCase());
      if (match) detectedCity = match;
    }
  }

  if (requestedCity) {
    const match = POPULAR_CITIES.find(c => c.name.toLowerCase() === requestedCity.toLowerCase());
    if (match) detectedCity = match;
  } else if (hasGPS && !detectedCity) {
    let minDistance = Infinity;
    for (const city of POPULAR_CITIES) {
      const dist = calculateDistanceKm(userLat, userLng, city.latitude, city.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        detectedCity = city;
      }
    }
  }

  // Calculate Pune area extraction
  let areasForCity = PUNE_AREAS;
  let detectedArea: AreaInfo = PUNE_AREAS[0];

  if (detectedCity.name.toLowerCase() === 'pune') {
    if (hasGPS) {
      let minAreaDist = Infinity;
      const calculatedAreas = PUNE_AREAS.map(area => {
        const dist = calculateDistanceKm(userLat, userLng, area.latitude, area.longitude);
        if (dist < minAreaDist) {
          minAreaDist = dist;
          detectedArea = { ...area, distanceKm: dist };
        }
        return { ...area, distanceKm: dist };
      });

      // If Nominatim resolved an exact Pune sublocality (e.g. "Narayan Peth", "Shukrawar Peth")
      if (preciseSublocality) {
        const matchingArea = PUNE_AREAS.find(a => 
          preciseSublocality!.toLowerCase().includes(a.name.toLowerCase()) || 
          a.name.toLowerCase().includes(preciseSublocality!.toLowerCase())
        );
        if (matchingArea) {
          detectedArea = {
            ...matchingArea,
            displayName: `${preciseSublocality}, Pune`,
            distanceKm: calculateDistanceKm(userLat, userLng, matchingArea.latitude, matchingArea.longitude)
          };
        }
      }

      // Sort areas by distance from user's live GPS
      areasForCity = calculatedAreas.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else {
      detectedArea = PUNE_AREAS[0];
    }
  }

  const locationDisplay = detectedCity.name.toLowerCase() === 'pune'
    ? `${preciseSublocality ? preciseSublocality + ', ' : ''}${detectedArea.displayName}`
    : `${detectedCity.name}, India`;

  return NextResponse.json({
    success: true,
    hasGPS,
    userCoords: hasGPS ? { lat: userLat, lng: userLng } : { lat: detectedCity.latitude, lng: detectedCity.longitude },
    detectedCity,
    detectedArea,
    preciseSublocality,
    locationDisplay,
    areas: areasForCity,
    supportedCities: POPULAR_CITIES
  });
}
