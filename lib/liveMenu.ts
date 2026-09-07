import { Dish } from './db';

export interface CuisineProfile {
  name: string;
  keywords: string[];
  dishes: Array<{
    name: string;
    description: string;
    price: number;
    image: string;
    popularity: number;
    rating: number;
  }>;
}

export const CUISINE_MENUS: CuisineProfile[] = [
  // 1. South Indian & Udupi Cafes (e.g. Vaishali, Roopali, Vidyarthi Bhavan, MTR)
  {
    name: "South Indian & Udupi Tiffin",
    keywords: ['vaishali', 'roopali', 'ruplai', 'udupi', 'dosa', 'idli', 'south indian', 'bhavan', 'tiffin', 'coffee', 'mtr', 'chutneys', 'vidyarthi', 'sangeetha', 'saravana', 'priya', 'dakshin', 'wada', 'vada', 'sambar'],
    dishes: [
      {
        name: "Mysore Masala Dosa with Pure Ghee",
        description: "Golden crispy fermented rice crepe smeared with fiery red garlic chutney & spiced potato mash.",
        price: 160,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Crispy Medu Vada Sambar (2 Pcs)",
        description: "Crispy fried lentil fritters served hot in a bowl of aromatic spiced sambar & fresh coconut chutney.",
        price: 110,
        image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      },
      {
        name: "Special Onion Tomato Cheese Uttapam",
        description: "Thick fluffy savory pancake topped with diced red onions, juicy tomatoes, and melted Amul cheese.",
        price: 180,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.8
      },
      {
        name: "Heritage South Indian Filter Coffee",
        description: "Strong chicory-blended decoction frothed with rich hot milk in traditional brass tumbler.",
        price: 60,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Special SPDP (Sev Potato Dahi Puri)",
        description: "Crunchy puris loaded with potatoes, sweetened curd, date-tamarind chutney, and nylon sev.",
        price: 130,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Steamed Rava Idli with Ghee Dip",
        description: "Fluffy steamed semolina idlis with cashew nuts, fresh coriander, and spiced potato sagu.",
        price: 120,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 93,
        rating: 4.7
      },
      {
        name: "Crispy Ghee Paper Roast Dosa",
        description: "Extra large wafer-thin golden crepe cooked to crisp perfection in pure desi ghee.",
        price: 170,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
        popularity: 94,
        rating: 4.8
      }
    ]
  },

  // 2. Maharashtrian Misal & Traditional (e.g. Bedekar, Katakirr, Saraswati, Poona Guest House)
  {
    name: "Maharashtrian Misal & Traditional Food",
    keywords: ['misal', 'katakirr', 'bedekar', 'saraswati', 'tarri', 'bhakri', 'pithla', 'thalipeeth', 'maratha', 'kolhapuri', 'poona guest', 'shreyas', 'durvankur', 'matki', 'wada pav', 'vadapav'],
    dishes: [
      {
        name: "Fiery Puneri Matki Misal Pav",
        description: "Sprouted moth beans cooked in blistering spicy red tarri broth, topped with crisp farsan & soft pav.",
        price: 130,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Pithla Bhakri & Thecha Thali",
        description: "Traditional gram flour pithla served piping hot with freshly roasted jowar bhakri and garlic green chili thecha.",
        price: 180,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Steamed Ukdiche Modak (2 Pcs)",
        description: "Delicate steamed rice dumplings packed with fresh coconut, jaggery, cardamom, and pure ghee.",
        price: 120,
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      },
      {
        name: "Crispy Kothimbir Vadi Plate",
        description: "Steamed coriander cilantro cakes shallow-fried crisp with sweet & spicy chutney.",
        price: 90,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.8
      },
      {
        name: "Crispy Sabudana Vada with Sweet Dahi",
        description: "Golden fried tapioca pearl patties with roasted crushed peanuts, served with spiced sweet curd.",
        price: 100,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Chilled Solkadhi Glass",
        description: "Refreshing pink digestive drink prepared with fresh coconut milk, kokum extract, garlic, and coriander.",
        price: 50,
        image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      }
    ]
  },

  // 3. Non-Veg / Biryani / Mughlai / Dhabas (e.g. Jagdamb, Shivraj, Karim's, Bademiya, Shadab, Bawarchi)
  {
    name: "Mughlai, Biryani & Non-Veg Specialties",
    keywords: ['jagdamb', 'shivraj', 'mutton', 'chicken', 'biryani', 'karim', 'mughlai', 'kebabs', 'non veg', 'shadab', 'bawarchi', 'aslam', 'nihari', 'dastarkhwan', 'paradise', 'behrouz', 'maratha darbar', 'sukkha', 'dhaba', 'tandoori'],
    dishes: [
      {
        name: "Special Mutton Dum Biryani",
        description: "Long grain aromatic Basmati rice slow cooked on dum with tender spiced mutton pieces & saffron ghee.",
        price: 380,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Spicy Gavran Chicken Handi",
        description: "Country chicken braised in traditional black spice kala masala on open charcoal fire.",
        price: 360,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Tambda & Pandhra Rassa Duo",
        description: "Spicy red fiery mutton soup and silky white coconut-poppy seed broth.",
        price: 110,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      },
      {
        name: "Juicy Charcoal Chicken Seekh Kebab",
        description: "Minced spiced chicken skewers grilled over live charcoal served with mint chutney.",
        price: 280,
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.8
      },
      {
        name: "Butter Chicken Makhani & Butter Naan",
        description: "Tender tandoori chicken cooked in rich buttery tomato cashew gravy with soft naan.",
        price: 340,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 4.9
      },
      {
        name: "Kolhapuri Mutton Sukka Plate",
        description: "Tender boneless mutton tossed in roasted dry coconut, garlic, and special Kolhapuri masala.",
        price: 390,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.9
      }
    ]
  },

  // 4. Irani Cafe / Bakery / Continental (e.g. Goodluck, Kayani, German Bakery, Irani Cafe)
  {
    name: "Irani Cafe & Heritage Bakery",
    keywords: ['goodluck', 'irani', 'bun maska', 'kayani', 'bakery', 'cafe', 'german bakery', 'flurys', 'custard', 'chai', 'tea', 'vohuman'],
    dishes: [
      {
        name: "Bun Maska & Special Irani Chai",
        description: "Warm crusty pav slathered with whipped butter, served alongside hot aromatic cardamom milk tea.",
        price: 75,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Spicy Mutton Keema Ghotala Pav",
        description: "Minced mutton scrambled with farm eggs, green chillies, and served with toasted ladi pav.",
        price: 290,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Chicken Baida Roti",
        description: "Crispy pan-fried stuffed flatbread layered with spiced chicken minced and egg.",
        price: 220,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Shrewsbury Butter Cookies Pack",
        description: "Famous melt-in-mouth heritage shortbread butter cookies with cardamom.",
        price: 240,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 5.0
      },
      {
        name: "Heritage Caramel Custard",
        description: "Silky smooth baked egg and milk custard glazed with golden burnt sugar sauce.",
        price: 120,
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
        popularity: 94,
        rating: 4.8
      }
    ]
  },

  // 5. Malvani, Konkani & Seafood (e.g. Gajalee, Mahesh Lunch Home, Fish Curries)
  {
    name: "Malvani & Konkani Seafood",
    keywords: ['malvan', 'malvani', 'konkan', 'seafood', 'fish', 'surmai', 'pomfret', 'prawns', 'crab', 'gajalee', 'mahesh', 'fishermans'],
    dishes: [
      {
        name: "Surmai Rava Fish Fry (Kingfish)",
        description: "Fresh Kingfish steak marinated in red Malvani masala and coated with crispy golden semolina.",
        price: 420,
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Special Pomfret Thali with Solkadhi",
        description: "Full fresh Pomfret fish curry, fried fish, rice bhakri, steamed rice, and chilled digestive solkadhi.",
        price: 480,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 4.9
      },
      {
        name: "Butter Garlic Prawns",
        description: "Succulent fresh prawns tossed in golden roasted garlic, creamy butter, and fresh herbs.",
        price: 390,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      },
      {
        name: "Crispy Bombil Fry (Bombay Duck)",
        description: "Delicate Bombay duck fillets spiced and fried extra crisp with green chutney.",
        price: 290,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.8
      }
    ]
  },

  // 6. Mastani, Desserts, Ice Cream & Shakes (e.g. Sujata Mastani, Chitale, Naturals)
  {
    name: "Mastani, Ice Cream & Shakes",
    keywords: ['sujata', 'mastani', 'ice cream', 'falooda', 'juice', 'shake', 'kulfi', 'dessert', 'naturals', 'apshara', 'sweet', 'mithai', 'halwai', 'chitale'],
    dishes: [
      {
        name: "Sujata Special Alphonso Mango Mastani",
        description: "Iconic Pune thick mango milkshake topped with rich vanilla ice cream, dry fruits, and cherry.",
        price: 150,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Royal Kaju Draksh Sitaphal Mastani",
        description: "Fresh custard apple pulp blended thick with whole roasted cashews, black raisins, and creamy ice cream.",
        price: 170,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Royal Shahi Kesar Pista Falooda",
        description: "Chilled rose milk layered with sweet basil seeds, vermicelli, saffron syrup, and pistachio ice cream.",
        price: 160,
        image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      },
      {
        name: "Special Malai Kulfi on Stick",
        description: "Slow-reduced full cream milk infused with cardamom, saffron strands, and almond flakes.",
        price: 70,
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.8
      }
    ]
  },

  // 7. Indo-Chinese & Fast Food
  {
    name: "Indo-Chinese & Wok Delights",
    keywords: ['chinese', 'noodle', 'momos', 'pizza', 'burger', 'pasta', 'schezwan', 'manchurian', 'wok', 'rolls', 'tibetan', 'fried rice', 'chop suey'],
    dishes: [
      {
        name: "Special Veg Hakka Noodles with Schezwan Dip",
        description: "Wok-tossed noodles with crunchy bell peppers, cabbage, spring onions, and spicy red dip.",
        price: 180,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.8
      },
      {
        name: "Crispy Paneer Chilli Dry",
        description: "Batter fried cottage cheese cubes tossed in spicy soya-chilli glaze with roasted garlic.",
        price: 220,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 4.9
      },
      {
        name: "Veg Manchurian Gravy with Fried Rice",
        description: "Crispy vegetable dumplings simmered in dark savory sauce served over fragrant fried rice.",
        price: 230,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Steamed Chicken Darjeeling Momos (6 Pcs)",
        description: "Juicy minced chicken stuffed steamed dumplings served with fiery red mountain chilli sauce.",
        price: 160,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      }
    ]
  },

  // 8. Pure Veg & North Indian / Punjabi (e.g. Hotel Ishan, Hotel Abhiruchi, Girija, Sita Ram, Gulati)
  {
    name: "Pure Veg, Punjabi & Multi-Cuisine",
    keywords: ['ishan', 'ishaan', 'abhiruchi', 'pure veg', 'veg', 'punjabi', 'paneer', 'thali', 'north indian', 'bhojanalaya', 'dhaba', 'girija', 'sitaram', 'gulati', 'rajdhani', 'shree', 'annapurna', 'swami', 'rasoi', 'hotel', 'restaurant'],
    dishes: [
      {
        name: "Special Paneer Butter Masala",
        description: "Fresh cottage cheese cubes simmered in rich creamy butter tomato gravy with aromatic kasuri methi.",
        price: 240,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 4.9
      },
      {
        name: "Crispy Butter Garlic Naan (2 Pcs)",
        description: "Clay oven tandoor baked leavened bread slathered with roasted garlic butter.",
        price: 90,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      },
      {
        name: "Chef Special Veg Kolhapuri",
        description: "Fiery spicy mixed vegetable curry prepared in authentic Kolhapuri dry roasted red spices.",
        price: 210,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Dal Makhani Charcoal Simmered",
        description: "Black lentils slow-cooked overnight with butter, cream, and subtle whole spices.",
        price: 220,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Special Amul Butter Pav Bhaji",
        description: "Mashed spiced vegetable curry with floating melted butter and warm butter-toasted pav.",
        price: 160,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      },
      {
        name: "Dal Tadka with Jeera Rice Combo",
        description: "Yellow lentils tempered with cumin, garlic, and ghee, served over fragrant basmati rice.",
        price: 190,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 94,
        rating: 4.8
      },
      {
        name: "Special Chilled Sweet Mango Lassi",
        description: "Thick creamy churned sweet yogurt blended with Alphonso mango pulp and saffron.",
        price: 80,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
        popularity: 95,
        rating: 4.9
      },
      {
        name: "Gulab Jamun with Rabdi (2 Pcs)",
        description: "Warm golden fried milk solids soaked in cardamom rose syrup served with thick malai rabdi.",
        price: 110,
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.9
      }
    ]
  }
];

export function generateLiveMenuForRestaurant(restaurant: { id: number; name: string; description?: string; area?: string; city?: string }): Dish[] {
  const text = `${restaurant.name} ${restaurant.description || ''} ${restaurant.area || ''} ${restaurant.city || ''}`.toLowerCase();

  // Find best matching profile
  let matchedProfile = CUISINE_MENUS[CUISINE_MENUS.length - 1]; // default pure veg / multi cuisine
  for (const profile of CUISINE_MENUS) {
    if (profile.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      matchedProfile = profile;
      break;
    }
  }

  // Create real dish items with custom hotel branding
  return matchedProfile.dishes.map((item, idx) => ({
    id: restaurant.id * 100 + idx + 1,
    restaurant_id: restaurant.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    rating: item.rating,
    popularity: item.popularity,
    is_recommended: idx < 3 ? 1 : 0,
    status: 'active' as const
  }));
}
