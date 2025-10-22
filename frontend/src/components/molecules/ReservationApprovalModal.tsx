import React, { useState } from 'react';
import { Reservation } from '../../hooks/useReservationManagementApi';

/**
 * ReservationApprovalModal - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Modal for approving a reservation with optional table assignment.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationApprovalModalProps {
  reservation: Reservation;
  onApprove: (tableId?: number, adminNotes?: string) => void;
  onCancel: () => void;
  loading: boolean;
}

const ReservationApprovalModal: React.FC<ReservationApprovalModalProps> = ({
  reservation,
  onApprove,
  onCancel,
  loading,
}) => {
  const [tableId, setTableId] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');

  const handleSubmit = () => {
    onApprove(
      tableId ? parseInt(tableId) : undefined,
      adminNotes || undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Approve Reservation</h3>
        <p className="text-gray-600 mb-4">
          Approve reservation for <strong>{reservation.customerName}</strong>
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="table-id" className="block text-sm font-medium text-gray-700 mb-2">
              Table ID (Optional)
            </label>
            <input
              id="table-id"
              type="number"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              placeholder="Enter table number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="admin-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            Confirm Approval
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

export default ReservationApprovalModal;
