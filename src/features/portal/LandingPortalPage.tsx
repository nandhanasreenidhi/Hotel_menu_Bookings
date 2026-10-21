import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  QrCode, 
  ConciergeBell, 
  ChefHat, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Smartphone,
  RotateCcw,
  Clock,
  UtensilsCrossed
} from 'lucide-react';

export const LandingPortalPage: React.FC = () => {
  const { settings, orders, tables, menuItems, activeTableCode, resetToDefaults } = useRestaurant();

  const newOrdersCount = orders.filter(o => o.status === 'placed').length;
  const kitchenCount = orders.filter(o => o.status === 'accepted' || o.status === 'preparing').length;

  const interfaces = [
    {
      title: 'Customer Ordering Experience',
      badge: 'Mobile-First QR Menu',
      desc: 'Warm ivory & cream aesthetics, realistic culinary photography, category filtering, instant cart, and live order tracking with status timeline.',
      route: `/menu/${activeTableCode || 'T-04'}`,
      icon: Smartphone,
      color: 'from-emerald-900 to-[#132E22]',
      accent: 'text-emerald-300',
      actionText: `Launch Menu (Table ${activeTableCode || '04'})`,
    },
    {
      title: 'Waiter / Staff Dispatch',
      badge: `${newOrdersCount > 0 ? `${newOrdersCount} New Orders` : 'Floor Operations'}`,
      desc: 'Accept or reject table orders with required rejection reasons, dispatch tickets directly to chefs, mark food served, and manage billing.',
      route: '/staff/orders',
      icon: ConciergeBell,
      color: 'from-indigo-950 to-slate-900',
      accent: 'text-indigo-300',
      actionText: 'Open Waiter Dashboard',
    },
    {
      title: 'Kitchen Display System (KDS)',
      badge: `${kitchenCount} Cooking Tickets`,
      desc: 'Optimized for high-heat kitchen tablets. Real-time ticket queue, overdue delay warnings, interactive portion checklists, and 1-tap ready pass.',
      route: '/kitchen',
      icon: ChefHat,
      color: 'from-amber-950 to-stone-900',
      accent: 'text-amber-300',
      actionText: 'Open Kitchen Station',
    },
    {
      title: 'Admin & Operations Suite',
      badge: 'Backoffice Management',
      desc: 'Full menu catalog with live Sold Out toggling, table QR code tent card generator with printable sheets, staff roles, ledger, and sales analytics.',
      route: '/admin',
      icon: ShieldCheck,
      color: 'from-stone-900 to-[#0F1626]',
      accent: 'text-teal-300',
      actionText: 'Open Admin Portal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#132E22] via-[#1A3D2E] to-[#0F241B] text-white pt-12 pb-20 px-4 sm:px-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-4 h-4" />
            <span>TABLEFLOW • Phase 1 Architecture Preview</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-[#FAF8F5] leading-tight">
            Next-Generation QR Restaurant Engine
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            A cohesive restaurant platform connecting diners, floor waitstaff, kitchen expeditors, and restaurant managers in real-time.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/menu/${activeTableCode || 'T-04'}`}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Simulate Customer Dining</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/staff/orders"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wide border border-white/20 flex items-center gap-2 transition-colors"
            >
              <ConciergeBell className="w-4 h-4 text-emerald-300" />
              <span>Open Staff Operations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Interfaces Showcase Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 mb-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interfaces.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl bg-white border border-stone-200/90 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
              >
                <div className={`p-6 bg-gradient-to-br ${card.color} text-white`}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/40 text-stone-200 border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>

                <div className="p-5 bg-white border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Route: <code className="text-emerald-900 font-mono font-bold">{card.route}</code>
                  </div>

                  <Link
                    to={card.route}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132E22] hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Synchronized Workflow Callout */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#132E22] text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-emerald-900">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Cross-Role Live Synchronization</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Try the End-to-End Restaurant Order Loop
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
              1. Add food as a customer at <strong>Table 04</strong> and checkout →<br />
              2. Open <strong>Waiter Dispatch</strong> to accept the new ticket →<br />
              3. View the ticket appear in the <strong>Kitchen Display</strong> and click "Plated & Ready" →<br />
              4. Watch the customer <strong>Order Tracker</strong> update automatically in real-time!
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to={`/menu/${activeTableCode || 'T-04'}`}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-colors"
            >
              Start Order Loop
            </Link>
            <button
              onClick={resetToDefaults}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 px-4 text-center text-xs border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              TF
            </span>
            <span className="font-bold text-white tracking-wider">TABLEFLOW</span>
            <span>• Phase 1 Frontend Foundation</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Dine-in QR Ordering • Waiter Dispatch • Kitchen Display System • Backoffice Suite
          </div>
        </div>
      </footer>
    </div>
  );
};
