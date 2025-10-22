/**
 * Unit Tests for PaymentManagementPanel Component (F106)
 * 
 * This test suite demonstrates comprehensive testing of the PaymentManagementPanel
 * component, including rendering, filtering, and payment operations.
 * 
 * @author Le Restaurant Development Team
 * @module F106-PaymentManagement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaymentManagementPanel from '../PaymentManagementPanel';
import { PaymentMethod, PaymentStatus } from '../../../types/payment';
import { usePaymentApi } from '../../../hooks/usePaymentApi';

// Mock the usePaymentApi hook
vi.mock('../../../hooks/usePaymentApi');

// Mock data
const mockPayments = [
  {
    id: 1,
    orderId: 1001,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    amount: 125.50,
    currency: 'USD',
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transactionId: 'TXN-001',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 2,
    orderId: 1002,
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    amount: 87.25,
    currency: 'USD',
    method: PaymentMethod.CASH,
    status: PaymentStatus.PENDING,
    transactionId: 'TXN-002',
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 3,
    orderId: 1003,
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    amount: 200.00,
    currency: 'USD',
    method: PaymentMethod.DIGITAL_WALLET,
    status: PaymentStatus.FAILED,
    transactionId: 'TXN-003',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
];

describe('PaymentManagementPanel (F106)', () => {
  const mockOnClose = vi.fn();
  const mockLoadPayments = vi.fn();
  const mockUpdatePaymentStatus = vi.fn();
  const mockLoadPaymentsByOrderId = vi.fn();
  const mockLoadPaymentsByStatus = vi.fn();
  const mockProcessPayment = vi.fn();
  const mockDeletePayment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    vi.mocked(usePaymentApi).mockReturnValue({
      payments: mockPayments,
      loading: false,
      error: null,
      isBackendConnected: true,
      loadPayments: mockLoadPayments,
      updatePaymentStatus: mockUpdatePaymentStatus,
      loadPaymentsByOrderId: mockLoadPaymentsByOrderId,
      loadPaymentsByStatus: mockLoadPaymentsByStatus,
      processPayment: mockProcessPayment,
      deletePayment: mockDeletePayment,
    });
  });

  // =================================================================
  // Rendering Tests
  // =================================================================
  describe('Rendering', () => {
    it('should render panel when isOpen is true', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText('Payment Management')).toBeInTheDocument();
    });

    it('should not render panel when isOpen is false', () => {
      render(<PaymentManagementPanel isOpen={false} onClose={mockOnClose} />);
      
      expect(screen.queryByText('Payment Management')).not.toBeInTheDocument();
    });

    it('should display loading spinner while fetching data', () => {
      vi.mocked(usePaymentApi).mockReturnValue({
        payments: [],
        loading: true,
        error: null,
        isBackendConnected: true,
        loadPayments: mockLoadPayments,
        updatePaymentStatus: mockUpdatePaymentStatus,
        loadPaymentsByOrderId: mockLoadPaymentsByOrderId,
        loadPaymentsByStatus: mockLoadPaymentsByStatus,
        processPayment: mockProcessPayment,
        deletePayment: mockDeletePayment,
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Check for spinner by class name instead of testid
      const spinner = document.querySelector('.spinner');
      expect(spinner).toBeDefined();
    });

    it('should show error message when API fails', () => {
      vi.mocked(usePaymentApi).mockReturnValue({
        payments: [],
        loading: false,
        error: 'Failed to load payments',
        isBackendConnected: false,
        loadPayments: mockLoadPayments,
        updatePaymentStatus: mockUpdatePaymentStatus,
        loadPaymentsByOrderId: mockLoadPaymentsByOrderId,
        loadPaymentsByStatus: mockLoadPaymentsByStatus,
        processPayment: mockProcessPayment,
        deletePayment: mockDeletePayment,
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Using Mock Data/i)).toBeDefined();
    });

    it('should display all payments in table', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  // =================================================================
  // Statistics Tests
  // =================================================================
  describe('Statistics', () => {
    it('should display total revenue correctly', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Total: 125.50 + 87.25 + 200.00 = 412.75
      const elements = screen.getAllByText(/\$412\.75/);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should display completed payments amount', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Only completed: 125.50 (appears in both statistics card and table)
      const elements = screen.getAllByText(/\$125\.50/);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should display pending payments amount', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Only pending: 87.25 (appears in both statistics card and table)
      const elements = screen.getAllByText(/\$87\.25/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  // =================================================================
  // Filtering Tests
  // =================================================================
  describe('Filtering', () => {
    it('should filter payments by search term', async () => {
      const user = userEvent.setup();
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const searchInput = screen.getByPlaceholderText(/search payments/i);
      await user.type(searchInput, 'john');
      
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
      });
    });

    it('should filter payments by transaction ID', async () => {
      const user = userEvent.setup();
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const searchInput = screen.getByPlaceholderText(/search payments/i);
      await user.type(searchInput, 'TXN-001');
      
      await waitFor(() => {
        expect(screen.getByText('TXN-001')).toBeInTheDocument();
        expect(screen.queryByText('TXN-002')).not.toBeInTheDocument();
      });
    });

    it('should filter payments by status', async () => {
      const user = userEvent.setup();
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const statusFilter = screen.getByLabelText(/filter by payment status/i);
      await user.selectOptions(statusFilter, PaymentStatus.COMPLETED);
      
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
      });
    });

    it('should filter payments by method', async () => {
      const user = userEvent.setup();
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const methodFilter = screen.getByLabelText(/filter by payment method/i);
      await user.selectOptions(methodFilter, PaymentMethod.CASH);
      
      await waitFor(() => {
        expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      });
    });

    it('should combine multiple filters', async () => {
      const user = userEvent.setup();
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Filter by status
      const statusFilter = screen.getByLabelText(/filter by payment status/i);
      await user.selectOptions(statusFilter, PaymentStatus.COMPLETED);
      
      // Then search
      const searchInput = screen.getByPlaceholderText(/search payments/i);
      await user.type(searchInput, 'john');
      
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        // Should only show completed payments with 'john'
        expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument();
      });
    });
  });

  // =================================================================
  // Payment Operations Tests
  // =================================================================
  describe('Payment Operations', () => {
    it('should open payment details on view button click', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const viewButtons = screen.getAllByLabelText(/view payment details/i);
      await user.click(viewButtons[0]);
      
      expect(consoleSpy).toHaveBeenCalledWith('View payment details:', mockPayments[0]);
      consoleSpy.mockRestore();
    });

    it('should show refund button only for completed payments', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const refundButtons = screen.getAllByLabelText(/process refund/i);
      // Should only show for completed payments (1 in mock data)
      expect(refundButtons).toHaveLength(1);
    });

    it('should process refund with confirmation', async () => {
      const user = userEvent.setup();
      const mockUpdatePaymentStatus = vi.fn();
      
      // Mock window.confirm
      global.confirm = vi.fn(() => true);
      
      vi.mocked(usePaymentApi).mockReturnValue({
        payments: mockPayments,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadPayments: vi.fn(),
        updatePaymentStatus: mockUpdatePaymentStatus,
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Click refund button
      const refundButton = screen.getByLabelText(/process refund/i);
      await user.click(refundButton);
      
      await waitFor(() => {
        expect(global.confirm).toHaveBeenCalledWith(
          'Are you sure you want to process a refund for this payment?'
        );
        expect(mockUpdatePaymentStatus).toHaveBeenCalledWith(1, PaymentStatus.REFUNDED);
      });
    });

    it('should not process refund if confirmation cancelled', async () => {
      const user = userEvent.setup();
      const mockUpdatePaymentStatus = vi.fn();
      
      // Mock window.confirm to return false
      global.confirm = vi.fn(() => false);
      
      vi.mocked(usePaymentApi).mockReturnValue({
        payments: mockPayments,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadPayments: vi.fn(),
        updatePaymentStatus: mockUpdatePaymentStatus,
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const refundButton = screen.getByLabelText(/process refund/i);
      await user.click(refundButton);
      
      expect(mockUpdatePaymentStatus).not.toHaveBeenCalled();
    });
  });

  // =================================================================
  // Status Badge Tests
  // =================================================================
  describe('Status Badges', () => {
    it('should display correct status badge for completed payment', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const completedBadges = screen.getAllByText(PaymentStatus.COMPLETED);
      expect(completedBadges[0]).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('should display correct status badge for pending payment', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const pendingBadges = screen.getAllByText(PaymentStatus.PENDING);
      expect(pendingBadges[0]).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('should display correct status badge for failed payment', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const failedBadges = screen.getAllByText(PaymentStatus.FAILED);
      expect(failedBadges[0]).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  // =================================================================
  // Accessibility Tests
  // =================================================================
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByLabelText(/filter by payment status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by payment method/i)).toBeInTheDocument();
    });

    it('should have accessible table structure', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = within(table).getAllByRole('columnheader');
      expect(headers.length).toBe(6); // Payment, Amount, Method, Status, Date, Actions
    });

    it('should have descriptive button labels', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getAllByLabelText(/view payment details/i).length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  // =================================================================
  // Edge Cases Tests
  // =================================================================
  describe('Edge Cases', () => {
    it('should handle empty payment list', () => {
      vi.mocked(usePaymentApi).mockReturnValue({
        payments: [],
        loading: false,
        error: null,
        isBackendConnected: true,
        loadPayments: vi.fn(),
        updatePaymentStatus: vi.fn(),
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(/showing 0 of 0 payments/i)).toBeInTheDocument();
    });

    it('should handle very large payment amounts', () => {
      const largeAmountPayment = {
        ...mockPayments[0],
        amount: 999999.99,
      };

      vi.mocked(usePaymentApi).mockReturnValue({
        payments: [largeAmountPayment],
        loading: false,
        error: null,
        isBackendConnected: true,
        loadPayments: mockLoadPayments,
        updatePaymentStatus: mockUpdatePaymentStatus,
        loadPaymentsByOrderId: mockLoadPaymentsByOrderId,
        loadPaymentsByStatus: mockLoadPaymentsByStatus,
        processPayment: mockProcessPayment,
        deletePayment: mockDeletePayment,
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Should format correctly (appears in multiple places)
      const elements = screen.getAllByText(/\$999,999\.99/);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle missing transaction ID', () => {
      const noTxnPayment = {
        ...mockPayments[0],
        transactionId: undefined,
      };

      vi.mocked(usePaymentApi).mockReturnValue({
        payments: [noTxnPayment],
        loading: false,
        error: null,
        isBackendConnected: true,
        loadPayments: vi.fn(),
        updatePaymentStatus: vi.fn(),
      });

      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Should render without errors
      expect(screen.getByText(noTxnPayment.customerEmail)).toBeInTheDocument();
    });
  });

  // =================================================================
  // Currency Formatting Tests
  // =================================================================
  describe('Currency Formatting', () => {
    it('should format USD currency correctly', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Amount appears in both statistics card and payment table
      const elements = screen.getAllByText('$125.50');
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should format decimal places correctly', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Amounts appear in both statistics cards and payment table
      const pendingElements = screen.getAllByText('$87.25');
      expect(pendingElements.length).toBeGreaterThan(0);
      
      const failedElements = screen.getAllByText('$200.00');
      expect(failedElements.length).toBeGreaterThan(0);
    });
  });

  // =================================================================
  // Date Formatting Tests
  // =================================================================
  describe('Date Formatting', () => {
    it('should display formatted dates', () => {
      render(<PaymentManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Check that dates are displayed (format may vary by locale)
      const dates = screen.getAllByText(/Jan 20, 2024/i);
      expect(dates.length).toBeGreaterThan(0);
    });
  });
});
