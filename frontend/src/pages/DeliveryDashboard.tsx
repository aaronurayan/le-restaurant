import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  Package, 
  Clock, 
  MapPin, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useDeliveryApi } from '../hooks/useDeliveryApi';
import { DeliveryAssignment, DeliveryPerson, DeliveryMetrics } from '../types/delivery';
import { StatusBadge } from '../components/atoms/StatusBadge';
import { ProgressBar } from '../components/atoms/ProgressBar';
import { Button } from '../components/atoms/Button';

const DeliveryDashboard: React.FC = () => {
  const {
    isBackendConnected,
    loading,
    error,
    getDeliveries,
    getDeliveryPersons,
    getDeliveryMetrics
  } = useDeliveryApi();

  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [metrics, setMetrics] = useState<DeliveryMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [deliveriesData, personsData, metricsData] = await Promise.all([
        getDeliveries(),
        getDeliveryPersons(),
        getDeliveryMetrics()
      ]);
      
      setDeliveries(deliveriesData);
      setDeliveryPersons(personsData);
      setMetrics(metricsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = {};
    ['preparing', 'ready_for_pickup', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'].forEach(status => {
      counts[status] = deliveries.filter(d => d.status === status).length;
    });
    return counts;
  };

  const getRecentDeliveries = () => {
    return deliveries
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
      .slice(0, 5);
  };

  const getOverdueDeliveries = () => {
    const now = new Date();
    return deliveries.filter(delivery => {
      if (!delivery.estimatedDeliveryTime || delivery.status === 'delivered' || delivery.status === 'failed') {
        return false;
      }
      const estimated = new Date(delivery.estimatedDeliveryTime);
      return now > estimated;
    });
  };

  const getActiveDeliveryPersons = () => {
    return deliveryPersons.filter(p => p.status === 'available' || p.status === 'busy');
  };

  const statusCounts = getStatusCounts();
  const recentDeliveries = getRecentDeliveries();
  const overdueDeliveries = getOverdueDeliveries();
  const activePersons = getActiveDeliveryPersons();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Delivery Dashboard</h1>
            <p className="text-neutral-600 mt-1">
              Real-time overview of delivery operations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isBackendConnected && (
              <div className="flex items-center text-green-700 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>🟢 Live Data</span>
              </div>
            )}
            
            <div className="text-sm text-neutral-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            
            <Button
              variant="outline"
              onClick={loadData}
              loading={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Backend Connection Status */}
        {!isBackendConnected && (
          <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg mb-6">
            <div className="flex items-center text-yellow-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">🟡 Using Mock Data - Backend Not Connected</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-200 rounded-lg mb-6">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Total Deliveries</p>
                  <p className="text-3xl font-bold text-neutral-900">{metrics.totalDeliveries}</p>
                  <p className="text-sm text-green-600 mt-1">
                    +{metrics.completedDeliveries} completed
                  </p>
                </div>
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">On-Time Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{metrics.onTimeDeliveryRate}%</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Average: {metrics.averageDeliveryTime}min
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Active Personnel</p>
                  <p className="text-3xl font-bold text-orange-600">{metrics.activeDeliveryPersons}</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    {activePersons.length} online now
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Satisfaction</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.customerSatisfactionScore}/5</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Customer rating
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Status Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Status Overview</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { status: 'preparing', label: 'Preparing', count: statusCounts.preparing, color: 'bg-yellow-100 text-yellow-800' },
                  { status: 'ready_for_pickup', label: 'Ready', count: statusCounts.ready_for_pickup, color: 'bg-blue-100 text-blue-800' },
                  { status: 'in_transit', label: 'In Transit', count: statusCounts.in_transit, color: 'bg-orange-100 text-orange-800' },
                  { status: 'delivered', label: 'Delivered', count: statusCounts.delivered, color: 'bg-green-100 text-green-800' }
                ].map((item) => (
                  <div key={item.status} className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.color} mb-2`}>
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">{item.count}</div>
                  </div>
                ))}
              </div>

              <ProgressBar
                progress={(statusCounts.delivered / metrics?.totalDeliveries || 0) * 100}
                steps={[
                  { id: '1', label: 'Preparing', completed: statusCounts.preparing > 0 },
                  { id: '2', label: 'Ready', completed: statusCounts.ready_for_pickup > 0 },
                  { id: '3', label: 'In Transit', completed: statusCounts.in_transit > 0 },
                  { id: '4', label: 'Delivered', completed: statusCounts.delivered > 0 }
                ]}
                variant="compact"
              />
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="space-y-6">
            {/* Overdue Deliveries */}
            {overdueDeliveries.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Overdue Deliveries</h4>
                </div>
                <div className="space-y-2">
                  {overdueDeliveries.slice(0, 3).map((delivery) => (
                    <div key={delivery.id} className="text-sm">
                      <p className="font-medium text-red-900">Order #{delivery.orderId}</p>
                      <p className="text-red-700">
                        Due: {new Date(delivery.estimatedDeliveryTime!).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {overdueDeliveries.length > 3 && (
                    <p className="text-sm text-red-700">
                      +{overdueDeliveries.length - 3} more overdue
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pending Assignments */}
            {statusCounts.ready_for_pickup > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Pending Assignments</h4>
                </div>
                <p className="text-sm text-yellow-700">
                  {statusCounts.ready_for_pickup} orders ready for pickup
                </p>
              </div>
            )}

            {/* Active Personnel */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
              <h4 className="font-semibold text-neutral-900 mb-3">Active Personnel</h4>
              <div className="space-y-2">
                {activePersons.slice(0, 3).map((person) => (
                  <div key={person.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-neutral-700">{person.name}</span>
                    <StatusBadge status={person.status} size="sm" />
                  </div>
                ))}
                {activePersons.length > 3 && (
                  <p className="text-sm text-neutral-500">
                    +{activePersons.length - 3} more active
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Deliveries</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Estimated Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeliveries.map((delivery) => {
                    const person = deliveryPersons.find(p => p.id === delivery.deliveryPersonId);
                    return (
                      <tr key={delivery.id} className="border-b border-neutral-100">
                        <td className="py-3 px-4 font-medium text-neutral-900">
                          #{delivery.orderId}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={delivery.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {person?.name || 'Unassigned'}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={delivery.priority} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {new Date(delivery.estimatedDeliveryTime).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;