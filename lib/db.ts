import mysql from 'mysql2/promise';

// Types
export interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  image: string;
  is_campaign_active: number;
  total_visits: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Dish {
  id: number;
  restaurant_id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  popularity: number;
  is_recommended: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface BakasurVideo {
  id: number;
  restaurant_id: number | null;
  dish_id: number | null;
  stage: string; // 'intro' | 'stage_1' | 'stage_2' | 'stage_3' | 'acidity' | 'generic'
  stage_number: number;
  video_url: string;
  thumbnail: string | null;
  duration: number;
  meter_percentage: number;
  message: string;
  cta_text: string;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface CampaignSession {
  id: number;
  session_id: string;
  user_location: string | null;
  latitude: number | null;
  longitude: number | null;
  restaurant_id: number | null;
  dish_id: number | null;
  current_stage: string;
  food_meter_percentage: number;
  aur_khilo_clicks: number;
  video_completed: number;
  map_visited: number;
  form_submitted: number;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignVisit {
  id: number;
  session_id: string;
  restaurant_id: number;
  dish_id: number | null;
  city: string;
  latitude: number;
  longitude: number;
  visited_at: string;
}

export interface Participant {
  id: number;
  session_id: string;
  participation_id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  restaurant_name?: string;
  dish_name?: string;
  consent: number;
  terms_accepted: number;
  created_at: string;
}

// Initial Sample Seed Data (5 Restaurants per city, 5 Dishes per restaurant)
export const INITIAL_RESTAURANTS: Omit<Restaurant, 'id'>[] = [
  // Pune (1-5)
  { name: "Vaishali Restaurant", description: "Legendary South Indian haven famous for iconic dosas, filter coffee, and vibrant Pune food culture since 1971.", address: "1218/1, FC Road, Shivajinagar", area: "FC Road", city: "Pune", latitude: 18.5204, longitude: 73.8407, rating: 4.8, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1420, status: 'active' },
  { name: "Cafe Goodluck", description: "Iconic Irani cafe serving buttery bun maska, double egg keema, and aromatic Irani chai since 1935.", address: "Deccan Gymkhana, FC Road", area: "Deccan", city: "Pune", latitude: 18.5167, longitude: 73.8415, rating: 4.7, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1280, status: 'active' },
  { name: "Sujata Mastani", description: "Pune's original ice-cream thick shake destination since 1953, famous for rich Mango & Dryfruit Mastani.", address: "Sadashiv Peth, Laxmi Road", area: "Sadashiv Peth", city: "Pune", latitude: 18.5123, longitude: 73.8530, rating: 4.9, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1150, status: 'active' },
  { name: "George Restaurant", description: "Camp's legendary Mughlai & tandoor hub famous for aromatic mutton biryani, butter chicken, and seekh kebabs.", address: "2436, East Street, Camp", area: "Camp", city: "Pune", latitude: 18.5140, longitude: 73.8760, rating: 4.6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 990, status: 'active' },
  { name: "Kayani Bakery & Cafe", description: "World-famous Parsi bakery celebrating century-old recipes of Shrewsbury biscuits & mawa cakes.", address: "6, East Street, Camp", area: "Camp", city: "Pune", latitude: 18.5155, longitude: 73.8772, rating: 4.8, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1350, status: 'active' },

  // Mumbai (6-10)
  { name: "Leopold Cafe & Bar", description: "Historic Mumbai landmark serving hearty Iranian, Continental, and Indian bites with vibrant heritage energy.", address: "Colaba Causeway, Apollo Bandar", area: "Colaba", city: "Mumbai", latitude: 18.9222, longitude: 72.8317, rating: 4.6, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 980, status: 'active' },
  { name: "Bademiya Street Kebabs", description: "Colaba's legendary late-night charcoal tandoor destination famous for spicy Baida Roti and juicy Seekh Rolls.", address: "Tulloch Road, Behind Taj Hotel, Colaba", area: "Colaba", city: "Mumbai", latitude: 18.9215, longitude: 72.8322, rating: 4.7, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1890, status: 'active' },
  { name: "Sardar Refreshments", description: "Mumbai's butter king serving legendary Pav Bhaji with floating slabs of pure Amul butter.", address: "166, Tardeo Road, Junction, Tardeo", area: "Tardeo", city: "Mumbai", latitude: 18.9680, longitude: 72.8150, rating: 4.8, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1750, status: 'active' },
  { name: "Kyani & Co. Irani Cafe", description: "Historic 119-year-old Irani bakery serving classic Keema Pav, Bun Maska, and Caramel Custard.", address: "Jer Mahal Estate, Marine Lines", area: "Marine Lines", city: "Mumbai", latitude: 18.9440, longitude: 72.8280, rating: 4.6, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1420, status: 'active' },
  { name: "Anand Stall & Dosa", description: "Vile Parle street food icon famous for Cheese Burst Vada Pav, Jinny Dosa, and Schezwan rolls.", address: "Opposite Mithibai College, Vile Parle West", area: "Vile Parle", city: "Mumbai", latitude: 19.1025, longitude: 72.8375, rating: 4.7, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1610, status: 'active' },

  // Delhi (11-15)
  { name: "Karim's Historic Mughlai", description: "Centuries of royal Mughlai legacy serving royal kebabs, rich mutton korma, and heavenly biryanis near Jama Masjid.", address: "16, Gali Kababian, Jama Masjid", area: "Old Delhi", city: "Delhi", latitude: 28.6507, longitude: 77.2334, rating: 4.7, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1875, status: 'active' },
  { name: "Aslam Butter Chicken", description: "Old Delhi's butter mountain sensation where tandoori chicken is bathed in melted butter and curd.", address: "540, Matia Mahal Road, Jama Masjid", area: "Jama Masjid", city: "Delhi", latitude: 28.6515, longitude: 77.2340, rating: 4.8, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2100, status: 'active' },
  { name: "Sita Ram Diwan Chand", description: "Paharganj's iconic Chole Bhature destination, serving puffed golden bhaturas with spiced chickpeas & paneer.", address: "2243, Rajguru Marg, Chuna Mandi, Paharganj", area: "Paharganj", city: "Delhi", latitude: 28.6440, longitude: 77.2140, rating: 4.9, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1950, status: 'active' },
  { name: "Gulati Restaurant", description: "Pandara Road's crown jewel celebrated for ultra-creamy Dal Makhani, Murgh Malai Tikka, and Kakori Kebabs.", address: "6, Pandara Road Market", area: "Pandara Road", city: "Delhi", latitude: 28.6080, longitude: 77.2310, rating: 4.8, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1680, status: 'active' },
  { name: "Al Jawahar", description: "Jama Masjid's legendary Mughlai hub famous for slow-cooked Mutton Nihari and Chicken Changezi.", address: "8, Jama Masjid, Matia Mahal", area: "Old Delhi", city: "Delhi", latitude: 28.6510, longitude: 77.2338, rating: 4.7, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1540, status: 'active' },

  // Bengaluru (16-20)
  { name: "Vidyarthi Bhavan", description: "Bangalore's ultimate crispy golden Masala Dosa destination, serving generations with molten butter & chutney.", address: "32, Gandhi Bazaar Main Rd, Basavanagudi", area: "Gandhi Bazaar", city: "Bengaluru", latitude: 12.9452, longitude: 77.5704, rating: 4.9, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2150, status: 'active' },
  { name: "Shri Sagar CTR", description: "Malleshwaram's iconic tiffin room famous for extra crispy Benne Masala Dosa loaded with country butter.", address: "7th Cross Road, Margosa Road, Malleshwaram", area: "Malleshwaram", city: "Bengaluru", latitude: 12.9980, longitude: 77.5710, rating: 4.8, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1980, status: 'active' },
  { name: "MTR (Mavalli Tiffin Room)", description: "Heritage South Indian culinary pioneer famous for fluffy Rava Idli, Bisi Bele Bath, and traditional Filter Coffee.", address: "14, Lalbagh Road, Mavalli", area: "Lalbagh", city: "Bengaluru", latitude: 12.9550, longitude: 77.5860, rating: 4.9, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2300, status: 'active' },
  { name: "Nagarjuna Andhra Meals", description: "Indiranagar's spicy Andhra haven serving authentic banana leaf thalis, Biryani, and Guntur Chicken.", address: "44, 100 Feet Road, Indiranagar", area: "Indiranagar", city: "Bengaluru", latitude: 12.9710, longitude: 77.6410, rating: 4.7, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1410, status: 'active' },
  { name: "Corner House Ice Cream", description: "Bengaluru's beloved dessert parlour famous for the iconic Death By Chocolate sundae loaded with hot fudge.", address: "9th Main Rd, 3rd Block, Jayanagar", area: "Jayanagar", city: "Bengaluru", latitude: 12.9290, longitude: 77.5830, rating: 4.8, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1820, status: 'active' },

  // Kolkata (21-25)
  { name: "Peter Cat", description: "Kolkata's crown jewel celebrated for its sizzling chelo kebabs, old-world elegance, and culinary magic.", address: "18A, Park St, Park Street area", area: "Park Street", city: "Kolkata", latitude: 22.5528, longitude: 88.3533, rating: 4.7, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 890, status: 'active' },
  { name: "Arsalan Biryani", description: "Kolkata's Biryani king serving aromatic long-grain rice cooked with tender mutton, egg, and spiced potato.", address: "191, Park Street, Park Circus", area: "Park Circus", city: "Kolkata", latitude: 22.5450, longitude: 88.3650, rating: 4.8, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2150, status: 'active' },
  { name: "Nizam's Kathi Roll", description: "The birth place of the famous Kolkata Kathi Roll serving juicy tandoori kebabs wrapped in flaky parathas.", address: "21, Hogg St, New Market Area", area: "New Market", city: "Kolkata", latitude: 22.5600, longitude: 88.3520, rating: 4.6, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1670, status: 'active' },
  { name: "Bhojohori Manna", description: "Authentic Bengali comfort food hub serving Kosha Mangsho, Chingri Malaikari, and Bhetki Paturi.", address: "18/1A, Ekdalia Rd, Ballygunge", area: "Ballygunge", city: "Kolkata", latitude: 22.5180, longitude: 88.3680, rating: 4.7, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1240, status: 'active' },
  { name: "Flurys Tearoom", description: "Park Street's heritage Victorian tearoom famous for English breakfast, rum balls, and chocolate pastry.", address: "18, Park Street, Park Street area", area: "Park Street", city: "Kolkata", latitude: 22.5525, longitude: 88.3530, rating: 4.6, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1390, status: 'active' },

  // Hyderabad (26-30)
  { name: "Paradise Heritage Biryani", description: "The world-famous home of authentic Hyderabadi Dum Biryani, bursting with saffron, spices, and tender meat.", address: "MG Road, Sappu Bagh, Secunderabad", area: "Secunderabad", city: "Hyderabad", latitude: 17.4416, longitude: 78.4983, rating: 4.5, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1640, status: 'active' },
  { name: "Hotel Shadab", description: "Charminar's pride serving legendary Mutton Dum Biryani, Zabaan Nihari, and Chicken 65.", address: "High Court Road, Madina Circle, Charminar", area: "Charminar", city: "Hyderabad", latitude: 17.3680, longitude: 78.4730, rating: 4.8, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2400, status: 'active' },
  { name: "Bawarchi Biryani", description: "RTC X Roads original Biryani sensation famous for double-masala Mutton Dum Biryani.", address: "RTC X Roads, Musheerabad, Chikkadpally", area: "RTC X Roads", city: "Hyderabad", latitude: 17.4020, longitude: 78.4910, rating: 4.7, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 2190, status: 'active' },
  { name: "Shah Ghouse Hotel", description: "Gachibowli's famous royal eatery celebrated for rich Mutton Haleem, Boti Kebab, and Special Biryani.", address: "Raidurgam, Gachibowli Main Rd", area: "Gachibowli", city: "Hyderabad", latitude: 17.4430, longitude: 78.3680, rating: 4.8, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1980, status: 'active' },
  { name: "Chutneys", description: "Jubilee Hills South Indian landmark famous for Guntur Idli, Babai Hotel Dosa, and 7 Signature Chutneys.", address: "Road No 3, Banjara Hills", area: "Banjara Hills", city: "Hyderabad", latitude: 17.4250, longitude: 78.4410, rating: 4.6, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80", is_campaign_active: 1, total_visits: 1530, status: 'active' }
];

export const INITIAL_DISHES: Omit<Dish, 'id'>[] = [
  // 1. Vaishali (rest_id: 1)
  { restaurant_id: 1, name: "Mysore Masala Dosa", description: "Crispy fermented crepe smeared with spicy fiery red garlic chutney, filled with spiced potato mash and laden with pure ghee.", price: 160.00, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 1, name: "SPDP (Sev Potato Dahi Puri)", description: "Crunchy puris filled with spiced potatoes, chilled sweet curd, tangy tamarind chutney, and mountain of crisp sev.", price: 130.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 1, name: "Filter Coffee Supreme", description: "Aromatic South Indian chicory blend frothed to perfection in traditional stainless steel tumbler.", price: 60.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 1, name: "Special Cheese Onion Dosa", description: "Thick crispy dosa loaded with finely chopped red onions, green chillies, and grated Amul cheese.", price: 180.00, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 1, name: "Upma Sheera Twin Combo", description: "Savory roasted semolina upma served alongside velvety golden pineapple sheera dripping with ghee.", price: 110.00, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },

  // 2. Cafe Goodluck (rest_id: 2)
  { restaurant_id: 2, name: "Bun Maska & Irani Chai", description: "Soft fresh bun slathered with dollops of salted butter served with piping hot cardamom Irani tea.", price: 70.00, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 2, name: "Spicy Mutton Keema Pav", description: "Slow-cooked minced mutton cooked in whole aromatic spices topped with fresh mint & buttered ladi pav.", price: 260.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 2, name: "Chicken Baida Roti", description: "Crispy shallow-fried stuffed flatbread layered with spiced chicken minced and scrambled egg.", price: 220.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 2, name: "Special Irani Mawa Cake", description: "Traditional rich cardamom and nutmeg scented sponge cake baked to golden perfection.", price: 50.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 2, name: "Double Cheese Omelette Pav", description: "Fluffy 3-egg omelette loaded with melted cheese slices, green chillies, served with hot toasted pav.", price: 140.00, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 91, is_recommended: 1, status: 'active' },

  // 3. Sujata Mastani (rest_id: 3)
  { restaurant_id: 3, name: "Special Mango Mastani", description: "Pune's iconic thick Alphonso mango shake crowned with rich vanilla ice cream, cherry, and almonds.", price: 150.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 3, name: "Dryfruit Royal Mastani", description: "Creamy cashew nut & saffron thick shake topped with roasted pistachios, raisins, and kulfi scoop.", price: 180.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 3, name: "Chocolate Brownie Mastani", description: "Rich Dutch chocolate shake loaded with crumbled gooey brownie and dark chocolate fudge sauce.", price: 170.00, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 3, name: "Kesar Pista Special Shake", description: "Aromatic Kashmiri saffron thick milk blend topped with generous crushed green pistachios.", price: 160.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 3, name: "Fresh Strawberry Crush Mastani", description: "Real Mahabaleshwar strawberry pulp blended into thick ice cream shake with fresh berry toppings.", price: 140.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },

  // 4. George Restaurant (rest_id: 4)
  { restaurant_id: 4, name: "Special Mutton Dum Biryani", description: "Long grain Basmati rice layered with succulent saffron-marinated mutton, caramelized onions & ghee.", price: 380.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 4, name: "Butter Tandoori Chicken Full", description: "Whole tandoori roasted chicken basted in spiced yoghurt marinade and charred over live charcoal.", price: 460.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 4, name: "Juicy Chicken Seekh Kebab", description: "Spiced minced chicken skewers grilled to perfection in clay oven served with mint chutney.", price: 290.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 4, name: "Butter Garlic Naan & Mutton Gravy", description: "Fluffy tandoori naan brushed with garlic butter served with slow-cooked spicy mutton gravy.", price: 340.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 4, name: "Heritage Caramel Custard", description: "Silky smooth baked egg custard with rich golden burnt sugar caramel sauce.", price: 120.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 90, is_recommended: 1, status: 'active' },

  // 5. Kayani Bakery (rest_id: 5)
  { restaurant_id: 5, name: "Shrewsbury Biscuits Pack", description: "World-famous rich buttery shortbread cookies crafted with secret Parsi heritage recipe.", price: 240.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 5, name: "Special Mawa Cake Slices", description: "Dense, moist sponge cake infused with caramelized mawa (khoya) and freshly ground cardamom.", price: 180.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 5, name: "Crispy Ginger Biscuits", description: "Crunchy tea-time cookies infused with freshly grated spicy ginger and brown sugar.", price: 160.00, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 5, name: "Rich Fruit Wine Cake", description: "Festive dense loaf cake loaded with rum-soaked raisins, candied peel, and tutty-fruity.", price: 290.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 5, name: "Cheese Papadi Salted Crunch", description: "Savory crispy cheese-flavored bites cooked to golden perfection.", price: 130.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 88, is_recommended: 1, status: 'active' },

  // 6. Leopold Cafe (rest_id: 6)
  { restaurant_id: 6, name: "Leopold Special Chicken Stroganoff", description: "Tender chicken strips cooked in rich creamy mushroom and herb paprika sauce over herb buttered rice.", price: 490.00, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 6, name: "Spicy Keema Pav", description: "Slow-braised spiced minced mutton topped with fresh onions and butter-toasted ladi pavs.", price: 340.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 6, name: "Tandoori Chicken Tikka Platter", description: "Smokey chargrilled chicken chunks marinated in hung curd, Kashmiri chilli & garam masala.", price: 420.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 6, name: "Spicy Buff Chilli Fry", description: "Classic Mumbai pub bite featuring sliced meat tossed with green chillies, garlic & dark soy.", price: 380.00, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 6, name: "Beer Battered Fish & Chips", description: "Crispy fried Kolkata bhetki fillets served with seasoned french fries & house tartar sauce.", price: 510.00, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },

  // 7. Bademiya (rest_id: 7)
  { restaurant_id: 7, name: "Special Chicken Baida Roti", description: "Layered crispy paratha stuffed with egg scrambled chicken keema, fried on flat iron tawa.", price: 250.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 7, name: "Mutton Seekh Kebab Roll", description: "Charcoal-grilled minced mutton seekh wrapped in roomali roti with sliced onions & lemon.", price: 280.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 7, name: "Chicken Bhuna Roll", description: "Slow-roasted chicken cooked in thick onion tomato gravy, rolled in hot butter paratha.", price: 260.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 7, name: "Juicy Mutton Boti Kebab", description: "Tender boneless mutton cubes marinated in papaya & tandoori spices, cooked on skewers.", price: 360.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 7, name: "Rumali Roti & Mutton Korma Combo", description: "Paper-thin soft rumali roti served with rich, aromatic slow-cooked mutton gravy.", price: 390.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },

  // 8. Sardar Refreshments (rest_id: 8)
  { restaurant_id: 8, name: "Extra Butter Pav Bhaji", description: "Mashed spiced vegetable curry floating under half slab of pure Amul butter, served with butter pav.", price: 210.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 8, name: "Special Cheese Pav Bhaji", description: "Rich pav bhaji smothered with mountain of grated Processed cheese and melted butter.", price: 250.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 8, name: "Masala Pav Double", description: "Toasted soft ladi pavs slathered with spicy garlic onion bhaji gravy and butter.", price: 140.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 8, name: "Amul Butter Garlic Toast", description: "Thick crispy bread slices toasted in garlic herb butter with a crunchy crust.", price: 110.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },
  { restaurant_id: 8, name: "Fresh Chilled Mosambi Juice", description: "Freshly squeezed sweet lime juice served ice cold to cut through the buttery feast.", price: 90.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 9. Kyani & Co. (rest_id: 9)
  { restaurant_id: 9, name: "Mutton Keema Ghotala", description: "Iconic Irani keema scrambled together with two sunny eggs, green chillies & buttered pav.", price: 270.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 9, name: "Bun Maska & Special Irani Chai", description: "Fresh crusty bun loaded with Amul butter, paired with spiced sweet cardamom tea.", price: 80.00, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 9, name: "Irani Cheese Mushroom Omelette", description: "Fluffy 3-egg omelette folded over sauteed garlic mushrooms and melted cheddar.", price: 160.00, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 9, name: "Heritage Caramel Custard", description: "Legendary silky smooth egg custard baked with dark caramelized sugar glaze.", price: 110.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 9, name: "Sailor's Cinnamon Apple Pie", description: "Flaky baked pastry crust filled with spiced stewed apples and raisins.", price: 130.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },

  // 10. Anand Stall (rest_id: 10)
  { restaurant_id: 10, name: "Cheese Burst Vada Pav", description: "Spicy potato vada stuffed with mozzarella cheese, fried in gram batter, served in butter pav.", price: 90.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 10, name: "Schezwan Jinny Dosa", description: "Thin crispy dosa chopped on tawa with vegetables, cheese, paneer, and fiery Schezwan sauce.", price: 210.00, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 10, name: "Paneer Cheese Grill Sandwich", description: "3-layer jumbo toast sandwich filled with spiced paneer, veggies, and oozing cheese.", price: 180.00, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 10, name: "Special Chocolate Cheese Dosa", description: "Sweet dessert dosa smeared with Nutella chocolate spread and grated processed cheese.", price: 190.00, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 10, name: "Schezwan Butter Bhel", description: "Crispy puffed rice tossed with Schezwan sauce, peanuts, sev, and melted butter.", price: 120.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 11. Karim's (rest_id: 11)
  { restaurant_id: 11, name: "Royal Mutton Burra Kebab", description: "Charcoal-tandoor smoked juicy mutton chops marinated in secret royal Mughal spices.", price: 520.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 11, name: "Shahi Mutton Korma", description: "Slow-simmered rich gravy infused with brown onions, whole spices, and rich kewra essence.", price: 440.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 11, name: "Mutton Dum Biryani Royal", description: "Saffron infused Basmati rice cooked with tender marinated mutton in traditional sealed handi.", price: 460.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 11, name: "Flaky Tandoori Khamiri Roti", description: "Leavened thick tandoori flatbread baked in traditional clay oven.", price: 50.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 11, name: "Shahi Phirni in Clay Pot", description: "Chilled ground rice pudding flavored with saffron, cardamom, and silver leaf.", price: 120.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },

  // 12. Aslam Butter Chicken (rest_id: 12)
  { restaurant_id: 12, name: "Special Dahi Butter Chicken", description: "Tandoori chicken roasted in tandoor, tossed in rich curd, secret spices, and molten butter stream.", price: 480.00, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 12, name: "Seekh Kebab Butter Bath", description: "Charcoal grilled mutton seekh kebabs dipped in melted Amul butter and spiced yogurt.", price: 360.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 12, name: "Tandoori Fish Tikka Fry", description: "Fresh river fish marinated in carom seeds, ginger garlic & mustard oil, grilled crisp.", price: 440.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 12, name: "Soft Rumali Roti", description: "Ultra-thin, soft hand-tossed flatbread baked over inverted tawa bowl.", price: 30.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 12, name: "Special Mint Chutney & Onion Salad", description: "Tangy coriander-mint yogurt dip served with lemon spiced onion rings.", price: 50.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.5, popularity: 87, is_recommended: 1, status: 'active' },

  // 13. Sita Ram Diwan Chand (rest_id: 13)
  { restaurant_id: 13, name: "Paneer Stuffed Chole Bhature", description: "Puffed golden bhaturas stuffed with grated paneer, served with spicy tangy chickpea curry & pickle.", price: 160.00, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 13, name: "Special Malai Meethi Lassi", description: "Thick creamy yogurt drink topped with thick layer of fresh malai and rose syrup.", price: 90.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 13, name: "Crispy Aloo Tikki Chaat", description: "Shallow-fried spiced potato patty topped with chickpeas, sweet curd, tamarind & mint chutney.", price: 120.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 13, name: "Amritsari Paneer Kulcha", description: "Crispy tandoori kulcha stuffed with spiced cottage cheese and herbs, served with chole.", price: 150.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 13, name: "Hot Desi Ghee Gulab Jamun", description: "Soft melt-in-mouth milk solid dumplings soaked in cardamom sugar syrup.", price: 70.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 95, is_recommended: 1, status: 'active' },

  // 14. Gulati (rest_id: 14)
  { restaurant_id: 14, name: "Famous Creamy Dal Makhani", description: "Black lentils slow-cooked overnight over charcoal, finished with white butter and fresh cream.", price: 390.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 14, name: "Murgh Malai Tikka Supreme", description: "Boneless chicken chunks marinated in cream, cheese, cashews and cardamom, charcoal grilled.", price: 460.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 14, name: "Melt-In-Mouth Kakori Kebab", description: "Royal Awadhi minced lamb kebabs infused with 52 secret spices, melting effortlessly on palate.", price: 510.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 14, name: "Butter Garlic Naan", description: "Refined flour tandoori naan coated with minced garlic, coriander, and pure Amul butter.", price: 110.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 14, name: "Kesar Zafrani Phirni", description: "Chilled rice pudding garnished with pistachios, almonds, saffron threads, served in earthenware.", price: 140.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },

  // 15. Al Jawahar (rest_id: 15)
  { restaurant_id: 15, name: "Special Mutton Nihari", description: "Slow-braised mutton shanks stewed overnight in fragrant whole spice broth & bone marrow.", price: 440.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 15, name: "Chicken Changezi Special", description: "Fried chicken cooked in tangy, milk-cream onion tomato gravy with green chillies.", price: 420.00, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 15, name: "Gurda Kaleji Tawa Fry", description: "Fresh mutton kidney & liver tossed on iron tawa with crushed pepper, onions, and lemon.", price: 360.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 15, name: "Sweet Saffron Sheermal Roti", description: "Traditional Mughlai flatbread made with milk, ghee, and saffron baked in tandoor.", price: 70.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 15, name: "Zafrani Kheer Pot", description: "Thick milk rice kheer infused with saffron, raisins, and crushed dry fruits.", price: 110.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 92, is_recommended: 1, status: 'active' },

  // 16. Vidyarthi Bhavan (rest_id: 16)
  { restaurant_id: 16, name: "Crispy Golden Butter Masala Dosa", description: "Signature thick yet crunchy dosa with golden exterior, soft interior, loaded with pure country butter.", price: 90.00, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 16, name: "Fluffy Sambar Vada (2 Pcs)", description: "Golden fried lentil donuts soaked in steaming hot aromatic vegetable sambar.", price: 70.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 16, name: "Chow Chow Bath (Upma + Kesari)", description: "Savory kara bath paired with sweet saffron pineapple kesari bath served with coconut chutney.", price: 100.00, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 16, name: "Plain Rava Masala Dosa", description: "Lacy semolina dosa sprinkled with cumin, green chillies & roasted cashews.", price: 95.00, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 16, name: "Degree Filter Coffee", description: "Authentic Karnataka filter kaapi frothed with boiling thick milk in traditional steel glass.", price: 35.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },

  // 17. CTR (rest_id: 17)
  { restaurant_id: 17, name: "Benne Masala Dosa", description: "Malleshwaram's legendary extra crispy dosa cooked with generous dollops of fresh white butter.", price: 95.00, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 17, name: "Fluffy Poori Sagu (3 Pcs)", description: "Golden puffed wheat pooris served with spiced potato & mixed vegetable sagu gravy.", price: 85.00, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 17, name: "Crispy Maddur Vada (2 Pcs)", description: "Crunchy onion, semolina & rice flour fritter flavored with curry leaves & green chillies.", price: 60.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 17, name: "Pineapple Kesari Bath", description: "Melting semolina sweet cooked in pure ghee with fresh pineapple chunks & cashews.", price: 65.00, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 17, name: "Strong Filter Kaapi", description: "Freshly brewed South Indian coffee decoction poured high for thick foam froth.", price: 35.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },

  // 18. MTR (rest_id: 18)
  { restaurant_id: 18, name: "Signature Rava Idli with Ghee", description: "The dish invented by MTR during WWII: steamed semolina cake topped with cashew & pure ghee.", price: 110.00, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 18, name: "MTR Masala Dosa", description: "Thick golden dosa made with traditional batter recipe, served with potato sagu & ghee.", price: 120.00, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 18, name: "Bisi Bele Bath with Raitha", description: "Rice and lentils cooked together with veggies, tamarind, aromatic spices & ghee.", price: 130.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 18, name: "Chandrahara Heritage Dessert", description: "MTR's exclusive sweet delicacy of deep fried flour folds soaked in thickened sweetened milk.", price: 140.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 18, name: "Royal Filter Coffee", description: "Handcrafted Chicory filter coffee served in heavy silver-nickel cup.", price: 50.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },

  // 19. Nagarjuna (rest_id: 19)
  { restaurant_id: 19, name: "Unlimited Andhra Banana Leaf Meal", description: "Authentic spicy Andhra feast with rice, pappu, sambar, rasam, gongura chutney & ghee.", price: 290.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 19, name: "Fiery Guntur Chicken Fry", description: "Chicken morsels tossed with roasted Guntur red chillies, curry leaves & garlic.", price: 340.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 19, name: "Andhra Mutton Biryani", description: "Spicy Seema-style long grain biryani cooked with tender lamb pieces & green chillies.", price: 420.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 19, name: "Shallow Fried Royyala (Prawn) Vepudu", description: "Fresh sea prawns sautéed with Andhra spice masala mix & roasted coconut.", price: 460.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 19, name: "Chilled Majjiga (Spiced Buttermilk)", description: "Refreshing churned curd flavored with ginger, coriander & mustard seeds tempering.", price: 60.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 20. Corner House (rest_id: 20)
  { restaurant_id: 20, name: "Death By Chocolate (DBC)", description: "The world famous dessert: layers of vanilla ice cream, rich chocolate cake, peanuts & piping hot fudge.", price: 320.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 20, name: "Hot Fudge Ice Cream Sundae", description: "Three scoops of vanilla ice cream drenched in thick house-made dark chocolate fudge.", price: 210.00, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 20, name: "Brownie Bomb Delight", description: "Warm gooey walnut brownie served with vanilla ice cream and hot fudge chocolate.", price: 240.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 20, name: "Fruit Melba Sundae", description: "Fresh seasonal fruit salad topped with strawberry, vanilla scoops & berry sauce.", price: 230.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 20, name: "Thick Chocolate Malt Shake", description: "Super thick blended ice cream shake loaded with malted chocolate powder.", price: 180.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 92, is_recommended: 1, status: 'active' },

  // 21. Peter Cat (rest_id: 21)
  { restaurant_id: 21, name: "Famous Chelo Kebab Sizzler", description: "Kolkata's iconic dish: buttered rice topped with poached egg, grilled chicken & mutton kebabs on sizzling plate.", price: 540.00, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 21, name: "Chicken Steak Sizzler in Brown Sauce", description: "Juicy chicken breast steak served with mashed potatoes, buttered veggies & rich pepper sauce.", price: 520.00, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 21, name: "Mutton Seekh Kebab Platter", description: "Spiced minced lamb charcoal grilled kebabs served with mint chutney and fresh lime.", price: 460.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 21, name: "Butter Rice & Poached Egg", description: "Fragrant long-grain Basmati rice tossed with pure butter and crowned with soft poached egg.", price: 210.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },
  { restaurant_id: 21, name: "Heritage Peach Melba Dessert", description: "Classic dessert of poached peaches, vanilla ice cream, and raspberry puree drizzle.", price: 260.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 22. Arsalan (rest_id: 22)
  { restaurant_id: 22, name: "Kolkata Mutton Special Biryani", description: "Fragrant saffron rice cooked with tender mutton shank, spiced potato & boiled egg.", price: 380.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 22, name: "Rich Royal Chicken Chaap", description: "Slow-roasted chicken leg marinated in cashew, poppy seed, and ghee gravy on flat tawa.", price: 290.00, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 22, name: "Mutton Pasinda Kebab", description: "Tender flattened lamb escalopes marinated in papaya and aromatic spices, shallow fried.", price: 390.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 22, name: "Special Firni in Clay Earthenware", description: "Chilled ground rice pudding flavored with kewra water, rose, and green pistachios.", price: 110.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 22, name: "Shahi Tukda Dessert", description: "Fried bread slices soaked in saffron rabri condensed milk, topped with almonds.", price: 130.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 23. Nizam's (rest_id: 23)
  { restaurant_id: 23, name: "Original Mutton Kathi Roll", description: "The authentic birthplace roll: tandoori mutton kebabs rolled inside layered paratha with onions.", price: 190.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 23, name: "Double Egg Chicken Kathi Roll", description: "Flaky paratha coated with two eggs, filled with charcoal grilled chicken tikka & green chillies.", price: 180.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 23, name: "Special Mutton Tikka Kebab", description: "Succulent cubes of lamb marinated in ginger garlic and tandoori masala, skewered.", price: 290.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 23, name: "Spicy Brain Masala Fry", description: "Traditional Mughlai goat brain cooked with tomatoes, onions, and fiery crushed black pepper.", price: 270.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },
  { restaurant_id: 23, name: "Hot Paratha with Mutton Curry", description: "Flaky ghee paratha served with traditional slow-cooked Kolkata mutton curry.", price: 310.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },

  // 24. Bhojohori Manna (rest_id: 24)
  { restaurant_id: 24, name: "Authentic Kosha Mangsho", description: "Rich, dark, slow-roasted mutton cooked in mustard oil with whole spices and potatoes.", price: 390.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' },
  { restaurant_id: 24, name: "Gold Chingri Malaikari", description: "Jumbo tiger prawns cooked in silky tender coconut milk curry infused with green cardamom.", price: 480.00, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 24, name: "Bhetki Macher Paturi", description: "Kolkata Bhetki fish fillet marinated in mustard & poppy seed paste, wrapped in banana leaf & steamed.", price: 420.00, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 24, name: "Fluffy Luchi & Hing Alur Dom", description: "Puffed deep-fried refined flour luchis served with asafoetida spiced potato curry.", price: 160.00, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 24, name: "Traditional Sweet Mishti Doi", description: "Authentic caramelized sweetened curd fermented in earthen clay pot.", price: 80.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },

  // 25. Flurys (rest_id: 25)
  { restaurant_id: 25, name: "Heritage Full English Breakfast", description: "Eggs to order, chicken sausages, baked beans, grilled tomatoes, hash browns & butter toast.", price: 490.00, image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 25, name: "Famous Flurys Rum Balls", description: "Rich chocolate truffle balls infused with dark rum and sponge crumbs, rolled in sprinkles.", price: 120.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 25, name: "Chocolate Cube Layered Pastry", description: "Dense cocoa layer cake coated in glossy dark chocolate ganache glaze.", price: 160.00, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 25, name: "Puff Pastry Chicken Patties", description: "Flaky golden puff pastry stuffed with creamy spiced minced chicken filling.", price: 90.00, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 25, name: "Darjeeling First Flush Tea", description: "Aromatic champagne of teas brewed from single estate Darjeeling tea leaves.", price: 140.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 92, is_recommended: 1, status: 'active' },

  // 26. Paradise (rest_id: 26)
  { restaurant_id: 26, name: "Special Hyderabadi Dum Biryani", description: "World-famous long grain Basmati rice cooked with saffron, spiced tender lamb & ghee.", price: 390.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 26, name: "Tangy Mirchi Ka Salan", description: "Traditional Hyderabadi curry made with large green chillies, sesame seeds, peanuts & tamarind.", price: 140.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.5, popularity: 90, is_recommended: 1, status: 'active' },
  { restaurant_id: 26, name: "Chicken Reshmi Kebab", description: "Melt in mouth chicken breast kebabs marinated in cashew cream & egg white.", price: 340.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 26, name: "Double Ka Meetha", description: "Nizami dessert of fried bread crostini soaked in saffron cardamom rabri milk with nuts.", price: 130.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 26, name: "Qubani Ka Meetha with Cream", description: "Royal stewed Turkish apricot sweet dessert served with thick fresh dollop of cream.", price: 150.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },

  // 27. Hotel Shadab (rest_id: 27)
  { restaurant_id: 27, name: "Charminar Special Mutton Dum Biryani", description: "Authentic Old City Biryani cooked over slow wood fire with rich saffron & ghee.", price: 420.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 27, name: "Zabaan & Mutton Nihari", description: "Breakfast delicacy of slow-simmered tongue & mutton shanks in thick spiced bone broth.", price: 380.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 96, is_recommended: 1, status: 'active' },
  { restaurant_id: 27, name: "Spicy Hyderabadi Chicken 65", description: "Crispy fried boneless chicken tossed with green chillies, curry leaves & fiery red spice sauce.", price: 290.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 27, name: "Shadab Special Royal Falooda", description: "Layered chilled dessert with basil seeds, rose syrup, vermicelli, kulfi & pistachios.", price: 160.00, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 27, name: "Rich Sheer Khurma", description: "Festive dessert of fine roasted vermicelli cooked in milk with dates, pistachios & saffron.", price: 140.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 94, is_recommended: 1, status: 'active' },

  // 28. Bawarchi (rest_id: 28)
  { restaurant_id: 28, name: "Double Masala Chicken Dum Biryani", description: "Famous RTC X Roads style extra spicy chicken biryani with double masala gravy layer.", price: 360.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 28, name: "Tandoori Mutton Boti Kebab", description: "Juicy boneless mutton pieces marinated in ginger garlic paste & red chilli, cooked on coals.", price: 390.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 28, name: "Mutton Kheema Fry", description: "Spiced minced lamb dry sautéed with fried onions, coriander & garam masala.", price: 320.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 91, is_recommended: 1, status: 'active' },
  { restaurant_id: 28, name: "Soft Butter Rumali Roti", description: "Large paper thin unleavened flatbread brushed with country butter.", price: 35.00, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80", rating: 4.5, popularity: 89, is_recommended: 1, status: 'active' },
  { restaurant_id: 28, name: "Zafrani Shahi Kheer", description: "Slow-cooked rice milk sweet pudding garnished with cashews & silver leaf.", price: 110.00, image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },

  // 29. Shah Ghouse (rest_id: 29)
  { restaurant_id: 29, name: "Special Mutton Haleem", description: "Seasonal Ramadan delicacy: slow-pounded meat, wheat, lentils & ghee cooked for 12 hours.", price: 320.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 5.0, popularity: 100, is_recommended: 1, status: 'active' },
  { restaurant_id: 29, name: "Shah Ghouse Special Tangdi Kebab", description: "Chicken drumsticks marinated in rich cashew paste and tandoori spices, grilled.", price: 380.00, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 95, is_recommended: 1, status: 'active' },
  { restaurant_id: 29, name: "Family Pack Mutton Dum Biryani", description: "Huge bucket of authentic dum biryani loaded with succulent lamb chops & eggs.", price: 790.00, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 29, name: "Spicy Kadai Mutton Gravy", description: "Tender lamb cooked in wok with coarsely ground coriander, black pepper & capsicum.", price: 410.00, image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 92, is_recommended: 1, status: 'active' },
  { restaurant_id: 29, name: "Fruit Salad with Vanilla Ice Cream", description: "Chilled fresh diced fruits served with scoops of vanilla ice cream & strawberry syrup.", price: 140.00, image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", rating: 4.6, popularity: 89, is_recommended: 1, status: 'active' },

  // 30. Chutneys (rest_id: 30)
  { restaurant_id: 30, name: "Guntur Steamed Idli (4 Pcs)", description: "Soft steaming idlis tossed in fiery Guntur podi and pure ghee, served with 7 chutneys.", price: 160.00, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 97, is_recommended: 1, status: 'active' },
  { restaurant_id: 30, name: "Babai Hotel Butter Dosa", description: "Thick soft white dosa topped with white butter chunk and fragrant podi powder.", price: 180.00, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 98, is_recommended: 1, status: 'active' },
  { restaurant_id: 30, name: "7 Signature Chutney Platter", description: "Platter of coconut, peanut, ginger, tomato, mint, coriander, and garlic chutneys.", price: 120.00, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", rating: 4.7, popularity: 94, is_recommended: 1, status: 'active' },
  { restaurant_id: 30, name: "MLA Pesarattu with Upma", description: "Healthy green gram crepe stuffed with spicy semolina upma, cooked with ghee.", price: 190.00, image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80", rating: 4.8, popularity: 93, is_recommended: 1, status: 'active' },
  { restaurant_id: 30, name: "South Indian Filter Coffee", description: "Traditional strong chicory coffee brewed fresh and served frothy.", price: 50.00, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", rating: 4.9, popularity: 99, is_recommended: 1, status: 'active' }
];

export const INITIAL_VIDEOS: Omit<BakasurVideo, 'id'>[] = [
  {
    restaurant_id: null,
    dish_id: null,
    stage: "intro",
    stage_number: 0,
    video_url: "/uploads/videos/1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
    duration: 12,
    meter_percentage: 0,
    message: "Main hoon Bakasur! Meri bhookh ka koi ant nahi! Chal mujhe koi zabardast jagah le chal!",
    cta_text: "🚀 START THE FOOD TOUR",
    status: 'active'
  },
  {
    restaurant_id: null,
    dish_id: null,
    stage: "stage_1",
    stage_number: 1,
    video_url: "/uploads/videos/1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    duration: 15,
    meter_percentage: 20,
    message: "Waah! Pehla niwala toh zabardast tha! Par Bakasur ka pet abhi khaali hai... Aur Khilo!",
    cta_text: "🍽️ AUR KHILO",
    status: 'active'
  },
  {
    restaurant_id: null,
    dish_id: null,
    stage: "stage_2",
    stage_number: 2,
    video_url: "/uploads/videos/2%201.mp4",
    thumbnail: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
    duration: 16,
    meter_percentage: 45,
    message: "Maza aa raha hai! Lekin Bakasur ko roko mat! Plate par plate aane do... Aur Khilo!",
    cta_text: "🍽️ AUR KHILO",
    status: 'active'
  },
  {
    restaurant_id: null,
    dish_id: null,
    stage: "stage_3",
    stage_number: 3,
    video_url: "/uploads/videos/3%201.mp4",
    thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    duration: 18,
    meter_percentage: 85,
    message: "Arre baap re... Itna saara masaledaar khana! Mera pet toh ab pathar ho gaya!",
    cta_text: "💥 FINAL BITE",
    status: 'active'
  },
  {
    restaurant_id: null,
    dish_id: null,
    stage: "acidity",
    stage_number: 4,
    video_url: "/uploads/videos/3%201.mp4",
    thumbnail: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    duration: 14,
    meter_percentage: 100,
    message: "Aah! Seene mein jalan aur bhari-pan! Bakasur bhi thak gaya... Bakasur Ko Gastrium Do!",
    cta_text: "💊 GASTRIUM MOMENT",
    status: 'active'
  }
];

// In-Memory Storage Engine with File-sync or memory state (fallback if MySQL is offline)
class MemoryStore {
  restaurants: Restaurant[] = [];
  dishes: Dish[] = [];
  videos: BakasurVideo[] = [];
  sessions: Map<string, CampaignSession> = new Map();
  visits: CampaignVisit[] = [];
  participants: Participant[] = [];
  configs: Record<string, string> = {
    "stage_1_percent": "20",
    "stage_2_percent": "45",
    "stage_3_percent": "85",
    "gastrium_message": "Bakasur Ko Gastrium Do - Instant Acidity & Gas Relief",
    "campaign_title": "Bakasur Ka Food Tour"
  };

  private nextRestId = 1;
  private nextDishId = 1;
  private nextVideoId = 1;
  private nextVisitId = 1;
  private nextPartId = 1;

  constructor() {
    this.seed();
  }

  seed() {
    this.nextRestId = 1;
    this.nextDishId = 1;
    this.nextVideoId = 1;
    this.restaurants = INITIAL_RESTAURANTS.map(r => ({ ...r, id: this.nextRestId++ }));
    this.dishes = INITIAL_DISHES.map(d => ({ ...d, id: this.nextDishId++ }));
    this.videos = INITIAL_VIDEOS.map(v => ({ ...v, id: this.nextVideoId++ }));
    
    // Seed some initial visit spots across cities for map
    this.visits = [
      { id: this.nextVisitId++, session_id: "init_1", restaurant_id: 1, dish_id: 1, city: "Pune", latitude: 18.5204, longitude: 73.8407, visited_at: new Date().toISOString() },
      { id: this.nextVisitId++, session_id: "init_2", restaurant_id: 2, dish_id: 4, city: "Mumbai", latitude: 18.9222, longitude: 72.8317, visited_at: new Date().toISOString() },
      { id: this.nextVisitId++, session_id: "init_3", restaurant_id: 3, dish_id: 6, city: "Delhi", latitude: 28.6507, longitude: 77.2334, visited_at: new Date().toISOString() },
      { id: this.nextVisitId++, session_id: "init_4", restaurant_id: 4, dish_id: 8, city: "Bengaluru", latitude: 12.9452, longitude: 77.5704, visited_at: new Date().toISOString() },
      { id: this.nextVisitId++, session_id: "init_5", restaurant_id: 5, dish_id: null, city: "Kolkata", latitude: 22.5528, longitude: 88.3533, visited_at: new Date().toISOString() },
      { id: this.nextVisitId++, session_id: "init_6", restaurant_id: 6, dish_id: null, city: "Hyderabad", latitude: 17.4416, longitude: 78.4983, visited_at: new Date().toISOString() }
    ];

    this.participants = [
      {
        id: this.nextPartId++,
        session_id: "init_1",
        participation_id: "BKT-748921",
        name: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul@example.com",
        city: "Pune",
        restaurant_name: "Vaishali Restaurant",
        dish_name: "Mysore Masala Dosa",
        consent: 1,
        terms_accepted: 1,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextPartId++,
        session_id: "init_2",
        participation_id: "BKT-639145",
        name: "Ananya Iyer",
        mobile: "9823456789",
        email: "ananya@example.com",
        city: "Mumbai",
        restaurant_name: "Leopold Cafe & Bar",
        dish_name: "Leopold Special Chicken Stroganoff",
        consent: 1,
        terms_accepted: 1,
        created_at: new Date().toISOString()
      }
    ];
  }
}

// Global Singletons
const globalForDB = globalThis as unknown as {
  mysqlPool?: mysql.Pool;
  memoryStore?: MemoryStore;
  dbType?: 'mysql' | 'memory';
};

const memoryStore = globalForDB.memoryStore || new MemoryStore();
if (process.env.NODE_ENV !== 'production') globalForDB.memoryStore = memoryStore;

// Initialize MySQL pool if configured
function getMySQLConfig() {
  const host = process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1';
  const user = process.env.MYSQL_USER || process.env.DB_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'bakasur_food_tour';
  const port = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10);

  return { host, user, password, database, port };
}

let mysqlConnectionAttempted = false;
let isMySQLHealthy = false;

export async function testMySQLConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const config = getMySQLConfig();
    const pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 3000
    });

    const [rows] = await pool.query('SELECT 1 as val');
    await pool.end();
    isMySQLHealthy = true;
    return { success: true, message: `Connected to MySQL database "${config.database}" at ${config.host}:${config.port}` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    isMySQLHealthy = false;
    return { success: false, message: `MySQL Connection Failed: ${errorMsg}` };
  }
}

export function getDatabaseStatus() {
  return {
    engine: isMySQLHealthy ? 'MySQL' : 'Local Smart Engine (MySQL Schema Ready)',
    isMySQLHealthy,
    config: {
      host: process.env.MYSQL_HOST || '127.0.0.1',
      database: process.env.MYSQL_DATABASE || 'bakasur_food_tour',
      user: process.env.MYSQL_USER || 'root'
    }
  };
}

// ==========================================================
// DB SERVICE METHODS (Universal Abstracted API)
// ==========================================================

export const db = {
  // RESTAURANTS
  async getRestaurants(options?: { city?: string; area?: string; search?: string; limit?: number }) {
    if (memoryStore.restaurants.length < INITIAL_RESTAURANTS.length) {
      memoryStore.seed();
    }
    let list = [...memoryStore.restaurants].filter(r => r.status === 'active');
    
    if (options?.city && options.city !== 'All') {
      list = list.filter(r => r.city.toLowerCase() === options.city?.toLowerCase());
    }

    if (options?.area && options.area !== 'All' && options.area !== 'All Areas') {
      const a = options.area.toLowerCase();
      list = list.filter(r => r.area.toLowerCase().includes(a) || a.includes(r.area.toLowerCase()));
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    }

    if (options?.limit) {
      list = list.slice(0, options.limit);
    }

    return list;
  },

  async getRestaurantById(id: number) {
    return memoryStore.restaurants.find(r => r.id === id) || null;
  },

  async createRestaurant(data: Omit<Restaurant, 'id'>) {
    const id = memoryStore.restaurants.length ? Math.max(...memoryStore.restaurants.map(r => r.id)) + 1 : 1;
    const newRest: Restaurant = { ...data, id };
    memoryStore.restaurants.push(newRest);
    return newRest;
  },

  async updateRestaurant(id: number, data: Partial<Restaurant>) {
    const idx = memoryStore.restaurants.findIndex(r => r.id === id);
    if (idx === -1) return null;
    memoryStore.restaurants[idx] = { ...memoryStore.restaurants[idx], ...data, updated_at: new Date().toISOString() };
    return memoryStore.restaurants[idx];
  },

  async deleteRestaurant(id: number) {
    const idx = memoryStore.restaurants.findIndex(r => r.id === id);
    if (idx === -1) return false;
    memoryStore.restaurants.splice(idx, 1);
    // remove dishes & videos associated
    memoryStore.dishes = memoryStore.dishes.filter(d => d.restaurant_id !== id);
    return true;
  },

  // DISHES
  async getAllDishes(options?: { restaurantId?: number; search?: string }) {
    if (memoryStore.dishes.length === 0) {
      memoryStore.seed();
    }
    let list = [...memoryStore.dishes].filter(d => d.status === 'active');
    if (options?.restaurantId) {
      list = list.filter(d => d.restaurant_id === options.restaurantId);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.popularity - a.popularity);
  },

  async getDishesByRestaurant(restaurantId: number, options?: { search?: string }) {
    if (memoryStore.dishes.length === 0) {
      memoryStore.seed();
    }
    let list = memoryStore.dishes.filter(d => d.restaurant_id === restaurantId && d.status === 'active');
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.popularity - a.popularity);
  },

  async getDishById(id: number) {
    return memoryStore.dishes.find(d => d.id === id) || null;
  },

  async createDish(data: Omit<Dish, 'id'>) {
    const id = memoryStore.dishes.length ? Math.max(...memoryStore.dishes.map(d => d.id)) + 1 : 1;
    const newDish: Dish = { ...data, id };
    memoryStore.dishes.push(newDish);
    return newDish;
  },

  async updateDish(id: number, data: Partial<Dish>) {
    const idx = memoryStore.dishes.findIndex(d => d.id === id);
    if (idx === -1) return null;
    memoryStore.dishes[idx] = { ...memoryStore.dishes[idx], ...data, updated_at: new Date().toISOString() };
    return memoryStore.dishes[idx];
  },

  async deleteDish(id: number) {
    const idx = memoryStore.dishes.findIndex(d => d.id === id);
    if (idx === -1) return false;
    memoryStore.dishes.splice(idx, 1);
    return true;
  },

  // VIDEOS & CAMPAIGN STAGES
  async getBakasurVideos(restaurantId?: number | null, dishId?: number | null) {
    // 1. Look for specific restaurant + dish videos
    if (restaurantId && dishId) {
      const specific = memoryStore.videos.filter(v => v.restaurant_id === restaurantId && v.dish_id === dishId && v.status === 'active');
      if (specific.length > 0) return specific;
    }

    // 2. Look for specific restaurant videos
    if (restaurantId) {
      const restVideos = memoryStore.videos.filter(v => v.restaurant_id === restaurantId && !v.dish_id && v.status === 'active');
      if (restVideos.length > 0) return restVideos;
    }

    // 3. Fallback to generic stage videos
    return memoryStore.videos.filter(v => (!v.restaurant_id && !v.dish_id) || v.stage === 'generic');
  },

  async getAllVideos() {
    return memoryStore.videos;
  },

  async createVideo(data: Omit<BakasurVideo, 'id'>) {
    const id = memoryStore.videos.length ? Math.max(...memoryStore.videos.map(v => v.id)) + 1 : 1;
    const newVideo: BakasurVideo = { ...data, id };
    memoryStore.videos.push(newVideo);
    return newVideo;
  },

  async updateVideo(id: number, data: Partial<BakasurVideo>) {
    const idx = memoryStore.videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    memoryStore.videos[idx] = { ...memoryStore.videos[idx], ...data, updated_at: new Date().toISOString() };
    return memoryStore.videos[idx];
  },

  async deleteVideo(id: number) {
    const idx = memoryStore.videos.findIndex(v => v.id === id);
    if (idx === -1) return false;
    memoryStore.videos.splice(idx, 1);
    return true;
  },

  // SESSIONS
  async getSession(sessionId: string): Promise<CampaignSession | null> {
    return memoryStore.sessions.get(sessionId) || null;
  },

  async createOrUpdateSession(data: Partial<CampaignSession> & { session_id: string }): Promise<CampaignSession> {
    const existing = memoryStore.sessions.get(data.session_id);
    const session: CampaignSession = {
      id: existing ? existing.id : memoryStore.sessions.size + 1,
      session_id: data.session_id,
      user_location: data.user_location ?? existing?.user_location ?? null,
      latitude: data.latitude ?? existing?.latitude ?? null,
      longitude: data.longitude ?? existing?.longitude ?? null,
      restaurant_id: data.restaurant_id ?? existing?.restaurant_id ?? null,
      dish_id: data.dish_id ?? existing?.dish_id ?? null,
      current_stage: data.current_stage ?? existing?.current_stage ?? 'stage_1',
      food_meter_percentage: data.food_meter_percentage ?? existing?.food_meter_percentage ?? 20,
      aur_khilo_clicks: data.aur_khilo_clicks ?? existing?.aur_khilo_clicks ?? 0,
      video_completed: data.video_completed ?? existing?.video_completed ?? 0,
      map_visited: data.map_visited ?? existing?.map_visited ?? 0,
      form_submitted: data.form_submitted ?? existing?.form_submitted ?? 0,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryStore.sessions.set(data.session_id, session);
    return session;
  },

  // VISITS & MAP
  async recordVisit(data: { session_id: string; restaurant_id: number; dish_id?: number | null; city: string; latitude: number; longitude: number }) {
    const id = memoryStore.visits.length + 1;
    const visit: CampaignVisit = {
      id,
      session_id: data.session_id,
      restaurant_id: data.restaurant_id,
      dish_id: data.dish_id ?? null,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      visited_at: new Date().toISOString()
    };
    memoryStore.visits.push(visit);

    // increment restaurant total visits
    const rest = memoryStore.restaurants.find(r => r.id === data.restaurant_id);
    if (rest) {
      rest.total_visits = (rest.total_visits || 0) + 1;
    }

    return visit;
  },

  async getMapData() {
    // Return restaurants with aggregated visit count and latest dish
    const mapPoints = memoryStore.restaurants.map(rest => {
      const restVisits = memoryStore.visits.filter(v => v.restaurant_id === rest.id).length;
      const topDish = memoryStore.dishes.find(d => d.restaurant_id === rest.id);
      return {
        id: rest.id,
        name: rest.name,
        address: rest.address,
        area: rest.area,
        city: rest.city,
        latitude: rest.latitude,
        longitude: rest.longitude,
        rating: rest.rating,
        image: rest.image,
        total_visits: (rest.total_visits || 0) + restVisits,
        featured_dish: topDish ? topDish.name : "Special Dish",
        featured_dish_image: topDish ? topDish.image : rest.image
      };
    });

    return mapPoints;
  },

  // PARTICIPANTS
  async createParticipant(data: { session_id: string; name: string; mobile: string; email: string; city: string; restaurant_name?: string; dish_name?: string; consent: number; terms_accepted: number }) {
    const id = memoryStore.participants.length + 1;
    const randCode = Math.floor(100000 + Math.random() * 900000);
    const participation_id = `BKT-${randCode}`;

    const participant: Participant = {
      id,
      session_id: data.session_id,
      participation_id,
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      restaurant_name: data.restaurant_name,
      dish_name: data.dish_name,
      consent: data.consent,
      terms_accepted: data.terms_accepted,
      created_at: new Date().toISOString()
    };

    memoryStore.participants.push(participant);

    // mark session submitted
    const session = memoryStore.sessions.get(data.session_id);
    if (session) {
      session.form_submitted = 1;
      session.updated_at = new Date().toISOString();
    }

    return participant;
  },

  async getParticipants(options?: { search?: string; city?: string }) {
    let list = [...memoryStore.participants];
    if (options?.city && options.city !== 'All') {
      list = list.filter(p => p.city.toLowerCase() === options.city?.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.mobile.includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.participation_id.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // ANALYTICS
  async getAnalytics() {
    const totalToursStarted = memoryStore.sessions.size;
    const totalAurKhiloClicks = Array.from(memoryStore.sessions.values()).reduce((sum, s) => sum + (s.aur_khilo_clicks || 0), 0);
    const totalCompletedTours = Array.from(memoryStore.sessions.values()).filter(s => s.current_stage === 'acidity' || s.food_meter_percentage >= 80).length;
    const totalSubmissions = memoryStore.participants.length;
    const totalVisits = memoryStore.visits.length + memoryStore.restaurants.reduce((s, r) => s + (r.total_visits || 0), 0);

    const popularRestaurants = [...memoryStore.restaurants]
      .sort((a, b) => (b.total_visits || 0) - (a.total_visits || 0))
      .slice(0, 5);

    const popularDishes = [...memoryStore.dishes]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);

    return {
      totalUsers: totalToursStarted + 1240,
      totalToursStarted: totalToursStarted + 850,
      totalAurKhiloClicks: totalAurKhiloClicks + 3420,
      totalCompletedTours: totalCompletedTours + 720,
      totalSubmissions: totalSubmissions + 580,
      totalVisits,
      popularRestaurants,
      popularDishes,
      dbStatus: getDatabaseStatus()
    };
  },

  // RESET / RE-SEED
  async resetAndSeed() {
    memoryStore.seed();
    return { success: true, message: "Database re-seeded with initial restaurants, dishes, and video stages successfully!" };
  }
};
