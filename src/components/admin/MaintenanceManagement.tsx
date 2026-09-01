import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Wrench,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  DollarSign
} from 'lucide-react';
import { MaintenanceTicket } from '../../types';

export const MaintenanceManagement: React.FC = () => {
  const {
    maintenanceTickets,
    createMaintenanceTicket,
    updateMaintenanceStatus,
    rooms,
    activeHotel,
    formatCurrency
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New ticket form
  const [roomNumber, setRoomNumber] = useState('101');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [assignedTo, setAssignedTo] = useState('Michel Dubois (HVAC Eng)');
  const [estimatedCost, setEstimatedCost] = useState(150);

  const filteredTickets = maintenanceTickets.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createMaintenanceTicket({
      hotelId: activeHotel.id,
      roomNumber,
      issue,
      priority,
      status: 'pending',
      assignedTo,
      estimatedCost
    });
    setIsAddModalOpen(false);
    setIssue('');
  };

  return (
    <div id="maintenance-management-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Engineering & Facility Maintenance
          </h1>
          <p className="text-xs text-slate-400">
            Work order tracking for HVAC, marble restoration, electrical, plumbing, and pool engineering.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Create Work Order</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 text-xs">
        <span className="text-slate-400 font-medium">Work Order Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl focus:outline-none"
        >
          <option value="All">All Work Orders</option>
          <option value="pending">Pending Dispatch</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed / Signed Off</option>
        </select>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-950 px-2.5 py-1 rounded-lg text-amber-400 border border-slate-800">
                    Room {ticket.roomNumber}
                  </span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      ticket.priority === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : ticket.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <select
                  value={ticket.status}
                  onChange={(e) => updateMaintenanceStatus(ticket.id, e.target.value as any)}
                  className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 focus:outline-none border cursor-pointer ${
                    ticket.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : ticket.status === 'in_progress'
                      ? 'bg-blue-950 text-blue-300 border-blue-700'
                      : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}
                >
                  <option value="pending" className="bg-slate-900">Pending</option>
                  <option value="in_progress" className="bg-slate-900">In Progress</option>
                  <option value="completed" className="bg-slate-900">Completed</option>
                </select>
              </div>

              <h3 className="font-semibold text-slate-100 text-sm mb-2">{ticket.issue}</h3>
              <p className="text-xs text-slate-400">
                Assigned Engineer: <strong className="text-slate-200">{ticket.assignedTo}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Reported: {ticket.createdAt}</span>
              {ticket.estimatedCost && (
                <span className="font-mono text-amber-400 font-bold">
                  Cost: {formatCurrency(ticket.estimatedCost)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Maintenance Ticket Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-100">Create Engineering Work Order</h3>
                <p className="text-xs text-slate-400">Dispatch technician for repair or preventative maintenance</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Suite / Facility</label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.name})
                      </option>
                    ))}
                    <option value="Spa Pavilion">Spa Pavilion Pool</option>
                    <option value="Michelin Kitchen">Michelin Kitchen Hood</option>
                    <option value="Elevator #2">East Wing Palace Elevator</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Priority Severity</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Immediate)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Work Order Description *</label>
                <textarea
                  rows={3}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe the electrical, plumbing, or climate issue..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Assigned Technician</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Estimated Repair Cost ({activeHotel.currencySymbol})</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
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
                  Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
