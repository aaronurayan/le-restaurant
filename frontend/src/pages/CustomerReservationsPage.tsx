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

const OCCASION_TAGS = [
    { label: 'General Dining', note: 'General dining — table near the garden if available.' },
    { label: 'Anniversary', note: 'Anniversary celebration — prepare champagne toast and floral centerpiece.' },
    { label: 'Birthday', note: 'Birthday celebration — kindly prepare personalized dessert inscription.' },
    { label: 'Business Meeting', note: 'Business meeting — quiet corner table with subtle lighting.' },
];

/**
 * CustomerReservationsPage Component
 * Full page view for customer reservation management
 */
export const CustomerReservationsPage: React.FC = () => {
    const { user } = useAuth();
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const defaultOccasion = OCCASION_TAGS[0];
    const [selectedOccasion, setSelectedOccasion] = useState<string>(defaultOccasion.label);
    const [structuredRequest, setStructuredRequest] = useState<string>(defaultOccasion.note);

    // Get customer ID from authenticated user
    const customerId = user?.id ? user.id.toString() : '';

    const handleOccasionSelect = (occasion: string) => {
        setSelectedOccasion(occasion);
        const note = OCCASION_TAGS.find(tag => tag.label === occasion)?.note ?? '';
        setStructuredRequest(note);
    };

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
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 mb-8">
                    <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-2">Structured Request</p>
                    <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-3">
                        Tell us what you’re celebrating
                    </h1>
                    <p className="text-neutral-600 mb-4">
                        Select an occasion so our hospitality team can prepare the right touches before you arrive.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {OCCASION_TAGS.map(({ label }) => {
                            const isActive = selectedOccasion === label;
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => handleOccasionSelect(label)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-lg'
                                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    {selectedOccasion === 'Anniversary' && (
                        <div className="mt-6 bg-primary-50 border border-primary-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-primary-700">Champagne Toast?</p>
                                <p className="text-sm text-primary-800">We can prepare chilled glasses and roses on arrival.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleOccasionSelect('Anniversary');
                                    setShowReservationModal(true);
                                }}
                                className="inline-flex items-center justify-center rounded-full bg-primary-600 text-white px-5 py-2 text-sm font-semibold hover:bg-primary-700 transition-colors"
                            >
                                Add to Reservation
                            </button>
                        </div>
                    )}
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
                    initialSpecialRequest={structuredRequest || undefined}
                />
            )}
        </div>
    );
};

export default CustomerReservationsPage;
