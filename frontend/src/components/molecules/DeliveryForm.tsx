import React, { useState, useEffect } from 'react';
import {
  Package,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin
} from 'lucide-react';
import { DeliveryPerson, CreateDeliveryAssignmentRequest } from '../../types/delivery';
import { Button } from '../atoms/Button';
import { StatusBadge } from '../atoms/StatusBadge';

interface DeliveryFormProps {
  orderId: string;
  availablePersons: DeliveryPerson[];
  onSubmit: (data: CreateDeliveryAssignmentRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  orderId,
  availablePersons,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<CreateDeliveryAssignmentRequest>({
    orderId,
    deliveryPersonId: '',
    estimatedDeliveryTime: '',
    priority: 'normal',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<CreateDeliveryAssignmentRequest>>({});

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMaxDateTime = () => {
    const max = new Date();
    max.setDate(max.getDate() + 7); // Maximum 7 days from now
    return max.toISOString().slice(0, 16);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDeliveryAssignmentRequest> = {};

    if (!formData.deliveryPersonId) {
      newErrors.deliveryPersonId = 'Please select a delivery person';
    }

    if (!formData.estimatedDeliveryTime) {
      newErrors.estimatedDeliveryTime = 'Please set estimated delivery time';
    } else {
      const selectedTime = new Date(formData.estimatedDeliveryTime);
      const minTime = new Date();
      minTime.setMinutes(minTime.getMinutes() + 30);

      if (selectedTime < minTime) {
        newErrors.estimatedDeliveryTime = 'Delivery time must be at least 30 minutes from now';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateDeliveryAssignmentRequest, value: string) => {
    // Round time to nearest 5 minutes for estimatedDeliveryTime
    if (field === 'estimatedDeliveryTime' && value) {
      const date = new Date(value);
      const minutes = date.getMinutes();
      const roundedMinutes = Math.round(minutes / 5) * 5;
      date.setMinutes(roundedMinutes);
      date.setSeconds(0);
      date.setMilliseconds(0);
      value = date.toISOString().slice(0, 16);
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedPerson = availablePersons.find(p => p.id === formData.deliveryPersonId);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Order Information */}
      <div className="p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Package className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">Order #{orderId}</h3>
            <p className="text-sm text-neutral-500">Create delivery assignment</p>
          </div>
        </div>
      </div>

      {/* Delivery Person Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Delivery Person
          <span className="text-accent-red ml-1">*</span>
        </label>

        {availablePersons.length === 0 ? (
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                No available delivery persons. Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {availablePersons.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => handleInputChange('deliveryPersonId', person.id)}
                className={`w-full p-3 border rounded-lg text-left transition-all duration-200 ${formData.deliveryPersonId === person.id
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-300 hover:border-primary-300 hover:bg-neutral-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{person.name}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span>🚗 {person.vehicleType}</span>
                        <span>⭐ {person.rating}</span>
                        <span>{person.totalDeliveries} deliveries</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={person.status} size="sm" />
                </div>
              </button>
            ))}
          </div>
        )}

        {errors.deliveryPersonId && (
          <p className="mt-1 text-sm text-accent-red">{errors.deliveryPersonId}</p>
        )}
      </div>

      {/* Selected Person Details */}
      {selectedPerson && (
        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">Selected Delivery Person</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-neutral-500">Name</p>
              <p className="font-medium text-neutral-900">{selectedPerson.name}</p>
            </div>
            <div>
              <p className="text-neutral-500">Phone</p>
              <p className="font-medium text-neutral-900">{selectedPerson.phone}</p>
            </div>
            <div>
              <p className="text-neutral-500">Vehicle</p>
              <p className="font-medium text-neutral-900 capitalize">
                {selectedPerson.vehicleType.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-neutral-500">Max Capacity</p>
              <p className="font-medium text-neutral-900">{selectedPerson.maxCapacity} orders</p>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Delivery Time */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          Estimated Delivery Time
          <span className="text-accent-red ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={formData.estimatedDeliveryTime.slice(0, 10)}
              onChange={(e) => {
                const currentTime = formData.estimatedDeliveryTime.slice(11, 16) || '12:00';
                handleInputChange('estimatedDeliveryTime', `${e.target.value}T${currentTime}`);
              }}
              min={getMinDateTime().slice(0, 10)}
              max={getMaxDateTime().slice(0, 10)}
              required
              className="w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-neutral-300"
            />
          </div>
          
          {/* Time Picker - 5 minute intervals */}
          <div>
            <select
              value={formData.estimatedDeliveryTime.slice(11, 16) || ''}
              onChange={(e) => {
                const currentDate = formData.estimatedDeliveryTime.slice(0, 10) || new Date().toISOString().slice(0, 10);
                handleInputChange('estimatedDeliveryTime', `${currentDate}T${e.target.value}`);
              }}
              required
              className="w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-neutral-300 bg-white"
            >
              <option value="">Select time</option>
              {Array.from({ length: 24 * 12 }, (_, i) => {
                const hours = Math.floor(i / 12);
                const minutes = (i % 12) * 5;
                const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                return (
                  <option key={timeStr} value={timeStr}>
                    {timeStr}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        
        {errors.estimatedDeliveryTime && (
          <p className="mt-1 text-sm text-accent-red">{errors.estimatedDeliveryTime}</p>
        )}
      </div>

      {/* Priority Selection */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Priority Level
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800 border-gray-300' },
            { id: 'normal', name: 'Normal', color: 'bg-blue-100 text-blue-800 border-blue-300' },
            { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' },
            { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' }
          ].map((priority) => (
            <button
              key={priority.id}
              type="button"
              onClick={() => handleInputChange('priority', priority.id)}
              className={`p-2 border rounded-lg text-sm font-medium transition-all duration-200 ${formData.priority === priority.id
                ? `${priority.color} border-current`
                : 'border-neutral-300 hover:border-neutral-400'
                }`}
            >
              {priority.name}
            </button>
          ))}
        </div>
      </div>

      {/* Special Notes */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Special Instructions (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Any special instructions for the delivery person..."
          rows={3}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
          disabled={availablePersons.length === 0}
        >
          Create Assignment
        </Button>
      </div>
    </form>
  );
};
