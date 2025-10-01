import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Phone, Shield, UserCheck, Users } from 'lucide-react';
import { User as UserType, UserRole, UserStatus, CreateUserRequest, UpdateUserRequest } from '../../types/user';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  user?: UserType | null;
  mode: 'create' | 'edit';
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  mode
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE
  });
  const [errors, setErrors] = useState<Partial<CreateUserRequest>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        email: user.email,
        password: '', // Don't pre-fill password
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      });
    } else {
      setFormData({
        email: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserRequest> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = mode === 'create' 
        ? formData as CreateUserRequest
        : { ...formData, password: undefined } as UpdateUserRequest;
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield className="w-4 h-4 text-red-500" />;
      case UserRole.MANAGER:
        return <UserCheck className="w-4 h-4 text-blue-500" />;
      case UserRole.CUSTOMER:
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
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
          {/* First Name */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              <User className="w-4 h-4" />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
              placeholder="Enter first name"
            />
            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              <User className="w-4 h-4" />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
              placeholder="Enter last name"
            />
            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password (only for create mode) */}
          {mode === 'create' && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
          )}

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`form-input ${errors.phoneNumber ? 'form-input-error' : ''}`}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && <span className="form-error">{errors.phoneNumber}</span>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              <Shield className="w-4 h-4" />
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="form-input"
            >
              <option value={UserRole.CUSTOMER}>
                <Users className="w-4 h-4" /> Customer
              </option>
              <option value={UserRole.MANAGER}>
                <UserCheck className="w-4 h-4" /> Manager
              </option>
              <option value={UserRole.ADMIN}>
                <Shield className="w-4 h-4" /> Admin
              </option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
              className="form-input"
            >
              <option value={UserStatus.ACTIVE}>Active</option>
              <option value={UserStatus.INACTIVE}>Inactive</option>
              <option value={UserStatus.SUSPENDED}>Suspended</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3"
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              mode === 'create' ? 'Create User' : 'Update User'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
