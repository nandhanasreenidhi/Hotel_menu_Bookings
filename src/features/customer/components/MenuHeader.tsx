import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { RestaurantTable } from '../../../types';
import { Clock, Wifi, MapPin, Sparkles, Phone, Info } from 'lucide-react';

interface MenuHeaderProps {
  table?: RestaurantTable;
  tableCode: string;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ table, tableCode }) => {
  const { settings } = useRestaurant();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="relative bg-gradient-to-b from-[#132E22] via-[#18392B] to-[#12281E] text-white pt-6 pb-8 px-4 sm:px-6 rounded-b-[2rem] shadow-xl border-b border-emerald-900/50">
      {/* Decorative ambient subtle background glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Table Badge & Service Hours */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase text-emerald-200">
              Table {table?.tableNumber || tableCode}
            </span>
            <span className="text-emerald-500 text-xs">•</span>
            <span className="text-xs text-stone-300">
              {table?.section || 'Dine-in'}
            </span>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-stone-200 backdrop-blur-xs transition-colors border border-white/10"
            aria-label="Restaurant information"
          >
            <Info className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Info & Wi-Fi</span>
          </button>
        </div>

        {/* Restaurant Name & Heritage Typography */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-amber-300/90 text-xs font-semibold tracking-widest uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Dining Menu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight text-[#FAF8F5]">
            {settings.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-300 font-light max-w-xl">
            {settings.tagline}
          </p>
        </div>

        {/* Info Card Drawer/Dropdown */}
        {showInfo && (
          <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-stone-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dining Hours: {settings.openingTime} – {settings.closingTime}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.address}</span>
            </div>
            {settings.wifiName && (
              <div className="flex items-center gap-2 text-stone-300">
                <Wifi className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Guest Wi-Fi: <strong className="text-white">{settings.wifiName}</strong> (Password: <code className="bg-white/10 px-1 py-0.5 rounded text-amber-200">{settings.wifiPassword}</code>)</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-stone-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Host Desk: {settings.phone}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
