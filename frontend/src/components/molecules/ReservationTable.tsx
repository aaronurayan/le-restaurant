import React from 'react';
import { Reservation } from '../../hooks/useReservationManagementApi';
import ReservationCard from './ReservationCard';

/**
 * ReservationTable - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Table displaying list of reservations.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationTableProps {
  reservations: Reservation[];
  onViewDetails: (reservation: Reservation) => void;
  onApprove: (reservation: Reservation) => void;
  onDeny: (reservation: Reservation) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onViewDetails,
  onApprove,
  onDeny,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Party Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onViewDetails={onViewDetails}
                  onApprove={onApprove}
                  onDeny={onDeny}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
