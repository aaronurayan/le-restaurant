import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest, CreateUserRequest, UserRole } from '../../types/user';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
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

    if (!isLogin) {
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

    if (!validateForm()) return;

    try {
      if (isLogin) {
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
      // TODO: 에러 메시지 표시
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      role: UserRole.CUSTOMER
    });
    setErrors({});
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
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
          </div>

          {/* Registration Fields */}
          {!isLogin && (
            <>
              {/* First Name */}
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

              {/* Last Name */}
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

              {/* Phone Number */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3"
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 text-center">
          <p className="text-neutral-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              className="ml-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
