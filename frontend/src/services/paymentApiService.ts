/**
 * Payment API Service
 * 
 * This service handles all payment-related API operations for F106 Payment Management.
 * It provides a centralized interface for payment CRUD operations, status management,
 * and payment processing.
 * 
 * Features:
 * - Payment CRUD operations
 * - Payment status management
 * - Payment processing and validation
 * - Transaction tracking
 * - Error handling and validation
 * - Mock data fallback
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 * @module F106-PaymentManagement
 */

import { apiClient } from '../services/apiClient.unified';
import { API_ENDPOINTS } from '../config/api.config';
import { Payment, PaymentMethod, PaymentStatus } from '../types/payment';

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * Payment creation request data
 */
export interface CreatePaymentRequest {
  orderId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  paymentDetails?: Record<string, any>;
  customerEmail: string;
  customerName: string;
}

/**
 * Payment update request data
 */
export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  paymentDetails?: Record<string, any>;
  gatewayResponse?: string;
}

/**
 * Payment search filters
 */
export interface PaymentSearchFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  orderId?: number;
  customerEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * Payment API response with pagination
 */
export interface PaymentListResponse {
  payments: Payment[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  totalAmount: number;
  summary: {
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
  };
}

/**
 * Payment processing result
 */
export interface PaymentProcessingResult {
  success: boolean;
  transactionId?: string;
  gatewayResponse?: string;
  error?: string;
}

// =============================================================================
// Mock Data
// =============================================================================

/**
 * Mock payment data for fallback when backend is unavailable
 * This data is used during development and when backend is down
 */
const MOCK_PAYMENTS: Payment[] = [
  {
    id: 1,
    orderId: 1001,
    amount: 45.99,
    currency: 'USD',
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    transactionId: 'txn_123456789',
    processedAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:25:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    customerEmail: 'customer@example.com',
    customerName: 'John Doe'
  },
  {
    id: 2,
    orderId: 1002,
    amount: 32.50,
    currency: 'USD',
    method: PaymentMethod.DEBIT_CARD,
    status: PaymentStatus.PROCESSING,
    transactionId: 'txn_987654321',
    processedAt: undefined,
    createdAt: '2024-01-15T11:15:00Z',
    updatedAt: '2024-01-15T11:15:00Z',
    customerEmail: 'jane@example.com',
    customerName: 'Jane Smith'
  },
  {
    id: 3,
    orderId: 1003,
    amount: 28.75,
    currency: 'USD',
    method: PaymentMethod.CASH,
    status: PaymentStatus.PENDING,
    transactionId: undefined,
    processedAt: undefined,
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    customerEmail: 'bob@example.com',
    customerName: 'Bob Johnson'
  },
  {
    id: 4,
    orderId: 1004,
    amount: 67.25,
    currency: 'USD',
    method: PaymentMethod.DIGITAL_WALLET,
    status: PaymentStatus.FAILED,
    transactionId: 'txn_failed_123',
    processedAt: undefined,
    createdAt: '2024-01-15T13:30:00Z',
    updatedAt: '2024-01-15T13:35:00Z',
    customerEmail: 'alice@example.com',
    customerName: 'Alice Brown'
  },
  {
    id: 5,
    orderId: 1005,
    amount: 89.99,
    currency: 'USD',
    method: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.REFUNDED,
    transactionId: 'txn_refund_456',
    processedAt: '2024-01-15T14:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    customerEmail: 'charlie@example.com',
    customerName: 'Charlie Wilson'
  }
];

// =============================================================================
// Payment API Service Class
// =============================================================================

/**
 * Payment API Service
 * 
 * Centralized service for all payment-related API operations.
 * Handles CRUD operations, payment processing, status management, and reporting.
 */
export class PaymentApiService {
  private static instance: PaymentApiService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): PaymentApiService {
    if (!PaymentApiService.instance) {
      PaymentApiService.instance = new PaymentApiService();
    }
    return PaymentApiService.instance;
  }

  /**
   * Get all payments with optional filtering and pagination
   * 
   * @param filters - Search and filter criteria
   * @returns Promise<PaymentListResponse> - Paginated payment list with summary
   */
  public async getAllPayments(filters: PaymentSearchFilters = {}): Promise<PaymentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.method) queryParams.append('method', filters.method);
      if (filters.orderId) queryParams.append('orderId', filters.orderId.toString());
      if (filters.customerEmail) queryParams.append('customerEmail', filters.customerEmail);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());

      const endpoint = `${API_ENDPOINTS.payments.base}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<PaymentListResponse>(endpoint);
      
      return response;
    } catch (error) {
      console.warn('Failed to fetch payments from API, using mock data:', error);
      return this.getMockPaymentList(filters);
    }
  }

  /**
   * Get payment by ID
   * 
   * @param id - Payment ID
   * @returns Promise<Payment> - Payment data
   */
  public async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await apiClient.get<Payment>(API_ENDPOINTS.payments.byId(id));
      return response;
    } catch (error) {
      console.warn('Failed to fetch payment by ID from API, using mock data:', error);
      const mockPayment = MOCK_PAYMENTS.find(payment => payment.id === id);
      if (!mockPayment) {
        throw new Error(`Payment not found with id: ${id}`);
      }
      return mockPayment;
    }
  }

  /**
   * Get payments by order ID
   * 
   * @param orderId - Order ID
   * @returns Promise<Payment[]> - List of payments for the order
   */
  public async getPaymentsByOrderId(orderId: number): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(API_ENDPOINTS.payments.byOrder(orderId));
      return response;
    } catch (error) {
      console.warn('Failed to fetch payments by order ID from API, using mock data:', error);
      return MOCK_PAYMENTS.filter(payment => payment.orderId === orderId);
    }
  }

  /**
   * Get payments by status
   * 
   * @param status - Payment status
   * @returns Promise<Payment[]> - List of payments with specified status
   */
  public async getPaymentsByStatus(status: PaymentStatus): Promise<Payment[]> {
    try {
      const response = await apiClient.get<Payment[]>(API_ENDPOINTS.payments.byStatus(status));
      return response;
    } catch (error) {
      console.warn('Failed to fetch payments by status from API, using mock data:', error);
      return MOCK_PAYMENTS.filter(payment => payment.status === status);
    }
  }

  /**
   * Create new payment
   * 
   * @param paymentData - Payment creation data
   * @returns Promise<Payment> - Created payment data
   */
  public async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    try {
      // Transform frontend data to backend format
      // Map frontend PaymentMethod enum to backend enum
      const methodMapping: Record<string, string> = {
        'credit_card': 'CREDIT_CARD',
        'debit_card': 'DEBIT_CARD',
        'cash': 'CASH',
        'bank_transfer': 'CASH', // Backend doesn't have BANK_TRANSFER, map to CASH
        'digital_wallet': 'DIGITAL_WALLET',
      };
      
      const backendRequest = {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: methodMapping[paymentData.method] || 'CREDIT_CARD',
        paymentDetails: paymentData.paymentDetails 
          ? JSON.stringify(paymentData.paymentDetails)
          : JSON.stringify({ method: paymentData.method }),
      };
      
      const response = await apiClient.post<any>(API_ENDPOINTS.payments.base, backendRequest);
      
      // Map backend response to frontend Payment type
      // Backend returns PaymentDto which may have different field names
      return {
        id: response.id,
        orderId: response.orderId,
        amount: typeof response.amount === 'number' ? response.amount : parseFloat(response.amount),
        currency: paymentData.currency || 'USD',
        method: paymentData.method, // Keep frontend enum format
        status: response.status?.toLowerCase() || PaymentStatus.PENDING,
        transactionId: response.transactionId,
        processedAt: response.processedAt,
        createdAt: response.paymentTime || new Date().toISOString(),
        updatedAt: response.processedAt || new Date().toISOString(),
        customerEmail: response.customerEmail || paymentData.customerEmail,
        customerName: response.customerName || paymentData.customerName,
        customerId: response.customerId,
      };
    } catch (error) {
      console.warn('Failed to create payment via API, using mock data:', error);
      // Create mock payment
      const newPayment: Payment = {
        id: Math.max(...MOCK_PAYMENTS.map(p => p.id), 0) + 1,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',
        method: paymentData.method,
        status: PaymentStatus.PENDING,
        transactionId: undefined,
        processedAt: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
      };
      MOCK_PAYMENTS.push(newPayment);
      return newPayment;
    }
  }

  /**
   * Update payment
   * 
   * @param id - Payment ID
   * @param paymentData - Payment update data
   * @returns Promise<Payment> - Updated payment data
   */
  public async updatePayment(id: number, paymentData: UpdatePaymentRequest): Promise<Payment> {
    try {
      const response = await apiClient.put<Payment>(API_ENDPOINTS.payments.byId(id), paymentData);
      return response;
    } catch (error) {
      console.warn('Failed to update payment via API, using mock data:', error);
      const paymentIndex = MOCK_PAYMENTS.findIndex(payment => payment.id === id);
      if (paymentIndex === -1) {
        throw new Error(`Payment not found with id: ${id}`);
      }
      
      MOCK_PAYMENTS[paymentIndex] = {
        ...MOCK_PAYMENTS[paymentIndex],
        ...paymentData,
        updatedAt: new Date().toISOString(),
      };
      
      return MOCK_PAYMENTS[paymentIndex];
    }
  }

  /**
   * Update payment status
   * 
   * @param id - Payment ID
   * @param status - New status
   * @returns Promise<Payment> - Updated payment data
   */
  public async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment> {
    return this.updatePayment(id, { status });
  }

  /**
   * Process payment
   * 
   * @param id - Payment ID
   * @returns Promise<PaymentProcessingResult> - Processing result
   */
  public async processPayment(id: number): Promise<PaymentProcessingResult> {
    try {
      const response = await apiClient.post<PaymentProcessingResult>(API_ENDPOINTS.payments.process(id));
      return response;
    } catch (error) {
      console.warn('Failed to process payment via API, using mock processing:', error);
      
      // Mock payment processing
      const paymentIndex = MOCK_PAYMENTS.findIndex(payment => payment.id === id);
      if (paymentIndex === -1) {
        throw new Error(`Payment not found with id: ${id}`);
      }

      const payment = MOCK_PAYMENTS[paymentIndex];
      
      // Simulate processing based on payment method
      const isSuccessful = this.simulatePaymentProcessing(payment.method);
      
      if (isSuccessful) {
        MOCK_PAYMENTS[paymentIndex] = {
          ...payment,
          status: PaymentStatus.COMPLETED,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return {
          success: true,
          transactionId: MOCK_PAYMENTS[paymentIndex].transactionId,
          gatewayResponse: 'Payment processed successfully',
        };
      } else {
        MOCK_PAYMENTS[paymentIndex] = {
          ...payment,
          status: PaymentStatus.FAILED,
          updatedAt: new Date().toISOString(),
        };
        
        return {
          success: false,
          error: 'Payment processing failed',
        };
      }
    }
  }

  /**
   * Refund payment
   * 
   * @param id - Payment ID
   * @param amount - Refund amount (optional, defaults to full amount)
   * @returns Promise<Payment> - Updated payment data
   */
  public async refundPayment(id: number, amount?: number): Promise<Payment> {
    try {
      const response = await apiClient.post<Payment>(API_ENDPOINTS.payments.refund(id), { amount });
      return response;
    } catch (error) {
      console.warn('Failed to refund payment via API, using mock refund:', error);
      
      const paymentIndex = MOCK_PAYMENTS.findIndex(payment => payment.id === id);
      if (paymentIndex === -1) {
        throw new Error(`Payment not found with id: ${id}`);
      }

      MOCK_PAYMENTS[paymentIndex] = {
        ...MOCK_PAYMENTS[paymentIndex],
        status: PaymentStatus.REFUNDED,
        updatedAt: new Date().toISOString(),
      };
      
      return MOCK_PAYMENTS[paymentIndex];
    }
  }

  /**
   * Delete payment
   * 
   * @param id - Payment ID
   * @returns Promise<void>
   */
  public async deletePayment(id: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.payments.byId(id));
    } catch (error) {
      console.warn('Failed to delete payment via API, using mock deletion:', error);
      const paymentIndex = MOCK_PAYMENTS.findIndex(payment => payment.id === id);
      if (paymentIndex === -1) {
        throw new Error(`Payment not found with id: ${id}`);
      }
      MOCK_PAYMENTS.splice(paymentIndex, 1);
    }
  }

  /**
   * Get payment statistics
   * 
   * @param filters - Filter criteria for statistics
   * @returns Promise<PaymentListResponse> - Payment statistics and summary
   */
  public async getPaymentStatistics(filters: PaymentSearchFilters = {}): Promise<PaymentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      if (filters.method) queryParams.append('method', filters.method);

      const endpoint = `/payments/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<PaymentListResponse>(endpoint);
      
      return response;
    } catch (error) {
      console.warn('Failed to fetch payment statistics from API, using mock data:', error);
      return this.getMockPaymentList(filters);
    }
  }

  /**
   * Simulate payment processing based on payment method
   * 
   * @param method - Payment method
   * @returns boolean - Whether processing was successful
   */
  private simulatePaymentProcessing(method: PaymentMethod): boolean {
    // Simulate different success rates based on payment method
    const successRates: Record<PaymentMethod, number> = {
      [PaymentMethod.CREDIT_CARD]: 0.95,
      [PaymentMethod.DEBIT_CARD]: 0.90,
      [PaymentMethod.DIGITAL_WALLET]: 0.85,
      [PaymentMethod.BANK_TRANSFER]: 0.80,
      [PaymentMethod.CASH]: 1.0, // Cash always succeeds
    };

    const successRate = successRates[method] || 0.90;
    return Math.random() < successRate;
  }

  /**
   * Get mock payment list with filtering and statistics
   * 
   * @param filters - Filter criteria
   * @returns PaymentListResponse - Mock payment list with summary
   */
  private getMockPaymentList(filters: PaymentSearchFilters): PaymentListResponse {
    let filteredPayments = [...MOCK_PAYMENTS];

    // Apply filters
    if (filters.status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
    }
    
    if (filters.method) {
      filteredPayments = filteredPayments.filter(payment => payment.method === filters.method);
    }
    
    if (filters.orderId) {
      filteredPayments = filteredPayments.filter(payment => payment.orderId === filters.orderId);
    }
    
    if (filters.customerEmail) {
      const email = filters.customerEmail.toLowerCase();
      filteredPayments = filteredPayments.filter(payment => 
        payment.customerEmail.toLowerCase().includes(email)
      );
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.createdAt) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredPayments = filteredPayments.filter(payment => 
        new Date(payment.createdAt) <= toDate
      );
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);
    
    // Calculate summary statistics
    const summary = {
      completed: filteredPayments.filter(p => p.status === PaymentStatus.COMPLETED).length,
      pending: filteredPayments.filter(p => p.status === PaymentStatus.PENDING).length,
      failed: filteredPayments.filter(p => p.status === PaymentStatus.FAILED).length,
      refunded: filteredPayments.filter(p => p.status === PaymentStatus.REFUNDED).length,
    };
    
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      payments: paginatedPayments,
      totalCount: filteredPayments.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPayments.length / limit),
      totalAmount,
      summary,
    };
  }
}

// =============================================================================
// Export Singleton Instance
// =============================================================================

/**
 * Global payment API service instance
 * Use this instance throughout the application
 */
export const paymentApiService = PaymentApiService.getInstance();
