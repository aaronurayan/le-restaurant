import React, { useState, useEffect } from 'react';
import { useReservationApi, Reservation } from '../hooks/useReservationApi';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';

const ReservationManagement: React.FC = () => {
    const { fetchReservations, createReservation, updateReservation, deleteReservation } = useReservationApi();
    const [reservations, setReservations] = useState<Reservation[]>([]); // Manage reservations locally
    const [form, setForm] = useState<{ id: number | null; guestCount: number; dateTime: string }>({
        id: null,
        guestCount: 0,
        dateTime: '',
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

    useEffect(() => {
        // Fetch reservations when the component mounts
        const loadReservations = async () => {
            const data = await fetchReservations();
            setReservations(data);
        };
        loadReservations();
    }, [fetchReservations]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'guestCount' ? parseInt(value, 10) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.id) {
            await updateReservation(form.id, { guestCount: form.guestCount, dateTime: form.dateTime });
        } else {
            await createReservation({ guestCount: form.guestCount, dateTime: form.dateTime });
        }
        const data = await fetchReservations(); // Refresh reservations after submit
        setReservations(data);
        setForm({ id: null, guestCount: 0, dateTime: '' });
    };

    const handleEdit = (reservation: Reservation) => {
        setForm({ id: reservation.id, guestCount: reservation.guestCount, dateTime: reservation.dateTime });
    };

    const handleDelete = (id: number) => {
        setReservationToDelete(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!reservationToDelete) return;
        
        await deleteReservation(reservationToDelete);
        const data = await fetchReservations(); // Refresh reservations after delete
        setReservations(data);
        setShowDeleteConfirm(false);
        setReservationToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setReservationToDelete(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reservation Management</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label>Number of Guests:</label>
                    <input
                        type="number"
                        name="guestCount"
                        value={form.guestCount}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label>Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="dateTime"
                        value={form.dateTime}
                        onChange={handleInputChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    {form.id ? 'Update Reservation' : 'Create Reservation'}
                </button>
            </form>
            <h2 className="text-xl font-bold mb-2">Upcoming Reservations</h2>
            <ul>
                {reservations.map((reservation) => (
                    <li key={reservation.id} className="border p-2 mb-2">
                        <div>
                            <strong>Guests:</strong> {reservation.guestCount}
                        </div>
                        <div>
                            <strong>Date & Time:</strong> {new Date(reservation.dateTime).toLocaleString()}
                        </div>
                        <button onClick={() => handleEdit(reservation)} className="bg-yellow-500 text-white px-2 py-1 mr-2">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(reservation.id)} className="bg-red-500 text-white px-2 py-1">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

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