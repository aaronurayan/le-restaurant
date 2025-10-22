import React, { useState } from 'react';

interface RegisterProps {
  onRegister?: (email: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });
      if (res.ok) {
        setMessage('Registration successful!');
        onRegister && onRegister(email, password);
      } else {
        setMessage('Registration failed.');
      }
    } catch {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Register</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default RegisterForm;
