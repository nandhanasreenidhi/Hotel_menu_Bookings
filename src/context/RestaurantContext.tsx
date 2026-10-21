import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Category,
  MenuItem,
  Order,
  RestaurantSettings,
  RestaurantTable,
  StaffMember,
  CartItem,
  SpiceLevel,
  PaymentMethod,
  PaymentStatus,
  DietaryType,
} from '../types';
import {
  initialCategories,
  initialMenuItems,
  initialOrders,
  initialSettings,
  initialStaff,
  initialTables,
} from '../data/initialData';
import { generateOrderNumber, generateId } from '../lib/utils';

interface RestaurantContextType {
  // Settings
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;

  // Categories
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  // Menu items
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Tables
  tables: RestaurantTable[];
  addTable: (table: Omit<RestaurantTable, 'id'>) => void;
  updateTable: (id: string, table: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  getTableByCode: (code: string) => RestaurantTable | undefined;

  // Staff
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id'>) => void;
  updateStaff: (id: string, member: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (payload: {
    tableCode: string;
    customerName?: string;
    customerPhone?: string;
    guestCount?: number;
    paymentMethod: PaymentMethod;
    specialNotes?: string;
  }) => Order | null;
  acceptOrder: (orderId: string, waiterName?: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  startPreparingOrder: (orderId: string) => void;
  markOrderReady: (orderId: string) => void;
  markOrderServed: (orderId: string) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, method?: PaymentMethod) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Customer Cart
  cart: CartItem[];
  activeTableCode: string;
  setActiveTableCode: (code: string) => void;
  addToCart: (item: MenuItem, options?: { spice?: SpiceLevel; instructions?: string }) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartServiceCharge: number;
  cartTotal: number;
  cartCount: number;

  // System
  resetToDefaults: () => void;
  newOrderAlertCount: number;
  clearNewOrderAlert: () => void;
}

const STORAGE_KEY = 'TABLEFLOW_DEMO_STATE_V1';

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      return saved ? JSON.parse(saved) : initialMenuItems;
    } catch {
      return initialMenuItems;
    }
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tables`);
      return saved ? JSON.parse(saved) : initialTables;
    } catch {
      return initialTables;
    }
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
      return saved ? JSON.parse(saved) : initialStaff;
    } catch {
      return initialStaff;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  // Customer Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTableCode, setActiveTableCode] = useState<string>('T-04');
  const [newOrderAlertCount, setNewOrderAlertCount] = useState<number>(0);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to sync settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to sync categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to sync menuItems', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tables`, JSON.stringify(tables));
    } catch (e) {
      console.warn('Failed to sync tables', e);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
    } catch (e) {
      console.warn('Failed to sync staff', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to sync orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to sync cart', e);
    }
  }, [cart]);

  // Handle cross-tab storage updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === `${STORAGE_KEY}_orders` && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === `${STORAGE_KEY}_menu` && e.newValue) {
        setMenuItems(JSON.parse(e.newValue));
      }
      if (e.key === `${STORAGE_KEY}_settings` && e.newValue) {
        setSettings(JSON.parse(e.newValue));
      }
      if (e.key === `${STORAGE_KEY}_tables` && e.newValue) {
        setTables(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Settings actions
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Category actions
  const addCategory = (name: string) => {
    const id = `cat-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    setCategories(prev => [...prev, { id, name, sortOrder: prev.length }]);
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, name } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Menu items actions
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: generateId('item'),
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, itemData: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => (item.id === id ? { ...item, ...itemData } : item)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  // Table actions
  const addTable = (tableData: Omit<RestaurantTable, 'id'>) => {
    const newTable: RestaurantTable = {
      ...tableData,
      id: generateId('tbl'),
    };
    setTables(prev => [...prev, newTable]);
  };

  const updateTable = (id: string, tableData: Partial<RestaurantTable>) => {
    setTables(prev => prev.map(tbl => (tbl.id === id ? { ...tbl, ...tableData } : tbl)));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(tbl => tbl.id !== id));
  };

  const getTableByCode = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    return tables.find(t => t.code.toUpperCase() === cleanCode || t.tableNumber === cleanCode);
  };

  // Staff actions
  const addStaff = (memberData: Omit<StaffMember, 'id'>) => {
    const newMember: StaffMember = {
      ...memberData,
      id: generateId('stf'),
    };
    setStaff(prev => [...prev, newMember]);
  };

  const updateStaff = (id: string, memberData: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...memberData } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  // Cart operations
  const addToCart = (item: MenuItem, options?: { spice?: SpiceLevel; instructions?: string }) => {
    if (!item.isAvailable) return;
    setCart(prev => {
      const existingIndex = prev.findIndex(
        ci => ci.menuItem.id === item.id && ci.selectedSpice === options?.spice
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        if (options?.instructions) {
          next[existingIndex].specialInstructions = options.instructions;
        }
        return next;
      }
      return [
        ...prev,
        {
          menuItem: item,
          quantity: 1,
          selectedSpice: options?.spice || item.spiceLevel,
          specialInstructions: options?.instructions,
        },
      ];
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(ci => {
          if (ci.menuItem.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const cartTax = (cartSubtotal * settings.gstPercentage) / 100;
  const cartServiceCharge = settings.isServiceChargeEnabled
    ? (cartSubtotal * settings.serviceChargePercentage) / 100
    : 0;
  const cartTotal = cartSubtotal + cartTax + cartServiceCharge;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order actions
  const createOrder = ({
    tableCode,
    customerName,
    customerPhone,
    guestCount,
    paymentMethod,
    specialNotes,
  }: {
    tableCode: string;
    customerName?: string;
    customerPhone?: string;
    guestCount?: number;
    paymentMethod: PaymentMethod;
    specialNotes?: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const table = getTableByCode(tableCode) || {
      id: generateId('tbl_virtual'),
      tableNumber: tableCode.replace(/[^0-9]/g, '') || '01',
      code: tableCode,
      capacity: 4,
      section: 'Main Dining' as const,
      status: 'occupied' as const,
    };

    const orderId = generateId('ord');
    const newOrder: Order = {
      id: orderId,
      orderNumber: generateOrderNumber(),
      tableId: table.id,
      tableNumber: table.tableNumber,
      tableCode: table.code,
      customerName: customerName || 'Guest Diner',
      customerPhone,
      guestCount: guestCount || 2,
      items: cart.map(ci => ({
        id: generateId('oi'),
        menuItemId: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        dietary: ci.menuItem.dietary,
        spiceLevel: ci.selectedSpice,
        specialInstructions: ci.specialInstructions,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      serviceCharge: cartServiceCharge,
      total: cartTotal,
      status: 'placed',
      paymentMethod,
      paymentStatus: paymentMethod.startsWith('online') ? 'paid' : 'pending',
      specialNotes,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setTables(prev =>
      prev.map(t =>
        t.id === table.id ? { ...t, status: 'occupied', activeOrderId: orderId } : t
      )
    );
    setNewOrderAlertCount(prev => prev + 1);
    clearCart();
    return newOrder;
  };

  const acceptOrder = (orderId: string, waiterName = 'Staff Member') => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'accepted',
              acceptedAt: new Date().toISOString(),
              waiterName,
            }
          : ord
      )
    );
  };

  const rejectOrder = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'rejected',
              rejectionReason: reason,
            }
          : ord
      )
    );
  };

  const startPreparingOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'preparing',
              preparingAt: ord.preparingAt || new Date().toISOString(),
            }
          : ord
      )
    );
  };

  const markOrderReady = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'ready',
              readyAt: new Date().toISOString(),
            }
          : ord
      )
    );
  };

  const markOrderServed = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'served',
              servedAt: new Date().toISOString(),
            }
          : ord
      )
    );
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, method?: PaymentMethod) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              paymentStatus: status,
              paymentMethod: method || ord.paymentMethod,
            }
          : ord
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  };

  const clearNewOrderAlert = () => setNewOrderAlertCount(0);

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
    localStorage.removeItem(`${STORAGE_KEY}_menu`);
    localStorage.removeItem(`${STORAGE_KEY}_tables`);
    localStorage.removeItem(`${STORAGE_KEY}_staff`);
    localStorage.removeItem(`${STORAGE_KEY}_orders`);
    localStorage.removeItem(`${STORAGE_KEY}_cart`);

    setSettings(initialSettings);
    setCategories(initialCategories);
    setMenuItems(initialMenuItems);
    setTables(initialTables);
    setStaff(initialStaff);
    setOrders(initialOrders);
    setCart([]);
    setNewOrderAlertCount(0);
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        tables,
        addTable,
        updateTable,
        deleteTable,
        getTableByCode,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        orders,
        createOrder,
        acceptOrder,
        rejectOrder,
        startPreparingOrder,
        markOrderReady,
        markOrderServed,
        updatePaymentStatus,
        getOrderById,
        cart,
        activeTableCode,
        setActiveTableCode,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTax,
        cartServiceCharge,
        cartTotal,
        cartCount,
        resetToDefaults,
        newOrderAlertCount,
        clearNewOrderAlert,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
