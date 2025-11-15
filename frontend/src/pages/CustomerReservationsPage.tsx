/**
 * CustomerReservationsPage (F108)
 * Page for customers to view and manage their reservations
 * 
 * @module F108-CustomerReservation
 * @follows Atomic Design Pattern - Page level
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CustomerReservationList } from '../components/organisms/CustomerReservationList';
import ReservationModal from '../components/organisms/ReservationModal';
import { useAuth } from '../contexts/AuthContext';

/**
 * CustomerReservationsPage Component
 * Full page view for customer reservation management
 */
export const CustomerReservationsPage: React.FC = () => {
    const { user } = useAuth();
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Get customer ID from authenticated user
    const customerId = user?.id ? user.id.toString() : '';

    const handleNewReservation = () => {
        setShowReservationModal(true);
    };

    const handleModalClose = () => {
        setShowReservationModal(false);
        // Force refresh of customer reservations by changing the key
        setRefreshKey(prev => prev + 1);
    };

    if (!customerId) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Authentication Required</h2>
                    <p className="text-neutral-600">Please log in to view your reservations.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link 
                        to="/customer/dashboard" 
                        className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>
                <CustomerReservationList
                    key={refreshKey}
                    customerId={customerId}
                    onNewReservation={handleNewReservation}
                />
            </div>

            {/* New Reservation Modal */}
            {showReservationModal && (
                <ReservationModal
                    isOpen={showReservationModal}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default CustomerReservationsPage;
