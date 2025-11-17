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
  /** Friendly name for personalization */
  customerName?: string;
  /** Celebration / upcoming reservation context */
  upcomingReservation?: {
    date: string;
    time: string;
    partySize: number;
    note?: string;
  };
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
  customerName = 'Guest',
  upcomingReservation,
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
        <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-3">VIP Hospitality</p>
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-gray-900 mb-2">
          Welcome back, {customerName}!
        </h1>
        <p className="text-neutral-gray-600 max-w-2xl">
          Your personal maître d’ keeps celebrations, pairings, and loyalty rewards at the ready. Update requests below or
          jump back into tonight’s plans.
        </p>
      </div>

      {/* Personalization + AI Recommendation */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <section className="bg-white rounded-3xl border border-neutral-gray-200 shadow-sm p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">Maître d’ Notes</p>
              <h2 className="text-2xl font-serif text-neutral-gray-900 mt-2">Preparing for your next visit</h2>
            </div>
            <Badge variant="success" size="lg">
              {stats.rewardsTier} Tier
            </Badge>
          </div>
          <div className="mt-6 space-y-4 text-neutral-600">
            <p>
              {upcomingReservation
                ? `We reserved Friday ${upcomingReservation.time} for ${upcomingReservation.partySize} guests. ${
                    upcomingReservation.note || 'Let us know if you’d like florals or champagne on arrival.'
                  }`
                : 'Tap “Book Celebration” to let us know about anniversaries, proposals, or any special touch you desire.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/customer/reservations"
                className="inline-flex items-center justify-center rounded-full bg-primary-600 text-white px-5 py-2 text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Book Celebration
              </Link>
              <Link
                to="/customer/reservations"
                className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-800 hover:border-neutral-500 transition-colors"
              >
                Update Special Requests
              </Link>
            </div>
          </div>
        </section>
        <section className="rounded-3xl overflow-hidden bg-neutral-gray-900 text-white relative">
          <div className="h-56 sm:h-72 bg-cover bg-center opacity-60"
            style={{ backgroundImage: 'url(https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-200 mb-2">AI Chef Recommendation</p>
            <h3 className="text-2xl font-serif mb-2">Truffle-Roasted Sea Bass</h3>
            <p className="text-sm text-neutral-100 mb-4">
              Chef Amélie recommends pairing Friday’s anniversary dinner with a glass of vintage Blanc de Blancs. Tap to add
              a sommelier tasting flight.
            </p>
            <Link
              to="/customer/orders"
              className="inline-flex items-center self-start rounded-full bg-white/90 text-neutral-900 px-5 py-2 text-sm font-semibold hover:bg-white"
            >
              Preview Pairing
            </Link>
          </div>
        </section>
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

        <Link
          to="/customer/reservations"
          className="transform transition-transform hover:scale-105 hover:shadow-lg block"
        >
          <StatCard
            title="Active Reservations"
            value={stats.activeReservations}
            icon={<Calendar className="w-6 h-6" />}
            trend={stats.activeReservations > 0 ? 'up' : 'neutral'}
            change={stats.activeReservations > 0 ? 'Upcoming' : 'None'}
            description="View details"
          />
        </Link>

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center p-4 bg-primary-orange-light text-primary-orange-dark rounded-lg hover:bg-primary-orange-100 transition-colors"
          >
            <Utensils className="w-5 h-5 mr-2" />
            <span>View Menu</span>
          </Link>
          <Link
            to="/customer/reservations"
            className="flex items-center justify-center p-4 bg-secondary-green-light text-secondary-green-dark rounded-lg hover:bg-secondary-green-100 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>Manage Reservations</span>
          </Link>
          <Link
            to="/customer/profile"
            className="flex items-center justify-center p-4 bg-neutral-gray-100 text-neutral-gray-800 rounded-lg hover:bg-neutral-gray-200 transition-colors"
          >
            <User className="w-5 h-5 mr-2" />
            <span>My Profile</span>
          </Link>
          <Link
            to="/customer/orders"
            className="flex items-center justify-center p-4 bg-white border border-neutral-gray-200 text-neutral-gray-800 rounded-lg hover:border-neutral-gray-400 transition-colors"
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
