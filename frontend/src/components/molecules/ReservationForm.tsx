import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { ReservationFormData } from '../../types/reservation';
import { useReservationApi } from '../../hooks/useReservationApi';

interface ReservationFormProps {
  onSubmit: (data: ReservationFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  className = '',
}) => {
  const { getTimeSlots } = useReservationApi();

  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    partySize: '', // partySize is stored as a string
    specialRequests: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<ReservationFormData>>({});

  useEffect(() => {
    if (formData.date && Number(formData.partySize)) {
      loadTimeSlots();
    }
  }, [formData.date, formData.partySize]);

  const loadTimeSlots = async () => {
    try {
      const slots = await getTimeSlots(formData.date, Number(formData.partySize)); // Convert partySize to number
      console.log('Time slots fetched:', slots); // Debugging log
      setTimeSlots(slots); // Update the timeSlots state
    } catch (error) {
      console.error('Failed to load time slots:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (Number(formData.partySize) < 1) newErrors.partySize = 'Party size must be at least 1'; // Convert partySize to number
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';

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
      onSubmit({ ...formData, partySize: formData.partySize.toString() }); // Convert partySize to number before submission
    }
  };

  const handleInputChange = (field: keyof ReservationFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'partySize' ? String(value) : value, // Ensure partySize is stored as a string
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
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
            name="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            required
          >
            <option value="">Select time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && <p className="mt-1 text-sm text-accent-red">{errors.time}</p>}
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
            onClick={() => handleInputChange('partySize', Math.max(1, Number(formData.partySize) - 1))} // Convert partySize to number
            disabled={Number(formData.partySize) <= 1} // Convert partySize to number
          >
            -
          </button>
          <span>{formData.partySize}</span>
          <button
            type="button"
            onClick={() => handleInputChange('partySize', Number(formData.partySize) + 1)} // Convert partySize to number
            disabled={Number(formData.partySize) >= 20} // Convert partySize to number
          >
            +
          </button>
        </div>
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
