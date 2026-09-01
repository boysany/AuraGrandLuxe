import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Users,
  Search,
  Crown,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit,
  Save,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { GuestProfile } from '../../types';

export const GuestCRM: React.FC = () => {
  const { guests, updateGuestNotes, formatCurrency } = useHotel();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(guests[0] || null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(guests[0]?.notes || '');
  const [savedMsg, setSavedMsg] = useState(false);

  const filteredGuests迷 = guests.filter((g) => {
    if (!searchTerm) return true;
    const q不易 = searchTerm.toLowerCase();
    return (
      g.name.toLowerCase().includes(q不易) ||
      g.email.toLowerCase().includes(q不易) ||
      g.phone.includes(q不易) ||
      g.country.toLowerCase().includes(q不易)
    );
  });

  const handleSaveNotes = () => {
    if (selectedGuest) {
      updateGuestNotes(selectedGuest.id, noteContent);
      setSavedMsg(true);
      setEditingNotes(false);
      setTimeout(() => setSavedMsg(false), 3000);
    }
  };

  return (
    <div id="guest-crm-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div>
        <h1 className="font-serif text-2xl text-slate-100 font-normal">
          Guest Profiles & VIP CRM
        </h1>
        <p className="text-xs text-slate-400">
          Track guest stay histories, VIP diamond status, lifetime spend, preferences, and internal butler records.
        </p>
      </div>

      {/* Two Column Layout: List on Left, Profile Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Guest Directory (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guests by name, email, country..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredGuests迷.map((guest) => {
              const isSelected = selectedGuest?.id === guest.id;
              return (
                <div
                  key={guest.id}
                  onClick={() => {
                    setSelectedGuest(guest);
                    setNoteContent(guest.notes || '');
                    setEditingNotes(false);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={guest.avatar}
                      alt={guest.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-semibold text-slate-100 truncate">{guest.name}</h4>
                        {guest.loyaltyTier === 'Diamond' && (
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{guest.email}</p>
                      <p className="text-[10px] text-slate-500">{guest.country} • {guest.totalBookings} Stays</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        guest.loyaltyTier === 'Diamond'
                          ? 'bg-amber-500/20 text-amber-400'
                          : guest.loyaltyTier === 'Platinum'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {guest.loyaltyTier}
                    </span>
                    <p className="text-xs font-bold text-slate-200 mt-1 font-serif">
                      {formatCurrency(guest.totalSpent)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Guest Profile (7 cols) */}
        {selectedGuest ? (
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedGuest.avatar}
                  alt={selectedGuest.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-medium text-slate-100">
                      {selectedGuest.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                      {selectedGuest.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    <span>{selectedGuest.city}, {selectedGuest.country}</span>
                    <span>•</span>
                    <span>Loyalty: {selectedGuest.loyaltyTier} ({selectedGuest.loyaltyPoints.toLocaleString()} Pts)</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Lifetime Palace Spend</p>
                <p className="font-serif text-xl font-bold text-amber-400">
                  {formatCurrency(selectedGuest.totalSpent)}
                </p>
              </div>
            </div>

            {/* Contact & ID Verification Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Contact Info</p>
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedGuest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedGuest.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedGuest.address}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verified KYC & Document</p>
                <p className="text-slate-200 font-medium">{selectedGuest.idDocumentType}: <span className="font-mono text-amber-400">{selectedGuest.idDocumentNumber}</span></p>
                <p className="text-emerald-400 font-medium">✓ Government Identity Verified</p>
                <p className="text-slate-400">Member Since: {selectedGuest.memberSince}</p>
              </div>
            </div>

            {/* Guest Stay Preferences */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recorded Concierge & Butler Preferences</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedGuest.preferences.map((pref, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-slate-200"
                  >
                    ✓ {pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Internal Staff & Management Notes</span>
                </h4>
                {savedMsg && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>

              {editingNotes ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" /> Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingNotes(true)}
                  className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition-colors"
                >
                  <p>{selectedGuest.notes || 'Click to add internal staff notes regarding VIP handling...'}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-slate-600" />
            <p>Select a guest profile to view dossier and stay history.</p>
          </div>
        )}
      </div>
    </div>
  );
};
