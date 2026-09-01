import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  UtensilsCrossed,
  Truck,
  ArrowRight
} from 'lucide-react';
import { RestaurantOrder } from '../../types';

export const KitchenDisplay: React.FC = () => {
  const { restaurantOrders, updateOrderStatus, formatCurrency } = useHotel();

  const pendingOrders = restaurantOrders.filter((o) => o.status === 'pending');
  const preparingOrders = restaurantOrders.filter((o) => o.status === 'preparing');
  const readyOrders = restaurantOrders.filter((o) => o.status === 'ready');
  const deliveredOrders = restaurantOrders.filter((o) => o.status === 'delivered');

  return (
    <div id="kitchen-display-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-slate-100 font-normal">
              Kitchen Display System (KDS Live)
            </h1>
            <p className="text-xs text-slate-400">
              Real-time ticket dispatch for Executive Chef & Kitchen Brigade
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400">
            🔥 {pendingOrders.length + preparingOrders.length} Active Tickets in Kitchen
          </span>
        </div>
      </div>

      {/* 4-Column KDS Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {/* Column 1: New / Pending Tickets */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>1. New Incoming ({pendingOrders.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-600">No pending orders</p>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400 text-xs">{order.id}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {order.roomNumber ? `Room #${order.roomNumber}` : order.tableNumber}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs border-y border-slate-800/80 py-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-slate-200">
                        <span><strong className="text-amber-400">{it.quantity}x</strong> {it.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Est: {order.estimatedTime}</span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg flex items-center gap-1 shadow"
                    >
                      <Flame className="w-3 h-3" />
                      <span>Start Fire</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation (Fire) */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>2. Cooking & Fired ({preparingOrders.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-600">No tickets in flame</p>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-blue-500/40 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-400 text-xs">{order.id}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {order.roomNumber ? `Room #${order.roomNumber}` : order.tableNumber}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs border-y border-slate-800/80 py-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-slate-200">
                        <span><strong className="text-blue-400">{it.quantity}x</strong> {it.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="text-blue-300 font-semibold">In Cooking Station</span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1 shadow"
                    >
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>Ready Plated</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Ready for Butler Delivery */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>3. Ready for Butler ({readyOrders.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-600">No plated dishes waiting</p>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-purple-500/40 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-purple-400 text-xs">{order.id}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {order.roomNumber ? `Room #${order.roomNumber}` : order.tableNumber}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs border-y border-slate-800/80 py-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-slate-200">
                        <span>{it.quantity}x {it.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="text-purple-300">Butler Cloche Hot</span>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center gap-1 shadow"
                    >
                      <Truck className="w-3 h-3" />
                      <span>Dispatch/Delivered</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Delivered / Fulfilled */}
        <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4. Delivered ({deliveredOrders.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {deliveredOrders.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-600">No fulfilled orders yet</p>
            ) : (
              deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-400 text-xs">{order.id}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">✓ Delivered</span>
                  </div>

                  <div className="text-xs text-slate-400">
                    <p>{order.roomNumber ? `Suite ${order.roomNumber}` : order.tableNumber} • {formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
