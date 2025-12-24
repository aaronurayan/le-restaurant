/**
 * Payment Types (F106)
 * Data models matching backend PaymentDto.java exactly
 */

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  status: PaymentStatus;
  paymentDetails?: string;
  paymentTime?: string;
  processedAt?: string;
  gatewayResponse?: string;
  // Customer information (F106 Enhancement)
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export interface CreatePaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: string;
  customerEmail?: string;
  customerName?: string;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  transactionId?: string;
  processedAt?: string;
}

export interface PaymentResponse {
  payment: Payment;
  success: boolean;
  message?: string;
}

export interface RefundRequest {
  paymentId: number;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  refundId: string;
  amount: number;
  status: string;
  processedAt: string;
}
