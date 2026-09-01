import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Crown, Sparkles, MapPin, Phone, Mail, Award, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { activeHotel, hotels, setActiveHotelId, setCustomerActiveTab, setActivePortal } = useHotel();

  return (
    <footer id="main-hotel-footer" className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Brand Luxury Highlights */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">Michelin & Forbes 5-Star</h4>
              <p className="text-xs text-slate-400">Internationally acclaimed culinary and hospitality excellence.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">Best Rate Guarantee</h4>
              <p className="text-xs text-slate-400">Direct booking perks, room upgrades, and flexible cancellation.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">24/7 Butler & Concierge</h4>
              <p className="text-xs text-slate-400">Les Clefs d'Or master concierge dedicated to your every desire.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">Diamond Privileges</h4>
              <p className="text-xs text-slate-400">Complimentary vintage champagne and private spa treatments.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-brand-cinzel font-bold text-lg text-slate-100 tracking-wider">AURA</span>
                <span className="text-xs uppercase font-medium tracking-[0.2em] text-amber-400 pl-2">GRAND LUXE</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              A bespoke sanctuary where haute hospitality, timeless architectural grandeur, and hyper-personalized service converge to create unforgettable global stays.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeHotel.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeHotel.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{activeHotel.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Global Properties */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Our Palaces & Resorts
            </h4>
            <ul className="space-y-2 text-xs">
              {hotels.map((hotel) => (
                <li key={hotel.id}>
                  <button
                    onClick={() => {
                      setActiveHotelId(hotel.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left hover:text-amber-400 transition-colors flex items-center gap-1.5 ${
                      hotel.id === activeHotel.id ? 'text-amber-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <span>{hotel.logo}</span>
                    <span>{hotel.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Guest Experience
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActivePortal('customer'); setCustomerActiveTab('rooms'); }} className="hover:text-amber-400">
                  Rooms & Suites
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePortal('customer'); setCustomerActiveTab('dining'); }} className="hover:text-amber-400">
                  Michelin Dining & Menus
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePortal('customer'); setCustomerActiveTab('services'); }} className="hover:text-amber-400">
                  Imperial Spa & Chauffeur
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePortal('customer'); setCustomerActiveTab('offers'); }} className="hover:text-amber-400">
                  Exclusive Seasonal Offers
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePortal('customer'); setCustomerActiveTab('gallery'); }} className="hover:text-amber-400">
                  Photo & Video Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: SaaS Cloud & Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Hospitality Cloud
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Power your luxury hotel with Aura PMS & SaaS Cloud ecosystem.
            </p>
            <button
              onClick={() => setActivePortal('super_admin')}
              className="w-full mb-3 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium py-2 px-3 rounded border border-slate-700 flex items-center justify-between transition-colors"
            >
              <span>SaaS Super Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActivePortal('admin')}
              className="w-full text-xs bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 font-medium py-2 px-3 rounded border border-blue-800/60 flex items-center justify-between transition-colors"
            >
              <span>Hotel Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Aura Grand Luxe Hotels & Resorts Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Stay</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookies & Security</span>
            <span className="hover:text-slate-400 cursor-pointer">SaaS SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
