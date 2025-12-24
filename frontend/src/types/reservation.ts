/**
 * Reservation Types (F108, F109)
 * 
 * This file contains both:
 * - ReservationDto: Matches backend ReservationDto.java exactly
 * - Reservation: Frontend model used by UI components (transformed from DTO)
 */

// ============================================================================
// Backend DTO (matches ReservationDto.java)
// ============================================================================
export interface ReservationDto {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId?: number;
  tableNumber?: string;
  tableLocation?: string;
  numberOfGuests: number;
  reservationDateTime: string; // ISO datetime from backend
  specialRequests?: string;
  status: string; // PENDING, CONFIRMED, CANCELLED, COMPLETED
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  approvedBy?: number; // Manager ID
}

// ============================================================================
// Frontend Model (used by UI components)
// ============================================================================
export interface Reservation {
  id: number;
  customerId: number;
  tableId?: number;
  reservationDate: string; // Date portion (YYYY-MM-DD)
  reservationTime: string; // Time portion (HH:mm)
  partySize: number; // Mapped from numberOfGuests
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
    id: number;
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

// ============================================================================
// Request DTOs
// ============================================================================
export interface CreateReservationRequest {
  customerId?: number;
  tableId?: number;
  reservationDate: string;
  reservationTime: string;
  partySize: number; // Will be mapped to numberOfGuests by hook
  specialRequests?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface UpdateReservationRequest {
  tableId?: number;
  reservationDate?: string;
  reservationTime?: string;
  partySize?: number;
  specialRequests?: string;
  status?: ReservationStatus;
}

// ============================================================================
// Supporting Types
// ============================================================================
export interface Table {
  id: number;
  number: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  features?: string[];
}

export interface TimeSlot {
  time: string; // HH:mm format
  isAvailable: boolean;
  availableTables?: Table[];
}

export interface ReservationFormData {
  date: string;
  time: string;
  partySize: number;
  specialRequests: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}
