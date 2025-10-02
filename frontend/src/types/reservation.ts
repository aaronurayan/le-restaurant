export interface Reservation {
  id: string;
  customerId: string;
  tableId?: string;
  reservationDate: string; // ISO date string
  reservationTime: string; // HH:mm format
  partySize: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  tableInfo?: {
    id: string;
    number: string;
    capacity: number;
    location: string;
  };
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface CreateReservationRequest {
  tableId?: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  specialRequests?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface UpdateReservationRequest {
  tableId?: string;
  reservationDate?: string;
  reservationTime?: string;
  partySize?: number;
  specialRequests?: string;
  status?: ReservationStatus;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  features: string[]; // e.g., ['window', 'private', 'outdoor']
}

export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  availableTables: Table[];
}

export interface ReservationFormData {
  date: string;
  time: string;
  partySize: string;
  specialRequests: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
