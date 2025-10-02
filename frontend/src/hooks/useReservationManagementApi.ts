import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * useReservationManagementApi Hook
 * F109 - Reservation Management Feature
 * 
 * Custom hook for managing reservation operations via API.
 * Handles fetching, approving, and denying reservations.
 * 
 * @author Le Restaurant Development Team
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: string;
  confirmedAt?: string;
  confirmedByUserId?: number;
  checkedInAt?: string;
  adminNotes?: string;
}

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
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();

      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.customerName) params.append('customerName', filters.customerName);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/admin/reservations${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get<Reservation[]>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setReservations(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch reservations';
      setError(errorMessage);
      console.error('Error fetching reservations:', err);
      throw new Error(errorMessage);
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
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Reservation[]>(
        `${API_BASE_URL}/api/admin/reservations/pending`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setReservations(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch pending reservations';
      setError(errorMessage);
      console.error('Error fetching pending reservations:', err);
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
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Reservation>(
        `${API_BASE_URL}/api/admin/reservations/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch reservation';
      setError(errorMessage);
      console.error('Error fetching reservation:', err);
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
      const token = localStorage.getItem('authToken');
      const response = await axios.put<Reservation>(
        `${API_BASE_URL}/api/admin/reservations/${id}/approve`,
        approvalData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setReservations(prev =>
        prev.map(res => res.id === id ? response.data : res)
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to approve reservation';
      setError(errorMessage);
      console.error('Error approving reservation:', err);
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
      const token = localStorage.getItem('authToken');
      const response = await axios.put<Reservation>(
        `${API_BASE_URL}/api/admin/reservations/${id}/deny`,
        denialData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setReservations(prev =>
        prev.map(res => res.id === id ? response.data : res)
      );

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to deny reservation';
      setError(errorMessage);
      console.error('Error denying reservation:', err);
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
  };
};
