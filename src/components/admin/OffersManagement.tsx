import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Tag,
  Plus,
  Copy,
  Check,
  Percent,
  Calendar,
  DollarSign,
  Trash2
} from 'lucide-react';
import { Coupon } from '../../types';

export const OffersManagement: React.FC = () => {
  const { coupons, addCoupon, activeHotel, formatCurrency } = useHotel();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New coupon form
  const [code, setCode] = useState('SPRINGROYAL');
  const [title, setTitle] = useState('Spring Royal Stay Privilege');
  const [description, setDescription] = useState('18% complimentary deduction on 3+ nights luxury suites.');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(18);
  const [validUntil, setValidUntil] = useState('2026-11-30');
  const [minSpend, setMinSpend] = useState(1500);

  const handleCopy = (c: string) => {
    navigator.clipboard?.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      hotelId: activeHotel.id,
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      validFrom: '2026-09-01',
      validUntil,
      minSpend,
      usageCount: 0,
      maxUsage: 250,
      active: true
    });
    setIsAddModalOpen(false);
  };

  return (
    <div id="offers-management-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Promotions & Direct Booking Offers
          </h1>
          <p className="text-xs text-slate-400">
            Create seasonal coupon codes, direct booking incentives, and VIP voucher redemptions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create Promo Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% OFF`
                    : `${formatCurrency(coupon.discountValue)} OFF`}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  Active Promo
                </span>
              </div>

              <h3 className="font-serif text-lg font-medium text-slate-100 mb-1">{coupon.title}</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">{coupon.description}</p>
            </div>

            <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Minimum Stay Spend:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(coupon.minSpend)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Redemptions Used:</span>
                <span className="font-semibold text-amber-400">{coupon.usageCount} / {coupon.maxUsage}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expiration Date:</span>
                <span className="font-semibold text-slate-200">{coupon.validUntil}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs font-bold text-amber-300">
                {coupon.code}
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

      {/* Create Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-100">Create Direct Booking Promo</h3>
                <p className="text-xs text-slate-400">Configure discount vouchers for marketing campaigns</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Coupon Promo Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono uppercase font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Promotion Headline *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Flat Amount Off ({activeHotel.currencySymbol})</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Discount Amount</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Minimum Spend ({activeHotel.currencySymbol})</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>
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
                  Publish Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
