import React from 'react';
import { ReservationStatus } from '../../hooks/useReservationManagementApi';

/**
 * ReservationStatusBadge - Atom Component
 * F109 - Reservation Management Feature
 * 
 * Displays a colored badge for reservation status.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  className?: string;
}

const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ReservationStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case ReservationStatus.DENIED:
        return 'bg-red-100 text-red-800';
      case ReservationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ReservationStatus.SEATED:
        return 'bg-blue-100 text-blue-800';
      case ReservationStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case ReservationStatus.NO_SHOW:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)} ${className}`}
    >
      {status}
    </span>
  );
};

export default ReservationStatusBadge;
