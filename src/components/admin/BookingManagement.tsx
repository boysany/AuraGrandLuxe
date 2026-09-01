import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  LogIn,
  LogOut,
  XCircle,
  CheckCircle,
  FileText,
  User,
  BedDouble,
  DollarSign
} from 'lucide-react';
import { Booking, BookingStatus, PaymentStatus } from '../../types';

export const BookingManagement: React.FC<{ isNewBookingModalOpen: boolean; onCloseNewBookingModal: () => void }> = ({
  isNewBookingModalOpen,
  onCloseNewBookingModal
}) => {
  const {
    bookings,
    rooms,
    activeHotel,
    createBooking,
    updateBookingStatus,
    viewInvoice,
    formatCurrency
  } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Walk-in form state
  const [walkinGuestName, setWalkinGuestName] = useState('Sir Jonathan Sterling');
  const [walkinEmail, setWalkinEmail] = useState('jonathan@sterling-invest.com');
  const [walkinPhone, setWalkinPhone] = useState('+33 6 88 44 22 11');
  const [walkinRoomId, setWalkinRoomId] = useState(rooms[0]?.id || '');
  const [walkinCheckIn, setWalkinCheckIn] = useState('2026-09-01');
  const [walkinCheckOut, setWalkinCheckOut] = useState('2026-09-04');
  const [walkinAdults, setWalkinAdults] = useState(2);
  const [walkinPaymentStatus, setWalkinPaymentStatus] = useState<PaymentStatus>('paid');
  const [walkinPaymentMethod, setWalkinPaymentMethod] = useState('Credit Card (Terminal)');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.bookingStatus !== statusFilter) return false;
    if (paymentFilter !== 'all' && b.paymentStatus !== paymentFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        b.id.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.roomNumber.toLowerCase().includes(q) ||
        b.roomName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const selRoom = rooms.find((r) => r.id === walkinRoomId) || rooms[0];

    const d1 = new Date(walkinCheckIn);
    const d2 = new Date(walkinCheckOut);
    const nights = Math.max(1, Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))) || 3;
    const subtotal = selRoom.pricePerNight * nights;
    const taxes = subtotal * 0.12;
    const totalAmount = subtotal + taxes;

    createBooking({
      hotelId: activeHotel.id,
      roomId: selRoom.id,
      roomNumber: selRoom.roomNumber,
      roomName: selRoom.name,
      roomCategory: selRoom.category,
      guestId: `walkin-${Date.now()}`,
      source: 'Front Desk Walk-in' as const,
      guestName: walkinGuestName,
      guestEmail: walkinEmail,
      guestPhone: walkinPhone,
      checkInDate: walkinCheckIn,
      checkOutDate: walkinCheckOut,
      nights,
      adults: walkinAdults,
      children: 0,
      roomsCount: 1,
      roomRatePerNight: selRoom.pricePerNight,
      subtotal,
      discount: 0,
      taxes,
      totalAmount,
      bookingStatus: 'checked_in', // Fast walk-in checked in immediately
      paymentStatus: walkinPaymentStatus,
      paymentMethod: walkinPaymentMethod,
      addons: [],
      specialRequests: 'Front desk direct walk-in registration.'
    });

    onCloseNewBookingModal();
  };

  const exportCSV = () => {
    const headers = 'ID,Guest Name,Email,Phone,Room,Category,CheckIn,CheckOut,Nights,Total,Status,Payment\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.guestName}","${b.guestEmail}","${b.guestPhone}","${b.roomNumber}","${b.roomCategory}","${b.checkInDate}","${b.checkOutDate}",${b.nights},"${b.totalAmount}","${b.bookingStatus}","${b.paymentStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div id="booking-management-view" className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-semibold">
            Reservation & Booking Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Manage online reservations, walk-in check-ins, rate overrides, and guest folios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded bg-[#161F30] hover:bg-[#1E293B] text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#D4B996]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onCloseNewBookingModal} // toggle via parent
            className="px-3.5 py-1.5 rounded bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111827] p-3.5 rounded border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Guest, Room, Email, ID..."
            className="w-full bg-[#0B0F17] border border-slate-700 rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-2 bg-[#161F30] px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111827]">All Bookings</option>
              <option value="confirmed" className="bg-[#111827]">Confirmed</option>
              <option value="checked_in" className="bg-[#111827]">Checked In</option>
              <option value="checked_out" className="bg-[#111827]">Checked Out</option>
              <option value="cancelled" className="bg-[#111827]">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#161F30] px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111827]">All Payments</option>
              <option value="paid" className="bg-[#111827]">Paid In Full</option>
              <option value="pending" className="bg-[#111827]">Pending</option>
              <option value="refunded" className="bg-[#111827]">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#111827] rounded border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#161F30] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest Information</th>
                <th className="py-3 px-4">Room / Suite</th>
                <th className="py-3 px-4">Stay Dates</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No reservations match your search or filter query.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#161F30]/60 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-[#D4B996]">
                      {b.id}
                    </td>

                    <td className="py-2.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-100">{b.guestName}</p>
                        <p className="text-[10px] text-slate-400">{b.guestEmail}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{b.guestPhone}</p>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#0B0F17] px-1.5 py-0.5 rounded border border-slate-800 font-semibold text-slate-200 text-[11px]">
                          {b.roomNumber}
                        </span>
                        <div>
                          <p className="text-slate-200 leading-tight font-medium">{b.roomName}</p>
                          <p className="text-[10px] text-slate-400">{b.roomCategory}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <div>
                        <p className="text-slate-200">{b.checkInDate} → {b.checkOutDate}</p>
                        <p className="text-[10px] text-slate-400">{b.nights} Nights • {b.adults} Adults</p>
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-100 font-mono">{formatCurrency(b.totalAmount)}</p>
                        {b.discount > 0 && (
                          <p className="text-[10px] text-emerald-400">Save {formatCurrency(b.discount)}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block text-[9px] px-2 py-0.5 rounded font-medium uppercase ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-[#C5A880]/15 text-[#D4B996] border border-[#C5A880]/30'
                            : b.bookingStatus === 'checked_in'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : b.bookingStatus === 'checked_out'
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {b.bookingStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block text-[9px] px-2 py-0.5 rounded font-medium ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : b.paymentStatus === 'pending'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        }`}
                      >
                        {b.paymentStatus.toUpperCase()} ({b.paymentMethod})
                      </span>
                    </td>

                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'checked_in')}
                            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors"
                            title="Check-In Guest"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {b.bookingStatus === 'checked_in' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'checked_out')}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                            title="Check-Out Guest & Dispatch Housekeeping"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'checked_out' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'cancelled')}
                            className="p-1.5 bg-[#161F30] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 rounded transition-colors border border-slate-700/60"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => viewInvoice(b)}
                          className="p-1.5 bg-[#161F30] hover:bg-[#1E293B] text-[#D4B996] rounded transition-colors border border-slate-700/60"
                          title="Generate Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Walk-In Booking Modal */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] text-white rounded max-w-2xl w-full border border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-lg text-slate-100 font-semibold">Direct Walk-In Reservation</h3>
                <p className="text-xs text-slate-400">Register in-person arrival at the front desk</p>
              </div>
              <button
                onClick={onCloseNewBookingModal}
                className="p-1.5 rounded bg-[#161F30] hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Guest Full Name *</label>
                  <input
                    type="text"
                    value={walkinGuestName}
                    onChange={(e) => setWalkinGuestName(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email *</label>
                  <input
                    type="email"
                    value={walkinEmail}
                    onChange={(e) => setWalkinEmail(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Phone *</label>
                  <input
                    type="tel"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Assign Suite / Room *</label>
                  <select
                    value={walkinRoomId}
                    onChange={(e) => setWalkinRoomId(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} - {r.name} ({r.category}) - {formatCurrency(r.pricePerNight)}/nt
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Check-In Date</label>
                  <input
                    type="date"
                    value={walkinCheckIn}
                    onChange={(e) => setWalkinCheckIn(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Check-Out Date</label>
                  <input
                    type="date"
                    value={walkinCheckOut}
                    onChange={(e) => setWalkinCheckOut(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Status</label>
                  <select
                    value={walkinPaymentStatus}
                    onChange={(e) => setWalkinPaymentStatus(e.target.value as any)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="paid">Paid in Full (Check-in Ready)</option>
                    <option value="pending">Pending Settlement at Check-out</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Method</label>
                  <select
                    value={walkinPaymentMethod}
                    onChange={(e) => setWalkinPaymentMethod(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-[#C5A880]"
                  >
                    <option>Credit Card (POS Terminal)</option>
                    <option>Cash at Front Desk</option>
                    <option>UPI / QR Code</option>
                    <option>Corporate Direct Billing</option>
                  </select>
                </div>
              </div>

              <div className="pt-3.5 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCloseNewBookingModal}
                  className="px-3.5 py-1.5 rounded bg-[#161F30] hover:bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] font-semibold transition-colors"
                >
                  Confirm Walk-In & Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
