import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  Star,
  Users,
  BedDouble,
  Maximize2,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Room } from '../../types';

export const RoomDetailsModal: React.FC = () => {
  const {
    selectedRoomForDetails,
    setSelectedRoomForDetails,
    openBookingWizard,
    rooms,
    formatCurrency
  } = useHotel();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [calcNights, setCalcNights] = useState(3);
  const [calcGuests, setCalcGuests] = useState(2);

  if (!selectedRoomForDetails) return null;

  const room = selectedRoomForDetails;

  const subtotal = room.pricePerNight * calcNights;
  const taxes = subtotal * 0.12;
  const discount = calcNights >= 5 ? subtotal * 0.15 : 0;
  const totalPrice = subtotal + taxes - discount;

  const similarRooms = rooms
    .filter((r) => r.id !== room.id && r.category === room.category)
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-slate-900 text-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[92vh]">
        {/* Top Sticky Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              {room.category}
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-normal text-slate-100 truncate">
              {room.name}
            </h2>
          </div>

          <button
            onClick={() => setSelectedRoomForDetails(null)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
              <img
                src={room.images[activeImageIdx] || room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1.5 border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{room.rating} Rating ({room.reviewCount} verified reviews)</span>
              </div>
            </div>

            {/* Thumbnails */}
            {room.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === i ? 'border-amber-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Two Columns: Content & Sticky Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Content Area (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Specs Bar */}
              <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                <div>
                  <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-[11px] text-slate-400">Capacity</p>
                  <p className="text-xs font-bold text-slate-200">
                    {room.capacity.adults} Adults, {room.capacity.children} Kids
                  </p>
                </div>
                <div>
                  <BedDouble className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-[11px] text-slate-400">Bedding</p>
                  <p className="text-xs font-bold text-slate-200">{room.bedType}</p>
                </div>
                <div>
                  <Maximize2 className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-[11px] text-slate-400">Room Size</p>
                  <p className="text-xs font-bold text-slate-200">{room.sizeSqFt} sq ft</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-slate-100">About this Residence</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {room.description}
                </p>
              </div>

              {/* Room Features */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg text-slate-100">Exclusive Room Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {room.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Amenities Grid */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg text-slate-100">Amenities & Luxuries</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {room.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-300 py-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Policies */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-semibold text-sm text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Hotel Stay & Check-In Policies</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
                  <div>
                    <strong className="text-slate-100">Check-in:</strong> 15:00 (Early arrival upon request)
                  </div>
                  <div>
                    <strong className="text-slate-100">Check-out:</strong> 12:00 (Complimentary for Diamond tier)
                  </div>
                  <div>
                    <strong className="text-slate-100">Cancellation:</strong> Free cancellation up to 48 hours prior
                  </div>
                  <div>
                    <strong className="text-slate-100">Smoking:</strong> 100% Non-smoking suites & residences
                  </div>
                </div>
              </div>

              {/* Reviews Preview */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-lg text-slate-100">Guest Endorsements</h3>
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">Lord Arthur Montgomery (London)</span>
                      <div className="flex text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      "Unmatched attention to detail. The butler service was transcendent, and the Avenue Montaigne view is simply sublime."
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">Elena Rostova (Geneva)</span>
                      <div className="flex text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      "The marble bathroom with Diptyque amenities and private sommelier cellar made this stay truly exceptional."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sticky Booking Calculator Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reserve This Suite</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-serif text-3xl font-bold text-amber-400">
                    {formatCurrency(room.pricePerNight)}
                  </span>
                  <span className="text-xs text-slate-400">/ night</span>
                </div>
              </div>

              {/* Interactive Duration & Guest Selectors */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stay Duration</label>
                  <select
                    value={calcNights}
                    onChange={(e) => setCalcNights(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Night' : 'Nights'} {n >= 5 ? '(15% Extended Stay Rebate)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Guests</label>
                  <select
                    value={calcGuests}
                    onChange={(e) => setCalcGuests(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Cost Breakdown */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{formatCurrency(room.pricePerNight)} × {calcNights} nights:</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Extended Stay Rebate (15%):</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>VAT & Luxury Tax (12%):</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(taxes)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
                  <span>Total Investment:</span>
                  <span className="text-amber-400 font-serif text-lg">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => {
                  setSelectedRoomForDetails(null);
                  openBookingWizard(room);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Proceed to Reservation</span>
              </button>

              <p className="text-[10px] text-center text-slate-500">
                🔒 Guaranteed Instant Confirmation • No Booking Fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
