import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';

describe('ReservationForm', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
        render(
            <ReservationForm
                onSubmit={mockOnSubmit}
                onCancel={mockOnCancel}
                loading={false}
                className=""
            />
        );
    });

    test('renders the form fields', () => {
        expect(screen.getByLabelText(/Reservation Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Party Size/i)).toBeInTheDocument();
    });

    test('validates and submits the form', () => {
        fireEvent.change(screen.getByLabelText(/Reservation Date/i), {
            target: { value: '2025-10-02' },
        });
        fireEvent.change(screen.getByLabelText(/Time/i), {
            target: { value: '18:00' },
        });
        fireEvent.change(screen.getByLabelText(/Party Size/i), {
            target: { value: '4' },
        });

        fireEvent.click(screen.getByText(/Make Reservation/i));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            date: '2025-10-02',
            time: '18:00',
            partySize: '4',
            specialRequests: '',
            customerName: '',
            customerEmail: '',
            customerPhone: '',
        });
    });

    test('calls onCancel when cancel button is clicked', () => {
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});