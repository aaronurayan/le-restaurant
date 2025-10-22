/**
 * Unit Tests for DeliveryManagementPanel Component (F107)
 * 
 * This test suite demonstrates comprehensive testing of the DeliveryManagementPanel
 * component, including rendering, user interactions, CRUD operations, and archive functionality.
 * Follows the same pattern as F102 UserManagementPanel for consistency.
 * 
 * @author Aaron Urayan
 * @module F107-DeliveryManagement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeliveryManagementPanel from '../DeliveryManagementPanel';
import { useDeliveryApi } from '../../../hooks/useDeliveryApi';

// Mock the useDeliveryApi hook
vi.mock('../../../hooks/useDeliveryApi');

// Mock data
const mockDeliveryPersons = [
    {
        id: '1',
        name: 'John Smith',
        phone: '0412345678',
        status: 'available' as const,
        vehicleType: 'bicycle',
        currentLocation: { lat: -33.8688, lng: 151.2093 },
        activeDeliveries: 0,
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        phone: '0423456789',
        status: 'available' as const,
        vehicleType: 'motorcycle',
        currentLocation: { lat: -33.8700, lng: 151.2100 },
        activeDeliveries: 0,
    },
];

const mockDeliveries = [
    {
        id: '1',
        orderId: '101',
        customerName: 'Alice Brown',
        customerAddress: '123 Main St, Sydney NSW 2000',
        customerPhone: '0498765432',
        deliveryPersonId: '1',
        status: 'assigned' as const,
        priority: 'normal' as const,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
        specialInstructions: 'Ring doorbell',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        orderId: '102',
        customerName: 'Bob Wilson',
        customerAddress: '456 Park Ave, Sydney NSW 2000',
        customerPhone: '0487654321',
        deliveryPersonId: null,
        status: 'pending' as const,
        priority: 'high' as const,
        estimatedDeliveryTime: new Date(Date.now() + 20 * 60000).toISOString(),
        specialInstructions: '',
        createdAt: new Date().toISOString(),
    },
];

describe('DeliveryManagementPanel (F107)', () => {
    const mockOnClose = vi.fn();
    const mockCreateDeliveryAssignment = vi.fn();
    const mockUpdateDeliveryStatus = vi.fn();
    const mockAssignDeliveryPerson = vi.fn();
    const mockLoadDeliveries = vi.fn();
    const mockLoadDeliveryPersons = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock return value
        vi.mocked(useDeliveryApi).mockReturnValue({
            deliveries: mockDeliveries,
            deliveryPersons: mockDeliveryPersons,
            loading: false,
            error: null,
            isBackendConnected: true,
            createDeliveryAssignment: mockCreateDeliveryAssignment,
            updateDeliveryStatus: mockUpdateDeliveryStatus,
            assignDeliveryPerson: mockAssignDeliveryPerson,
            loadDeliveries: mockLoadDeliveries,
            loadDeliveryPersons: mockLoadDeliveryPersons,
        });
    });

    // =================================================================
    // Rendering Tests
    // =================================================================
    describe('Rendering', () => {
        it('should render panel when isOpen is true', () => {
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText('Delivery Management')).toBeInTheDocument();
        });

        it('should not render panel when isOpen is false', () => {
            render(<DeliveryManagementPanel isOpen={false} onClose={mockOnClose} />);

            expect(screen.queryByText('Delivery Management')).not.toBeInTheDocument();
        });

        it('should display loading spinner while fetching data', () => {
            // Mock loading state
            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: [],
                deliveryPersons: [],
                loading: true,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText('Delivery Management')).toBeDefined();
            const spinnerElement = document.querySelector('.animate-spin');
            expect(spinnerElement).not.toBeNull();
        });

        it('should show mock data indicator when backend disconnected', () => {
            // Mock disconnected state
            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: mockDeliveries,
                deliveryPersons: mockDeliveryPersons,
                loading: false,
                error: 'Backend connection failed',
                isBackendConnected: false,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText(/Using Mock Data/i)).toBeInTheDocument();
        });

        it('should display all tabs', () => {
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText('Deliveries')).toBeInTheDocument();
            expect(screen.getByText('Personnel')).toBeInTheDocument();
            expect(screen.getByText('Analytics')).toBeInTheDocument();
            expect(screen.getByText('Archived')).toBeInTheDocument();
        });

        it('should display deliveries in default tab', () => {
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText('Alice Brown')).toBeInTheDocument();
            expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
        });
    });

    // =================================================================
    // Tab Navigation Tests
    // =================================================================
    describe('Tab Navigation', () => {
        it('should switch to Personnel tab on click', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const personnelTab = screen.getByText('Personnel');
            await user.click(personnelTab);

            await waitFor(() => {
                expect(screen.getByText('John Smith')).toBeInTheDocument();
                expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
            });
        });

        it('should switch to Analytics tab on click', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const analyticsTab = screen.getByText('Analytics');
            await user.click(analyticsTab);

            await waitFor(() => {
                expect(screen.getByText(/Delivery Analytics/i)).toBeInTheDocument();
            });
        });

        it('should switch to Archived tab on click', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const archivedTab = screen.getByText('Archived');
            await user.click(archivedTab);

            await waitFor(() => {
                expect(screen.getByText(/Archived Deliveries/i)).toBeInTheDocument();
            });
        });

        it('should return to Deliveries tab when switching back', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Switch to Personnel
            await user.click(screen.getByText('Personnel'));

            // Switch back to Deliveries
            await user.click(screen.getByText('Deliveries'));

            await waitFor(() => {
                expect(screen.getByText('Alice Brown')).toBeInTheDocument();
            });
        });
    });

    // =================================================================
    // Search and Filter Tests
    // =================================================================
    describe('Search and Filter', () => {
        it('should filter deliveries by customer name', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const searchInput = screen.getByPlaceholderText(/search/i);
            await user.type(searchInput, 'Alice');

            await waitFor(() => {
                expect(screen.getByText('Alice Brown')).toBeInTheDocument();
                expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
            });
        });

        it('should filter deliveries by order ID', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const searchInput = screen.getByPlaceholderText(/search/i);
            await user.type(searchInput, '101');

            await waitFor(() => {
                expect(screen.getByText('Alice Brown')).toBeInTheDocument();
                expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
            });
        });

        it('should clear search when input is emptied', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const searchInput = screen.getByPlaceholderText(/search/i);
            await user.type(searchInput, 'Alice');
            await user.clear(searchInput);

            await waitFor(() => {
                expect(screen.getByText('Alice Brown')).toBeInTheDocument();
                expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
            });
        });
    });

    // =================================================================
    // Create Delivery Assignment Tests
    // =================================================================
    describe('Create Delivery Assignment', () => {
        it('should open create form on add button click', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const addButton = screen.getByRole('button', { name: /new delivery/i });
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByText(/Create Delivery Assignment/i)).toBeInTheDocument();
            });
        });

        it('should create delivery assignment successfully', async () => {
            const user = userEvent.setup();
            mockCreateDeliveryAssignment.mockResolvedValue({
                id: '3',
                orderId: '103',
                customerName: 'New Customer',
                status: 'assigned',
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Open create form
            const addButton = screen.getByRole('button', { name: /new delivery/i });
            await user.click(addButton);

            // Fill form fields
            const orderIdInput = screen.getByLabelText(/order id/i);
            await user.type(orderIdInput, '103');

            const customerNameInput = screen.getByLabelText(/customer name/i);
            await user.type(customerNameInput, 'New Customer');

            const addressInput = screen.getByLabelText(/address/i);
            await user.type(addressInput, '789 New St, Sydney NSW 2000');

            // Select delivery person
            const personSelect = screen.getByLabelText(/delivery person/i);
            await user.selectOptions(personSelect, '1');

            // Submit form
            const submitButton = screen.getByRole('button', { name: /create/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCreateDeliveryAssignment).toHaveBeenCalled();
            });
        });

        it('should close create form on cancel', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Open create form
            const addButton = screen.getByRole('button', { name: /new delivery/i });
            await user.click(addButton);

            // Click cancel
            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            await waitFor(() => {
                expect(screen.queryByText(/Create Delivery Assignment/i)).not.toBeInTheDocument();
            });
        });
    });

    // =================================================================
    // Update Delivery Status Tests
    // =================================================================
    describe('Update Delivery Status', () => {
        it('should update delivery status when action button clicked', async () => {
            const user = userEvent.setup();
            mockUpdateDeliveryStatus.mockResolvedValue({
                ...mockDeliveries[0],
                status: 'picked-up',
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Find status update button (implementation specific)
            const statusButtons = screen.getAllByRole('button');
            const updateButton = statusButtons.find(btn => btn.textContent?.includes('Pick Up'));

            if (updateButton) {
                await user.click(updateButton);

                await waitFor(() => {
                    expect(mockUpdateDeliveryStatus).toHaveBeenCalledWith('1', 'picked-up');
                });
            }
        });
    });

    // =================================================================
    // Assign Delivery Person Tests
    // =================================================================
    describe('Assign Delivery Person', () => {
        it('should assign delivery person to unassigned delivery', async () => {
            const user = userEvent.setup();
            mockAssignDeliveryPerson.mockResolvedValue({
                ...mockDeliveries[1],
                deliveryPersonId: '1',
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Find assign button for unassigned delivery
            const assignButtons = screen.getAllByRole('button');
            const assignButton = assignButtons.find(btn => btn.textContent?.includes('Assign'));

            if (assignButton) {
                await user.click(assignButton);

                // Select delivery person from dropdown
                const personSelect = screen.getByRole('combobox');
                await user.selectOptions(personSelect, '1');

                await waitFor(() => {
                    expect(mockAssignDeliveryPerson).toHaveBeenCalledWith('2', '1');
                });
            }
        });
    });

    // =================================================================
    // Archive Functionality Tests
    // =================================================================
    describe('Archive Functionality', () => {
        it('should archive delivered delivery', async () => {
            const user = userEvent.setup();
            const deliveredDelivery = {
                ...mockDeliveries[0],
                status: 'delivered' as const,
            };

            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: [deliveredDelivery],
                deliveryPersons: mockDeliveryPersons,
                loading: false,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Find archive button
            const archiveButton = screen.getByLabelText(/archive/i);
            await user.click(archiveButton);

            await waitFor(() => {
                expect(screen.queryByText('Alice Brown')).not.toBeInTheDocument();
            });
        });

        it('should display archived deliveries in archived tab', async () => {
            const user = userEvent.setup();
            const deliveredDelivery = {
                ...mockDeliveries[0],
                status: 'delivered' as const,
            };

            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: [deliveredDelivery],
                deliveryPersons: mockDeliveryPersons,
                loading: false,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Archive delivery
            const archiveButton = screen.getByLabelText(/archive/i);
            await user.click(archiveButton);

            // Switch to archived tab
            const archivedTab = screen.getByText('Archived');
            await user.click(archivedTab);

            await waitFor(() => {
                expect(screen.getByText('Alice Brown')).toBeInTheDocument();
            });
        });

        it('should show empty state when no archived deliveries', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const archivedTab = screen.getByText('Archived');
            await user.click(archivedTab);

            await waitFor(() => {
                expect(screen.getByText(/No archived deliveries/i)).toBeInTheDocument();
            });
        });
    });

    // =================================================================
    // Close Panel Tests
    // =================================================================
    describe('Close Panel', () => {
        it('should call onClose when close button clicked', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const closeButton = screen.getByRole('button', { name: /close/i });
            await user.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when backdrop clicked', async () => {
            const user = userEvent.setup();
            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const backdrop = document.querySelector('.fixed.inset-0.bg-black');
            if (backdrop) {
                await user.click(backdrop);
                expect(mockOnClose).toHaveBeenCalled();
            }
        });
    });

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    describe('Edge Cases', () => {
        it('should handle empty delivery list', () => {
            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: [],
                deliveryPersons: mockDeliveryPersons,
                loading: false,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            expect(screen.getByText(/No deliveries/i)).toBeInTheDocument();
        });

        it('should handle empty delivery persons list', async () => {
            const user = userEvent.setup();
            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: mockDeliveries,
                deliveryPersons: [],
                loading: false,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            const personnelTab = screen.getByText('Personnel');
            await user.click(personnelTab);

            await waitFor(() => {
                expect(screen.getByText(/No delivery personnel/i)).toBeInTheDocument();
            });
        });

        it('should handle very long customer names', () => {
            const longNameDelivery = {
                ...mockDeliveries[0],
                customerName: 'A'.repeat(100),
            };

            vi.mocked(useDeliveryApi).mockReturnValue({
                deliveries: [longNameDelivery],
                deliveryPersons: mockDeliveryPersons,
                loading: false,
                error: null,
                isBackendConnected: true,
                createDeliveryAssignment: mockCreateDeliveryAssignment,
                updateDeliveryStatus: mockUpdateDeliveryStatus,
                assignDeliveryPerson: mockAssignDeliveryPerson,
                loadDeliveries: mockLoadDeliveries,
                loadDeliveryPersons: mockLoadDeliveryPersons,
            });

            render(<DeliveryManagementPanel isOpen={true} onClose={mockOnClose} />);

            // Should render without errors
            expect(screen.getByText(/^A+$/)).toBeInTheDocument();
        });
    });
});
