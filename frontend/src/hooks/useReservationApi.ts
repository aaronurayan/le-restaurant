/**
 * Reservation API Hook
 * 
 * This hook has been updated to use the unified API client and centralized endpoints.
 */

import { useState } from 'react';
import { Reservation, CreateReservationRequest, UpdateReservationRequest, Table, TimeSlot, ReservationStatus } from '../types/reservation';
import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';

// Helper function to get timezone offset in ISO format
const getTimezoneOffset = (): string => {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Reservation API 함수들 (백엔드 API 연동) - Now using unified client
const reservationApi = {
  getAllReservations: async (): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>(API_ENDPOINTS.reservations.base);
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    return apiClient.get<Reservation>(API_ENDPOINTS.reservations.byId(Number(id)));
  },

  getReservationsByCustomer: async (customerId: string): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>(API_ENDPOINTS.reservations.byCustomer(Number(customerId)));
  },

  getReservationsByDate: async (date: string): Promise<Reservation[]> => {
    return apiClient.get<Reservation[]>(API_ENDPOINTS.reservations.byDate(date));
  },

  getAvailableTables: async (date: string, time: string, partySize: number): Promise<Table[]> => {
    return apiClient.get<Table[]>(API_ENDPOINTS.reservations.availability(date, time, partySize));
  },

  getTimeSlots: async (date: string, partySize: number): Promise<TimeSlot[]> => {
    return apiClient.get<TimeSlot[]>(API_ENDPOINTS.reservations.timeslots(date, partySize));
  },

  createReservation: async (reservation: CreateReservationRequest): Promise<Reservation> => {
    return apiClient.post<Reservation>(API_ENDPOINTS.reservations.base, {
      customerId: reservation.customerId || null,
      tableId: reservation.tableId || null,
      numberOfGuests: reservation.partySize,
      reservationDateTime: `${reservation.reservationDate}T${reservation.reservationTime}:00${getTimezoneOffset()}`,
      specialRequests: reservation.specialRequests,
      guestName: reservation.customerInfo?.name,
      guestEmail: reservation.customerInfo?.email,
      guestPhone: reservation.customerInfo?.phone,
    });
  },

  updateReservation: async (id: string, reservation: UpdateReservationRequest): Promise<Reservation> => {
    return apiClient.put<Reservation>(API_ENDPOINTS.reservations.byId(Number(id)), reservation);
  },

  cancelReservation: async (id: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.reservations.cancel(Number(id)), {});
  },

  deleteReservation: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.reservations.byId(Number(id)));
  },
};

// Transform backend DTO to frontend Reservation type
const transformReservationDto = (dto: any): Reservation => {
  // Transforming DTO

  const dateTime = new Date(dto.reservationDateTime);
  const date = dateTime.toISOString().split('T')[0];
  const time = dateTime.toTimeString().slice(0, 5); // HH:mm format

  const transformed = {
    id: dto.id,
    customerId: dto.customerId,
    tableId: dto.tableId,
    reservationDate: date,
    reservationTime: time,
    partySize: dto.numberOfGuests,
    specialRequests: dto.specialRequests,
    status: dto.status as ReservationStatus,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    confirmedAt: dto.confirmedAt,
    checkedInAt: dto.checkedInAt,
    customerInfo: {
      name: dto.customerName,
      email: dto.customerEmail,
      phone: dto.customerPhone,
    },
    tableInfo: dto.tableId ? {
      id: dto.tableId,
      number: dto.tableNumber || '',
      capacity: dto.tableCapacity || 0,
      location: dto.tableLocation || '',
    } : undefined,
  };

  // Transformed reservation
  return transformed;
};

export const useReservationApi = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      // Health check fails silently if backend is not available
      const isHealthy = await apiClient.checkHealth();
      setIsBackendConnected(isHealthy);
      return isHealthy;
    } catch (error) {
      // Silently handle - backend may not be running, will use mock data
      setIsBackendConnected(false);
      return false;
    }
  };

  // Mock reservations data (백엔드 연결 실패 시 사용)
  const mockReservations: Reservation[] = [
    {
      id: 1,
      customerId: 1,
      tableId: 1,
      reservationDate: '2024-01-28',
      reservationTime: '19:00',
      partySize: 4,
      specialRequests: 'Window table preferred',
      status: ReservationStatus.CONFIRMED,
      createdAt: '2024-01-27T10:00:00Z',
      updatedAt: '2024-01-27T10:00:00Z',
      confirmedAt: '2024-01-27T10:30:00Z',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      },
      tableInfo: {
        id: 1,
        number: 'A1',
        capacity: 4,
        location: 'Window side'
      }
    }
  ];

  const mockTables: Table[] = [
    { id: 1, number: 'A1', capacity: 4, location: 'Window side', isAvailable: true, features: ['window', 'private'] },
    { id: 2, number: 'A2', capacity: 2, location: 'Window side', isAvailable: true, features: ['window'] },
    { id: 3, number: 'B1', capacity: 6, location: 'Center', isAvailable: true, features: ['private'] },
    { id: 4, number: 'B2', capacity: 8, location: 'Center', isAvailable: false, features: ['private', 'large'] },
    { id: 5, number: 'C1', capacity: 2, location: 'Outdoor', isAvailable: true, features: ['outdoor', 'romantic'] }
  ];

  // 모든 예약 조회
  const loadReservations = async () => {
    setLoading(true);
    setError(null);

    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const data = await reservationApi.getAllReservations();
        const transformed = data.map(transformReservationDto);
        setReservations(transformed);
      } else {
        setReservations(mockReservations);
      }
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Error loading reservations:', err);
      setReservations(mockReservations);
    } finally {
      setLoading(false);
    }
  };

  // 고객별 예약 조회
  const loadReservationsByCustomer = async (customerId: number) => {
    // Loading reservations for customer
    setLoading(true);
    setError(null);

    try {
      // Try to call the API directly - don't rely solely on test endpoint
      const data = await reservationApi.getReservationsByCustomer(customerId.toString());
      console.log('Raw API response:', data);
      const transformed = data.map(transformReservationDto);
      // Setting reservations
      setReservations(transformed);
      setIsBackendConnected(true);
    } catch (err) {
      // Error loading customer reservations - silently handle
      setError('Failed to load customer reservations');
      setIsBackendConnected(false);

      // Fallback to mock data
      const filteredReservations = mockReservations.filter(r => r.customerId === customerId);
      // Using mock reservations
      setReservations(filteredReservations);
    } finally {
      setLoading(false);
    }
  };

  // 날짜별 예약 조회
  const loadReservationsByDate = async (date: string) => {
    setLoading(true);
    setError(null);

    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const data = await reservationApi.getReservationsByDate(date);
        const transformed = data.map(transformReservationDto);
        setReservations(transformed);
      } else {
        const filteredReservations = mockReservations.filter(r => r.reservationDate === date);
        setReservations(filteredReservations);
      }
    } catch (err) {
      setError('Failed to load reservations by date');
      // Error loading reservations by date - silently handle
      const filteredReservations = mockReservations.filter(r => r.reservationDate === date);
      setReservations(filteredReservations);
    } finally {
      setLoading(false);
    }
  };

  // 사용 가능한 테이블 조회
  const getAvailableTables = async (date: string, time: string, partySize: number): Promise<Table[]> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        return await reservationApi.getAvailableTables(date, time, partySize);
      } else {
        // Mock data에서 필터링
        return mockTables.filter(table =>
          table.isAvailable &&
          table.capacity >= partySize &&
          !mockReservations.some(reservation =>
            reservation.tableId === table.id &&
            reservation.reservationDate === date &&
            reservation.reservationTime === time &&
            reservation.status !== ReservationStatus.CANCELLED
          )
        );
      }
    } catch (err) {
      console.error('Error getting available tables:', err);
      return mockTables.filter(table => table.isAvailable && table.capacity >= partySize);
    }
  };

  // 시간대 조회
  const getTimeSlots = async (date: string, partySize: number): Promise<TimeSlot[]> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        return await reservationApi.getTimeSlots(date, partySize);
      } else {
        // Mock time slots - generate without calling getAvailableTables to avoid circular calls
        const timeSlots: TimeSlot[] = [];
        for (let hour = 17; hour <= 21; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            // Check availability directly without async call
            const availableTables = mockTables.filter(table =>
              table.isAvailable &&
              table.capacity >= partySize &&
              !mockReservations.some(reservation =>
                reservation.tableId === table.id &&
                reservation.reservationDate === date &&
                reservation.reservationTime === time &&
                reservation.status !== ReservationStatus.CANCELLED
              )
            );

            timeSlots.push({
              time,
              isAvailable: availableTables.length > 0,
              availableTables
            });
          }
        }
        return timeSlots;
      }
    } catch (err) {
      console.error('Error getting time slots:', err);
      return [];
    }
  };

  // 예약 생성
  const createReservation = async (reservation: CreateReservationRequest): Promise<Reservation> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const dto = await reservationApi.createReservation(reservation);
        const transformed = transformReservationDto(dto);
        setReservations(prev => [...prev, transformed]);
        return transformed;
      } else {
        // Mock data에 추가
        const newReservation: Reservation = {
          id: Date.now(),
          customerId: reservation.customerId || 1, // Mock customer ID
          tableId: reservation.tableId,
          reservationDate: reservation.reservationDate,
          reservationTime: reservation.reservationTime,
          partySize: reservation.partySize,
          specialRequests: reservation.specialRequests,
          customerInfo: reservation.customerInfo,
          status: ReservationStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setReservations(prev => [...prev, newReservation]);
        return newReservation;
      }
    } catch (err) {
      setError('Failed to create reservation');
      // Error creating reservation - silently handle
      throw err;
    }
  };

  // 예약 업데이트
  const updateReservation = async (id: number, reservation: UpdateReservationRequest): Promise<Reservation> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const dto = await reservationApi.updateReservation(id.toString(), reservation);
        const transformed = transformReservationDto(dto);
        setReservations(prev => prev.map(r => r.id === id ? transformed : r));
        return transformed;
      } else {
        // Mock data 업데이트
        const updated = mockReservations.find(r => r.id === id);
        if (!updated) throw new Error('Reservation not found');
        const updatedReservation = { ...updated, ...reservation, updatedAt: new Date().toISOString() };
        setReservations(prev => prev.map(r =>
          r.id === id ? updatedReservation : r
        ));
        return updatedReservation;
      }
    } catch (err) {
      setError('Failed to update reservation');
      // Error updating reservation - silently handle
      throw err;
    }
  };

  // 예약 취소
  const cancelReservation = async (id: number): Promise<void> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        await reservationApi.cancelReservation(id.toString());
        setReservations(prev => prev.map(r =>
          r.id === id
            ? { ...r, status: ReservationStatus.CANCELLED, updatedAt: new Date().toISOString() }
            : r
        ));
      } else {
        // Mock data에서 취소
        setReservations(prev => prev.map(r =>
          r.id === id
            ? { ...r, status: ReservationStatus.CANCELLED, updatedAt: new Date().toISOString() }
            : r
        ));
      }
    } catch (err) {
      setError('Failed to cancel reservation');
      // Error cancelling reservation - silently handle
      throw err;
    }
  };

  // 예약 삭제
  const deleteReservation = async (id: number): Promise<void> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        await reservationApi.deleteReservation(id.toString());
        setReservations(prev => prev.filter(r => r.id !== id));
      } else {
        // Mock data에서 삭제
        setReservations(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      setError('Failed to delete reservation');
      // Error deleting reservation - silently handle
      throw err;
    }
  };

  return {
    reservations,
    loading,
    error,
    isBackendConnected,
    loadReservations,
    loadReservationsByCustomer,
    loadReservationsByDate,
    getAvailableTables,
    getTimeSlots,
    createReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
  };
};
