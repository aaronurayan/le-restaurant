import React from 'react';
import { Check } from 'lucide-react';
import { OrderStatus } from '../../types/order';
import { OrderStatusBadge } from '../atoms/OrderStatusBadge';

/**
 * OrderStatusTimeline Molecule (F105)
 * 
 * Displays a visual timeline of order progress through different statuses.
 * Shows completed steps with checkmarks and highlights current status.
 * 
 * @component
 * @example
 * ```tsx
 * <OrderStatusTimeline currentStatus="IN_PREPARATION" orderType="DELIVERY" />
 * ```
 */

export interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  orderType: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';
  estimatedCompletion?: string;
  className?: string;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
}

const getTimelineSteps = (orderType: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY'): TimelineStep[] => {
  const commonSteps: TimelineStep[] = [
    { status: 'PENDING', label: 'Order Received' },
    { status: 'CONFIRMED', label: 'Confirmed' },
    { status: 'PREPARING', label: 'Preparing' },
  ];

  // Backend only uses: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
  // All order types use READY status before COMPLETED
  return [
    ...commonSteps,
    { status: 'READY', label: orderType === 'DELIVERY' ? 'Ready for Delivery' : orderType === 'TAKEOUT' ? 'Ready for Pickup' : 'Ready to Serve' },
    { status: 'COMPLETED', label: orderType === 'DELIVERY' ? 'Delivered' : orderType === 'TAKEOUT' ? 'Picked Up' : 'Served' },
  ];
};

const statusOrder: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'COMPLETED',
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  orderType,
  estimatedCompletion,
  className = '',
}) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <OrderStatusBadge status="CANCELLED" size="lg" />
        <p className="text-sm text-red-700 mt-2">This order has been cancelled</p>
      </div>
    );
  }

  const steps = getTimelineSteps(orderType);
  const currentStepIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={`${className}`}>
      {estimatedCompletion && (
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-primary-700">
            <span className="font-medium">Estimated completion:</span>{' '}
            {new Date(estimatedCompletion).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}

      <div className="relative">
        {steps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const isCompleted = stepIndex < currentStepIndex;
          const isCurrent = step.status === currentStatus;
          const isUpcoming = stepIndex > currentStepIndex;

          return (
            <div key={step.status} className="relative pb-8 last:pb-0">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute left-4 top-9 w-0.5 h-full -ml-px
                    ${isCompleted ? 'bg-secondary-500' : 'bg-neutral-300'}
                  `}
                />
              )}

              {/* Timeline node and content */}
              <div className="relative flex items-start">
                {/* Node */}
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${isCompleted ? 'bg-secondary-500 border-secondary-500' : ''}
                    ${isCurrent ? 'bg-primary-500 border-primary-500 animate-pulse' : ''}
                    ${isUpcoming ? 'bg-white border-neutral-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  ) : (
                    <div className="w-3 h-3 bg-neutral-300 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <p
                    className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-primary-700' : ''}
                      ${isCompleted ? 'text-secondary-700' : ''}
                      ${isUpcoming ? 'text-neutral-500' : ''}
                    `}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-neutral-600 mt-0.5">In progress...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
