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
 * 
 * @author Le Restaurant Development Team
 * @version 2.0.0
 * @since 2024-01-15
 * @module F102-UserManagement
 */

import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';
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

  private constructor() { }

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
    const queryParams = new URLSearchParams();

    if (filters.role) queryParams.append('role', filters.role);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const endpoint = `${API_ENDPOINTS.users.base}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<UserListResponse>(endpoint);
    return response;
  }

  /**
   * Get user by ID
   * 
   * @param id - User ID
   * @returns Promise<User> - User data
   */
  public async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.users.byId(id));
    return response;
  }

  /**
   * Get user by email
   * 
   * @param email - User email
   * @returns Promise<User> - User data
   */
  public async getUserByEmail(email: string): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.users.byEmail(email));
    return response;
  }

  /**
   * Get users by role
   * 
   * @param role - User role
   * @returns Promise<User[]> - List of users with specified role
   */
  public async getUsersByRole(role: UserRole): Promise<User[]> {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.users.byRole(role));
    return response;
  }

  /**
   * Get users by status
   * 
   * @param status - User status
   * @returns Promise<User[]> - List of users with specified status
   */
  public async getUsersByStatus(status: UserStatus): Promise<User[]> {
    const response = await apiClient.get<User[]>(API_ENDPOINTS.users.byStatus(status));
    return response;
  }

  /**
   * Create new user
   * 
   * @param userData - User creation data
   * @returns Promise<User> - Created user data
   */
  public async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>(API_ENDPOINTS.users.base, userData);
    return response;
  }

  /**
   * Update user
   * 
   * @param id - User ID
   * @param userData - User update data
   * @returns Promise<User> - Updated user data
   */
  public async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(API_ENDPOINTS.users.byId(id), userData);
    return response;
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
    await apiClient.delete(API_ENDPOINTS.users.byId(id));
  }

  /**
   * Check if email exists
   * 
   * @param email - Email to check
   * @returns Promise<boolean> - Whether email exists
   */
  public async checkEmailExists(email: string): Promise<boolean> {
    const response = await apiClient.get<{ exists: boolean }>(
      API_ENDPOINTS.users.checkEmail(email)
    );
    return response.exists;
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
