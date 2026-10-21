import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useRestaurant } from '../../../context/RestaurantContext';
import { 
  LayoutDashboard, 
  Utensils, 
  Grid3X3, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { settings, activeTableCode } = useRestaurant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/menu', label: 'Menu Catalog', icon: Utensils },
    { to: '/admin/tables', label: 'Tables & QR Codes', icon: Grid3X3 },
    { to: '/admin/staff', label: 'Staff & Roles', icon: Users },
    { to: '/admin/payments', label: 'Orders & Payments', icon: CreditCard },
    { to: '/admin/reports', label: 'Sales & Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings & Branding', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-stone-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0F1626] border-b border-stone-800 p-4 flex items-center justify-between sticky top-[41px] z-30">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            TF
          </span>
          <span className="font-bold text-sm text-white tracking-wide">
            Admin Portal
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B101D] border-r border-stone-800/80 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 md:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Heading */}
          <div className="p-6 border-b border-stone-800/80">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Backoffice Suite</span>
            </div>
            <h2 className="text-base font-serif font-bold text-white truncate">
              {settings.name}
            </h2>
            <span className="text-[11px] text-stone-400">
              {settings.address.split(',')[1]?.trim() || 'Central Dining'}
            </span>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-800/90 text-white font-bold shadow-md shadow-emerald-950/40 border border-emerald-700/60'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Phase 1 Architecture</span>
            </div>
            <p className="text-[10px] leading-relaxed text-stone-400">
              Connected mock state layer. Ready for Supabase auth and realtime sync.
            </p>
          </div>

          <a
            href={`/menu/${activeTableCode || 'T-04'}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs transition-colors"
          >
            <span>Live Guest Menu</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
