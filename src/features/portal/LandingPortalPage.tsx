
import React from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext';
import {
  ConciergeBell,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  RotateCcw,
  LogIn,
} from 'lucide-react';

export const LandingPortalPage: React.FC = () => {
  const { orders, resetToDefaults } = useRestaurant();

  const newOrdersCount = orders.filter(
    order => order.status === 'placed'
  ).length;

  const kitchenCount = orders.filter(
    order => order.status === 'accepted' || order.status === 'preparing'
  ).length;

  const interfaces = [
    {
      title: 'Waiter / Staff Dispatch',
      badge: newOrdersCount > 0
        ? `${newOrdersCount} New Orders`
        : 'Floor Operations',
      desc: 'Accept or reject table orders, send tickets to the kitchen, track preparation, mark food served, and manage table billing.',
      route: '/staff/orders',
      icon: ConciergeBell,
      color: 'from-indigo-950 to-slate-900',
      actionText: 'Open Waiter Dashboard',
    },
    {
      title: 'Kitchen Display System (KDS)',
      badge: `${kitchenCount} Active Tickets`,
      desc: 'Manage incoming kitchen tickets, track cooking progress, identify delayed orders, and mark dishes ready for serving.',
      route: '/kitchen',
      icon: ChefHat,
      color: 'from-amber-950 to-stone-900',
      actionText: 'Open Kitchen Station',
    },
    {
      title: 'Admin & Operations Suite',
      badge: 'Backoffice Management',
      desc: 'Manage menu items, prices, table QR codes, staff, payments, restaurant settings, and sales reports.',
      route: '/admin',
      icon: ShieldCheck,
      color: 'from-stone-900 to-[#0F1626]',
      actionText: 'Open Admin Portal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col">

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#132E22] via-[#1A3D2E] to-[#0F241B] text-white pt-12 pb-20 px-4 sm:px-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-5">
          <div className="mb-2 text-emerald-100/80 text-xs sm:text-sm font-semibold uppercase tracking-[0.28em]">
            Welcome to
          </div>
          <p className="text-amber-300 text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight">
            Dakshin Kitchen
          </p>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-semibold tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>TABLEFLOW • Restaurant Operations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#FAF8F5] leading-[1.12] max-w-4xl mx-auto">
            One Platform. Three Powerful Workspaces.
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Manage restaurant operations from one place.
            Coordinate floor service, kitchen preparation, and
            restaurant management through TABLEFLOW.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#staff-portals"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wide border border-white/20 flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>Explore Dashboards</span>
            </a>
          </div>
        </div>
      </header>

      {/* Three Staff Portals */}
      <main
        id="staff-portals"
        className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-12 mb-0 w-full"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Staff Workspace
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Choose Your Dashboard
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Select a workspace to explore its restaurant operations tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {interfaces.map(card => {
            const Icon = card.icon;

            return (
              <section
                key={card.title}
                className="rounded-2xl bg-white border border-stone-200/90 shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-5 sm:p-6 bg-gradient-to-br ${card.color} text-white flex-1`}>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase bg-black/40 text-stone-200 border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight mb-2.5">
                    {card.title}
                  </h3>

                  <p className="text-[13px] sm:text-sm text-stone-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="p-4 bg-white border-t border-stone-100">
                  <Link
                    to={card.route}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#132E22] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors active:scale-[0.98]"
                  >
                    <span>{card.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>

        {/* Demo Controls */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#132E22] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-emerald-900">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Development Preview</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Explore the TABLEFLOW Demo
            </h3>

            <p className="text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              Try the staff workspaces and reset the local demo data
              whenever you need a fresh starting point.
            </p>
          </div>

          <button
            type="button"
            onClick={resetToDefaults}
            className="shrink-0 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center justify-center gap-2 border border-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-6 px-4 text-center text-xs border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              TF
            </span>

            <span className="font-bold text-white tracking-wider">
              Dakshin Kitchen · TABLEFLOW
            </span>

            <span>• Phase 1 Frontend Preview</span>
          </div>

          <div className="text-[11px] text-stone-400">
            Waiter Dispatch • Kitchen Display System • Admin Operations
          </div>
        </div>
      </footer>
    </div>
  );
};
