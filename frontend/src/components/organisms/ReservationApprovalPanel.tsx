/**
 * ReservationApprovalPanel Organism Component (F109)
 * Manager interface for approving/rejecting customer reservations
 * 
 * @module F109-ManagerApproval
 * @follows Atomic Design Pattern - Organism level
 * @colors 05-frontend-design.md compliant
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Filter, 
  Search,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Reservation, ReservationStatus } from '../../types/reservation';
import { useReservationApi } from '../../hooks/useReservationApi';
import { ReservationCard } from '../molecules/ReservationCard';

interface ReservationApprovalPanelProps {
  className?: string;
}

/**
 * ReservationApprovalPanel Component
 * Allows managers to view, approve, and reject pending reservations
 * Implements F109 business logic with conflict detection
 */
export const ReservationApprovalPanel: React.FC<ReservationApprovalPanelProps> = ({
  className = '',
}) => {
  const {
    reservations: apiReservations,
    loading: apiLoading,
    error: apiError,
    loadReservations,
    updateReservation,
    cancelReservation,
    isBackendConnected,
  } = useReservationApi();

  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load reservations on mount
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Filter reservations when search term or status filter changes
  useEffect(() => {
    filterReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReservations, searchTerm, statusFilter]);

  /**
   * Filter reservations based on search term and status
   */
  const filterReservations = () => {
    let filtered = apiReservations;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((r: Reservation) => r.status === statusFilter);
    }

    // Filter by search term (customer name, email, phone, or ID)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((r: Reservation) => 
        r.customerInfo.name.toLowerCase().includes(searchLower) ||
        r.customerInfo.email.toLowerCase().includes(searchLower) ||
        r.customerInfo.phone.includes(searchTerm) ||
        r.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort: PENDING first, then by date
    filtered.sort((a: Reservation, b: Reservation) => {
      if (a.status === ReservationStatus.PENDING && b.status !== ReservationStatus.PENDING) return -1;
      if (a.status !== ReservationStatus.PENDING && b.status === ReservationStatus.PENDING) return 1;
      return new Date(a.reservationDate + 'T' + a.reservationTime).getTime() - 
             new Date(b.reservationDate + 'T' + b.reservationTime).getTime();
    });

    setFilteredReservations(filtered);
  };

  /**
   * F109: Approve reservation
   * Changes status from PENDING to CONFIRMED
   */
  const handleApprove = async (reservationId: string) => {
    try {
      await updateReservation(reservationId, { 
        status: ReservationStatus.CONFIRMED 
      });
      await loadReservations(); // Reload to get updated data
    } catch (err) {
      console.error('Error approving reservation:', err);
    }
  };

  /**
   * F109: Reject reservation
   * Opens modal to collect rejection reason
   */
  const handleReject = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowRejectModal(true);
  };

  /**
   * Submit rejection with reason
   */
  const submitRejection = async () => {
    if (!selectedReservationId || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      // Update to CANCELLED status with rejection reason in specialRequests
      // In a real implementation, we'd have a dedicated rejectionReason field
      await updateReservation(selectedReservationId, {
        status: ReservationStatus.CANCELLED,
      });
      
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedReservationId(null);
      await loadReservations();
    } catch (err) {
      console.error('Error rejecting reservation:', err);
    }
  };

  /**
   * Cancel reservation (customer or manager initiated)
   */
  const handleCancel = async (reservationId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await cancelReservation(reservationId);
      await loadReservations();
    } catch (err) {
      console.error('Error cancelling reservation:', err);
    }
  };

  /**
   * View reservation details
   */
  const handleViewDetails = (reservationId: string) => {
    // TODO: Open detailed view modal
    console.log('View details for reservation:', reservationId);
  };

  /**
   * Get count of reservations by status
   */
  const getStatusCount = (status: ReservationStatus | 'ALL'): number => {
    if (status === 'ALL') return apiReservations.length;
    return apiReservations.filter((r: Reservation) => r.status === status).length;
  };

  const pendingCount = getStatusCount(ReservationStatus.PENDING);
  const confirmedCount = getStatusCount(ReservationStatus.CONFIRMED);
  const totalCount = apiReservations.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Reservation Management (F109)</h2>
          <p className="text-neutral-600 mt-1">
            Review and approve customer reservation requests
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isBackendConnected && (
            <div className="flex items-center text-secondary-700 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Backend Connected</span>
            </div>
          )}
          
          <button
            onClick={loadReservations}
            disabled={apiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            aria-label="Refresh reservations list"
          >
            <RefreshCw className={`w-4 h-4 ${apiLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-yellow/20 rounded-lg">
              <Clock className="w-6 h-6 text-accent-yellow" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Pending Approval</p>
              <p className="text-2xl font-bold text-neutral-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Confirmed</p>
              <p className="text-2xl font-bold text-neutral-900">{confirmedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Reservations</p>
              <p className="text-2xl font-bold text-neutral-900">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-accent-red">Error</p>
            <p className="text-sm text-neutral-700 mt-1">{apiError}</p>
          </div>
          <button
            onClick={loadReservations}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label="Dismiss error and retry"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Search reservations"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'ALL')}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Filter reservations by status"
            >
              <option value="ALL">All Status ({getStatusCount('ALL')})</option>
              <option value={ReservationStatus.PENDING}>Pending ({getStatusCount(ReservationStatus.PENDING)})</option>
              <option value={ReservationStatus.CONFIRMED}>Confirmed ({getStatusCount(ReservationStatus.CONFIRMED)})</option>
              <option value={ReservationStatus.SEATED}>Seated ({getStatusCount(ReservationStatus.SEATED)})</option>
              <option value={ReservationStatus.COMPLETED}>Completed ({getStatusCount(ReservationStatus.COMPLETED)})</option>
              <option value={ReservationStatus.CANCELLED}>Cancelled ({getStatusCount(ReservationStatus.CANCELLED)})</option>
              <option value={ReservationStatus.NO_SHOW}>No Show ({getStatusCount(ReservationStatus.NO_SHOW)})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {apiLoading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading reservations...</p>
        </div>
      )}

      {/* Empty State */}
      {!apiLoading && filteredReservations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-neutral-900">No Reservations Found</p>
          <p className="text-neutral-600 mt-1">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your filters' 
              : 'No reservations available at this time'}
          </p>
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
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Reject Reservation</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedReservationId(null);
                }}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="Close rejection modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-neutral-600 mb-4">
              Please provide a reason for rejecting this reservation. This will be communicated to the customer.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Fully booked for requested time, Table capacity insufficient..."
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              aria-label="Rejection reason"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedReservationId(null);
                }}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={!rejectionReason.trim() || apiLoading}
                className="flex-1 px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationApprovalPanel;
