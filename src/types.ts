export type UserRole =
  | 'super_admin'
  | 'hotel_owner'
  | 'hotel_manager'
  | 'receptionist'
  | 'housekeeping_staff'
  | 'restaurant_manager'
  | 'kitchen_staff'
  | 'accountant'
  | 'maintenance_staff'
  | 'customer';

export type RoomCategory =
  | 'Standard Room'
  | 'Deluxe Room'
  | 'Executive Room'
  | 'Family Room'
  | 'Premium Suite'
  | 'Presidential Suite';

export type RoomStatus =
  | 'available'
  | 'occupied'
  | 'cleaning'
  | 'reserved'
  | 'maintenance';

export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Online Payment'
  | 'Cash'
  | 'Bank Transfer'
  | 'Pay at Hotel';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface RoomAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  name: string;
  category: RoomCategory;
  floor: number;
  pricePerNight: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: string;
  sizeSqFt: number;
  view?: string;
  status: RoomStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  isAvailableToday?: boolean;
}

export interface ExtraServiceItem {
  id: string;
  name: string;
  category: 'transfer' | 'dining' | 'wellness' | 'decor' | 'experience' | 'laundry';
  price: number;
  priceType: 'per_person' | 'per_stay' | 'per_night' | 'per_item';
  icon: string;
  image?: string;
  description: string;
  duration?: string;
  availability: boolean;
  assignedStaffId?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  category: 'VIP Guest' | 'Regular Guest' | 'New Guest' | 'Corporate Guest';
  address: string;
  city: string;
  country: string;
  idDocumentNumber: string;
  idDocumentType: 'Passport' | 'National ID' | 'Driving License';
  totalBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  preferences: string[];
  notes: string;
  memberSince: string;
}

export interface BookingAddon {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  roomName: string;
  roomCategory: RoomCategory;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  guestCountry?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  roomsCount: number;
  roomRatePerNight: number;
  addons: BookingAddon[];
  subtotal: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  source: 'Online Website' | 'Front Desk Walk-in' | 'OTA Booking' | 'Corporate';
  specialRequests?: string;
  flightNumber?: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  hotelId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department:
    | 'Management'
    | 'Reception'
    | 'Housekeeping'
    | 'Restaurant'
    | 'Kitchen'
    | 'Maintenance'
    | 'Security'
    | 'Accounts';
  role: string;
  shift: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night (23:00 - 07:30)';
  status: 'active' | 'on_leave' | 'off_duty';
  monthlySalary?: number;
  salary?: number;
  joinedDate?: string;
  joiningDate?: string;
  assignedTasksCount?: number;
  rating?: number;
}

export interface HousekeepingTask {
  id: string;
  hotelId: string;
  roomId: string;
  roomNumber: string;
  type: 'Turnover Cleaning' | 'Linen Change' | 'Deep Cleaning' | 'Inspection' | 'Guest Request';
  priority: 'low' | 'medium' | 'high' | 'urgent' | string;
  status: 'pending' | 'in_progress' | 'completed' | 'inspected';
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedTo?: string;
  scheduledTime?: string;
  dueDate?: string;
  completedTime?: string;
  checklist: { item: string; done: boolean }[];
  notes?: string;
}

export interface MenuItem {
  id: string;
  hotelId: string;
  name: string;
  category: 'Breakfast' | 'Starters' | 'Main Course' | 'Desserts' | 'Beverages' | 'Wine & Cocktails';
  price: number;
  description: string;
  image: string;
  isVegetarian: boolean;
  isChefSpecial: boolean;
  calories?: number;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  preparationTime?: number;
  dietary?: string[];
}

export interface RestaurantOrder {
  id: string;
  hotelId: string;
  orderNumber: string;
  orderType: 'Room Service' | 'Dine-In Table' | 'Takeaway' | 'Poolside Bar';
  roomOrTableNumber: string;
  roomNumber?: string;
  tableNumber?: string;
  guestName: string;
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  specialInstructions?: string;
  status: 'new' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'charged_to_room' | 'paid_online' | 'paid_cash';
  createdAt: string;
  estimatedMinutes: number;
  estimatedTime?: string;
}

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
  reservationTime?: string;
}

export interface InventoryItem {
  id: string;
  hotelId: string;
  name: string;
  category:
    | 'Food'
    | 'Beverages'
    | 'Toiletries'
    | 'Cleaning Products'
    | 'Bed Sheets'
    | 'Towels'
    | 'Maintenance Supplies'
    | string;
  quantity: number;
  currentStock?: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  costPerUnit?: number;
  supplier: string;
  lastRestocked: string;
  location?: string;
}

export interface MaintenanceTicket {
  id: string;
  hotelId: string;
  ticketNumber: string;
  roomId?: string;
  roomNumber?: string;
  location?: string;
  issueCategory?: 'Air Conditioning' | 'Plumbing' | 'Electrical' | 'TV / Audio' | 'Furniture' | 'Keycard System' | 'Other';
  title?: string;
  issue?: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  status: 'reported' | 'assigned' | 'in_progress' | 'completed' | 'inspected' | 'pending';
  reportedBy?: string;
  assignedTechnician?: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  cost?: number;
  estimatedCost?: number;
}

export interface Coupon {
  id: string;
  hotelId?: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  startDate?: string;
  validFrom?: string;
  endDate?: string;
  validUntil?: string;
  usageLimit?: number;
  maxUsage?: number;
  usedCount: number;
  usageCount?: number;
  isActive?: boolean;
  active?: boolean;
}

export interface HotelProperty {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  city: string;
  country: string;
  address: string;
  stars: number;
  rating?: number;
  phone: string;
  email: string;
  website?: string;
  logo: string;
  heroImage: string;
  image?: string;
  currency: string;
  currencySymbol: string;
  totalRooms: number;
  occupiedRooms?: number;
  activeBookingsCount?: number;
  occupancyRate?: number;
  monthlyRevenue?: number;
  managerName?: string;
  amenities?: string[];
  subscriptionPlan?: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'pending' | 'suspended';
}

export type Hotel = HotelProperty;

export interface SaaSSubscriptionPlan {
  id: string;
  name: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  roomLimit: string;
  hotelLimit: string;
  features: string[];
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'housekeeping' | 'maintenance' | 'inventory' | 'guest';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface TransactionRecord {
  id: string;
  hotelId?: string;
  bookingId: string;
  guestName: string;
  amount: number;
  currency?: string;
  method: PaymentMethod | string;
  status: PaymentStatus | string;
  date?: string;
  timestamp?: string;
  referenceNumber?: string;
  invoiceNumber?: string;
}

export type PaymentTransaction = TransactionRecord;
