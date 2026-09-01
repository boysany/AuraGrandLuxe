import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Utensils,
  Award,
  Sparkles,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

export const HotelDiningSection: React.FC = () => {
  const { menuItems, activeHotel, formatCurrency } = useHotel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tableReserveSuccess, setTableReserveSuccess] = useState(false);

  // Reservation form
  const [date, setDate] = useState('2026-09-02');
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('Lord Charles Sterling');
  const [seatingPref, setSeatingPref] = useState('Terrace View');

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'Starters', label: 'Starters & Caviar' },
    { id: 'Main Course', label: 'Signature Mains' },
    { id: 'Desserts', label: 'Haute Desserts' },
    { id: 'Beverages', label: 'Grand Cru Cellar' }
  ];

  const filteredMenu = menuItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleReserveTable = (e: React.FormEvent) => {
    e.preventDefault();
    setTableReserveSuccess(true);
    setTimeout(() => setTableReserveSuccess(false), 5000);
  };

  return (
    <div id="dining-section" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Three Michelin Stars</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-slate-100 font-normal">
            L'Étoile Gastronomie
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            Helmed by Master Chef Jean-Luc Fontaine, experience a gastronomic voyage that celebrates seasonal French terroir, rare vintage crus, and immaculate table art.
          </p>
        </div>

        {/* Chef Highlights Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-16 border border-slate-800 bg-slate-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto h-full">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
              alt="Executive Chef"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
            <div className="flex items-center gap-2 text-amber-400">
              <ChefHat className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Meet The Master</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-slate-100 font-normal leading-snug">
              "Cooking is not merely a craft—it is an emotional memory woven through aroma, harmony, and fire."
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Chef Fontaine has preserved three Michelin stars for nine consecutive years, elevating palace dining into an unforgettable sensory performance.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-center">
              <div>
                <p className="font-serif text-xl font-bold text-amber-400">3 ★</p>
                <p className="text-[10px] text-slate-400 uppercase">Michelin Guide</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-amber-400">1,800+</p>
                <p className="text-[10px] text-slate-400 uppercase">Grand Cru Cellar</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-amber-400">100%</p>
                <p className="text-[10px] text-slate-400 uppercase">Organic Sourcing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-8 mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h3 className="font-serif text-2xl text-slate-100">Degustation & A La Carte</h3>
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                    selectedCategory === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between p-5 space-y-4 group"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
                    {formatCurrency(item.price)}
                  </div>
                  {item.preparationTime && (
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.preparationTime}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                {item.dietary && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                    {item.dietary.map((d, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reserve a Table Form Widget */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-500/30 max-w-4xl mx-auto shadow-2xl">
          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-slate-100">Reserve Your Table</h3>
            <p className="text-xs text-slate-400">
              Advance booking strongly recommended. Formal evening attire requested for dining salon.
            </p>
          </div>

          {tableReserveSuccess ? (
            <div className="text-center py-8 space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-xl text-slate-100">Table Reservation Confirmed!</h4>
              <p className="text-xs text-slate-300">
                A confirmation SMS & email have been issued for {name} on {date} at {time} ({guests} Guests, {seatingPref}).
              </p>
            </div>
          ) : (
            <form onSubmit={handleReserveTable} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-amber-400 font-semibold">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-amber-400 font-semibold">Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option>18:30 (Sunset Early Seating)</option>
                    <option>19:30 (Prime Evening)</option>
                    <option>20:30 (Gastronomic Salon)</option>
                    <option>21:30 (Late Night Tasting)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-amber-400 font-semibold">Party Size</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    {[1, 2, 3, 4, 6, 8, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Guest Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Seating Location</label>
                  <select
                    value={seatingPref}
                    onChange={(e) => setSeatingPref(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option>Terrace View</option>
                    <option>Chef's Counter</option>
                    <option>Private Wine Salon</option>
                    <option>Main Dining Room</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Confirm Table Reservation
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
