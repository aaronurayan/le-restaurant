import React, { useState, useId } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface LoginFormProps {
  onLogin?: (email: string) => void;
  onForgotPassword?: () => void;
  className?: string;
}

/**
 * LoginForm Molecule
 * 
 * Composite form component for user login.
 * Combines Input atoms and Button atom with error handling.
 * Follows design system and accessibility standards.
 */
export const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onForgotPassword,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email.trim()) {
        setError('Email is required');
        setIsLoading(false);
        return;
      }
      if (!password) {
        setError('Password is required');
        setIsLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      if (res.ok) {
        setSuccess('Login successful!');
        onLogin?.(email);
        setEmail('');
        setPassword('');
      } else if (res.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to server. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      id={formId}
      onSubmit={handleSubmit}
      className={`space-y-5 ${className}`}
      noValidate
    >
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-accent-red/10 border border-accent-red rounded-lg">
          <AlertCircle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent-red">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="flex items-start gap-3 p-3 bg-secondary-100 border border-secondary-600 rounded-lg">
          <CheckCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-700">{success}</p>
        </div>
      )}

      {/* Email Input */}
      <Input
        type="email"
        label="Email Address"
        placeholder="user@example.com"
        value={email}
        onChange={setEmail}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* Password Input */}
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={setPassword}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* Forgot Password Link */}
      {onForgotPassword && (
        <button
          type="button"
          onClick={onForgotPassword}
          disabled={isLoading}
          className="text-sm text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
        >
          Forgot password?
        </button>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={isLoading}
        disabled={isLoading || !email.trim() || !password}
        className="w-full"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
