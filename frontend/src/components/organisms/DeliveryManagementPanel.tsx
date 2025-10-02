import React, { useState, useEffect } from 'react';
import {
  Truck,
  Users,
  Package,
  Plus,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { DeliveryAssignment, DeliveryPerson, DeliveryFilter, DeliveryMetrics } from '../../types/delivery';
import { useDeliveryApi } from '../../hooks/useDeliveryApi';
import { DeliveryCard } from '../molecules/DeliveryCard';
import { DeliveryPersonCard } from '../molecules/DeliveryPersonCard';
import { DeliveryForm } from '../molecules/DeliveryForm';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { StatusBadge } from '../atoms/StatusBadge';
import { ProgressBar } from '../atoms/ProgressBar';

interface DeliveryManagementPanelProps {
  className?: string;
}

export const DeliveryManagementPanel: React.FC<DeliveryManagementPanelProps> = ({
  className = ''
}) => {
  const {
    isBackendConnected,
    loading,
    error,
    getDeliveries,
    getDeliveryPersons,
    getDeliveryMetrics,
    createDeliveryAssignment,
    updateDeliveryStatus,
    assignDeliveryPerson,
    deliveryStatuses
  } = useDeliveryApi();

  const [deliveries, setDeliveries] = useState<DeliveryAssignment[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [metrics, setMetrics] = useState<DeliveryMetrics | null>(null);
  const [filter, setFilter] = useState<DeliveryFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deliveries' | 'persons' | 'metrics'>('deliveries');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const [deliveriesData, personsData, metricsData] = await Promise.all([
        getDeliveries(filter),
        getDeliveryPersons(),
        getDeliveryMetrics()
      ]);

      setDeliveries(deliveriesData);
      setDeliveryPersons(personsData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Failed to load delivery data:', err);
    }
  };

  const handleCreateAssignment = async (data: any) => {
    try {
      await createDeliveryAssignment(data);
      setShowCreateForm(false);
      setSelectedOrderId('');
      loadData();
    } catch (err) {
      console.error('Failed to create delivery assignment:', err);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, status: string) => {
    try {
      await updateDeliveryStatus(deliveryId, { status });
      loadData();
    } catch (err) {
      console.error('Failed to update delivery status:', err);
    }
  };

  const handleAssignPerson = async (deliveryId: string) => {
    // This would open a modal or form to assign a delivery person
    console.log('Assign person for delivery:', deliveryId);
  };

  const handleViewDetails = (deliveryId: string) => {
    console.log('View details for delivery:', deliveryId);
  };

  const handleTrackLocation = (deliveryId: string) => {
    console.log('Track location for delivery:', deliveryId);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (searchTerm) {
      return delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = {};
    deliveryStatuses.forEach(status => {
      counts[status.id] = deliveries.filter(d => d.status === status.id).length;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Delivery Management</h2>
          <p className="text-neutral-600 mt-1">
            Manage delivery assignments and track order progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isBackendConnected && (
            <div className="flex items-center text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>🟢 Backend Connected</span>
            </div>
          )}

          <Button
            variant="outline"
            onClick={loadData}
            loading={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Backend Connection Status */}
      {!isBackendConnected && (
        <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">🟡 Using Mock Data - Backend Not Connected</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-800">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Deliveries</p>
                <p className="text-2xl font-bold text-neutral-900">{metrics.totalDeliveries}</p>
              </div>
              <Truck className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{metrics.completedDeliveries}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">On-Time Rate</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.onTimeDeliveryRate}%</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Active Personnel</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.activeDeliveryPersons}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {deliveryStatuses.map((status) => (
            <div key={status.id} className="text-center">
              <div className="text-2xl font-bold text-neutral-900 mb-1">
                {statusCounts[status.id] || 0}
              </div>
              <StatusBadge status={status.id} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex space-x-8">
          {[
            { id: 'deliveries', label: 'Deliveries', icon: Package },
            { id: 'persons', label: 'Delivery Personnel', icon: Users },
            { id: 'metrics', label: 'Analytics', icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={setSearchTerm}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Deliveries List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDeliveries.map((delivery) => {
              const person = deliveryPersons.find(p => p.id === delivery.deliveryPersonId);
              return (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  deliveryPerson={person}
                  onStatusUpdate={handleStatusUpdate}
                  onAssignPerson={handleAssignPerson}
                  onViewDetails={handleViewDetails}
                  onTrackLocation={handleTrackLocation}
                />
              );
            })}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No deliveries found</h3>
              <p className="text-neutral-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first delivery assignment'}
              </p>
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'persons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveryPersons.map((person) => (
            <DeliveryPersonCard
              key={person.id}
              person={person}
              onStatusUpdate={async (personId, status) => {
                // Handle status update
                console.log('Update person status:', personId, status);
                loadData();
              }}
              onViewDetails={(personId) => console.log('View person details:', personId)}
              onAssignDelivery={(personId) => console.log('Assign delivery to person:', personId)}
            />
          ))}
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">On-Time Delivery Rate</span>
                    <span className="font-medium">{metrics?.onTimeDeliveryRate}%</span>
                  </div>
                  <ProgressBar
                    progress={metrics?.onTimeDeliveryRate || 0}
                    steps={[
                      { id: '1', label: '0%', completed: false },
                      { id: '2', label: '50%', completed: (metrics?.onTimeDeliveryRate || 0) >= 50 },
                      { id: '3', label: '100%', completed: (metrics?.onTimeDeliveryRate || 0) >= 100 }
                    ]}
                    variant="compact"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-600">Customer Satisfaction</span>
                    <span className="font-medium">{metrics?.customerSatisfactionScore}/5.0</span>
                  </div>
                  <ProgressBar
                    progress={(metrics?.customerSatisfactionScore || 0) * 20}
                    steps={[
                      { id: '1', label: '1', completed: false },
                      { id: '2', label: '2', completed: (metrics?.customerSatisfactionScore || 0) >= 2 },
                      { id: '3', label: '3', completed: (metrics?.customerSatisfactionScore || 0) >= 3 },
                      { id: '4', label: '4', completed: (metrics?.customerSatisfactionScore || 0) >= 4 },
                      { id: '5', label: '5', completed: (metrics?.customerSatisfactionScore || 0) >= 5 }
                    ]}
                    variant="compact"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Average Delivery Time</span>
                  <span className="font-medium">{metrics?.averageDeliveryTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Pending Assignments</span>
                  <span className="font-medium text-orange-600">{metrics?.pendingAssignments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Deliveries</span>
                  <span className="font-medium">{metrics?.totalDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Completed Deliveries</span>
                  <span className="font-medium text-green-600">{metrics?.completedDeliveries}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">Create Delivery Assignment</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <DeliveryForm
                orderId={selectedOrderId || 'ORDER-001'}
                availablePersons={deliveryPersons.filter(p => p.status === 'available' && p.isActive)}
                onSubmit={handleCreateAssignment}
                onCancel={() => setShowCreateForm(false)}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
