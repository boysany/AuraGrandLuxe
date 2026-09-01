import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { InvoiceModal } from './components/common/InvoiceModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Customer Components
import { HeroSection } from './components/customer/HeroSection';
import { RoomsSection } from './components/customer/RoomsSection';
import { HotelDiningSection } from './components/customer/HotelDiningSection';
import { HotelServicesSection } from './components/customer/HotelServicesSection';
import { AboutGalleryContact } from './components/customer/AboutGalleryContact';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { BookingFlowModal } from './components/customer/BookingFlowModal';
import { RoomDetailsModal } from './components/customer/RoomDetailsModal';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { BookingManagement } from './components/admin/BookingManagement';
import { ReservationCalendar } from './components/admin/ReservationCalendar';
import { RoomManagement } from './components/admin/RoomManagement';
import { GuestCRM } from './components/admin/GuestCRM';
import { StaffManagement } from './components/admin/StaffManagement';
import { HousekeepingView } from './components/admin/HousekeepingView';
import { RestaurantPOS } from './components/admin/RestaurantPOS';
import { KitchenDisplay } from './components/admin/KitchenDisplay';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { MaintenanceManagement } from './components/admin/MaintenanceManagement';
import { OffersManagement } from './components/admin/OffersManagement';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { MultiHotelManagement } from './components/admin/MultiHotelManagement';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { AISmartHospitality } from './components/admin/AISmartHospitality';
import { SettingsView } from './components/admin/SettingsView';

const MainAppContent: React.FC = () => {
  const {
    activePortal,
    adminActiveTab,
    isBookingWizardOpen,
    closeBookingWizard,
    activeRoomModal,
    closeRoomModal,
    activeInvoiceBooking,
    closeInvoice
  } = useHotel();

  const [customerSubTab, setCustomerSubTab] = useState<string>('all');
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isAdminNewBookingModalOpen, setIsAdminNewBookingModalOpen] = useState(false);

  // Render Admin / PMS Management Suite
  if (activePortal === 'admin' || activePortal === 'staff') {
    return (
      <>
        <AdminLayout
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onOpenNewBookingModal={() => setIsAdminNewBookingModalOpen(true)}
        >
          {adminActiveTab === 'dashboard' && <DashboardOverview />}
          {adminActiveTab === 'bookings' && (
            <BookingManagement
              isNewBookingModalOpen={isAdminNewBookingModalOpen}
              onCloseNewBookingModal={() => setIsAdminNewBookingModalOpen(!isAdminNewBookingModalOpen)}
            />
          )}
          {adminActiveTab === 'calendar' && <ReservationCalendar />}
          {adminActiveTab === 'rooms' && <RoomManagement />}
          {adminActiveTab === 'guests' && <GuestCRM />}
          {adminActiveTab === 'staff' && <StaffManagement />}
          {adminActiveTab === 'housekeeping' && <HousekeepingView />}
          {adminActiveTab === 'restaurant' && <RestaurantPOS />}
          {adminActiveTab === 'kds' && <KitchenDisplay />}
          {adminActiveTab === 'services' && <HotelServicesSection />}
          {adminActiveTab === 'payments' && <PaymentManagement />}
          {adminActiveTab === 'billing' && <BookingManagement isNewBookingModalOpen={false} onCloseNewBookingModal={() => {}} />}
          {adminActiveTab === 'inventory' && <InventoryManagement />}
          {adminActiveTab === 'maintenance' && <MaintenanceManagement />}
          {adminActiveTab === 'offers' && <OffersManagement />}
          {adminActiveTab === 'analytics' && <ReportsAnalytics />}
          {adminActiveTab === 'multi_hotel' && <MultiHotelManagement />}
          {adminActiveTab === 'ai_smart' && <AISmartHospitality />}
          {adminActiveTab === 'settings' && <SettingsView />}
        </AdminLayout>

        {/* Global Drawers & Modals */}
        <NotificationDrawer
          isOpen={isNotifDrawerOpen}
          onClose={() => setIsNotifDrawerOpen(false)}
        />
        <InvoiceModal
          booking={activeInvoiceBooking}
          onClose={closeInvoice}
        />
      </>
    );
  }

  // Render Super Admin SaaS View
  if (activePortal === 'super_admin') {
    return (
      <>
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
          <SuperAdminDashboard />
        </div>
        <NotificationDrawer
          isOpen={isNotifDrawerOpen}
          onClose={() => setIsNotifDrawerOpen(false)}
        />
      </>
    );
  }

  // Render Customer / Guest Experience Portal
  return (
    <div id="customer-guest-portal" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
      />

      <main className="flex-1">
        {customerSubTab === 'my_bookings' ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <CustomerPortal />
          </div>
        ) : (
          <>
            <HeroSection />
            <RoomsSection />
            <HotelDiningSection />
            <HotelServicesSection />
            <AboutGalleryContact activeSubTab={customerSubTab} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <CustomerPortal />
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Interactive Global Modals */}
      {isBookingWizardOpen && <BookingFlowModal onClose={closeBookingWizard} />}
      {activeRoomModal && (
        <RoomDetailsModal room={activeRoomModal} onClose={closeRoomModal} />
      )}
      <InvoiceModal
        booking={activeInvoiceBooking}
        onClose={closeInvoice}
      />
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainAppContent />
    </HotelProvider>
  );
}
