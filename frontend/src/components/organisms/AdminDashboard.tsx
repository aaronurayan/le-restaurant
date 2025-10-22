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
        <h1 className="text-3xl font-bold text-neutral-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-gray-600">
          Overview of restaurant operations and key metrics
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6">
        <h2 className="text-xl font-bold text-neutral-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowReservationModal(true)}
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group text-left"
          >
            <Calendar className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Reservations</div>
            <div className="text-sm text-neutral-gray-600">Book a table</div>
          </button>
          
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
            onClick={() => setShowUsers(true)}
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group text-left"
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
