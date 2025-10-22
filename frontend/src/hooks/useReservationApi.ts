import { useState } from 'react';
import { Reservation, CreateReservationRequest, UpdateReservationRequest, Table, TimeSlot, ReservationStatus } from '../types/reservation';

// Helper function to get timezone offset in ISO format
const getTimezoneOffset = (): string => {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Reservation API 함수들 (백엔드 API 연동)
const reservationApi = {
  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await fetch('http://localhost:8080/api/reservations');
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
  },

  getReservationById: async (id: string): Promise<Reservation> => {
    const response = await fetch(`http://localhost:8080/api/reservations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch reservation');
    return response.json();
  },

  getReservationsByCustomer: async (customerId: string): Promise<Reservation[]> => {
    const response = await fetch(`http://localhost:8080/api/reservations/customer/${customerId}`);
    if (!response.ok) throw new Error('Failed to fetch customer reservations');
    return response.json();
  },

  getReservationsByDate: async (date: string): Promise<Reservation[]> => {
    const response = await fetch(`http://localhost:8080/api/reservations/date/${date}`);
    if (!response.ok) throw new Error('Failed to fetch reservations by date');
    return response.json();
  },

  getAvailableTables: async (date: string, time: string, partySize: number): Promise<Table[]> => {
    const response = await fetch(`http://localhost:8080/api/reservations/availability?date=${date}&time=${time}&partySize=${partySize}`);
    if (!response.ok) throw new Error('Failed to fetch available tables');
    return response.json();
  },

  getTimeSlots: async (date: string, partySize: number): Promise<TimeSlot[]> => {
    console.log('API call: getTimeSlots', { date, partySize });
    const url = `http://localhost:8080/api/reservations/timeslots?date=${date}&partySize=${partySize}`;
    console.log('Fetching from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status, response.ok);
    if (!response.ok) throw new Error('Failed to fetch time slots');
    const data = await response.json();
    console.log('Time slots data:', data);
    return data;
  },

  createReservation: async (reservation: CreateReservationRequest): Promise<Reservation> => {
    const response = await fetch('http://localhost:8080/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: reservation.customerId || null,
        tableId: reservation.tableId || null,
        numberOfGuests: reservation.partySize,
        reservationDateTime: `${reservation.reservationDate}T${reservation.reservationTime}:00${getTimezoneOffset()}`,
        specialRequests: reservation.specialRequests,
        guestName: reservation.customerInfo?.name,
        guestEmail: reservation.customerInfo?.email,
        guestPhone: reservation.customerInfo?.phone,
      }),
    });
    if (!response.ok) throw new Error('Failed to create reservation');
    return response.json();
  },

  updateReservation: async (id: string, reservation: UpdateReservationRequest): Promise<Reservation> => {
    const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) throw new Error('Failed to update reservation');
    return response.json();
  },

  cancelReservation: async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/reservations/${id}/cancel`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to cancel reservation');
  },

  deleteReservation: async (id: string): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete reservation');
  },
};

export const useReservationApi = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reservations/test');
      if (response.ok) {
        setIsBackendConnected(true);
        return true;
      }
    } catch (error) {
      console.warn('Backend not connected, using mock data');
    }
    setIsBackendConnected(false);
    return false;
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
        setReservations(data);
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
    setLoading(true);
    setError(null);

    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const data = await reservationApi.getReservationsByCustomer(customerId.toString());
        setReservations(data);
      } else {
        const filteredReservations = mockReservations.filter(r => r.customerId === customerId);
        setReservations(filteredReservations);
      }
    } catch (err) {
      setError('Failed to load customer reservations');
      console.error('Error loading customer reservations:', err);
      const filteredReservations = mockReservations.filter(r => r.customerId === customerId);
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
        setReservations(data);
      } else {
        const filteredReservations = mockReservations.filter(r => r.reservationDate === date);
        setReservations(filteredReservations);
      }
    } catch (err) {
      setError('Failed to load reservations by date');
      console.error('Error loading reservations by date:', err);
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
      console.log('getTimeSlots called with:', { date, partySize });
      const isConnected = await checkBackendConnection();
      console.log('Backend connected:', isConnected);

      if (isConnected) {
        console.log('Calling backend API for time slots...');
        const result = await reservationApi.getTimeSlots(date, partySize);
        console.log('Backend returned time slots:', result);
        return result;
      } else {
        console.log('Using mock time slots...');
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
        console.log('Generated mock time slots:', timeSlots);
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
        const newReservation = await reservationApi.createReservation(reservation);
        setReservations(prev => [...prev, newReservation]);
        return newReservation;
      } else {
        // Mock data에 추가
        const newReservation: Reservation = {
          id: Date.now(),
          customerId: reservation.customerId || 1, // Mock customer ID
          ...reservation,
          status: ReservationStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setReservations(prev => [...prev, newReservation]);
        return newReservation;
      }
    } catch (err) {
      setError('Failed to create reservation');
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  // 예약 업데이트
  const updateReservation = async (id: number, reservation: UpdateReservationRequest): Promise<Reservation> => {
    try {
      const isConnected = await checkBackendConnection();

      if (isConnected) {
        const updatedReservation = await reservationApi.updateReservation(id.toString(), reservation);
        setReservations(prev => prev.map(r => r.id === id ? updatedReservation : r));
        return updatedReservation;
      } else {
        // Mock data 업데이트
        setReservations(prev => prev.map(r =>
          r.id === id
            ? { ...r, ...reservation, updatedAt: new Date().toISOString() }
            : r
        ));
        return { ...mockReservations.find(r => r.id === id)!, ...reservation };
      }
    } catch (err) {
      setError('Failed to update reservation');
      console.error('Error updating reservation:', err);
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
      console.error('Error cancelling reservation:', err);
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
      console.error('Error deleting reservation:', err);
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
