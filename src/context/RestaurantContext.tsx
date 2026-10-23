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
  sendOrderToKitchen: (orderId: string) => void;
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
  clearCart: (tableCode?: string) => void;
  cartSubtotal: number;
  cartTax: number;
  cartServiceCharge: number;
  cartTotal: number;
  cartCount: number;

  // System
  resetToDefaults: () => void;
  clearDemoOrders: () => void;
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

  // Customer Cart state isolated per table code: { [tableCode]: CartItem[] }
  const [tableCarts, setTableCarts] = useState<Record<string, CartItem[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_table_carts`);
      if (saved) return JSON.parse(saved);
      // Backward compatibility: migrate previous single cart to T-04 if present
      const oldCart = localStorage.getItem(`${STORAGE_KEY}_cart`);
      if (oldCart) {
        const parsed = JSON.parse(oldCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { 'T-04': parsed };
        }
      }
      return {};
    } catch {
      return {};
    }
  });

  const normalizeTableCode = (code: string) => code.trim().toUpperCase();

  const [activeTableCode, setActiveTableCodeState] = useState<string>('T-04');

  const setActiveTableCode = (code: string) => {
    setActiveTableCodeState(normalizeTableCode(code));
  };
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
      localStorage.setItem(`${STORAGE_KEY}_table_carts`, JSON.stringify(tableCarts));
    } catch (e) {
      console.warn('Failed to sync table carts', e);
    }
  }, [tableCarts]);

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
      if (e.key === `${STORAGE_KEY}_table_carts` && e.newValue) {
        setTableCarts(JSON.parse(e.newValue));
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


  // Cart operations — each table has its own cart
  const cart = tableCarts[normalizeTableCode(activeTableCode)] ?? [];

  const setCart = (
    updater: CartItem[] | ((previous: CartItem[]) => CartItem[]),
    tableCode = activeTableCode
  ) => {
    const key = normalizeTableCode(tableCode);

    setTableCarts(previous => {
      const currentCart = previous[key] ?? [];
      const nextCart =
        typeof updater === 'function'
          ? updater(currentCart)
          : updater;

      return {
        ...previous,
        [key]: nextCart,
      };
    });
  };

  const addToCart = (
    item: MenuItem,
    options?: { spice?: SpiceLevel; instructions?: string }
  ) => {
    if (!item.isAvailable) return;

    setCart(previous => {
      const existingIndex = previous.findIndex(
        ci =>
          ci.menuItem.id === item.id &&
          ci.selectedSpice === (options?.spice || item.spiceLevel)
      );

      if (existingIndex !== -1) {
        return previous.map((ci, index) =>
          index === existingIndex
            ? {
              ...ci,
              quantity: ci.quantity + 1,
              specialInstructions:
                options?.instructions || ci.specialInstructions,
            }
            : ci
        );
      }

      return [
        ...previous,
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
    setCart(previous =>
      previous
        .map(item => {
          if (item.menuItem.id !== itemId) return item;

          const quantity = item.quantity + delta;
          return quantity > 0 ? { ...item, quantity } : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(previous =>
      previous.filter(item => item.menuItem.id !== itemId)
    );
  };

  const clearCart = (tableCode = activeTableCode) => {
    setCart([], tableCode);
  };

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

  const cartTax = (cartSubtotal * settings.gstPercentage) / 100;

  const cartServiceCharge = settings.isServiceChargeEnabled
    ? (cartSubtotal * settings.serviceChargePercentage) / 100
    : 0;

  const cartTotal = cartSubtotal + cartTax + cartServiceCharge;

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
    const orderCart =
      tableCarts[normalizeTableCode(tableCode)] ?? [];

    if (orderCart.length === 0) return null;

    // Calculate the total for this table's cart
    const orderSubtotal = orderCart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );

    const orderTax =
      (orderSubtotal * settings.gstPercentage) / 100;

    const orderServiceCharge = settings.isServiceChargeEnabled
      ? (orderSubtotal * settings.serviceChargePercentage) / 100
      : 0;

    const orderTotal =
      orderSubtotal + orderTax + orderServiceCharge;

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
      items: orderCart.map(ci => ({
        id: generateId('oi'),
        menuItemId: ci.menuItem.id,
        name: ci.menuItem.name,
        price: ci.menuItem.price,
        quantity: ci.quantity,
        dietary: ci.menuItem.dietary,
        spiceLevel: ci.selectedSpice,
        specialInstructions: ci.specialInstructions,
      })),
      subtotal: orderSubtotal,
      tax: orderTax,
      serviceCharge: orderServiceCharge,
      total: orderTotal,
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
    clearCart(tableCode);
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
            sentToKitchenAt: undefined,
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

  const sendOrderToKitchen = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId &&
          ord.status === 'accepted' &&
          !ord.sentToKitchenAt
          ? {
            ...ord,
            sentToKitchenAt: new Date().toISOString(),
          }
          : ord
      )
    );
  };

  const startPreparingOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId &&
          ord.status === 'accepted' &&
          !!ord.sentToKitchenAt
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
        ord.id === orderId && ord.status === 'preparing'
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
        ord.id === orderId && ord.status === 'ready'
          ? {
            ...ord,
            status: 'served',
            servedAt: new Date().toISOString(),
          }
          : ord
      )
    );
  };

  const updatePaymentStatus = (
    orderId: string,
    status: PaymentStatus,
    method?: PaymentMethod
  ) => {
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

  const clearDemoOrders = () => {
    // Remove all existing orders
    setOrders([]);
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify([]));

    // Make every table available while preserving its QR code and details
    setTables(previous =>
      previous.map(table => ({
        ...table,
        status: 'available',
        activeOrderId: undefined,
      }))
    );

    // Remove old carts
    setTableCarts({});
    localStorage.removeItem(`${STORAGE_KEY}_cart`);
    localStorage.setItem(`${STORAGE_KEY}_table_carts`, JSON.stringify({}));

    // Clear old order notifications
    setNewOrderAlertCount(0);
  };


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
        sendOrderToKitchen,
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
        clearDemoOrders,
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
