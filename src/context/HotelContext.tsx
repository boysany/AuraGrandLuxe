import React, { createContext, useContext, useState } from 'react';
import {
  HotelProperty,
  Room,
  GuestProfile,
  Booking,
  StaffMember,
  HousekeepingTask,
  MenuItem,
  RestaurantOrder,
  RestaurantTable,
  InventoryItem,
  MaintenanceTicket,
  Coupon,
  ExtraServiceItem,
  NotificationItem,
  TransactionRecord,
  UserRole,
  RoomStatus,
  BookingStatus,
  PaymentStatus,
  RoomCategory
} from '../types';
import {
  INITIAL_HOTELS,
  INITIAL_ROOMS,
  INITIAL_GUESTS,
  INITIAL_BOOKINGS,
  INITIAL_STAFF,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_MENU_ITEMS,
  INITIAL_RESTAURANT_ORDERS,
  INITIAL_TABLES,
  INITIAL_INVENTORY,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_COUPONS,
  INITIAL_EXTRA_SERVICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';

export interface BookingSearchParams {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomsCount: number;
  roomCategory: string;
}

interface HotelContextType {
  hotels: HotelProperty[];
  activeHotelId: string;
  activeHotel: HotelProperty;
  setActiveHotelId: (id: string) => void;
  
  rooms: Room[];
  bookings: Booking[];
  guests: GuestProfile[];
  staff: StaffMember[];
  housekeepingTasks: HousekeepingTask[];
  menuItems: MenuItem[];
  restaurantOrders: RestaurantOrder[];
  tables: RestaurantTable[];
  inventory: InventoryItem[];
  maintenanceTickets: MaintenanceTicket[];
  coupons: Coupon[];
  extraServices: ExtraServiceItem[];
  notifications: NotificationItem[];
  transactions: TransactionRecord[];
  payments: TransactionRecord[];

  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  activePortal: 'customer' | 'admin' | 'super_admin' | 'customer_dashboard' | 'staff';
  setActivePortal: (portal: 'customer' | 'admin' | 'super_admin' | 'customer_dashboard' | 'staff') => void;

  customerActiveTab: string;
  setCustomerActiveTab: (tab: string) => void;

  adminActiveTab: string;
  setAdminActiveTab: (tab: string) => void;

  searchParams: BookingSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<BookingSearchParams>>;

  selectedRoomForDetails: Room | null;
  setSelectedRoomForDetails: (room: Room | null) => void;
  activeRoomModal: Room | null;
  closeRoomModal: () => void;

  selectedRoomForBooking: Room | null;
  setSelectedRoomForBooking: (room: Room | null) => void;

  bookingWizardOpen: boolean;
  isBookingWizardOpen: boolean;
  openBookingWizard: (room?: Room) => void;
  closeBookingWizard: () => void;

  invoiceModalOpen: boolean;
  currentInvoiceBooking: Booking | null;
  activeInvoiceBooking: Booking | null;
  viewInvoice: (booking: Booking) => void;
  closeInvoice: () => void;

  // Actions
  createBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  editRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addGuest: (guest: Omit<GuestProfile, 'id'>) => GuestProfile;
  updateGuestNotes: (guestId: string, notes: string) => void;
  addStaff: (staff: Omit<StaffMember, 'id'>) => void;
  updateStaffStatus: (staffId: string, status: 'active' | 'on_leave' | 'off_duty') => void;
  addHousekeepingTask: (task: Omit<HousekeepingTask, 'id'>) => void;
  updateHousekeepingStatus: (taskId: string, status: HousekeepingTask['status']) => void;
  toggleHousekeepingChecklistItem: (taskId: string, itemIndex: number) => void;
  createRestaurantOrder: (order: Omit<RestaurantOrder, 'id' | 'orderNumber' | 'createdAt'>) => RestaurantOrder;
  updateOrderStatus: (orderId: string, status: RestaurantOrder['status']) => void;
  updateInventoryQuantity: (itemId: string, newQty: number) => void;
  restockInventory: (itemId: string, addQty: number) => void;
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  createMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'createdAt'>) => void;
  updateMaintenanceStatus: (ticketId: string, status: MaintenanceTicket['status'], cost?: number) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCouponActive: (couponId: string) => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  refundTransaction: (txnId: string) => void;
  processRefund: (txnId: string) => void;
  applyCouponCode: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string; coupon?: Coupon };
  updateHotelSubscription: (hotelId: string, plan: 'starter' | 'professional' | 'enterprise') => void;
  addHotelProperty: (hotel: Omit<HotelProperty, 'id' | 'activeBookingsCount' | 'occupancyRate' | 'monthlyRevenue'>) => void;
  addHotel: (hotel: Omit<HotelProperty, 'id' | 'activeBookingsCount' | 'occupancyRate' | 'monthlyRevenue'>) => void;
  updateHotelStatus: (hotelId: string, status: 'active' | 'pending' | 'suspended') => void;
  formatCurrency: (amount: number) => string;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotels, setHotels] = useState<HotelProperty[]>(INITIAL_HOTELS);
  const [activeHotelId, setActiveHotelId] = useState<string>('hotel-paris');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [guests, setGuests] = useState<GuestProfile[]>(INITIAL_GUESTS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(INITIAL_HOUSEKEEPING_TASKS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>(INITIAL_RESTAURANT_ORDERS);
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(INITIAL_MAINTENANCE_TICKETS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [extraServices] = useState<ExtraServiceItem[]>(INITIAL_EXTRA_SERVICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  const [userRole, setUserRole] = useState<UserRole>('hotel_manager');
  const [activePortal, setActivePortal] = useState<'customer' | 'admin' | 'super_admin' | 'customer_dashboard' | 'staff'>('customer');
  const [customerActiveTab, setCustomerActiveTab] = useState<string>('home');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('dashboard');

  const [searchParams, setSearchParams] = useState<BookingSearchParams>({
    checkInDate: '2026-09-01',
    checkOutDate: '2026-09-05',
    adults: 2,
    children: 0,
    roomsCount: 1,
    roomCategory: 'All Categories'
  });

  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [bookingWizardOpen, setBookingWizardOpen] = useState<boolean>(false);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [currentInvoiceBooking, setCurrentInvoiceBooking] = useState<Booking | null>(null);

  const activeHotel = hotels.find((h) => h.id === activeHotelId) || hotels[0];

  const formatCurrency = (amount: number) => {
    return `${activeHotel.currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const openBookingWizard = (room?: Room) => {
    if (room) {
      setSelectedRoomForBooking(room);
    } else if (rooms.length > 0) {
      setSelectedRoomForBooking(rooms[0]);
    }
    setBookingWizardOpen(true);
  };

  const closeBookingWizard = () => {
    setBookingWizardOpen(false);
  };

  const viewInvoice = (booking: Booking) => {
    setCurrentInvoiceBooking(booking);
    setInvoiceModalOpen(true);
  };

  const closeInvoice = () => {
    setInvoiceModalOpen(false);
    setCurrentInvoiceBooking(null);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const createBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: bookingId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Create corresponding transaction if paid
    if (newBooking.paymentStatus === 'paid') {
      const newTxn: TransactionRecord = {
        id: `TXN-${Math.floor(9000 + Math.random() * 9000)}`,
        hotelId: newBooking.hotelId,
        bookingId: newBooking.id,
        guestName: newBooking.guestName,
        amount: newBooking.totalAmount,
        method: newBooking.paymentMethod,
        status: 'paid',
        date: newBooking.createdAt,
        referenceNumber: `AUTH_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        invoiceNumber: `INV-2026-00${Math.floor(100 + Math.random() * 900)}`
      };
      setTransactions((prev) => [newTxn, ...prev]);
    }

    // Update room status
    setRooms((prev) =>
      prev.map((r) =>
        r.id === newBooking.roomId ? { ...r, status: 'reserved' } : r
      )
    );

    // Also update guest spend
    setGuests((prev) => {
      const existing = prev.find((g) => g.email.toLowerCase() === newBooking.guestEmail.toLowerCase());
      if (existing) {
        return prev.map((g) =>
          g.id === existing.id
            ? {
                ...g,
                totalBookings: g.totalBookings + 1,
                totalSpent: g.totalSpent + newBooking.totalAmount,
                loyaltyPoints: g.loyaltyPoints + Math.floor(newBooking.totalAmount * 0.1)
              }
            : g
        );
      } else {
        const newGuest: GuestProfile = {
          id: `guest-${Date.now()}`,
          name: newBooking.guestName,
          email: newBooking.guestEmail,
          phone: newBooking.guestPhone,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          category: 'New Guest',
          address: newBooking.guestAddress || 'International Guest',
          city: 'Paris',
          country: newBooking.guestCountry || 'France',
          idDocumentNumber: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          idDocumentType: 'Passport',
          totalBookings: 1,
          totalSpent: newBooking.totalAmount,
          loyaltyPoints: Math.floor(newBooking.totalAmount * 0.1),
          loyaltyTier: 'Silver',
          preferences: ['Non-smoking room', 'Quiet area'],
          notes: 'Booked via Online Booking Portal.',
          memberSince: new Date().toISOString().split('T')[0]
        };
        return [newGuest, ...prev];
      }
    });

    addNotification(
      'New Reservation Confirmed',
      `${newBooking.guestName} booked ${newBooking.roomName} (${formatCurrency(newBooking.totalAmount)}).`,
      'booking'
    );

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, bookingStatus: status };
          if (status === 'checked_in') {
            updateRoomStatus(b.roomId, 'occupied');
            addNotification('Guest Check-in', `${b.guestName} has checked into Room ${b.roomNumber}.`, 'guest');
          } else if (status === 'checked_out') {
            updateRoomStatus(b.roomId, 'cleaning');
            addNotification('Guest Check-out', `Room ${b.roomNumber} vacated by ${b.guestName}. Housekeeping notified.`, 'housekeeping');
          }
          return updated;
        }
        return b;
      })
    );
  };

  const updateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status } : r))
    );
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    setRooms((prev) => [...prev, newRoom]);
    addNotification('New Room Added', `Room ${newRoom.roomNumber} (${newRoom.category}) added to inventory.`, 'inventory');
  };

  const editRoom = (updatedRoom: Room) => {
    setRooms((prev) => prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)));
  };

  const deleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const addGuest = (guestData: Omit<GuestProfile, 'id'>) => {
    const newGuest: GuestProfile = {
      ...guestData,
      id: `guest-${Date.now()}`
    };
    setGuests((prev) => [newGuest, ...prev]);
    return newGuest;
  };

  const updateGuestNotes = (guestId: string, notes: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, notes } : g))
    );
  };

  const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `stf-${Date.now()}`
    };
    setStaff((prev) => [...prev, newStaff]);
  };

  const updateStaffStatus = (staffId: string, status: 'active' | 'on_leave' | 'off_duty') => {
    setStaff((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status } : s))
    );
  };

  const addHousekeepingTask = (taskData: Omit<HousekeepingTask, 'id'>) => {
    const newTask: HousekeepingTask = {
      ...taskData,
      id: `hk-${Date.now()}`
    };
    setHousekeepingTasks((prev) => [newTask, ...prev]);
    addNotification('Housekeeping Task Assigned', `Room ${newTask.roomNumber} assigned to ${newTask.assignedStaffName}.`, 'housekeeping');
  };

  const updateHousekeepingStatus = (taskId: string, status: HousekeepingTask['status']) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (status === 'completed' || status === 'inspected') {
            // update room to available
            const matchingRoom = rooms.find((r) => r.roomNumber === t.roomNumber);
            if (matchingRoom && matchingRoom.status === 'cleaning') {
              updateRoomStatus(matchingRoom.id, 'available');
            }
          }
          return {
            ...t,
            status,
            completedTime: status === 'completed' || status === 'inspected' ? 'Just now' : t.completedTime
          };
        }
        return t;
      })
    );
  };

  const toggleHousekeepingChecklistItem = (taskId: string, itemIndex: number) => {
    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedChecklist = [...t.checklist];
          updatedChecklist[itemIndex] = {
            ...updatedChecklist[itemIndex],
            done: !updatedChecklist[itemIndex].done
          };
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  const createRestaurantOrder = (orderData: Omit<RestaurantOrder, 'id' | 'orderNumber' | 'createdAt'>): RestaurantOrder => {
    const orderNum = `KDS-#${Math.floor(1050 + Math.random() * 900)}`;
    const newOrder: RestaurantOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString()
    };
    setRestaurantOrders((prev) => [newOrder, ...prev]);
    addNotification('New Kitchen Order', `${orderNum} (${newOrder.roomOrTableNumber}) for ${newOrder.guestName}.`, 'guest');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    setRestaurantOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateInventoryQuantity = (itemId: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (newQty <= item.minThreshold) {
            addNotification(
              'Low Stock Alert',
              `${item.name} is down to ${newQty} ${item.unit} (Threshold: ${item.minThreshold}).`,
              'inventory'
            );
          }
          return { ...item, quantity: newQty, currentStock: newQty };
        }
        return item;
      })
    );
  };

  const restockInventory = (itemId: string, addQty: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + addQty,
              currentStock: (item.currentStock || item.quantity) + addQty,
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
  };

  const addMaintenanceTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'ticketNumber' | 'createdAt'>) => {
    const ticketNum = `MNT-#${Math.floor(8830 + Math.random() * 900)}`;
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `tc-${Date.now()}`,
      ticketNumber: ticketNum,
      createdAt: new Date().toISOString()
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
    if (newTicket.roomId) {
      updateRoomStatus(newTicket.roomId, 'maintenance');
    }
    addNotification('Maintenance Ticket Logged', `${ticketNum} - ${newTicket.title || newTicket.issue}.`, 'maintenance');
  };

  const updateMaintenanceStatus = (ticketId: string, status: MaintenanceTicket['status'], cost?: number) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (status === 'completed' || status === 'inspected') {
            if (t.roomId) {
              updateRoomStatus(t.roomId, 'available');
            }
          }
          return {
            ...t,
            status,
            cost: cost !== undefined ? cost : t.cost,
            resolvedAt: status === 'completed' || status === 'inspected' ? new Date().toISOString() : t.resolvedAt
          };
        }
        return t;
      })
    );
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cp-${Date.now()}`,
      usedCount: 0
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const refundTransaction = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txnId ? { ...tx, status: 'refunded' } : tx))
    );
    addNotification('Refund Processed', `Transaction ${txnId} marked as refunded.`, 'payment');
  };

  const applyCouponCode = (code: string, subtotal: number) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === trimmed && (c.isActive || c.active));

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired promotional voucher code.' };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        discount: 0,
        message: `Coupon requires minimum booking spend of ${formatCurrency(coupon.minSpend)}.`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `Promo applied: ${coupon.title} (${coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `${formatCurrency(coupon.discountValue)} OFF`})!`,
      coupon
    };
  };

  const updateHotelSubscription = (hotelId: string, plan: 'starter' | 'professional' | 'enterprise') => {
    setHotels((prev) =>
      prev.map((h) => (h.id === hotelId ? { ...h, subscriptionPlan: plan } : h))
    );
    addNotification('SaaS Subscription Changed', `Plan for ${hotelId} updated to ${plan.toUpperCase()}.`, 'payment');
  };

  const addHotelProperty = (hotelData: Omit<HotelProperty, 'id' | 'activeBookingsCount' | 'occupancyRate' | 'monthlyRevenue'>) => {
    const newHotel: HotelProperty = {
      ...hotelData,
      slug: hotelData.name.toLowerCase().replace(/\s+/g, '-'),
      stars: hotelData.stars || 5,
      heroImage: hotelData.image || hotelData.heroImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      id: `hotel-${Date.now()}`,
      activeBookingsCount: 0,
      occupancyRate: 0,
      monthlyRevenue: 0
    };
    setHotels((prev) => [...prev, newHotel]);
    addNotification('New Hotel Onboarded', `${newHotel.name} (${newHotel.city}) has joined Aura SaaS Cloud.`, 'booking');
  };

  const updateHotelStatus = (hotelId: string, status: 'active' | 'pending' | 'suspended') => {
    setHotels((prev) =>
      prev.map((h) => (h.id === hotelId ? { ...h, status } : h))
    );
  };

  return (
    <HotelContext.Provider
      value={{
        hotels,
        activeHotelId,
        activeHotel,
        setActiveHotelId,
        rooms,
        bookings,
        guests,
        staff,
        housekeepingTasks,
        menuItems,
        restaurantOrders,
        tables,
        inventory,
        maintenanceTickets,
        coupons,
        extraServices,
        notifications,
        transactions,
        payments: transactions,
        userRole,
        setUserRole,
        activePortal,
        setActivePortal,
        customerActiveTab,
        setCustomerActiveTab,
        adminActiveTab,
        setAdminActiveTab,
        searchParams,
        setSearchParams,
        selectedRoomForDetails,
        setSelectedRoomForDetails,
        activeRoomModal: selectedRoomForDetails,
        closeRoomModal: () => setSelectedRoomForDetails(null),
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        bookingWizardOpen,
        isBookingWizardOpen: bookingWizardOpen,
        openBookingWizard,
        closeBookingWizard,
        invoiceModalOpen,
        currentInvoiceBooking,
        activeInvoiceBooking: currentInvoiceBooking,
        viewInvoice,
        closeInvoice,
        createBooking,
        updateBookingStatus,
        updateRoomStatus,
        addRoom,
        editRoom,
        deleteRoom,
        addGuest,
        updateGuestNotes,
        addStaff,
        updateStaffStatus,
        addHousekeepingTask,
        updateHousekeepingStatus,
        toggleHousekeepingChecklistItem,
        createRestaurantOrder,
        updateOrderStatus,
        updateInventoryQuantity,
        restockInventory,
        addMaintenanceTicket,
        createMaintenanceTicket: addMaintenanceTicket,
        updateMaintenanceStatus,
        addCoupon,
        toggleCouponActive,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        refundTransaction,
        processRefund: refundTransaction,
        applyCouponCode,
        updateHotelSubscription,
        addHotelProperty,
        addHotel: addHotelProperty,
        updateHotelStatus,
        formatCurrency
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = (): HotelContextType => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
