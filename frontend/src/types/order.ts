export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface CreateOrderRequest {
  userId: number;
  orderItems: CreateOrderItemRequest[];
  specialInstructions?: string;
}

export interface CreateOrderItemRequest {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CartItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface AddToCartRequest {
  menuItemId: number;
  quantity: number;
  specialInstructions?: string;
}
