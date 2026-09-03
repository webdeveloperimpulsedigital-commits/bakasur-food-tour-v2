export interface AreaInfo {
  id: string;
  name: string;
  displayName: string;
  city: string;
  latitude: number;
  longitude: number;
  popularSpotsCount: number;
  popularLandmarks: string[];
  description: string;
  distanceKm?: number;
}

export const PUNE_AREAS: AreaInfo[] = [
  {
    id: "narayan_peth",
    name: "Narayan Peth",
    displayName: "Narayan Peth / Appa Balwant Chowk",
    city: "Pune",
    latitude: 18.5170,
    longitude: 73.8520,
    popularSpotsCount: 7,
    popularLandmarks: ["Bedekar Tea Stall (Misal)", "Appa Balwant Chowk", "Laxmi Road", "Kelkar Museum"],
    description: "Historic heart of Pune famous for authentic Puneri spicy Misal, snacks & traditional thalis"
  },
  {
    id: "shukrawar_peth",
    name: "Shukrawar Peth",
    displayName: "Shukrawar Peth / Subhash Nagar",
    city: "Pune",
    latitude: 18.5085,
    longitude: 73.8560,
    popularSpotsCount: 6,
    popularLandmarks: ["Tilak Road Food Market", "Baji Rao Road Sweets", "Subhash Nagar"],
    description: "Vibrant traditional marketplace famous for Tilak Misal, sweet marts & street chaupati"
  },
  {
    id: "fc_road",
    name: "FC Road",
    displayName: "FC Road, Shivajinagar",
    city: "Pune",
    latitude: 18.5204,
    longitude: 73.8407,
    popularSpotsCount: 8,
    popularLandmarks: ["Vaishali", "Wadeshwar", "Roopali", "Fergusson College"],
    description: "Iconic student & food street with legendary South Indian tiffins & cafes"
  },
  {
    id: "deccan",
    name: "Deccan Gymkhana",
    displayName: "Deccan Gymkhana, FC Road",
    city: "Pune",
    latitude: 18.5167,
    longitude: 73.8415,
    popularSpotsCount: 6,
    popularLandmarks: ["Cafe Goodluck", "Chitale Bandhu", "Deccan Corner"],
    description: "Heart of Pune's culinary heritage, Irani chai & bun maska"
  },
  {
    id: "sadashiv_peth",
    name: "Sadashiv Peth",
    displayName: "Sadashiv Peth, Tilak Road",
    city: "Pune",
    latitude: 18.5123,
    longitude: 73.8530,
    popularSpotsCount: 6,
    popularLandmarks: ["Sujata Mastani", "SPDP Spots", "Tilak Road Khau Galli"],
    description: "Traditional Puneri food hub famous for original Sujata Mastani thick shakes"
  },
  {
    id: "camp",
    name: "Camp / MG Road",
    displayName: "Camp, East Street / MG Road",
    city: "Pune",
    latitude: 18.5140,
    longitude: 73.8760,
    popularSpotsCount: 7,
    popularLandmarks: ["Kayani Bakery", "George Restaurant", "Marz-O-Rin", "Blue Nile"],
    description: "Colonial-era food district famous for Shrewsbury biscuits, biryani & parsi bakes"
  },
  {
    id: "koregaon_park",
    name: "Koregaon Park (KP)",
    displayName: "Koregaon Park, North Main Road",
    city: "Pune",
    latitude: 18.5362,
    longitude: 73.8940,
    popularSpotsCount: 8,
    popularLandmarks: ["German Bakery", "Malaka Spice", "Osho Lane Cafes"],
    description: "Trendy cosmopolitan enclave with artisanal cafes, bakeries & world cuisine"
  },
  {
    id: "kothrud",
    name: "Kothrud",
    displayName: "Kothrud, Karve Road / Paud Road",
    city: "Pune",
    latitude: 18.5074,
    longitude: 73.8077,
    popularSpotsCount: 6,
    popularLandmarks: ["Bipin Snacks", "Katta Cafe", "Joshi Wadewale", "Vanaz Corner"],
    description: "Thriving residential food paradise with authentic Maharashtrian street snacks"
  },
  {
    id: "viman_nagar",
    name: "Viman Nagar",
    displayName: "Viman Nagar, Datta Mandir Chowk",
    city: "Pune",
    latitude: 18.5679,
    longitude: 73.9143,
    popularSpotsCount: 7,
    popularLandmarks: ["Irani Cafe", "Cafe Peter", "Phoenix Marketcity Hub"],
    description: "Vibrant modern youth hub with fusion bistros, street food & Irani cafes"
  },
  {
    id: "baner",
    name: "Baner & Balewadi",
    displayName: "Baner / Balewadi High Street",
    city: "Pune",
    latitude: 18.5590,
    longitude: 73.7868,
    popularSpotsCount: 6,
    popularLandmarks: ["The Urban Foundry", "Balewadi High Street", "Bavdhan Corner"],
    description: "Bustling nightlife & gourmet dining strip with global eateries & microbreweries"
  },
  {
    id: "swargate",
    name: "Swargate & Sarasbaug",
    displayName: "Swargate / Sarasbaug Chaupati",
    city: "Pune",
    latitude: 18.5018,
    longitude: 73.8586,
    popularSpotsCount: 5,
    popularLandmarks: ["Sarasbaug Chaupati Bhel", "Peshwe Park Pav Bhaji", "Swargate Chowk"],
    description: "Classic street chaupati famous for SPDP, Bhelpuri, Kulfi & Pav Bhaji"
  },
  {
    id: "hinjawadi_wakad",
    name: "Hinjawadi & Wakad",
    displayName: "Hinjawadi / Wakad",
    city: "Pune",
    latitude: 18.5913,
    longitude: 73.7389,
    popularSpotsCount: 6,
    popularLandmarks: ["Hinjawadi Phase 1", "Wakad Dutta Mandir", "Bhujbal Chowk"],
    description: "IT corridor bustling with late-night food trucks, spicy dhabas & biryani joints"
  }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  return Math.round(R * c * 10) / 10;
}
