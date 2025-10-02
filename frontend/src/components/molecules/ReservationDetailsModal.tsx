import React from 'react';
import { Reservation } from '../../hooks/useReservationManagementApi';
import ReservationStatusBadge from '../atoms/ReservationStatusBadge';

/**
 * ReservationDetailsModal - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Modal showing complete reservation details.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationDetailsModalProps {
  reservation: Reservation;
  onClose: () => void;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Reservation Details</h3>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Reservation ID</p>
              <p className="text-base text-gray-900">#{reservation.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <ReservationStatusBadge status={reservation.status} />
            </div>
          </div>

          <hr />

          <div>
            <p className="text-sm font-medium text-gray-500">Customer Name</p>
            <p className="text-base text-gray-900">{reservation.customerName}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base text-gray-900">{reservation.customerEmail}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-base text-gray-900">{reservation.customerPhone}</p>
          </div>

          <hr />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-base text-gray-900">
                {formatDate(reservation.reservationDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-base text-gray-900">
                {formatTime(reservation.reservationTime)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Party Size</p>
              <p className="text-base text-gray-900">{reservation.partySize} guests</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Table</p>
              <p className="text-base text-gray-900">
                {reservation.tableId ? `Table ${reservation.tableId}` : 'Not assigned'}
              </p>
            </div>
          </div>

          {reservation.specialRequests && (
            <>
              <hr />
              <div>
                <p className="text-sm font-medium text-gray-500">Special Requests</p>
                <p className="text-base text-gray-900">{reservation.specialRequests}</p>
              </div>
            </>
          )}

          {reservation.adminNotes && (
            <>
              <hr />
              <div>
                <p className="text-sm font-medium text-gray-500">Admin Notes</p>
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {reservation.adminNotes}
                </p>
              </div>
            </>
          )}

          <hr />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-500">Created At</p>
              <p className="text-sm text-gray-900">
                {new Date(reservation.createdAt).toLocaleString()}
              </p>
            </div>
            {reservation.confirmedAt && (
              <div>
                <p className="text-xs font-medium text-gray-500">Confirmed At</p>
                <p className="text-sm text-gray-900">
                  {new Date(reservation.confirmedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;
