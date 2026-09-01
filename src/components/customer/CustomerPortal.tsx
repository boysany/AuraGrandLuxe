import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Crown,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  MapPin,
  BedDouble,
  ChevronRight,
  ShieldCheck,
  User,
  Heart,
  CreditCard,
  Phone,
  Mail,
  Utensils
} from 'lucide-react';
import { Booking } from '../../types';

export const CustomerPortal: React.FC = () => {
  const {
    bookings,
    activeHotel,
    viewInvoice,
    openBookingWizard,
    formatCurrency,
    createRestaurantOrder
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'stays' | 'loyalty' | 'profile' | 'room_service'>('stays');
  const [orderPlacedMsg, setOrderPlacedMsg] = useState('');

  // Example guest profile
  const guestStays = bookings;

  const handleQuickRoomService = (dishName: string, price: number) => {
    createRestaurantOrder({
      hotelId: activeHotel.id,
      guestName: 'Lord Charles Sterling',
      roomOrTableNumber: 'Suite 601',
      orderType: 'Room Service',
      items: [{ menuItemId: 'm1', name: dishName, quantity: 1, price }],
      totalAmount: price,
      status: 'pending',
      paymentStatus: 'charged_to_room',
      estimatedMinutes: 25,
      specialInstructions: 'Deliver to Suite 601 living room with two champagne glasses.'
    });
    setOrderPlacedMsg(`Room service order placed for ${dishName}! Kitchen notified.`);
    setTimeout(() => setOrderPlacedMsg(''), 4000);
  };

  return (
    <div id="customer-portal-view" className="min-h-[85vh] bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top VIP Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Guest Avatar"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                <Crown className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-slate-100 font-medium">
                  Lord Charles Sterling
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Diamond VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-4">
                <span>charles.sterling@mayfair.co.uk</span>
                <span>•</span>
                <span>Member since 2021</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Loyalty Balance</p>
              <p className="text-sm font-bold text-amber-400 font-mono">18,450 Points</p>
            </div>

            <button
              onClick={() => openBookingWizard()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              + Book New Stay
            </button>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 pb-3 overflow-x-auto text-xs">
          {[
            { id: 'stays', label: 'My Reservations & Invoices', icon: Calendar },
            { id: 'room_service', label: 'Instant In-Suite Dining', icon: Utensils },
            { id: 'loyalty', label: 'Diamond VIP Privileges', icon: Crown },
            { id: 'profile', label: 'Personal Preferences & Profile', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Stays & Reservations */}
        {activeTab === 'stays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-slate-100">All Reservations ({guestStays.length})</h2>
              <span className="text-xs text-slate-400">Manage dates, special requests, and tax invoices</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {guestStays.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 text-center shrink-0">
                      <span className="text-[10px] text-amber-400 font-bold uppercase">Room</span>
                      <span className="font-serif font-bold text-sm text-slate-100">{booking.roomNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-100">{booking.roomName}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            booking.bookingStatus === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : booking.bookingStatus === 'checked_in'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {booking.bookingStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {booking.checkInDate} → {booking.checkOutDate} ({booking.nights} nights)
                      </p>
                      <p className="text-xs text-slate-400">
                        {booking.adults} Adults, {booking.children} Children • Ref: <span className="font-mono text-amber-300">{booking.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Stay Cost</p>
                      <p className="font-serif text-lg font-bold text-amber-400">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>

                    <button
                      onClick={() => viewInvoice(booking)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>View & Print Tax Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Room Service / In-Suite Dining Quick Order */}
        {activeTab === 'room_service' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-slate-100">Bespoke In-Suite Dining Menu</h2>
                <p className="text-xs text-slate-400">24/7 palace kitchen delivery straight to Suite 601</p>
              </div>
              {orderPlacedMsg && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold animate-pulse">
                  {orderPlacedMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Beluga Imperial Caviar Service (50g)', price: 290, desc: 'Warm blinis, crème fraîche, quail eggs, and chilled vintage Dom Pérignon.', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80' },
                { name: 'Kobe A5 Wagyu Tenderloin', price: 185, desc: 'Black truffle butter, roasted baby heirloom carrots, and grand cru reduction.', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
                { name: 'Royal Brittany Lobster Thermidor', price: 145, desc: 'Gruyère crust, Dijon tarragon reduction, and fragrant saffron pilaf.', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=500&q=80' },
                { name: 'Château Margaux Grand Cru 2015', price: 420, desc: 'Cellar temperature, decanted in-suite with sommelier notes.', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80' }
              ].map((dish, i) => (
                <div key={i} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-5 space-y-4">
                  <img src={dish.img} alt={dish.name} className="w-full h-36 rounded-xl object-cover" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{dish.name}</h4>
                      <span className="font-serif font-bold text-amber-400 text-sm">{formatCurrency(dish.price)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{dish.desc}</p>
                  </div>
                  <button
                    onClick={() => handleQuickRoomService(dish.name, dish.price)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors"
                  >
                    Order to Room (Suite 601)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Diamond Loyalty Tier */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="font-serif text-xl text-slate-100">Diamond VIP Tier Benefits</h3>
                  <p className="text-xs text-amber-400 font-medium">Top 1% Global Guest Status</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Guaranteed Suite Upgrade upon arrival (subject to availability)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary Private Rolls-Royce Airport Chauffeur transfer</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Imperial Spa thermal bath & hydrotherapy access</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Late 16:00 Check-out and Early 10:00 Check-in guaranteed</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="font-serif text-xl text-slate-100">Points Redemption</h3>
              <p className="text-xs text-slate-400">
                Redeem your 18,450 points for complimentary room nights, dining vouchers, and private jet charter credits.
              </p>
              <div className="space-y-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span>1 Complimentary Night (Deluxe Suite)</span>
                  <button className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg">15,000 Pts</button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span>Michelin Tasting Menu for Two</span>
                  <button className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg">6,000 Pts</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 max-w-2xl mx-auto space-y-6">
            <h3 className="font-serif text-xl text-slate-100">Personalized Stay Preferences</h3>
            <p className="text-xs text-slate-400">
              Our butler and housekeeping team automatically tailor your room settings based on your recorded preferences.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Pillow Selection</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100">
                  <option>Hungarian Goose Down (Extra Firm)</option>
                  <option>Organic Silk Memory Foam</option>
                  <option>Hypoallergenic Buckwheat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Room Temperature on Arrival</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100">
                  <option>20°C / 68°F (Crisp & Fresh)</option>
                  <option>22°C / 72°F (Warm & Cozy)</option>
                  <option>19°C / 66°F (Cool Sleeping)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Preferred Welcome Amenity</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100">
                  <option>Vintage Champagne & Handcrafted Macarons</option>
                  <option>Single Malt Whisky & Dark Cocoa Truffles</option>
                  <option>Fresh Exotic Fruit Basket & Sparkling Water</option>
                </select>
              </div>

              <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors">
                Save Guest Profile Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
