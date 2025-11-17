import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, MessageSquare, User, Mail, Phone } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { ReservationFormData, Table, TimeSlot } from '../../types/reservation';
import { useReservationApi } from '../../hooks/useReservationApi';

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
  initialCustomerData?: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  initialSpecialRequest?: string;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  className = '',
  initialCustomerData,
  initialSpecialRequest,
}) => {
  const { getAvailableTables, getTimeSlots } = useReservationApi();

  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: initialSpecialRequest || '',
    customerName: initialCustomerData?.customerName || '',
    customerEmail: initialCustomerData?.customerEmail || '',
    customerPhone: initialCustomerData?.customerPhone || '',
  });
  useEffect(() => {
    if (initialSpecialRequest) {
      setFormData((prev) => ({ ...prev, specialRequests: initialSpecialRequest }));
    }
  }, [initialSpecialRequest]);

  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});

  // 날짜가 변경될 때 시간대 업데이트
  useEffect(() => {
    if (formData.date && formData.partySize) {
      loadTimeSlots();
    }
  }, [formData.date, formData.partySize]);

  // 시간이 변경될 때 사용 가능한 테이블 업데이트
  useEffect(() => {
    if (formData.date && formData.time && formData.partySize) {
      loadAvailableTables();
    }
  }, [formData.date, formData.time, formData.partySize]);

  const loadTimeSlots = async () => {
    try {
      const slots = await getTimeSlots(formData.date, formData.partySize);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      setTimeSlots([]); // Clear time slots on error
    }
  };

  const loadAvailableTables = async () => {
    try {
      const tables = await getAvailableTables(formData.date, formData.time, formData.partySize);
      setAvailableTables(tables);
      if (tables.length > 0) {
        setSelectedTable(tables[0].id);
      }
    } catch (error) {
      console.error('Failed to load available tables:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.partySize < 1) newErrors.partySize = 'Party size must be at least 1';
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.customerEmail && !emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
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

  const handleInputChange = (field: keyof ReservationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from now
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className={'space-y-6 ' + className}>
      {/* Date and Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            type="date"
            label="Reservation Date"
            value={formData.date}
            onChange={(value) => handleInputChange('date', value)}
            error={errors.date}
            required
            min={getMinDate()}
            max={getMaxDate()}
            icon={Calendar}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Time
            <span className="text-accent-red ml-1">*</span>
          </label>
          <select
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className={'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent' + (errors.time ? ' border-accent-red focus:ring-accent-red' : ' border-neutral-300 focus:border-transparent')}
            required
          >
            <option value="">Select time</option>
            {timeSlots.map((slot) => (
              <option
                key={slot.time}
                value={slot.time}
                disabled={!slot.isAvailable}
              >
                {slot.time} {!slot.isAvailable ? '(Unavailable)' : ''}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="mt-1 text-sm text-accent-red">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Party Size */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <Users className="w-4 h-4 inline mr-1" />
          Party Size
          <span className="text-accent-red ml-1">*</span>
        </label>
        <div className="flex items-center border border-neutral-300 rounded-lg">
          <button
            type="button"
            onClick={() => handleInputChange('partySize', Math.max(1, formData.partySize - 1))}
            className="px-3 py-2 hover:bg-neutral-100 transition-colors"
            disabled={formData.partySize <= 1}
          >
            -
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
            {formData.partySize}
          </span>
          <button
            type="button"
            onClick={() => handleInputChange('partySize', formData.partySize + 1)}
            className="px-3 py-2 hover:bg-neutral-100 transition-colors"
            disabled={formData.partySize >= 20}
          >
            +
          </button>
        </div>
        {errors.partySize && (
          <p className="mt-1 text-sm text-accent-red">{errors.partySize}</p>
        )}
      </div>

      {/* Table Selection */}
      {availableTables.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Select Table
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedTable(table.id)}
                className={'p-3 border rounded-lg text-left transition-all duration-200' + (selectedTable === table.id ? ' border-primary-500 bg-primary-50 text-primary-700' : ' border-neutral-300 hover:border-primary-300 hover:bg-neutral-50')}
              >
                <div className="font-medium">Table {table.number}</div>
                <div className="text-sm text-neutral-600">
                  Capacity: {table.capacity}  {table.location}
                </div>
                {table.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {table.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="Full Name"
            value={formData.customerName}
            onChange={(value) => handleInputChange('customerName', value)}
            error={errors.customerName}
            required
            icon={User}
          />

          <Input
            type="email"
            label="Email Address"
            value={formData.customerEmail}
            onChange={(value) => handleInputChange('customerEmail', value)}
            error={errors.customerEmail}
            required
            icon={Mail}
          />
        </div>

        <Input
          type="tel"
          label="Phone Number"
          value={formData.customerPhone}
          onChange={(value) => handleInputChange('customerPhone', value)}
          error={errors.customerPhone}
          required
          icon={Phone}
        />
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Special Requests (Optional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleInputChange('specialRequests', e.target.value)}
          placeholder="Any special dietary requirements, celebrations, or preferences..."
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
        >
          Make Reservation
        </Button>
      </div>
    </form>
  );
};
