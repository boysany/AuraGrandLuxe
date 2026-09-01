import React, { useState, useEffect, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Crown,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  Bell,
  Menu,
  X,
  Phone,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  BedDouble,
  UtensilsCrossed,
  Tag,
  MapPin,
  Check,
  ChevronRight,
  Home
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    activeHotel,
    hotels,
    setActiveHotelId,
    activePortal,
    setActivePortal,
    customerActiveTab,
    setCustomerActiveTab,
    openBookingWizard,
    userRole,
    setUserRole,
    notifications
  } = useHotel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [hotelDropdownOpen, setHotelDropdownOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const hotelMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (hotelMenuRef.current && !hotelMenuRef.current.contains(event.target as Node)) {
        setHotelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rooms', label: 'Suites', icon: BedDouble },
    { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
    { id: 'services', label: 'Wellness', icon: Sparkles },
    { id: 'offers', label: 'Privileges', icon: Tag },
    { id: 'about', label: 'Heritage', icon: Building2 },
    { id: 'contact', label: 'Concierge', icon: Phone }
  ];

  const roleOptions: { role: UserRole; label: string; badge: string }[] = [
    { role: 'hotel_manager', label: 'General Manager', badge: 'PMS Master' },
    { role: 'super_admin', label: 'Super Admin', badge: 'Cloud Owner' },
    { role: 'hotel_owner', label: 'Hotel Owner', badge: 'Executive' },
    { role: 'receptionist', label: 'Front Desk', badge: 'Front Office' },
    { role: 'housekeeping_staff', label: 'Housekeeping', badge: 'Operations' },
    { role: 'restaurant_manager', label: 'F&B Manager', badge: 'Dining' },
    { role: 'kitchen_staff', label: 'Kitchen Chef', badge: 'KDS' },
    { role: 'maintenance_staff', label: 'Maintenance', badge: 'Engineering' },
    { role: 'accountant', label: 'Accountant', badge: 'Finance' },
    { role: 'customer', label: 'Guest / VIP', badge: 'Guest' }
  ];

  const handleNavClick超越 = (tabId: string) => {
    setActivePortal('customer');
    setCustomerActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const getRoleShortLabel = (role: UserRole) => {
    switch (role) {
      case 'hotel_manager': return 'GM';
      case 'super_admin': return 'Super Admin';
      case 'hotel_owner': return 'Owner';
      case 'receptionist': return 'Reception';
      case 'housekeeping_staff': return 'Housekeeping';
      case 'restaurant_manager': return 'F&B';
      case 'kitchen_staff': return 'Chef';
      case 'maintenance_staff': return 'Engineer';
      case 'accountant': return 'Finance';
      case 'customer': return 'Guest';
      default: return role;
    }
  };

  return (
    <>
      {/* Sleek Top Utility & Property Switcher Bar */}
      <div
        id="top-announcement-bar"
        className="bg-[#05080E] text-slate-400 border-b border-slate-800/80 px-3 sm:px-6 py-1 transition-colors text-[11px]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Luxury Brand / Direct Dial */}
          <div className="flex items-center gap-2.5 truncate min-w-0">
            <span className="inline-flex items-center gap-1 text-[#D4B996] font-medium tracking-wider text-[10px] shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
              <span className="uppercase font-semibold tracking-widest hidden xs:inline">5-Star Verified Sanctuary</span>
              <span className="uppercase font-semibold tracking-widest xs:hidden">5-Star Luxe</span>
            </span>

            <span className="hidden md:inline text-slate-700">|</span>

            <a
              href={`tel:${activeHotel.phone}`}
              className="hidden md:inline-flex items-center gap-1 hover:text-slate-200 transition-colors text-slate-400 text-[10px] truncate"
            >
              <Phone className="w-2.5 h-2.5 text-[#C5A880] shrink-0" />
              <span>{activeHotel.phone}</span>
            </a>
          </div>

          {/* Right: Property, Role & Portal Selectors */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* Quick Hotel Property Switcher */}
            <div className="relative" ref={hotelMenuRef}>
              <button
                id="header-property-select-btn"
                onClick={() => {
                  setHotelDropdownOpen(!hotelDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1 bg-[#0E1524] hover:bg-[#161F30] text-slate-300 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-medium transition-colors"
                title="Switch Hotel Property"
              >
                <span className="text-xs">{activeHotel.logo}</span>
                <span className="max-w-[85px] sm:max-w-[120px] truncate text-slate-200">
                  {activeHotel.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {hotelDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-[#0E1524] border border-slate-700/90 rounded shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                    <span>Portfolio</span>
                    <span className="text-[#D4B996]">{hotels.length} Properties</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/40">
                    {hotels.map((hotel) => (
                      <button
                        key={hotel.id}
                        onClick={() => {
                          setActiveHotelId(hotel.id);
                          setHotelDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-[#161F30] transition-colors ${
                          hotel.id === activeHotel.id ? 'bg-[#C5A880]/15 text-[#D4B996] font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs shrink-0">{hotel.logo}</span>
                          <div className="truncate">
                            <p className="font-medium text-[11px] leading-tight text-slate-200 truncate">{hotel.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">{hotel.city}</p>
                          </div>
                        </div>
                        {hotel.id === activeHotel.id && (
                          <Check className="w-3 h-3 text-[#C5A880] shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role-Based Switcher */}
            <div className="relative" ref={roleMenuRef}>
              <button
                id="header-role-select-btn"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setHotelDropdownOpen(false);
                }}
                className="flex items-center gap-1 bg-[#0E1524] hover:bg-[#161F30] text-slate-300 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-medium transition-colors"
                title="Switch User Role"
              >
                <ShieldCheck className="w-2.5 h-2.5 text-[#C5A880]" />
                <span className="text-slate-300 max-w-[70px] sm:max-w-[90px] truncate">
                  {getRoleShortLabel(userRole)}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-[#0E1524] border border-slate-700/90 rounded shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                    <span>Role Access Simulation</span>
                    <span className="text-[#C5A880]">RBAC</span>
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.role}
                        onClick={() => {
                          setUserRole(opt.role);
                          setRoleDropdownOpen(false);
                          if (opt.role === 'super_admin') {
                            setActivePortal('super_admin');
                          } else if (opt.role === 'customer') {
                            setActivePortal('customer');
                          } else {
                            setActivePortal('admin');
                          }
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-[11px] flex items-center justify-between hover:bg-[#161F30] transition-colors ${
                          opt.role === userRole ? 'bg-[#C5A880]/15 text-[#D4B996] font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span className="truncate pr-1">{opt.label}</span>
                        <span className="text-[8px] bg-slate-800 px-1 py-0.2 rounded text-slate-400 font-mono shrink-0">
                          {opt.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Switcher Segmented Control */}
            <div className="flex items-center bg-[#070B12] p-0.5 rounded border border-slate-800">
              <button
                id="portal-switch-guest-btn"
                onClick={() => setActivePortal('customer')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activePortal === 'customer'
                    ? 'bg-[#C5A880] text-[#080C14] font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Guest
              </button>
              <button
                id="portal-switch-admin-btn"
                onClick={() => setActivePortal('admin')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activePortal === 'admin'
                    ? 'bg-[#1E293B] text-slate-100 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PMS
              </button>
              <button
                id="portal-switch-saas-btn"
                onClick={() => setActivePortal('super_admin')}
                className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  activePortal === 'super_admin'
                    ? 'bg-[#1E293B] text-[#D4B996] font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SaaS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Header Navigation Bar */}
      <header
        id="main-hotel-header"
        className="sticky top-0 z-40 bg-[#070A10]/95 backdrop-blur-md border-b border-slate-800/90 text-white transition-all shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Brand Logo & Heritage Title */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
              onClick={() => handleNavClick超越('home')}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#C5A880] flex items-center justify-center text-[#080C14] shadow-xs font-serif font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform shrink-0">
                {activeHotel.name.charAt(0) || 'V'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-brand-cinzel font-bold text-xs sm:text-sm tracking-wider text-slate-100 uppercase leading-none truncate max-w-[130px] sm:max-w-[180px]">
                    {activeHotel.name.split(' ')[0] || 'VÉRIDIAN'}
                  </span>
                  <span className="text-[8px] uppercase font-semibold tracking-widest text-[#D4B996] border-l border-slate-700 pl-1.5 hidden xs:inline">
                    LUXE
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 tracking-wide font-light flex items-center gap-1 leading-tight truncate">
                  <MapPin className="w-2 h-2 text-[#C5A880] shrink-0" />
                  <span className="truncate">{activeHotel.city}</span>
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
              {navLinks.map((link) => {
                const isActive逗 = customerActiveTab === link.id && activePortal === 'customer';
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick超越(link.id)}
                    className={`relative px-2 xl:px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      isActive逗
                        ? 'text-[#D4B996] bg-[#121926] font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive逗 && (
                      <span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#C5A880] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Notification Bell */}
              <button
                id="header-notification-btn"
                onClick={onOpenNotifications}
                className="relative p-1.5 rounded bg-[#0E1524] hover:bg-[#161F30] text-slate-300 transition-colors border border-slate-700/60"
                title="System Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#C5A880] text-[#080C14] text-[8px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Customer Portal / Account Button */}
              <button
                id="header-my-bookings-btn"
                onClick={() => setActivePortal('customer_dashboard')}
                className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors whitespace-nowrap ${
                  activePortal === 'customer_dashboard'
                    ? 'bg-[#C5A880]/15 text-[#D4B996] border-[#C5A880]/40 font-semibold'
                    : 'bg-[#0E1524] text-slate-300 border-slate-700/60 hover:bg-[#161F30] hover:text-white'
                }`}
              >
                <User className="w-3 h-3 text-[#C5A880]" />
                <span>My Stays</span>
              </button>

              {/* Primary Book Stay CTA */}
              <button
                id="header-book-now-cta"
                onClick={() => openBookingWizard()}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded bg-[#C5A880] hover:bg-[#D4B996] text-[#080C14] font-semibold text-xs tracking-wide transition-all shadow-xs active:scale-95 whitespace-nowrap"
              >
                <Calendar className="w-3 h-3 stroke-[2.5]" />
                <span>Book Stay</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded bg-[#0E1524] text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[88px] bottom-0 z-50 bg-[#070A10]/98 backdrop-blur-xl border-t border-slate-800 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 pb-20">
            <div className="p-3 sm:p-5 space-y-4">
              {/* Hotel Summary Bar */}
              <div className="bg-[#0E1524] p-2.5 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#C5A880] flex items-center justify-center text-[#080C14] font-serif font-bold text-xs shrink-0">
                    {activeHotel.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-semibold text-white truncate">{activeHotel.name}</h4>
                    <p className="text-[9px] text-[#D4B996] truncate">{activeHotel.city}, {activeHotel.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingWizard();
                  }}
                  className="px-2.5 py-1 bg-[#C5A880] text-[#080C14] text-[10px] font-semibold rounded shadow-xs flex items-center gap-1 shrink-0"
                >
                  <span>Reserve</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Navigation Grid */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-1.5">
                  Guest Navigation
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {navLinks.map((link有效) => {
                    const Icon = link有效.icon;
                    const isActive = customerActiveTab === link有效.id && activePortal === 'customer';
                    return (
                      <button
                        key={link有效.id}
                        onClick={() => handleNavClick超越(link有效.id)}
                        className={`flex items-center gap-2 p-2 rounded text-left text-xs transition-colors border ${
                          isActive
                            ? 'bg-[#161F30] border-[#C5A880]/40 text-[#D4B996] font-semibold'
                            : 'bg-[#0E1524] border-slate-800/80 text-slate-300 hover:bg-[#161F30] hover:text-white'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                        <span className="truncate text-[11px]">{link有效.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Portals & Management Quick Links */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 px-1">
                  Management & Portals
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setActivePortal('customer_dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded bg-[#0E1524] hover:bg-[#161F30] border border-slate-800 text-slate-200 text-xs flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#C5A880]" />
                      <div>
                        <p className="font-semibold text-slate-100 text-[11px]">Guest Stays & Account</p>
                        <p className="text-[9px] text-slate-400">View reservations and receipts</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setActivePortal('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded bg-[#0E1524] hover:bg-[#161F30] border border-slate-800 text-slate-200 text-xs flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <p className="font-semibold text-slate-100 text-[11px]">Hotel PMS Administration</p>
                        <p className="text-[9px] text-slate-400">Front Desk & Hotel Operations</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Direct Concierge Call */}
              <div className="bg-[#0E1524] p-2.5 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Concierge Desk</p>
                  <p className="text-[11px] font-mono font-semibold text-slate-200 mt-0.5">{activeHotel.phone}</p>
                </div>
                <a
                  href={`tel:${activeHotel.phone}`}
                  className="px-2.5 py-1 rounded bg-[#161F30] hover:bg-[#1F2A40] text-[#D4B996] text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#C5A880]" />
                  <span>Call Concierge</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Bar (When on Customer Portal) */}
      {activePortal === 'customer' && (
        <div
          id="mobile-sticky-bottom-bar"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070A10]/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around text-slate-400 shadow-2xl text-[9px]"
        >
          <button
            onClick={() => handleNavClick超越('home')}
            className={`flex flex-col items-center gap-0.5 ${
              customerActiveTab === 'home' ? 'text-[#D4B996] font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick超越('rooms')}
            className={`flex flex-col items-center gap-0.5 ${
              customerActiveTab === 'rooms' ? 'text-[#D4B996] font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Suites</span>
          </button>

          {/* Floating Center Book CTA */}
          <button
            onClick={() => openBookingWizard()}
            className="flex flex-col items-center justify-center -mt-3.5 w-10 h-10 rounded-full bg-[#C5A880] text-[#080C14] shadow-md shadow-[#C5A880]/20 active:scale-95 transition-transform"
            title="Book Stay"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={() => handleNavClick超越('dining')}
            className={`flex flex-col items-center gap-0.5 ${
              customerActiveTab === 'dining' ? 'text-[#D4B996] font-semibold' : 'hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Dining</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center gap-0.5 ${
              mobileMenuOpen ? 'text-[#D4B996] font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>Menu</span>
          </button>
        </div>
      )}
    </>
  );
};
