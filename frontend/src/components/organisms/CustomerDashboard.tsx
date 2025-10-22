import React from 'react';
import { ShoppingBag, Calendar, Star, Award, Utensils, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../molecules/StatCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { EmptyState } from '../molecules/EmptyState';
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
  /** Recent orders */
  recentOrders?: Array<{
    id: number;
    date: string;
    items: string;
    total: number;
    status: string;
  }>;
}

/**
 * CustomerDashboard Organism
 * 
 * Customer dashboard combining:
 * - StatCard molecules for personal metrics
 * - LoadingSpinner/ErrorMessage/EmptyState atoms for states
 * - Recent orders summary
 * 
 * Role-based: CUSTOMER only
 * Route: /customer/dashboard
 * 
 * @example
 * <CustomerDashboard
 *   stats={{
 *     totalOrders: 24,
 *     activeReservations: 1,
 *     loyaltyPoints: 450,
 *     rewardsTier: 'Gold'
 *   }}
 *   recentOrders={[...]}
 * />
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
          My Dashboard
        </h1>
        <p className="text-neutral-gray-600">
          Welcome back! Here's your account overview
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-6 h-6" />}
          trend="neutral"
          change={`${stats.totalOrders} orders`}
          description="All time"
        />
        
        <StatCard
          title="Active Reservations"
          value={stats.activeReservations}
          icon={<Calendar className="w-6 h-6" />}
          trend={stats.activeReservations > 0 ? 'up' : 'neutral'}
          change={stats.activeReservations > 0 ? 'Upcoming' : 'None'}
          description={stats.activeReservations > 0 ? 'View details' : 'Book now'}
          variant={stats.activeReservations > 0 ? 'primary' : 'default'}
        />
        
        <StatCard
          title="Loyalty Points"
          value={stats.loyaltyPoints}
          icon={<Star className="w-6 h-6" />}
          trend="up"
          change="+50 pts"
          description="This month"
          variant="secondary"
        />
        
        <StatCard
          title="Rewards Tier"
          value={stats.rewardsTier}
          icon={<Award className="w-6 h-6" />}
          trend="neutral"
          description="Current membership"
          variant="secondary"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-gray-800">
            Recent Orders
          </h2>
          <a
            href="/customer/orders"
            className="text-primary-orange hover:text-primary-orange-dark font-semibold"
          >
            View All →
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            message="No orders yet"
            description="Start ordering delicious meals from our menu"
            actionText="Browse Menu"
            onAction={() => window.location.href = '/menu'}
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-neutral-gray-200 rounded-lg hover:bg-neutral-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-neutral-gray-800">
                    Order #{order.id}
                  </div>
                  <div className="text-sm text-neutral-gray-600">
                    {order.items} • {order.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-gray-800">
                    ${order.total.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      order.status === 'Delivered'
                        ? 'text-secondary-green'
                        : 'text-primary-orange'
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border-2 border-neutral-gray-200 p-6">
        <h2 className="text-xl font-bold text-neutral-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <Utensils className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Order Now</div>
            <div className="text-sm text-neutral-gray-600">Browse our menu</div>
          </Link>
          
          <button
            onClick={() => setShowReservationModal(true)}
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group text-left"
          >
            <Calendar className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">Make Reservation</div>
            <div className="text-sm text-neutral-gray-600">Book a table</div>
          </button>
          
          <Link
            to="/"
            className="p-4 border-2 border-primary-orange rounded-lg hover:bg-primary-orange-light transition-colors group block text-left no-underline"
          >
            <User className="w-8 h-8 text-primary-orange mb-2 group-hover:text-primary-orange-dark" />
            <div className="font-semibold text-neutral-gray-800">My Profile</div>
            <div className="text-sm text-neutral-gray-600">View account details</div>
          </Link>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
