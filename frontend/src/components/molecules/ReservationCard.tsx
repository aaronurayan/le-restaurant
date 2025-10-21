/**
 * ReservationCard Molecule Component (F108/F109)
 * Displays individual reservation information with status and actions
 * 
 * @module F108-CustomerReservation, F109-ManagerApproval
 * @follows Atomic Design Pattern - Molecule level
 * @colors 05-frontend-design.md compliant
 */

import React from 'react';
import { Calendar, Clock, Users, MapPin, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types/reservation';

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  showActions?: boolean;
  className?: string;
}

/**
 * Get status styling based on reservation status
 * Uses 05-frontend-design.md color palette
 */
const getStatusStyle = (status: ReservationStatus): string => {
  const styles = {
    [ReservationStatus.PENDING]: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
    [ReservationStatus.CONFIRMED]: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
    [ReservationStatus.SEATED]: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
    [ReservationStatus.COMPLETED]: 'bg-secondary-500/20 text-secondary-600 border-secondary-500/30',
    [ReservationStatus.CANCELLED]: 'bg-accent-red/20 text-accent-red border-accent-red/30',
    [ReservationStatus.NO_SHOW]: 'bg-neutral-400/20 text-neutral-600 border-neutral-400/30',
  };
  return styles[status] || styles[ReservationStatus.PENDING];
};

/**
 * Get status icon based on reservation status
 */
const getStatusIcon = (status: ReservationStatus) => {
  const icons = {
    [ReservationStatus.PENDING]: AlertCircle,
    [ReservationStatus.CONFIRMED]: CheckCircle,
    [ReservationStatus.SEATED]: Users,
    [ReservationStatus.COMPLETED]: CheckCircle,
    [ReservationStatus.CANCELLED]: XCircle,
    [ReservationStatus.NO_SHOW]: XCircle,
  };
  const Icon = icons[status] || AlertCircle;
  return <Icon className="w-4 h-4" />;
};

/**
 * Format date to readable string
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * ReservationCard Component
 * Displays reservation details with optional manager actions (F109)
 */
export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onApprove,
  onReject,
  onCancel,
  showActions = false,
  className = '',
}) => {
  const isPending = reservation.status === ReservationStatus.PENDING;
  const canApprove = showActions && isPending && onApprove;
  const canReject = showActions && isPending && onReject;
  const canCancel = onCancel && (reservation.status === ReservationStatus.CONFIRMED || isPending);

  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                {reservation.customerInfo.name}
              </h3>
              <span 
                className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusStyle(reservation.status)}`}
              >
                {getStatusIcon(reservation.status)}
                {reservation.status}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              Reservation ID: {reservation.id}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-neutral-700">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">{formatDate(reservation.reservationDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-700">
            <Clock className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium">{reservation.reservationTime}</span>
          </div>
        </div>

        {/* Party Size */}
        <div className="flex items-center gap-2 text-neutral-700">
          <Users className="w-4 h-4 text-primary-500" />
          <span className="text-sm">
            {reservation.partySize} {reservation.partySize === 1 ? 'guest' : 'guests'}
          </span>
        </div>

        {/* Table Info */}
        {reservation.tableInfo && (
          <div className="flex items-center gap-2 text-neutral-700">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="text-sm">
              Table {reservation.tableInfo.number} ({reservation.tableInfo.location})
              <span className="text-neutral-500 ml-1">- Capacity: {reservation.tableInfo.capacity}</span>
            </span>
          </div>
        )}

        {/* Special Requests */}
        {reservation.specialRequests && (
          <div className="flex items-start gap-2 text-neutral-700 bg-neutral-50 p-3 rounded-md">
            <MessageSquare className="w-4 h-4 text-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-neutral-600 mb-1">Special Requests:</p>
              <p className="text-sm">{reservation.specialRequests}</p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">Contact Information:</p>
          <p className="text-sm text-neutral-700">{reservation.customerInfo.email}</p>
          <p className="text-sm text-neutral-700">{reservation.customerInfo.phone}</p>
        </div>

        {/* Timestamps */}
        <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500 space-y-1">
          <p>Created: {new Date(reservation.createdAt).toLocaleString('en-AU')}</p>
          {reservation.confirmedAt && (
            <p>Confirmed: {new Date(reservation.confirmedAt).toLocaleString('en-AU')}</p>
          )}
          {reservation.checkedInAt && (
            <p>Checked In: {new Date(reservation.checkedInAt).toLocaleString('en-AU')}</p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {showActions && (canApprove || canReject || canCancel || onViewDetails) && (
        <div className="p-4 bg-neutral-50 rounded-b-lg border-t border-neutral-200 flex flex-wrap gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(reservation.id)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              View Details
            </button>
          )}
          
          {/* F109 Manager Actions */}
          {canApprove && (
            <button
              onClick={() => onApprove(reservation.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary-500 rounded-lg hover:bg-secondary-600 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          )}
          
          {canReject && (
            <button
              onClick={() => onReject(reservation.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-accent-red rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};
