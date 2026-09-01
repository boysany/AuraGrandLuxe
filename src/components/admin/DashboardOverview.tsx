import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  TrendingUp,
  Calendar,
  BedDouble,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  Eye,
  LogIn,
  LogOut,
  Crown,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../../types';

export const DashboardOverview: React.FC = () => {
  const {
    bookings,
    rooms,
    activeHotel,
    updateBookingStatus,
    viewInvoice,
    setAdminActiveTab,
    formatCurrency
  } = useHotel();

  // Metrics calculation
  const totalBookings = bookings.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const occupancyRate = Math.round((occupiedRooms / (rooms.length || 1)) * 100);

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0);
  const todayCheckIns = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const todayCheckOuts = bookings.filter((b) => b.bookingStatus === 'checked_in');

  const adr = occupiedRooms > 0 ? Math.round(totalRevenue / occupiedRooms) : 412;
  const revPar = Math.round((totalRevenue / (rooms.length || 1))) || 388;

  const vipArrivals = [
    {
      initials: 'EB',
      name: 'Elena Bernardi',
      details: 'Suite 104 • Flight LX203 • 14:30 Arrival',
      status: 'VIP Elite'
    },
    {
      initials: 'JS',
      name: 'Julian Sterling',
      details: 'Penthouse A • VIP Black List • Limousine Requested',
      status: 'Royal Member'
    },
    {
      initials: 'KM',
      name: 'Kento Miura',
      details: 'Deluxe King 312 • Corporate Partner • Early Check-in',
      status: 'Platinum'
    }
  ];

  return (
    <div id="dashboard-overview" className="space-y-6 text-slate-100">
      {/* 4 Luxury KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Occupancy Rate */}
        <div className="rounded bg-[#111827] p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Occupancy Rate</p>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">+2.4%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white">{occupancyRate || 94.2}%</span>
            <span className="text-xs text-slate-400">{occupiedRooms}/{rooms.length} Units</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded bg-slate-800 overflow-hidden">
            <div className="h-full bg-[#C5A880] rounded" style={{ width: `${occupancyRate || 94}%` }} />
          </div>
        </div>

        {/* Metric 2: RevPAR */}
        <div className="rounded bg-[#111827] p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RevPAR (Yield)</p>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">+8.1%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white">{formatCurrency(revPar || 412)}</span>
            <span className="text-xs text-slate-400 font-mono">ADR {formatCurrency(adr)}</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded" style={{ width: '76%' }} />
          </div>
        </div>

        {/* Metric 3: Pending Arrivals */}
        <div className="rounded bg-[#111827] p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Arrivals</p>
            <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Today</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white">{todayCheckIns.length || 28}</span>
            <span className="text-xs text-slate-400">Pre-allocated</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>Suites inspected & ready</span>
          </div>
        </div>

        {/* Metric 4: Concierge Requests */}
        <div className="rounded bg-[#111827] p-4 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Queue</p>
            <span className="text-[10px] font-semibold text-[#D4B996] bg-[#C5A880]/15 px-1.5 py-0.5 rounded border border-[#C5A880]/30">Active</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white">14</span>
            <span className="text-xs text-slate-400">Pending tickets</span>
          </div>
          <button
            onClick={() => setAdminActiveTab('services')}
            className="mt-2 text-[11px] font-medium text-[#D4B996] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Open service queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Inventory Timeline & VIP Guest Arrivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 cols): Inventory Timeline Matrix */}
        <div className="lg:col-span-2 rounded bg-[#111827] border border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-[#C5A880]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Room Inventory Matrix & Stay Schedule
              </h3>
            </div>
            <div className="flex gap-1.5">
              <button
                className="h-7 w-7 rounded border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                className="h-7 w-7 rounded border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-[#161F30] border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="py-2.5 px-4 text-left border-r border-slate-800 w-36">Room Unit</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">24 Thu</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800 bg-[#1E293B] text-slate-100">25 Fri (Today)</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">26 Sat</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-800">27 Sun</th>
                  <th className="py-2.5 px-2 text-center">28 Mon</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-2.5 font-medium border-r border-slate-800 text-slate-200">
                    Ste. 104 <span className="block font-normal text-[10px] text-slate-400">Presidential</span>
                  </td>
                  <td colSpan={3} className="p-1 border-r border-slate-800">
                    <div className="h-full w-full rounded bg-slate-800 text-slate-100 px-2 py-1 flex items-center justify-between text-xs font-medium border border-slate-700">
                      <span className="truncate">V. Rothschild (VIP)</span>
                      <span className="text-[10px] text-slate-400 font-mono">#77291</span>
                    </div>
                  </td>
                  <td className="p-1 border-r border-slate-800 bg-emerald-950/20">
                    <span className="text-[10px] text-emerald-400/70 block text-center">Available</span>
                  </td>
                  <td className="p-1 bg-emerald-950/20">
                    <span className="text-[10px] text-emerald-400/70 block text-center">Available</span>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-2.5 font-medium border-r border-slate-800 text-slate-200">
                    Rm. 402 <span className="block font-normal text-[10px] text-slate-400">Deluxe King</span>
                  </td>
                  <td className="p-1 border-r border-slate-800 bg-emerald-950/20">
                    <span className="text-[10px] text-emerald-400/70 block text-center">Available</span>
                  </td>
                  <td colSpan={2} className="p-1 border-r border-slate-800">
                    <div className="h-full w-full rounded border border-slate-700 bg-slate-800/80 text-slate-300 px-2 py-1 flex items-center justify-between text-xs">
                      <span>Pending Confirm</span>
                      <span className="text-[10px] font-mono text-slate-400">Hold</span>
                    </div>
                  </td>
                  <td colSpan={2} className="p-1">
                    <div className="h-full w-full rounded bg-slate-800 text-slate-100 px-2 py-1 flex items-center justify-between text-xs border border-slate-700">
                      <span>L. Hamilton</span>
                      <span className="text-[10px] text-slate-400 font-mono">#77402</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-2.5 font-medium border-r border-slate-800 text-slate-200">
                    Rm. 403 <span className="block font-normal text-[10px] text-slate-400">Deluxe King</span>
                  </td>
                  <td colSpan={4} className="p-1 border-r border-slate-800">
                    <div className="h-full w-full rounded bg-amber-950/30 border border-amber-800/50 text-amber-300 px-2 py-1 flex items-center justify-between text-xs">
                      <span>Scheduled Deep Clean & Inspection</span>
                      <span className="text-[9px] bg-amber-900/60 px-1.5 py-0.5 rounded font-mono">Maint</span>
                    </div>
                  </td>
                  <td className="p-1 bg-emerald-950/20">
                    <span className="text-[10px] text-emerald-400/70 block text-center">Available</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 col): VIP Guest Arrivals & Financial Overview */}
        <div className="rounded bg-[#111827] border border-slate-800 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">VIP Guest Manifest</h3>
              <span className="text-[9px] font-bold text-[#D4B996] bg-[#C5A880]/15 px-2 py-0.5 rounded border border-[#C5A880]/30">
                Priority
              </span>
            </div>

            <div className="space-y-3">
              {vipArrivals.map((vip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-[#161F30] flex items-center justify-center font-serif font-bold text-[#D4B996] border border-slate-700/70 text-xs shrink-0">
                    {vip.initials}
                  </div>
                  <div className="flex-1 border-b border-slate-800/80 pb-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate">{vip.name}</p>
                      <span className="text-[9px] text-[#D4B996] font-medium">{vip.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{vip.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Forecast Box */}
          <div className="mt-4 p-3.5 rounded bg-[#161F30] border border-slate-800 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Monthly Revenue Yield</p>
              <p className="text-base font-semibold text-slate-100 font-mono">
                $1,420,500 <span className="text-[10px] text-slate-400 font-sans">projected</span>
              </p>
            </div>
            <div className="h-7 w-7 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center text-xs font-bold">
              ↑
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Front Desk Actions & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Front Desk Arrivals & Fast Check-In (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] rounded p-5 border border-slate-800 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-serif text-base text-slate-100 font-semibold">Today's Guest Movement</h3>
              <p className="text-xs text-slate-400">Front Desk check-in & check-out actions</p>
            </div>
            <span className="text-xs bg-[#161F30] text-slate-300 px-2 py-1 rounded border border-slate-700/60 font-mono">
              {bookings.length} Total Bookings
            </span>
          </div>

          <div className="space-y-2.5">
            {bookings.slice(0, 4).map((booking) => (
              <div
                key={booking.id}
                className="bg-[#161F30] p-3 rounded border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#111827] border border-slate-700/70 flex items-center justify-center font-mono font-semibold text-[#D4B996] text-xs shrink-0">
                    {booking.roomNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-100">{booking.guestName}</h4>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium uppercase ${
                          booking.bookingStatus === 'confirmed'
                            ? 'bg-[#C5A880]/15 text-[#D4B996] border border-[#C5A880]/30'
                            : booking.bookingStatus === 'checked_in'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {booking.bookingStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {booking.roomName} • {booking.checkInDate} to {booking.checkOutDate} ({booking.nights} nts)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {booking.bookingStatus === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'checked_in')}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Check-In</span>
                    </button>
                  )}

                  {booking.bookingStatus === 'checked_in' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'checked_out')}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Check-Out</span>
                    </button>
                  )}

                  <button
                    onClick={() => viewInvoice(booking)}
                    className="p-1.5 bg-[#111827] hover:bg-slate-800 text-slate-300 rounded transition-colors border border-slate-700/60"
                    title="View Tax Invoice"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4B996]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Property Fleet Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#111827] rounded p-5 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-serif text-base text-slate-100 font-semibold">Active Property Fleet</h3>
              <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                100% Operational
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Available Suites:</span>
                <span className="font-medium text-emerald-400">{availableRooms} Units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Occupied Suites:</span>
                <span className="font-medium text-white">{occupiedRooms} Units</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">In Cleaning / Inspection:</span>
                <span className="font-medium text-[#D4B996]">{cleaningRooms} Units</span>
              </div>
            </div>
          </div>

          {/* Rate Management Yield Box */}
          <div className="bg-[#111827] rounded p-5 border border-slate-800 space-y-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-[#D4B996]">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase tracking-wider">Dynamic Yield Optimization</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High weekend velocity detected (+34% search volume). Recommendation: Adjust Presidential Suite ADR by <strong className="text-slate-200">+12%</strong> to capture peak demand.
            </p>
            <button
              onClick={() => setAdminActiveTab('ai_smart')}
              className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] text-xs font-semibold rounded transition-colors"
            >
              Review Yield Rates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
