import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { InventoryItem } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { inventory, restockInventory, activeHotel, formatCurrency } = useHotel();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState(25);

  const categories = ['All', 'F&B Supplies', 'Toiletries & Amenities', 'Linens & Bedding', 'Cleaning & Sanitization'];

  const filteredInventory = inventory.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;
  const totalValuation = inventory.reduce((acc, i) => acc + i.currentStock * i.costPerUnit, 0);

  const handleExecuteRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockModalItem) {
      restockInventory(restockModalItem.id, restockAmount);
      setRestockModalItem(null);
    }
  };

  return (
    <div id="inventory-management-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Hotel Inventory & Supplies Procurement
          </h1>
          <p className="text-xs text-slate-400">
            Monitor amenities, Grand Cru cellar reserves, Egyptian cotton linens, and housekeeping chemicals.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">Inventory Asset Value:</span>
            <span className="font-serif font-bold text-slate-100">{formatCurrency(totalValuation)}</span>
          </div>

          {lowStockCount > 0 && (
            <div className="bg-rose-500/15 border border-rose-500/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-rose-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowStockCount} Items Low Stock</span>
            </div>
          )}
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
            placeholder="Search supplies by name, supplier..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => {
          const isLowStock = item.currentStock <= item.minThreshold;
          const stockHealthPct = Math.min(100, Math.round((item.currentStock / (item.minThreshold * 2.5)) * 100));

          return (
            <div
              key={item.id}
              className={`bg-slate-900 rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                isLowStock ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                  {isLowStock ? (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold uppercase flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Reorder Alert
                    </span>
                  ) : (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                      Stock Healthy
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-slate-100 text-sm mb-1">{item.name}</h3>
                <p className="text-[11px] text-slate-400">Supplier: {item.supplier}</p>
              </div>

              {/* Stock Bar */}
              <div className="space-y-1.5 py-3 border-y border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Current Stock:</span>
                  <span className="font-bold text-slate-100 font-mono">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isLowStock ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                    }`}
                    style={{ width: `${stockHealthPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Threshold Min: {item.minThreshold}</span>
                  <span>Unit Cost: {formatCurrency(item.costPerUnit)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Last: {item.lastRestocked}</span>
                <button
                  onClick={() => {
                    setRestockModalItem(item);
                    setRestockAmount(item.minThreshold * 2);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Procure Restock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restock Purchase Order Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg text-slate-100">Issue Restock Purchase Order</h3>
              <button
                onClick={() => setRestockModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteRestock} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <p className="font-semibold text-slate-100">{restockModalItem.name}</p>
                <p className="text-slate-400">Supplier: {restockModalItem.supplier}</p>
                <p className="text-amber-400 font-mono">Current on hand: {restockModalItem.currentStock} {restockModalItem.unit}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">
                  Restock Quantity ({restockModalItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400">Estimated PO Cost:</span>
                <span className="font-serif font-bold text-amber-400 text-sm">
                  {formatCurrency(restockAmount * restockModalItem.costPerUnit)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Confirm Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
