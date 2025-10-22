/**
 * Order Types (F105)
 * Data models for order management operations
 * 
 * ⚠️ IMPORTANT: OrderStatus values MUST match backend enum exactly
 * Backend: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
 */

export type OrderType = 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemDto {
  id: number;
  orderId: number;
  menuItemId: number;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tableId?: number;
  tableNumber?: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  orderTime: string; // ISO datetime
  estimatedCompletion?: string;
  completedAt?: string;
  createdAt: string;
}

export interface OrderItemRequestDto {
  menuItemId: number;
  quantity: number;
}

export interface OrderCreateRequestDto {
  customerId: number;
  tableId?: number;
  orderType: OrderType;
  items: OrderItemRequestDto[];
  specialInstructions?: string;
  tipAmount?: number;
}

export interface OrderUpdateRequestDto {
  status?: OrderStatus;
  specialInstructions?: string;
  tipAmount?: number;
}

export interface OrderFilterOptions {
  customerId?: number;
  status?: OrderStatus;
  orderType?: OrderType;
}
