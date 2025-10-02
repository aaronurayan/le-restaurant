import React, { useEffect, useState, useCallback } from 'react';
import {
  useReservationManagementApi,
  Reservation,
  ReservationStatus,
  ReservationFilters as IReservationFilters,
} from '../../hooks/useReservationManagementApi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ReservationFiltersComponent from '../molecules/ReservationFilters';
import ReservationTable from '../molecules/ReservationTable';
import ReservationApprovalModal from '../molecules/ReservationApprovalModal';
import ReservationDenialModal from '../molecules/ReservationDenialModal';
import ReservationDetailsModal from '../molecules/ReservationDetailsModal';

/**
 * ReservationManagementPanel - Organism Component
 * F109 - Reservation Management Feature
 * 
 * Admin panel for viewing, approving, and denying customer reservations.
 * Orchestrates atomic and molecular components following Atomic Design Pattern.
 * 
 * @author Le Restaurant Development Team
 */

const ReservationManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    reservations,
    loading,
    error,
    fetchReservations,
    fetchPendingReservations,
    approveReservation,
    denyReservation,
  } = useReservationManagementApi();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDenialModal, setShowDenialModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Load reservations on mount
  const loadReservations = useCallback(async () => {
    try {
      await fetchReservations();
    } catch {
      toast.error('Failed to load reservations');
    }
  }, [fetchReservations]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Filter handlers
  const handleFilterChange = async () => {
    const filters: IReservationFilters = {};

    if (statusFilter) filters.status = statusFilter as ReservationStatus;
    if (startDateFilter) filters.startDate = startDateFilter;
    if (endDateFilter) filters.endDate = endDateFilter;
    if (searchQuery) filters.customerName = searchQuery;

    try {
      await fetchReservations(filters);
    } catch {
      toast.error('Failed to apply filters');
    }
  };

  const handleClearFilters = async () => {
    setStatusFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
    await loadReservations();
  };

  const handleShowPending = async () => {
    try {
      await fetchPendingReservations();
      toast.success('Showing pending reservations');
    } catch {
      toast.error('Failed to load pending reservations');
    }
  };

  // Modal handlers
  const handleApproveClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowApprovalModal(true);
  };

  const handleDenyClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDenialModal(true);
  };

  const handleDetailsClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const handleApprovalSubmit = async (tableId?: number, adminNotes?: string) => {
    if (!selectedReservation || !user) return;

    try {
      await approveReservation(selectedReservation.id, {
        tableId,
        adminNotes,
        confirmedByUserId: user.id,
      });

      toast.success(`Reservation #${selectedReservation.id} approved successfully`);
      setShowApprovalModal(false);
      setSelectedReservation(null);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to approve reservation');
    }
  };

  const handleDenialSubmit = async (denialReason: string) => {
    if (!selectedReservation) return;

    try {
      await denyReservation(selectedReservation.id, {
        denialReason,
        deniedByUserId: user?.id,
      });

      toast.success(`Reservation #${selectedReservation.id} denied`);
      setShowDenialModal(false);
      setSelectedReservation(null);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to deny reservation');
    }
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedReservation(null);
  };

  const handleCloseDenialModal = () => {
    setShowDenialModal(false);
    setSelectedReservation(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
        <p className="text-gray-600 mt-2">View, approve, and manage customer reservations</p>
      </div>

      {/* Filters Component */}
      <ReservationFiltersComponent
        statusFilter={statusFilter}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onStartDateChange={setStartDateFilter}
        onEndDateChange={setEndDateFilter}
        onSearchChange={setSearchQuery}
        onApplyFilters={handleFilterChange}
        onClearFilters={handleClearFilters}
        onShowPending={handleShowPending}
        loading={loading}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Reservations Table Component */}
      {!loading && (
        <ReservationTable
          reservations={reservations}
          onViewDetails={handleDetailsClick}
          onApprove={handleApproveClick}
          onDeny={handleDenyClick}
        />
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedReservation && (
        <ReservationApprovalModal
          reservation={selectedReservation}
          onApprove={handleApprovalSubmit}
          onCancel={handleCloseApprovalModal}
          loading={loading}
        />
      )}

      {/* Denial Modal */}
      {showDenialModal && selectedReservation && (
        <ReservationDenialModal
          reservation={selectedReservation}
          onDeny={handleDenialSubmit}
          onCancel={handleCloseDenialModal}
          loading={loading}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default ReservationManagementPanel;
