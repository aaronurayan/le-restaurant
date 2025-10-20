// Re-export all types from individual modules
export * from './auth';
export * from './user';
export * from './payment';
export * from './delivery';
export * from './reservation';
export * from './order';
export * from './session';

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  dietaryTags: string[];
  preparationTime: number;
  allergens?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  itemCount: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  status: OrderStatus;
  orderDate: string;
  items: CartItem[];
  pricing: {
    subtotal: number;
    tax: number;
    tip: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  deliveryInfo: {
    type: 'PICKUP' | 'DELIVERY' | 'DINE_IN';
    estimatedTime: string;
    actualTime?: string;
  };
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED' 
  | 'IN_PREPARATION'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences?: {
    dietaryRestrictions: string[];
    allergies: string[];
    communicationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}