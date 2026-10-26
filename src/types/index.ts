export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'egg';

export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'extra-spicy';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number; // in INR
  image: string;
  isAvailable: boolean;
  dietary: DietaryType;
  spiceLevel?: SpiceLevel;
  isChefSpecial?: boolean;
  isBestseller?: boolean;
  preparationTimeMinutes: number; // 0 = not specified (UI hides it)
  calories?: number;
  allergens?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  sortOrder: number;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'billing';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  code: string; // unique QR identifier, e.g. "T-04" or "tb_04"
  capacity: number;
  section: 'Main Dining' | 'Terrace Garden' | 'Private Lounge' | 'Bar Area';
  status: TableStatus;
  activeOrderId?: string;
}

export type OrderStatus =
  | 'placed'      // Customer just placed, waiting for waiter confirmation
  | 'accepted'    // Waiter accepted, ready to be sent to kitchen
  | 'preparing'   // Kitchen started cooking
  | 'ready'       // Kitchen finished, ready to serve
  | 'served'      // Waiter delivered to table
  | 'rejected'    // Waiter rejected with reason
  | 'completed'   // Final checkout & table cleared
  | 'cancelled';  // Cancelled

export type PaymentMethod = 'counter_cash' | 'counter_card' | 'counter_upi' | 'online_upi' | 'online_card';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSpice?: SpiceLevel;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  dietary: DietaryType;
  spiceLevel?: SpiceLevel;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #TF-1082
  tableId: string;
  tableNumber: string;
  tableCode: string;
  customerName?: string;
  customerPhone?: string;
  guestCount?: number;
  items: OrderItem[];
  subtotal: number;
  tax: number; // GST
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialNotes?: string;
  rejectionReason?: string;
  createdAt: string; // ISO string
  acceptedAt?: string;
  sentToKitchenAt?: string;
  preparingAt?: string;
  readyAt?: string;
  servedAt?: string;
  waiterName?: string;
}

export type StaffRole = 'manager' | 'waiter' | 'head_chef' | 'line_cook' | 'bartender' | 'host';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  assignedSection?: string;
  shift: 'Morning' | 'Evening' | 'Full Day';
  isActive: boolean;
  avatar: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  fssaiNumber: string;
  gstPercentage: number;
  serviceChargePercentage: number;
  isServiceChargeEnabled: boolean;
  estimatedPrepTimeMinutes: number;
  logoUrl?: string;
  openingTime: string;
  closingTime: string;
  wifiName?: string;
  wifiPassword?: string;
}
