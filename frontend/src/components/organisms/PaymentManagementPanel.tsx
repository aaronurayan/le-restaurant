import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  User
} from 'lucide-react';
import { Payment, PaymentMethod, PaymentStatus } from '../../types/payment';
import { usePaymentApi } from '../../hooks/usePaymentApi';

interface PaymentManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentManagementPanel: React.FC<PaymentManagementPanelProps> = ({ isOpen, onClose }) => {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  
  // API 훅 사용
  const {
    payments,
    loading: isLoading,
    error,
    isBackendConnected,
    loadPayments,
    updatePaymentStatus
  } = usePaymentApi();


  useEffect(() => {
    if (isOpen) {
      loadPayments();
    }
  }, [isOpen, loadPayments]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Method filter
    if (methodFilter !== 'all') {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    setFilteredPayments(filtered);
  };

  const handleStatusChange = async (paymentId: number, newStatus: PaymentStatus) => {
    try {
      await updatePaymentStatus(paymentId, newStatus);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleRefund = async (paymentId: number) => {
    if (!confirm('Are you sure you want to process a refund for this payment?')) return;
    
    try {
      // TODO: Replace with actual API call
      // await paymentApi.processRefund(paymentId);
      await handleStatusChange(paymentId, PaymentStatus.REFUNDED);
    } catch (error) {
      console.error('Failed to process refund:', error);
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case PaymentStatus.PROCESSING:
        return <Clock className="w-4 h-4 text-blue-500" />;
      case PaymentStatus.PENDING:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case PaymentStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case PaymentStatus.REFUNDED:
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case PaymentStatus.CANCELLED:
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case PaymentStatus.COMPLETED:
        return `${baseClasses} bg-green-100 text-green-800`;
      case PaymentStatus.PROCESSING:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case PaymentStatus.PENDING:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case PaymentStatus.FAILED:
        return `${baseClasses} bg-red-100 text-red-800`;
      case PaymentStatus.REFUNDED:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case PaymentStatus.CANCELLED:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case PaymentMethod.CASH:
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case PaymentMethod.BANK_TRANSFER:
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case PaymentMethod.DIGITAL_WALLET:
        return <CreditCard className="w-4 h-4 text-orange-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalStats = () => {
    const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completed = payments
      .filter(p => p.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pending = payments
      .filter(p => p.status === PaymentStatus.PENDING)
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return { total, completed, pending };
  };

  const stats = getTotalStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Payment Management</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <span className="text-neutral-500">×</span>
          </button>
        </div>

        {/* Backend Connection Status */}
        {isBackendConnected && (
          <div className="p-4 bg-green-100 border-b border-green-200">
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">🟢 Connected to Backend API</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-yellow-100 border-b border-yellow-200">
            <div className="flex items-center text-yellow-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">⚠️ Using Mock Data: {error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="p-6 border-b border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(stats.total, 'USD')}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(stats.completed, 'USD')}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {formatCurrency(stats.pending, 'USD')}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-neutral-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
                className="form-input"
              >
                <option value="all">All Status</option>
                <option value={PaymentStatus.COMPLETED}>Completed</option>
                <option value={PaymentStatus.PROCESSING}>Processing</option>
                <option value={PaymentStatus.PENDING}>Pending</option>
                <option value={PaymentStatus.FAILED}>Failed</option>
                <option value={PaymentStatus.REFUNDED}>Refunded</option>
                <option value={PaymentStatus.CANCELLED}>Cancelled</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | 'all')}
                className="form-input"
              >
                <option value="all">All Methods</option>
                <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
                <option value={PaymentMethod.DEBIT_CARD}>Debit Card</option>
                <option value={PaymentMethod.CASH}>Cash</option>
                <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                <option value={PaymentMethod.DIGITAL_WALLET}>Digital Wallet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          Order #{payment.orderId}
                        </div>
                        <div className="text-sm text-neutral-500 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {payment.customerName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {payment.customerEmail}
                        </div>
                        {payment.transactionId && (
                          <div className="text-xs text-neutral-400">
                            {payment.transactionId}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-sm text-neutral-900 capitalize">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            // TODO: Implement payment details view
                            console.log('View payment details:', payment);
                          }}
                          className="text-primary-600 hover:text-primary-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {payment.status === PaymentStatus.COMPLETED && (
                          <button
                            onClick={() => handleRefund(payment.id)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Process Refund"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPanel;
