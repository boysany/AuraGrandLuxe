import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Tag,
  Copy,
  Check
} from 'lucide-react';

export const AboutGalleryContact: React.FC<{ activeSubTab: string }> = ({ activeSubTab }) => {
  const { activeHotel, coupons, openBookingWizard, formatCurrency } = useHotel();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: 'Sir William Randolph',
    email: 'william@randolph-holdings.com',
    subject: 'Private Palace Ballroom Buyout Inquiry',
    message: 'We are organizing an exclusive philanthropic gala for 120 dignitaries in October 2026. Please share buyout options.'
  });

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', title: 'Grand Façade & Courtyard' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', title: 'Presidential Royal Salon' },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', title: 'Avenue Montaigne Suite' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', title: 'Infinity Palace Pool' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', title: 'Michelin 3-Star Salon' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', title: 'Imperial Thermal Spa' }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* ABOUT US SUBSECTION */}
        {(activeSubTab === 'about' || activeSubTab === 'all') && (
          <section id="about-subtab" className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Heritage</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-slate-100 font-normal">
                A Century of Timeless Splendor
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
                Established in 1924, Aura Grand Luxe stands as an enduring monument to classic European craftsmanship, discreet diplomacy, and legendary hospitality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-2">
                <p className="font-serif text-4xl font-bold text-amber-400">1924</p>
                <h4 className="text-sm font-semibold text-slate-200">Palace Inception</h4>
                <p className="text-xs text-slate-400">Constructed by master Parisian artisans for nobility.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-2">
                <p className="font-serif text-4xl font-bold text-amber-400">140+</p>
                <h4 className="text-sm font-semibold text-slate-200">Global Accolades</h4>
                <p className="text-xs text-slate-400">Honored by Condé Nast, Forbes 5-Star, and World Luxury Awards.</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-2">
                <p className="font-serif text-4xl font-bold text-amber-400">24/7</p>
                <h4 className="text-sm font-semibold text-slate-200">Les Clefs d'Or</h4>
                <p className="text-xs text-slate-400">Golden Key concierges turning the impossible into reality.</p>
              </div>
            </div>
          </section>
        )}

        {/* GALLERY SUBSECTION */}
        {(activeSubTab === 'gallery' || activeSubTab === 'all') && (
          <section id="gallery-subtab" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-100 font-normal">
                Visual Chronicle
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Glimpse into the exquisite architecture, Michelin dining salons, and tranquil wellness sanctuaries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 shadow-xl"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    <p className="font-serif text-sm font-medium text-slate-100">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OFFERS & VOUCHERS SUBSECTION */}
        {(activeSubTab === 'offers' || activeSubTab === 'all') && (
          <section id="offers-subtab" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <Tag className="w-3.5 h-3.5" />
                <span>Seasonal Privileges</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-100 font-normal">
                Exclusive Direct Booking Offers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `${formatCurrency(coupon.discountValue)} OFF`}
                      </span>
                      <span className="text-[10px] text-slate-400">Valid until {coupon.validUntil}</span>
                    </div>
                    <h4 className="font-serif text-lg text-slate-100">{coupon.title}</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 font-bold">
                      {coupon.code}
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT SUBSECTION */}
        {(activeSubTab === 'contact' || activeSubTab === 'all') && (
          <section id="contact-subtab" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-100 font-normal mb-3">
                  Connect with the Palace Concierge
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                  Our front office and reservations directors remain at your constant disposal for presidential suite inquiries, palace event buyouts, and private aviation coordination.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-slate-200">Address</h5>
                    <p className="text-slate-400 mt-0.5">{activeHotel.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-slate-200">Direct Concierge Telephone</h5>
                    <p className="text-slate-400 mt-0.5">{activeHotel.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-slate-200">VIP Reservations Email</h5>
                    <p className="text-slate-400 mt-0.5">{activeHotel.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 p-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-2xl text-slate-100">Message Received</h4>
                  <p className="text-xs text-slate-300">
                    The Head of Palace Relations will reply to {contactForm.email} within two hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <h3 className="font-serif text-xl text-slate-100 mb-2">Send an Exclusive Inquiry</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Your Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold">Your Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Inquiry Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Message & Details</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Inquiries to Concierge</span>
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
