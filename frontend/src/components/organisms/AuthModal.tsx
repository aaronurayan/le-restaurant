import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Phone, Copy, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest, CreateUserRequest, UserRole } from '../../types/user';
import { PasswordStrengthMeter } from '../atoms/PasswordStrengthMeter';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:8080/api';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<LoginRequest & CreateUserRequest>({
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    role: UserRole.CUSTOMER
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [authError, setAuthError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetTokenDisplay, setResetTokenDisplay] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const { login, register, isLoading } = useAuth();

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!formData.firstName) {
        newErrors.firstName = 'Please enter your first name';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Please enter your last name';
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Please enter your phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
        onClose();
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          role: formData.role
        });
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
      const message = error instanceof Error ? error.message : undefined;
      setAuthError(message || (mode === 'login' ? 'Login failed. Please check your email and password.' : 'Registration failed. Please try again.'));
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResetTokenDisplay(data.resetToken || '');
      setSuccessMessage('Demo mode: copy the token below to reset your password.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      setAuthError(message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (newPassword.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!resetToken) {
      setAuthError('Please enter your reset token.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      setSuccessMessage(data.message || 'Password reset. You can now log in.');
      setMode('login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset failed';
      setAuthError(message);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(resetTokenDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', phoneNumber: '', firstName: '', lastName: '', role: UserRole.CUSTOMER });
    setErrors({});
    setAuthError('');
    setSuccessMessage('');
    setResetTokenDisplay('');
  };

  const switchMode = (next: AuthMode) => {
    resetForm();
    setMode(next);
  };

  const isLogin = mode === 'login';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="auth-modal">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">
            {mode === 'login' && 'Login'}
            {mode === 'register' && 'Sign Up'}
            {mode === 'forgot' && 'Forgot Password'}
            {mode === 'reset' && 'Reset Password'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* --- Login / Register Form --- */}
        {(mode === 'login' || mode === 'register') && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`form-input mt-1 ${errors.email ? 'form-input-error' : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`form-input pr-10 ${errors.password ? 'form-input-error' : ''}`}
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-neutral-100 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
              {mode === 'register' && <PasswordStrengthMeter password={formData.password} />}
            </div>

            {/* Remember me (login only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  Remember me for 30 days
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Auth Error */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`form-input mt-1 ${errors.firstName ? 'form-input-error' : ''}`}
                    placeholder="John"
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`form-input mt-1 ${errors.lastName ? 'form-input-error' : ''}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`form-input mt-1 ${errors.phoneNumber ? 'form-input-error' : ''}`}
                    placeholder="123-456-7890"
                  />
                  {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
                </div>
              </>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3">
              {isLoading ? <div className="spinner" /> : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
        )}

        {/* --- Forgot Password Form --- */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
            <p className="text-sm text-neutral-600">
              Enter your email address and we will send you a reset token.
            </p>
            <div className="form-group">
              <label htmlFor="forgotEmail" className="form-label flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="form-input mt-1"
                placeholder="your@email.com"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            {resetTokenDisplay && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <p className="text-xs text-amber-700 font-medium">Demo mode — copy this token to reset your password:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white border border-amber-200 rounded p-2 break-all">
                    {resetTokenDisplay}
                  </code>
                  <button type="button" onClick={copyToken} className="p-1.5 rounded hover:bg-amber-100 transition-colors">
                    {copied ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Proceed to reset password →
                </button>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3">
              {isLoading ? <div className="spinner" /> : 'Send Reset Token'}
            </button>
          </form>
        )}

        {/* --- Reset Password Form --- */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="p-6 space-y-4">
            <p className="text-sm text-neutral-600">
              Enter the reset token you received and choose a new password.
            </p>
            <div className="form-group">
              <label htmlFor="resetToken" className="form-label">Reset Token</label>
              <input
                type="text"
                id="resetToken"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="form-input mt-1 font-mono text-sm"
                placeholder="Paste your reset token here"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input mt-1"
                placeholder="••••••••"
              />
              <PasswordStrengthMeter password={newPassword} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input mt-1"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-3">
              {isLoading ? <div className="spinner" /> : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 text-center">
          {(mode === 'login' || mode === 'register') && (
            <p className="text-neutral-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => switchMode(isLogin ? 'register' : 'login')}
                className="ml-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button
              onClick={() => switchMode('login')}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              ← Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
