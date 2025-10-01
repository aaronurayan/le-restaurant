import React, { useState } from 'react';


interface ReservationProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

// Test
interface ReservationForm {
  date: string;
  time: string;
  people: number;
}

export const Reservation: React.FC<ReservationProps> = ({ cartItemCount }) => {
  const [form, setForm] = useState<ReservationForm>({
    date: '',
    time: '',
    people: 1,
  });

  const [error, setError] = useState<string | null>(null);

  // Generate time options every 30 minutes from 12:00 to 22:00
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 12; hour <= 21; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    options.push('22:00'); // last slot
    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'people' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(`${form.date}T${form.time}`);
    const hour = selectedDate.getHours();

    if (selectedDate < today) {
      setError('You cannot book a table in the past.');
      return;
    }

    if (hour < 12 || hour >= 22) {
      setError('Please choose a time between 12:00 and 22:00.');
      return;
    }

    if (form.people < 1 || form.people > 12) {
      setError('You can book between 1 and 12 people only.');
      return;
    }

    setError(null);
    console.log('Reservation submitted:', form);
    alert(`Reservation for ${form.people} people on ${form.date} at ${form.time} submitted!`);
    // TODO: send to backend
  };

  const timeOptions = generateTimeOptions();

  return (
    <section className="py-16 bg-gray-50 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Reserve a Table</h1>
      {cartItemCount !== undefined && (
        <p className="text-center text-sm text-gray-500 mb-4">
          Cart items: {cartItemCount}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span>Date:</span>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
            min={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label className="flex flex-col">
          <span>Time:</span>
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
          >
            <option value="" disabled>Select a time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span>Number of persons:</span>
          <input
            type="number"
            name="people"
            min={1}
            max={12}
            value={form.people}
            onChange={handleChange}
            className="border p-2 w-full mt-1"
          />
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition"
        >
          Reserve
        </button>
      </form>
    </section>
  );
};
