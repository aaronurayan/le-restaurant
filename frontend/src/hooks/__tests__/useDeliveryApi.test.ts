/**
 * Unit Tests for useDeliveryApi Hook (F107)
 * 
 * This test suite validates the useDeliveryApi custom hook,
 * testing API calls, mock mode fallback, error handling, and state management.
 * 
 * @author Aaron Urayan
 * @module F107-DeliveryManagement
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDeliveryApi } from '../useDeliveryApi';

// Mock fetch globally
global.fetch = vi.fn();

describe('useDeliveryApi Hook (F107)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    // =================================================================
    // Backend Connection Tests
    // =================================================================
    describe('Backend Connection', () => {
        it('should detect backend connection on successful health check', async () => {
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                status: 200,
            });

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.isBackendConnected).toBe(true);
            });
        });

        it('should fallback to mock mode on backend connection failure', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.isBackendConnected).toBe(false);
            });
        });

        it('should use mock data when backend disconnected', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveries).toHaveLength(3);
                expect(result.current.deliveryPersons).toHaveLength(5);
            });
        });
    });

    // =================================================================
    // Load Deliveries Tests
    // =================================================================
    describe('Load Deliveries', () => {
        it('should load deliveries from backend when connected', async () => {
            const mockDeliveries = [
                {
                    id: '1',
                    orderId: '101',
                    customerName: 'Alice Brown',
                    status: 'assigned',
                },
            ];

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // Load deliveries success
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockDeliveries,
            });

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.deliveries).toEqual(mockDeliveries);
                expect(result.current.loading).toBe(false);
            });
        });

        it('should set loading state while fetching', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => [] }), 100))
            );

            const { result } = renderHook(() => useDeliveryApi());

            act(() => {
                result.current.loadDeliveries();
            });

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });

        it('should handle errors when loading deliveries', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockRejectedValueOnce(new Error('Failed to fetch'));

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });
        });

        it('should use mock deliveries when backend disconnected', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveries.length).toBeGreaterThan(0);
                expect(result.current.deliveries[0]).toHaveProperty('orderId');
            });
        });
    });

    // =================================================================
    // Create Delivery Assignment Tests
    // =================================================================
    describe('Create Delivery Assignment', () => {
        it('should create delivery assignment via backend', async () => {
            const newDelivery = {
                orderId: '103',
                customerName: 'New Customer',
                customerAddress: '789 New St',
                customerPhone: '0498765432',
                deliveryPersonId: '1',
                priority: 'normal' as const,
                specialInstructions: 'Ring doorbell',
            };

            const createdDelivery = {
                id: '4',
                ...newDelivery,
                status: 'assigned',
                createdAt: new Date().toISOString(),
            };

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // Create delivery success
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => createdDelivery,
            });

            const { result } = renderHook(() => useDeliveryApi());

            let createdResult: any;
            await act(async () => {
                createdResult = await result.current.createDeliveryAssignment(newDelivery);
            });

            expect(createdResult).toEqual(createdDelivery);
        });

        it('should create delivery in mock mode when backend disconnected', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            const newDelivery = {
                orderId: '103',
                customerName: 'New Customer',
                customerAddress: '789 New St',
                customerPhone: '0498765432',
                deliveryPersonId: '1',
                priority: 'normal' as const,
                specialInstructions: 'Ring doorbell',
            };

            let createdResult: any;
            await act(async () => {
                createdResult = await result.current.createDeliveryAssignment(newDelivery);
            });

            await waitFor(() => {
                expect(createdResult).toHaveProperty('id');
                expect(createdResult.customerName).toBe('New Customer');
                expect(result.current.deliveries).toContainEqual(
                    expect.objectContaining({ customerName: 'New Customer' })
                );
            });
        });

        it('should validate required fields', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });

            const { result } = renderHook(() => useDeliveryApi());

            const invalidDelivery = {
                orderId: '',
                customerName: '',
                customerAddress: '',
                customerPhone: '',
                deliveryPersonId: null,
                priority: 'normal' as const,
                specialInstructions: '',
            };

            await act(async () => {
                try {
                    await result.current.createDeliveryAssignment(invalidDelivery);
                } catch (error: any) {
                    expect(error.message).toContain('required');
                }
            });
        });
    });

    // =================================================================
    // Update Delivery Status Tests
    // =================================================================
    describe('Update Delivery Status', () => {
        it('should update delivery status via backend', async () => {
            const updatedDelivery = {
                id: '1',
                status: 'picked-up',
                orderId: '101',
            };

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // Update status success
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => updatedDelivery,
            });

            const { result } = renderHook(() => useDeliveryApi());

            let updateResult: any;
            await act(async () => {
                updateResult = await result.current.updateDeliveryStatus('1', 'picked-up');
            });

            expect(updateResult.status).toBe('picked-up');
        });

        it('should update delivery status in mock mode', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveries.length).toBeGreaterThan(0);
            });

            const deliveryId = result.current.deliveries[0].id;

            await act(async () => {
                await result.current.updateDeliveryStatus(deliveryId, 'picked-up');
            });

            await waitFor(() => {
                const updatedDelivery = result.current.deliveries.find(d => d.id === deliveryId);
                expect(updatedDelivery?.status).toBe('picked-up');
            });
        });

        it('should handle invalid status transitions', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ error: 'Invalid status transition' }),
            });

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                try {
                    await result.current.updateDeliveryStatus('1', 'delivered');
                } catch (error: any) {
                    expect(error.message).toContain('Invalid');
                }
            });
        });
    });

    // =================================================================
    // Assign Delivery Person Tests
    // =================================================================
    describe('Assign Delivery Person', () => {
        it('should assign delivery person via backend', async () => {
            const assignedDelivery = {
                id: '1',
                orderId: '101',
                deliveryPersonId: '2',
                status: 'assigned',
            };

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // Assign person success
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => assignedDelivery,
            });

            const { result } = renderHook(() => useDeliveryApi());

            let assignResult: any;
            await act(async () => {
                assignResult = await result.current.assignDeliveryPerson('1', '2');
            });

            expect(assignResult.deliveryPersonId).toBe('2');
        });

        it('should assign delivery person in mock mode', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveries.length).toBeGreaterThan(0);
            });

            const deliveryId = result.current.deliveries[0].id;

            await act(async () => {
                await result.current.assignDeliveryPerson(deliveryId, '2');
            });

            await waitFor(() => {
                const updatedDelivery = result.current.deliveries.find(d => d.id === deliveryId);
                expect(updatedDelivery?.deliveryPersonId).toBe('2');
            });
        });

        it('should prevent assigning to non-existent delivery person', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                try {
                    await result.current.assignDeliveryPerson('1', '999');
                } catch (error: any) {
                    expect(error.message).toContain('not found');
                }
            });
        });
    });

    // =================================================================
    // Load Delivery Persons Tests
    // =================================================================
    describe('Load Delivery Persons', () => {
        it('should load delivery persons from backend', async () => {
            const mockPersons = [
                {
                    id: '1',
                    name: 'John Smith',
                    status: 'available',
                    vehicleType: 'bicycle',
                },
            ];

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // Load persons success
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockPersons,
            });

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveryPersons();
            });

            await waitFor(() => {
                expect(result.current.deliveryPersons).toEqual(mockPersons);
            });
        });

        it('should use mock delivery persons when backend disconnected', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveryPersons.length).toBe(5);
                expect(result.current.deliveryPersons[0]).toHaveProperty('name');
                expect(result.current.deliveryPersons[0]).toHaveProperty('vehicleType');
            });
        });
    });

    // =================================================================
    // Error Handling Tests
    // =================================================================
    describe('Error Handling', () => {
        it('should set error state on failed API calls', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });
        });

        it('should clear previous errors on successful calls', async () => {
            const mockDeliveries = [{ id: '1', orderId: '101' }];

            // Health check success
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            // First call fails
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
            // Second call succeeds
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockDeliveries,
            });

            const { result } = renderHook(() => useDeliveryApi());

            // First call - should set error
            await act(async () => {
                await result.current.loadDeliveries();
            });

            expect(result.current.error).toBeTruthy();

            // Second call - should clear error
            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.error).toBeNull();
            });
        });

        it('should log errors to console', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockRejectedValueOnce(new Error('Test error'));

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalled();
            });

            consoleErrorSpy.mockRestore();
        });
    });

    // =================================================================
    // Mock Mode Tests
    // =================================================================
    describe('Mock Mode', () => {
        it('should have 3 initial deliveries in mock mode', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveries).toHaveLength(3);
            });
        });

        it('should have 5 delivery persons in mock mode', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                expect(result.current.deliveryPersons).toHaveLength(5);
            });
        });

        it('should have 4 available delivery persons in mock mode', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            await waitFor(() => {
                const availablePersons = result.current.deliveryPersons.filter(
                    p => p.status === 'available'
                );
                expect(availablePersons).toHaveLength(4);
            });
        });

        it('should persist mock data changes during session', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

            const { result } = renderHook(() => useDeliveryApi());

            const initialCount = result.current.deliveries.length;

            await act(async () => {
                await result.current.createDeliveryAssignment({
                    orderId: '999',
                    customerName: 'Test Customer',
                    customerAddress: 'Test Address',
                    customerPhone: '0412345678',
                    deliveryPersonId: '1',
                    priority: 'normal',
                    specialInstructions: '',
                });
            });

            await waitFor(() => {
                expect(result.current.deliveries).toHaveLength(initialCount + 1);
            });
        });
    });

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    describe('Edge Cases', () => {
        it('should handle empty response from backend', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.deliveries).toEqual([]);
            });
        });

        it('should handle malformed JSON response', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            });

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });
        });

        it('should handle timeout errors gracefully', async () => {
            (global.fetch as any).mockResolvedValueOnce({ ok: true });
            (global.fetch as any).mockImplementation(() =>
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 100)
                )
            );

            const { result } = renderHook(() => useDeliveryApi());

            await act(async () => {
                await result.current.loadDeliveries();
            });

            vi.advanceTimersByTime(100);

            await waitFor(() => {
                expect(result.current.error).toBeTruthy();
            });
        });
    });
});
