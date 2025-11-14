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
import ReservationTable from '../organisms/ReservationTable';
import ReservationApprovalModal from '../molecules/ReservationApprovalModal';
import ReservationDenialModal from '../molecules/ReservationDenialModal';
import ReservationDetailsModal from '../molecules/ReservationDetailsModal';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

/**
 * ReservationManagementPanel - Organism Component
 * F109 - Reservation Management Feature
 * 
 * Admin panel for viewing, approving, and denying customer reservations.
 * Orchestrates atomic and molecular components following Atomic Design Pattern.
 * 
 * @author Le Restaurant Development Team
 */

interface ReservationManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationManagementPanel: React.FC<ReservationManagementPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    reservations,
    loading,
    error,
    fetchReservations,
    fetchPendingReservations,
    approveReservation,
    denyReservation,
    deleteReservation,
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

  // Error handling
  const { error: apiError, handleError, clearError } = useErrorHandler();

  // Load reservations on mount
  const loadReservations = useCallback(async () => {
    try {
      clearError();
      await fetchReservations();
    } catch (err) {
      handleError(err, 'Failed to load reservations');
    }
  }, [fetchReservations, clearError, handleError]);

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
      clearError();
      await fetchReservations(filters);
    } catch (err) {
      handleError(err, 'Failed to apply filters');
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
      clearError();
      await fetchPendingReservations();
      toast.success('Showing pending reservations');
    } catch (err) {
      handleError(err, 'Failed to load pending reservations');
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
      clearError();
      await approveReservation(selectedReservation.id, {
        tableId,
        adminNotes,
        confirmedByUserId: user.id,
      });

      toast.success(`Reservation #${selectedReservation.id} approved successfully`);
      setShowApprovalModal(false);
      setSelectedReservation(null);
    } catch (err) {
      handleError(err, 'Failed to approve reservation');
    }
  };

  const handleDenialSubmit = async (denialReason: string) => {
    if (!selectedReservation) return;

    try {
      clearError();
      await denyReservation(selectedReservation.id, {
        denialReason,
        deniedByUserId: user?.id,
      });

      toast.success(`Reservation #${selectedReservation.id} denied`);
      setShowDenialModal(false);
      setSelectedReservation(null);
    } catch (err) {
      handleError(err, 'Failed to deny reservation');
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

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [reservationToDelete, setReservationToDelete] = React.useState<Reservation | null>(null);

  const handleDeleteClick = (reservation: Reservation) => {
    setReservationToDelete(reservation);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservationToDelete) return;

    try {
      await deleteReservation(reservationToDelete.id);
      toast.success(`Reservation #${reservationToDelete.id} deleted successfully`);
      setShowDeleteConfirm(false);
      setReservationToDelete(null);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to delete reservation');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setReservationToDelete(null);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        {/* Modal Panel - Click inside won't close */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reservation Management</h1>
              <p className="text-gray-600 mt-1">View, approve, and manage customer reservations</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Area with Scroll */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
            {(error || apiError) && (
              <div className="mb-6">
                <ErrorMessage
                  message={apiError?.message || error || 'An error occurred'}
                  onRetry={apiError?.recoverable ? loadReservations : undefined}
                  size="md"
                />
                {apiError?.suggestions && apiError.suggestions.length > 0 && (
                  <div className="mt-2 text-sm text-neutral-600">
                    <p className="font-medium mb-1">Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {apiError.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" text="Loading reservations..." variant="primary" />
              </div>
            )}

            {/* Reservations Table Component */}
            {!loading && (
              <ReservationTable
                reservations={reservations}
                onViewDetails={handleDetailsClick}
                onApprove={handleApproveClick}
                onDeny={handleDenyClick}
                onDelete={handleDeleteClick}
              />
            )}
          </div>
        </div>
      </div>

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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Reservation"
        message={
          reservationToDelete
            ? `Are you sure you want to delete reservation #${reservationToDelete.id}? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="primary"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ReservationManagementPanel;
