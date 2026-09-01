import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  Sparkles,
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
  ArrowRight,
  Percent,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Room, Booking, ExtraServiceItem, PaymentMethod } from '../../types';

export const BookingFlowModal: React.FC = () => {
  const {
    bookingWizardOpen,
    closeBookingWizard,
    selectedRoomForBooking,
    setSelectedRoomForBooking,
    rooms,
    activeHotel,
    extraServices,
    createBooking,
    applyCouponCode,
    viewInvoice,
    formatCurrency
  } = useHotel();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [checkInDate, setCheckInDate] = useState<string>('2026-09-01');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-09-05');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(1);

  // Guest details
  const [guestName, setGuestName] = useState<string>('Lord Charles Sterling');
  const [guestEmail, setGuestEmail] = useState<string>('charles.sterling@mayfair.co.uk');
  const [guestPhone, setGuestPhone] = useState<string>('+44 20 7946 0912');
  const [guestAddress, setGuestAddress] = useState<string>('42 Berkeley Square, Mayfair, London');
  const [guestCountry, setGuestCountry] = useState<string>('United Kingdom');
  const [specialRequests, setSpecialRequests] = useState<string>('High-floor room with Eiffel Tower view, chilled vintage champagne in room upon arrival.');

  // Addons State
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number; quantity: number }[]>([
    { id: 'srv-breakfast', name: 'Artisan Champagne Breakfast', price: 65, quantity: 2 }
  ]);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'upi_qr' | 'debit_card' | 'net_banking' | 'pay_at_hotel'>('credit_card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 9823');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvc, setCardCvc] = useState<string>('742');
  const [upiId, setUpiId] = useState<string>('sterling@okhdfcbank');

  // Promo Coupon
  const [couponCode, setCouponCode] = useState<string>('ROYAL2026');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string>('');

  // Result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const calculatedNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 4;

  const currentRoom: Room = selectedRoomForBooking || rooms[0];

  // Pricing calculations
  const roomBaseSubtotal = currentRoom.pricePerNight * calculatedNights * roomsCount;
  const addonsTotal = selectedAddons.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subtotal = roomBaseSubtotal + addonsTotal;
  const taxes = (subtotal - couponDiscount) * 0.12;
  const totalAmount = Math.max(0, subtotal - couponDiscount + taxes);

  useEffect(() => {
    if (bookingWizardOpen) {
      setCurrentStep(1);
      setConfirmedBooking(null);
      // Try applying default coupon
      const res = applyCouponCode('ROYAL2026', subtotal);
      if (res.valid) {
        setCouponDiscount(res.discount);
        setCouponMsg(res.message);
      }
    }
  }, [bookingWizardOpen]);

  if (!bookingWizardOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCouponCode(couponCode, subtotal);
    setCouponDiscount(res.discount);
    setCouponMsg(res.message);
  };

  const toggleAddon = (service: ExtraServiceItem) => {
    const exists = selectedAddons.find((a) => a.id === service.id);
    if (exists) {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== service.id));
    } else {
      setSelectedAddons((prev) => [
        ...prev,
        { id: service.id, name: service.name, price: service.price, quantity: 1 }
      ]);
    }
  };

  const handleFinalizeBooking = () => {
    const bookingPayload = {
      hotelId: activeHotel.id,
      roomId: currentRoom.id,
      roomNumber: currentRoom.roomNumber,
      roomName: currentRoom.name,
      roomCategory: currentRoom.category,
      guestId: `gst-${Date.now()}`,
      source: 'Online Website' as const,
      guestName,
      guestEmail,
      guestPhone,
      guestAddress,
      guestCountry,
      checkInDate,
      checkOutDate,
      nights: calculatedNights,
      adults,
      children,
      roomsCount,
      roomRatePerNight: currentRoom.pricePerNight,
      subtotal,
      discount: couponDiscount,
      taxes,
      totalAmount,
      bookingStatus: 'confirmed' as const,
      paymentStatus: paymentMethod === 'pay_at_hotel' ? ('pending' as const) : ('paid' as const),
      paymentMethod: (paymentMethod === 'credit_card'
        ? 'Credit Card'
        : paymentMethod === 'upi_qr'
        ? 'UPI'
        : paymentMethod === 'debit_card'
        ? 'Debit Card'
        : paymentMethod === 'net_banking'
        ? 'Bank Transfer'
        : 'Pay at Hotel') as PaymentMethod,
      addons: selectedAddons,
      specialRequests
    };

    const newBk = createBooking(bookingPayload);
    setConfirmedBooking(newBk);
    setCurrentStep(6);
  };

  const steps = [
    { num: 1, label: 'Stay Dates' },
    { num: 2, label: 'Room' },
    { num: 3, label: 'Guest Info' },
    { num: 4, label: 'Services' },
    { num: 5, label: 'Payment' },
    { num: 6, label: 'Confirmed' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[92vh]">
        {/* Top Header & Wizard Progress */}
        <div className="bg-slate-950 p-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-lg font-bold text-amber-400">
                {activeHotel.name}
              </span>
              <span className="text-xs text-slate-400 border-l border-slate-800 pl-2.5">
                VIP Reservation Suite
              </span>
            </div>

            <button
              onClick={closeBookingWizard}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Dots & Line */}
          <div className="flex items-center justify-between max-w-xl mx-auto px-2">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step.num
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                        : currentStep > step.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {currentStep > step.num ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                    {step.label}
                  </span>
                </div>

                {step.num < steps.length && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 transition-colors ${
                      currentStep > step.num ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* STEP 1: Dates & Occupancy */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 mb-1">Select Dates & Party Size</h3>
                <p className="text-xs text-slate-400">
                  Select your arrival and departure schedule to check palace room availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-400">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-400">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Adults (18+)</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
                  >
                    {[1, 2, 3, 4, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Children</label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>
                        {n} Children
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Number of Rooms</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Room' : 'Rooms'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculated Stay Duration:</span>
                <span className="font-bold text-amber-400 text-sm">
                  {calculatedNights} Nights ({checkInDate} → {checkOutDate})
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Room */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 mb-1">Select Room or Suite</h3>
                <p className="text-xs text-slate-400">
                  Select your desired luxury accommodation level.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((r) => {
                  const isSelected = currentRoom.id === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRoomForBooking(r)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={r.images[0]}
                        alt={r.name}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-400 uppercase">
                            {r.category}
                          </span>
                          <span className="font-bold text-sm text-slate-100">
                            {formatCurrency(r.pricePerNight)}
                            <span className="text-[10px] text-slate-400 font-normal">/nt</span>
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-100 truncate">{r.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{r.bedType} • {r.sizeSqFt} sq ft</p>
                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400">✓ Free Breakfast & Spa Access</span>
                          {isSelected && (
                            <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Guest Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 mb-1">Primary Guest Details</h3>
                <p className="text-xs text-slate-400">
                  Please provide your contact information for reservation confirmation and VIP check-in.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                    placeholder="e.g. Lady Vivienne Vance"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                    placeholder="vivienne@domain.com"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                    placeholder="+33 1 42 68 00 00"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Country of Residence</label>
                  <input
                    type="text"
                    value={guestCountry}
                    onChange={(e) => setGuestCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                    placeholder="France / USA / UK"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Billing Address</label>
                <input
                  type="text"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100"
                  placeholder="Street address, City, Postal Code"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Special Requests & Dietary Preferences
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                  placeholder="Early check-in, dietary restrictions, romantic setup, pillow preference..."
                />
              </div>
            </div>
          )}

          {/* STEP 4: Bespoke Services & Addons */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 mb-1">Enhance Your Stay</h3>
                <p className="text-xs text-slate-400">
                  Curate bespoke luxuries and culinary indulgences for your visit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extraServices.map((service) => {
                  const isChecked = selectedAddons.some((a) => a.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleAddon(service)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/20'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-100 truncate">{service.name}</h4>
                          <span className="font-bold text-amber-400 text-xs">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{service.description}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">{service.duration}</span>
                          <span className={isChecked ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            {isChecked ? '✓ Added' : '+ Add to Stay'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Payment & Voucher */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-slate-100 mb-1">Billing & Secure Payment</h3>
                <p className="text-xs text-slate-400">
                  Select your preferred settlement method. All transactions are 256-bit SSL encrypted.
                </p>
              </div>

              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Percent className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Voucher or Promo Code"
                  className="flex-1 bg-transparent text-xs text-slate-100 focus:outline-none uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Apply Voucher
                </button>
              </form>
              {couponMsg && (
                <p className={`text-xs ${couponDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMsg}
                </p>
              )}

              {/* Payment Methods */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { id: 'upi_qr', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'debit_card', label: 'Debit Card', icon: CreditCard },
                  { id: 'net_banking', label: 'Net Banking', icon: Lock },
                  { id: 'pay_at_hotel', label: 'Pay At Hotel', icon: Clock }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSel
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment details conditional */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Security CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi_qr' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center text-slate-950 shadow">
                    <QrCode className="w-28 h-28" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-100">Scan & Pay with Any UPI App</h4>
                    <p className="text-xs text-slate-400">
                      GPay, PhonePe, Paytm, BHIM, or any international UPI rail.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                      />
                      <span className="text-[10px] text-emerald-400">✓ Verified Merchant</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pay_at_hotel' && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-amber-400">Pay Upon Arrival at Reception Desk</p>
                  <p>
                    No immediate charge will be made to your card. Your reservation is guaranteed with palace concierge credit authorization.
                  </p>
                </div>
              )}

              {/* Grand Total Summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Room ({calculatedNights} nights × {roomsCount} room):</span>
                  <span className="text-slate-200">{formatCurrency(roomBaseSubtotal)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Curated Add-ons:</span>
                    <span className="text-slate-200">{formatCurrency(addonsTotal)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Voucher Discount:</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & Fees (12%):</span>
                  <span className="text-slate-200">{formatCurrency(taxes)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-bold text-slate-100">
                  <span>Final Investment:</span>
                  <span className="text-amber-400 font-serif text-xl">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {currentStep === 6 && confirmedBooking && (
            <div className="text-center py-6 space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-3xl text-slate-100">
                  We look forward to welcoming you, {confirmedBooking.guestName}!
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A bespoke itinerary and tax receipt have been dispatched to{' '}
                  <span className="text-amber-300 font-medium">{confirmedBooking.guestEmail}</span>.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hotel Property:</span>
                  <span className="text-slate-200 font-medium">{activeHotel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Room Allocated:</span>
                  <span className="text-slate-200 font-medium">{confirmedBooking.roomName} ({confirmedBooking.roomNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Check-in / Check-out:</span>
                  <span className="text-slate-200 font-medium">{confirmedBooking.checkInDate} → {confirmedBooking.checkOutDate}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="font-bold text-slate-100 text-sm">{formatCurrency(confirmedBooking.totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => viewInvoice(confirmedBooking)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>View & Print Tax Invoice</span>
                </button>

                <button
                  onClick={closeBookingWizard}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors"
                >
                  Done & Return to Palace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons (Steps 1-5) */}
        {currentStep < 6 && (
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentStep === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Step {currentStep} of 5
              </span>

              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalizeBooking}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Authorize & Confirm Reservation</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
