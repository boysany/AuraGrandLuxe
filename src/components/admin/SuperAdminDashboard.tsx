import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  CreditCard,
  Plus,
  ArrowUpRight,
  Globe
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { hotels, setActivePortal, setAdminActiveTab, formatCurrency } = useHotel();

  const [tenants, setTenants] = useState([
    {
      id: 'TNT-001',
      hotelName: 'Aura Grand Luxe Paris',
      plan: 'Enterprise Palace ($1,499/mo)',
      mrr: 1499,
      status: 'active',
      location: 'Paris, France',
      rooms: 64,
      joinedDate: 'Jan 2025'
    },
    {
      id: 'TNT-002',
      hotelName: 'Aura Alpine Sanctuary',
      plan: 'Enterprise Palace ($1,499/mo)',
      mrr: 1499,
      status: 'active',
      location: 'St. Moritz, Switzerland',
      rooms: 42,
      joinedDate: 'Mar 2025'
    },
    {
      id: 'TNT-003',
      hotelName: 'Aura Riviera Palace',
      plan: 'Signature Resort ($1,999/mo)',
      mrr: 1999,
      status: 'active',
      location: 'Cannes, France',
      rooms: 86,
      joinedDate: 'Jun 2025'
    },
    {
      id: 'TNT-004',
      hotelName: 'Belmond Splendido Replica',
      plan: 'Boutique Luxury ($799/mo)',
      mrr: 799,
      status: 'trial',
      location: 'Portofino, Italy',
      rooms: 28,
      joinedDate: 'Aug 2026'
    }
  ]);

  const totalMRR = tenants.reduce((acc, t) => acc + t.mrr, 0);
  const totalARR = totalMRR * 12;

  return (
    <div id="super-admin-dashboard-view" className="space-y-8 animate-fade-in">
      {/* Super Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>SaaS Super Admin Platform Cockpit</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-slate-100 font-normal">
            Aura Cloud Hospitality Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Global multi-tenant infrastructure, SaaS subscription billing, ARR metrics, and enterprise fleet telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActivePortal('admin');
              setAdminActiveTab('dashboard');
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            ← Return to Hotel PMS
          </button>
        </div>
      </div>

      {/* SaaS Platform KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Annual Recurring Revenue (ARR)</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">${(totalARR).toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +46.8% YoY Expansion
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Recurring (MRR)</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">${(totalMRR).toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">100% Net Revenue Retention (NRR)</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Hotel Tenants</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">{tenants.length}</p>
          <p className="text-[11px] text-emerald-400">0% Churn Rate</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Managed Suite Fleet</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            {tenants.reduce((a, b) => a + b.rooms, 0)} Keys
          </p>
          <p className="text-[11px] text-slate-400">Across 3 European Nations</p>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-serif text-lg text-slate-100">SaaS Tenant Subscriptions</h3>
            <p className="text-xs text-slate-400">Hotel organizations licensed under Aura PMS Cloud</p>
          </div>
          <span className="text-xs bg-slate-950 px-3 py-1 rounded-xl text-amber-400 font-bold border border-slate-800">
            {tenants.length} Active Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Tenant ID</th>
                <th className="py-3 px-4">Hotel Organization</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">Monthly Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{t.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-100">{t.hotelName}</p>
                    <p className="text-[10px] text-slate-500">{t.rooms} Luxury Suites</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{t.location}</td>
                  <td className="py-3 px-4 text-slate-200">{t.plan}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">${t.mrr}/mo</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        t.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{t.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
