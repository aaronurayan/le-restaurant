import React from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Truck, 
  Clock,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { DeliveryPerson } from '../../types/delivery';
import { StatusBadge } from '../atoms/StatusBadge';
import { MapPin as MapPinComponent } from '../atoms/MapPin';
import { Button } from '../atoms/Button';

interface DeliveryPersonCardProps {
  person: DeliveryPerson;
  onStatusUpdate?: (personId: string, status: 'available' | 'busy' | 'offline') => void;
  onViewDetails?: (personId: string) => void;
  onAssignDelivery?: (personId: string) => void;
  className?: string;
}

const statusIcons = {
  available: Wifi,
  busy: Clock,
  offline: WifiOff
};

const vehicleIcons = {
  bicycle: '🚲',
  motorcycle: '🏍️',
  car: '🚗'
};

export const DeliveryPersonCard: React.FC<DeliveryPersonCardProps> = ({
  person,
  onStatusUpdate,
  onViewDetails,
  onAssignDelivery,
  className = ''
}) => {
  const StatusIcon = statusIcons[person.status];
  const vehicleIcon = vehicleIcons[person.vehicleType];

  const getStatusColor = () => {
    switch (person.status) {
      case 'available':
        return 'border-l-green-400 bg-green-50';
      case 'busy':
        return 'border-l-orange-400 bg-orange-50';
      case 'offline':
        return 'border-l-gray-400 bg-gray-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const canAssignDelivery = () => {
    return person.status === 'available' && person.isActive;
  };

  const getNextStatus = () => {
    switch (person.status) {
      case 'available':
        return 'busy';
      case 'busy':
        return 'offline';
      case 'offline':
        return 'available';
      default:
        return 'available';
    }
  };

  return (
    <div className={`
      bg-white rounded-xl shadow-md border-l-4 ${getStatusColor()}
      hover:shadow-lg transition-all duration-200
      ${!person.isActive ? 'opacity-60' : ''}
      ${className}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{person.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl">{vehicleIcon}</span>
                <span className="text-sm text-neutral-500 capitalize">
                  {person.vehicleType.replace('_', ' ')}
                </span>
                <span className="text-sm text-neutral-500">
                  • Max {person.maxCapacity} orders
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <StatusBadge status={person.status} size="sm" />
            {!person.isActive && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Inactive</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600">{person.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-600">{person.email}</span>
          </div>
        </div>

        {/* Current Location */}
        {person.currentLocation && (
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Current Location</p>
              <p className="text-sm font-medium text-neutral-900">
                {person.currentLocation.latitude.toFixed(4)}, {person.currentLocation.longitude.toFixed(4)}
              </p>
            </div>
            <MapPinComponent
              latitude={person.currentLocation.latitude}
              longitude={person.currentLocation.longitude}
              variant="current"
              size="sm"
            />
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-neutral-900">{person.rating}</span>
            </div>
            <p className="text-xs text-neutral-500">Rating</p>
          </div>
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="font-semibold text-neutral-900 mb-1">
              {person.totalDeliveries}
            </div>
            <p className="text-xs text-neutral-500">Total Deliveries</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
          <StatusIcon className="w-4 h-4 text-neutral-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">
              {person.status === 'available' && 'Ready for new deliveries'}
              {person.status === 'busy' && 'Currently on delivery'}
              {person.status === 'offline' && 'Not available'}
            </p>
            <p className="text-xs text-neutral-500">
              Last updated: {new Date(person.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {onStatusUpdate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(person.id, getNextStatus())}
              disabled={!person.isActive}
            >
              {person.status === 'available' ? 'Set Busy' : 
               person.status === 'busy' ? 'Set Offline' : 'Set Available'}
            </Button>
          )}
          
          {canAssignDelivery() && onAssignDelivery && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAssignDelivery(person.id)}
            >
              Assign Delivery
            </Button>
          )}
          
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(person.id)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
