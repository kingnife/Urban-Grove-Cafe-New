export type MenuCategory = 
  | 'all'
  | 'coffee'
  | 'breakfast'
  | 'sandwiches'
  | 'pastries'
  | 'desserts'
  | 'cold-drinks';

export type DietaryType = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'organic';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  rating: number;
  reviewCount: number;
  dietary: DietaryType[];
  ingredients: string[];
  calories?: number;
  isPopular?: boolean;
  isSpecial?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
}

export interface CustomizationOption {
  size?: 'Regular' | 'Large';
  milk?: 'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk' | 'Coconut Milk';
  sweetness?: '0%' | '25%' | '50%' | '100%';
  temperature?: 'Hot' | 'Iced';
  extraShots?: number;
  specialInstructions?: string;
  selectedAddOns?: string[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: CustomizationOption;
  itemTotal: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
export type OrderType = 'pickup' | 'delivery';
export type PaymentMethod = 'card' | 'cod' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  orderType: OrderType;
  deliveryAddress?: string;
  tableNumber?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  estimatedReadyTime: string;
  notes?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  reservationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'Main Dining Room' | 'Window Bar Counter' | 'Garden Terrace Patio' | 'Quiet Study Nook';
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  favoriteItem?: string;
  verifiedCustomer: boolean;
}

export interface CafeEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  description: string;
  image: string;
  location: string;
  ticketPrice: number;
  spotsLeft: number;
  rsvps: { name: string; email: string; guests: number }[];
  rsvpList: { name: string; email: string; guests: number }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'replied' | 'archived';
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalReservations: number;
  totalCustomers: number;
  todayRevenue: number;
  reservationsToday: number;
  activeCustomers: number;
  popularItems: { name: string; sales: number; revenue: number }[];
  recentActivity: { timestamp: string; text: string; type: 'order' | 'reservation' | 'review' }[];
  weeklySales: { day: string; revenue: number; orders: number }[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  loyaltyPoints: number;
  savedAddresses: { id?: string; label: string; address: string; isDefault: boolean }[];
  favoriteItemIds: string[];
}
