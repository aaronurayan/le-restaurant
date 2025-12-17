export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  customerId?: number;  // F106 Enhancement: Customer ID for admin tracking
  customerEmail: string;
  customerName: string;
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
  currency: string;
  method: PaymentMethod;
  customerEmail: string;
  customerName: string;
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
