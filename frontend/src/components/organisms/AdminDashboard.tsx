import React from 'react';
import { DollarSign, Package, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../molecules/StatCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ErrorMessage } from '../molecules/ErrorMessage';
import UserManagementPanel from './UserManagementPanel';
import ReservationModal from './ReservationModal';

export interface AdminDashboardProps {
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Dashboard statistics */
  stats?: {
    totalRevenue: number;
    pendingOrders: number;
    activeReservations: number;
    activeUsers: number;
  };
}

/**
 * AdminDashboard Organism
 * 
 * Admin/Manager dashboard combining:
 * - StatCard molecules for key metrics
 * - LoadingSpinner/ErrorMessage atoms for states
 * - Quick action links to management panels
 * 
 * Role-based: ADMIN, MANAGER only
 * Route: /admin/dashboard
 * 
 * @example
 * <AdminDashboard
 *   stats={{
 *     totalRevenue: 12345,
 *     pendingOrders: 8,
 *     activeReservations: 12,
 *     activeUsers: 156
 *   }}
 * />
 */
const AdminDashboard: React.FC<AdminDashboardProps> = ({
  loading = false,
  error,
  onRetry,
  stats = {
    totalRevenue: 0,
    pendingOrders: 0,
    activeReservations: 0,
    activeUsers: 0,
  },
}) => {
  const [showUsers, setShowUsers] = React.useState(false);
  const [showReservationModal, setShowReservationModal] = React.useState(false);
  const aiAlerts = [
    {
      severity: 'warning' as const,
      title: 'Table 12 delayed 15 min',
      description: 'Chef Camille needs an extra garnish run — suggest amuse-bouche.',
      action: 'Ping kitchen',
    },
    {
      severity: 'info' as const,
      title: 'Courier route congestion',
      description: 'Delivery zone 2 running 8 minutes slow. Offer dessert voucher at checkout.',
      action: 'Review delivery board',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-2">Ops Control • Hospitality Pulse</p>
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-gray-900 mb-2">
          Welcome back to the Chef’s Table Ops Hub
        </h1>
        <p className="text-neutral-gray-600 max-w-3xl">
          Monitor revenue, pacing, and AI hospitality alerts. Keep promises to guests by resolving bottlenecks before they reach the dining room.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend="up"
          change="+12.5%"
          description="vs last month"
          variant="primary"
        />
        
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Package className="w-6 h-6" />}
          trend={stats.pendingOrders > 10 ? 'up' : 'neutral'}
          change={`${stats.pendingOrders} orders`}
          description="Requires attention"
          variant={stats.pendingOrders > 10 ? 'default' : 'secondary'}
        />
        
        <StatCard
          title="Active Reservations"
          value={stats.activeReservations}
          icon={<Calendar className="w-6 h-6" />}
          trend="neutral"
          change={`${stats.activeReservations} today`}
          description="Pending approval"
        />
        
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Users className="w-6 h-6" />}
          trend="up"
          change="+8 new"
          description="This week"
          variant="secondary"
        />
      </div>

      {/* AI Bottleneck Alerts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">AI Bottleneck Alerts</p>
              <h2 className="text-2xl font-serif text-neutral-900 mt-1">Proactive Hospitality Signals</h2>
            </div>
          </div>
          <div className="space-y-4">
            {aiAlerts.map((alert, idx) => (
              <div
                key={alert.title}
                className={`rounded-2xl border p-4 ${
                  alert.severity === 'warning'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-primary-100 bg-primary-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">{alert.title}</h3>
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest ${
                      alert.severity === 'warning' ? 'text-amber-700' : 'text-primary-700'
                    }`}
                  >
                    {alert.severity === 'warning' ? 'Action Needed' : 'Heads Up'}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 mb-3">{alert.description}</p>
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-900"
                >
                  {alert.action} →
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">Hospitality Snapshot</p>
          <h2 className="text-2xl font-serif text-neutral-900 mt-1 mb-4">Tonight’s readiness</h2>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li>• {stats.activeReservations} reservations awaiting confirmation</li>
            <li>• {stats.pendingOrders} orders queuing in kitchen display</li>
            <li>• Loyalty momentum: {stats.activeUsers} active VIP profiles this week</li>
          </ul>
          <button
            type="button"
            onClick={() => setShowReservationModal(true)}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 text-white px-5 py-2 text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            Open Approval Console
          </button>
        </section>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6">
        <h2 className="text-xl font-bold text-neutral-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/reservations"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
            onClick={() => setShowReservationModal(false)}
          >
            <Calendar className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Reservation Management</div>
            <div className="text-sm text-neutral-gray-600">Manage all reservations</div>
          </Link>
          
          <Link
            to="/"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <Package className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Orders</div>
            <div className="text-sm text-neutral-gray-600">View menu and orders</div>
          </Link>

          <Link
            to="/admin/menu"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <Package className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Menu Management</div>
            <div className="text-sm text-neutral-gray-600">Manage menu items</div>
          </Link>
          
          <button
            type="button"
            onClick={() => setShowUsers(true)}
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group text-left no-underline"
          >
            <Users className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Users</div>
            <div className="text-sm text-neutral-gray-600">Manage user accounts</div>
          </button>

          <Link
            to="/payments"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <DollarSign className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Payments</div>
            <div className="text-sm text-neutral-gray-600">View transactions</div>
          </Link>
          
          <Link
            to="/delivery"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <Package className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Delivery Management</div>
            <div className="text-sm text-neutral-gray-600">Track deliveries</div>
          </Link>
        </div>
      </div>

      {/* Management Modals */}
      {showUsers && (
        <UserManagementPanel
          isOpen={showUsers}
          onClose={() => setShowUsers(false)}
        />
      )}
      
      {showReservationModal && (
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
