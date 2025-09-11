import { useState, useEffect, useCallback } from 'react';
import { 
  DeliveryPerson, 
  DeliveryAssignment, 
  DeliveryProgress, 
  DeliveryRoute,
  DeliveryNotification,
  DeliveryMetrics,
  DeliveryFilter,
  CreateDeliveryAssignmentRequest,
  UpdateDeliveryStatusRequest,
  AssignDeliveryPersonRequest,
  DELIVERY_STATUSES
} from '../types/delivery';

// Mock data for development
const mockDeliveryPersons: DeliveryPerson[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0123',
    status: 'available',
    currentLocation: { latitude: 37.7749, longitude: -122.4194 },
    vehicleType: 'bicycle',
    maxCapacity: 5,
    rating: 4.8,
    totalDeliveries: 156,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0124',
    status: 'busy',
    currentLocation: { latitude: 37.7849, longitude: -122.4094 },
    vehicleType: 'motorcycle',
    maxCapacity: 8,
    rating: 4.9,
    totalDeliveries: 203,
    isActive: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+1-555-0125',
    status: 'offline',
    vehicleType: 'car',
    maxCapacity: 15,
    rating: 4.7,
    totalDeliveries: 89,
    isActive: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
];

const mockDeliveries: DeliveryAssignment[] = [
  {
    id: '1',
    orderId: 'order-1',
    deliveryPersonId: '1',
    assignedAt: '2024-01-15T10:30:00Z',
    estimatedDeliveryTime: '2024-01-15T11:30:00Z',
    status: 'in_transit',
    priority: 'normal',
    notes: 'Customer requested contactless delivery'
  },
  {
    id: '2',
    orderId: 'order-2',
    deliveryPersonId: '2',
    assignedAt: '2024-01-15T11:00:00Z',
    estimatedDeliveryTime: '2024-01-15T12:00:00Z',
    status: 'picked_up',
    priority: 'high',
    notes: 'Fragile items - handle with care'
  },
  {
    id: '3',
    orderId: 'order-3',
    deliveryPersonId: '1',
    assignedAt: '2024-01-15T11:15:00Z',
    estimatedDeliveryTime: '2024-01-15T12:15:00Z',
    actualDeliveryTime: '2024-01-15T12:10:00Z',
    status: 'delivered',
    priority: 'normal'
  }
];

const mockDeliveryProgress: DeliveryProgress[] = [
  {
    id: '1',
    deliveryId: '1',
    status: 'preparing',
    timestamp: '2024-01-15T10:00:00Z',
    updatedBy: 'kitchen'
  },
  {
    id: '2',
    deliveryId: '1',
    status: 'ready_for_pickup',
    timestamp: '2024-01-15T10:25:00Z',
    updatedBy: 'kitchen'
  },
  {
    id: '3',
    deliveryId: '1',
    status: 'assigned',
    timestamp: '2024-01-15T10:30:00Z',
    updatedBy: 'admin'
  },
  {
    id: '4',
    deliveryId: '1',
    status: 'picked_up',
    timestamp: '2024-01-15T10:45:00Z',
    location: { latitude: 37.7749, longitude: -122.4194 },
    updatedBy: 'delivery_person'
  },
  {
    id: '5',
    deliveryId: '1',
    status: 'in_transit',
    timestamp: '2024-01-15T11:00:00Z',
    location: { latitude: 37.7849, longitude: -122.4094 },
    updatedBy: 'delivery_person'
  }
];

const mockMetrics: DeliveryMetrics = {
  totalDeliveries: 1247,
  completedDeliveries: 1189,
  averageDeliveryTime: 28,
  onTimeDeliveryRate: 94.2,
  customerSatisfactionScore: 4.7,
  activeDeliveryPersons: 2,
  pendingAssignments: 3
};

export const useDeliveryApi = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check backend connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health');
        setIsBackendConnected(response.ok);
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkConnection();
  }, []);

  // Delivery Persons
  const getDeliveryPersons = useCallback(async (): Promise<DeliveryPerson[]> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch('/api/delivery/persons');
        if (!response.ok) throw new Error('Failed to fetch delivery persons');
        return await response.json();
      } else {
        // Return mock data when backend is not connected
        return mockDeliveryPersons;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery persons');
      return mockDeliveryPersons;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  const getAvailableDeliveryPersons = useCallback(async (): Promise<DeliveryPerson[]> => {
    const persons = await getDeliveryPersons();
    return persons.filter(person => person.status === 'available' && person.isActive);
  }, [getDeliveryPersons]);

  const updateDeliveryPersonStatus = useCallback(async (
    personId: string, 
    status: 'available' | 'busy' | 'offline'
  ): Promise<DeliveryPerson> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch(`/api/delivery/persons/${personId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update delivery person status');
        return await response.json();
      } else {
        // Mock update
        const person = mockDeliveryPersons.find(p => p.id === personId);
        if (!person) throw new Error('Delivery person not found');
        person.status = status;
        person.updatedAt = new Date().toISOString();
        return person;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery person status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  // Deliveries
  const getDeliveries = useCallback(async (filter?: DeliveryFilter): Promise<DeliveryAssignment[]> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const params = new URLSearchParams();
        if (filter?.status) params.append('status', filter.status.join(','));
        if (filter?.deliveryPersonId) params.append('deliveryPersonId', filter.deliveryPersonId);
        if (filter?.priority) params.append('priority', filter.priority.join(','));
        if (filter?.search) params.append('search', filter.search);
        
        const response = await fetch(`/api/delivery/assignments?${params}`);
        if (!response.ok) throw new Error('Failed to fetch deliveries');
        return await response.json();
      } else {
        // Return filtered mock data
        let filtered = [...mockDeliveries];
        if (filter?.status) {
          filtered = filtered.filter(d => filter.status!.includes(d.status));
        }
        if (filter?.deliveryPersonId) {
          filtered = filtered.filter(d => d.deliveryPersonId === filter.deliveryPersonId);
        }
        if (filter?.priority) {
          filtered = filtered.filter(d => filter.priority!.includes(d.priority));
        }
        return filtered;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deliveries');
      return mockDeliveries;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  const createDeliveryAssignment = useCallback(async (
    request: CreateDeliveryAssignmentRequest
  ): Promise<DeliveryAssignment> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch('/api/delivery/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
        if (!response.ok) throw new Error('Failed to create delivery assignment');
        return await response.json();
      } else {
        // Mock creation
        const newAssignment: DeliveryAssignment = {
          id: `delivery-${Date.now()}`,
          ...request,
          assignedAt: new Date().toISOString(),
          status: 'assigned'
        };
        mockDeliveries.push(newAssignment);
        return newAssignment;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create delivery assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  const updateDeliveryStatus = useCallback(async (
    deliveryId: string,
    request: UpdateDeliveryStatusRequest
  ): Promise<DeliveryAssignment> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch(`/api/delivery/assignments/${deliveryId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
        if (!response.ok) throw new Error('Failed to update delivery status');
        return await response.json();
      } else {
        // Mock update
        const delivery = mockDeliveries.find(d => d.id === deliveryId);
        if (!delivery) throw new Error('Delivery not found');
        delivery.status = request.status as any;
        if (request.status === 'delivered') {
          delivery.actualDeliveryTime = new Date().toISOString();
        }
        delivery.updatedAt = new Date().toISOString();
        return delivery;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  const assignDeliveryPerson = useCallback(async (
    request: AssignDeliveryPersonRequest
  ): Promise<DeliveryAssignment> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch(`/api/delivery/assignments/${request.deliveryId}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deliveryPersonId: request.deliveryPersonId,
            estimatedDeliveryTime: request.estimatedDeliveryTime,
            notes: request.notes
          })
        });
        if (!response.ok) throw new Error('Failed to assign delivery person');
        return await response.json();
      } else {
        // Mock assignment
        const delivery = mockDeliveries.find(d => d.id === request.deliveryId);
        if (!delivery) throw new Error('Delivery not found');
        delivery.deliveryPersonId = request.deliveryPersonId;
        delivery.estimatedDeliveryTime = request.estimatedDeliveryTime;
        delivery.status = 'assigned';
        delivery.assignedAt = new Date().toISOString();
        if (request.notes) delivery.notes = request.notes;
        return delivery;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign delivery person');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  // Delivery Progress
  const getDeliveryProgress = useCallback(async (deliveryId: string): Promise<DeliveryProgress[]> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch(`/api/delivery/assignments/${deliveryId}/progress`);
        if (!response.ok) throw new Error('Failed to fetch delivery progress');
        return await response.json();
      } else {
        // Return mock progress
        return mockDeliveryProgress.filter(p => p.deliveryId === deliveryId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery progress');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  // Metrics
  const getDeliveryMetrics = useCallback(async (): Promise<DeliveryMetrics> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch('/api/delivery/metrics');
        if (!response.ok) throw new Error('Failed to fetch delivery metrics');
        return await response.json();
      } else {
        return mockMetrics;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery metrics');
      return mockMetrics;
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  // Notifications
  const getDeliveryNotifications = useCallback(async (): Promise<DeliveryNotification[]> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isBackendConnected) {
        const response = await fetch('/api/delivery/notifications');
        if (!response.ok) throw new Error('Failed to fetch delivery notifications');
        return await response.json();
      } else {
        // Return empty array for mock
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch delivery notifications');
      return [];
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  return {
    // State
    isBackendConnected,
    loading,
    error,
    
    // Delivery Persons
    getDeliveryPersons,
    getAvailableDeliveryPersons,
    updateDeliveryPersonStatus,
    
    // Deliveries
    getDeliveries,
    createDeliveryAssignment,
    updateDeliveryStatus,
    assignDeliveryPerson,
    
    // Progress & Tracking
    getDeliveryProgress,
    
    // Metrics & Analytics
    getDeliveryMetrics,
    
    // Notifications
    getDeliveryNotifications,
    
    // Constants
    deliveryStatuses: DELIVERY_STATUSES
  };
};
