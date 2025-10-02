import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Reservation } from './Reservation';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('Reservation component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders form fields correctly', () => {
    render(<Reservation cartItemCount={2} />);
    
    expect(screen.getByText(/Reserve a Table/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of persons/i)).toBeInTheDocument();
  });

  test('shows error when booking in the past', async () => {
    render(<Reservation />);

    const dateInput = screen.getByLabelText(/Date/i);
    const timeSelect = screen.getByLabelText(/Time/i);
    const submitButton = screen.getByRole('button', { name: /Reserve/i });

    fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toHaveTextContent('You cannot book a table in the past.');
  });

  test('shows error when time is out of range', async () => {
    render(<Reservation />);

    const dateInput = screen.getByLabelText(/Date/i);
    const timeSelect = screen.getByLabelText(/Time/i);
    const submitButton = screen.getByRole('button', { name: /Reserve/i });

    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: tomorrowStr } });
    fireEvent.change(timeSelect, { target: { value: '23:00' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Please choose a time between 12:00 and 22:00.');
  });

  test('shows error when number of people is invalid', async () => {
    render(<Reservation />);

    const dateInput = screen.getByLabelText(/Date/i);
    const timeSelect = screen.getByLabelText(/Time/i);
    const peopleInput = screen.getByLabelText(/Number of persons/i);
    const submitButton = screen.getByRole('button', { name: /Reserve/i });

    // Tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: tomorrowStr } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });
    fireEvent.change(peopleInput, { target: { value: '20' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await screen.findByTestId('error-message');
    expect(errorMessage).toHaveTextContent('You can book between 1 and 12 people only.');
  });

  test('accepts valid reservation', async () => {
    render(<Reservation />);

    const dateInput = screen.getByLabelText(/Date/i);
    const timeSelect = screen.getByLabelText(/Time/i);
    const peopleInput = screen.getByLabelText(/Number of persons/i);
    const submitButton = screen.getByRole('button', { name: /Reserve/i });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: tomorrowStr } });
    fireEvent.change(timeSelect, { target: { value: '12:00' } });
    fireEvent.change(peopleInput, { target: { value: '4' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    const successMessage = await screen.findByTestId('success-message');
    expect(successMessage).toHaveTextContent('Reservation successful!');

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/reservations',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"people":4'),
      })
    );
  });
});
