import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  PieChart,
  BedDouble,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { bookings, rooms, activeHotel, formatCurrency } = useHotel();
  const [timeRange, setTimeRange] = useState('Month to Date');

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0);
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRooms / (rooms.length || 1)) * 100);

  const adr = occupiedRooms > 0 ? Math.round(totalRevenue / occupiedRooms) : 850;
  const revPar = Math.round((totalRevenue / (rooms.length || 1)));

  const revenueBreakdown = [
    { label: 'Room & Suite Stays', pct: 64, amount: totalRevenue * 0.64, color: 'bg-amber-400' },
    { label: "L'Étoile Michelin Dining", pct: 21, amount: totalRevenue * 0.21, color: 'bg-emerald-400' },
    { label: 'Imperial Spa & Wellness', pct: 10, amount: totalRevenue * 0.10, color: 'bg-blue-400' },
    { label: 'Private Jet & Yacht Addons', pct: 5, amount: totalRevenue * 0.05, color: 'bg-purple-400' }
  ];

  // 7 Days Trend Data
  const weeklyTrends = [
    { day: 'Mon', rev: 14200, occ: 78 },
    { day: 'Tue', rev: 16800, occ: 82 },
    { day: 'Wed', rev: 19400, occ: 86 },
    { day: 'Thu', rev: 22100, occ: 90 },
    { day: 'Fri', rev: 28500, occ: 98 },
    { day: 'Sat', rev: 31200, occ: 100 },
    { day: 'Sun', rev: 24600, occ: 88 }
  ];

  const exportReportCSV = () => {
    const headers = 'Day,Daily Revenue,Occupancy Rate (%)\n';
    const rows = weeklyTrends.map((w) => `"${w.day}",${w.rev},${w.occ}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Executive_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div id="reports-analytics-view" className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Business Intelligence & Financial Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Real-time RevPAR, ADR, revenue stream distribution, and historical occupancy yield curves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none"
          >
            <option>Last 7 Days</option>
            <option>Month to Date</option>
            <option>Quarter to Date</option>
            <option>Year to Date (2026)</option>
          </select>

          <button
            onClick={exportReportCSV}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Financial Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Booking Yield</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">{formatCurrency(totalRevenue)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22.4% vs previous cycle
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ADR (Average Daily Rate)</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">{formatCurrency(adr)}</p>
          <p className="text-[11px] text-slate-400">Target ADR: {formatCurrency(780)} (Beating target)</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">RevPAR</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">{formatCurrency(revPar)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +15.2% industry leading
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Occupancy</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">{occupancyRate}%</p>
          <p className="text-[11px] text-slate-400">{rooms.length} Suites currently in service</p>
        </div>
      </div>

      {/* Charts Section: 7-Day Revenue Histogram & Revenue Stream Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 7-Day Yield Histogram (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-serif text-lg text-slate-100">Daily Revenue & Occupancy Pace</h3>
              <p className="text-xs text-slate-400">Peak yields over Friday - Sunday luxury getaways</p>
            </div>
          </div>

          {/* Bar Chart Visual Representation */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-7 gap-3 items-end h-52 pt-4 pb-2 border-b border-slate-800">
              {weeklyTrends.map((w, idx) => {
                const maxRev = 35000;
                const heightPct = Math.round((w.rev / maxRev) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(w.rev)}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl transition-all duration-500 hover:brightness-125 relative shadow-lg"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div
                        className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-bold text-slate-950"
                      >
                        {w.occ}%
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{w.day}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Gold Bars represent Daily Gross Receipts. Inner labels denote Nightly Suite Occupancy %.
            </p>
          </div>
        </div>

        {/* Right: Revenue by Department (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-serif text-lg text-slate-100">Revenue Stream Contribution</h3>
            <span className="text-xs text-amber-400 font-semibold">100% Attributed</span>
          </div>

          {/* Progress Breakdown Bars */}
          <div className="space-y-4">
            {revenueBreakdown.map((stream, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">{stream.label}</span>
                  <span className="font-serif font-bold text-slate-100">
                    {formatCurrency(stream.amount)} ({stream.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${stream.color}`} style={{ width: `${stream.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Profit Optimization Insight</span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Gastronomy & Spa upsells are generating an additional <strong className="text-slate-200">31% ancillary revenue</strong> on top of room tariffs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
