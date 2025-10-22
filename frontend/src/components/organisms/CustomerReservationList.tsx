/**
 * CustomerReservationList Organism Component (F108)
 * Customer interface for viewing and managing their own reservations
 * 
 * @module F108-CustomerReservation
 * @follows Atomic Design Pattern - Organism level
 * @colors 05-frontend-design.md compliant
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  RefreshCw,
  Plus,
  Filter,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types/reservation';
import { useReservationApi } from '../../hooks/useReservationApi';
import { ReservationCard } from '../molecules/ReservationCard';

interface CustomerReservationListProps {
  customerId: string;
  onNewReservation?: () => void;
  className?: string;
}

/**
 * CustomerReservationList Component
 * Displays customer's reservations with filtering and cancellation options
 * Implements F108 business logic for customer-side reservation management
 */
export const CustomerReservationList: React.FC<CustomerReservationListProps> = ({
  customerId,
  onNewReservation,
  className = '',
}) => {
  const {
    reservations: apiReservations,
    loading: apiLoading,
    error: apiError,
    loadReservationsByCustomer,
    cancelReservation,
    isBackendConnected,
  } = useReservationApi();

  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [filterType, setFilterType] = useState<'upcoming' | 'past'>('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  // Load customer's reservations on mount and when customerId changes
  useEffect(() => {
    if (customerId) {
      loadReservationsByCustomer(Number(customerId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]); // Only depend on customerId, not the function

  // Filter reservations when data or filter type changes
  useEffect(() => {
    filterReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReservations, filterType]);

  /**
   * Filter reservations based on upcoming/past status
   */
  const filterReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = apiReservations;

    if (filterType === 'upcoming') {
      // Upcoming: PENDING or CONFIRMED, and date is today or future
      filtered = filtered.filter((r: Reservation) => {
        const reservationDate = new Date(r.reservationDate);
        reservationDate.setHours(0, 0, 0, 0);

        return (
          (r.status === ReservationStatus.PENDING || r.status === ReservationStatus.CONFIRMED) &&
          reservationDate >= today
        );
      });
    } else {
      // Past: COMPLETED, CANCELLED, NO_SHOW, or past dates
      filtered = filtered.filter((r: Reservation) => {
        const reservationDate = new Date(r.reservationDate);
        reservationDate.setHours(0, 0, 0, 0);

        return (
          r.status === ReservationStatus.COMPLETED ||
          r.status === ReservationStatus.CANCELLED ||
          r.status === ReservationStatus.NO_SHOW ||
          r.status === ReservationStatus.SEATED ||
          reservationDate < today
        );
      });
    }

    // Sort by date (upcoming: ascending, past: descending)
    filtered.sort((a: Reservation, b: Reservation) => {
      const dateA = new Date(a.reservationDate + 'T' + a.reservationTime).getTime();
      const dateB = new Date(b.reservationDate + 'T' + b.reservationTime).getTime();
      return filterType === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    setFilteredReservations(filtered);
  };

  /**
   * Handle cancel button click - show confirmation modal
   */
  const handleCancelClick = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowCancelModal(true);
  };

  /**
   * Confirm cancellation
   */
  const confirmCancellation = async () => {
    if (!selectedReservationId) return;

    try {
      await cancelReservation(Number(selectedReservationId));
      setShowCancelModal(false);
      setSelectedReservationId(null);
      // Reload customer's reservations
      if (customerId) {
        await loadReservationsByCustomer(Number(customerId));
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
    }
  };

  /**
   * View reservation details (expand inline or navigate)
   */
  const handleViewDetails = (reservationId: string) => {
    // TODO: Implement detailed view
    console.log('View details for reservation:', reservationId);
  };

  const upcomingCount = apiReservations.filter((r: Reservation) => {
    const reservationDate = new Date(r.reservationDate);
    reservationDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      (r.status === ReservationStatus.PENDING || r.status === ReservationStatus.CONFIRMED) &&
      reservationDate >= today
    );
  }).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">My Reservations</h2>
          <p className="text-neutral-600 mt-1">
            View and manage your restaurant reservations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isBackendConnected && (
            <div className="flex items-center text-secondary-700 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Backend Connected</span>
            </div>
          )}

          {onNewReservation && (
            <button
              onClick={onNewReservation}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              aria-label="Make a new reservation"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Reservation</span>
            </button>
          )}

          <button
            onClick={() => customerId && loadReservationsByCustomer(Number(customerId))}
            disabled={apiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            aria-label="Refresh reservations list"
          >
            <RefreshCw className={`w-4 h-4 ${apiLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-500/20 rounded-lg">
            <Calendar className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">Upcoming Reservations</p>
            <p className="text-2xl font-bold text-neutral-900">{upcomingCount}</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-accent-red">Error</p>
            <p className="text-sm text-neutral-700 mt-1">{apiError}</p>
          </div>
          <button
            onClick={() => customerId && loadReservationsByCustomer(Number(customerId))}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Dismiss error and retry"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'upcoming'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilterType('past')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === 'past'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
            >
              Past ({apiReservations.length - upcomingCount})
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {apiLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading your reservations...</p>
        </div>
      )}

      {/* Empty State */}
      {!apiLoading && filteredReservations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-neutral-900">
            {filterType === 'upcoming' ? 'No Upcoming Reservations' : 'No Past Reservations'}
          </p>
          <p className="text-neutral-600 mt-1">
            {filterType === 'upcoming'
              ? 'You have no upcoming reservations at this time'
              : 'You have no past reservations'}
          </p>
          {filterType === 'upcoming' && onNewReservation && (
            <button
              onClick={onNewReservation}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Make a Reservation
            </button>
          )}
        </div>
      )}

      {/* Reservation Cards Grid */}
      {!apiLoading && filteredReservations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onViewDetails={handleViewDetails}
              onCancel={handleCancelClick}
              showActions={
                reservation.status === ReservationStatus.PENDING ||
                reservation.status === ReservationStatus.CONFIRMED
              }
            />
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Cancel Reservation</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservationId(null);
                }}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="Close cancellation modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-6">
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservationId(null);
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Keep Reservation
              </button>
              <button
                onClick={confirmCancellation}
                disabled={apiLoading}
                className="flex-1 px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReservationList;
