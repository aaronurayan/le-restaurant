import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Package, 
  User, 
  Phone, 
  Mail,
  Navigation,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { DeliveryAssignment, DeliveryProgress, DeliveryPerson } from '../../types/delivery';
import { useDeliveryApi } from '../../hooks/useDeliveryApi';
import { ProgressBar } from '../atoms/ProgressBar';
import { TimeDisplay } from '../atoms/TimeDisplay';
import { MapPin as MapPinComponent } from '../atoms/MapPin';
import { StatusBadge } from '../atoms/StatusBadge';
import { Button } from '../atoms/Button';

interface DeliveryTrackingProps {
  deliveryId: string;
  onBack?: () => void;
  className?: string;
}

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({
  deliveryId,
  onBack,
  className = ''
}) => {
  const {
    isBackendConnected,
    loading,
    error,
    getDeliveries,
    getDeliveryPersons,
    getDeliveryProgress
  } = useDeliveryApi();

  const [delivery, setDelivery] = useState<DeliveryAssignment | null>(null);
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [progress, setProgress] = useState<DeliveryProgress[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    loadDeliveryData();
  }, [deliveryId]);

  const loadDeliveryData = async () => {
    try {
      const [deliveries, persons, progressData] = await Promise.all([
        getDeliveries(),
        getDeliveryPersons(),
        getDeliveryProgress(deliveryId)
      ]);
      
      const foundDelivery = deliveries.find(d => d.id === deliveryId);
      if (foundDelivery) {
        setDelivery(foundDelivery);
        const person = persons.find(p => p.id === foundDelivery.deliveryPersonId);
        setDeliveryPerson(person || null);
      }
      
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to load delivery data:', err);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    // In a real app, this would start real-time tracking
    console.log('Starting real-time tracking for delivery:', deliveryId);
  };

  const stopTracking = () => {
    setIsTracking(false);
    console.log('Stopping tracking for delivery:', deliveryId);
  };

  const getProgressSteps = () => {
    const statusOrder = ['preparing', 'ready_for_pickup', 'assigned', 'picked_up', 'in_transit', 'delivered'];
    return statusOrder.map((status, index) => {
      const statusProgress = progress.find(p => p.status === status);
      const isCompleted = statusProgress !== undefined;
      const isCurrent = delivery?.status === status;
      
      return {
        id: status,
        label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        completed: isCompleted,
        current: isCurrent
      };
    });
  };

  const getProgressPercentage = () => {
    const statusOrder = ['preparing', 'ready_for_pickup', 'assigned', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(delivery?.status || '');
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  const getEstimatedTimeRemaining = () => {
    if (!delivery?.estimatedDeliveryTime) return null;
    
    const estimated = new Date(delivery.estimatedDeliveryTime);
    const now = new Date();
    const diffInMinutes = Math.floor((estimated.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Overdue';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    return `${Math.floor(diffInMinutes / 60)} hours ${diffInMinutes % 60} minutes`;
  };

  if (!delivery) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Delivery Not Found</h3>
          <p className="text-neutral-500 mb-4">The requested delivery could not be found.</p>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  const progressSteps = getProgressSteps();
  const progressPercentage = getProgressPercentage();
  const timeRemaining = getEstimatedTimeRemaining();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Order #{delivery.orderId}
            </h2>
            <p className="text-neutral-600">Delivery Tracking</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isBackendConnected && (
            <div className="flex items-center text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>🟢 Live Tracking</span>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={loadDeliveryData}
            loading={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          
          <Button
            variant={isTracking ? "outline" : "primary"}
            onClick={isTracking ? stopTracking : startTracking}
            className="flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tracking Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Current Status</h3>
              <StatusBadge status={delivery.status} />
            </div>
            
            <ProgressBar
              progress={progressPercentage}
              steps={progressSteps}
              variant="detailed"
            />
          </div>

          {/* Delivery Person Information */}
          {deliveryPerson && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Person</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900">{deliveryPerson.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{deliveryPerson.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{deliveryPerson.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-neutral-500">Rating:</span>
                      <span className="font-medium">{deliveryPerson.rating} ⭐</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-neutral-500">Deliveries:</span>
                      <span className="font-medium">{deliveryPerson.totalDeliveries}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-neutral-500">Vehicle:</span>
                      <span className="font-medium capitalize">{deliveryPerson.vehicleType.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              {deliveryPerson.currentLocation && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Current Location</p>
                      <p className="text-sm text-neutral-600">
                        {deliveryPerson.currentLocation.latitude.toFixed(4)}, {deliveryPerson.currentLocation.longitude.toFixed(4)}
                      </p>
                    </div>
                    <MapPinComponent
                      latitude={deliveryPerson.currentLocation.latitude}
                      longitude={deliveryPerson.currentLocation.longitude}
                      variant="current"
                      size="md"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Progress Timeline</h3>
            
            <div className="space-y-4">
              {progress.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-neutral-900">
                        {step.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <TimeDisplay
                        time={step.timestamp}
                        type="datetime"
                        variant="compact"
                      />
                    </div>
                    
                    {step.notes && (
                      <p className="text-sm text-neutral-600 mt-1">{step.notes}</p>
                    )}
                    
                    {step.location && (
                      <div className="mt-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {step.location.latitude.toFixed(4)}, {step.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Details</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Order ID</p>
                <p className="font-medium text-neutral-900">#{delivery.orderId}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Priority</p>
                <StatusBadge status={delivery.priority} size="sm" />
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Estimated Delivery</p>
                <TimeDisplay
                  time={delivery.estimatedDeliveryTime}
                  type="datetime"
                  variant="compact"
                />
              </div>
              
              {delivery.actualDeliveryTime && (
                <div>
                  <p className="text-sm text-neutral-500">Actual Delivery</p>
                  <TimeDisplay
                    time={delivery.actualDeliveryTime}
                    type="datetime"
                    variant="compact"
                  />
                </div>
              )}
              
              {timeRemaining && (
                <div>
                  <p className="text-sm text-neutral-500">Time Remaining</p>
                  <p className="font-medium text-neutral-900">{timeRemaining}</p>
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          {delivery.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Special Instructions</h3>
              <p className="text-sm text-neutral-600">{delivery.notes}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (deliveryPerson?.phone) {
                    window.open(`tel:${deliveryPerson.phone}`);
                  }
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Delivery Person
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (deliveryPerson?.email) {
                    window.open(`mailto:${deliveryPerson.email}`);
                  }
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (deliveryPerson?.currentLocation) {
                    const mapsUrl = `https://www.google.com/maps?q=${deliveryPerson.currentLocation.latitude},${deliveryPerson.currentLocation.longitude}`;
                    window.open(mapsUrl, '_blank');
                  }
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
