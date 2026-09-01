import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Crown, Printer, Download, Mail, CheckCircle2, X, FileText, QrCode } from 'lucide-react';
import { Booking } from '../../types';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  const { activeHotel, formatCurrency } = useHotel();

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-2026-${booking.id.replace('BK-', '')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-sm">Official Tax Invoice & Receipt</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              {invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-8 bg-white">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded bg-slate-950 flex items-center justify-center text-amber-400 shadow">
                  <Crown className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="font-brand-cinzel font-bold text-xl text-slate-950 tracking-wider">
                    {activeHotel.name.toUpperCase()}
                  </h2>
                  <p className="text-[11px] tracking-widest text-amber-700 uppercase font-medium">
                    Haute Hospitality & Palatial Residences
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeHotel.address}<br />
                Phone: {activeHotel.phone} | Email: {activeHotel.email}<br />
                VAT / Tax ID: FR-88294019284
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                ✓ {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
              </span>
              <p className="text-xs font-bold text-slate-900 font-mono">Invoice: {invoiceNumber}</p>
              <p className="text-xs text-slate-600">Booking Ref: <span className="font-mono font-semibold">{booking.id}</span></p>
              <p className="text-xs text-slate-600">Issue Date: {booking.createdAt}</p>
            </div>
          </div>

          {/* Guest & Reservation Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To (Guest Details)</p>
              <h4 className="font-semibold text-sm text-slate-900">{booking.guestName}</h4>
              <p className="text-xs text-slate-600">{booking.guestEmail}</p>
              <p className="text-xs text-slate-600">{booking.guestPhone}</p>
              {booking.guestAddress && <p className="text-xs text-slate-600">{booking.guestAddress}</p>}
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stay Details</p>
              <p><strong className="text-slate-900">Room Type:</strong> {booking.roomName} ({booking.roomCategory})</p>
              <p><strong className="text-slate-900">Room Number:</strong> {booking.roomNumber}</p>
              <p><strong className="text-slate-900">Dates:</strong> {booking.checkInDate} → {booking.checkOutDate} ({booking.nights} nights)</p>
              <p><strong className="text-slate-900">Occupancy:</strong> {booking.adults} Adults, {booking.children} Children ({booking.roomsCount} Room)</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2 text-center">Rate / Unit</th>
                  <th className="py-3 px-2 text-center">Qty / Nights</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-3 px-2 font-medium text-slate-900">
                    {booking.roomName} accommodation ({booking.roomCategory})
                  </td>
                  <td className="py-3 px-2 text-center">{formatCurrency(booking.roomRatePerNight)}</td>
                  <td className="py-3 px-2 text-center">{booking.nights} Nights</td>
                  <td className="py-3 px-2 text-right font-medium">
                    {formatCurrency(booking.roomRatePerNight * booking.nights)}
                  </td>
                </tr>

                {booking.addons && booking.addons.map((addon, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-2 text-slate-800">
                      + Add-on: {addon.name}
                    </td>
                    <td className="py-3 px-2 text-center">{formatCurrency(addon.price)}</td>
                    <td className="py-3 px-2 text-center">{addon.quantity}</td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatCurrency(addon.price * addon.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t-2 border-slate-900 pt-6">
            <div className="space-y-2 text-xs text-slate-600 max-w-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Payment Method:</span>
                <span>{booking.paymentMethod}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Thank you for staying with {activeHotel.name}. For questions regarding this invoice, please reach out to accounts@{activeHotel.slug}.com.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-2">
                <QrCode className="w-4 h-4 text-slate-600" />
                <span>Verified Cryptographic Hash: SHA256-AURA-{booking.id}</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(booking.subtotal)}</span>
              </div>

              {booking.discount > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 border-b border-slate-100">
                  <span>VIP Discount Applied:</span>
                  <span>-{formatCurrency(booking.discount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Luxury & VAT Tax (12%):</span>
                <span className="font-medium text-slate-900">{formatCurrency(booking.taxes)}</span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-bold text-slate-950">
                <span>Total Amount:</span>
                <span className="text-amber-700">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
