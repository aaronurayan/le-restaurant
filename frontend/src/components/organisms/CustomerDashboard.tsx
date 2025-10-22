import React from 'react';
import { ShoppingBag, Calendar, Star, Award, Utensils, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../molecules/StatCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { EmptyState } from '../molecules/EmptyState';
import { Badge } from '../atoms/Badge';
import { OrderDto } from '../../types/order';
import ReservationModal from './ReservationModal';

export interface CustomerDashboardProps {
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Customer statistics */
  stats?: {
    totalOrders: number;
    activeReservations: number;
    loyaltyPoints: number;
    rewardsTier: string;
  };
  /** Recent orders to display */
  recentOrders?: OrderDto[];
}

/**
 * CustomerDashboard Organism
 *
 * Combines stats, recent orders, and quick actions
 * Role: CUSTOMER
 * Route: /customer/dashboard
 */
const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  loading = false,
  error,
  onRetry,
  stats = {
    totalOrders: 0,
    activeReservations: 0,
    loyaltyPoints: 0,
    rewardsTier: 'Bronze',
  },
  recentOrders = [],
}) => {
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
        <h1 className="text-3xl font-bold text-neutral-gray-800 mb-2">My Dashboard</h1>
        <p className="text-neutral-gray-600">Welcome back! Here's your account overview</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to="/customer/orders"
          className="transform transition-transform hover:scale-105 hover:shadow-lg block"
        >
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingBag className="w-6 h-6" />}
            trend="up"
            change="View History"
          />
        </Link>

        <StatCard
          title="Active Reservations"
          value={stats.activeReservations}
          icon={<Calendar className="w-6 h-6" />}
          trend={stats.activeReservations > 0 ? 'up' : 'neutral'}
          change={stats.activeReservations > 0 ? 'Upcoming' : 'None'}
          description="View details"
        />

        <StatCard
          title="Loyalty Points"
          value={stats.loyaltyPoints}
          icon={<Star className="w-6 h-6" />}
          trend="up"
          change="+50 pts"
          description="This month"
        />

        <StatCard
          title="Rewards Tier"
          value={stats.rewardsTier}
          icon={<Award className="w-6 h-6" />}
          trend="neutral"
          description="Current tier"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-gray-800">Recent Orders</h2>
          <Link
            to="/customer/orders"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all orders →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                to={`/customer/orders/${order.id}`}
                className="block bg-neutral-gray-50 rounded-lg p-4 hover:bg-neutral-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-neutral-gray-900">Order #{order.id}</div>
                    <div className="text-sm text-neutral-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} •{' '}
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • $
                      {order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <Badge
                    variant={order.status === 'COMPLETED' ? 'success' : 'primary'}
                    size="sm"
                  >
                    {order.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="You haven't placed any orders yet" actionText="View menu" />
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6">
        <h2 className="text-xl font-bold text-neutral-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/menu"
            className="flex items-center justify-center p-4 bg-primary-orange-light text-primary-orange-dark rounded-lg hover:bg-primary-orange-100 transition-colors"
          >
            <Utensils className="w-5 h-5 mr-2" />
            <span>View Menu</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center justify-center p-4 bg-secondary-green-light text-secondary-green-dark rounded-lg hover:bg-secondary-green-100 transition-colors"
          >
            <User className="w-5 h-5 mr-2" />
            <span>My Profile</span>
          </Link>
          <Link
            to="/customer/orders"
            className="flex items-center justify-center p-4 bg-neutral-gray-100 text-neutral-gray-800 rounded-lg hover:bg-neutral-gray-200 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span>Order History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
