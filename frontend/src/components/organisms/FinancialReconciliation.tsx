import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  FileText,
  Calculator,
  BarChart3
} from 'lucide-react';
import { Payment, PaymentStatus } from '../../types/payment';
import { usePaymentApi } from '../../hooks/usePaymentApi';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface FinancialReconciliationProps {
  className?: string;
}

interface ReconciliationData {
  totalRevenue: number;
  totalFees: number;
  netRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  refunds: number;
  disputes: number;
  pendingAmount: number;
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    transactions: number;
    fees: number;
  }>;
  methodBreakdown: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    amount: number;
  }>;
}

interface Dispute {
  id: string;
  transactionId: string;
  customerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export const FinancialReconciliation: React.FC<FinancialReconciliationProps> = ({
  className = ''
}) => {
  const {
    payments,
    loading,
    error,
    isBackendConnected,
    loadPayments
  } = usePaymentApi();

  const [reconciliationData, setReconciliationData] = useState<ReconciliationData | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (payments.length > 0) {
      calculateReconciliationData();
    }
  }, [payments, selectedPeriod]);

  const calculateReconciliationData = () => {
    const now = new Date();
    const startDate = getStartDate(selectedPeriod, now);
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentTime);
      return paymentDate >= startDate;
    });

    const totalRevenue = filteredPayments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalFees = filteredPayments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount * 0.029), 0); // 2.9% processing fee

    const refunds = filteredPayments
      .filter(p => p.status === 'REFUNDED')
      .reduce((sum, p) => sum + p.amount, 0);

    const disputes = filteredPayments
      .filter(p => p.status === 'FAILED')
      .length;

    const pendingAmount = filteredPayments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    // Method breakdown
    const methodBreakdown = filteredPayments
      .filter(p => p.status === 'COMPLETED')
      .reduce((acc, payment) => {
        const method = payment.method;
        const existing = acc.find(item => item.method === method);
        if (existing) {
          existing.count++;
          existing.amount += payment.amount;
        } else {
          acc.push({ method, count: 1, amount: payment.amount, percentage: 0 });
        }
        return acc;
      }, [] as Array<{ method: string; count: number; amount: number; percentage: number }>);

    // Calculate percentages
    methodBreakdown.forEach(item => {
      item.percentage = (item.amount / totalRevenue) * 100;
    });

    // Status breakdown
    const statusBreakdown = filteredPayments.reduce((acc, payment) => {
      const status = payment.status;
      const existing = acc.find(item => item.status === status);
      if (existing) {
        existing.count++;
        existing.amount += payment.amount;
      } else {
        acc.push({ status, count: 1, amount: payment.amount });
      }
      return acc;
    }, [] as Array<{ status: string; count: number; amount: number }>);

    // Daily breakdown (last 7 days)
    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.paymentTime);
        return paymentDate >= dayStart && paymentDate <= dayEnd;
      });

      const dayRevenue = dayPayments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

      const dayFees = dayPayments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.amount * 0.029), 0);

      dailyBreakdown.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        transactions: dayPayments.length,
        fees: dayFees
      });
    }

    setReconciliationData({
      totalRevenue,
      totalFees,
      netRevenue: totalRevenue - totalFees,
      transactionCount: filteredPayments.length,
      averageTransactionValue: filteredPayments.length > 0 ? totalRevenue / filteredPayments.length : 0,
      refunds,
      disputes,
      pendingAmount,
      dailyBreakdown,
      methodBreakdown,
      statusBreakdown
    });
  };

  const getStartDate = (period: string, now: Date) => {
    const start = new Date(now);
    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
    }
    return start;
  };

  const mockDisputes: Dispute[] = [
    {
      id: 'DISP-001',
      transactionId: 'TXN-123456789',
      customerName: 'John Doe',
      amount: 45.99,
      reason: 'Item not as described',
      status: 'open',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'DISP-002',
      transactionId: 'TXN-123456790',
      customerName: 'Jane Smith',
      amount: 32.50,
      reason: 'Duplicate charge',
      status: 'investigating',
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 'DISP-003',
      transactionId: 'TXN-123456791',
      customerName: 'Bob Johnson',
      amount: 28.75,
      reason: 'Service not provided',
      status: 'resolved',
      createdAt: '2024-01-13T09:20:00Z',
      resolvedAt: '2024-01-15T14:30:00Z',
      resolution: 'Refund processed'
    }
  ];

  useEffect(() => {
    setDisputes(mockDisputes);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" onClick={loadPayments}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Financial Reconciliation</h2>
          <p className="text-neutral-600 mt-1">
            Monitor payments, track revenue, and manage disputes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isBackendConnected && (
            <div className="flex items-center text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>🟢 Live Data</span>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={loadPayments}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {[
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
          { id: 'quarter', label: 'This Quarter' }
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === period.id
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      {reconciliationData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${reconciliationData.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {reconciliationData.transactionCount} transactions
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Net Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${reconciliationData.netRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  After ${reconciliationData.totalFees.toFixed(2)} fees
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Refunds</p>
                <p className="text-2xl font-bold text-red-600">
                  ${reconciliationData.refunds.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {reconciliationData.disputes} disputes
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${reconciliationData.pendingAmount.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Awaiting processing
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Breakdown */}
        {reconciliationData && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Methods</h3>
            
            <div className="space-y-3">
              {reconciliationData.methodBreakdown.map((method) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    <span className="font-medium">{method.method.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${method.amount.toFixed(2)}</p>
                    <p className="text-sm text-neutral-500">
                      {method.count} transactions ({method.percentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        {reconciliationData && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Status</h3>
            
            <div className="space-y-3">
              {reconciliationData.statusBreakdown.map((status) => (
                <div key={status.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'COMPLETED' ? 'bg-green-500' :
                      status.status === 'PENDING' ? 'bg-yellow-500' :
                      status.status === 'FAILED' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="font-medium">{status.status}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${status.amount.toFixed(2)}</p>
                    <p className="text-sm text-neutral-500">{status.count} transactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disputes Management */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Dispute Management</h3>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Disputes
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Dispute ID</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="border-b border-neutral-100">
                  <td className="py-3 px-4 font-mono text-sm">{dispute.id}</td>
                  <td className="py-3 px-4">{dispute.customerName}</td>
                  <td className="py-3 px-4 font-semibold">${dispute.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-neutral-600">{dispute.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export Financial Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export to CSV
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
