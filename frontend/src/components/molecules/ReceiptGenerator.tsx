import React, { useState } from 'react';
import { 
  Download, 
  Mail, 
  MessageSquare, 
  Printer, 
  Share2,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import { Button } from '../atoms/Button';

interface ReceiptGeneratorProps {
  transactionId: string;
  method: PaymentMethod;
  amount: number;
  fees?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
  paymentDate: string;
  onDownload?: () => void;
  onEmail?: () => void;
  onSMS?: () => void;
  onPrint?: () => void;
  className?: string;
}

interface ReceiptData {
  id: string;
  transactionId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  fees: number;
  total: number;
  method: PaymentMethod;
  paymentDate: string;
  status: 'completed' | 'pending' | 'failed';
  restaurantInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({
  transactionId,
  method,
  amount,
  fees = 0,
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  paymentDate,
  onDownload,
  onEmail,
  onSMS,
  onPrint,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<ReceiptData | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms' | 'download'>('email');

  const restaurantInfo = {
    name: 'Le Restaurant',
    address: '123 Gourmet Street, Food City, FC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@lerestaurant.com',
    website: 'www.lerestaurant.com'
  };

  const sampleItems = [
    { name: 'Margherita Pizza', quantity: 1, price: 18.99, total: 18.99 },
    { name: 'Caesar Salad', quantity: 1, price: 12.50, total: 12.50 },
    { name: 'Tiramisu', quantity: 1, price: 8.99, total: 8.99 }
  ];

  const generateReceipt = () => {
    setIsGenerating(true);
    
    // Simulate receipt generation
    setTimeout(() => {
      const receipt: ReceiptData = {
        id: `RCP-${Date.now()}`,
        transactionId,
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        amount,
        fees,
        total: amount + fees,
        method,
        paymentDate,
        status: 'completed',
        restaurantInfo,
        items: sampleItems
      };
      
      setGeneratedReceipt(receipt);
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (generatedReceipt) {
      // Generate PDF content (simplified)
      const receiptContent = generateReceiptContent(generatedReceipt);
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${transactionId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onDownload?.();
    }
  };

  const handleEmail = () => {
    if (generatedReceipt) {
      // Simulate email sending
      console.log('Sending receipt via email to:', customerEmail);
      onEmail?.();
    }
  };

  const handleSMS = () => {
    if (generatedReceipt && customerPhone) {
      // Simulate SMS sending
      console.log('Sending receipt via SMS to:', customerPhone);
      onSMS?.();
    }
  };

  const handlePrint = () => {
    if (generatedReceipt) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateReceiptHTML(generatedReceipt));
        printWindow.document.close();
        printWindow.print();
      }
      onPrint?.();
    }
  };

  const generateReceiptContent = (receipt: ReceiptData) => {
    return `
LE RESTAURANT - PAYMENT RECEIPT
================================

Transaction ID: ${receipt.transactionId}
Order ID: ${receipt.orderId}
Date: ${new Date(receipt.paymentDate).toLocaleString()}

CUSTOMER INFORMATION:
Name: ${receipt.customerName}
Email: ${receipt.customerEmail}
${receipt.customerPhone ? `Phone: ${receipt.customerPhone}` : ''}

PAYMENT DETAILS:
Method: ${receipt.method.replace('_', ' ')}
Amount: $${receipt.amount.toFixed(2)}
${receipt.fees > 0 ? `Fees: $${receipt.fees.toFixed(2)}` : ''}
Total: $${receipt.total.toFixed(2)}

RESTAURANT INFORMATION:
${receipt.restaurantInfo.name}
${receipt.restaurantInfo.address}
Phone: ${receipt.restaurantInfo.phone}
Email: ${receipt.restaurantInfo.email}
Website: ${receipt.restaurantInfo.website}

Thank you for your business!
    `.trim();
  };

  const generateReceiptHTML = (receipt: ReceiptData) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Receipt - ${receipt.transactionId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        .section h3 { margin-bottom: 5px; color: #333; }
        .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h1>LE RESTAURANT</h1>
        <p>Payment Receipt</p>
    </div>
    
    <div class="section">
        <h3>Transaction Details</h3>
        <p><strong>Transaction ID:</strong> ${receipt.transactionId}</p>
        <p><strong>Order ID:</strong> ${receipt.orderId}</p>
        <p><strong>Date:</strong> ${new Date(receipt.paymentDate).toLocaleString()}</p>
    </div>
    
    <div class="section">
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${receipt.customerName}</p>
        <p><strong>Email:</strong> ${receipt.customerEmail}</p>
        ${receipt.customerPhone ? `<p><strong>Phone:</strong> ${receipt.customerPhone}</p>` : ''}
    </div>
    
    <div class="section">
        <h3>Payment Details</h3>
        <p><strong>Method:</strong> ${receipt.method.replace('_', ' ')}</p>
        <p><strong>Amount:</strong> $${receipt.amount.toFixed(2)}</p>
        ${receipt.fees > 0 ? `<p><strong>Fees:</strong> $${receipt.fees.toFixed(2)}</p>` : ''}
        <p class="total"><strong>Total:</strong> $${receipt.total.toFixed(2)}</p>
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>${receipt.restaurantInfo.name} | ${receipt.restaurantInfo.address}</p>
    </div>
</body>
</html>
    `;
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

  if (!generatedReceipt) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">Generate Receipt</h3>
          <p className="text-neutral-600 mb-6">
            Create a digital receipt for your payment
          </p>
        </div>

        {/* Receipt Preview */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">Receipt Preview</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Transaction ID:</span>
              <span className="font-mono">{transactionId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Order ID:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Customer:</span>
              <span>{customerName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Payment Method:</span>
              <div className="flex items-center gap-1">
                <MethodIcon className="w-4 h-4" />
                <span>{method.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            
            {fees > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Fees:</span>
                <span>${fees.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between border-t border-neutral-300 pt-2">
              <span className="font-semibold text-neutral-900">Total:</span>
              <span className="font-semibold text-primary-600">${(amount + fees).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Method Selection */}
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Delivery Method</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setDeliveryMethod('email')}
              className={`p-3 border rounded-lg text-left transition-colors ${
                deliveryMethod === 'email' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-neutral-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Send to {customerEmail}</p>
            </button>
            
            {customerPhone && (
              <button
                onClick={() => setDeliveryMethod('sms')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  deliveryMethod === 'sms' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-neutral-300 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">SMS</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">Send to {customerPhone}</p>
              </button>
            )}
            
            <button
              onClick={() => setDeliveryMethod('download')}
              className={`p-3 border rounded-lg text-left transition-colors ${
                deliveryMethod === 'download' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-neutral-300 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="font-medium">Download</span>
              </div>
              <p className="text-sm text-neutral-600 mt-1">Save to device</p>
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            variant="primary"
            onClick={generateReceipt}
            loading={isGenerating}
            className="px-8 py-3"
          >
            {isGenerating ? 'Generating Receipt...' : 'Generate Receipt'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Receipt Generated!</h3>
        <p className="text-green-600">
          Your payment receipt has been created successfully.
        </p>
      </div>

      {/* Receipt Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        
        <Button
          variant="outline"
          onClick={handleEmail}
          className="flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          Email Receipt
        </Button>
        
        {customerPhone && (
          <Button
            variant="outline"
            onClick={handleSMS}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            SMS Receipt
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </Button>
      </div>

      {/* Receipt Details */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h4 className="font-semibold text-neutral-900 mb-4">Receipt Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Receipt ID:</span>
              <span className="font-mono text-sm">{generatedReceipt.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Transaction ID:</span>
              <span className="font-mono text-sm">{generatedReceipt.transactionId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Order ID:</span>
              <span className="font-mono text-sm">{generatedReceipt.orderId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Generated:</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600">Customer:</span>
              <span className="text-sm">{generatedReceipt.customerName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Email:</span>
              <span className="text-sm">{generatedReceipt.customerEmail}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Amount:</span>
              <span className="font-semibold text-primary-600">${generatedReceipt.total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Status:</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <h4 className="font-semibold text-neutral-900 mb-3">Restaurant Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span>{restaurantInfo.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-500" />
              <span>{restaurantInfo.phone}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-neutral-500" />
              <span>{restaurantInfo.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-neutral-500" />
              <span>{restaurantInfo.website}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
