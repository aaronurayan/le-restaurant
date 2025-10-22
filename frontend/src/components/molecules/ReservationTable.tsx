import React from 'react';
import { Reservation, ReservationStatus } from '../../hooks/useReservationManagementApi';
import { CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

/**
 * ReservationTable - Molecule Component
 * F109 - Reservation Management Feature
 * 
 * Table displaying list of reservations with admin actions.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationTableProps {
  reservations: Reservation[];
  onViewDetails: (reservation: Reservation) => void;
  onApprove: (reservation: Reservation) => void;
  onDeny: (reservation: Reservation) => void;
  onDelete?: (reservation: Reservation) => void;
}

const getStatusColor = (status: ReservationStatus): string => {
  const colors: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ReservationStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [ReservationStatus.SEATED]: 'bg-blue-100 text-blue-800',
    [ReservationStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
    [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800',
    [ReservationStatus.DENIED]: 'bg-red-100 text-red-800',
    [ReservationStatus.NO_SHOW]: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  onViewDetails,
  onApprove,
  onDeny,
  onDelete,
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
              reservations.map((reservation) => {
                const isPending = reservation.status === ReservationStatus.PENDING;
                
                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                      <div className="text-sm text-gray-500">{reservation.customerEmail}</div>
                      <div className="text-sm text-gray-500">{reservation.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.reservationDate}</div>
                      <div className="text-sm text-gray-500">{reservation.reservationTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.partySize} guests
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.tableId ? `Table #${reservation.tableId}` : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onViewDetails(reservation)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {isPending && (
                        <>
                          <button
                            onClick={() => onApprove(reservation)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeny(reservation)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            title="Deny"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => onDelete(reservation)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;
