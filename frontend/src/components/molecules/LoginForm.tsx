import React, { useState } from 'react';

interface LoginProps {
  onLogin?: (email: string) => void;
}

const LoginForm: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });
      if (res.ok) {
        setMessage('Login successful!');
        onLogin && onLogin(email);
      } else {
        setMessage('Login failed.');
      }
    } catch {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default LoginForm;
