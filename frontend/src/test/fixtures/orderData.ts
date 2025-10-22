import { OrderDto, OrderType, OrderStatus } from '../../types/order';

// Test data for OrderFlow.test.tsx
export const mockOrderData: OrderDto = {
  id: 1,
  customerId: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+1234567890',
  orderType: 'TAKEOUT' as OrderType,
  status: 'PENDING' as OrderStatus,
  items: [
    {
      id: 1,
      orderId: 1,
      menuItemId: 1,
      menuItemName: 'Pizza Margherita',
      quantity: 2,
      unitPrice: 12.99,
      subtotal: 25.98
    }
  ],
  subtotal: 25.98,
  taxAmount: 2.60,
  tipAmount: 3.00,
  totalAmount: 31.58,
  orderTime: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};