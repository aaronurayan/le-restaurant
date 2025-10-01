import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { Button } from '../atoms/Button';

interface PaymentProcessingProps {
  method: PaymentMethod;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onFailure: (error: string) => void;
  onCancel: () => void;
  className?: string;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  duration: number; // in milliseconds
}

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  method,
  amount,
  onSuccess,
  onFailure,
  onCancel,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [transactionId, setTransactionId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const processingSteps: ProcessingStep[] = [
    {
      id: 'validation',
      title: 'Validating Payment',
      description: 'Checking payment information and security',
      status: 'pending',
      duration: 2000
    },
    {
      id: 'gateway',
      title: 'Processing Payment',
      description: 'Connecting to payment gateway',
      status: 'pending',
      duration: 3000
    },
    {
      id: 'verification',
      title: 'Verifying Transaction',
      description: 'Confirming payment with bank',
      status: 'pending',
      duration: 2500
    },
    {
      id: 'completion',
      title: 'Finalizing Payment',
      description: 'Completing transaction',
      status: 'pending',
      duration: 1500
    }
  ];

  const [steps, setSteps] = useState(processingSteps);

  useEffect(() => {
    if (!isProcessing) return;

    const processPayment = async () => {
      try {
        // Simulate payment processing
        for (let i = 0; i < steps.length; i++) {
          // Update current step to processing
          setSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index === i ? 'processing' : 
                   index < i ? 'completed' : 'pending'
          })));
          setCurrentStep(i);

          // Wait for step duration
          await new Promise(resolve => setTimeout(resolve, steps[i].duration));

          // Simulate random failure (5% chance)
          if (Math.random() < 0.05 && i < steps.length - 1) {
            throw new Error('Payment gateway timeout. Please try again.');
          }

          // Mark step as completed
          setSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index <= i ? 'completed' : 'pending'
          })));
        }

        // Generate transaction ID
        const txId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setTransactionId(txId);
        setIsProcessing(false);
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess(txId);
        }, 1000);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
        setError(errorMessage);
        setIsProcessing(false);
        
        // Update steps to show failure
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index < currentStep ? 'completed' : 
                 index === currentStep ? 'failed' : 'pending'
        })));
        
        setTimeout(() => {
          onFailure(errorMessage);
        }, 2000);
      }
    };

    processPayment();
  }, [isProcessing, steps, currentStep, onSuccess, onFailure]);

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStepColor = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'processing':
        return 'bg-primary-50 border-primary-200 text-primary-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-600';
    }
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

  if (error) {
    return (
      <div className={`text-center space-y-6 ${className}`}>
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Payment Failed</h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-left">
              <h4 className="font-semibold text-red-800 mb-1">What to do next:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Check your payment information</li>
                <li>• Ensure sufficient funds are available</li>
                <li>• Try a different payment method</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Try Again
          </Button>
          <Button variant="primary" onClick={onCancel} className="flex-1">
            Cancel Payment
          </Button>
        </div>
      </div>
    );
  }

  if (transactionId) {
    return (
      <div className={`text-center space-y-6 ${className}`}>
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
          <p className="text-green-600 mb-4">
            Your payment of <span className="font-semibold">${amount.toFixed(2)}</span> has been processed.
          </p>
          <p className="text-sm text-neutral-600">
            Transaction ID: <span className="font-mono font-medium">{transactionId}</span>
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Your payment is secure and encrypted
            </span>
          </div>
        </div>

        <Button variant="primary" onClick={() => onSuccess(transactionId)} className="w-full">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MethodIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Processing Payment</h3>
        <p className="text-neutral-600">
          Please wait while we process your payment of <span className="font-semibold text-primary-600">${amount.toFixed(2)}</span>
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            🔒 Your payment is being processed securely
          </span>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              p-4 rounded-lg border-2 transition-all duration-300
              ${getStepColor(step)}
            `}
          >
            <div className="flex items-center gap-3">
              {getStepIcon(step)}
              <div className="flex-1">
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm opacity-75">{step.description}</p>
              </div>
              {step.status === 'processing' && (
                <div className="text-xs text-primary-600 font-medium">
                  Processing...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${((currentStep + (steps[currentStep]?.status === 'processing' ? 0.5 : 1)) / steps.length) * 100}%` 
          }}
        />
      </div>

      {/* Cancel Button */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={!isProcessing}
          className="text-sm"
        >
          Cancel Payment
        </Button>
      </div>
    </div>
  );
};
