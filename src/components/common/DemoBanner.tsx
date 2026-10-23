import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  QrCode,
  ConciergeBell,
  ChefHat,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { orders, resetToDefaults, activeTableCode, setActiveTableCode, tables } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Counts for operations badges
  const newOrdersCount = orders.filter(o => o.status === 'placed').length;
  const kitchenOrdersCount = orders.filter(o => o.status === 'accepted' || o.status === 'preparing').length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready').length;

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setActiveTableCode(newCode);
    if (location.pathname.startsWith('/menu/')) {
      navigate(`/menu/${newCode}`);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
  };
  // Customers should never see staff or admin controls.
  const isCustomerRoute =
    location.pathname === '/menu' ||
    location.pathname.startsWith('/menu/') ||
    location.pathname.startsWith('/track');

  if (isCustomerRoute) {
    return null;
  }

  return (
    <>
      {/* Sticky top control dock */}
      <header className="sticky top-0 z-50 w-full bg-[#0B1411] text-stone-200 border-b border-emerald-950/60 shadow-md text-xs select-none no-print">
        <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between gap-3">
          {/* Logo & Phase Label */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-700/80 text-white font-bold tracking-wider text-[11px] shadow-xs">
              TF
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-white text-[12px] font-sans">
                TABLEFLOW
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                PHASE 1 PREVIEW
              </span>
            </div>
          </div>

          {/* Quick Role Switcher */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to={`/menu/${activeTableCode || 'T-04'}`}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${isActive || location.pathname.startsWith('/track')
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`
              }
              title="Customer Mobile QR Menu"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Customer Menu</span>
              <span className="md:hidden">Menu</span>
            </NavLink>

            <NavLink
              to="/staff/orders"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`
              }
              title="Waiter Staff Dashboard"
            >
              <ConciergeBell className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Waiter Dispatch</span>
              <span className="md:hidden">Staff</span>
              {newOrdersCount > 0 && (
                <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 animate-bounce">
                  {newOrdersCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/kitchen"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`
              }
              title="Kitchen Display System (KDS)"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kitchen Display</span>
              <span className="md:hidden">Kitchen</span>
              {kitchenOrdersCount > 0 && (
                <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-bold bg-emerald-500 text-stone-950">
                  {kitchenOrdersCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${isActive
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`
              }
              title="Admin Backoffice"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
              <span className="md:hidden">Admin</span>
            </NavLink>
          </nav>

          {/* Right Tools: Table Selector & Reset */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 bg-stone-900 border border-stone-800 rounded px-2 py-0.5">
              <span className="text-[10px] text-stone-400">QR Table:</span>
              <select
                value={activeTableCode}
                onChange={handleTableChange}
                className="bg-transparent text-emerald-400 font-bold text-xs focus:outline-hidden cursor-pointer"
              >
                {tables.map(t => (
                  <option key={t.id} value={t.code} className="bg-stone-900 text-white">
                    {t.code} ({t.section})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white text-[11px] transition-colors"
              title="Reset mock orders, cart and menu state"
            >
              <RotateCcw className="w-3 h-3 text-stone-400" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl text-stone-900 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Reset Demo Data?
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              This will restore all default mock orders, menu items, table statuses, and empty the customer cart.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
