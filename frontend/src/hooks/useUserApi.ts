/**
 * User Management API Hook (F102)
 * 
 * This hook provides comprehensive user management functionality for F102 User Management.
 * It uses the centralized UserApiService and provides a clean interface for React components.
 * 
 * Features:
 * - User CRUD operations
 * - User search and filtering
 * - Role and status management
 * - Pagination support
 * - Error handling and loading states
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F102-UserManagement
 */

import { useState, useCallback } from 'react';
import { User, UserRole, UserStatus } from '../types/user';
import { useApiList, useApiItem } from './useApiBase';
import { 
  userApiService, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserSearchFilters,
  UserListResponse 
} from '../services/userApiService';

// =============================================================================
// User List Management Hook
// =============================================================================

/**
 * Hook for managing user lists with search, filtering, and pagination
 * 
 * @returns User list management functions and state
 */
export const useUserList = () => {
  const apiHook = useApiList<User>();
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalCount: 0,
  });

  /**
   * Load users with current filters and pagination
   */
  const loadUsers = useCallback(async (customFilters?: UserSearchFilters) => {
    const currentFilters = { ...filters, ...customFilters };
    setFilters(currentFilters);

    await apiHook.executeOperation(
      async () => {
        const response = await userApiService.getAllUsers(currentFilters);
        return response.users; // Extract users array from response
      },
      true, // Use mock data on failure
      async () => {
        // Mock data fallback
        const mockResponse = userApiService['getMockUserList'](currentFilters);
        return mockResponse.users; // Extract users array from response
      }
    );

    // Update pagination state
    if (apiHook.data) {
      const response = apiHook.data as unknown as UserListResponse;
      setPagination({
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Search users by term
   */
  const searchUsers = useCallback((searchTerm: string) => {
    loadUsers({ searchTerm });
  }, [loadUsers]);

  /**
   * Filter users by role
   */
  const filterByRole = useCallback((role: UserRole) => {
    loadUsers({ role });
  }, [loadUsers]);

  /**
   * Filter users by status
   */
  const filterByStatus = useCallback((status: UserStatus) => {
    loadUsers({ status });
  }, [loadUsers]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    loadUsers({});
  }, [loadUsers]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page: number) => {
    loadUsers({ page });
  }, [loadUsers]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((limit: number) => {
    loadUsers({ limit, page: 1 });
  }, [loadUsers]);

  return {
    // State
    users: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    filters,
    pagination,
    
    // Actions
    loadUsers,
    searchUsers,
    filterByRole,
    filterByStatus,
    clearFilters,
    goToPage,
    changePageSize,
    refresh: loadUsers,
  };
};

// =============================================================================
// Single User Management Hook
// =============================================================================

/**
 * Hook for managing individual user operations
 * 
 * @returns Single user management functions and state
 */
export const useUser = () => {
  const apiHook = useApiItem<User>();

  /**
   * Load user by ID
   */
  const loadUserById = useCallback(async (id: number) => {
    await apiHook.executeOperation(
      () => userApiService.getUserById(id),
      true, // Use mock data on failure
      () => userApiService.getUserById(id) // This will use mock data
    );
  }, [apiHook]);

  /**
   * Load user by email
   */
  const loadUserByEmail = useCallback(async (email: string) => {
    await apiHook.executeOperation(
      () => userApiService.getUserByEmail(email),
      true, // Use mock data on failure
      () => userApiService.getUserByEmail(email) // This will use mock data
    );
  }, [apiHook]);

  /**
   * Create new user
   */
  const createUser = useCallback(async (userData: CreateUserRequest) => {
    const result = await apiHook.executeOperationWithoutData(
      async () => {
        const newUser = await userApiService.createUser(userData);
        apiHook.setData(newUser);
      }
    );
    return result;
  }, [apiHook]);

  /**
   * Update user
   */
  const updateUser = useCallback(async (id: number, userData: UpdateUserRequest) => {
    const result = await apiHook.executeOperationWithoutData(
      async () => {
        const updatedUser = await userApiService.updateUser(id, userData);
        apiHook.setData(updatedUser);
      }
    );
    return result;
  }, [apiHook]);

  /**
   * Update user status
   */
  const updateUserStatus = useCallback(async (id: number, status: UserStatus) => {
    return updateUser(id, { status });
  }, [updateUser]);

  /**
   * Delete user
   */
  const deleteUser = useCallback(async (id: number) => {
    const result = await apiHook.executeOperationWithoutData(
      () => userApiService.deleteUser(id)
    );
    return result;
  }, [apiHook]);

  return {
    // State
    user: apiHook.item,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    hasUser: apiHook.hasItem,
    
    // Actions
    loadUserById,
    loadUserByEmail,
    createUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    clearError: apiHook.clearError,
    reset: apiHook.reset,
  };
};

// =============================================================================
// User Role Management Hook
// =============================================================================

/**
 * Hook for managing users by role
 * 
 * @returns Role-specific user management functions and state
 */
export const useUsersByRole = () => {
  const apiHook = useApiList<User>();
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  /**
   * Load users by role
   */
  const loadUsersByRole = useCallback(async (role: UserRole) => {
    setCurrentRole(role);
    await apiHook.executeOperation(
      () => userApiService.getUsersByRole(role),
      true, // Use mock data on failure
      () => userApiService.getUsersByRole(role) // This will use mock data
    );
  }, [apiHook]);

  return {
    // State
    users: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    currentRole,
    
    // Actions
    loadUsersByRole,
    refresh: () => currentRole && loadUsersByRole(currentRole),
  };
};

// =============================================================================
// User Status Management Hook
// =============================================================================

/**
 * Hook for managing users by status
 * 
 * @returns Status-specific user management functions and state
 */
export const useUsersByStatus = () => {
  const apiHook = useApiList<User>();
  const [currentStatus, setCurrentStatus] = useState<UserStatus | null>(null);

  /**
   * Load users by status
   */
  const loadUsersByStatus = useCallback(async (status: UserStatus) => {
    setCurrentStatus(status);
    await apiHook.executeOperation(
      () => userApiService.getUsersByStatus(status),
      true, // Use mock data on failure
      () => userApiService.getUsersByStatus(status) // This will use mock data
    );
  }, [apiHook]);

  return {
    // State
    users: apiHook.items,
    loading: apiHook.loading,
    error: apiHook.error,
    isBackendConnected: apiHook.isBackendConnected,
    currentStatus,
    
    // Actions
    loadUsersByStatus,
    refresh: () => currentStatus && loadUsersByStatus(currentStatus),
  };
};

// =============================================================================
// Legacy Hook (for backward compatibility)
// =============================================================================

/**
 * Legacy user API hook for backward compatibility
 * @deprecated Use useUserList, useUser, useUsersByRole, or useUsersByStatus instead
 */
export const useUserApi = () => {
  const userListHook = useUserList();
  const userHook = useUser();

  return {
    // Legacy state
    users: userListHook.users,
    loading: userListHook.loading || userHook.loading,
    error: userListHook.error || userHook.error,
    isBackendConnected: userListHook.isBackendConnected,
    
    // Legacy functions
    loadUsers: userListHook.loadUsers,
    loadUserById: userHook.loadUserById,
    loadUserByEmail: userHook.loadUserByEmail,
    createUser: userHook.createUser,
    updateUser: userHook.updateUser,
    updateUserStatus: userHook.updateUserStatus,
    deleteUser: userHook.deleteUser,
  };
};