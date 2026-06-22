import React from 'react';
import { ReservationStatus } from '../../hooks/useReservationManagementApi';
import { getReservationStatusClasses } from '../../utils/statusColors';

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
  // Colours come from the shared design-system mapping so reservation statuses
  // render consistently with the rest of the app (no more page-specific palettes).
  const colors = getReservationStatusClasses(status);

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors.bg} ${colors.text} ${className}`}
    >
      {status}
    </span>
  );
};

export default ReservationStatusBadge;
