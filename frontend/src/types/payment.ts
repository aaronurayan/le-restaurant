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
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
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
