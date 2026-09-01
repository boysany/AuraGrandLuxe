import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Sparkles, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export const HotelServicesSection: React.FC = () => {
  const { extraServices, openBookingWizard, formatCurrency } = useHotel();

  return (
    <div id="services-spa-section" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Concierge & Wellness</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-slate-100 font-normal">
            Imperial Spa & Curated Luxuries
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            From thermal hydrotherapy and diamond facials to private helicopter excursions and Rolls-Royce Phantom transfers, we elevate every moment of your sojourn.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {extraServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-wider border border-amber-500/30">
                  {service.category}
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-100 border border-slate-700">
                  {formatCurrency(service.price)}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-slate-100 group-hover:text-amber-300 transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{service.duration}</span>
                  </span>
                  <button
                    onClick={() => openBookingWizard()}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Reserve Add-on</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
