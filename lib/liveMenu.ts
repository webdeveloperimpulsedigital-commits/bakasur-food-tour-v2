import { Dish } from './db';

export interface DishTemplate {
  name: string;
  description: string;
  price: number;
  image: string;
  popularity: number;
  rating: number;
}

export interface CuisineProfile {
  name: string;
  keywords: string[];
  dishes: DishTemplate[];
}

// 1. EXACT SIGNATURE DISHES FOR ICONIC RESTAURANTS ACROSS INDIA
export const ICONIC_RESTAURANT_DISHES: Record<string, DishTemplate[]> = {
  // Gajanan Vadapav (Thane)
  'gajanan': [
    {
      name: "Gajanan Special Yellow Chutney Vada Pav (2 Pcs)",
      description: "Thane's iconic golden potato vada stuffed in soft ladi pav, drenched in legendary spicy-tangy yellow besan chutney.",
      price: 50,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Crispy Kothimbir Vadi Plate",
      description: "Steamed fresh coriander cilantro diamond cakes shallow-fried crisp with sweet & spicy dip.",
      price: 80,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Crispy Sabudana Vada with Sweet Dahi",
      description: "Golden fried tapioca pearl patties with roasted crushed peanuts and spiced sweet curd.",
      price: 90,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.8
    },
    {
      name: "Spicy Schezwan Cheese Vada Pav",
      description: "Loaded with melted mozzarella cheese, fiery schezwan sauce, and garlic chutney.",
      price: 90,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 95,
      rating: 4.8
    }
  ],

  // Mamledar Misal (Thane)
  'mamledar': [
    {
      name: "Mamledar Famous Fiery Rassa Misal Pav",
      description: "Thane Zilla Parishad's legendary 1946 fiery red cut tarri misal topped with crispy farsan, onion, and soft pav.",
      price: 130,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Mamledar Medium Spicy Matki Misal",
      description: "Balanced spiced sprouted moth bean misal served with extra crunchy farsan bowl and toasted pav.",
      price: 120,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Chilled Kokum Solkadhi Glass",
      description: "Refreshing pink digestive cooler made with coconut milk, kokum extract, garlic, and green chillies.",
      price: 50,
      image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Prashant Corner (Thane)
  'prashant corner': [
    {
      name: "Prashant Corner Shahi Kaju Katli (250g)",
      description: "Thane's celebrated melt-in-mouth diamond cashew fudge made with premium Goan cashews.",
      price: 260,
      image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Traditional Puran Poli with Pure Desi Ghee",
      description: "Warm golden flatbread stuffed with cardamom chana dal jaggery stuffing, slathered in pure ghee.",
      price: 140,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Special Dahi Sev Batata Puri Chaat",
      description: "Crispy puris layered with spiced potato mash, sweetened chilled curd, tamarind glaze, and sev.",
      price: 120,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.8
    }
  ],

  // Vaishali (FC Road Pune)
  'vaishali': [
    {
      name: "Vaishali Special Mysore Masala Dosa",
      description: "FC Road's iconic golden fermented rice crepe smeared with fiery red garlic paste & spiced potato mash.",
      price: 160,
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Vaishali Signature SPDP (Sev Potato Dahi Puri)",
      description: "Legendary Pune student snack: crispy puris filled with potatoes, sweetened curd, date chutney & mountain of sev.",
      price: 130,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Heritage South Indian Filter Coffee",
      description: "Strong chicory-blended decoction frothed with rich hot milk in traditional brass tumbler.",
      price: 60,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Cafe Goodluck (Deccan Pune)
  'goodluck': [
    {
      name: "Goodluck Bun Maska & Special Irani Chai",
      description: "Deccan's 1935 classic: crusty bun slathered with salted whipped butter and steaming hot cardamom Irani tea.",
      price: 75,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Goodluck Famous Mutton Keema Ghotala Pav",
      description: "Minced spiced mutton scrambled with farm eggs, green chillies, and served with toasted ladi pav.",
      price: 290,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 99,
      rating: 5.0
    },
    {
      name: "Chicken Baida Roti",
      description: "Crispy pan-fried flatbread layered with spiced chicken mince and egg wrap.",
      price: 220,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      popularity: 96,
      rating: 4.8
    }
  ],

  // Sujata Mastani (Pune)
  'sujata': [
    {
      name: "Sujata Special Alphonso Mango Mastani",
      description: "Pune's original thick Alphonso mango milkshake topped with rich vanilla ice cream, dry fruits, and cherry.",
      price: 150,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Royal Kaju Draksh Sitaphal Mastani",
      description: "Custard apple pulp blended thick with whole roasted cashews, black raisins, and creamy ice cream.",
      price: 170,
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Kesar Pista Special Shake",
      description: "Aromatic Kashmiri saffron thick milk blend topped with generous crushed green pistachios.",
      price: 160,
      image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
      popularity: 96,
      rating: 4.8
    }
  ],

  // Hotel Jagdamb (Pune)
  'jagdamb': [
    {
      name: "Jagdamb Special Gavran Mutton Thali",
      description: "Legendary spicy Gavran mutton thali with mutton sukka, Tambda rassa, Pandhra rassa & hot jowar bhakri.",
      price: 420,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Kala Masala Chicken Handi with Bhakri",
      description: "Country chicken simmered in traditional roasted black spices on open charcoal fire.",
      price: 380,
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Tambda & Pandhra Rassa Bowl Duo",
      description: "Spicy red fiery mutton soup and silky white coconut-poppy seed broth.",
      price: 120,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.8
    }
  ],

  // Shivraj Hotel (Pune)
  'shivraj': [
    {
      name: "Shivraj World Famous Raavan Mutton Thali",
      description: "Giant non-veg feast platter with mutton chops, kheema, chicken handi, 5 rassas, bhakri & biryani.",
      price: 990,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Bullet Chicken Special Thali",
      description: "Spicy country chicken handi, chicken sukka, tambda rassa, pandhra rassa, rice & hot jowar bhakri.",
      price: 390,
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Tandoori Surmai Fish Fry",
      description: "Fresh kingfish steak coated in Kolhapuri spices and rawa fried crisp in pure coconut oil.",
      price: 480,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Agashiye (Ahmedabad, Gujarat)
  'agashiye': [
    {
      name: "Agashiye Grand Royal Gujarati Thali",
      description: "The House of MG's celebrated 20+ item royal Gujarati feast: Farsan, Rasawala Shaak, Kadhi, Rotli & Aamras.",
      price: 580,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Traditional Surati Undhiyu with Puri",
      description: "Heritage winter mixed vegetable casserole slow-cooked in earthen pot with methi muthiyas and hot puris.",
      price: 240,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Authentic Fafda Jalebi & Sambharo Plate",
      description: "Crispy fafda paired with hot crunchy saffron jalebi, fried chillies, and papaya sambharo.",
      price: 140,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Das Khaman (Surat / Ahmedabad, Gujarat)
  'das khaman': [
    {
      name: "Das Famous Spongy Nylon Khaman",
      description: "Ahmedabad's 1922 institution world-famous for super soft, juicy steamed gram flour khaman tempered with mustard & curry leaves.",
      price: 80,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Special Surati Locho with Butter & Sev",
      description: "Steamed seasoned gram flour delicacy topped with melting butter, green garlic chutney, and crispy nylon sev.",
      price: 90,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 99,
      rating: 5.0
    },
    {
      name: "Authentic Fafda Jalebi Plate",
      description: "Crispy gram flour fafda with golden crunchy saffron jalebis and fried green chillies.",
      price: 130,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    }
  ],

  // Rawat Mishthan Bhandar (Jaipur, Rajasthan)
  'rawat': [
    {
      name: "Rawat World Famous Spicy Pyaaz Kachori (2 Pcs)",
      description: "Jaipur's iconic flaky golden pastry stuffed with spicy caramelized onion masala, served with tamarind chutney.",
      price: 80,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Royal Dal Baati Churma with Desi Ghee",
      description: "Baked whole wheat baatis crushed in pure desi ghee, served with spicy panchmel dal and sweet dry fruit churma.",
      price: 280,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 99,
      rating: 5.0
    },
    {
      name: "Shahi Malai Ghevar with Saffron Rabdi",
      description: "Honeycomb textured Rajasthani festive dessert soaked in cardamom sugar syrup crowned with thick malai.",
      price: 160,
      image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    }
  ],

  // Chokhi Dhani (Jaipur, Rajasthan)
  'chokhi dhani': [
    {
      name: "Chokhi Dhani Royal Dal Baati Churma Feast",
      description: "Heritage village royal platter: Baatis soaked in country ghee, Panchmel Dal, Churma, Gatte Ki Sabzi & Ker Sangri.",
      price: 490,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Authentic Gatte Ki Sabzi with Bajra No Rotlo",
      description: "Gram flour roundels simmered in spiced yogurt curry, served hot with clay-roasted bajra flatbread & white makhan.",
      price: 220,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Ker Sangri Marwari Delicacy",
      description: "Rare desert beans and berries cooked with dry spices, amchur, and raisins in mustard oil.",
      price: 240,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.8
    }
  ],

  // Tunday Kababi (Lucknow, UP)
  'tunday': [
    {
      name: "Tunday Original Galouti Kebab (4 Pcs)",
      description: "Lucknow's 1905 Aminabad legend: 160-spice minced mutton kebabs that literally melt in your mouth.",
      price: 280,
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Mughlai Paratha with Mutton Korma",
      description: "Flaky pan-fried parathas paired with rich, slow-simmered Awadhi brown onion mutton gravy.",
      price: 360,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Awadhi Shahi Dum Biryani",
      description: "Fragrant saffron Basmati rice layered with tender lamb pieces on dum in sealed handi.",
      price: 390,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Karim's (Delhi)
  'karim': [
    {
      name: "Karim's Royal Mutton Burra Kebab",
      description: "Charcoal-tandoor smoked juicy mutton chops marinated in secret royal Mughal spices.",
      price: 520,
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Shahi Mutton Korma & Khamiri Roti",
      description: "Slow-simmered rich gravy infused with brown onions, kewra essence, served with fluffy clay-oven flatbread.",
      price: 440,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Royal Mutton Dum Biryani",
      description: "Saffron infused Basmati rice cooked with tender marinated mutton in traditional sealed handi.",
      price: 460,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Aslam Butter Chicken (Delhi)
  'aslam': [
    {
      name: "Aslam Special Dahi Butter Chicken",
      description: "Old Delhi's sensation: tandoori roasted chicken bathed in a stream of melted Amul butter and spiced curd.",
      price: 480,
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Seekh Kebab Butter Bath",
      description: "Charcoal grilled mutton seekh kebabs dipped in melted butter and spiced yogurt.",
      price: 360,
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Soft Rumali Roti & Mint Chutney",
      description: "Paper-thin soft rumali roti served with tangy coriander-mint yogurt dip.",
      price: 50,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 95,
      rating: 4.8
    }
  ],

  // Sita Ram Diwan Chand (Delhi)
  'sita ram': [
    {
      name: "Sita Ram Paneer Stuffed Chole Bhature",
      description: "Paharganj's iconic puffed golden bhaturas stuffed with grated paneer, served with spicy tangy chickpea curry & aam pickle.",
      price: 160,
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Special Chhole Kulche with Aloo Pickle",
      description: "Soft buttered kulchas served with dry spiced chickpeas, ginger juliennes, and sour green chili pickle.",
      price: 130,
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Special Malai Meethi Lassi",
      description: "Thick creamy churned yogurt drink topped with a thick layer of fresh malai and rose syrup.",
      price: 90,
      image: "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.9
    }
  ],

  // Arsalan Biryani (Kolkata)
  'arsalan': [
    {
      name: "Arsalan Special Mutton Dum Biryani (with Aloo & Egg)",
      description: "Kolkata's crown jewel: fragrant long-grain Basmati rice, melt-in-mouth mutton, slow-cooked whole potato, and boiled egg.",
      price: 420,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Juicy Mutton Chaap with Roomali Roti",
      description: "Slow-braised mutton ribs in thick poppy seed and cashew gravy, served with paper-thin roomali roti.",
      price: 380,
      image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Kolkata Chicken Kathi Roll",
      description: "Flaky layered paratha wrapped with spicy chicken tikka, sliced onions, green chillies, and lime.",
      price: 180,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
      popularity: 97,
      rating: 4.8
    }
  ],

  // Peter Cat (Kolkata)
  'peter cat': [
    {
      name: "Peter Cat World Famous Chelo Kebab",
      description: "Legendary platter: fragrant buttered rice crowned with grilled chicken & mutton kebabs, roasted tomato, and fried egg.",
      price: 490,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      popularity: 100,
      rating: 5.0
    },
    {
      name: "Sizzling Butter Chicken Steak",
      description: "Hot iron sizzler plate with spiced chicken steak, sauteed vegetables, and jacket potatoes.",
      price: 460,
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
      popularity: 98,
      rating: 4.9
    },
    {
      name: "Heritage Caramel Custard",
      description: "Silky smooth baked egg and milk custard with burnt caramel sugar glaze.",
      price: 130,
      image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
      popularity: 96,
      rating: 4.8
    }
  ]
};

// 2. UNIVERSAL CUISINE CATEGORIES FOR DYNAMICALLY BRANDED PLACES
export const CUISINE_MENUS: CuisineProfile[] = [
  // Kachori & Samosa Sweets
  {
    name: "Kachori, Samosa & Sweets",
    keywords: ['kachori', 'pyaaz kachori', 'mawa kachori', 'samosa', 'bikanervala', 'haldiram', 'mithai', 'sweet', 'bhandar', 'mishthan', 'jalebi', 'ghevar', 'laddu', 'laddoo', 'gulab jamun'],
    dishes: [
      {
        name: "Special Crispy Pyaaz Kachori (2 Pcs)",
        description: "Crispy flaky golden pastry stuffed with spicy caramelized onion masala, served with tamarind chutney.",
        price: 80,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Hot Samosa with Sweet-Spicy Chutney (2 Pcs)",
        description: "Crispy pastry cones filled with spiced potatoes, green peas, and cashews, served with mint chutney.",
        price: 60,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Shahi Malai Ghevar with Rabdi",
        description: "Honeycomb textured festive delicacy soaked in saffron syrup crowned with thick malai.",
        price: 160,
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      }
    ]
  },

  // Sandwiches & Fast Food
  {
    name: "Sandwich & Fast Food",
    keywords: ['sandwich', 'toast', 'burger', 'grill', 'frankie', 'fries', 'wrap', 'sub', 'roll'],
    dishes: [
      {
        name: "Special 3-Layer Cheese Burst Grilled Sandwich",
        description: "Toasted jumbo bread loaded with spiced potato, veggies, spicy green chutney, and melted cheese blend.",
        price: 160,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Famous Chocolate Cheese Toast Sandwich",
        description: "Decadent sandwich layered with Nutella chocolate spread, butter, and grated processed cheese.",
        price: 140,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Loaded Peri Peri French Fries",
        description: "Crispy golden potato fries seasoned with fiery African peri peri spice rub and cheese sauce.",
        price: 120,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      }
    ]
  },

  // Chai, Tea & Tapri
  {
    name: "Chai & Tapri Snacks",
    keywords: ['chai', 'tea', 'tapri', 'katta', 'dolly', 'chalo chai', 'chaiwala', 'cutting', 'tea post', 'bun maska'],
    dishes: [
      {
        name: "Special Kulhad Masala Chai & Bun Maska",
        description: "Strong aromatic tea brewed with ginger, cardamom, and lemongrass, served with warm buttery bun.",
        price: 70,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Crispy Samosa Pav with Spicy Garlic Chutney",
        description: "Fresh fried samosa tucked inside soft ladi pav with fiery red dry garlic chutney.",
        price: 50,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Special Ginger Lemongrass Cutting Chai (2 Cups)",
        description: "Boiled milk tea infused with crushed fresh ginger root and aromatic lemongrass.",
        price: 40,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      }
    ]
  },

  // Gujarati Farsan & Thali
  {
    name: "Gujarati Farsan & Thali",
    keywords: ['gujarat', 'gujarati', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'khaman', 'dhokla', 'fafda', 'jalebi', 'locho', 'thepla', 'undhiyu', 'handvo', 'kathiyawadi', 'sev khamani', 'sev tameta'],
    dishes: [
      {
        name: "Special Surati Locho with Butter & Sev",
        description: "Steamed seasoned gram flour delicacy topped with melting butter, green garlic chutney, and crispy nylon sev.",
        price: 90,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Authentic Fafda Jalebi Plate with Papaya Sambharo",
        description: "Crispy gram flour fafda paired with hot crunchy saffron jalebi, fried green chillies, and raw papaya salad.",
        price: 130,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 99,
        rating: 5.0
      },
      {
        name: "Royal Kathiyawadi Sev Tameta & Bajra No Rotlo",
        description: "Tangy spiced tomato curry topped with ratlami sev, served with clay-roasted pearl millet flatbread and fresh white butter.",
        price: 210,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      }
    ]
  },

  // South Indian & Udupi Cafes
  {
    name: "South Indian & Udupi Tiffin",
    keywords: ['dosa', 'idli', 'udupi', 'south indian', 'bhavan', 'tiffin', 'coffee', 'mtr', 'vidyarthi', 'sangeetha', 'saravana', 'priya', 'dakshin', 'wada', 'vada', 'sambar', 'rameshwaram'],
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
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Heritage South Indian Filter Coffee",
        description: "Strong chicory-blended decoction frothed with rich hot milk in traditional brass tumbler.",
        price: 60,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.9
      }
    ]
  },

  // Vada Pav & Street Food
  {
    name: "Vada Pav & Street Food",
    keywords: ['vadapav', 'vada pav', 'wada pav', 'batata vada', 'vada', 'street food', 'babu vadapav'],
    dishes: [
      {
        name: "Special Legendary Vada Pav (2 Pcs)",
        description: "Freshly fried golden potato dumplings stuffed in soft ladi pav served with spicy chutney & fried chillies.",
        price: 50,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Crispy Kothimbir Vadi Plate",
        description: "Steamed coriander cilantro cakes shallow-fried crisp with sweet & spicy red chutney.",
        price: 80,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Crispy Sabudana Vada with Sweet Dahi",
        description: "Golden fried tapioca pearl patties with roasted crushed peanuts and sweet curd.",
        price: 90,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      }
    ]
  },

  // Misal & Maharashtrian
  {
    name: "Misal & Maharashtrian Food",
    keywords: ['misal', 'tarri', 'bhakri', 'pithla', 'thalipeeth', 'maratha', 'kolhapuri', 'katakirr', 'bedekar'],
    dishes: [
      {
        name: "Fiery Matki Misal Pav Special",
        description: "Sprouted moth beans cooked in blistering spicy red tarri broth, topped with crisp farsan & soft pav.",
        price: 130,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Pithla Bhakri & Thecha Thali",
        description: "Traditional gram flour pithla served piping hot with freshly roasted jowar bhakri and green chili garlic thecha.",
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
      }
    ]
  },

  // Biryani, Mughlai & Non-Veg
  {
    name: "Biryani & Mughlai Kebabs",
    keywords: ['biryani', 'mutton', 'chicken', 'kebab', 'kebabs', 'nihari', 'handi', 'non veg', 'darbar', 'boti', 'seekh', 'tandoori'],
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
        name: "Spicy Chicken Handi with Butter Naan",
        description: "Tender chicken pieces simmered in rich spiced tomato onion gravy with fluffy garlic butter naan.",
        price: 360,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Juicy Charcoal Chicken Seekh Kebab",
        description: "Minced spiced chicken skewers grilled over live charcoal served with mint yogurt chutney.",
        price: 280,
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      }
    ]
  },

  // Seafood & Coastal
  {
    name: "Coastal & Malvani Seafood",
    keywords: ['seafood', 'fish', 'surmai', 'pomfret', 'prawns', 'crab', 'malvan', 'konkan', 'goan', 'bombil'],
    dishes: [
      {
        name: "Surmai Rava Fish Fry (Kingfish)",
        description: "Fresh Kingfish steak marinated in red coastal masala and coated with crispy golden semolina.",
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
      }
    ]
  },

  // Pav Bhaji & Chaat
  {
    name: "Pav Bhaji & Chaat Adda",
    keywords: ['pav bhaji', 'bhel', 'chaat', 'pani puri', 'golgappe', 'sev puri', 'ragda', 'dahi puri', 'sardar', 'honest'],
    dishes: [
      {
        name: "Special Amul Butter Pav Bhaji",
        description: "Mashed spiced vegetable curry with floating melted butter and warm butter-toasted pav.",
        price: 160,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Special SPDP (Sev Potato Dahi Puri)",
        description: "Crispy puris loaded with potatoes, sweetened curd, date-tamarind chutney, and nylon sev.",
        price: 110,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Spiced Masala Pav Double",
        description: "Toasted soft ladi pavs slathered with spicy garlic onion bhaji gravy and butter.",
        price: 120,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80",
        popularity: 96,
        rating: 4.8
      }
    ]
  },

  // Pure Veg, Dhaba & North Indian
  {
    name: "Pure Veg & Punjabi Dhaba",
    keywords: ['dhaba', 'punjabi', 'paneer', 'thali', 'north indian', 'pure veg', 'veg', 'bhojanalaya', 'hotel', 'restaurant'],
    dishes: [
      {
        name: "Special Paneer Butter Masala",
        description: "Fresh cottage cheese cubes simmered in rich creamy butter tomato gravy with aromatic kasuri methi.",
        price: 240,
        image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop&q=80",
        popularity: 100,
        rating: 5.0
      },
      {
        name: "Crispy Butter Garlic Naan (2 Pcs)",
        description: "Clay oven tandoor baked leavened bread slathered with roasted garlic butter.",
        price: 90,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        popularity: 98,
        rating: 4.9
      },
      {
        name: "Dal Makhani Charcoal Simmered",
        description: "Black lentils slow-cooked overnight with butter, cream, and subtle whole spices.",
        price: 220,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80",
        popularity: 97,
        rating: 4.8
      }
    ]
  }
];

// Helper to extract a clean prefix name from any restaurant string
function getCleanSpotBrandName(rawName: string): string {
  if (!rawName) return 'Special';
  // Remove common words like Hotel, Restaurant, Cafe, Stall, Dhaba, etc.
  const clean = rawName
    .replace(/\b(hotel|restaurant|cafe|dhaba|stall|point|corner|center|outlet|bhojanalaya|refreshment|bhandar|the|famous)\b/gi, '')
    .trim();
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length > 0 && words[0].length >= 2) {
    return words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return rawName.split(/\s+/)[0] || 'Special';
}

export function generateLiveMenuForRestaurant(restaurant: { id: number; name: string; description?: string; area?: string; city?: string }): Dish[] {
  const text = `${restaurant.name} ${restaurant.description || ''} ${restaurant.area || ''} ${restaurant.city || ''}`.toLowerCase();
  const restName = restaurant.name || 'Special Food Joint';
  const brandName = getCleanSpotBrandName(restName);

  // 1. Check for specific iconic restaurant match
  for (const [key, iconicDishes] of Object.entries(ICONIC_RESTAURANT_DISHES)) {
    if (text.includes(key.toLowerCase())) {
      return iconicDishes.map((item, idx) => ({
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
  }

  // 2. Otherwise match best cuisine category
  let matchedProfile = CUISINE_MENUS[CUISINE_MENUS.length - 1]; // default pure veg / dhaba
  for (const profile of CUISINE_MENUS) {
    if (profile.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      matchedProfile = profile;
      break;
    }
  }

  // 3. Generate dynamic branded signature dishes specifically named after THIS selected restaurant
  return matchedProfile.dishes.map((item, idx) => {
    // Brand the top dish with the restaurant's real name if not already present
    let brandedName = item.name;
    if (!brandedName.toLowerCase().includes(brandName.toLowerCase()) && brandName.length >= 2) {
      if (idx === 0) {
        brandedName = `${brandName} Special ${item.name.replace(/^special\s+/i, '')}`;
      } else if (idx === 1) {
        brandedName = `${brandName} Famous ${item.name.replace(/^famous\s+/i, '')}`;
      }
    }

    return {
      id: restaurant.id * 100 + idx + 1,
      restaurant_id: restaurant.id,
      name: brandedName,
      description: item.description,
      price: item.price,
      image: item.image,
      rating: item.rating,
      popularity: item.popularity,
      is_recommended: idx < 3 ? 1 : 0,
      status: 'active' as const
    };
  });
}

