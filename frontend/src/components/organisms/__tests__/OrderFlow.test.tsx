import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import { Orders } from '../../../pages/Orders';
import { Checkout } from '../../../pages/Checkout';
import { OrderDto, OrderStatus, OrderType } from '../../../types/order';
import { useOrderApi } from '../../../hooks/useOrderApi';
import { CartProvider } from '../../../contexts/CartContext';
import '@testing-library/jest-dom';
import { mockOrderData } from '../../../test/fixtures/orderData';

type MockOrderApiConfig = {
  loading?: boolean;
  error?: string | null;
  orders?: OrderDto[];
};

interface MockFunctions {
  getAllOrders: ReturnType<typeof vi.fn>;
  getOrderById: ReturnType<typeof vi.fn>;
  getOrdersByCustomer: ReturnType<typeof vi.fn>;
  getOrdersByStatus: ReturnType<typeof vi.fn>;
  createOrder: ReturnType<typeof vi.fn>;
  updateOrder: ReturnType<typeof vi.fn>;
  updateOrderStatus: ReturnType<typeof vi.fn>;
  deleteOrder: ReturnType<typeof vi.fn>;
  setCurrentOrder: ReturnType<typeof vi.fn>;
  setError: ReturnType<typeof vi.fn>;
}

// ✅ Create mock OrderApi instance with proper return type
const createMockOrderApi = (config?: MockOrderApiConfig) => {
  // Create spies for each function
  const spies: MockFunctions = {
    getAllOrders: vi.fn(),
    getOrderById: vi.fn(),
    getOrdersByCustomer: vi.fn(),
    getOrdersByStatus: vi.fn(),
    createOrder: vi.fn(),
    updateOrder: vi.fn(),
    updateOrderStatus: vi.fn(),
    deleteOrder: vi.fn(),
    setCurrentOrder: vi.fn(),
    setError: vi.fn()
  };

  // Set default implementations
  spies.getAllOrders.mockResolvedValue(config?.orders ?? []);
  spies.getOrderById.mockResolvedValue(config?.orders?.[0] ?? null);
  spies.getOrdersByCustomer.mockResolvedValue(config?.orders ?? []);
  spies.getOrdersByStatus.mockResolvedValue(config?.orders ?? []);
  spies.createOrder.mockResolvedValue(config?.orders?.[0] ?? mockOrderData);
  spies.updateOrder.mockResolvedValue(config?.orders?.[0] ?? mockOrderData);
  spies.updateOrderStatus.mockResolvedValue(config?.orders?.[0] ?? mockOrderData);
  spies.deleteOrder.mockResolvedValue(undefined);

  // Return the mock API
  return {
    orders: config?.orders ?? [],
    currentOrder: null,
    loading: config?.loading ?? false,
    error: config?.error ?? null,
    ...spies
  };
};

// ✅ Mock variables for tracking mock functions
let mockApi: ReturnType<typeof createMockOrderApi>;

// ✅ Mock useOrderApi globally with an initial mock
const mockUseOrderApi = vi.fn();
vi.mock('../../../hooks/useOrderApi', () => ({
  useOrderApi: () => mockUseOrderApi()
}));

// ✅ Mock useNavigate (react-router-dom)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// ✅ Mock Auth & Cart contexts globally
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER' },
    isAuthenticated: true,
    isLoading: false,
    session: {
      token: 'mock-token',
      expiresAt: '2025-10-23T00:00:00Z',
      user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER' }
    }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// ✅ Create mock for useCart hook
const mockCartItems = [{
  id: '1',
  menuItem: {
    id: 1,
    name: 'Pizza Margherita',
    price: 12.99,
    description: 'Classic pizza',
    category: 'PIZZA',
    image: '/images/pizza.jpg'
  },
  quantity: 2,
  subtotal: 25.98,
  specialInstructions: 'Extra hot please'
}];

const mockClearCart = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockUseCart = vi.fn().mockReturnValue({
  cartItems: mockCartItems,
  cartTotal: 25.98,
  cartItemCount: 2,
  addToCart: vi.fn(),
  removeFromCart: mockRemoveFromCart,
  updateQuantity: vi.fn(),
  clearCart: mockClearCart,
  isCartEmpty: false
});

// ✅ Mock the hooks/useCart module
vi.mock('../../../hooks/useCart', () => ({
  useCart: () => mockUseCart()
}));

// ✅ Create test wrapper component for consistent context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

// ✅ Initialize mock API in beforeEach
beforeEach(() => {
  // Reset all mocks
  vi.clearAllMocks();
    
  // Create fresh mock API
  mockApi = createMockOrderApi({ orders: [mockOrderData] });
  mockUseOrderApi.mockReturnValue(mockApi);

  // Set up createOrder mock to resolve successfully
  mockApi.createOrder.mockResolvedValue(mockOrderData);
});
// ✅ Helper to update mock API for different scenarios
const updateMockApi = (
  orders: OrderDto[] = [mockOrderData],
  loading = false,
  error: string | null = null
) => {
  mockApi = createMockOrderApi({ orders, loading, error });
  mockUseOrderApi.mockReturnValue(mockApi);
};

describe('Order Flow Integration Tests (F105)', () => {
  const mockOrder: OrderDto = {
    id: 1,
    customerId: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    orderType: 'TAKEOUT' as OrderType, // ✅ explicit cast
    status: 'PENDING' as OrderStatus,  // ✅ explicit cast
    items: [
      {
        id: 1,
        orderId: 1,
        menuItemId: 1,
        menuItemName: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 12.99,
        subtotal: 25.98
      }
    ],
    subtotal: 25.98,
    taxAmount: 2.6,
    tipAmount: 3.0,
    totalAmount: 31.58,
    orderTime: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    updateMockApi([mockOrder]);
  });

  // ============================================================
  // ✅ Test 1: Verify order creation API call
  // ============================================================
  it('should call the create order API when placing an order', async () => {
    const user = userEvent.setup();
    
    // Update mock to track API calls
    mockApi.createOrder = vi.fn().mockResolvedValueOnce(mockOrder);
    
    // Enable order creation by providing items
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      cartTotal: 25.98,
      cartItemCount: 2,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: mockClearCart,
      isCartEmpty: false
    });

    render(<Checkout />, { wrapper: TestWrapper });

    // Fill form and place order
    await user.selectOptions(screen.getByLabelText(/order type/i), 'TAKEOUT');
    await user.type(screen.getByLabelText(/tip amount/i), '3');
    await user.type(screen.getByLabelText(/special instructions/i), 'Extra hot please');
    
    // Verify Place Order button is enabled
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    expect(placeOrderButton).not.toBeDisabled();
    
    // Click the Place Order button
    await user.click(placeOrderButton);

    // Verify order creation API was called
    await waitFor(() => {
      expect(mockApi.createOrder).toHaveBeenCalledTimes(1);
    });
    
    // Verify the clearCart function was called after order creation
    expect(mockClearCart).toHaveBeenCalled();
  });

  // ============================================================
  // ✅ Test 2: Reflect order status changes
  // ============================================================
  it('should reflect order status changes in history', async () => {
    const updatedOrder = { ...mockOrder, status: 'IN_PREPARATION' as OrderStatus };
    updateMockApi([mockOrder]); // initial state

    render(<Orders />, { wrapper: TestWrapper });

    // Find the order status by text directly
    await waitFor(() => {
      expect(screen.getByText('Order Received')).toBeInTheDocument();
    });

    // Simulate status update
    updateMockApi([updatedOrder]);

    render(<Orders />, { wrapper: TestWrapper });

    // Check that the status has been updated - looking for the text directly
    await waitFor(() => {
      expect(screen.getByText('Being Prepared')).toBeInTheDocument();
    });
  });

  // ============================================================
  // ✅ Test 3: Handle loading and error states
  // ============================================================
  it('should show loading and error states', async () => {
    // Test loading state
    updateMockApi([], true); // Set loading to true
    render(<Orders />, { wrapper: TestWrapper });
    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();

    // Test error state
    updateMockApi([], false, 'Failed to fetch orders'); // Set error message
    render(<Orders />, { wrapper: TestWrapper });
    
    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch orders/i)).toBeInTheDocument();
    });
  });
});
