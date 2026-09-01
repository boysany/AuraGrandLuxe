import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  CreditCard,
  DollarSign,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Eye,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { PaymentTransaction } from '../../types';

export const PaymentManagement: React.FC = () => {
  const {
    payments,
    processRefund,
    bookings,
    viewInvoice,
    activeHotel,
    formatCurrency
  } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [refundModalTransaction, setRefundModalTransaction] = useState<PaymentTransaction | null>(null);

  const totalCaptured = payments
    .filter((p) => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.status === 'refunded')
    .reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (methodFilter !== 'All' && p.method !== methodFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.guestName.toLowerCase().includes(q) ||
        p.bookingId.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmRefund = () => {
    if (refundModalTransaction) {
      processRefund(refundModalTransaction.id);
      setRefundModalTransaction(null);
    }
  };

  const exportPaymentsCSV = () => {
    const headers = 'Transaction ID,Booking Ref,Guest Name,Amount,Currency,Payment Method,Status,Timestamp\n';
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.id}","${p.bookingId}","${p.guestName}",${p.amount},"${p.currency}","${p.method}","${p.status}","${p.timestamp}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div id="payment-management-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Payment Gateway & Financial Ledger
          </h1>
          <p className="text-xs text-slate-400">
            Multi-currency merchant settlement, instant charge captures, authorization holds, and refunds.
          </p>
        </div>

        <button
          onClick={exportPaymentsCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors shadow"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Financial Ledger (CSV)</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Gross Settled Revenue</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            {formatCurrency(totalCaptured)}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% PCI-DSS Level 1 Secure
          </p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Processed Refunds</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
            {formatCurrency(totalRefunded)}
          </p>
          <p className="text-[11px] text-slate-500">Low return rate (&lt;0.4%)</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Transactions Count</span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            {payments.length}
          </p>
          <p className="text-[11px] text-slate-400">Average transaction size: {formatCurrency(Math.round(totalCaptured / (payments.length || 1)))}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Transaction ID, Guest, Ref..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="completed" className="bg-slate-900">Completed</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="refunded" className="bg-slate-900">Refunded</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Payment Channels</option>
              <option value="Credit Card (Online Stripe)" className="bg-slate-900">Stripe Card</option>
              <option value="Credit Card (POS Terminal)" className="bg-slate-900">POS Terminal</option>
              <option value="Apple Pay" className="bg-slate-900">Apple Pay</option>
              <option value="Wire Transfer" className="bg-slate-900">Wire Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Channel / Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredPayments.map((p) => {
                const bk = bookings.find((b) => b.id === p.bookingId);
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {p.id}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {p.bookingId}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {p.guestName}
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {p.method}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-slate-100 text-sm">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          p.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {p.timestamp}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {bk && (
                          <button
                            onClick={() => viewInvoice(bk)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {p.status === 'completed' && (
                          <button
                            onClick={() => setRefundModalTransaction(p)}
                            className="px-2 py-1 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                            title="Issue Refund"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-400" />
                            <span>Refund</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {refundModalTransaction && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg text-slate-100">Process Merchant Refund</h3>
              <button
                onClick={() => setRefundModalTransaction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">
                Are you sure you want to refund <strong className="text-amber-400">{formatCurrency(refundModalTransaction.amount)}</strong> to <strong className="text-white">{refundModalTransaction.guestName}</strong>?
              </p>
              <p className="text-slate-500">
                This transaction ({refundModalTransaction.id}) will be marked as refunded in the guest folio and merchant ledger.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRefundModalTransaction(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Execute Full Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
