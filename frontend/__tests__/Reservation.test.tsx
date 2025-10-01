import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Reservation } from '../src/pages/Reservation';

describe('Reservation Form', () => {
  it('blocks past dates', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const timeSelect = screen.getByLabelText(/Time:/i);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    fireEvent.change(dateInput, { target: { value: yesterday.toISOString().split('T')[0] } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText(/cannot book a table in the past/i)).toBeInTheDocument();
  });

  it('accepts valid input', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const timeSelect = screen.getByLabelText(/Time:/i);
    const peopleInput = screen.getByLabelText(/Number of persons:/i);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });
    fireEvent.change(peopleInput, { target: { value: '4' } });

    fireEvent.click(screen.getByRole('button', { name: /reserve/i }));

    expect(screen.queryByText(/cannot/i)).not.toBeInTheDocument();
  });
});
