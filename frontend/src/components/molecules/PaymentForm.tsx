import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Smartphone,
  Building2,
  Wallet
} from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

interface PaymentFormProps {
  method: PaymentMethod;
  amount: number;
  onSubmit: (paymentData: PaymentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  saveCard: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  method,
  amount,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    saveCard: false
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Add state to track delivery details
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (method === 'CREDIT_CARD' || method === 'DEBIT_CARD') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }

      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
    }

    if (!formData.billingAddress.street.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, street: 'Street address is required' };
    }

    if (!formData.billingAddress.city.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, city: 'City is required' };
    }

    if (!formData.billingAddress.zipCode.trim()) {
      newErrors.billingAddress = { ...newErrors.billingAddress, zipCode: 'ZIP code is required' };
    }

    if (method === 'DELIVERY') {
      if (!deliveryDetails.name.trim()) {
        newErrors.name = 'Customer name is required';
      }

      if (!deliveryDetails.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{3}[-]?\d{3}[-]?\d{4}$/.test(deliveryDetails.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (!deliveryDetails.address.trim()) {
        newErrors.address = 'Delivery address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (field: keyof PaymentFormData['billingAddress'], value: string) => {
    setFormData(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value }
    }));
    // Clear address error when user starts typing
    if (errors.billingAddress?.[field]) {
      setErrors(prev => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [field]: undefined }
      }));
    }
  };

  const handleDeliveryChange = (field: keyof typeof deliveryDetails, value: string) => {
    setDeliveryDetails((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return CreditCard;
      case 'DIGITAL_WALLET':
        return Smartphone;
      case 'BANK_TRANSFER':
        return Building2;
      case 'CASH':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const MethodIcon = getMethodIcon();

  if (method === 'CASH') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MethodIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Cash on Delivery</h3>
          <p className="text-neutral-600 mb-4">
            You will pay <span className="font-semibold text-primary-600">${amount.toFixed(2)}</span> when your order arrives.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Important Notes</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please have exact change ready</li>
                <li>• Payment is due upon delivery</li>
                <li>• We accept cash only for COD orders</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSubmit(formData)} loading={loading} className="flex-1">
            Confirm Cash Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Delivery Option */}
      <div className="space-y-4">
        <h4 className="font-semibold text-neutral-900">Order Type</h4>
        <div className="flex items-center gap-4">
          <label>
            <input
              type="radio"
              name="orderType"
              value="DINE_IN"
              checked={method === 'DINE_IN'}
              onChange={() => handleInputChange('method', 'DINE_IN')}
            />
            Dine-in
          </label>
          <label>
            <input
              type="radio"
              name="orderType"
              value="DELIVERY"
              checked={method === 'DELIVERY'}
              onChange={() => handleInputChange('method', 'DELIVERY')}
            />
            Delivery
          </label>
        </div>
      </div>

      {/* Delivery Details */}
      {method === 'DELIVERY' && (
        <div className="space-y-4">
          <Input
            type="text"
            label="Customer Name"
            placeholder="John Doe"
            value={deliveryDetails.name}
            onChange={(value) => handleDeliveryChange('name', value)}
            required
          />
          <Input
            type="text"
            label="Phone Number"
            placeholder="123-456-7890"
            value={deliveryDetails.phone}
            onChange={(value) => handleDeliveryChange('phone', value)}
            required
          />
          <Input
            type="text"
            label="Delivery Address"
            placeholder="123 Main Street, City, State, ZIP"
            value={deliveryDetails.address}
            onChange={(value) => handleDeliveryChange('address', value)}
            required
          />
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MethodIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {method === 'CREDIT_CARD' ? 'Credit Card' :
            method === 'DEBIT_CARD' ? 'Debit Card' :
              method === 'DIGITAL_WALLET' ? 'Digital Wallet' :
                method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Payment'}
        </h3>
        <p className="text-neutral-600">
          Amount: <span className="font-semibold text-primary-600">${amount.toFixed(2)}</span>
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            🔒 Your payment information is encrypted and secure
          </span>
        </div>
      </div>

      {/* Card Details */}
      {(method === 'CREDIT_CARD' || method === 'DEBIT_CARD') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-neutral-900">Card Information</h4>
            <button
              type="button"
              onClick={() => setShowCardDetails(!showCardDetails)}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
            >
              {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showCardDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>

          <Input
            type="text"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(value) => handleInputChange('cardNumber', formatCardNumber(value))}
            error={errors.cardNumber}
            required
            icon={CreditCard}
            maxLength={19}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Expiry Date"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={(value) => handleInputChange('expiryDate', value)}
              error={errors.expiryDate}
              required
              icon={Calendar}
              maxLength={5}
            />

            <Input
              type={showCardDetails ? 'text' : 'password'}
              label="CVV"
              placeholder="123"
              value={formData.cvv}
              onChange={(value) => handleInputChange('cvv', value)}
              error={errors.cvv}
              required
              maxLength={4}
            />
          </div>

          <Input
            type="text"
            label="Cardholder Name"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={(value) => handleInputChange('cardholderName', value)}
            error={errors.cardholderName}
            required
            icon={User}
          />
        </div>
      )}

      {/* Billing Address */}
      <div className="space-y-4">
        <h4 className="font-semibold text-neutral-900">Billing Address</h4>

        <Input
          type="text"
          label="Street Address"
          placeholder="123 Main Street"
          value={formData.billingAddress.street}
          onChange={(value) => handleAddressChange('street', value)}
          error={errors.billingAddress?.street}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="City"
            placeholder="New York"
            value={formData.billingAddress.city}
            onChange={(value) => handleAddressChange('city', value)}
            error={errors.billingAddress?.city}
            required
          />

          <Input
            type="text"
            label="ZIP Code"
            placeholder="10001"
            value={formData.billingAddress.zipCode}
            onChange={(value) => handleAddressChange('zipCode', value)}
            error={errors.billingAddress?.zipCode}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            label="State"
            placeholder="NY"
            value={formData.billingAddress.state}
            onChange={(value) => handleAddressChange('state', value)}
          />

          <Input
            type="text"
            label="Country"
            value={formData.billingAddress.country}
            onChange={(value) => handleAddressChange('country', value)}
            disabled
          />
        </div>
      </div>

      {/* Save Card Option */}
      {(method === 'CREDIT_CARD' || method === 'DEBIT_CARD') && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="save-card"
            checked={formData.saveCard}
            onChange={(e) => handleInputChange('saveCard', e.target.checked)}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="save-card" className="text-sm text-neutral-700">
            Save this card for future purchases (encrypted and secure)
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};
