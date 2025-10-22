import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import CustomerDashboard from '../CustomerDashboard';
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

vi.mock('../../../contexts/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="cart-provider">{children}</div>,
  useCart: () => ({
    cartItems: [{
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
    }],
    cartTotal: 25.98,
    cartItemCount: 2,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    isCartEmpty: false
  })
}));

// ✅ Initialize mock API in beforeEach
beforeEach(() => {
  mockApi = createMockOrderApi({ orders: [mockOrderData] });
  mockUseOrderApi.mockReturnValue(mockApi);
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
  // ✅ Test 1: Create an order and update order history
  // ============================================================
  it('should create an order and update order history', async () => {
    const user = userEvent.setup();
    
    // Update mock to return the test order
    (mockApi.createOrder as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrder);

    const { rerender } = render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Checkout />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill form and place order
    await user.selectOptions(screen.getByLabelText(/order type/i), 'TAKEOUT');
    await user.type(screen.getByLabelText(/tip amount/i), '3');
    await user.type(screen.getByLabelText(/special instructions/i), 'Extra hot please');
    await user.click(screen.getByRole('button', { name: /place order/i }));

    // Verify order creation
    await waitFor(() => expect(mockApi.createOrder).toHaveBeenCalledTimes(1));

    // Render dashboard to show recent order
    rerender(
      <BrowserRouter>
        <AuthProvider>
          <CustomerDashboard
            stats={{
              totalOrders: 1,
              activeReservations: 0,
              loyaltyPoints: 0,
              rewardsTier: 'Bronze'
            }}
            recentOrders={[mockOrder]}
          />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Order #1')).toBeInTheDocument();
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('$31.58')).toBeInTheDocument();

    // Navigate to Orders page
    rerender(
      <BrowserRouter>
        <AuthProvider>
          <Orders />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => expect(mockApi.getOrdersByCustomer).toHaveBeenCalledTimes(1));
    const orderCard = screen.getByTestId(`order-card-${mockOrder.id}`);
    expect(within(orderCard).getByText('Order Received')).toBeInTheDocument();
    expect(within(orderCard).getByText('$31.58')).toBeInTheDocument();
  });

  // ============================================================
  // ✅ Test 2: Reflect order status changes
  // ============================================================
  it('should reflect order status changes in history', async () => {
    const updatedOrder = { ...mockOrder, status: 'IN_PREPARATION' as OrderStatus };
    updateMockApi([mockOrder]); // initial state

    render(
      <BrowserRouter>
        <AuthProvider>
          <Orders />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Order Received')).toBeInTheDocument();
    });

    // Simulate status update
    updateMockApi([updatedOrder]);

    render(
      <BrowserRouter>
        <AuthProvider>
          <Orders />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Order Preparing')).toBeInTheDocument();
    });
  });

  // ============================================================
  // ✅ Test 3: Handle loading and error states
  // ============================================================
  it('should show loading and error states', async () => {
    updateMockApi([], true); // loading

    render(
      <BrowserRouter>
        <AuthProvider>
          <Orders />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/loading orders/i)).toBeInTheDocument();

    // Simulate failed request
    updateMockApi([], false, 'Failed to fetch orders');
    render(
      <BrowserRouter>
        <AuthProvider>
          <Orders />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch orders/i)).toBeInTheDocument();
    });
  });
});
