import React from 'react';
import { 
  Package, 
  User, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  Truck,
  Navigation
} from 'lucide-react';
import { DeliveryAssignment, DeliveryPerson } from '../../types/delivery';
import { StatusBadge } from '../atoms/StatusBadge';
import { TimeDisplay } from '../atoms/TimeDisplay';
import { MapPin as MapPinComponent } from '../atoms/MapPin';
import { Button } from '../atoms/Button';

interface DeliveryCardProps {
  delivery: DeliveryAssignment;
  deliveryPerson?: DeliveryPerson;
  onStatusUpdate?: (deliveryId: string, status: string) => void;
  onAssignPerson?: (deliveryId: string) => void;
  onViewDetails?: (deliveryId: string) => void;
  onTrackLocation?: (deliveryId: string) => void;
  className?: string;
}

const statusIcons = {
  preparing: Package,
  ready_for_pickup: Package,
  assigned: User,
  picked_up: Truck,
  in_transit: Navigation,
  delivered: CheckCircle,
  failed: AlertCircle
};

const priorityColors = {
  low: 'border-l-gray-400',
  normal: 'border-l-blue-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-400'
};

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  deliveryPerson,
  onStatusUpdate,
  onAssignPerson,
  onViewDetails,
  onTrackLocation,
  className = ''
}) => {
  const StatusIcon = statusIcons[delivery.status as keyof typeof statusIcons] || Package;
  const priorityColor = priorityColors[delivery.priority as keyof typeof priorityColors] || 'border-l-blue-400';

  const isOverdue = () => {
    if (!delivery.estimatedDeliveryTime) return false;
    const estimated = new Date(delivery.estimatedDeliveryTime);
    const now = new Date();
    return now > estimated && delivery.status !== 'delivered' && delivery.status !== 'failed';
  };

  const getNextStatus = () => {
    const statusOrder = ['preparing', 'ready_for_pickup', 'assigned', 'picked_up', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(delivery.status);
    return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : null;
  };

  const canUpdateStatus = () => {
    return delivery.status !== 'delivered' && delivery.status !== 'failed';
  };

  const canAssignPerson = () => {
    return delivery.status === 'ready_for_pickup' || delivery.status === 'preparing';
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-md border-l-4 ${priorityColor}
      hover:shadow-lg transition-all duration-200
      ${isOverdue() ? 'ring-2 ring-red-200' : ''}
      ${className}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <StatusIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                Order #{delivery.orderId}
              </h3>
              <p className="text-sm text-neutral-500">
                {deliveryPerson ? `Assigned to ${deliveryPerson.name}` : 'Unassigned'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={delivery.status} size="sm" />
            {isOverdue() && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Delivery Person Info */}
        {deliveryPerson && (
          <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{deliveryPerson.name}</p>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{deliveryPerson.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{deliveryPerson.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {deliveryPerson.rating} ⭐
              </p>
              <p className="text-xs text-neutral-500">
                {deliveryPerson.totalDeliveries} deliveries
              </p>
            </div>
          </div>
        )}

        {/* Timing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-neutral-500">Estimated Delivery</p>
              <TimeDisplay 
                time={delivery.estimatedDeliveryTime} 
                type="datetime"
                variant="compact"
              />
            </div>
          </div>
          
          {delivery.actualDeliveryTime && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-neutral-500">Actual Delivery</p>
                <TimeDisplay 
                  time={delivery.actualDeliveryTime} 
                  type="datetime"
                  variant="compact"
                />
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        {deliveryPerson?.currentLocation && (
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Current Location</p>
              <p className="text-sm font-medium text-neutral-900">
                {deliveryPerson.currentLocation.latitude.toFixed(4)}, {deliveryPerson.currentLocation.longitude.toFixed(4)}
              </p>
            </div>
            <MapPinComponent
              latitude={deliveryPerson.currentLocation.latitude}
              longitude={deliveryPerson.currentLocation.longitude}
              variant="current"
              size="sm"
            />
          </div>
        )}

        {/* Notes */}
        {delivery.notes && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                <p className="text-sm text-yellow-700">{delivery.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {canUpdateStatus() && onStatusUpdate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextStatus = getNextStatus();
                if (nextStatus) onStatusUpdate(delivery.id, nextStatus);
              }}
            >
              Update Status
            </Button>
          )}
          
          {canAssignPerson() && onAssignPerson && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssignPerson(delivery.id)}
            >
              Assign Person
            </Button>
          )}
          
          {onTrackLocation && deliveryPerson?.currentLocation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTrackLocation(delivery.id)}
            >
              Track Location
            </Button>
          )}
          
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(delivery.id)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
