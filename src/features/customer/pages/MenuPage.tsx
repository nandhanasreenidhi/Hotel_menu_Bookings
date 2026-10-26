import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Category, MenuItem } from '../../../types';
import { formatINR } from '../../../lib/utils';
import { MenuHeader } from '../components/MenuHeader';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { CategoryTabs } from '../components/CategoryTabs';
import { MenuSection } from '../components/MenuSection';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { FilterCoffeeBanner } from '../components/FilterCoffeeBanner';
import { Search, Sparkles } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { burst, flyToCart, prefersReducedMotion } from '../utils/dakshinFx';
import '../styles/dakshin.css';

interface ToastState {
  message: React.ReactNode;
  undoItemId?: string;
}

/** Dakshin Kitchen customer menu. All data, cart, table and order handling comes from RestaurantContext. */
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
    settings,
  } = useRestaurant();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'special'>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [storyRef, storySeen] = useInView<HTMLElement>(0.2);

  // Sync active table code to context (unchanged behaviour)
  useEffect(() => {
    if (tableCode) setActiveTableCode(tableCode);
  }, [tableCode, setActiveTableCode]);

  const currentTable = getTableByCode(tableCode);

  // Page-level chrome the standalone design put on <html>/<body>; restored on leave.
  useEffect(() => {
    const html = document.documentElement;
    const prevPad = html.style.scrollPaddingTop;
    const prevBg = document.body.style.backgroundColor;
    html.style.scrollPaddingTop = 'calc(env(safe-area-inset-top, 0px) + 120px)';
    document.body.style.backgroundColor = '#21150F';
    return () => {
      html.style.scrollPaddingTop = prevPad;
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  // Scroll progress bar + gentle parallax on the signature cards
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progRef.current) progRef.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        if (prefersReducedMotion()) return;
        rootRef.current?.style.setProperty('--sy', String(Math.min(y, 900)));
        const vh = window.innerHeight;
        document.querySelectorAll<HTMLElement>('.dk .sec:not(.L7) .card.f .im').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -60 || r.top > vh + 60) return;
          el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -0.05).toFixed(1)}px`;
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Chef's favourites (chef specials; fall back to the first few dishes)
  const featuredDishes = useMemo(() => {
    const specials = menuItems.filter(item => item.isChefSpecial && item.isAvailable);
    if (specials.length >= 3) return specials;
    return menuItems.slice(0, 5);
  }, [menuItems]);

  // Total quantity per dish across all cart lines
  const cartQtyById = useMemo(() => {
    const out: Record<string, number> = {};
    cart.forEach(ci => {
      out[ci.menuItem.id] = (out[ci.menuItem.id] ?? 0) + ci.quantity;
    });
    return out;
  }, [cart]);

  const matchesFilters = useCallback(
    (item: MenuItem) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
      }
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') return false;
      if (dietaryFilter === 'special' && !item.isChefSpecial) return false;
      return true;
    },
    [searchQuery, dietaryFilter]
  );

  // One section per category (in sortOrder), plus a catch-all so no dish can ever disappear.
  const sections = useMemo(() => {
    const real = categories.filter(c => c.id !== 'cat-all').sort((a, b) => a.sortOrder - b.sortOrder);
    const known = new Set(real.map(c => c.id));
    const orphans = menuItems.filter(i => !known.has(i.category));
    const cats: Category[] = [...real];
    if (orphans.length) cats.push({ id: 'cat-other', name: 'More from the Kitchen', sortOrder: 999 });
    return cats
      .map(cat => {
        const all = cat.id === 'cat-other' ? orphans : menuItems.filter(i => i.category === cat.id);
        return { cat, all, items: all.filter(matchesFilters) };
      })
      .filter(s => s.items.length > 0);
  }, [categories, menuItems, matchesFilters]);

  const visibleDishCount = sections.reduce((n, s) => n + s.items.length, 0);
  const sectionKey = sections.map(s => s.cat.id).join('|');
  const currentActiveId = sections.some(s => s.cat.id === activeCategoryId)
    ? activeCategoryId
    : sections[0]?.cat.id ?? '';

  // Scroll-spy: highlight the chip of the section under the reading line
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActiveCategoryId(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sectionKey.split('|').filter(Boolean).forEach(id => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sectionKey]);

  const scrollToSection = (id: string) => {
    setActiveCategoryId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const scrollToCatalogue = () => {
    const first = sections[0]?.cat.id;
    if (first) scrollToSection(first);
  };
  const scrollToFavourites = () => {
    document.getElementById('favs')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const showToast = (state: ToastState) => {
    setToast(state);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Add one dish straight from a card / favourites tile
  const handleAddToCart = (item: MenuItem, sourceEl?: HTMLElement) => {
    addToCart(item);
    if (sourceEl) {
      burst(sourceEl);
      flyToCart(sourceEl.getBoundingClientRect());
    }
    showToast({
      message: (
        <span>
          ✓ <b>{item.name}</b> added · {(cartQtyById[item.id] ?? 0) + 1} in order
        </span>
      ),
      undoItemId: item.id,
    });
  };

  const handleModalAdd = (
    item: MenuItem,
    options: { spice?: any; instructions?: string; quantity: number }
  ) => {
    for (let i = 0; i < options.quantity; i++) {
      addToCart(item, { spice: options.spice, instructions: options.instructions });
    }
    showToast({
      message: (
        <span>
          ✓ Added {options.quantity} × <b>{item.name}</b>
        </span>
      ),
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDietaryFilter('all');
  };

  const orderBarVisible = cartCount > 0 && !isCartOpen && !isCheckoutOpen;

  return (
    <>
      <div className="dk" ref={rootRef}>
        <div id="prog" ref={progRef} />

        <MenuHeader
          table={currentTable}
          tableCode={tableCode}
          onExploreClick={scrollToCatalogue}
          onFavoritesClick={scrollToFavourites}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onCartClick={() => setIsCartOpen(true)}
        />

        <main>
          <CategoryTabs
            categories={sections.map(s => s.cat)}
            activeCategoryId={currentActiveId}
            onSelectCategory={scrollToSection}
            isVegOnly={dietaryFilter === 'veg'}
            onToggleVeg={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
          />

          <div className="wrap" id="menu">
            <div className="legend">
              <span>
                <i className="dot v" />
                Veg
              </span>
              <span>
                <i className="dot n" />
                Non-veg
              </span>
              <span>
                Tap <b>+ Add</b> to start your order
              </span>
              <span>Prices in ₹</span>
            </div>

            <div className="wrap srch">
              <div className="sbox">
                <Search size={16} aria-hidden />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dosa, idli, biryani, filter coffee…"
                  aria-label="Search the menu"
                />
                {searchQuery && (
                  <button type="button" className="clr" onClick={() => setSearchQuery('')}>
                    Clear
                  </button>
                )}
              </div>
              <button
                type="button"
                className={`fchip${dietaryFilter === 'special' ? ' on' : ''}`}
                aria-pressed={dietaryFilter === 'special'}
                onClick={() => setDietaryFilter(dietaryFilter === 'special' ? 'all' : 'special')}
              >
                <Sparkles size={15} aria-hidden />
                Chef’s choice
              </button>
              <span className="cnt2" aria-live="polite">
                {visibleDishCount} {visibleDishCount === 1 ? 'dish' : 'dishes'}
              </span>
            </div>

            {sections.length === 0 ? (
              <div className="nores">
                <h3>No dishes found</h3>
                <p>Try a different search or clear the filters to see the whole menu.</p>
                <button type="button" className="btn" onClick={resetFilters}>
                  Reset filters
                </button>
              </div>
            ) : (
              sections.map((s, i) => (
                <MenuSection
                  key={s.cat.id}
                  category={s.cat}
                  index={i}
                  items={s.items}
                  allItems={s.all}
                  cartQtyById={cartQtyById}
                  onOpenDetails={setSelectedItemForModal}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={updateCartQuantity}
                />
              ))
            )}
          </div>

          <FeaturedCarousel
            featuredItems={featuredDishes}
            onAddToCart={handleAddToCart}
            onOpenDetails={setSelectedItemForModal}
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
          />

          <FilterCoffeeBanner
            onAddSpecialBeverage={() => showToast({ message: <span>✓ <b>Filter Coffee</b> added to your order</span> })}
          />

          <section ref={storyRef} className={`story${storySeen ? ' in' : ''}`}>
            <div className="wrap">
              <div className="orn">❖ ❖ ❖</div>
              <h2>A tawa, a notebook, a lot of ghee.</h2>
              <p>
                Our kitchen began with one cast-iron tawa and a family notebook of recipes. Today it is still that:
                stone-ground batters fermented overnight, chutneys made each morning, and a menu that honours the
                South while keeping it playful.
              </p>
            </div>
          </section>
        </main>

        <footer className="wrap">
          <div>
            <h4>Hours</h4>
            <p>
              {settings.openingTime} – {settings.closingTime} · daily
            </p>
            <p>Contactless QR table ordering</p>
          </div>
          <div>
            <h4>Find us</h4>
            <p>{settings.address}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>{settings.phone}</p>
            {settings.email && <p>{settings.email}</p>}
          </div>
          <div className="fine">
            {settings.name} · {settings.tagline} · FSSAI: {settings.fssaiNumber}
          </div>
        </footer>

        {/* Floating order bar (opens the existing cart drawer) */}
        <div className={`ob${orderBarVisible ? ' show' : ''}`} id="ob" aria-hidden={!orderBarVisible}>
          <span id="obt">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} · {formatINR(cartTotal)}
          </span>
          <button type="button" id="obb" tabIndex={orderBarVisible ? 0 : -1} onClick={() => setIsCartOpen(true)}>
            Review order
          </button>
        </div>

        <div id="toast" className={toastVisible ? 'show' : ''} role="status" aria-live="polite">
          {toast && (
            <>
              {toast.message}
              {toast.undoItemId && (
                <button
                  type="button"
                  id="undo"
                  onClick={() => {
                    updateCartQuantity(toast.undoItemId!, -1);
                    setToastVisible(false);
                  }}
                >
                  Undo
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Existing, unchanged-logic overlays (rendered outside .dk so the design's scoped CSS never touches them) */}
      <FoodDetailModal
        item={selectedItemForModal}
        isOpen={!!selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        onAdd={handleModalAdd}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} tableCode={tableCode} />
    </>
  );
};
