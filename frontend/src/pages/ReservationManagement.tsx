import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useReservationManagementApi } from '../hooks/useReservationManagementApi';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import type { Reservation } from '../hooks/useReservationManagementApi';

const ReservationManagement: React.FC = () => {
    const { user } = useAuth();
    const { 
        reservations, 
        loading, 
        error, 
        fetchReservations, 
        approveReservation, 
        denyReservation, 
        deleteReservation 
    } = useReservationManagementApi();
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);
    const [activeOccasion, setActiveOccasion] = useState<string>('all');
    const occasionFilters = ['all', 'anniversary', 'birthday', 'business', 'allergy'];

    useEffect(() => {
        // Fetch reservations when the component mounts
        fetchReservations();
    }, [fetchReservations]);

    const handleApprove = async (id: number) => {
        if (!user?.id) {
            console.error('User not authenticated');
            return;
        }
        
        try {
            await approveReservation(id, {
                confirmedByUserId: user.id,
                tableId: undefined,
                adminNotes: undefined,
            });
            fetchReservations();
        } catch (err) {
            console.error('Failed to approve reservation:', err);
            // Error is handled by useReservationManagementApi hook
        }
    };

    const handleReject = async (id: number) => {
        if (!user?.id) {
            console.error('User not authenticated');
            return;
        }
        
        try {
            await denyReservation(id, {
                denialReason: 'Reservation rejected by administrator',
                deniedByUserId: user.id,
            });
            fetchReservations();
        } catch (err) {
            console.error('Failed to reject reservation:', err);
            // Error is handled by useReservationManagementApi hook
        }
    };

    const handleCancel = async (id: number) => {
        setReservationToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!reservationToDelete) return;
        
        try {
            await deleteReservation(reservationToDelete);
            fetchReservations();
            setShowDeleteConfirm(false);
            setReservationToDelete(null);
        } catch (err) {
            console.error('Failed to delete reservation:', err);
            // Error is handled by useReservationManagementApi hook
            // Keep dialog open so user can retry
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setReservationToDelete(null);
    };

    const filteredReservations = useMemo(() => {
        if (activeOccasion === 'all') return reservations;
        return reservations.filter((reservation) => {
            const note = reservation.specialRequests?.toLowerCase() || '';
            return note.includes(activeOccasion);
        });
    }, [reservations, activeOccasion]);

    if (loading) {
        return (
            <div className="p-4">
                <p>Loading reservations...</p>
            </div>
        );
    }

    // Don't show error if it's a network error (backend not available)
    const isNetworkError = error?.includes('Network Error') || 
                          error?.includes('ERR_CONNECTION_REFUSED') ||
                          error?.includes('fetch') ||
                          error?.includes('Failed to fetch');
    
    if (error && !isNetworkError) {
        return (
            <div className="p-4">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link 
                    to="/admin/dashboard" 
                    className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span>Back to Dashboard</span>
                </Link>
                <h1 className="text-3xl font-serif font-bold text-neutral-gray-900">Reservation Management</h1>
                <p className="text-neutral-gray-600 mt-1">
                    Anticipate needs by filtering structured requests. Approve celebrations with a single tap.
                </p>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Structured Request Filters</h2>
                <div className="flex flex-wrap gap-3">
                    {occasionFilters.map((filter) => {
                        const isActive = activeOccasion === filter;
                        const label = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveOccasion(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    isActive ? 'bg-primary-600 text-white shadow-lg' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">All Reservations</h2>
                {filteredReservations.length === 0 ? (
                    <p className="text-neutral-500">No reservations found.</p>
                ) : (
                    <div className="space-y-4">
                        {filteredReservations.map((reservation) => {
                            const reservationDate = reservation.reservationDate || (reservation as any).dateTime;
                            const reservationTime = reservation.reservationTime || '';
                            const specialRequests = reservation.specialRequests?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
                            return (
                            <div key={reservation.id} className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-lg">
                                            {reservation.customerName || 'Guest'}
                                        </div>
                                        <div className="text-sm text-neutral-600 mt-1">
                                            <strong>Guests:</strong> {reservation.partySize || reservation.guestCount || 'N/A'}
                                        </div>
                                        <div className="text-sm text-neutral-600">
                                            <strong>Date & Time:</strong>{' '}
                                            {reservationDate
                                                ? `${reservationDate} ${reservationTime}`
                                                : 'TBD'}
                                        </div>
                                        <div className="text-sm text-neutral-600">
                                            <strong>Status:</strong> {reservation.status}
                                        </div>
                                        {specialRequests.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {specialRequests.map((request, idx) => (
                                                    <span
                                                        key={`${reservation.id}-tag-${idx}`}
                                                        className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold"
                                                    >
                                                        {request}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {reservation.status === 'PENDING' && (
                                            <>
                                                <button 
                                                    onClick={() => handleApprove(reservation.id)} 
                                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(reservation.id)} 
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            onClick={() => handleCancel(reservation.id)} 
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                )}
            </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
            isOpen={showDeleteConfirm}
            title="Delete Reservation"
            message={
                reservationToDelete
                    ? `Are you sure you want to delete reservation #${reservationToDelete}? This action cannot be undone.`
                    : ''
            }
            confirmText="Delete"
            cancelText="Cancel"
            confirmVariant="primary"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
        />
    </div>
    );
};

export default ReservationManagement;