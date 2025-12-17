/**
 * Order State Management Store (Zustand)
 * 
 * Centralized state for Order management across the application.
 * Addresses audit finding: Frontend state not updating after payment completion.
 * 
 * Features:
 * - Order CRUD operations with optimistic updates
 * - Request caching with TTL (Time To Live)
 * - Request deduplication for ongoing API calls
 * - Automatic cache invalidation
 * 
 * @module F105-OrderManagement
 * @author Le Restaurant Development Team
 * @version 2.0.0
 * @since 2025-12-06
 */

import { create } from 'zustand';
import { OrderDto, OrderStatus } from '../types/order';

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheEntry {
  data: OrderDto;
  timestamp: number;
}

interface OrderStore {
  // State
  orders: OrderDto[];
  currentOrder: OrderDto | null;
  loading: boolean;
  error: string | null;
  
  // Cache state
  orderCache: Map<number, CacheEntry>;
  pendingRequests: Map<number, Promise<OrderDto>>;
  lastFetchTime: number | null;

  // Actions
  setOrders: (orders: OrderDto[]) => void;
  addOrder: (order: OrderDto) => void;
  updateOrder: (id: number, updates: Partial<OrderDto>) => void;
  removeOrder: (id: number) => void;
  setCurrentOrder: (order: OrderDto | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Cache actions
  getCachedOrder: (id: number) => OrderDto | null;
  setCachedOrder: (id: number, order: OrderDto) => void;
  invalidateCache: (id?: number) => void;
  isPending: (id: number) => boolean;
  setPendingRequest: (id: number, promise: Promise<OrderDto>) => void;
  clearPendingRequest: (id: number) => void;

  // Utilities
  getOrderById: (id: number) => OrderDto | undefined;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  // Initial State
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderCache: new Map(),
  pendingRequests: new Map(),
  lastFetchTime: null,

  // Actions
  setOrders: (orders) => set({ orders, error: null, lastFetchTime: Date.now() }),

  addOrder: (order) =>
    set((state) => {
      // Also cache the new order
      const newCache = new Map(state.orderCache);
      newCache.set(order.id, { data: order, timestamp: Date.now() });
      
      return {
        orders: [...state.orders, order],
        orderCache: newCache,
        error: null,
      };
    }),

  updateOrder: (id, updates) =>
    set((state) => {
      const updatedOrders = state.orders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      );
      
      // Update cache
      const newCache = new Map(state.orderCache);
      const cachedEntry = newCache.get(id);
      if (cachedEntry) {
        newCache.set(id, {
          data: { ...cachedEntry.data, ...updates },
          timestamp: Date.now(),
        });
      }
      
      return {
        orders: updatedOrders,
        orderCache: newCache,
        currentOrder:
          state.currentOrder?.id === id
            ? { ...state.currentOrder, ...updates }
            : state.currentOrder,
        error: null,
      };
    }),

  removeOrder: (id) =>
    set((state) => {
      // Remove from cache
      const newCache = new Map(state.orderCache);
      newCache.delete(id);
      
      return {
        orders: state.orders.filter((order) => order.id !== id),
        orderCache: newCache,
        currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
        error: null,
      };
    }),

  setCurrentOrder: (order) => set({ currentOrder: order, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  // Cache actions
  getCachedOrder: (id) => {
    const cache = get().orderCache;
    const entry = cache.get(id);
    
    if (!entry) return null;
    
    // Check if cache is still valid
    const age = Date.now() - entry.timestamp;
    if (age > CACHE_TTL) {
      // Cache expired, remove it
      const newCache = new Map(cache);
      newCache.delete(id);
      set({ orderCache: newCache });
      return null;
    }
    
    return entry.data;
  },

  setCachedOrder: (id, order) =>
    set((state) => {
      const newCache = new Map(state.orderCache);
      newCache.set(id, { data: order, timestamp: Date.now() });
      return { orderCache: newCache };
    }),

  invalidateCache: (id) =>
    set((state) => {
      if (id === undefined) {
        // Clear all cache
        return { orderCache: new Map(), lastFetchTime: null };
      } else {
        // Clear specific cache entry
        const newCache = new Map(state.orderCache);
        newCache.delete(id);
        return { orderCache: newCache };
      }
    }),

  isPending: (id) => get().pendingRequests.has(id),

  setPendingRequest: (id, promise) =>
    set((state) => {
      const newPending = new Map(state.pendingRequests);
      newPending.set(id, promise);
      return { pendingRequests: newPending };
    }),

  clearPendingRequest: (id) =>
    set((state) => {
      const newPending = new Map(state.pendingRequests);
      newPending.delete(id);
      return { pendingRequests: newPending };
    }),

  // Utilities
  getOrderById: (id) => {
    // First check cache
    const cached = get().getCachedOrder(id);
    if (cached) return cached;
    
    // Fall back to orders array
    return get().orders.find((order) => order.id === id);
  },

  clearOrders: () =>
    set({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      orderCache: new Map(),
      pendingRequests: new Map(),
      lastFetchTime: null,
    }),
}));
