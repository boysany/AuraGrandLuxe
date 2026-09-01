import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Calendar,
  Users,
  BedDouble,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Star,
  Award
} from 'lucide-react';
import { RoomCategory } from '../../types';

export const HeroSection: React.FC = () => {
  const {
    activeHotel,
    searchParams,
    setSearchParams,
    openBookingWizard,
    setCustomerActiveTab,
    formatCurrency
  } = useHotel();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingWizard();
  };

  const roomCategories: (RoomCategory | 'All Categories')[] = [
    'All Categories',
    'Standard Room',
    'Deluxe Room',
    'Executive Room',
    'Family Room',
    'Premium Suite',
    'Presidential Suite'
  ];

  return (
    <section id="hero-section" className="relative overflow-hidden bg-[#fff4dc] px-4 pb-10 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fffaf0] via-[#fff0df] to-[#f58a46] shadow-[0_24px_70px_rgba(91,58,43,0.16)]">
        <div className="grid items-center gap-8 px-6 pb-8 pt-10 sm:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-16 lg:pb-14 lg:pt-16">
          <div className="relative z-10 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c97948]/30 bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#a65428] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#c97948]" />
              <span>{activeHotel.tagline}</span>
            </div>
            <h1 className="max-w-lg font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#542d1c] sm:text-6xl lg:text-7xl">
              Luxury and Tranquility
              <span className="mt-2 block text-[#c95d25]">Meet {activeHotel.name}</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-[#654638] sm:text-base">
              Experience Michelin-starred dining, bespoke concierge services, and curated sanctuary suites in the heart of {activeHotel.city}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={openBookingWizard} className="rounded-full bg-[#e9671d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#c95717]">Book your stay</button>
              <button onClick={() => setCustomerActiveTab('rooms')} className="flex items-center gap-2 rounded-full border border-[#6b3d28]/25 bg-white/55 px-5 py-3 text-sm font-semibold text-[#542d1c] backdrop-blur-sm transition hover:bg-white/80">
                Explore suites <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative min-h-[18rem] overflow-hidden rounded-[1.75rem] bg-[#d8e6e7] sm:min-h-[25rem] lg:min-h-[31rem]">
            <img src={activeHotel.heroImage} alt={activeHotel.name} className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#542d1c]/25 via-transparent to-white/10" />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/60 bg-white/75 px-4 py-3 text-sm text-[#542d1c] shadow-lg backdrop-blur-md">
              <span className="block text-lg font-bold text-[#c95d25]">25+</span>
              <span>Years of hospitality</span>
            </div>
          </div>
        </div>
        <div className="mx-6 mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#c97948]/15 bg-[#c97948]/15 sm:grid-cols-4 lg:mx-16">
          {[['25+', 'Years Experience'], ['5k+', 'Guests Hosted'], ['98%', 'Guest Satisfaction'], ['24/7', 'Concierge Care']].map(([value, label]) => (
            <div key={label} className="bg-white/75 px-4 py-4 text-center backdrop-blur-sm sm:px-6">
              <div className="text-2xl font-bold text-[#d65f22]">{value}</div>
              <div className="mt-1 text-xs font-medium text-[#6f5347]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Booking Search Widget */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <form
          id="hero-booking-search-form"
          onSubmit={handleSearchSubmit}
          className="bg-white/90 backdrop-blur-md border border-[#ead7b8] rounded-2xl p-4 sm:p-5 shadow-xl text-[#563a2d]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Check-In Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Check-In Date</span>
              </label>
              <input
                id="search-checkin-date"
                type="date"
                value={searchParams.checkInDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, checkInDate: e.target.value }))}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#C5A880] transition-colors"
                required
              />
            </div>

            {/* Check-Out Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Check-Out Date</span>
              </label>
              <input
                id="search-checkout-date"
                type="date"
                value={searchParams.checkOutDate}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, checkOutDate: e.target.value }))}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#C5A880] transition-colors"
                required
              />
            </div>

            {/* Number of Guests */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Guests</span>
              </label>
              <select
                id="search-guests-select"
                value={`${searchParams.adults}-${searchParams.children}`}
                onChange={(e) => {
                  const [a, c] = e.target.value.split('-').map(Number);
                  setSearchParams((prev) => ({ ...prev, adults: a, children: c }));
                }}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#C5A880] transition-colors"
              >
                <option value="1-0">1 Adult (Solo Stay)</option>
                <option value="2-0">2 Adults (Couple)</option>
                <option value="2-1">2 Adults, 1 Child</option>
                <option value="2-2">2 Adults, 2 Children</option>
                <option value="3-0">3 Adults</option>
                <option value="4-2">4 Adults, 2 Children (Family)</option>
                <option value="6-2">6+ Guests (Penthouse)</option>
              </select>
            </div>

            {/* Room Type */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Suite Category</span>
              </label>
              <select
                id="search-room-category-select"
                value={searchParams.roomCategory}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, roomCategory: e.target.value }))}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#C5A880] transition-colors"
              >
                {roomCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Availability Button */}
            <div className="flex items-end">
              <button
                id="hero-search-availability-btn"
                type="submit"
                className="w-full bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] font-semibold px-4 py-2.5 rounded shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Check Availability</span>
              </button>
            </div>
          </div>

          {/* Quick Perks Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Complimentary Champagne upon check-in</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#D4B996]" />
              <span>Guaranteed Direct Best Rate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#D4B996]" />
              <span>Flexible Free Cancellation up to 48 Hours</span>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};
