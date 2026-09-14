import { MenuItem, CafeEvent, Review, Order, Reservation, CustomerUser, LoyaltyTier, LoyaltyTransaction } from '../types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Artisan Cafe Latte',
    description: 'Double shot of single-origin espresso with silky textured steamed milk and delicate rosetta latte art.',
    price: 4.50,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 128,
    dietary: ['vegetarian'],
    ingredients: ['Espresso double shot', 'Steamed whole milk or plant milk choice'],
    calories: 140,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 4
  },
  {
    id: 'item-2',
    name: 'Smashed Avocado & Heirloom Toast',
    description: 'Thick toasted artisanal sourdough, crushed Haas avocado, marinated heirloom tomatoes, crumbled feta, za\'atar, and microgreens.',
    price: 8.50,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 96,
    dietary: ['vegetarian'],
    ingredients: ['Organic sourdough', 'Haas avocado', 'Heirloom tomatoes', 'French feta', 'Za\'atar', 'Lemon zest'],
    calories: 380,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 8
  },
  {
    id: 'item-3',
    name: 'Golden Butter Croissant',
    description: 'Slow-fermented French laminated dough, hand-rolled with churned Normandy butter for a crispy, multi-layered golden crust.',
    price: 3.50,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 142,
    dietary: ['vegetarian'],
    ingredients: ['French T55 flour', 'Normandy AOP butter', 'Cane sugar', 'Sea salt'],
    calories: 260,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    id: 'item-4',
    name: 'Nitro Cold Brew & Vanilla Cream',
    description: 'Single-origin Ethiopian Yirgacheffe steeped for 24 hours, infused with nitrogen for a velvety micro-foam head and subtle vanilla bean syrup.',
    price: 4.75,
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 84,
    dietary: ['vegan', 'dairy-free'],
    ingredients: ['Ethiopian cold brew concentrate', 'Filtered mountain water', 'Nitrogen', 'Madagascar vanilla'],
    calories: 60,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    id: 'item-5',
    name: 'Truffle Mushroom Pasta',
    description: 'House-made ribbons of tagliatelle tossed in a velvety cream reduction of wild chanterelles, porcini, black truffle oil, freshly cracked black pepper, and aged Parmigiano-Reggiano.',
    price: 12.50,
    category: 'sandwiches', // Featured special
    image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 210,
    dietary: ['vegetarian'],
    ingredients: ['Fresh tagliatelle pasta', 'Wild cremini and porcini mushrooms', 'Black truffle carpaccio oil', 'White wine reduction', 'Aged Parmigiano', 'Fresh thyme'],
    calories: 520,
    isPopular: true,
    isSpecial: true,
    isAvailable: true,
    prepTimeMinutes: 14
  },
  {
    id: 'item-6',
    name: 'Ceremonial Iced Matcha Latte',
    description: 'First-harvest Uji matcha whisked by hand with subtle raw agave nectar and creamy oat milk, poured over crystal ice blocks.',
    price: 5.25,
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 77,
    dietary: ['vegan', 'dairy-free'],
    ingredients: ['Uji ceremonial matcha', 'Organic oat milk', 'Raw blue agave'],
    calories: 120,
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 4
  },
  {
    id: 'item-7',
    name: 'Prosciutto & Truffle Burrata Panini',
    description: 'Crispy pressed ciabatta layered with 18-month Prosciutto di Parma, creamy Italian burrata, balsamic glaze, and fresh baby arugula.',
    price: 10.50,
    category: 'sandwiches',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 115,
    dietary: [],
    ingredients: ['Artisanal ciabatta', 'Prosciutto di Parma', 'Pugliese burrata', 'Organic arugula', 'Modena balsamic reduction'],
    calories: 490,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 10
  },
  {
    id: 'item-8',
    name: 'Spanish Cortado',
    description: 'Equal parts bold ristretto espresso and warm silky milk in a clear Gibraltar glass. Pure balance.',
    price: 4.00,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 65,
    dietary: ['vegetarian'],
    ingredients: ['Double ristretto', 'Steamed whole milk'],
    calories: 70,
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 3
  },
  {
    id: 'item-9',
    name: 'Smoked Salmon Everything Bagel',
    description: 'Toasted kettle-boiled bagel spread with whipped scallion cream cheese, Scottish smoked salmon, capers, pickled shallots, and fresh dill.',
    price: 11.00,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 92,
    dietary: [],
    ingredients: ['Artisan everything bagel', 'Cured cold-smoked salmon', 'House scallion cream cheese', 'Sicilian capers', 'Pickled shallots'],
    calories: 450,
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 7
  },
  {
    id: 'item-10',
    name: 'Basque Burnt Caramel Cheesecake',
    description: 'Caramelized mahogany top with a rich, molten cream cheese center infused with real vanilla and flaky sea salt.',
    price: 6.50,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewCount: 168,
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: ['Philadelphia cream cheese', 'Organic egg yolks', 'Heavy cream', 'Cane sugar', 'Maldon salt'],
    calories: 410,
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    id: 'item-11',
    name: 'Cardamom & Cinnamon Morning Bun',
    description: 'Flaky laminated pastry rolled with aromatic Sri Lankan cinnamon, freshly ground green cardamom, and raw turbinado sugar crystals.',
    price: 4.25,
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 88,
    dietary: ['vegetarian'],
    ingredients: ['Danish dough', 'Ground cardamom', 'Ceylon cinnamon', 'Turbinado sugar'],
    calories: 320,
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 2
  },
  {
    id: 'item-12',
    name: 'Classic Affogato al Caffe',
    description: 'A generous scoop of slow-churned Madagascar vanilla bean gelato drenched tableside in a piping hot double espresso shot.',
    price: 5.50,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 104,
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: ['Madagascar vanilla gelato', 'Double espresso shot', 'Dark chocolate shavings'],
    calories: 190,
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 3
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1024',
    orderNumber: '1024',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 234-8901',
    orderType: 'pickup',
    status: 'preparing',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 16.50,
    tax: 1.32,
    deliveryFee: 0,
    total: 17.82,
    createdAt: '15 mins ago',
    estimatedReadyTime: 'In ~8 minutes (Pickup Counter 2)',
    notes: 'Please prepare the latte with oat milk.',
    items: [
      {
        cartItemId: 'c1',
        menuItem: INITIAL_MENU_ITEMS[0], // Latte
        quantity: 2,
        customization: { milk: 'Oat Milk', sweetness: '50%' },
        itemTotal: 9.00
      },
      {
        cartItemId: 'c2',
        menuItem: INITIAL_MENU_ITEMS[1], // Avocado toast
        quantity: 1,
        itemTotal: 8.50
      }
    ]
  },
  {
    id: 'ord-1023',
    orderNumber: '1023',
    customerName: 'Daniel Vance',
    customerEmail: 'daniel.v@example.com',
    customerPhone: '+1 (555) 789-1123',
    orderType: 'delivery',
    deliveryAddress: '402 Elm Terrace, Apt 3B, Downtown',
    status: 'ready',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 23.00,
    tax: 1.84,
    deliveryFee: 3.50,
    total: 28.34,
    createdAt: '35 mins ago',
    estimatedReadyTime: 'Courier out for delivery',
    items: [
      {
        cartItemId: 'c3',
        menuItem: INITIAL_MENU_ITEMS[4], // Truffle Pasta
        quantity: 1,
        itemTotal: 12.50
      },
      {
        cartItemId: 'c4',
        menuItem: INITIAL_MENU_ITEMS[6], // Panini
        quantity: 1,
        itemTotal: 10.50
      }
    ]
  },
  {
    id: 'ord-1022',
    orderNumber: '1022',
    customerName: 'John Miller',
    customerEmail: 'john.m@example.com',
    customerPhone: '+1 (555) 432-6789',
    orderType: 'pickup',
    status: 'completed',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 12.50,
    tax: 1.00,
    deliveryFee: 0,
    total: 13.50,
    createdAt: '1 hour ago',
    estimatedReadyTime: 'Completed at 2:15 PM',
    items: [
      {
        cartItemId: 'c5',
        menuItem: INITIAL_MENU_ITEMS[4],
        quantity: 1,
        itemTotal: 12.50
      }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-301',
    reservationCode: 'RES-8921',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 234-8901',
    date: '2026-09-15',
    time: '11:00 AM',
    guests: 3,
    seatingArea: 'Garden Terrace Patio',
    specialRequests: 'Window seat if possible, celebrating friendship anniversary.',
    status: 'confirmed',
    createdAt: 'Yesterday'
  },
  {
    id: 'res-302',
    reservationCode: 'RES-9452',
    customerName: 'David Chen',
    customerEmail: 'david.chen@example.com',
    customerPhone: '+1 (555) 888-2341',
    date: '2026-09-14',
    time: '01:30 PM',
    guests: 4,
    seatingArea: 'Main Dining Room',
    specialRequests: 'High chair needed for 2-year old child.',
    status: 'pending',
    createdAt: '2 hours ago'
  },
  {
    id: 'res-303',
    reservationCode: 'RES-7719',
    customerName: 'Emma Watson',
    customerEmail: 'emma.w@example.com',
    customerPhone: '+1 (555) 345-6712',
    date: '2026-09-13',
    time: '07:30 PM',
    guests: 2,
    seatingArea: 'Quiet Study Nook',
    specialRequests: 'Quiet table for anniversary dinner.',
    status: 'confirmed',
    createdAt: '3 days ago'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 days ago',
    comment: 'The coffee is exceptional and the atmosphere is so calm and inviting. Their sourdough avocado toast with za\'atar is easily the best in the city. The staff always greet you with a genuine smile!',
    favoriteItem: 'Artisan Cafe Latte & Avocado Toast',
    verifiedCustomer: true
  },
  {
    id: 'rev-2',
    customerName: 'Marcus Bennett',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'I do most of my morning remote writing here. Fast Wi-Fi, comfortable seating, and the Spanish Cortado gives the perfect mid-morning boost without being harsh.',
    favoriteItem: 'Spanish Cortado',
    verifiedCustomer: true
  },
  {
    id: 'rev-3',
    customerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Ordered their Truffle Mushroom Pasta for an evening takeout and it arrived restaurant-quality hot. The buttery croissants in the morning are just as stellar.',
    favoriteItem: 'Truffle Mushroom Pasta',
    verifiedCustomer: true
  },
  {
    id: 'rev-4',
    customerName: 'Daniel Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Their table booking service was seamless. Had an intimate 6-person birthday brunch on the Garden Terrace. The staff accommodated custom allergy requests with zero fuss.',
    favoriteItem: 'Golden Butter Croissant & Nitro Brew',
    verifiedCustomer: true
  }
];

export const INITIAL_EVENTS: CafeEvent[] = [
  {
    id: 'evt-1',
    title: 'Live Acoustic Sessions: Friday Night Jazz & Strings',
    category: 'Music & Evening',
    date: 'Friday, Sep 19',
    time: '7:00 PM – 9:30 PM',
    description: 'Join us for an intimate candlelit evening of acoustic guitar, cello, and vocal jazz with local singer Maya Stone. Wine pairings, specialty pour-overs, and late-night charcuterie boards available.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    location: 'Main Hearth Lounge',
    ticketPrice: 0,
    spotsLeft: 18,
    rsvps: [
      { name: 'Sarah Johnson', email: 'sarah.j@example.com', guests: 2 },
      { name: 'Michael Lee', email: 'm.lee@example.com', guests: 3 }
    ],
    rsvpList: [
      { name: 'Sarah Johnson', email: 'sarah.j@example.com', guests: 2 },
      { name: 'Michael Lee', email: 'm.lee@example.com', guests: 3 }
    ]
  },
  {
    id: 'evt-2',
    title: 'Weekend Farm-to-Table Artisan Brunch',
    category: 'Culinary Special',
    date: 'Saturday, Sep 20',
    time: '10:00 AM – 2:30 PM',
    description: 'A celebration of harvest season with local organic pasture eggs, fresh brioche french toast, seasonal wild berry compotes, and bottomless specialty drip coffee.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    location: 'Garden Terrace Patio',
    ticketPrice: 28,
    spotsLeft: 8,
    rsvps: [
      { name: 'Clara Oswald', email: 'clara@example.com', guests: 2 }
    ],
    rsvpList: [
      { name: 'Clara Oswald', email: 'clara@example.com', guests: 2 }
    ]
  },
  {
    id: 'evt-3',
    title: 'Home Barista Masterclass: Dialing in Espresso & Latte Art',
    category: 'Workshop',
    date: 'Sunday, Sep 28',
    time: '3:00 PM – 5:00 PM',
    description: 'Led by our Head Roaster, explore coffee bean origins, water temperature calibration, grinder grind size distribution, milk texturing, and pouring tulip & swan latte art.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
    location: 'Coffee Lab & Cupping Bar',
    ticketPrice: 45,
    spotsLeft: 4,
    rsvps: [
      { name: 'Alex Rivera', email: 'alex.r@example.com', guests: 1 }
    ],
    rsvpList: [
      { name: 'Alex Rivera', email: 'alex.r@example.com', guests: 1 }
    ]
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    title: 'Morning Light in the Main Dining Room',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    caption: 'Warm timber tones, brass pendants, and sunlight streaming over our communal oak tables.'
  },
  {
    id: 'g-2',
    title: 'Handcrafted Rosetta Latte Art',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    caption: 'Precision-steamed velvety micro-foam poured with care into stoneware ceramic cups.'
  },
  {
    id: 'g-3',
    title: 'Fresh Morning French Croissants',
    category: 'pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    caption: 'Baked at 5:30 AM daily using French Normandy butter and 48-hour fermented laminated dough.'
  },
  {
    id: 'g-4',
    title: 'Truffle Mushroom Tagliatelle',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Our signature evening special served with shaved black truffle and Parmigiano-Reggiano.'
  },
  {
    id: 'g-5',
    title: 'Community & Morning Conversations',
    category: 'customers',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Friends, creatives, and neighbors gathering over warm cups and shared stories.'
  },
  {
    id: 'g-6',
    title: 'Friday Night Candlelight Acoustic Session',
    category: 'events',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intimate acoustic chords and warm café chatter under the evening canopy lights.'
  },
  {
    id: 'g-7',
    title: 'Single-Origin Ethiopian Pour Over',
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    caption: 'Floral notes of jasmine and bergamot brewed on Kalita Wave drippers.'
  },
  {
    id: 'g-8',
    title: 'The Garden Terrace Patio',
    category: 'interior',
    image: 'https://images.unsplash.com/photo-1445116572660-2380a988636b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Surrounded by jasmine vines, terracotta pots, and gentle morning shade.'
  },
  {
    id: 'g-9',
    title: 'Artisan Sourdough Avocado Toast',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    caption: 'Heirloom tomatoes, toasted pumpkin seeds, and Greek feta on wild yeast sourdough.'
  }
];

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Taster',
    minPoints: 0,
    maxPoints: 199,
    badgeColor: '#A07855',
    multiplierText: '10 pts per $1 spent',
    perks: [
      'Earn 10 points on every $1 spent',
      'Complimentary Birthday handcrafted drink',
      'Mobile order ahead & fast pickup'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Explorer',
    minPoints: 200,
    maxPoints: 499,
    badgeColor: '#8C92AC',
    multiplierText: '10 pts per $1 spent + Perk Pack',
    perks: [
      'Free oat, almond, or organic syrup customizations',
      '10% discount on whole bean coffee retail bags',
      'Early access to seasonal autumn & spring drink menus',
      'Priority table reservation requests'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Roastery Connoisseur',
    minPoints: 500,
    maxPoints: 999,
    badgeColor: '#C48B47',
    multiplierText: '15 pts per $1 spent (1.5x Multiplier)',
    perks: [
      'Earn 15 points on every $1 spent (1.5x multiplier)',
      'Free in-house drip coffee refills on every visit',
      'Monthly complimentary pastry reward voucher',
      'Invitations to private coffee cupping & roasting workshops'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum Reserve Ambassador',
    minPoints: 1000,
    maxPoints: 9999,
    badgeColor: '#2A1E17',
    multiplierText: '20 pts per $1 spent (2.0x Multiplier)',
    perks: [
      'Earn 20 points on every $1 spent (2x points boost)',
      'Quarterly curated 250g bag of rare Reserve single-origin beans',
      'VIP table booking guarantee on patio & hearth rooms',
      'Annual dinner & barista masterclass pass'
    ]
  }
];

export const INITIAL_POINTS_HISTORY: LoyaltyTransaction[] = [
  {
    id: 'tx-7',
    date: 'Sep 12, 2026',
    description: 'Order #UG-1024 – Smashed Avocado Toast & Artisan Latte',
    points: 260,
    type: 'order',
    orderNumber: '1024',
    balanceAfter: 340
  },
  {
    id: 'tx-6',
    date: 'Sep 08, 2026',
    description: 'Event RSVP Confirmed – Friday Night Jazz & Strings',
    points: 50,
    type: 'event',
    balanceAfter: 80
  },
  {
    id: 'tx-5',
    date: 'Sep 03, 2026',
    description: 'Redeemed: Complimentary Butter Croissant Voucher',
    points: -200,
    type: 'redemption',
    balanceAfter: 30
  },
  {
    id: 'tx-4',
    date: 'Aug 28, 2026',
    description: 'Order #UG-9821 – Cold Brew & Cinnamon Cardamom Cruffin',
    points: 115,
    type: 'order',
    orderNumber: '9821',
    balanceAfter: 230
  },
  {
    id: 'tx-3',
    date: 'Aug 20, 2026',
    description: 'Customer Review Submission – Verified In-Cafe Dining',
    points: 25,
    type: 'review',
    balanceAfter: 115
  },
  {
    id: 'tx-2',
    date: 'Aug 14, 2026',
    description: 'Redeemed: Complimentary Specialty Latte Voucher',
    points: -300,
    type: 'redemption',
    balanceAfter: 90
  },
  {
    id: 'tx-1',
    date: 'Aug 05, 2026',
    description: 'Order #UG-9310 – Ethiopian Yirgacheffe Beans & Pour-Over',
    points: 290,
    type: 'order',
    orderNumber: '9310',
    balanceAfter: 390
  },
  {
    id: 'tx-0',
    date: 'Jul 22, 2026',
    description: 'Welcome Grove Loyalty Membership Bonus',
    points: 100,
    type: 'bonus',
    balanceAfter: 100
  }
];

export const INITIAL_USER: CustomerUser = {
  id: 'user-1',
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 234-8901',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  memberSince: 'October 2024',
  loyaltyPoints: 340,
  lifetimePoints: 840,
  savedAddresses: [
    { label: 'Home', address: '742 Evergreen Terrace, Downtown Apt 4B', isDefault: true },
    { label: 'Studio Office', address: '120 Innovation Square, 3rd Floor', isDefault: false }
  ],
  favoriteItemIds: ['item-1', 'item-2', 'item-4'],
  pointsHistory: INITIAL_POINTS_HISTORY
};

export const MENU_ITEMS: MenuItem[] = INITIAL_MENU_ITEMS.map((item) => ({
  ...item,
  inStock: item.inStock ?? item.isAvailable ?? true
}));
export const CAFE_EVENTS = INITIAL_EVENTS;
export const DEFAULT_USER = INITIAL_USER;
export const INITIAL_ADMIN_STATS = {
  todayRevenue: 1280,
  totalOrders: 64,
  reservationsToday: 12,
  activeCustomers: 38,
  totalRevenue: 24500,
  totalReservations: 180,
  totalCustomers: 450,
  popularItems: [
    { name: 'Artisan Cafe Latte', sales: 48, revenue: 216.0 },
    { name: 'Smashed Avocado Toast', sales: 32, revenue: 272.0 },
    { name: 'Golden Butter Croissant', sales: 41, revenue: 143.5 }
  ],
  recentActivity: [
    { timestamp: '12 mins ago', text: 'New order #1024 for pickup received', type: 'order' as const },
    { timestamp: '34 mins ago', text: 'Table reserved for 4 guests on Garden Terrace', type: 'reservation' as const },
    { timestamp: '1 hour ago', text: '5-star review left by Sarah Johnson', type: 'review' as const }
  ],
  weeklySales: [
    { day: 'Mon', revenue: 1100, orders: 54 },
    { day: 'Tue', revenue: 1250, orders: 62 },
    { day: 'Wed', revenue: 1180, orders: 58 },
    { day: 'Thu', revenue: 1340, orders: 69 },
    { day: 'Fri', revenue: 1680, orders: 84 },
    { day: 'Sat', revenue: 2100, orders: 112 },
    { day: 'Sun', revenue: 1950, orders: 98 }
  ]
};
