import {
  Profile,
  Category,
  Listing,
  RentalRequest,
  Rental,
  Payment,
  Review,
  Conversation,
  Message,
  Notification,
  Report,
  AdminSettings,
} from './types';

// Default Categories
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-elec', name: 'Electronics', slug: 'electronics', icon: 'Tv', description: 'Audio equipment, smart gadgets, monitors and tech gear', item_count: 14 },
  { id: 'cat-cam', name: 'Cameras', slug: 'cameras', icon: 'Camera', description: 'DSLRs, mirrorless cameras, lenses, tripods and lighting', item_count: 18 },
  { id: 'cat-game', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', description: 'PlayStation, Xbox, Nintendo, VR headsets and games', item_count: 12 },
  { id: 'cat-furn', name: 'Furniture', slug: 'furniture', icon: 'Armchair', description: 'Study desks, ergonomic chairs, sofas and foldable tables', item_count: 9 },
  { id: 'cat-sport', name: 'Sports', slug: 'sports', icon: 'Trophy', description: 'Bicycles, cricket kits, camping tents, trekking gear', item_count: 21 },
  { id: 'cat-tool', name: 'Tools', slug: 'tools', icon: 'Wrench', description: 'Power drills, lawnmowers, pressure washers and toolsets', item_count: 15 },
  { id: 'cat-veh', name: 'Vehicles', slug: 'vehicles', icon: 'Car', description: 'Scooters, electric cycles, cars, and utility carriers', item_count: 8 },
  { id: 'cat-book', name: 'Books', slug: 'books', icon: 'BookOpen', description: 'Academic textbooks, bestsellers, comics and exam guides', item_count: 25 },
  { id: 'cat-event', name: 'Events', slug: 'events', icon: 'PartyPopper', description: 'Stage lights, karaoke systems, gazebos and smoke machines', item_count: 11 },
  { id: 'cat-oth', name: 'Other', slug: 'other', icon: 'Package', description: 'Miscellaneous unique items and utility rentals', item_count: 6 },
];

// Initial Profiles
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'u-owner-1',
    email: 'rahul.owner@rentit.demo',
    password: 'password123',
    full_name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    city: 'Sonipat',
    locality: 'Sector 14',
    bio: 'Tech enthusiast & amateur photographer. Loving the circular sharing economy in Sonipat!',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    rating: 4.9,
    total_ratings: 16,
    is_verified: true,
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'u-renter-1',
    email: 'priya.renter@rentit.demo',
    password: 'password123',
    full_name: 'Priya Patel',
    phone: '+91 98123 45678',
    city: 'Sonipat',
    locality: 'Model Town',
    bio: 'University student & weekend hiker. Renting allows me to explore gear without waste!',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    rating: 5.0,
    total_ratings: 8,
    is_verified: true,
    created_at: '2025-02-01T12:00:00Z',
  },
  {
    id: 'u-admin-1',
    email: 'admin@rentit.demo',
    password: 'password123',
    full_name: 'RentIt Platform Administrator',
    phone: '+91 99999 88888',
    city: 'Sonipat',
    locality: 'Administrative Hub',
    bio: 'Chief Community & Trust Administrator for RentIt Hyperlocal Network.',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
    rating: 5.0,
    total_ratings: 50,
    is_verified: true,
    created_at: '2024-12-01T00:00:00Z',
  },
  {
    id: 'u-owner-2',
    email: 'amit.verma@rentit.demo',
    password: 'password123',
    full_name: 'Amit Verma',
    phone: '+91 97111 22334',
    city: 'Sonipat',
    locality: 'Sector 15',
    bio: 'DIY maker, builder and outdoor sports lover.',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    role: 'user',
    rating: 4.8,
    total_ratings: 12,
    is_verified: true,
    created_at: '2025-01-15T09:00:00Z',
  },
];

// Initial Listings with Real-world Details & HD Images
export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list-101',
    owner_id: 'u-owner-1',
    category_id: 'cat-cam',
    title: 'Sony Alpha A7 IV Mirrorless Camera (with 28-70mm Lens)',
    description: 'Professional 33MP Full-Frame hybrid camera. Outstanding 4K 60p video, dual card slots, 2 high-capacity batteries, charger, and 128GB high-speed SD card included. Perfect for video shoots, travel, and wedding events.',
    price_per_day: 500,
    security_deposit: 5000,
    city: 'Sonipat',
    locality: 'Sector 14',
    condition: 'Like New',
    rental_rules: '• Valid Govt ID verification required at pickup.\n• Do not clean sensor yourself.\n• Keep equipment away from salt water and heavy rain.\n• Return with full battery charge.',
    status: 'active',
    views_count: 342,
    created_at: '2025-02-10T11:00:00Z',
    updated_at: '2025-02-10T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-102',
    owner_id: 'u-owner-1',
    category_id: 'cat-elec',
    title: 'Epson Full HD 1080p Home Cinema Projector (3400 Lumens)',
    description: 'Super bright 3400-lumen home theater projector with dual HDMI, built-in speaker, and portable carrying bag. Comes with a 100-inch foldable projection screen. Great for movie nights, FIFA match screenings, and presentations.',
    price_per_day: 400,
    security_deposit: 3000,
    city: 'Sonipat',
    locality: 'Model Town',
    condition: 'Good',
    rental_rules: '• Avoid touching the front optical glass.\n• Allow fan to cool down completely before unplugging.\n• Carry in the provided padded bag.',
    status: 'active',
    views_count: 219,
    created_at: '2025-02-12T14:30:00Z',
    updated_at: '2025-02-12T14:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-103',
    owner_id: 'u-owner-2',
    category_id: 'cat-game',
    title: 'Sony PlayStation 5 Console + 2 DualSense Controllers',
    description: 'PS5 Disc Edition console in pristine condition. Pre-loaded with FIFA 24, Spider-Man 2, and God of War Ragnarok. Includes high-speed HDMI 2.1 cable, two wireless controllers, and charging dock.',
    price_per_day: 600,
    security_deposit: 4000,
    city: 'Sonipat',
    locality: 'Sector 15',
    condition: 'Like New',
    rental_rules: '• No smoking near the console vents.\n• Do not alter system software or accounts.\n• Controllers must be returned undamaged.',
    status: 'active',
    views_count: 512,
    created_at: '2025-02-15T09:15:00Z',
    updated_at: '2025-02-15T09:15:00Z',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-104',
    owner_id: 'u-owner-2',
    category_id: 'cat-sport',
    title: 'Firefox Mountain Bicycle 21-Speed Shimano Geared',
    description: 'Lightweight alloy frame mountain bicycle with front suspension, dual disc brakes, and smooth Shimano 21-speed gear transmission. Includes safety helmet, phone holder, and sturdy combination cable lock.',
    price_per_day: 250,
    security_deposit: 1500,
    city: 'Sonipat',
    locality: 'Omaxe City',
    condition: 'Good',
    rental_rules: '• Must wear the provided helmet while riding.\n• Always lock the bicycle to a fixed post when unattended.\n• Clean off heavy mud before return.',
    status: 'active',
    views_count: 180,
    created_at: '2025-02-18T16:00:00Z',
    updated_at: '2025-02-18T16:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-105',
    owner_id: 'u-owner-1',
    category_id: 'cat-sport',
    title: 'Quechua 4-Person Waterproof Camping Tent + LED Lantern',
    description: 'Spacious waterproof dome tent that pitches in under 10 minutes. Tested under tropical rain and wind conditions. Includes ground pegs, carry bag, 2 inflatable sleeping mats, and an emergency rechargeable LED camping lantern.',
    price_per_day: 300,
    security_deposit: 2000,
    city: 'Sonipat',
    locality: 'Sector 14',
    condition: 'Good',
    rental_rules: '• Do not light campfires inside or within 4 meters of tent.\n• Dry the fabric before repacking.\n• Count all tent pegs when packing up.',
    status: 'active',
    views_count: 165,
    created_at: '2025-02-20T10:45:00Z',
    updated_at: '2025-02-20T10:45:00Z',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-106',
    owner_id: 'u-owner-1',
    category_id: 'cat-elec',
    title: 'JBL PartyBox 310 Bluetooth High-Power Portable Speaker',
    description: '240 Watts of roaring JBL Pro Sound with synced dynamic light show and 18-hour battery life. Built-in wheels and telescopic handle make it easy to roll anywhere. Includes wireless microphone for karaoke and speeches.',
    price_per_day: 350,
    security_deposit: 2500,
    city: 'Sonipat',
    locality: 'Murthal Road',
    condition: 'Like New',
    rental_rules: '• IPX4 splashproof but do not submerge in water.\n• Keep volume within safe outdoor/indoor limits.\n• Charge with supplied OEM power cable.',
    status: 'active',
    views_count: 290,
    created_at: '2025-02-22T13:20:00Z',
    updated_at: '2025-02-22T13:20:00Z',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-107',
    owner_id: 'u-owner-2',
    category_id: 'cat-tool',
    title: 'Bosch Professional Impact Drill Machine (750W Kit)',
    description: 'Heavy-duty Bosch impact drill with hammer function for masonry, concrete, wood, and metal drilling. Comes with an assorted 50-piece drill and screwdriver bit set, depth gauge, and heavy-duty tool case.',
    price_per_day: 200,
    security_deposit: 1000,
    city: 'Sonipat',
    locality: 'Sector 12',
    condition: 'Good',
    rental_rules: '• Wear eye protection when drilling masonry.\n• Use the correct bit type for the material.\n• Clean chuck and bits after use.',
    status: 'active',
    views_count: 140,
    created_at: '2025-02-25T11:00:00Z',
    updated_at: '2025-02-25T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80',
    ],
  },
  {
    id: 'list-108',
    owner_id: 'u-owner-1',
    category_id: 'cat-furn',
    title: 'Ergonomic Wooden Study & Work Table with Cable Management',
    description: 'Solid engineered wood minimalist work desk with steel reinforcement legs, built-in wire grommets, and headphone hook. Easily disassembles into 4 modular parts for easy transportation in a hatchback car.',
    price_per_day: 150,
    security_deposit: 800,
    city: 'Sonipat',
    locality: 'Sector 14',
    condition: 'Good',
    rental_rules: '• Use coasters for hot mugs and liquid drinks.\n• Avoid sharp cutting tools directly on wood top.\n• Hardware screws must be returned in the labeled pouch.',
    status: 'active',
    views_count: 110,
    created_at: '2025-02-28T09:00:00Z',
    updated_at: '2025-02-28T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    ],
  },
];

// Initial Demo Rental Requests
export const INITIAL_REQUESTS: RentalRequest[] = [
  {
    id: 'req-201',
    listing_id: 'list-101',
    renter_id: 'u-renter-1',
    owner_id: 'u-owner-1',
    start_date: '2025-03-10',
    end_date: '2025-03-12',
    total_days: 3,
    daily_price: 500,
    rental_amount: 1500,
    platform_fee: 150,
    security_deposit: 5000,
    total_amount: 6650,
    status: 'accepted',
    message: 'Hey Rahul, need this Sony camera for a weekend documentary project in Sonipat.',
    created_at: '2025-03-01T12:00:00Z',
  },
  {
    id: 'req-202',
    listing_id: 'list-102',
    renter_id: 'u-renter-1',
    owner_id: 'u-owner-1',
    start_date: '2025-03-18',
    end_date: '2025-03-20',
    total_days: 3,
    daily_price: 400,
    rental_amount: 1200,
    platform_fee: 120,
    security_deposit: 3000,
    total_amount: 4320,
    status: 'pending',
    message: 'Hi! Planning an outdoor movie screening with university friends.',
    created_at: '2025-03-03T15:20:00Z',
  },
];

// Initial Rentals
export const INITIAL_RENTALS: Rental[] = [
  {
    id: 'rent-301',
    request_id: 'req-201',
    listing_id: 'list-101',
    renter_id: 'u-renter-1',
    owner_id: 'u-owner-1',
    start_date: '2025-03-10',
    end_date: '2025-03-12',
    total_amount: 6650,
    status: 'completed',
    handover_notes: 'Handed over in mint condition with 2 fully charged batteries.',
    return_notes: 'Returned on time and in perfect shape. Great renter!',
    created_at: '2025-03-02T10:00:00Z',
  },
];

// Initial Reviews
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-401',
    rental_id: 'rent-301',
    reviewer_id: 'u-renter-1',
    reviewee_id: 'u-owner-1',
    listing_id: 'list-101',
    rating: 5,
    comment: 'The Sony A7 IV was in absolute pristine condition! Rahul was super accommodating, provided extra SD cards, and explained the settings thoroughly. 10/10 experience!',
    review_type: 'product',
    created_at: '2025-03-13T10:00:00Z',
  },
  {
    id: 'rev-402',
    rental_id: 'rent-301',
    reviewer_id: 'u-owner-1',
    reviewee_id: 'u-renter-1',
    listing_id: 'list-101',
    rating: 5,
    comment: 'Priya took outstanding care of the camera body and lenses. Prompt communication and punctual handover. Highly recommended renter!',
    review_type: 'renter',
    created_at: '2025-03-13T11:30:00Z',
  },
];

// Initial Conversations
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-501',
    listing_id: 'list-101',
    participant1_id: 'u-renter-1',
    participant2_id: 'u-owner-1',
    last_message_text: 'Thanks Rahul, the shoot went flawlessly!',
    last_message_at: '2025-03-13T09:30:00Z',
    created_at: '2025-03-01T12:05:00Z',
  },
];

// Initial Messages
export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-601',
    conversation_id: 'conv-501',
    sender_id: 'u-renter-1',
    content: 'Hi Rahul! Just placed a rental request for the Sony A7 IV. Can we coordinate handover near Sector 14 market?',
    is_read: true,
    created_at: '2025-03-01T12:05:00Z',
  },
  {
    id: 'msg-602',
    conversation_id: 'conv-501',
    sender_id: 'u-owner-1',
    content: 'Hello Priya! Absolutely, I accepted your request. I can meet you right by the market entrance at 10 AM on the 10th.',
    is_read: true,
    created_at: '2025-03-01T12:15:00Z',
  },
  {
    id: 'msg-603',
    conversation_id: 'conv-501',
    sender_id: 'u-renter-1',
    content: 'Thanks Rahul, the shoot went flawlessly!',
    is_read: true,
    created_at: '2025-03-13T09:30:00Z',
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-701',
    user_id: 'u-owner-1',
    title: 'New Rental Request Received',
    message: 'Priya Patel requested to rent your Epson Projector for 3 days.',
    type: 'rental_request',
    link: '/dashboard/requests',
    is_read: false,
    created_at: '2025-03-03T15:20:00Z',
  },
  {
    id: 'notif-702',
    user_id: 'u-renter-1',
    title: 'Rental Request Accepted 🎉',
    message: 'Rahul Sharma accepted your request for Sony Alpha A7 IV.',
    type: 'request_accepted',
    link: '/dashboard/rentals',
    is_read: true,
    created_at: '2025-03-01T12:10:00Z',
  },
];

// Initial Admin Settings
export const INITIAL_SETTINGS: AdminSettings = {
  platform_commission_percent: 10,
  min_rental_days: 1,
  max_rental_days: 30,
  instant_booking_enabled: false,
  platform_currency: 'INR',
  contact_support_email: 'support@rentit.marketplace',
};

// Storage Keys
const STORAGE_PREFIX = 'rentit_store_';

export class DataStore {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // --- Profiles & Auth ---
  static normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '').slice(-10);
  }

  static getProfiles(): Profile[] {
    const list = this.getItem<Profile[]>('profiles', INITIAL_PROFILES);
    return list.map((p) => {
      if (!p.password) {
        const seed = INITIAL_PROFILES.find((s) => s.id === p.id || s.email.toLowerCase() === p.email.toLowerCase());
        if (seed && seed.password) {
          p.password = seed.password;
        } else if (this.isBrowser()) {
          const stored = localStorage.getItem(`rentit_user_pwd_${p.email.toLowerCase()}`);
          if (stored) p.password = stored;
        }
      }
      return p;
    });
  }

  static getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  static getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
  }

  static getProfileByPhone(phone: string): Profile | undefined {
    const clean = this.normalizePhone(phone);
    if (!clean) return undefined;
    return this.getProfiles().find((p) => {
      if (!p.phone) return false;
      return this.normalizePhone(p.phone) === clean;
    });
  }

  static saveProfile(profile: Profile): Profile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push({ ...profile, created_at: new Date().toISOString() });
    }
    this.setItem('profiles', profiles);
    return profile;
  }

  static updateProfilePassword(emailOrId: string, newPassword: string): boolean {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex(
      (p) => p.id === emailOrId || p.email.toLowerCase() === emailOrId.trim().toLowerCase()
    );
    if (idx >= 0) {
      profiles[idx].password = newPassword;
      profiles[idx].updated_at = new Date().toISOString();
      this.setItem('profiles', profiles);
      if (this.isBrowser()) {
        localStorage.setItem(`rentit_user_pwd_${profiles[idx].email.toLowerCase()}`, newPassword);
      }
      return true;
    }
    return false;
  }

  // --- Categories ---
  static getCategories(): Category[] {
    return this.getItem<Category[]>('categories', INITIAL_CATEGORIES);
  }

  static saveCategory(category: Category): void {
    const cats = this.getCategories();
    const idx = cats.findIndex((c) => c.id === category.id || c.slug === category.slug);
    if (idx >= 0) {
      cats[idx] = category;
    } else {
      cats.push(category);
    }
    this.setItem('categories', cats);
  }

  // --- Listings ---
  static getListings(): Listing[] {
    const listings = this.getItem<Listing[]>('listings', INITIAL_LISTINGS);
    const categories = this.getCategories();
    const profiles = this.getProfiles();

    return listings.map((l) => ({
      ...l,
      category: categories.find((c) => c.id === l.category_id),
      owner: profiles.find((p) => p.id === l.owner_id),
    }));
  }

  static getListingById(id: string): Listing | undefined {
    return this.getListings().find((l) => l.id === id);
  }

  static saveListing(listing: Listing): Listing {
    const rawListings = this.getItem<Listing[]>('listings', INITIAL_LISTINGS);
    const index = rawListings.findIndex((l) => l.id === listing.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      rawListings[index] = {
        ...rawListings[index],
        ...listing,
        updated_at: now,
      };
    } else {
      rawListings.unshift({
        ...listing,
        created_at: now,
        updated_at: now,
      });
    }
    this.setItem('listings', rawListings);
    return this.getListingById(listing.id) || listing;
  }

  static deleteListing(id: string, userId: string): { success: boolean; error?: string } {
    const user = this.getProfileById(userId);
    const listing = this.getListingById(id);
    if (!listing) return { success: false, error: 'Listing not found' };

    if (listing.owner_id !== userId && user?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: You can only delete your own listings' };
    }

    const rawListings = this.getItem<Listing[]>('listings', INITIAL_LISTINGS);
    const updated = rawListings.filter((l) => l.id !== id);
    this.setItem('listings', updated);
    return { success: true };
  }

  // --- Double Booking Check ---
  static isListingBooked(listingId: string, startDate: string, endDate: string, excludeRequestId?: string): boolean {
    const requests = this.getRentalRequests();
    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    return requests.some((req) => {
      if (req.listing_id !== listingId) return false;
      if (req.status !== 'accepted' && req.status !== 'completed') return false;
      if (excludeRequestId && req.id === excludeRequestId) return false;

      const bookedStart = new Date(req.start_date).getTime();
      const bookedEnd = new Date(req.end_date).getTime();

      // Check overlap
      return reqStart <= bookedEnd && reqEnd >= bookedStart;
    });
  }

  // --- Rental Requests ---
  static getRentalRequests(): RentalRequest[] {
    const requests = this.getItem<RentalRequest[]>('rental_requests', INITIAL_REQUESTS);
    const listings = this.getListings();
    const profiles = this.getProfiles();

    return requests.map((req) => ({
      ...req,
      listing: listings.find((l) => l.id === req.listing_id),
      renter: profiles.find((p) => p.id === req.renter_id),
      owner: profiles.find((p) => p.id === req.owner_id),
    }));
  }

  static createRentalRequest(data: Omit<RentalRequest, 'id' | 'created_at' | 'status'>): {
    success: boolean;
    request?: RentalRequest;
    error?: string;
  } {
    if (data.renter_id === data.owner_id) {
      return { success: false, error: 'You cannot rent your own product.' };
    }

    const conflict = this.isListingBooked(data.listing_id, data.start_date, data.end_date);
    if (conflict) {
      return { success: false, error: 'Product is already booked for the selected dates. Please choose different dates.' };
    }

    const newRequest: RentalRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const requests = this.getItem<RentalRequest[]>('rental_requests', INITIAL_REQUESTS);
    requests.unshift(newRequest);
    this.setItem('rental_requests', requests);

    // Notify owner
    const listing = this.getListingById(data.listing_id);
    const renter = this.getProfileById(data.renter_id);
    this.createNotification({
      user_id: data.owner_id,
      title: 'New Rental Request Received',
      message: `${renter?.full_name || 'A user'} sent a request to rent "${listing?.title || 'your product'}".`,
      type: 'rental_request',
      link: '/dashboard/requests',
    });

    return { success: true, request: newRequest };
  }

  static updateRequestStatus(
    requestId: string,
    status: 'accepted' | 'rejected' | 'cancelled',
    actorId: string,
    reason?: string
  ): { success: boolean; error?: string } {
    const rawRequests = this.getItem<RentalRequest[]>('rental_requests', INITIAL_REQUESTS);
    const index = rawRequests.findIndex((r) => r.id === requestId);
    if (index === -1) return { success: false, error: 'Request not found' };

    const req = rawRequests[index];
    const user = this.getProfileById(actorId);

    // Authorization
    if (status === 'cancelled') {
      if (req.renter_id !== actorId && user?.role !== 'admin') {
        return { success: false, error: 'Only the renter can cancel this request' };
      }
    } else {
      if (req.owner_id !== actorId && user?.role !== 'admin') {
        return { success: false, error: 'Only the product owner can accept or reject requests' };
      }
    }

    if (status === 'accepted') {
      // Re-verify no conflicts
      if (this.isListingBooked(req.listing_id, req.start_date, req.end_date, req.id)) {
        return { success: false, error: 'Cannot accept: Overlapping booking already confirmed for these dates.' };
      }

      // Automatically create the active rental
      this.createRental({
        request_id: req.id,
        listing_id: req.listing_id,
        renter_id: req.renter_id,
        owner_id: req.owner_id,
        start_date: req.start_date,
        end_date: req.end_date,
        total_amount: req.total_amount,
        status: 'active',
        handover_notes: 'Booking confirmed by owner. Handover coordinates in chat.',
      });

      // Notify renter
      const listing = this.getListingById(req.listing_id);
      this.createNotification({
        user_id: req.renter_id,
        title: 'Rental Request Accepted! 🎉',
        message: `Your request to rent "${listing?.title || 'item'}" was accepted.`,
        type: 'request_accepted',
        link: '/dashboard/rentals',
      });
    } else if (status === 'rejected') {
      const listing = this.getListingById(req.listing_id);
      this.createNotification({
        user_id: req.renter_id,
        title: 'Rental Request Declined',
        message: `Your request for "${listing?.title || 'item'}" was declined${reason ? `: ${reason}` : '.'}`,
        type: 'request_rejected',
        link: '/dashboard/requests',
      });
    }

    rawRequests[index] = {
      ...req,
      status,
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    };
    this.setItem('rental_requests', rawRequests);
    return { success: true };
  }

  // --- Rentals ---
  static getRentals(): Rental[] {
    const rentals = this.getItem<Rental[]>('rentals', INITIAL_RENTALS);
    const listings = this.getListings();
    const profiles = this.getProfiles();

    return rentals.map((rent) => ({
      ...rent,
      listing: listings.find((l) => l.id === rent.listing_id),
      renter: profiles.find((p) => p.id === rent.renter_id),
      owner: profiles.find((p) => p.id === rent.owner_id),
    }));
  }

  static createRental(data: Omit<Rental, 'id' | 'created_at'>): Rental {
    const newRental: Rental = {
      ...data,
      id: `rent-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const rentals = this.getItem<Rental[]>('rentals', INITIAL_RENTALS);
    rentals.unshift(newRental);
    this.setItem('rentals', rentals);
    return newRental;
  }

  static completeRental(rentalId: string, actorId: string): { success: boolean; error?: string } {
    const rawRentals = this.getItem<Rental[]>('rentals', INITIAL_RENTALS);
    const index = rawRentals.findIndex((r) => r.id === rentalId);
    if (index === -1) return { success: false, error: 'Rental not found' };

    const rental = rawRentals[index];
    const user = this.getProfileById(actorId);

    if (rental.owner_id !== actorId && rental.renter_id !== actorId && user?.role !== 'admin') {
      return { success: false, error: 'Unauthorized to complete this rental' };
    }

    rawRentals[index] = {
      ...rental,
      status: 'completed',
      updated_at: new Date().toISOString(),
    };
    this.setItem('rentals', rawRentals);

    // Update associated request
    const rawRequests = this.getItem<RentalRequest[]>('rental_requests', INITIAL_REQUESTS);
    const reqIdx = rawRequests.findIndex((r) => r.id === rental.request_id);
    if (reqIdx >= 0) {
      rawRequests[reqIdx].status = 'completed';
      this.setItem('rental_requests', rawRequests);
    }

    // Notify both parties to leave a review
    const listing = this.getListingById(rental.listing_id);
    this.createNotification({
      user_id: rental.renter_id,
      title: 'Rental Completed! Leave a Review',
      message: `Your rental for "${listing?.title}" is completed. Share your feedback!`,
      type: 'rental_completed',
      link: `/product/${rental.listing_id}`,
    });

    this.createNotification({
      user_id: rental.owner_id,
      title: 'Rental Completed! Payout Processed',
      message: `Rental of "${listing?.title}" is marked completed.`,
      type: 'rental_completed',
      link: '/dashboard/rentals',
    });

    return { success: true };
  }

  // --- Reviews ---
  static getReviews(): Review[] {
    const reviews = this.getItem<Review[]>('reviews', INITIAL_REVIEWS);
    const profiles = this.getProfiles();
    return reviews.map((r) => ({
      ...r,
      reviewer: profiles.find((p) => p.id === r.reviewer_id),
    }));
  }

  static getReviewsForListing(listingId: string): Review[] {
    return this.getReviews().filter((r) => r.listing_id === listingId);
  }

  static getReviewsForUser(userId: string): Review[] {
    return this.getReviews().filter((r) => r.reviewee_id === userId);
  }

  static createReview(data: Omit<Review, 'id' | 'created_at'>): { success: boolean; review?: Review; error?: string } {
    const rentals = this.getRentals();
    const rental = rentals.find((r) => r.id === data.rental_id);

    if (!rental) return { success: false, error: 'Rental record not found' };
    if (rental.status !== 'completed') {
      return { success: false, error: 'Reviews can only be submitted after the rental is completed.' };
    }

    // Prevent duplicate review of the same type for same rental
    const existing = this.getReviews().find(
      (r) => r.rental_id === data.rental_id && r.reviewer_id === data.reviewer_id && r.review_type === data.review_type
    );
    if (existing) {
      return { success: false, error: 'You have already submitted a review for this rental.' };
    }

    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const reviews = this.getItem<Review[]>('reviews', INITIAL_REVIEWS);
    reviews.unshift(newReview);
    this.setItem('reviews', reviews);

    // Update reviewee rating
    this.recalculateUserRating(data.reviewee_id);

    // Notify reviewee
    const reviewer = this.getProfileById(data.reviewer_id);
    this.createNotification({
      user_id: data.reviewee_id,
      title: 'New Review Received ⭐',
      message: `${reviewer?.full_name || 'Someone'} left you a ${data.rating}-star review.`,
      type: 'new_review',
      link: `/profile/${data.reviewee_id}`,
    });

    return { success: true, review: newReview };
  }

  private static recalculateUserRating(userId: string): void {
    const userReviews = this.getReviews().filter((r) => r.reviewee_id === userId);
    if (userReviews.length === 0) return;

    const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    const profile = this.getProfileById(userId);
    if (profile) {
      profile.rating = Number(avg.toFixed(1));
      profile.total_ratings = userReviews.length;
      this.saveProfile(profile);
    }
  }

  // --- Conversations & Messages ---
  static getConversations(userId: string): Conversation[] {
    const raw = this.getItem<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    const listings = this.getListings();
    const profiles = this.getProfiles();

    return raw
      .filter((c) => c.participant1_id === userId || c.participant2_id === userId)
      .map((c) => {
        const otherId = c.participant1_id === userId ? c.participant2_id : c.participant1_id;
        return {
          ...c,
          listing: listings.find((l) => l.id === c.listing_id),
          other_user: profiles.find((p) => p.id === otherId),
        };
      })
      .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
  }

  static getOrCreateConversation(listingId: string, user1: string, user2: string): Conversation {
    const convs = this.getItem<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    const existing = convs.find(
      (c) =>
        c.listing_id === listingId &&
        ((c.participant1_id === user1 && c.participant2_id === user2) ||
          (c.participant1_id === user2 && c.participant2_id === user1))
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      listing_id: listingId,
      participant1_id: user1,
      participant2_id: user2,
      last_message_text: 'Conversation started',
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    convs.unshift(newConv);
    this.setItem('conversations', convs);
    return newConv;
  }

  static getMessages(conversationId: string): Message[] {
    const messages = this.getItem<Message[]>('messages', INITIAL_MESSAGES);
    const profiles = this.getProfiles();

    return messages
      .filter((m) => m.conversation_id === conversationId)
      .map((m) => ({
        ...m,
        sender: profiles.find((p) => p.id === m.sender_id),
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  static sendMessage(conversationId: string, senderId: string, content: string): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const messages = this.getItem<Message[]>('messages', INITIAL_MESSAGES);
    messages.push(newMsg);
    this.setItem('messages', messages);

    // Update conversation last message
    const convs = this.getItem<Conversation[]>('conversations', INITIAL_CONVERSATIONS);
    const convIdx = convs.findIndex((c) => c.id === conversationId);
    if (convIdx >= 0) {
      convs[convIdx].last_message_text = content;
      convs[convIdx].last_message_at = newMsg.created_at;
      this.setItem('conversations', convs);

      // Notify recipient
      const conv = convs[convIdx];
      const recipientId = conv.participant1_id === senderId ? conv.participant2_id : conv.participant1_id;
      const sender = this.getProfileById(senderId);

      this.createNotification({
        user_id: recipientId,
        title: `Message from ${sender?.full_name || 'User'}`,
        message: content.length > 60 ? content.substring(0, 60) + '...' : content,
        type: 'new_message',
        link: '/dashboard/messages',
      });
    }

    return newMsg;
  }

  // --- Notifications ---
  static getNotifications(userId: string): Notification[] {
    const notifs = this.getItem<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    return notifs
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static createNotification(data: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Notification {
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const notifs = this.getItem<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.unshift(newNotif);
    this.setItem('notifications', notifs);
    return newNotif;
  }

  static markNotificationRead(id: string): void {
    const notifs = this.getItem<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    const idx = notifs.findIndex((n) => n.id === id);
    if (idx >= 0) {
      notifs[idx].is_read = true;
      this.setItem('notifications', notifs);
    }
  }

  static markAllNotificationsRead(userId: string): void {
    const notifs = this.getItem<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    notifs.forEach((n) => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.setItem('notifications', notifs);
  }

  // --- Reports & Moderation ---
  static getReports(): Report[] {
    const reports = this.getItem<Report[]>('reports', []);
    const profiles = this.getProfiles();
    const listings = this.getListings();

    return reports.map((rep) => ({
      ...rep,
      reporter: profiles.find((p) => p.id === rep.reporter_id),
      reported_user: rep.reported_user_id ? profiles.find((p) => p.id === rep.reported_user_id) : undefined,
      reported_listing: rep.reported_listing_id ? listings.find((l) => l.id === rep.reported_listing_id) : undefined,
    }));
  }

  static createReport(data: Omit<Report, 'id' | 'created_at' | 'status'>): Report {
    const newReport: Report = {
      ...data,
      id: `rep-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const reports = this.getItem<Report[]>('reports', []);
    reports.unshift(newReport);
    this.setItem('reports', reports);
    return newReport;
  }

  static updateReportStatus(id: string, status: Report['status'], adminNotes?: string): void {
    const reports = this.getItem<Report[]>('reports', []);
    const idx = reports.findIndex((r) => r.id === id);
    if (idx >= 0) {
      reports[idx].status = status;
      if (adminNotes) reports[idx].admin_notes = adminNotes;
      this.setItem('reports', reports);
    }
  }

  // --- Admin Settings & Stats ---
  static getAdminSettings(): AdminSettings {
    return this.getItem<AdminSettings>('admin_settings', INITIAL_SETTINGS);
  }

  static updateAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
    const current = this.getAdminSettings();
    const updated = { ...current, ...settings };
    this.setItem('admin_settings', updated);
    return updated;
  }

  static getAdminStats() {
    const profiles = this.getProfiles();
    const listings = this.getListings();
    const requests = this.getRentalRequests();
    const rentals = this.getRentals();
    const reports = this.getReports();
    const settings = this.getAdminSettings();

    const completedRentals = rentals.filter((r) => r.status === 'completed');
    const totalRentalVolume = completedRentals.reduce((sum, r) => sum + r.total_amount, 0);
    const platformRevenue = Math.round((totalRentalVolume * settings.platform_commission_percent) / 100);

    return {
      totalUsers: profiles.length,
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === 'active').length,
      totalRequests: requests.length,
      completedRentals: completedRentals.length,
      activeRentals: rentals.filter((r) => r.status === 'active').length,
      pendingReports: reports.filter((r) => r.status === 'pending').length,
      totalRentalVolume,
      platformRevenue,
      commissionPercent: settings.platform_commission_percent,
    };
  }

  // Reset to initial seed state
  static resetToSeed(): void {
    if (!this.isBrowser()) return;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
