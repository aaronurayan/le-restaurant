import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { ReservationForm } from '../molecules/ReservationForm';
import { ReservationFormData, CreateReservationRequest } from '../../types/reservation';
import { useReservationApi } from '../../hooks/useReservationApi';
import { useAuth } from '../../contexts/AuthContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { createReservation, isBackendConnected } = useReservationApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationId, setReservationId] = useState<number>(0);

  const handleSubmit = async (formData: ReservationFormData) => {
    setIsSubmitting(true);

    try {
      const reservationRequest: CreateReservationRequest = {
        customerId: user?.id ? Number(user.id) : undefined, // Pass user ID if authenticated
        tableId: undefined, // Will be assigned by backend
        reservationDate: formData.date,
        reservationTime: formData.time,
        partySize: formData.partySize,
        specialRequests: formData.specialRequests || undefined,
        customerInfo: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
      };

      const newReservation = await createReservation(reservationRequest);
      setReservationId(newReservation.id);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to create reservation:', error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setReservationId(0);
    onClose();
  };

  const handleNewReservation = () => {
    setShowSuccess(false);
    setReservationId(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Make a Reservation</h2>
            <p className="text-neutral-600 mt-1">
              Book your table for a memorable dining experience
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Backend Connection Status */}
        {isBackendConnected && (
          <div className="px-6 py-3 bg-green-100 border-b border-green-200">
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium"> Connected to Backend API</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Reservation Confirmed!
              </h3>
              <p className="text-neutral-600 mb-6">
                Your table has been reserved. We'll send you a confirmation email shortly.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-neutral-600">
                  <strong>Reservation ID:</strong> {reservationId}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleNewReservation}
                  className="flex-1 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Make Another Reservation
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <ReservationForm
              onSubmit={handleSubmit}
              onCancel={handleClose}
              loading={isSubmitting}
              initialCustomerData={
                user
                  ? {
                    customerName: `${user.firstName} ${user.lastName}`,
                    customerEmail: user.email,
                    customerPhone: user.phoneNumber,
                  }
                  : undefined
              }
            />
          )}
        </div>

        {/* Footer */}
        {!showSuccess && (
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 rounded-b-xl">
            <div className="flex items-center text-sm text-neutral-600">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
              <span>
                Please arrive 5 minutes before your reservation time.
                We hold tables for 15 minutes past the reservation time.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
