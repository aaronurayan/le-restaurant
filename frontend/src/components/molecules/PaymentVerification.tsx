import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Shield,
  CreditCard,
  RefreshCw,
  Download,
  Mail,
  MessageSquare,
  Smartphone,
  Building2,
  Wallet
} from 'lucide-react';
import { PaymentMethod, PaymentStatus } from '../../types/payment';
import { Button } from '../atoms/Button';

interface PaymentVerificationProps {
  transactionId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  onRetry?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

interface VerificationResult {
  isValid: boolean;
  errorCode?: string;
  errorMessage?: string;
  bankResponse?: string;
  processingTime?: number;
  fees?: number;
}

export const PaymentVerification: React.FC<PaymentVerificationProps> = ({
  transactionId,
  method,
  amount,
  status,
  onRetry,
  onContactSupport,
  className = ''
}) => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationTime, setVerificationTime] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      const startTime = Date.now();
      
      try {
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const endTime = Date.now();
        setVerificationTime(endTime - startTime);

        // Simulate verification result based on status
        const result: VerificationResult = {
          isValid: status === PaymentStatus.COMPLETED,
          errorCode: status === PaymentStatus.FAILED ? 'PAYMENT_DECLINED' : undefined,
          errorMessage: status === PaymentStatus.FAILED ? 'Your payment was declined by the bank' : undefined,
          bankResponse: status === PaymentStatus.COMPLETED ? 'APPROVED' : 'DECLINED',
          processingTime: endTime - startTime,
          fees: method === PaymentMethod.CREDIT_CARD ? 2.50 : method === PaymentMethod.DEBIT_CARD ? 1.00 : 0
        };

        setVerificationResult(result);
        setIsVerifying(false);
      } catch (error) {
        setVerificationResult({
          isValid: false,
          errorCode: 'VERIFICATION_FAILED',
          errorMessage: 'Unable to verify payment. Please contact support.',
          processingTime: Date.now() - startTime
        });
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [transactionId, status, method]);


  const getMethodIcon = () => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return CreditCard;
      case PaymentMethod.DIGITAL_WALLET:
        return Smartphone;
      case PaymentMethod.BANK_TRANSFER:
        return Building2;
      case PaymentMethod.CASH:
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const MethodIcon = getMethodIcon();

  if (isVerifying) {
    return (
      <div className={`text-center space-y-6 ${className}`}>
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Verifying Payment</h3>
          <p className="text-blue-600 mb-4">
            Please wait while we verify your payment with the bank...
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              This may take a few moments
            </span>
          </div>
        </div>

        <div className="w-full bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (verificationResult?.isValid) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Success Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Verified!</h3>
          <p className="text-green-600 mb-4">
            Your payment has been successfully verified and processed.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-4">Transaction Details</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Transaction ID:</span>
              <span className="font-mono text-green-800">{transactionId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-green-700">Payment Method:</span>
              <div className="flex items-center gap-2">
                <MethodIcon className="w-4 h-4" />
                <span className="text-green-800">{method.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-green-700">Amount:</span>
              <span className="font-semibold text-green-800">${amount.toFixed(2)}</span>
            </div>
            
            {verificationResult.fees && verificationResult.fees > 0 && (
              <div className="flex justify-between">
                <span className="text-green-700">Processing Fee:</span>
                <span className="text-green-800">${verificationResult.fees.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-green-700">Total:</span>
              <span className="font-semibold text-green-800">
                ${(amount + (verificationResult.fees || 0)).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-green-700">Verification Time:</span>
              <span className="text-green-800">{verificationTime}ms</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-green-700">Bank Response:</span>
              <span className="text-green-800 font-medium">{verificationResult.bankResponse}</span>
            </div>
          </div>
        </div>

        {/* Security Confirmation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              ✅ Payment verified and secured
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Receipt
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS Receipt
          </Button>
        </div>
      </div>
    );
  }

  // Verification Failed
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Verification Failed</h3>
        <p className="text-red-600 mb-4">
          {verificationResult?.errorMessage || 'Unable to verify your payment'}
        </p>
      </div>

      {/* Error Details */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="font-semibold text-red-800 mb-4">Error Details</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-red-700">Transaction ID:</span>
            <span className="font-mono text-red-800">{transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-red-700">Error Code:</span>
            <span className="text-red-800 font-medium">{verificationResult?.errorCode}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-red-700">Amount:</span>
            <span className="text-red-800">${amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-red-700">Verification Time:</span>
            <span className="text-red-800">{verificationTime}ms</span>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check your payment information</li>
              <li>• Ensure sufficient funds are available</li>
              <li>• Verify your billing address</li>
              <li>• Try a different payment method</li>
              <li>• Contact your bank if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="flex-1 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        
        {onContactSupport && (
          <Button variant="primary" onClick={onContactSupport} className="flex-1">
            Contact Support
          </Button>
        )}
      </div>
    </div>
  );
};
