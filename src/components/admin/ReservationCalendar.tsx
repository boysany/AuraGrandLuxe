import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BedDouble,
  Info,
  Sparkles,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Booking, Room } from '../../types';

export const ReservationCalendar: React.FC = () => {
  const { rooms, bookings, viewInvoice, activeHotel, formatCurrency } = useHotel();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Generate 14 days from Sep 1 to Sep 14, 2026
  const days = Array.from({ length: 14 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum.toString().padStart(2, '0')}`;
    const weekday = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'][(i) % 7];
    return { dayNum, dateStr, weekday };
  });

  return (
    <div id="reservation-calendar-view" className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Visual Reservation Tape Chart
          </h1>
          <p className="text-xs text-slate-400">
            Interactive room allocation timeline for <strong className="text-slate-200">{activeHotel.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200">
            <span>September 2026</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800/80 text-xs">
        <span className="text-slate-400 font-medium">Status Legend:</span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-3 h-3 rounded bg-emerald-500" />
          <span>Available</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-3 h-3 rounded bg-amber-500" />
          <span>Confirmed Stay</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-3 h-3 rounded bg-blue-500" />
          <span>Checked-In (In-House)</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-3 h-3 rounded bg-purple-500" />
          <span>Housekeeping / Turnover</span>
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-3 h-3 rounded bg-rose-500" />
          <span>Maintenance Block</span>
        </span>
      </div>

      {/* Main Tape Chart Matrix */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl">
        <div className="min-w-[900px]">
          {/* Header row with dates */}
          <div className="grid grid-cols-15 border-b border-slate-800 bg-slate-950 text-center text-xs text-slate-400 font-bold sticky top-0 z-10">
            <div className="col-span-2 p-3 text-left border-r border-slate-800 text-slate-300 uppercase tracking-wider">
              Room & Type
            </div>
            {days.map((day) => (
              <div
                key={day.dateStr}
                className={`p-2 border-r border-slate-800/60 ${
                  day.dayNum === 1 ? 'bg-amber-500/10 text-amber-300' : ''
                }`}
              >
                <span className="block text-[10px] text-slate-500 font-normal">{day.weekday}</span>
                <span className="text-xs">{day.dayNum}</span>
              </div>
            ))}
          </div>

          {/* Rooms Rows */}
          <div className="divide-y divide-slate-800/60">
            {rooms.map((room) => {
              // Find bookings for this room
              const roomBookings = bookings.filter((b) => b.roomId === room.id || b.roomNumber === room.roomNumber);

              return (
                <div key={room.id} className="grid grid-cols-15 text-xs group hover:bg-slate-800/30 transition-colors">
                  {/* Room Meta Col */}
                  <div className="col-span-2 p-3 border-r border-slate-800 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-amber-400">{room.roomNumber}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{room.category}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{formatCurrency(room.pricePerNight)}/nt</p>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.status === 'occupied'
                          ? 'bg-rose-400'
                          : room.status === 'cleaning'
                          ? 'bg-amber-400'
                          : room.status === 'maintenance'
                          ? 'bg-slate-500'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>

                  {/* 13 Day Slots container */}
                  <div className="col-span-13 relative grid grid-cols-13 h-14">
                    {/* Background grid lines */}
                    {days.slice(0, 13).map((d) => (
                      <div key={d.dateStr} className="border-r border-slate-800/40 h-full" />
                    ))}

                    {/* Overlay Booking Blocks */}
                    {roomBookings.map((bk) => {
                      // Calculate offset and length for visual demo
                      const startDay = parseInt(bk.checkInDate.split('-')[2] || '1', 10);
                      const endDay = parseInt(bk.checkOutDate.split('-')[2] || '4', 10);
                      const colStart = Math.max(1, startDay);
                      const span = Math.min(13 - colStart + 1, Math.max(1, endDay - startDay));

                      return (
                        <div
                          key={bk.id}
                          onClick={() => setSelectedBooking(bk)}
                          style={{
                            gridColumnStart: colStart,
                            gridColumnEnd: `span ${span}`
                          }}
                          className={`absolute inset-y-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-950 shadow-md cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between overflow-hidden z-10 ${
                            bk.bookingStatus === 'checked_in'
                              ? 'bg-blue-400 border border-blue-300'
                              : bk.bookingStatus === 'confirmed'
                              ? 'bg-amber-400 border border-amber-300'
                              : 'bg-emerald-400 border border-emerald-300'
                          }`}
                        >
                          <span className="truncate">{bk.guestName}</span>
                          <span className="text-[9px] bg-black/20 px-1 rounded ml-1 shrink-0 font-mono">
                            {bk.nights}N
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Quick Inspector Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-400">{selectedBooking.id}</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Room {selectedBooking.roomNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-100 text-sm">{selectedBooking.guestName}</p>
                <p className="text-slate-400">{selectedBooking.guestEmail} • {selectedBooking.guestPhone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Check-In</p>
                  <p className="font-bold text-slate-200">{selectedBooking.checkInDate}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="text-slate-400 text-[10px]">Check-Out</p>
                  <p className="font-bold text-slate-200">{selectedBooking.checkOutDate}</p>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Total Stay Investment:</span>
                <span className="font-serif font-bold text-amber-400 text-base">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  viewInvoice(selectedBooking);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
