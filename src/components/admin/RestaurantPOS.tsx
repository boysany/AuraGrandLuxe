import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Utensils,
  Plus,
  Minus,
  Trash2,
  Send,
  CheckCircle2,
  Clock,
  BedDouble,
  Search
} from 'lucide-react';
import { MenuItem, RestaurantOrder } from '../../types';

export const RestaurantPOS: React.FC = () => {
  const {
    menuItems,
    createRestaurantOrder,
    rooms,
    activeHotel,
    setAdminActiveTab,
    formatCurrency
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number; notes?: string }[]>([]);
  const [orderType, setOrderType] = useState<'room_service' | 'dine_in'>('room_service');
  const [targetRoom, setTargetRoom] = useState('101');
  const [targetTable, setTargetTable] = useState('Table 4 (Terrace)');
  const [guestName, setGuestName] = useState('Lord Charles Sterling');
  const [specialInstructions, setSpecialInstructions] = useState('Please serve in courses with heated cloche.');
  const [paymentStatus, setPaymentStatus] = useState<'charged_to_room' | 'paid' | 'pending'>('charged_to_room');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const categories = ['all', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

  const filteredMenu = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQ = c.quantity + delta;
            return newQ > 0 ? { ...c, quantity: newQ } : null;
          }
          return c;
        })
        .filter(Boolean) as { item: MenuItem; quantity: number; notes?: string }[]
    );
  };

  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const tax = subtotal * 0.1;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + tax + serviceCharge;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    createRestaurantOrder({
      hotelId: activeHotel.id,
      orderType: orderType === 'room_service' ? 'Room Service' : 'Dine-In Table',
      roomOrTableNumber: orderType === 'room_service' ? `Room ${targetRoom}` : `Table ${targetTable}`,
      roomNumber: orderType === 'room_service' ? targetRoom : undefined,
      tableNumber: orderType === 'dine_in' ? targetTable : undefined,
      guestName,
      items: cart.map((c) => ({
        menuItemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        notes: c.notes
      })),
      totalAmount: total,
      status: 'pending',
      paymentStatus: paymentStatus as any,
      estimatedMinutes: 25
    });

    setOrderSuccess(true);
    setCart([]);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  return (
    <div id="restaurant-pos-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            L'Étoile F&B & Room Service POS
          </h1>
          <p className="text-xs text-slate-400">
            Real-time ordering terminal for in-room gourmet dining, lounge, and terrace tables.
          </p>
        </div>

        <button
          onClick={() => setAdminActiveTab('kds')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <Utensils className="w-4 h-4" />
          <span>Switch to Kitchen Display (KDS) →</span>
        </button>
      </div>

      {/* POS Two Column: Menu on Left (7 cols), Order Ticket on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Menu Items */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search culinary items..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-colors ${
                    selectedCategory === c
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer flex gap-3 group shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-800 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 font-light">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80">
                    <span className="font-serif font-bold text-amber-400 text-xs">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.preparationTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Order Ticket Cart */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-serif text-lg text-slate-100">Live Order Ticket</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
              {cart.reduce((a, b) => a + b.quantity, 0)} Items
            </span>
          </div>

          {orderSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-serif text-sm font-medium text-slate-100">Ticket Dispatched to Kitchen</p>
              <p className="text-[10px] text-slate-300">Ticket created in KDS with 25-minute delivery timer.</p>
            </div>
          )}

          {/* Delivery Configuration */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Delivery Destination</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
              >
                <option value="room_service">In-Suite Room Service</option>
                <option value="dine_in">Restaurant Salon Table</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">
                {orderType === 'room_service' ? 'Suite Number' : 'Table Number'}
              </label>
              {orderType === 'room_service' ? (
                <select
                  value={targetRoom}
                  onChange={(e) => setTargetRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} ({r.name})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={targetTable}
                  onChange={(e) => setTargetTable(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-100"
                />
              )}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-400 font-medium">Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-100"
            />
          </div>

          {/* Cart Item Rows */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">
                Tap items on the left to build the guest's culinary ticket.
              </p>
            ) : (
              cart.map((c) => (
                <div
                  key={c.item.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-slate-200 truncate">{c.item.name}</p>
                    <p className="text-[10px] text-amber-400 font-serif font-bold">
                      {formatCurrency(c.item.price * c.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(c.item.id, -1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-slate-100">{c.quantity}</span>
                    <button
                      onClick={() => updateQuantity(c.item.id, 1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Calculation */}
          {cart.length > 0 && (
            <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Luxury Dining Tax (10%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Butler Service (5%)</span>
                <span>{formatCurrency(serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-slate-100 font-bold pt-1.5 border-t border-slate-800 text-sm font-serif">
                <span>Grand Total</span>
                <span className="text-amber-400">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Settlement Selection */}
          <div className="space-y-1 text-xs">
            <label className="text-slate-400 font-medium">Payment Settlement</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-medium"
            >
              <option value="charged_to_room">Charge Directly to Room Folio</option>
              <option value="paid">Direct POS Card / Terminal Paid</option>
              <option value="pending">Cash on Butler Delivery</option>
            </select>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Ticket to Kitchen ({formatCurrency(total)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
