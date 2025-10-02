import { useCallback } from 'react';

const API_URL = '/api/reservations';

export interface Reservation {
  id: number;
  guestCount: number;
  dateTime: string;
}

export const useReservationApi = () => {
  // Fetch all reservations
  const fetchReservations = useCallback(async (): Promise<Reservation[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
    return response.json();
  }, []);

  // Create a new reservation
  const createReservation = useCallback(async (reservation: { guestCount: number; dateTime: string }) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) {
      throw new Error('Failed to create reservation');
    }
    return response.json();
  }, []);

  // Update an existing reservation
  const updateReservation = useCallback(async (id: number, reservation: { guestCount: number; dateTime: string }) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    });
    if (!response.ok) {
      throw new Error('Failed to update reservation');
    }
    return response.json();
  }, []);

  // Delete a reservation
  const deleteReservation = useCallback(async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete reservation');
    }
  }, []);

  // Fetch available tables for a specific date, time, and party size
  const getAvailableTables = useCallback(async (date: string, time: string, partySize: number) => {
    const response = await fetch(`${API_URL}/available-tables?date=${date}&time=${time}&partySize=${partySize}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available tables');
    }
    return response.json();
  }, []);

  // Fetch available time slots for a specific date and party size
  const getTimeSlots = async (date: string, partySize: number): Promise<string[]> => {
    const response = await fetch(`/api/reservations/time-slots?date=${date}&partySize=${partySize}`);
    if (!response.ok) {
      throw new Error('Failed to fetch time slots');
    }
    return response.json();
  };

  return {
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    getAvailableTables,
    getTimeSlots,
  };
};
