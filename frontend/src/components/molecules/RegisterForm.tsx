import React, { useState, useId } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface RegisterFormProps {
  onRegister?: (email: string, password: string) => void;
  onLoginClick?: () => void;
  className?: string;
}

/**
 * RegisterForm Molecule
 * 
 * Composite form component for user registration.
 * Combines Input atoms and Button atom with error handling and validation.
 * Follows design system and accessibility standards.
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister,
  onLoginClick,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formId = useId();

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use unified API client
      const { apiClient } = await import('../../services/apiClient.unified');
      const { API_ENDPOINTS } = await import('../../config/api.config');
      
      const res = await fetch(`${apiClient.getBaseUrl()}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onRegister?.(email, password);
      } else if (res.status === 409) {
        setError('This email is already registered. Please login or use a different email.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to server. Please check your connection.');
      console.error('Registration error:', err);
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
        placeholder="At least 8 characters"
        value={password}
        onChange={setPassword}
        required
        disabled={isLoading}
        helperText="Must be at least 8 characters long"
        className="w-full"
      />

      {/* Confirm Password Input */}
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        required
        disabled={isLoading}
        className="w-full"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={isLoading}
        disabled={isLoading || !email.trim() || !password || !confirmPassword}
        className="w-full"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      {/* Login Link */}
      {onLoginClick && (
        <p className="text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            disabled={isLoading}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors disabled:opacity-50"
          >
            Login here
          </button>
        </p>
      )}
    </form>
  );
};
