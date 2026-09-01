import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BedDouble,
  Users,
  Maximize2,
  Star,
  Eye,
  CalendarCheck,
  Check,
  Filter,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { Room, RoomCategory } from '../../types';

export const RoomsSection: React.FC = () => {
  const {
    rooms,
    activeHotel,
    setSelectedRoomForDetails,
    openBookingWizard,
    formatCurrency
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [minGuests, setMinGuests] = useState<number>(1);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');

  const categories = [
    'All',
    'Standard Room',
    'Deluxe Room',
    'Executive Room',
    'Family Room',
    'Premium Suite',
    'Presidential Suite'
  ];

  const amenityFilterOptions = [
    'All',
    'Wi-Fi',
    'Marble Bath',
    'Butler Service',
    'Eiffel Tower',
    'Balcony',
    'Jacuzzi',
    'Wine Cellar'
  ];

  const filteredRooms = rooms.filter((room) => {
    // Hotel filter
    if (room.hotelId !== activeHotel.id && rooms.some((r) => r.hotelId === activeHotel.id)) {
      // If we have rooms for current hotel, show current hotel, otherwise all
      if (room.hotelId !== activeHotel.id) return false;
    }

    if (selectedCategory !== 'All' && room.category !== selectedCategory) return false;
    if (room.pricePerNight > maxPrice) return false;
    if (room.capacity.adults + room.capacity.children < minGuests) return false;
    if (selectedAmenity !== 'All') {
      const match = room.amenities.some((a) =>
        a.toLowerCase().includes(selectedAmenity.toLowerCase())
      );
      if (!match) return false;
    }
    return true;
  });

  return (
    <section id="rooms-suites-section" className="py-16 bg-[#080C14] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#111827] border border-slate-700/70 text-[#D4B996] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Accommodations Portfolio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-100 font-normal tracking-tight mb-3">
            Rooms & Grand Suites
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            Each residence at {activeHotel.name} is thoughtfully curated with hand-crafted bespoke furnishings, Italian Statuario marble bathrooms, and panoramic vistas.
          </p>
        </div>

        {/* Advanced Filter Bar */}
        <div className="bg-[#111827] p-4 rounded border border-slate-800 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#C5A880] text-[#080C14] font-semibold'
                      : 'bg-[#161F30] text-slate-300 hover:bg-[#1E293B] border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Secondary Filters */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Max Price Slider */}
              <div className="flex items-center gap-2.5 bg-[#161F30] px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-400 font-medium">Max:</span>
                <span className="font-semibold text-[#D4B996] font-mono">{formatCurrency(maxPrice)}</span>
                <input
                  type="range"
                  min={300}
                  max={3500}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-20 accent-[#C5A880]"
                />
              </div>

              {/* Min Capacity */}
              <div className="flex items-center gap-2 bg-[#161F30] px-3 py-1.5 rounded border border-slate-800">
                <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                <select
                  value={minGuests}
                  onChange={(e) => setMinGuests(Number(e.target.value))}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-[#111827]">1+ Guests</option>
                  <option value={2} className="bg-[#111827]">2+ Guests</option>
                  <option value={4} className="bg-[#111827]">4+ Guests</option>
                  <option value={6} className="bg-[#111827]">6+ Guests</option>
                </select>
              </div>

              {/* Amenity Highlights */}
              <div className="flex items-center gap-2 bg-[#161F30] px-3 py-1.5 rounded border border-slate-800">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A880]" />
                <select
                  value={selectedAmenity}
                  onChange={(e) => setSelectedAmenity(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  {amenityFilterOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#111827]">
                      {opt === 'All' ? 'All Amenities' : opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] rounded border border-slate-800">
            <BedDouble className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-300">No suites match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try broadening your price range or adjusting filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setMaxPrice(3500);
                setMinGuests(1);
                setSelectedAmenity('All');
              }}
              className="mt-3 px-3 py-1.5 bg-[#C5A880] text-[#080C14] text-xs font-semibold rounded"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className="group bg-[#111827] rounded overflow-hidden border border-slate-800 hover:border-slate-700 shadow-sm transition-colors flex flex-col"
              >
                {/* Room Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-90" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#111827]/90 px-2.5 py-0.5 rounded text-[10px] font-semibold text-[#D4B996] border border-slate-700">
                    {room.category}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-[#111827]/90 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 flex items-center gap-1 border border-slate-700">
                    <Star className="w-3 h-3 fill-[#C5A880] text-[#C5A880]" />
                    <span>{room.rating}</span>
                    <span className="text-slate-400 font-normal">({room.reviewCount})</span>
                  </div>

                  {/* Price Tag in Image */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-xl font-semibold text-white">
                        {formatCurrency(room.pricePerNight)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-light">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-slate-100 mb-1">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                      {room.description}
                    </p>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-800 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>Up to {room.capacity.adults + room.capacity.children}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>{room.sizeSqFt} sq ft</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#161F30] text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] bg-[#161F30] text-[#D4B996] px-1.5 py-0.5 rounded border border-slate-800">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      id={`view-details-${room.id}`}
                      onClick={() => setSelectedRoomForDetails(room)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#161F30] hover:bg-[#1E293B] text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4B996]" />
                      <span>View Details</span>
                    </button>

                    <button
                      id={`book-now-${room.id}`}
                      onClick={() => openBookingWizard(room)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] text-xs font-semibold transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Reserve</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
