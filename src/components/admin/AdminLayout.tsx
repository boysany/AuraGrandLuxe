import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Crown,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  BedDouble,
  Users,
  UserCheck,
  Sparkles,
  Utensils,
  ChefHat,
  CreditCard,
  FileText,
  Package,
  Wrench,
  Tag,
  BarChart3,
  Building2,
  Bot,
  Settings,
  ShieldCheck,
  Bell,
  Plus,
  ChevronDown,
  Globe,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { UserRole } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  onOpenNotifications: () => void;
  onOpenNewBookingModal: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  onOpenNotifications,
  onOpenNewBookingModal
}) => {
  const {
    activeHotel,
    hotels,
    setActiveHotelId,
    adminActiveTab,
    setAdminActiveTab,
    setActivePortal,
    userRole,
    setUserRole,
    notifications,
    bookings,
    rooms,
    housekeepingTasks,
    maintenanceTickets,
    restaurantOrders
  } = useHotel();

  const [hotelMenuOpen, setHotelMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingCleanings = housekeepingTasks.filter((t) => t.status !== 'completed' && t.status !== 'inspected').length;
  const activeTickets = maintenanceTickets.filter((t) => t.status !== 'completed').length;
  const pendingOrders = restaurantOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const navSections = [
    {
      heading: 'Front Desk',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Calendar, badge: bookings.length },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
        { id: 'rooms', label: 'Rooms & Rates', icon: BedDouble, badge: rooms.filter((r) => r.status === 'occupied').length ? `${rooms.filter((r) => r.status === 'occupied').length} Occ` : undefined },
        { id: 'guests', label: 'Guest CRM', icon: Users }
      ]
    },
    {
      heading: 'Operations',
      items: [
        { id: 'staff', label: 'Staff Roster', icon: UserCheck },
        { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles, badge: pendingCleanings > 0 ? pendingCleanings : undefined },
        { id: 'restaurant', label: 'Restaurant POS', icon: Utensils },
        { id: 'kds', label: 'Kitchen KDS', icon: ChefHat, badge: pendingOrders > 0 ? pendingOrders : undefined },
        { id: 'services', label: 'Concierge', icon: Crown }
      ]
    },
    {
      heading: 'Finance & Supply',
      items: [
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'billing', label: 'Invoices & Tax', icon: FileText },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: activeTickets > 0 ? activeTickets : undefined },
        { id: 'offers', label: 'Promotions', icon: Tag },
        { id: 'analytics', label: 'Analytics BI', icon: BarChart3 }
      ]
    },
    {
      heading: 'Enterprise',
      items: [
        { id: 'multi_hotel', label: 'Multi-Hotel', icon: Building2 },
        { id: 'ai_smart', label: 'AI Smart Concierge', icon: Bot },
        { id: 'super_admin', label: 'SaaS Platform Admin', icon: ShieldCheck },
        { id: 'settings', label: 'Hotel Settings', icon: Settings }
      ]
    }
  ];

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'hotel_manager', label: 'General Manager' },
    { role: 'super_admin', label: 'Super Admin' },
    { role: 'hotel_owner', label: 'Hotel Owner' },
    { role: 'receptionist', label: 'Front Desk' },
    { role: 'housekeeping_staff', label: 'Housekeeper' },
    { role: 'restaurant_manager', label: 'F&B Manager' },
    { role: 'kitchen_staff', label: 'Executive Chef' },
    { role: 'maintenance_staff', label: 'Chief Engineer' },
    { role: 'accountant', label: 'Accountant' }
  ];

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'super_admin') {
      setActivePortal('super_admin');
    } else {
      setAdminActiveTab(tabId);
    }
    setMobileSidebarOpen(false);
  };

  return (
    <div id="admin-pms-layout" className="min-h-screen bg-[#080C14] flex flex-col md:flex-row text-slate-100 font-sans">
      {/* Desktop Persistent Sidebar */}
      <aside
        id="admin-sidebar"
        className={`hidden md:flex ${
          sidebarCollapsed ? 'w-14' : 'w-60 lg:w-64'
        } bg-[#0A0E17] border-r border-slate-800/90 flex-col shrink-0 transition-all duration-150 z-30 sticky top-0 h-screen`}
      >
        {/* Brand Crest & Property Selector */}
        <div className="p-3 border-b border-slate-800/90">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-2 overflow-hidden min-w-0">
              <div className="h-7 w-7 rounded bg-[#C5A880] flex items-center justify-center text-[#080C14] font-serif font-bold text-xs shadow-xs shrink-0">
                {activeHotel.name.charAt(0) || 'V'}
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden truncate">
                  <div className="flex items-center gap-1">
                    <h1 className="text-xs font-bold tracking-wider text-slate-100 uppercase font-brand-cinzel truncate">
                      {activeHotel.name.split(' ')[0] || 'VÉRIDIAN'}
                    </h1>
                    <span className="text-[8px] uppercase tracking-wider text-[#D4B996] font-semibold bg-[#C5A880]/15 px-1 py-0.2 rounded border border-[#C5A880]/30 shrink-0">
                      PMS
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-normal truncate">Enterprise Hospitality</p>
                </div>
              )}
            </div>

            {/* Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#161F30] transition-colors shrink-0"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Hotel Property Dropdown */}
          {!sidebarCollapsed && (
            <div className="relative">
              <button
                onClick={() => setHotelMenuOpen(!hotelMenuOpen)}
                className="w-full bg-[#111827] hover:bg-[#161F30] border border-slate-800 rounded p-1.5 flex items-center justify-between text-xs text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate min-w-0">
                  <span className="text-xs shrink-0">{activeHotel.logo}</span>
                  <div className="text-left truncate">
                    <p className="font-medium text-slate-100 text-[11px] truncate leading-tight">{activeHotel.name}</p>
                    <p className="text-[9px] text-slate-400 truncate">{activeHotel.city}</p>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
              </button>

              {hotelMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#111827] border border-slate-700/80 rounded shadow-xl py-1 z-50">
                  {hotels.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setActiveHotelId(h.id);
                        setHotelMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        h.id === activeHotel.id ? 'bg-[#C5A880]/15 text-[#D4B996] font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs">{h.logo}</span>
                        <span className="truncate text-[11px]">{h.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">{h.currency}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-2.5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-0.5">
              {!sidebarCollapsed && (
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-0.5">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = adminActiveTab === item.id;
                const isSuperAdmin = item.id === 'super_admin';
                return (
                  <button
                    key={item.id}
                    id={`sidebar-link-${item.id}`}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1E293B] text-white shadow-xs border-l-2 border-[#C5A880]'
                        : isSuperAdmin
                        ? 'text-[#D4B996] hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C5A880]' : isSuperAdmin ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                      {!sidebarCollapsed && (
                        <span className={`truncate text-[11px] ${isActive ? 'text-white font-semibold' : ''}`}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded font-mono font-medium shrink-0 ml-1 ${
                          isActive
                            ? 'bg-[#C5A880] text-[#080C14] font-bold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Role Switcher & User Profile Card */}
        <div className="p-2.5 border-t border-slate-800/90 space-y-1.5 bg-[#070B12]">
          {!sidebarCollapsed && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="w-full bg-[#0E1524] hover:bg-[#161F30] border border-slate-800 p-1.5 rounded text-xs flex items-center justify-between text-slate-300"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3 h-3 text-[#C5A880] shrink-0" />
                  <span className="capitalize text-[10px] font-medium truncate">{userRole.replace('_', ' ')}</span>
                </div>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400 shrink-0 ml-1" />
              </button>

              {roleMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#111827] border border-slate-700 rounded shadow-xl py-1 z-50 max-h-48 overflow-y-auto">
                  {roleOptions.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setUserRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 text-[11px] ${
                        r.role === userRole ? 'bg-[#C5A880]/20 text-[#D4B996] font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Switch to Guest View */}
          <button
            onClick={() => setActivePortal('customer')}
            className="w-full py-1.5 px-2 rounded bg-[#0E1524] hover:bg-[#161F30] text-[#D4B996] text-[11px] font-medium flex items-center justify-center gap-1.5 border border-[#C5A880]/30 transition-colors"
            title="Open Guest View"
          >
            <Globe className="w-3 h-3 text-[#C5A880]" />
            {!sidebarCollapsed && <span>Guest View</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sliding Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-[#0A0E17] border-r border-slate-800 flex flex-col h-full overflow-y-auto animate-in slide-in-from-left duration-150">
            {/* Drawer Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded bg-[#C5A880] flex items-center justify-center text-[#080C14] font-serif font-bold text-xs shrink-0">
                  {activeHotel.name.charAt(0)}
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-slate-100 truncate">{activeHotel.name}</h3>
                  <p className="text-[9px] text-[#D4B996]">PMS Operations</p>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded bg-[#161F30] text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-0.5">
                    {section.heading}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminActiveTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? 'bg-[#1E293B] text-[#D4B996] font-semibold border-l-2 border-[#C5A880]'
                            : 'text-slate-300 hover:bg-[#161F30]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                          <span className="text-[11px] truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono shrink-0 ml-1">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Switch to Guest Portal */}
            <div className="p-2.5 border-t border-slate-800 bg-[#070B12]">
              <button
                onClick={() => {
                  setActivePortal('customer');
                  setMobileSidebarOpen(false);
                }}
                className="w-full py-1.5 px-2.5 rounded bg-[#161F30] text-[#D4B996] text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-[#C5A880]/30"
              >
                <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Switch to Guest Website</span>
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Management Bar */}
        <header className="bg-[#0A0E17] border-b border-slate-800/90 px-3 sm:px-5 h-12 flex items-center justify-between gap-2.5 sticky top-0 z-20 shadow-xs">
          {/* Header Title & Mobile Hamburger Button */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1 rounded bg-[#161F30] text-slate-300 hover:text-white border border-slate-700/60"
              title="Open Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>

            <div className="truncate">
              <h2 className="font-serif text-xs sm:text-sm text-slate-100 font-semibold tracking-tight truncate max-w-[130px] sm:max-w-none">
                {activeHotel.name}
              </h2>
            </div>

            <span className="hidden sm:inline-flex rounded bg-emerald-950/60 px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-800/50">
              Live
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Walk-in Reservation CTA */}
            <button
              id="admin-quick-new-booking-btn"
              onClick={onOpenNewBookingModal}
              className="flex h-7 items-center gap-1 rounded bg-[#C5A880] hover:bg-[#D4B996] px-2 sm:px-2.5 text-[11px] font-semibold text-[#080C14] transition-colors shadow-xs"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span className="hidden xs:inline">New Booking</span>
              <span className="xs:hidden">New</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1 rounded bg-[#161F30] border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="System Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C5A880] text-[#080C14] text-[8px] font-bold flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 bg-[#080C14] pb-14 md:pb-5">
          {children}
        </main>

        {/* Mobile Quick Bottom Navigation for Admin */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A0E17] border-t border-slate-800 px-2 py-1 flex items-center justify-around text-slate-400 shadow-2xl text-[9px]">
          <button
            onClick={() => handleSelectTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 ${adminActiveTab === 'dashboard' ? 'text-[#D4B996] font-semibold' : ''}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleSelectTab('bookings')}
            className={`flex flex-col items-center gap-0.5 ${adminActiveTab === 'bookings' ? 'text-[#D4B996] font-semibold' : ''}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookings</span>
          </button>

          <button
            onClick={() => handleSelectTab('rooms')}
            className={`flex flex-col items-center gap-0.5 ${adminActiveTab === 'rooms' ? 'text-[#D4B996] font-semibold' : ''}`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Rooms</span>
          </button>

          <button
            onClick={() => handleSelectTab('housekeeping')}
            className={`flex flex-col items-center gap-0.5 ${adminActiveTab === 'housekeeping' ? 'text-[#D4B996] font-semibold' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 text-slate-300"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
