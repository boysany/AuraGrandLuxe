import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BedDouble,
  Plus,
  Edit2,
  Trash2,
  Users,
  Maximize2,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Room, RoomCategory, RoomStatus } from '../../types';

export const RoomManagement: React.FC = () => {
  const {
    rooms,
    addRoom,
    editRoom,
    deleteRoom,
    updateRoomStatus,
    activeHotel,
    formatCurrency
  } = useHotel();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formRoomNumber, setFormRoomNumber] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<RoomCategory>('Deluxe Room');
  const [formPrice, setFormPrice] = useState(750);
  const [formFloor, setFormFloor] = useState(3);
  const [formAdults, setFormAdults] = useState(2);
  const [formBedType, setFormBedType] = useState('1 King Bed');
  const [formSize, setFormSize] = useState(550);
  const [formStatus, setFormStatus] = useState<RoomStatus>('available');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');

  const filteredRooms = rooms.filter((r) => {
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!r.roomNumber.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const openAddModal = () => {
    setEditingRoom(null);
    setFormRoomNumber(`${Math.floor(100 + Math.random() * 900)}`);
    setFormName('Prestige Montaigne Suite');
    setFormCategory('Deluxe Room');
    setFormPrice(820);
    setFormFloor(4);
    setFormAdults(2);
    setFormBedType('1 King Bed');
    setFormSize(600);
    setFormStatus('available');
    setFormDescription('Sumptuous suite with French balconies overlooking gardens.');
    setFormImage('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormRoomNumber(room.roomNumber);
    setFormName(room.name);
    setFormCategory(room.category);
    setFormPrice(room.pricePerNight);
    setFormFloor(room.floor);
    setFormAdults(room.capacity.adults);
    setFormBedType(room.bedType);
    setFormSize(room.sizeSqFt);
    setFormStatus(room.status);
    setFormDescription(room.description);
    setFormImage(room.images[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      editRoom({
        ...editingRoom,
        roomNumber: formRoomNumber,
        name: formName,
        category: formCategory,
        pricePerNight: formPrice,
        floor: formFloor,
        capacity: { adults: formAdults, children: 1 },
        bedType: formBedType,
        sizeSqFt: formSize,
        status: formStatus,
        description: formDescription,
        images: [formImage, ...editingRoom.images.slice(1)]
      });
    } else {
      addRoom({
        hotelId: activeHotel.id,
        roomNumber: formRoomNumber,
        name: formName,
        category: formCategory,
        pricePerNight: formPrice,
        capacity: { adults: formAdults, children: 1 },
        bedType: formBedType,
        sizeSqFt: formSize,
        floor: formFloor,
        view: 'Private Garden & Landmark View',
        status: formStatus,
        description: formDescription,
        amenities: ['High-Speed Wi-Fi', 'Marble Bath', 'Espresso Machine', '24/7 Butler Call'],
        features: ['City Garden View', 'King Bed', 'Soundproof Windows'],
        images: [formImage],
        rating: 5.0,
        reviewCount: 1
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div id="room-management-view" className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            Room Inventory & Fleet Management
          </h1>
          <p className="text-xs text-slate-400">
            Configure room inventory, live housekeeping states, tariffs, and maintenance lockouts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add New Room</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Room number or name..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Categories</option>
              <option value="Standard Room" className="bg-slate-900">Standard Room</option>
              <option value="Deluxe Room" className="bg-slate-900">Deluxe Room</option>
              <option value="Executive Room" className="bg-slate-900">Executive Room</option>
              <option value="Premium Suite" className="bg-slate-900">Premium Suite</option>
              <option value="Presidential Suite" className="bg-slate-900">Presidential Suite</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="available" className="bg-slate-900">🟢 Available</option>
              <option value="occupied" className="bg-slate-900">🔴 Occupied</option>
              <option value="cleaning" className="bg-slate-900">🟡 Housekeeping</option>
              <option value="reserved" className="bg-slate-900">🔵 Reserved</option>
              <option value="maintenance" className="bg-slate-900">⚫ Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {/* Room number pill */}
              <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-amber-400 border border-slate-700 shadow">
                Room #{room.roomNumber}
              </div>

              {/* Status Pill Switcher */}
              <div className="absolute top-3 right-3">
                <select
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value as RoomStatus)}
                  className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 focus:outline-none border shadow-md cursor-pointer ${
                    room.status === 'available'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : room.status === 'occupied'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : room.status === 'cleaning'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : room.status === 'reserved'
                      ? 'bg-blue-950 text-blue-300 border-blue-700'
                      : 'bg-slate-950 text-slate-400 border-slate-700'
                  }`}
                >
                  <option value="available" className="bg-slate-900">🟢 Available</option>
                  <option value="occupied" className="bg-slate-900">🔴 Occupied</option>
                  <option value="cleaning" className="bg-slate-900">🟡 Cleaning</option>
                  <option value="reserved" className="bg-slate-900">🔵 Reserved</option>
                  <option value="maintenance" className="bg-slate-900">⚫ Maintenance</option>
                </select>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Floor {room.floor} • {room.category}
                  </span>
                  <span className="font-serif font-bold text-base text-slate-100">
                    {formatCurrency(room.pricePerNight)}
                    <span className="text-[10px] text-slate-400 font-normal">/nt</span>
                  </span>
                </div>
                <h3 className="font-serif text-base font-medium text-slate-100 leading-snug">
                  {room.name}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px] text-slate-400">
                <span>{room.bedType}</span>
                <span className="text-center">{room.sizeSqFt} sq ft</span>
                <span className="text-right">Max {room.capacity.adults + room.capacity.children} guests</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => openEditModal(room)}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Specifications</span>
                </button>

                <button
                  onClick={() => deleteRoom(room.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-100">
                  {editingRoom ? 'Edit Room Specifications' : 'Add New Palace Room'}
                </h3>
                <p className="text-xs text-slate-400">Manage room configurations and inventory tier</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Room Number *</label>
                  <input
                    type="text"
                    value={formRoomNumber}
                    onChange={(e) => setFormRoomNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Suite Title *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as RoomCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="Standard Room">Standard Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Executive Room">Executive Room</option>
                    <option value="Family Room">Family Room</option>
                    <option value="Premium Suite">Premium Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Rate Per Night ({activeHotel.currencySymbol})</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Floor</label>
                  <input
                    type="number"
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Square Footage (sq ft)</label>
                  <input
                    type="number"
                    value={formSize}
                    onChange={(e) => setFormSize(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Bedding Type</label>
                  <input
                    type="text"
                    value={formBedType}
                    onChange={(e) => setFormBedType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Current State</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RoomStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="occupied">🔴 Occupied</option>
                    <option value="cleaning">🟡 Housekeeping</option>
                    <option value="reserved">🔵 Reserved</option>
                    <option value="maintenance">⚫ Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">High-Res Hero Image URL</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Room Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all"
                >
                  Save Room Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
