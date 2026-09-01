import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Building2,
  Plus,
  MapPin,
  BedDouble,
  Star,
  CheckCircle2,
  ExternalLink,
  Crown,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Hotel } from '../../types';

export const MultiHotelManagement: React.FC = () => {
  const {
    hotels,
    activeHotel,
    setActiveHotelId,
    addHotel,
    formatCurrency
  } = useHotel();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New hotel form state
  const [name, setName] = useState('Aura Palazzo Vendramin');
  const [tagline, setTagline] = useState('Grand Canal Venetian Splendor');
  const [city, setCity] = useState('Venice');
  const [country, setCountry] = useState('Italy');
  const [address, setAddress] = useState('Fondamenta San Vio, Dorsoduro, 30123 Venice');
  const [currency, setCurrency] = useState('EUR');
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [totalRooms, setTotalRooms] = useState(48);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80');

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    addHotel({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      stars: 5,
      heroImage: image,
      tagline,
      description: 'Gothic-Byzantine palace restored on Venice’s Grand Canal.',
      address,
      city,
      country,
      phone: '+39 041 528 9800',
      email: 'concierge.venice@aurahotels.com',
      website: 'https://aurahotels.com/venice',
      currency,
      currencySymbol,
      logo: '👑',
      image,
      rating: 5.0,
      totalRooms,
      occupiedRooms: 38,
      status: 'active',
      managerName: 'Contessa Isabella Morosini',
      amenities: ['Private Gondola Dock', 'Michelin 2-Star', 'Murano Glass Chandelier Lounge']
    });
    setIsAddModalOpen(false);
  };

  return (
    <div id="multi-hotel-management-view" className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Multi-Property Portfolio & Chain Governance
          </h1>
          <p className="text-xs text-slate-400">
            Consolidated enterprise oversight across luxury resorts, urban palaces, and private retreats.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Onboard New Property</span>
        </button>
      </div>

      {/* Chain Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const isActive = hotel.id === activeHotel.id;
          const occPct = Math.round((hotel.occupiedRooms / (hotel.totalRooms || 1)) * 100);

          return (
            <div
              key={hotel.id}
              className={`bg-slate-900 rounded-3xl overflow-hidden border transition-all flex flex-col justify-between shadow-2xl ${
                isActive
                  ? 'border-amber-400 ring-2 ring-amber-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-slate-700">
                  {hotel.logo} {hotel.city}, {hotel.country}
                </div>

                {isActive && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                    Active Property
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-slate-100 mb-1">{hotel.name}</h3>
                  <p className="text-xs text-slate-400 font-light">{hotel.tagline}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Occupancy Pace</span>
                    <span className="font-bold text-slate-100">{occPct}% ({hotel.occupiedRooms}/{hotel.totalRooms})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">General Manager</span>
                    <span className="font-semibold text-slate-200 truncate block">{hotel.managerName}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {isActive ? (
                    <div className="w-full py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Current Active PMS Session</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveHotelId(hotel.id)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-xl transition-colors text-center"
                    >
                      Switch PMS to {hotel.name} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-xl w-full border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-100">Onboard Hotel Property</h3>
                <p className="text-xs text-slate-400">Add a new destination to the global luxury chain</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Property Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Country *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Currency Code</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Symbol</label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Room Fleet Count</label>
                  <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Image Banner URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Provision Hotel Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
