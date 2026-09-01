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
    <section id="hero-section" className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-[#080C14]">
      {/* High-Resolution Luxury Background with Warm Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeHotel.heroImage}
          alt={activeHotel.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#080C14]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-transparent to-[#080C14]/60" />
      </div>

      {/* Main Hero Header & Typography */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 flex-1 flex flex-col justify-center items-center text-center">
        {/* Palace Heritage Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#111827]/90 border border-slate-700/80 text-[#D4B996] text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>{activeHotel.tagline}</span>
        </div>

        {/* Hero Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-normal tracking-tight max-w-4xl leading-[1.1] mb-6">
          Architectural Grandeur & <br />
          <span className="italic font-serif font-light text-[#D4B996]">
            Uncompromising Hospitality
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed mb-8">
          Experience Michelin-starred dining, bespoke concierge services, and curated sanctuary suites in the heart of {activeHotel.city}.
        </p>

        {/* Quick Discovery CTA Chips */}
        <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-slate-300 mb-8">
          <button
            onClick={() => setCustomerActiveTab('rooms')}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] hover:bg-[#161F30] border border-slate-700/80 transition-colors text-slate-200 hover:text-white"
          >
            <span>Explore Rooms & Suites</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4B996]" />
          </button>
          <button
            onClick={() => setCustomerActiveTab('dining')}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] hover:bg-[#161F30] border border-slate-700/80 transition-colors text-slate-200 hover:text-white"
          >
            <span>Michelin-Starred Dining</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4B996]" />
          </button>
          <button
            onClick={() => setCustomerActiveTab('services')}
            className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#111827] hover:bg-[#161F30] border border-slate-700/80 transition-colors text-slate-200 hover:text-white"
          >
            <span>Spa & Chauffeur Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4B996]" />
          </button>
        </div>
      </div>

      {/* Advanced Booking Search Widget */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <form
          id="hero-booking-search-form"
          onSubmit={handleSearchSubmit}
          className="bg-[#111827] border border-slate-800 rounded p-4 sm:p-5 shadow-xl text-white"
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
