// Delivery Management Types
export interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  vehicleType: 'bicycle' | 'motorcycle' | 'car';
  maxCapacity: number;
  rating: number;
  totalDeliveries: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  assignedAt: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  status: 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  updatedAt?: string;
}

export interface DeliveryStatus {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order: number;
}

export interface DeliveryProgress {
  id: string;
  deliveryId: string;
  status: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  updatedBy: string;
}

export interface DeliveryRoute {
  id: string;
  deliveryId: string;
  waypoints: Array<{
    latitude: number;
    longitude: number;
    address: string;
    type: 'pickup' | 'delivery' | 'waypoint';
    estimatedTime: string;
    actualTime?: string;
    status: 'pending' | 'completed' | 'skipped';
  }>;
  totalDistance: number;
  estimatedDuration: number;
  actualDuration?: number;
}

export interface DeliveryNotification {
  id: string;
  deliveryId: string;
  customerId: string;
  type: 'status_update' | 'delay' | 'delivery_confirmation' | 'issue';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'normal' | 'high';
}

export interface DeliveryMetrics {
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  customerSatisfactionScore: number;
  activeDeliveryPersons: number;
  pendingAssignments: number;
}

export interface DeliveryFilter {
  status?: string[];
  deliveryPersonId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  priority?: string[];
  search?: string;
}

export interface CreateDeliveryAssignmentRequest {
  orderId: string;
  deliveryPersonId: string;
  estimatedDeliveryTime: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
}

export interface UpdateDeliveryStatusRequest {
  status: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface AssignDeliveryPersonRequest {
  deliveryId: string;
  deliveryPersonId: string;
  estimatedDeliveryTime: string;
  notes?: string;
}

// Delivery Status Constants
export const DELIVERY_STATUSES: DeliveryStatus[] = [
  {
    id: 'preparing',
    name: 'Preparing',
    description: 'Order is being prepared in the kitchen',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'ChefHat',
    order: 1
  },
  {
    id: 'ready_for_pickup',
    name: 'Ready for Pickup',
    description: 'Order is ready for delivery person to pick up',
    color: 'bg-blue-100 text-blue-800',
    icon: 'Package',
    order: 2
  },
  {
    id: 'assigned',
    name: 'Assigned',
    description: 'Delivery person has been assigned',
    color: 'bg-purple-100 text-purple-800',
    icon: 'UserCheck',
    order: 3
  },
  {
    id: 'picked_up',
    name: 'Picked Up',
    description: 'Order has been picked up by delivery person',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'Truck',
    order: 4
  },
  {
    id: 'in_transit',
    name: 'In Transit',
    description: 'Order is on the way to customer',
    color: 'bg-orange-100 text-orange-800',
    icon: 'MapPin',
    order: 5
  },
  {
    id: 'delivered',
    name: 'Delivered',
    description: 'Order has been successfully delivered',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle',
    order: 6
  },
  {
    id: 'failed',
    name: 'Delivery Failed',
    description: 'Delivery could not be completed',
    color: 'bg-red-100 text-red-800',
    icon: 'XCircle',
    order: 7
  }
];

export const DELIVERY_PRIORITIES = [
  { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
  { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-800' },
  { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800' }
] as const;
