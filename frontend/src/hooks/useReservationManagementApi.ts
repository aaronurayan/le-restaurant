import { useState, useCallback } from 'react';

/**
 * useReservationManagementApi Hook
 * F109 - Reservation Management Feature
 * 
 * Custom hook for managing reservation operations via API.
 * Handles fetching, approving, and denying reservations.
 * 
 * @author Le Restaurant Development Team
 */

import { API_ENDPOINTS } from '../config/api.config';
import { apiClient } from '../services/apiClient.unified';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DENIED = 'DENIED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW'
}

export interface Reservation {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  tableId?: number;
  tableNumber?: string;
  tableLocation?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  confirmedByUserId?: number;
  checkedInAt?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

// Backend DTO interface (what API actually returns)
interface ReservationBackendDto {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDateTime: string;
  numberOfGuests: number;
  tableId?: number;
  tableNumber?: string;
  tableLocation?: string;
  status: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
  rejectionReason?: string;
  approvedBy?: number;
}

/**
 * Transform backend DTO to frontend Reservation interface
 */
const transformReservation = (dto: ReservationBackendDto): Reservation => {
  const dateTime = new Date(dto.reservationDateTime);
  const reservationDate = dateTime.toISOString().split('T')[0]; // YYYY-MM-DD
  const reservationTime = dateTime.toTimeString().substring(0, 5); // HH:MM

  return {
    id: dto.id,
    customerId: dto.customerId,
    customerName: dto.customerName,
    customerEmail: dto.customerEmail,
    customerPhone: dto.customerPhone,
    reservationDate,
    reservationTime,
    partySize: dto.numberOfGuests,
    tableId: dto.tableId,
    tableNumber: dto.tableNumber,
    tableLocation: dto.tableLocation,
    status: dto.status as ReservationStatus,
    specialRequests: dto.specialRequests,
    createdAt: dto.createdAt,
    rejectionReason: dto.rejectionReason,
    confirmedByUserId: dto.approvedBy,
  };
};

export interface ApprovalRequest {
  tableId?: number;
  adminNotes?: string;
  confirmedByUserId: number;
}

export interface DenialRequest {
  denialReason: string;
  deniedByUserId?: number;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  customerName?: string;
}

export const useReservationManagementApi = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all reservations with optional filters
   */
  const fetchReservations = useCallback(async (filters?: ReservationFilters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.customerName) params.append('customerName', filters.customerName);

      const queryString = params.toString();
      const endpoint = queryString
        ? `${API_ENDPOINTS.reservations.base}?${queryString}`
        : API_ENDPOINTS.reservations.base;

      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.get<ReservationBackendDto[]>(endpoint);

      const transformedReservations = data.map(transformReservation);
      setReservations(transformedReservations);
      return transformedReservations;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to fetch reservations';
      
      // Completely suppress network error logging
      const isNetworkError = err.message?.includes('Network Error') || 
                            err.message?.includes('ERR_CONNECTION_REFUSED') ||
                            err.message?.includes('fetch') ||
                            err.name === 'TypeError' && err.message?.includes('fetch');
      
      // Completely suppress network error logging and throwing
      // Network errors are expected when backend is not available
      if (!isNetworkError) {
        // Only log and throw non-network errors
        setError(errorMessage);
        console.error('Error fetching reservations:', err);
        throw new Error(errorMessage);
      }
      // For network errors, clear error state and return empty array
      setError(null);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch pending reservations only
   */
  const fetchPendingReservations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.get<ReservationBackendDto[]>(
        API_ENDPOINTS.reservations.byStatus('PENDING')
      );

      const transformedReservations = data.map(transformReservation);
      setReservations(transformedReservations);
      return transformedReservations;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to fetch pending reservations';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error fetching pending reservations:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single reservation by ID
   */
  const fetchReservationById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.get<ReservationBackendDto>(
        API_ENDPOINTS.reservations.byId(id)
      );

      return transformReservation(data);
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to fetch reservation';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error fetching reservation:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Approve a reservation
   */
  const approveReservation = useCallback(async (id: number, approvalData: ApprovalRequest) => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.post<ReservationBackendDto>(
        `${API_ENDPOINTS.reservations.approve(id)}?confirmedByUserId=${approvalData.confirmedByUserId}`,
        {
          tableId: approvalData.tableId,
          adminNotes: approvalData.adminNotes
        }
      );

      const transformedReservation = transformReservation(data);

      // Update local state
      setReservations(prev =>
        prev.map(res => res.id === id ? transformedReservation : res)
      );

      return transformedReservation;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to approve reservation';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error approving reservation:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deny a reservation
   */
  const denyReservation = useCallback(async (id: number, denialData: DenialRequest) => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.post<ReservationBackendDto>(
        API_ENDPOINTS.reservations.reject(id),
        {
          rejectionReason: denialData.denialReason,
          approverId: denialData.deniedByUserId
        }
      );

      const transformedReservation = transformReservation(data);

      // Update local state
      setReservations(prev =>
        prev.map(res => res.id === id ? transformedReservation : res)
      );

      return transformedReservation;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to deny reservation';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error denying reservation:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search reservations by customer name
   */
  const searchByCustomerName = useCallback(async (customerName: string) => {
    return fetchReservations({ customerName });
  }, [fetchReservations]);

  /**
   * Get reservations by status
   */
  const getReservationsByStatus = useCallback(async (status: ReservationStatus) => {
    return fetchReservations({ status });
  }, [fetchReservations]);

  /**
   * Delete a reservation (Admin only)
   */
  const deleteReservation = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      await apiClient.delete(API_ENDPOINTS.reservations.byId(id));

      // Remove from local state
      setReservations(prev => prev.filter(res => res.id !== id));

      return true;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to delete reservation';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error deleting reservation:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new reservation (Admin can create for any customer)
   */
  const createReservation = useCallback(async (reservationData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Use unified client - handles errors silently when backend is not available
      const data = await apiClient.post<Reservation>(
        API_ENDPOINTS.reservations.base,
        reservationData
      );

      // Add to local state
      setReservations(prev => [...prev, data]);

      return data;
    } catch (err: any) {
      // Silently handle network errors - backend may not be running
      const errorMessage = err.message || 'Failed to create reservation';
      setError(errorMessage);
      if (!err.message?.includes('Network Error') && !err.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('Error creating reservation:', err);
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reservations,
    loading,
    error,
    fetchReservations,
    fetchPendingReservations,
    fetchReservationById,
    approveReservation,
    denyReservation,
    searchByCustomerName,
    getReservationsByStatus,
    deleteReservation,
    createReservation,
  };
};
