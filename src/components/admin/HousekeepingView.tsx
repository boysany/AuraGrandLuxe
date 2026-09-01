import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Filter,
  CheckSquare,
  Square,
  ShieldCheck
} from 'lucide-react';
import { HousekeepingTask } from '../../types';

export const HousekeepingView: React.FC = () => {
  const {
    housekeepingTasks,
    updateHousekeepingStatus,
    toggleHousekeepingChecklistItem,
    staff,
    rooms
  } = useHotel();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = housekeepingTasks.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    return true;
  });

  const pendingCount = housekeepingTasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = housekeepingTasks.filter((t) => t.status === 'in_progress').length;
  const inspectedCount = housekeepingTasks.filter((t) => t.status === 'inspected').length;

  return (
    <div id="housekeeping-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Housekeeping & Cleanliness Operations
          </h1>
          <p className="text-xs text-slate-400">
            Monitor room turnover cycles, deep sanitization checklists, and 5-star supervisor inspections.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300">{pendingCount} Pending</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-300">{inProgressCount} In Progress</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">{inspectedCount} Inspected Clean</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Task Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="inspected">Inspected (Ready)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Priority Tier:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="VIP Arrival">VIP Arrival</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => {
          const completedChecks = task.checklist.filter((c) => c.done).length;
          const totalChecks = task.checklist.length;
          const progressPct = Math.round((completedChecks / (totalChecks || 1)) * 100);

          return (
            <div
              key={task.id}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div>
                {/* Card Top Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-slate-950 px-2.5 py-1 rounded-xl text-amber-400 border border-slate-800">
                      Room {task.roomNumber}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.priority === 'urgent' || task.priority === 'high' || task.priority === 'VIP Arrival'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <select
                    value={task.status}
                    onChange={(e) => updateHousekeepingStatus(task.id, e.target.value as any)}
                    className={`text-[10px] font-bold uppercase rounded-lg px-2 py-1 focus:outline-none border cursor-pointer ${
                      task.status === 'inspected'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : task.status === 'completed'
                        ? 'bg-blue-950 text-blue-300 border-blue-700'
                        : task.status === 'in_progress'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-slate-950 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="pending" className="bg-slate-900">Pending</option>
                    <option value="in_progress" className="bg-slate-900">In Progress</option>
                    <option value="completed" className="bg-slate-900">Completed</option>
                    <option value="inspected" className="bg-slate-900">Inspected Clean</option>
                  </select>
                </div>

                <h3 className="font-serif text-base font-medium text-slate-100 mb-1">
                  {task.type}
                </h3>
                <p className="text-xs text-slate-400 font-light mb-3">
                  Assigned to: <strong className="text-slate-200">{task.assignedStaffName || task.assignedTo || 'Housekeeping Crew'}</strong>
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Cleanliness Progress</span>
                    <span>{completedChecks}/{totalChecks} ({progressPct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Checklist Items */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Sanitization Checklist:
                  </p>
                  <div className="space-y-1.5 text-xs">
                    {task.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleHousekeepingChecklistItem(task.id, idx)}
                        className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors select-none"
                      >
                        {item.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-[11px] ${item.done ? 'line-through text-slate-500' : ''}`}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <span className="text-[10px] text-slate-500">Scheduled: {task.scheduledTime || task.dueDate || 'Today'}</span>
                {task.status !== 'inspected' ? (
                  <button
                    onClick={() => updateHousekeepingStatus(task.id, 'inspected')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 shadow"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Pass Inspection</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Suite Ready for Guest
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
