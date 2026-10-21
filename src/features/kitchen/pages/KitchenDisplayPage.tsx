import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { KitchenTicket } from '../components/KitchenTicket';
import { 
  ChefHat, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  LayoutGrid
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const KitchenDisplayPage: React.FC = () => {
  const { orders, startPreparingOrder, markOrderReady } = useRestaurant();
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter only orders relevant to the kitchen (accepted, preparing, ready)
  const kitchenOrders = useMemo(() => {
    return orders.filter(
      o => o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready'
    );
  }, [orders]);

  const queuedOrders = kitchenOrders.filter(o => o.status === 'accepted');
  const preparingOrders = kitchenOrders.filter(o => o.status === 'preparing');
  const readyOrders = kitchenOrders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#090D14] text-stone-100 pb-20">
      {/* Kitchen Expediter Header */}
      <header className="bg-[#0E1522] border-b border-stone-800 px-4 sm:px-6 py-3.5 sticky top-[41px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide font-sans">
                  KITCHEN DISPLAY SYSTEM (KDS)
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
                  EXPEDITE STATION #1
                </span>
              </div>
              <span className="text-xs text-stone-400">
                {kitchenOrders.length} Active Tickets • Live Kitchen Queue
              </span>
            </div>
          </div>

          {/* Clock & Beeper Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 font-mono text-xs text-stone-300">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                audioEnabled
                  ? 'bg-stone-800 text-stone-200 border-stone-700'
                  : 'bg-stone-900 text-stone-500 border-stone-800'
              }`}
              title="Kitchen chime sound toggle"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-500" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main KDS Columns Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {kitchenOrders.length === 0 ? (
          <div className="py-28 text-center bg-stone-900/40 rounded-3xl border border-stone-800/80 p-8 max-w-lg mx-auto">
            <ChefHat className="w-16 h-16 text-stone-700 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">All Kitchen Tickets Cleared!</h2>
            <p className="text-xs text-stone-400 mt-1">
              There are no active orders waiting in the kitchen. New orders accepted by the waitstaff will instantly appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Column 1: Queued / Ready to Cook */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <h3 className="text-sm font-bold tracking-wide uppercase text-stone-300">
                    Queued / Accepted
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-stone-800 text-stone-300">
                  {queuedOrders.length}
                </span>
              </div>

              {queuedOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/40 text-center text-xs text-stone-500">
                  No queued orders waiting
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {queuedOrders.map(order => (
                      <KitchenTicket
                        key={order.id}
                        order={order}
                        onStartPreparing={startPreparingOrder}
                        onMarkReady={markOrderReady}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Column 2: In Cooking (Fire) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
                  <h3 className="text-sm font-bold tracking-wide uppercase text-amber-400">
                    Active on Wok & Tandoor
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  {preparingOrders.length}
                </span>
              </div>

              {preparingOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/40 text-center text-xs text-stone-500">
                  No dishes currently cooking
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {preparingOrders.map(order => (
                      <KitchenTicket
                        key={order.id}
                        order={order}
                        onStartPreparing={startPreparingOrder}
                        onMarkReady={markOrderReady}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Column 3: Plated & Ready to Pick Up */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-400">
                    Plated & Hot (Pass)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {readyOrders.length}
                </span>
              </div>

              {readyOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-900/30 border border-stone-800/40 text-center text-xs text-stone-500">
                  Pass is clear
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {readyOrders.map(order => (
                      <KitchenTicket
                        key={order.id}
                        order={order}
                        onStartPreparing={startPreparingOrder}
                        onMarkReady={markOrderReady}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
