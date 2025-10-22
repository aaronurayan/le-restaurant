/**
 * Unit Tests for DeliveryCard Component (F107)
 * 
 * This test suite validates the DeliveryCard molecule component,
 * testing rendering, status updates, person assignment, and archive functionality.
 * 
 * @author Aaron Urayan
 * @module F107-DeliveryManagement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveryCard } from '../DeliveryCard';
import type { Delivery, DeliveryPerson } from '../../../types/delivery';

describe('DeliveryCard (F107)', () => {
    const mockDelivery: Delivery = {
        id: '1',
        orderId: '101',
        customerName: 'Alice Brown',
        customerAddress: '123 Main St, Sydney NSW 2000',
        customerPhone: '0498765432',
        deliveryPersonId: '1',
        status: 'assigned',
        priority: 'normal',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
        specialInstructions: 'Ring doorbell',
        createdAt: new Date().toISOString(),
    };

    const mockDeliveryPerson: DeliveryPerson = {
        id: '1',
        name: 'John Smith',
        phone: '0412345678',
        status: 'available',
        vehicleType: 'bicycle',
        currentLocation: { lat: -33.8688, lng: 151.2093 },
        activeDeliveries: 0,
    };

    const mockOnStatusUpdate = vi.fn();
    const mockOnAssignPerson = vi.fn();
    const mockOnArchive = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =================================================================
    // Rendering Tests
    // =================================================================
    describe('Rendering', () => {
        it('should render delivery card with all information', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText('Alice Brown')).toBeInTheDocument();
            expect(screen.getByText(/Order #101/i)).toBeInTheDocument();
            expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
            expect(screen.getByText('John Smith')).toBeInTheDocument();
        });

        it('should display special instructions when provided', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/Ring doorbell/i)).toBeInTheDocument();
        });

        it('should show unassigned state when no delivery person', () => {
            const unassignedDelivery = { ...mockDelivery, deliveryPersonId: null };

            render(
                <DeliveryCard
                    delivery={unassignedDelivery}
                    deliveryPerson={undefined}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/Unassigned/i)).toBeInTheDocument();
        });

        it('should display priority badge for high priority', () => {
            const highPriorityDelivery = { ...mockDelivery, priority: 'high' as const };

            render(
                <DeliveryCard
                    delivery={highPriorityDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/high/i)).toBeInTheDocument();
        });
    });

    // =================================================================
    // Status Display Tests
    // =================================================================
    describe('Status Display', () => {
        it('should display assigned status badge', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/assigned/i)).toBeInTheDocument();
        });

        it('should display picked-up status badge', () => {
            const pickedUpDelivery = { ...mockDelivery, status: 'picked-up' as const };

            render(
                <DeliveryCard
                    delivery={pickedUpDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/picked-up/i)).toBeInTheDocument();
        });

        it('should display delivered status badge', () => {
            const deliveredDelivery = { ...mockDelivery, status: 'delivered' as const };

            render(
                <DeliveryCard
                    delivery={deliveredDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/delivered/i)).toBeInTheDocument();
        });

        it('should display pending status badge', () => {
            const pendingDelivery = { ...mockDelivery, status: 'pending' as const };

            render(
                <DeliveryCard
                    delivery={pendingDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/pending/i)).toBeInTheDocument();
        });
    });

    // =================================================================
    // Action Button Tests
    // =================================================================
    describe('Action Buttons', () => {
        it('should call onStatusUpdate when status button clicked', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            const statusButton = screen.getByRole('button', { name: /pick up/i });
            await user.click(statusButton);

            expect(mockOnStatusUpdate).toHaveBeenCalledWith('1', 'picked-up');
        });

        it('should call onAssignPerson when assign button clicked', async () => {
            const user = userEvent.setup();
            const unassignedDelivery = { ...mockDelivery, deliveryPersonId: null };

            render(
                <DeliveryCard
                    delivery={unassignedDelivery}
                    deliveryPerson={undefined}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            const assignButton = screen.getByRole('button', { name: /assign/i });
            await user.click(assignButton);

            expect(mockOnAssignPerson).toHaveBeenCalledWith('1');
        });

        it('should show archive button only for delivered status', () => {
            const deliveredDelivery = { ...mockDelivery, status: 'delivered' as const };

            render(
                <DeliveryCard
                    delivery={deliveredDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByLabelText(/archive/i)).toBeInTheDocument();
        });

        it('should not show archive button for non-delivered status', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.queryByLabelText(/archive/i)).not.toBeInTheDocument();
        });

        it('should call onArchive when archive button clicked', async () => {
            const user = userEvent.setup();
            const deliveredDelivery = { ...mockDelivery, status: 'delivered' as const };

            render(
                <DeliveryCard
                    delivery={deliveredDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            const archiveButton = screen.getByLabelText(/archive/i);
            await user.click(archiveButton);

            expect(mockOnArchive).toHaveBeenCalledWith('1');
        });
    });

    // =================================================================
    // Vehicle Type Display Tests
    // =================================================================
    describe('Vehicle Type Display', () => {
        it('should display bicycle icon for bicycle', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Check for vehicle type text
            expect(screen.getByText(/bicycle/i)).toBeInTheDocument();
        });

        it('should display motorcycle icon for motorcycle', () => {
            const motorcycleDriver = { ...mockDeliveryPerson, vehicleType: 'motorcycle' };

            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={motorcycleDriver}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/motorcycle/i)).toBeInTheDocument();
        });

        it('should display car icon for car', () => {
            const carDriver = { ...mockDeliveryPerson, vehicleType: 'car' };

            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={carDriver}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.getByText(/car/i)).toBeInTheDocument();
        });
    });

    // =================================================================
    // Time Display Tests
    // =================================================================
    describe('Time Display', () => {
        it('should display estimated delivery time', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Should show some time-related text
            expect(screen.getByText(/ETA/i)).toBeInTheDocument();
        });

        it('should format time correctly', () => {
            const futureTime = new Date(Date.now() + 45 * 60000);
            const deliveryWithTime = {
                ...mockDelivery,
                estimatedDeliveryTime: futureTime.toISOString(),
            };

            render(
                <DeliveryCard
                    delivery={deliveryWithTime}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Check that time is displayed (format may vary)
            const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
            expect(timeElement).toBeInTheDocument();
        });
    });

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    describe('Edge Cases', () => {
        it('should handle missing special instructions', () => {
            const deliveryNoInstructions = { ...mockDelivery, specialInstructions: '' };

            render(
                <DeliveryCard
                    delivery={deliveryNoInstructions}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            expect(screen.queryByText(/Ring doorbell/i)).not.toBeInTheDocument();
        });

        it('should handle very long addresses', () => {
            const longAddress = 'A'.repeat(200);
            const deliveryLongAddress = { ...mockDelivery, customerAddress: longAddress };

            render(
                <DeliveryCard
                    delivery={deliveryLongAddress}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Should render without crashing
            expect(screen.getByText(/^A+$/)).toBeInTheDocument();
        });

        it('should handle missing phone number', () => {
            const deliveryNoPhone = { ...mockDelivery, customerPhone: '' };

            render(
                <DeliveryCard
                    delivery={deliveryNoPhone}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Should still render card
            expect(screen.getByText('Alice Brown')).toBeInTheDocument();
        });

        it('should handle null estimated delivery time', () => {
            const deliveryNoTime = { ...mockDelivery, estimatedDeliveryTime: null };

            render(
                <DeliveryCard
                    delivery={deliveryNoTime}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            // Should still render card
            expect(screen.getByText('Alice Brown')).toBeInTheDocument();
        });
    });

    // =================================================================
    // Accessibility Tests
    // =================================================================
    describe('Accessibility', () => {
        it('should have accessible button labels', () => {
            const deliveredDelivery = { ...mockDelivery, status: 'delivered' as const };

            render(
                <DeliveryCard
                    delivery={deliveredDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            const archiveButton = screen.getByLabelText(/archive delivery/i);
            expect(archiveButton).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            render(
                <DeliveryCard
                    delivery={mockDelivery}
                    deliveryPerson={mockDeliveryPerson}
                    onStatusUpdate={mockOnStatusUpdate}
                    onAssignPerson={mockOnAssignPerson}
                    onArchive={mockOnArchive}
                />
            );

            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});
