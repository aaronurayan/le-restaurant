import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';  // Add this import
import { Reservation } from '../pages/Reservation';

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

  it('shows error for time before 12:00', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const timeSelect = screen.getByLabelText(/Time:/i);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeSelect, { target: { value: '11:00' } });

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText(/choose a time between 12:00 and 22:00/i)).toBeInTheDocument();
  });

  it('shows error for too many people', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const timeSelect = screen.getByLabelText(/Time:/i);
    const peopleInput = screen.getByLabelText(/Number of persons:/i);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });
    fireEvent.change(peopleInput, { target: { value: '20' } });

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText(/between 1 and 12 people only/i)).toBeInTheDocument();
  });

  it('shows error for too few people', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const timeSelect = screen.getByLabelText(/Time:/i);
    const peopleInput = screen.getByLabelText(/Number of persons:/i);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });
    fireEvent.change(peopleInput, { target: { value: '0' } });

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText(/between 1 and 12 people only/i)).toBeInTheDocument();
  });

  it('disables past dates in date input', () => {
    render(<Reservation />);
    const dateInput = screen.getByLabelText(/Date:/i);
    const minDate = new Date().toISOString().split('T')[0];
    expect(dateInput).toHaveAttribute('min', minDate);
  });
});