/**
 * Unit Tests for DeliveryForm Component (F107)
 * 
 * This test suite validates the DeliveryForm molecule component,
 * testing form rendering, validation, submission, and time picker functionality.
 * 
 * @author Aaron Urayan
 * @module F107-DeliveryManagement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeliveryForm } from '../DeliveryForm';
import type { DeliveryPerson } from '../../../types/delivery';

describe('DeliveryForm (F107)', () => {
    const mockDeliveryPersons: DeliveryPerson[] = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '0412345678',
            status: 'available',
            vehicleType: 'bicycle',
            currentLocation: { latitude: -33.8688, longitude: 151.2093 },
            activeDeliveries: 0,
            totalDeliveries: 50,
            rating: 4.8,
            isOnline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '0423456789',
            status: 'available',
            vehicleType: 'motorcycle',
            currentLocation: { latitude: -33.8700, longitude: 151.2100 },
            activeDeliveries: 0,
            totalDeliveries: 75,
            rating: 4.9,
            isOnline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =================================================================
    // Rendering Tests
    // =================================================================
    describe('Rendering', () => {
        it('should render form with all fields', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByLabelText(/order id/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/delivery person/i)).toBeInTheDocument();
        });

        it('should render submit and cancel buttons', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });

        it('should show available delivery persons in dropdown', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
            expect(screen.getByText(/Sarah Johnson/i)).toBeInTheDocument();
        });

        it('should display priority selector', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
        });

        it('should display datetime picker', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByLabelText(/estimated delivery time/i)).toBeInTheDocument();
        });
    });

    // =================================================================
    // Form Validation Tests
    // =================================================================
    describe('Form Validation', () => {
        it('should show error when submitting with empty order ID', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/order id is required/i)).toBeInTheDocument();
            });
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });

        it('should show error when submitting with empty customer name', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const orderIdInput = screen.getByLabelText(/order id/i);
            await user.type(orderIdInput, '101');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
            });
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });

        it('should show error when submitting with empty address', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/address is required/i)).toBeInTheDocument();
            });
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });

        it('should show error when no delivery person selected', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/delivery person is required/i)).toBeInTheDocument();
            });
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });

        it('should validate phone number format', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const phoneInput = screen.getByLabelText(/phone/i);
            await user.type(phoneInput, '12345'); // Invalid format

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
            });
        });
    });

    // =================================================================
    // Form Submission Tests
    // =================================================================
    describe('Form Submission', () => {
        it('should submit form with valid data', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St, Sydney NSW 2000');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');

            const personSelect = screen.getByLabelText(/delivery person/i);
            await user.selectOptions(personSelect, '1');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        orderId: '101',
                        customerName: 'John Doe',
                        customerAddress: '123 Main St, Sydney NSW 2000',
                        customerPhone: '0498765432',
                        deliveryPersonId: '1',
                    })
                );
            });
        });

        it('should include special instructions when provided', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            const instructionsInput = screen.getByLabelText(/special instructions/i);
            await user.type(instructionsInput, 'Ring doorbell twice');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        specialInstructions: 'Ring doorbell twice',
                    })
                );
            });
        });

        it('should include priority level when selected', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            const prioritySelect = screen.getByLabelText(/priority/i);
            await user.selectOptions(prioritySelect, 'high');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        priority: 'high',
                    })
                );
            });
        });

        it('should reset form after successful submission', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const orderIdInput = screen.getByLabelText(/order id/i) as HTMLInputElement;
            await user.type(orderIdInput, '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(orderIdInput.value).toBe('');
            });
        });
    });

    // =================================================================
    // Cancel Button Tests
    // =================================================================
    describe('Cancel Button', () => {
        it('should call onCancel when cancel button clicked', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockOnCancel).toHaveBeenCalledTimes(1);
        });

        it('should not submit form when cancel is clicked', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    });

    // =================================================================
    // Time Picker Tests
    // =================================================================
    describe('Time Picker', () => {
        it('should enforce minimum time of 30 minutes from now', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const timeInput = screen.getByLabelText(/estimated delivery time/i);

            // Try to set time to now (should be invalid)
            const now = new Date();
            const timeString = now.toISOString().slice(0, 16);

            await user.type(timeInput, timeString);

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/must be at least 30 minutes/i)).toBeInTheDocument();
            });
        });

        it('should round time to nearest 5 minutes', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '101');
            await user.type(screen.getByLabelText(/customer name/i), 'John Doe');
            await user.type(screen.getByLabelText(/address/i), '123 Main St');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            // Set time with odd minutes (e.g., 32 minutes)
            const timeInput = screen.getByLabelText(/estimated delivery time/i);
            const futureTime = new Date(Date.now() + 32 * 60000);
            await user.type(timeInput, futureTime.toISOString().slice(0, 16));

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalled();
                const submittedTime = new Date(mockOnSubmit.mock.calls[0][0].estimatedDeliveryTime);
                const minutes = submittedTime.getMinutes();
                expect(minutes % 5).toBe(0); // Should be rounded to 5-minute interval
            });
        });
    });

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    describe('Edge Cases', () => {
        it('should handle empty delivery persons list', () => {
            render(
                <DeliveryForm
                    deliveryPersons={[]}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByText(/No delivery persons available/i)).toBeInTheDocument();
        });

        it('should disable submit button when no delivery persons available', () => {
            render(
                <DeliveryForm
                    deliveryPersons={[]}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const submitButton = screen.getByRole('button', { name: /create/i });
            expect(submitButton).toBeDisabled();
        });

        it('should handle very long special instructions', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const longInstructions = 'A'.repeat(500);
            const instructionsInput = screen.getByLabelText(/special instructions/i);
            await user.type(instructionsInput, longInstructions);

            // Should not crash
            expect(instructionsInput).toHaveValue(longInstructions);
        });

        it('should trim whitespace from inputs', async () => {
            const user = userEvent.setup();

            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            await user.type(screen.getByLabelText(/order id/i), '  101  ');
            await user.type(screen.getByLabelText(/customer name/i), '  John Doe  ');
            await user.type(screen.getByLabelText(/address/i), '  123 Main St  ');
            await user.type(screen.getByLabelText(/phone/i), '0498765432');
            await user.selectOptions(screen.getByLabelText(/delivery person/i), '1');

            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        orderId: '101',
                        customerName: 'John Doe',
                        customerAddress: '123 Main St',
                    })
                );
            });
        });
    });

    // =================================================================
    // Accessibility Tests
    // =================================================================
    describe('Accessibility', () => {
        it('should have proper labels for all inputs', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            expect(screen.getByLabelText(/order id/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/delivery person/i)).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2); // Submit and Cancel
        });

        it('should mark required fields', () => {
            render(
                <DeliveryForm
                    deliveryPersons={mockDeliveryPersons}
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            );

            const orderIdInput = screen.getByLabelText(/order id/i);
            expect(orderIdInput).toHaveAttribute('required');
        });
    });
});
