import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Settings,
  Building,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  DollarSign,
  Clock,
  Shield
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activeHotel } = useHotel();
  const [hotelName, setHotelName] = useState(activeHotel.name);
  const [tagline, setTagline] = useState(activeHotel.tagline);
  const [phone, setPhone] = useState(activeHotel.phone);
  const [email, setEmail] = useState(activeHotel.email);
  const [address, setAddress] = useState(activeHotel.address);
  const [taxRate, setTaxRate] = useState(12);
  const [checkInTime, setCheckInTime] = useState('15:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');
  const [autoHousekeepingDispatch, setAutoHousekeepingDispatch] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-slate-100 font-normal">
          Hotel Property & PMS System Settings
        </h1>
        <p className="text-xs text-slate-400">
          Configure palace metadata, check-in policies, taxation rules, and automatic housekeeping triggers.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>System configuration successfully updated and propagated across all PMS terminals.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Hotel Profile Section */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-serif text-base text-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Palace Identity & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Hotel Official Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">VIP Concierge Telephone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Reservations Desk Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Palace Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
              required
            />
          </div>
        </div>

        {/* Operating Hours & Stay Policies */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-serif text-base text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Stay Policies & Automatic Workflows</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Standard Check-In Time</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Standard Check-Out Time</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Luxury VAT / City Tax (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="auto-housekeeping"
              checked={autoHousekeepingDispatch}
              onChange={(e) => setAutoHousekeepingDispatch(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-950 border-slate-700 cursor-pointer"
            />
            <label htmlFor="auto-housekeeping" className="text-slate-300 cursor-pointer">
              Automatically trigger Housekeeping Turnaround Task when guest checks out.
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
