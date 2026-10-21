import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurant } from '../../../context/RestaurantContext';
import { MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { MenuHeader } from '../components/MenuHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { Search, ShoppingBag, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MenuPage: React.FC = () => {
  const { tableCode = 'T-04' } = useParams<{ tableCode: string }>();
  const {
    menuItems,
    categories,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateCartQuantity,
    getTableByCode,
    setActiveTableCode,
  } = useRestaurant();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'special'>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [cartBounce, setCartBounce] = useState<boolean>(false);

  // Sync active table code to context
  useEffect(() => {
    if (tableCode) {
      setActiveTableCode(tableCode);
    }
  }, [tableCode, setActiveTableCode]);

  const currentTable = getTableByCode(tableCode);

  // Calculate item counts per category for the tab pills
  const itemCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      if (cat.id === 'cat-all') {
        counts[cat.id] = menuItems.length;
      } else {
        counts[cat.id] = menuItems.filter(item => item.category === cat.id).length;
      }
    });
    return counts;
  }, [categories, menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (activeCategoryId !== 'cat-all' && item.category !== activeCategoryId) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'special' && !item.isChefSpecial) {
        return false;
      }
      return true;
    });
  }, [menuItems, activeCategoryId, searchQuery, dietaryFilter]);

  // Trigger bounce animation when cart changes
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  const handleModalAdd = (
    item: MenuItem,
    options: { spice?: any; instructions?: string; quantity: number }
  ) => {
    for (let i = 0; i < options.quantity; i++) {
      addToCart(item, { spice: options.spice, instructions: options.instructions });
    }
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-28 text-stone-900">
      {/* Restaurant Header */}
      <MenuHeader table={currentTable} tableCode={tableCode} />

      {/* Sticky Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={setActiveCategoryId}
        itemCountsByCategory={itemCountsByCategory}
      />

      {/* Search & Dietary Filters Container */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tandoor, biryani, curries, mocktails..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200/90 text-xs text-stone-800 placeholder-stone-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-800 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                dietaryFilter === 'all'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'special' ? 'all' : 'special')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1 ${
                dietaryFilter === 'special'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chef's Choice</span>
            </button>
          </div>
        </div>

        {/* Current Category Title & Count */}
        <div className="mt-5 flex items-baseline justify-between border-b border-stone-200/60 pb-2">
          <h2 className="text-xl font-serif font-bold text-stone-900">
            {categories.find(c => c.id === activeCategoryId)?.name || 'Culinary Selection'}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} available
          </span>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <main className="max-w-4xl mx-auto px-4 mt-4">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
            <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-base font-serif font-bold text-stone-800">
              No matching dishes found
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Try adjusting your search terms or dietary filter to explore other handcrafted delicacies.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryId('cat-all');
                setDietaryFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {filteredItems.map(item => {
              const inCartItem = cart.find(ci => ci.menuItem.id === item.id);
              const qty = inCartItem ? inCartItem.quantity : 0;

              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  onOpenDetails={setSelectedItemForModal}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={updateCartQuantity}
                  cartQuantity={qty}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (Mobile-first, always accessible) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <div className="fixed bottom-3 inset-x-0 z-40 px-4 max-w-md mx-auto pointer-events-none">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="pointer-events-auto"
            >
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#132E22] hover:bg-emerald-950 text-white shadow-2xl shadow-emerald-950/40 flex items-center justify-between transition-transform duration-200 active:scale-[0.98] border border-emerald-700/40 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={cartBounce ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="relative w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-950 text-amber-300 text-[10px] flex items-center justify-center border border-amber-400 font-mono">
                      {cartCount}
                    </span>
                  </motion.div>
                  <div className="text-left">
                    <span className="block text-[11px] text-emerald-300 font-medium">
                      Table {tableCode} Order
                    </span>
                    <span className="text-sm font-serif font-bold text-white">
                      {formatINR(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-amber-300">
                  <span>View Cart</span>
                  <span className="text-base">→</span>
                </div>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Food Detail Modal */}
      <FoodDetailModal
        item={selectedItemForModal}
        isOpen={!!selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAdd={handleModalAdd}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tableCode={tableCode}
      />
    </div>
  );
};
