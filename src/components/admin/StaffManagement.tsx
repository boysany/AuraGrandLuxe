import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Shield,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { StaffMember, UserRole } from '../../types';

export const StaffManagement: React.FC = () => {
  const { staff, addStaff, activeHotel, formatCurrency } = useHotel();
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New staff form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('receptionist');
  const [department, setDepartment] = useState('Front Desk');
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [salary, setSalary] = useState(3800);

  const filteredStaff = staff.filter((s) => {
    if (deptFilter !== 'All' && s.department !== deptFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({
      hotelId: activeHotel.id,
      name,
      email,
      phone,
      role,
      department,
      shift,
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      joinedDate: new Date().toISOString().split('T')[0],
      salary,
      monthlySalary: salary,
      rating: 5.0,
      assignedTasksCount: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div id="staff-management-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Staff Roster & Shift Scheduling
          </h1>
          <p className="text-xs text-slate-400">
            Manage front desk, butlers, culinary teams, housekeeping, and engineering schedules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff by name, department, role..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Departments</option>
            <option value="Executive Management" className="bg-slate-900">Executive Management</option>
            <option value="Front Desk & Concierge" className="bg-slate-900">Front Desk & Concierge</option>
            <option value="Housekeeping" className="bg-slate-900">Housekeeping</option>
            <option value="Food & Beverage" className="bg-slate-900">Food & Beverage</option>
            <option value="Engineering & Facilities" className="bg-slate-900">Engineering</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div
            key={member.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400/40"
                />
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">{member.name}</h3>
                  <p className="text-[11px] text-amber-400 font-medium capitalize">
                    {member.role.replace('_', ' ')}
                  </p>
                  <p className="text-[10px] text-slate-500">{member.department}</p>
                </div>
              </div>

              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  member.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {member.status}
              </span>
            </div>

            <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{member.shift} Shift</span>
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {formatCurrency(member.salary)}/mo
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Hired: {member.joiningDate}</span>
              <span className="text-emerald-400 font-semibold">100% Attendance</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full border border-slate-800 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-100">Add Palace Staff Member</h3>
                <p className="text-xs text-slate-400">Onboard employee into PMS shift roster</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="housekeeping_staff">Housekeeper</option>
                    <option value="restaurant_manager">F&B Manager</option>
                    <option value="kitchen_staff">Chef</option>
                    <option value="maintenance_staff">Technician</option>
                    <option value="hotel_manager">Hotel Manager</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option>Front Desk & Concierge</option>
                    <option>Housekeeping</option>
                    <option>Food & Beverage</option>
                    <option>Engineering & Facilities</option>
                    <option>Executive Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Shift Timing</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="Morning">Morning (06:00 - 15:00)</option>
                    <option value="Evening">Evening (14:00 - 23:00)</option>
                    <option value="Night">Night (22:00 - 07:00)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Monthly Compensation ({activeHotel.currencySymbol})</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
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
                  Confirm Staff Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
