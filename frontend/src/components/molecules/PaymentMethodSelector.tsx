import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { Button } from '../atoms/Button';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodSelect: (method: PaymentMethod) => void;
  onProceed: () => void;
  className?: string;
}

const paymentMethods = [
  {
    id: 'CREDIT_CARD' as PaymentMethod,
    name: 'Credit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    security: 'High',
    processingTime: 'Instant',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    selectedColor: 'bg-blue-100 border-blue-400 text-blue-800'
  },
  {
    id: 'DEBIT_CARD' as PaymentMethod,
    name: 'Debit Card',
    icon: CreditCard,
    description: 'Direct bank account deduction',
    security: 'High',
    processingTime: 'Instant',
    color: 'bg-green-50 border-green-200 text-green-700',
    selectedColor: 'bg-green-100 border-green-400 text-green-800'
  },
  {
    id: 'DIGITAL_WALLET' as PaymentMethod,
    name: 'Digital Wallet',
    icon: Smartphone,
    description: 'Apple Pay, Google Pay, Samsung Pay',
    security: 'Very High',
    processingTime: 'Instant',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    selectedColor: 'bg-purple-100 border-purple-400 text-purple-800'
  },
  {
    id: 'BANK_TRANSFER' as PaymentMethod,
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct bank transfer',
    security: 'Very High',
    processingTime: '1-3 business days',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    selectedColor: 'bg-orange-100 border-orange-400 text-orange-800'
  },
  {
    id: 'CASH' as PaymentMethod,
    name: 'Cash on Delivery',
    icon: Wallet,
    description: 'Pay when your order arrives',
    security: 'Medium',
    processingTime: 'On delivery',
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    selectedColor: 'bg-gray-100 border-gray-400 text-gray-800'
  }
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  onProceed,
  className = ''
}) => {
  const [securityAccepted, setSecurityAccepted] = useState(false);

  const handleMethodSelect = (method: PaymentMethod) => {
    onMethodSelect(method);
    setSecurityAccepted(false); // Reset security acceptance when method changes
  };

  const canProceed = selectedMethod && securityAccepted;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Choose Payment Method</h3>
        <p className="text-neutral-600">
          Select your preferred payment method. All transactions are secure and encrypted.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800 mb-1">Secure Payment Processing</h4>
            <p className="text-sm text-green-700">
              Your payment information is encrypted and processed securely. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200 text-left
                hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500
                ${isSelected 
                  ? method.selectedColor + ' shadow-md' 
                  : method.color + ' hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{method.name}</h4>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <p className="text-sm opacity-75 mb-2">{method.description}</p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="w-3 h-3" />
                      <span>Security: {method.security}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>Processing: {method.processingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Security Acceptance */}
      {selectedMethod && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="security-acceptance"
              checked={securityAccepted}
              onChange={(e) => setSecurityAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="security-acceptance" className="text-sm text-neutral-700">
              I understand that my payment information will be processed securely and I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={!canProceed}
          className="px-8 py-3"
        >
          {selectedMethod ? `Continue with ${paymentMethods.find(m => m.id === selectedMethod)?.name}` : 'Select Payment Method'}
        </Button>
      </div>
    </div>
  );
};
