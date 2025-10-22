import React, { useState } from 'react';
import { Reservation } from '../../hooks/useReservationManagementApi';

/**
 * ReservationDenialModal - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Modal for denying a reservation with required reason.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationDenialModalProps {
  reservation: Reservation;
  onDeny: (denialReason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const ReservationDenialModal: React.FC<ReservationDenialModalProps> = ({
  reservation,
  onDeny,
  onCancel,
  loading,
}) => {
  const [denialReason, setDenialReason] = useState('');

  const handleSubmit = () => {
    if (!denialReason.trim()) return;
    onDeny(denialReason.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Deny Reservation</h3>
        <p className="text-gray-600 mb-4">
          Deny reservation for <strong>{reservation.customerName}</strong>
        </p>

        <div>
          <label htmlFor="denial-reason" className="block text-sm font-medium text-gray-700 mb-2">
            Denial Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id="denial-reason"
            value={denialReason}
            onChange={(e) => setDenialReason(e.target.value)}
            placeholder="Please provide a reason for denial..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || !denialReason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
          >
            Confirm Denial
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDenialModal;
