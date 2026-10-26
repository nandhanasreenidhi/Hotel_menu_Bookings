import { Category, MenuItem, RestaurantSettings, RestaurantTable, StaffMember, Order } from '../types';
import { DAKSHIN_CATEGORIES, DAKSHIN_MENU_ITEMS } from './dakshinMenu';

/**
 * Version of the default menu + categories below. Bump this (to e.g. 'dakshin-2026-10')
 * in the SAME change that replaces the seed with the Dakshin Kitchen menu; saved browsers
 * then receive the new menu exactly once. 'legacy' (LEGACY_MENU_VERSION in menuMigration.ts) would disable it.
 */
export const MENU_SEED_VERSION: string = 'dakshin-2026-10';

export const initialSettings: RestaurantSettings = {
  name: 'THE SAFFRON PAVILION',
  tagline: 'Artisanal Coastal & Royal Awadhi Cuisine',
  currency: 'INR',
  currencySymbol: '₹',
  address: '42, Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
  phone: '+91 98450 12345',
  email: 'concierge@saffronpavilion.in',
  gstNumber: '29AABCS1429B1Z8',
  fssaiNumber: '11223334000582',
  gstPercentage: 5,
  serviceChargePercentage: 5,
  isServiceChargeEnabled: true,
  estimatedPrepTimeMinutes: 20,
  openingTime: '12:00 PM',
  closingTime: '11:30 PM',
  wifiName: 'SaffronPavilion_Guest',
  wifiPassword: 'tasteoftradition',
};

export const initialCategories: Category[] = DAKSHIN_CATEGORIES;

export const initialMenuItems: MenuItem[] = DAKSHIN_MENU_ITEMS;


export const initialTables: RestaurantTable[] = [
  { id: 'tbl-1', tableNumber: '01', code: 'T-01', capacity: 2, section: 'Main Dining', status: 'available' },
  { id: 'tbl-2', tableNumber: '02', code: 'T-02', capacity: 2, section: 'Main Dining', status: 'available' },
  { id: 'tbl-3', tableNumber: '03', code: 'T-03', capacity: 4, section: 'Main Dining', status: 'available' },
  { id: 'tbl-4', tableNumber: '04', code: 'T-04', capacity: 4, section: 'Terrace Garden', status: 'available' },
  { id: 'tbl-5', tableNumber: '05', code: 'T-05', capacity: 6, section: 'Terrace Garden', status: 'available' },
  { id: 'tbl-6', tableNumber: '06', code: 'T-06', capacity: 6, section: 'Terrace Garden', status: 'available' },
  { id: 'tbl-7', tableNumber: '07', code: 'T-07', capacity: 8, section: 'Private Lounge', status: 'available' },
  { id: 'tbl-8', tableNumber: '08', code: 'T-08', capacity: 8, section: 'Private Lounge', status: 'available' },
  { id: 'tbl-9', tableNumber: '09', code: 'T-09', capacity: 2, section: 'Bar Area', status: 'available' },
  { id: 'tbl-10', tableNumber: '10', code: 'T-10', capacity: 4, section: 'Bar Area', status: 'available' },
];


export const initialStaff: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Vikramaditya Rathore',
    role: 'manager',
    phone: '+91 98451 11223',
    email: 'vikram@saffronpavilion.in',
    shift: 'Full Day',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'stf-2',
    name: 'Chef Harinder Singh',
    role: 'head_chef',
    phone: '+91 98452 22334',
    email: 'harinder.chef@saffronpavilion.in',
    shift: 'Morning',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'stf-3',
    name: 'Arjun Nambiar',
    role: 'waiter',
    phone: '+91 98453 33445',
    email: 'arjun.n@saffronpavilion.in',
    assignedSection: 'Terrace Garden',
    shift: 'Evening',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'stf-4',
    name: 'Priya Sundaram',
    role: 'waiter',
    phone: '+91 98454 44556',
    email: 'priya.s@saffronpavilion.in',
    assignedSection: 'Main Dining',
    shift: 'Morning',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'stf-5',
    name: 'Mohammed Rizwan',
    role: 'line_cook',
    phone: '+91 98455 55667',
    email: 'rizwan.cook@saffronpavilion.in',
    shift: 'Full Day',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

const now = new Date();

export const initialOrders: Order[] = [
  // {
  //   id: 'ord-101',
  //   orderNumber: '#TF-1082',
  //   tableId: 'tbl-3',
  //   tableNumber: '03',
  //   tableCode: 'T-03',
  //   customerName: 'Ananya Sharma',
  //   customerPhone: '+91 98765 43210',
  //   guestCount: 3,
  //   items: [
  //     {
  //       id: 'oi-1',
  //       menuItemId: 'item-1',
  //       name: 'Truffle Mushroom Galouti',
  //       price: 495,
  //       quantity: 1,
  //       dietary: 'veg',
  //       spiceLevel: 'mild',
  //       specialInstructions: 'Extra saffron sheermal crisp if possible',
  //     },
  //     {
  //       id: 'oi-2',
  //       menuItemId: 'item-2',
  //       name: 'Old Delhi Smoked Butter Chicken',
  //       price: 645,
  //       quantity: 1,
  //       dietary: 'non-veg',
  //       spiceLevel: 'medium',
  //     },
  //     {
  //       id: 'oi-3',
  //       menuItemId: 'item-9',
  //       name: 'Wild Garlic & Smoked Cheese Naan',
  //       price: 185,
  //       quantity: 2,
  //       dietary: 'veg',
  //     },
  //   ],
  //   subtotal: 1510,
  //   tax: 75.5,
  //   serviceCharge: 75.5,
  //   total: 1661,
  //   status: 'placed', // New order waiting for waiter
  //   paymentMethod: 'online_upi',
  //   paymentStatus: 'pending',
  //   specialNotes: 'Table celebrating an anniversary',
  //   createdAt: new Date(now.getTime() - 2 * 60000).toISOString(), // 2 mins ago
  // },
  // {
  //   id: 'ord-102',
  //   orderNumber: '#TF-1080',
  //   tableId: 'tbl-4',
  //   tableNumber: '04',
  //   tableCode: 'T-04',
  //   customerName: 'Rahul & Meera',
  //   customerPhone: '+91 99887 76655',
  //   guestCount: 2,
  //   items: [
  //     {
  //       id: 'oi-4',
  //       menuItemId: 'item-5',
  //       name: 'Awadhi Nizami Dum Gosht Biryani',
  //       price: 745,
  //       quantity: 1,
  //       dietary: 'non-veg',
  //       spiceLevel: 'medium',
  //     },
  //     {
  //       id: 'oi-5',
  //       menuItemId: 'item-3',
  //       name: 'Dal Saffron Bukhara (24-Hour Slow Cook)',
  //       price: 485,
  //       quantity: 1,
  //       dietary: 'veg',
  //     },
  //     {
  //       id: 'oi-6',
  //       menuItemId: 'item-12',
  //       name: 'Smoked Kokum Jamun Spritz',
  //       price: 285,
  //       quantity: 2,
  //       dietary: 'vegan',
  //     },
  //   ],
  //   subtotal: 1800,
  //   tax: 90,
  //   serviceCharge: 90,
  //   total: 1980,
  //   status: 'preparing', // Kitchen currently cooking
  //   paymentMethod: 'counter_card',
  //   paymentStatus: 'pending',
  //   createdAt: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 mins ago
  //   acceptedAt: new Date(now.getTime() - 13 * 60000).toISOString(),
  //   preparingAt: new Date(now.getTime() - 10 * 60000).toISOString(),
  //   waiterName: 'Arjun Nambiar',
  // },
  // {
  //   id: 'ord-103',
  //   orderNumber: '#TF-1078',
  //   tableId: 'tbl-6',
  //   tableNumber: '06',
  //   tableCode: 'T-06',
  //   customerName: 'Kavita Reddy',
  //   guestCount: 4,
  //   items: [
  //     {
  //       id: 'oi-7',
  //       menuItemId: 'item-4',
  //       name: 'Malabar Jumbo Prawn Curry',
  //       price: 795,
  //       quantity: 1,
  //       dietary: 'non-veg',
  //       spiceLevel: 'spicy',
  //       specialInstructions: 'Make it authentically spicy',
  //     },
  //     {
  //       id: 'oi-8',
  //       menuItemId: 'item-7',
  //       name: 'Bhatti Da Murgh Tikka',
  //       price: 525,
  //       quantity: 1,
  //       dietary: 'non-veg',
  //     },
  //     {
  //       id: 'oi-9',
  //       menuItemId: 'item-9',
  //       name: 'Wild Garlic & Smoked Cheese Naan',
  //       price: 185,
  //       quantity: 3,
  //       dietary: 'veg',
  //     },
  //   ],
  //   subtotal: 1875,
  //   tax: 93.75,
  //   serviceCharge: 93.75,
  //   total: 2062.5,
  //   status: 'ready', // Cooked & hot, ready for waiter to pick up
  //   paymentMethod: 'counter_cash',
  //   paymentStatus: 'pending',
  //   createdAt: new Date(now.getTime() - 25 * 60000).toISOString(),
  //   acceptedAt: new Date(now.getTime() - 23 * 60000).toISOString(),
  //   preparingAt: new Date(now.getTime() - 20 * 60000).toISOString(),
  //   readyAt: new Date(now.getTime() - 2 * 60000).toISOString(),
  //   waiterName: 'Priya Sundaram',
  // },
  // {
  //   id: 'ord-104',
  //   orderNumber: '#TF-1075',
  //   tableId: 'tbl-9',
  //   tableNumber: '09',
  //   tableCode: 'T-09',
  //   customerName: 'Dev & Friends',
  //   items: [
  //     {
  //       id: 'oi-10',
  //       menuItemId: 'item-8',
  //       name: 'Zafrani Paneer Tikka Angaar',
  //       price: 465,
  //       quantity: 1,
  //       dietary: 'veg',
  //     },
  //     {
  //       id: 'oi-11',
  //       menuItemId: 'item-11',
  //       name: 'Pistachio Kulfi with Rose Falooda & Gold Leaf',
  //       price: 365,
  //       quantity: 2,
  //       dietary: 'veg',
  //     },
  //   ],
  //   subtotal: 1195,
  //   tax: 59.75,
  //   serviceCharge: 59.75,
  //   total: 1314.5,
  //   status: 'served',
  //   paymentMethod: 'online_upi',
  //   paymentStatus: 'paid',
  //   createdAt: new Date(now.getTime() - 48 * 60000).toISOString(),
  //   acceptedAt: new Date(now.getTime() - 45 * 60000).toISOString(),
  //   preparingAt: new Date(now.getTime() - 40 * 60000).toISOString(),
  //   readyAt: new Date(now.getTime() - 25 * 60000).toISOString(),
  //   servedAt: new Date(now.getTime() - 20 * 60000).toISOString(),
  //   waiterName: 'Arjun Nambiar',
  // },
];
