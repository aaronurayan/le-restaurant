import React from 'react';

/**
 * CartItemSkeleton Component
 * Shows loading placeholder for cart items
 */
export const CartItemSkeleton: React.FC = () => (
  <div className="flex items-center justify-between border p-3 rounded">
    <div className="space-y-2 flex-grow">
      <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse"></div>
      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
    </div>
    <div className="flex items-center gap-3">
      <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse"></div>
      <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse"></div>
    </div>
  </div>
);