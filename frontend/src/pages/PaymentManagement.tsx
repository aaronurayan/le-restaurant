import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { PaymentMethodSelector } from '../components/molecules/PaymentMethodSelector';
import { PaymentForm } from '../components/molecules/PaymentForm';
import { PaymentProcessing } from '../components/molecules/PaymentProcessing';
import { PaymentVerification } from '../components/molecules/PaymentVerification';
import { ReceiptGenerator } from '../components/molecules/ReceiptGenerator';
import { FinancialReconciliation } from '../components/organisms/FinancialReconciliation';
import PaymentManagementPanel from '../components/organisms/PaymentManagementPanel';
import { Button } from '../components/atoms/Button';
import { PaymentMethod, PaymentStatus } from '../types/payment';

type PaymentStep = 
  | 'method-selection'
  | 'payment-form'
  | 'processing'
  | 'verification'
  | 'receipt-generation'
  | 'management'
  | 'reconciliation';

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

const PaymentManagement: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('management');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [transactionId, setTransactionId] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING');
  const [amount, setAmount] = useState<number>(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123'
  });

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCurrentStep('payment-form');
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setAmount(45.99); // Mock amount
    setCurrentStep('processing');
  };

  const handleProcessingSuccess = (txId: string) => {
    setTransactionId(txId);
    setPaymentStatus('COMPLETED');
    setCurrentStep('verification');
  };

  const handleProcessingFailure = (error: string) => {
    console.error('Payment failed:', error);
    setPaymentStatus('FAILED');
    setCurrentStep('verification');
  };

  const handleVerificationComplete = () => {
    setCurrentStep('receipt-generation');
  };

  const handleReceiptComplete = () => {
    setCurrentStep('management');
  };

  const handleRetryPayment = () => {
    setCurrentStep('method-selection');
    setSelectedMethod(null);
    setPaymentData(null);
    setTransactionId('');
    setPaymentStatus('PENDING');
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
    // Implement support contact logic
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'method-selection':
        return (
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodSelect={handleMethodSelect}
            onProceed={() => setCurrentStep('payment-form')}
          />
        );

      case 'payment-form':
        return selectedMethod ? (
          <PaymentForm
            method={selectedMethod}
            amount={amount}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setCurrentStep('method-selection')}
          />
        ) : null;

      case 'processing':
        return selectedMethod ? (
          <PaymentProcessing
            method={selectedMethod}
            amount={amount}
            onSuccess={handleProcessingSuccess}
            onFailure={handleProcessingFailure}
            onCancel={() => setCurrentStep('method-selection')}
          />
        ) : null;

      case 'verification':
        return (
          <PaymentVerification
            transactionId={transactionId}
            method={selectedMethod!}
            amount={amount}
            status={paymentStatus}
            onRetry={handleRetryPayment}
            onContactSupport={handleContactSupport}
          />
        );

      case 'receipt-generation':
        return (
          <ReceiptGenerator
            transactionId={transactionId}
            method={selectedMethod!}
            amount={amount}
            fees={selectedMethod === 'CREDIT_CARD' ? 2.50 : 0}
            customerName={customerInfo.name}
            customerEmail={customerInfo.email}
            customerPhone={customerInfo.phone}
            orderId="ORD-123456"
            paymentDate={new Date().toISOString()}
            onDownload={() => console.log('Download receipt')}
            onEmail={() => console.log('Email receipt')}
            onSMS={() => console.log('SMS receipt')}
            onPrint={() => console.log('Print receipt')}
          />
        );

      case 'reconciliation':
        return <FinancialReconciliation />;

      case 'management':
      default:
        return (
          <PaymentManagementPanel
            isOpen={true}
            onClose={() => {}}
          />
        );
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'method-selection':
        return 'Payment Method Selection';
      case 'payment-form':
        return 'Payment Information';
      case 'processing':
        return 'Processing Payment';
      case 'verification':
        return 'Payment Verification';
      case 'receipt-generation':
        return 'Receipt Generation';
      case 'reconciliation':
        return 'Financial Reconciliation';
      case 'management':
      default:
        return 'Payment Management';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'method-selection':
      case 'payment-form':
      case 'processing':
      case 'verification':
      case 'receipt-generation':
        return CreditCard;
      case 'reconciliation':
        return BarChart3;
      case 'management':
      default:
        return DollarSign;
    }
  };

  const StepIcon = getStepIcon();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {currentStep !== 'management' && (
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('management')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{getStepTitle()}</h1>
                <p className="text-neutral-600">
                  {currentStep === 'management' 
                    ? 'Manage all payment transactions and settings'
                    : 'Complete your payment process'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            {[
              { id: 'management', label: 'Management', icon: DollarSign },
              { id: 'reconciliation', label: 'Reconciliation', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentStep(tab.id as PaymentStep)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentStep === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Indicator */}
        {['method-selection', 'payment-form', 'processing', 'verification', 'receipt-generation'].includes(currentStep) && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {[
                  { id: 'method-selection', label: 'Method', completed: currentStep !== 'method-selection' },
                  { id: 'payment-form', label: 'Details', completed: ['processing', 'verification', 'receipt-generation'].includes(currentStep) },
                  { id: 'processing', label: 'Processing', completed: ['verification', 'receipt-generation'].includes(currentStep) },
                  { id: 'verification', label: 'Verification', completed: currentStep === 'receipt-generation' },
                  { id: 'receipt-generation', label: 'Receipt', completed: false }
                ].map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.completed 
                        ? 'bg-green-500 text-white' 
                        : currentStep === step.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                      }
                    `}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 text-sm ${
                      currentStep === step.id ? 'text-primary-600 font-medium' : 'text-neutral-600'
                    }`}>
                      {step.label}
                    </span>
                    {index < 4 && (
                      <div className={`w-8 h-0.5 mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-neutral-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          {renderStep()}
        </div>

        {/* Quick Actions for Management */}
        {currentStep === 'management' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('method-selection')}
              className="flex items-center gap-2 p-4 h-auto"
            >
              <CreditCard className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">New Payment</div>
                <div className="text-sm text-neutral-500">Process a new payment</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setCurrentStep('reconciliation')}
              className="flex items-center gap-2 p-4 h-auto"
            >
              <BarChart3 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Financial Report</div>
                <div className="text-sm text-neutral-500">View reconciliation data</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 p-4 h-auto"
            >
              <Settings className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Settings</div>
                <div className="text-sm text-neutral-500">Configure payment options</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
