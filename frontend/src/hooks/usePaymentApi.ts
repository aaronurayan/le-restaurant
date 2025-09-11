import { useState } from 'react';
import { Payment, PaymentMethod, PaymentStatus } from '../types/payment';

// Payment API 함수들 (백엔드 API 연동)
const paymentApi = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await fetch('http://localhost:8080/api/payments');
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  },
  
  getPaymentById: async (id: number): Promise<Payment> => {
    const response = await fetch(`http://localhost:8080/api/payments/${id}`);
    if (!response.ok) throw new Error('Failed to fetch payment');
    return response.json();
  },
  
  getPaymentsByOrderId: async (orderId: number): Promise<Payment[]> => {
    const response = await fetch(`http://localhost:8080/api/payments/order/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch payments by order');
    return response.json();
  },
  
  getPaymentsByStatus: async (status: PaymentStatus): Promise<Payment[]> => {
    const response = await fetch(`http://localhost:8080/api/payments/status/${status}`);
    if (!response.ok) throw new Error('Failed to fetch payments by status');
    return response.json();
  },
  
  updatePaymentStatus: async (id: number, status: PaymentStatus): Promise<Payment> => {
    const response = await fetch(`http://localhost:8080/api/payments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update payment status');
    return response.json();
  },
  
  processPayment: async (id: number): Promise<Payment> => {
    const response = await fetch(`http://localhost:8080/api/payments/${id}/process`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to process payment');
    return response.json();
  },
  
  deletePayment: async (id: number): Promise<void> => {
    const response = await fetch(`http://localhost:8080/api/payments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete payment');
  },
};

export const usePaymentApi = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // 백엔드 연결 상태 확인
  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/payments/test');
      if (response.ok) {
        setIsBackendConnected(true);
        return true;
      }
    } catch (error) {
      console.warn('Backend not connected, using mock data');
    }
    setIsBackendConnected(false);
    return false;
  };

  // Mock payments data (백엔드 연결 실패 시 사용)
  const mockPayments: Payment[] = [
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

  // 모든 결제 조회
  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await paymentApi.getAllPayments();
        setPayments(data);
      } else {
        setPayments(mockPayments);
      }
    } catch (err) {
      setError('Failed to load payments');
      console.error('Error loading payments:', err);
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  // 주문별 결제 조회
  const loadPaymentsByOrderId = async (orderId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await paymentApi.getPaymentsByOrderId(orderId);
        setPayments(data);
      } else {
        const filteredPayments = mockPayments.filter(p => p.orderId === orderId);
        setPayments(filteredPayments);
      }
    } catch (err) {
      setError('Failed to load payments by order');
      console.error('Error loading payments by order:', err);
      const filteredPayments = mockPayments.filter(p => p.orderId === orderId);
      setPayments(filteredPayments);
    } finally {
      setLoading(false);
    }
  };

  // 상태별 결제 조회
  const loadPaymentsByStatus = async (status: PaymentStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const data = await paymentApi.getPaymentsByStatus(status);
        setPayments(data);
      } else {
        const filteredPayments = mockPayments.filter(p => p.status === status);
        setPayments(filteredPayments);
      }
    } catch (err) {
      setError('Failed to load payments by status');
      console.error('Error loading payments by status:', err);
      const filteredPayments = mockPayments.filter(p => p.status === status);
      setPayments(filteredPayments);
    } finally {
      setLoading(false);
    }
  };

  // 결제 상태 업데이트
  const updatePaymentStatus = async (id: number, status: PaymentStatus) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const updatedPayment = await paymentApi.updatePaymentStatus(id, status);
        setPayments(prev => prev.map(p => p.id === id ? updatedPayment : p));
        return updatedPayment;
      } else {
        // Mock data 업데이트
        setPayments(prev => prev.map(p => 
          p.id === id 
            ? { ...p, status, updatedAt: new Date().toISOString() }
            : p
        ));
        return { ...mockPayments.find(p => p.id === id)!, status };
      }
    } catch (err) {
      setError('Failed to update payment status');
      console.error('Error updating payment status:', err);
      throw err;
    }
  };

  // 결제 처리
  const processPayment = async (id: number) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        const processedPayment = await paymentApi.processPayment(id);
        setPayments(prev => prev.map(p => p.id === id ? processedPayment : p));
        return processedPayment;
      } else {
        // Mock data 업데이트
        setPayments(prev => prev.map(p => 
          p.id === id 
            ? { 
                ...p, 
                status: PaymentStatus.COMPLETED, 
                processedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : p
        ));
        return { 
          ...mockPayments.find(p => p.id === id)!, 
          status: PaymentStatus.COMPLETED,
          processedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      setError('Failed to process payment');
      console.error('Error processing payment:', err);
      throw err;
    }
  };

  // 결제 삭제
  const deletePayment = async (id: number) => {
    try {
      const isConnected = await checkBackendConnection();
      
      if (isConnected) {
        await paymentApi.deletePayment(id);
        setPayments(prev => prev.filter(p => p.id !== id));
      } else {
        // Mock data에서 삭제
        setPayments(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      setError('Failed to delete payment');
      console.error('Error deleting payment:', err);
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    isBackendConnected,
    loadPayments,
    loadPaymentsByOrderId,
    loadPaymentsByStatus,
    updatePaymentStatus,
    processPayment,
    deletePayment,
  };
};
