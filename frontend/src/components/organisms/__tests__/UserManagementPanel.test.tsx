/**
 * Unit Tests for UserManagementPanel Component (F102)
 * 
 * This test suite demonstrates comprehensive testing of the UserManagementPanel
 * component, including rendering, user interactions, and CRUD operations.
 * 
 * @author Le Restaurant Development Team
 * @module F102-UserManagement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserManagementPanel } from '../UserManagementPanel';
import { UserRole, UserStatus } from '../../../types/user';

// Mock the useUserApi hook
vi.mock('../../../hooks/useUserApi', () => ({
  useUserApi: () => ({
    users: mockUsers,
    loading: false,
    error: null,
    isBackendConnected: true,
    loadUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  }),
}));

// Mock data
const mockUsers = [
  {
    id: 1,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '123-456-7890',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-20T15:30:00Z',
  },
  {
    id: 2,
    email: 'jane.admin@example.com',
    firstName: 'Jane',
    lastName: 'Admin',
    phoneNumber: '098-765-4321',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-10T09:00:00Z',
    lastLogin: '2024-01-21T11:00:00Z',
  },
];

describe('UserManagementPanel (F102)', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =================================================================
  // Rendering Tests
  // =================================================================
  describe('Rendering', () => {
    it('should render panel when isOpen is true', () => {
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('should not render panel when isOpen is false', () => {
      render(<UserManagementPanel isOpen={false} onClose={mockOnClose} />);
      
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
    });

    it('should display loading spinner while fetching data', () => {
      // Mock loading state
      vi.mocked(useUserApi).mockReturnValue({
        users: [],
        loading: true,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should show error message when API fails', () => {
      // Mock error state
      vi.mocked(useUserApi).mockReturnValue({
        users: [],
        loading: false,
        error: 'Failed to load users',
        isBackendConnected: false,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(/Using Mock Data/i)).toBeInTheDocument();
    });

    it('should display all users in table', () => {
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane.admin@example.com')).toBeInTheDocument();
    });
  });

  // =================================================================
  // User Interactions Tests
  // =================================================================
  describe('User Interactions', () => {
    it('should filter users by search term', async () => {
      const user = userEvent.setup();
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const searchInput = screen.getByPlaceholderText(/search users/i);
      await user.type(searchInput, 'john');
      
      await waitFor(() => {
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.queryByText('jane.admin@example.com')).not.toBeInTheDocument();
      });
    });

    it('should filter users by role', async () => {
      const user = userEvent.setup();
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const roleFilter = screen.getByLabelText(/filter by user role/i);
      await user.selectOptions(roleFilter, UserRole.ADMIN);
      
      await waitFor(() => {
        expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument();
        expect(screen.getByText('jane.admin@example.com')).toBeInTheDocument();
      });
    });

    it('should filter users by status', async () => {
      const user = userEvent.setup();
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const statusFilter = screen.getByLabelText(/filter by user status/i);
      await user.selectOptions(statusFilter, UserStatus.INACTIVE);
      
      await waitFor(() => {
        expect(screen.queryByText('john.doe@example.com')).not.toBeInTheDocument();
        expect(screen.queryByText('jane.admin@example.com')).not.toBeInTheDocument();
      });
    });

    it('should open create modal on add button click', async () => {
      const user = userEvent.setup();
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const addButton = screen.getByRole('button', { name: /add user/i });
      await user.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/create new user/i)).toBeInTheDocument();
      });
    });

    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // =================================================================
  // CRUD Operations Tests
  // =================================================================
  describe('CRUD Operations', () => {
    it('should create new user successfully', async () => {
      const user = userEvent.setup();
      const mockCreateUser = vi.fn();
      
      vi.mocked(useUserApi).mockReturnValue({
        users: mockUsers,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: mockCreateUser,
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Open create modal
      const addButton = screen.getByRole('button', { name: /add user/i });
      await user.click(addButton);
      
      // Fill form
      await user.type(screen.getByLabelText(/email/i), 'new@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.type(screen.getByLabelText(/first name/i), 'New');
      await user.type(screen.getByLabelText(/last name/i), 'User');
      await user.type(screen.getByLabelText(/phone/i), '111-222-3333');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith({
          email: 'new@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          phoneNumber: '111-222-3333',
          role: UserRole.CUSTOMER,
        });
      });
    });

    it('should update existing user', async () => {
      const user = userEvent.setup();
      const mockUpdateUser = vi.fn();
      
      vi.mocked(useUserApi).mockReturnValue({
        users: mockUsers,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: mockUpdateUser,
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Click edit button for first user
      const editButtons = screen.getAllByLabelText(/edit user/i);
      await user.click(editButtons[0]);
      
      // Update email
      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'updated@example.com');
      
      // Submit form
      const updateButton = screen.getByRole('button', { name: /update/i });
      await user.click(updateButton);
      
      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(1, expect.objectContaining({
          email: 'updated@example.com',
        }));
      });
    });

    it('should delete user with confirmation', async () => {
      const user = userEvent.setup();
      const mockDeleteUser = vi.fn();
      
      // Mock window.confirm
      global.confirm = vi.fn(() => true);
      
      vi.mocked(useUserApi).mockReturnValue({
        users: mockUsers,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: mockDeleteUser,
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Click delete button for first user
      const deleteButtons = screen.getAllByLabelText(/delete user/i);
      await user.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(global.confirm).toHaveBeenCalledWith(
          'Are you sure you want to delete this user?'
        );
        expect(mockDeleteUser).toHaveBeenCalledWith(1);
      });
    });

    it('should not delete user if confirmation cancelled', async () => {
      const user = userEvent.setup();
      const mockDeleteUser = vi.fn();
      
      // Mock window.confirm to return false
      global.confirm = vi.fn(() => false);
      
      vi.mocked(useUserApi).mockReturnValue({
        users: mockUsers,
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: mockDeleteUser,
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete user/i);
      await user.click(deleteButtons[0]);
      
      expect(mockDeleteUser).not.toHaveBeenCalled();
    });
  });

  // =================================================================
  // Accessibility Tests
  // =================================================================
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByLabelText(/filter by user role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by user status/i)).toBeInTheDocument();
    });

    it('should have accessible table structure', () => {
      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = within(table).getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
    });
  });

  // =================================================================
  // Edge Cases Tests
  // =================================================================
  describe('Edge Cases', () => {
    it('should handle empty user list', () => {
      vi.mocked(useUserApi).mockReturnValue({
        users: [],
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(/showing 0 of 0 users/i)).toBeInTheDocument();
    });

    it('should handle very long user names', () => {
      const longNameUser = {
        ...mockUsers[0],
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100),
      };

      vi.mocked(useUserApi).mockReturnValue({
        users: [longNameUser],
        loading: false,
        error: null,
        isBackendConnected: true,
        loadUsers: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
      });

      render(<UserManagementPanel isOpen={true} onClose={mockOnClose} />);
      
      // Should render without errors
      expect(screen.getByText(longNameUser.email)).toBeInTheDocument();
    });
  });
});
