/**
 * User API Service
 * 
 * This service handles all user-related API operations for F102 User Management.
 * It provides a centralized interface for user CRUD operations, authentication,
 * and user status management.
 * 
 * Features:
 * - User CRUD operations
 * - User role and status management
 * - Authentication helpers
 * - Error handling and validation
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F102-UserManagement
 */

import { apiClient } from '../utils/apiClient';
import { User, UserRole, UserStatus } from '../types/user';

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * User creation request data
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: UserRole;
  profileImageUrl?: string;
}

/**
 * User update request data
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  status?: UserStatus;
}

/**
 * User search filters
 */
export interface UserSearchFilters {
  role?: UserRole;
  status?: UserStatus;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * User API response with pagination
 */
export interface UserListResponse {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// Mock Data
// =============================================================================

/**
 * Mock user data for fallback when backend is unavailable
 * This data is used during development and when backend is down
 */
const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'admin@lerestaurant.com',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+1234567890',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    lastLogin: '2024-01-15T09:30:00Z',
    profileImageUrl: '/images/admin-avatar.jpg'
  },
  {
    id: 2,
    email: 'manager@lerestaurant.com',
    firstName: 'John',
    lastName: 'Manager',
    phoneNumber: '+1234567891',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    lastLogin: '2024-01-15T07:45:00Z',
    profileImageUrl: '/images/manager-avatar.jpg'
  },
  {
    id: 3,
    email: 'staff@lerestaurant.com',
    firstName: 'Jane',
    lastName: 'Staff',
    phoneNumber: '+1234567892',
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T06:00:00Z',
    lastLogin: '2024-01-15T05:30:00Z',
    profileImageUrl: '/images/staff-avatar.jpg'
  },
  {
    id: 4,
    email: 'customer@example.com',
    firstName: 'Bob',
    lastName: 'Customer',
    phoneNumber: '+1234567893',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-14T20:00:00Z',
    lastLogin: '2024-01-14T19:15:00Z',
    profileImageUrl: '/images/customer-avatar.jpg'
  },
  {
    id: 5,
    email: 'inactive@example.com',
    firstName: 'Inactive',
    lastName: 'User',
    phoneNumber: '+1234567894',
    role: UserRole.CUSTOMER,
    status: UserStatus.INACTIVE,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-10T00:00:00Z',
    profileImageUrl: null
  }
];

// =============================================================================
// User API Service Class
// =============================================================================

/**
 * User API Service
 * 
 * Centralized service for all user-related API operations.
 * Handles CRUD operations, search, filtering, and user management.
 */
export class UserApiService {
  private static instance: UserApiService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): UserApiService {
    if (!UserApiService.instance) {
      UserApiService.instance = new UserApiService();
    }
    return UserApiService.instance;
  }

  /**
   * Get all users with optional filtering and pagination
   * 
   * @param filters - Search and filter criteria
   * @returns Promise<UserListResponse> - Paginated user list
   */
  public async getAllUsers(filters: UserSearchFilters = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<UserListResponse>(endpoint);
      
      return response;
    } catch (error) {
      console.warn('Failed to fetch users from API, using mock data:', error);
      return this.getMockUserList(filters);
    }
  }

  /**
   * Get user by ID
   * 
   * @param id - User ID
   * @returns Promise<User> - User data
   */
  public async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch user by ID from API, using mock data:', error);
      const mockUser = MOCK_USERS.find(user => user.id === id);
      if (!mockUser) {
        throw new Error(`User not found with id: ${id}`);
      }
      return mockUser;
    }
  }

  /**
   * Get user by email
   * 
   * @param email - User email
   * @returns Promise<User> - User data
   */
  public async getUserByEmail(email: string): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/email/${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch user by email from API, using mock data:', error);
      const mockUser = MOCK_USERS.find(user => user.email === email);
      if (!mockUser) {
        throw new Error(`User not found with email: ${email}`);
      }
      return mockUser;
    }
  }

  /**
   * Get users by role
   * 
   * @param role - User role
   * @returns Promise<User[]> - List of users with specified role
   */
  public async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`/users/role/${role}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch users by role from API, using mock data:', error);
      return MOCK_USERS.filter(user => user.role === role);
    }
  }

  /**
   * Get users by status
   * 
   * @param status - User status
   * @returns Promise<User[]> - List of users with specified status
   */
  public async getUsersByStatus(status: UserStatus): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`/users/status/${status}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch users by status from API, using mock data:', error);
      return MOCK_USERS.filter(user => user.status === status);
    }
  }

  /**
   * Create new user
   * 
   * @param userData - User creation data
   * @returns Promise<User> - Created user data
   */
  public async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>('/users', userData);
      return response;
    } catch (error) {
      console.warn('Failed to create user via API, using mock data:', error);
      // Create mock user
      const newUser: User = {
        id: Math.max(...MOCK_USERS.map(u => u.id)) + 1,
        ...userData,
        role: userData.role || UserRole.CUSTOMER, // Default to CUSTOMER if not provided
        status: UserStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
      };
      MOCK_USERS.push(newUser);
      return newUser;
    }
  }

  /**
   * Update user
   * 
   * @param id - User ID
   * @param userData - User update data
   * @returns Promise<User> - Updated user data
   */
  public async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.warn('Failed to update user via API, using mock data:', error);
      const userIndex = MOCK_USERS.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error(`User not found with id: ${id}`);
      }
      
      MOCK_USERS[userIndex] = {
        ...MOCK_USERS[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      
      return MOCK_USERS[userIndex];
    }
  }

  /**
   * Update user status
   * 
   * @param id - User ID
   * @param status - New status
   * @returns Promise<User> - Updated user data
   */
  public async updateUserStatus(id: number, status: UserStatus): Promise<User> {
    return this.updateUser(id, { status });
  }

  /**
   * Delete user
   * 
   * @param id - User ID
   * @returns Promise<void>
   */
  public async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.warn('Failed to delete user via API, using mock data:', error);
      const userIndex = MOCK_USERS.findIndex(user => user.id === id);
      if (userIndex === -1) {
        throw new Error(`User not found with id: ${id}`);
      }
      MOCK_USERS.splice(userIndex, 1);
    }
  }

  /**
   * Check if email exists
   * 
   * @param email - Email to check
   * @returns Promise<boolean> - Whether email exists
   */
  public async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ exists: boolean }>(`/users/check-email/${encodeURIComponent(email)}`);
      return response.exists;
    } catch (error) {
      console.warn('Failed to check email existence via API, using mock data:', error);
      return MOCK_USERS.some(user => user.email === email);
    }
  }

  /**
   * Get mock user list with filtering
   * 
   * @param filters - Filter criteria
   * @returns UserListResponse - Mock user list
   */
  private getMockUserList(filters: UserSearchFilters): UserListResponse {
    let filteredUsers = [...MOCK_USERS];

    // Apply filters
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      totalCount: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  }
}

// =============================================================================
// Export Singleton Instance
// =============================================================================

/**
 * Global user API service instance
 * Use this instance throughout the application
 */
export const userApiService = UserApiService.getInstance();
