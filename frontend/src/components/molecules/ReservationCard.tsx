import React from 'react';
import { Reservation, ReservationStatus } from '../../hooks/useReservationManagementApi';
import ReservationStatusBadge from '../atoms/ReservationStatusBadge';

/**
 * ReservationCard - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Displays a single reservation as a table row with actions.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails: (reservation: Reservation) => void;
  onApprove: (reservation: Reservation) => void;
  onDeny: (reservation: Reservation) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onApprove,
  onDeny,
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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{reservation.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {reservation.customerName}
        </div>
        <div className="text-sm text-gray-500">
          {reservation.customerEmail}
        </div>
        <div className="text-sm text-gray-500">
          {reservation.customerPhone}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(reservation.reservationDate)}
        </div>
        <div className="text-sm text-gray-500">
          {formatTime(reservation.reservationTime)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {reservation.tableId ? `Table ${reservation.tableId}` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ReservationStatusBadge status={reservation.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(reservation)}
            className="text-blue-600 hover:text-blue-900"
            aria-label="View details"
          >
            View
          </button>
          {reservation.status === ReservationStatus.PENDING && (
            <>
              <button
                onClick={() => onApprove(reservation)}
                className="text-green-600 hover:text-green-900"
                aria-label="Approve reservation"
              >
                Approve
              </button>
              <button
                onClick={() => onDeny(reservation)}
                className="text-red-600 hover:text-red-900"
                aria-label="Deny reservation"
              >
                Deny
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ReservationCard;
