# 🚀 Implementation Strategy: F107 Delivery & F108/F109 Reservation Management

**Branch**: F107-DELIVERY-MANAGEMENT  
**Owner**: Aaron Urayan  
**Date**: 2025-10-20  
**Status**: Implementation Plan  

---

## 🎯 Implementation Principles

### Top Priority: **Main Branch Consistency**
- Follow existing code patterns from `UserController`, `PaymentController`, `MenuController`
- Use layered architecture pattern for Backend
- Use atomic design pattern for Frontend
- Maintain 80% test coverage for F102 & F106 standards
- API routes: `/api/{resource}` (existing pattern, NOT `/api/v1/`)

---

## 📋 Implementation Phases

### **Phase 1: Order Management Backend (F105 Foundation)**
**Purpose**: Create foundation for F107 Delivery Management  
**Duration**: 1-2 hours  
**Priority**: HIGH (Required for Delivery)

#### Backend Components to Create:

##### 1.1 DTOs (`backend/src/main/java/.../dto/`)
```java
// OrderDto.java - Response DTO
public class OrderDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private OrderType orderType;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal tipAmount;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private OffsetDateTime orderTime;
    private OffsetDateTime estimatedCompletion;
    private List<OrderItemDto> items;
    // getters/setters
}

// OrderCreateRequestDto.java
public class OrderCreateRequestDto {
    private Long customerId;
    private Long tableId; // nullable for delivery
    private OrderType orderType;
    private String specialInstructions;
    private List<OrderItemRequestDto> items;
    // validation annotations: @NotNull, @NotEmpty
}

// OrderUpdateRequestDto.java
public class OrderUpdateRequestDto {
    private OrderStatus status;
    private String specialInstructions;
    private OffsetDateTime estimatedCompletion;
}

// OrderItemDto.java
public class OrderItemDto {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}

// OrderItemRequestDto.java
public class OrderItemRequestDto {
    private Long menuItemId;
    private Integer quantity;
}
```

##### 1.2 Service (`backend/src/main/java/.../service/OrderService.java`)
**Pattern Reference**: `PaymentService.java`

```java
@Service
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    
    // Methods to implement:
    // - createOrder(OrderCreateRequestDto) -> OrderDto
    // - getOrderById(Long id) -> OrderDto
    // - getAllOrders() -> List<OrderDto>
    // - getOrdersByCustomerId(Long customerId) -> List<OrderDto>
    // - getOrdersByStatus(OrderStatus status) -> List<OrderDto>
    // - updateOrderStatus(Long id, OrderStatus status) -> OrderDto
    // - deleteOrder(Long id) -> void
    // - calculateOrderTotal(Order order) -> void (private helper)
    // - convertToDto(Order order) -> OrderDto (private helper)
}
```

**Business Logic**:
- Validate customer existence
- Validate menu items existence and availability
- Calculate subtotal from order items
- Calculate tax (10% assumption)
- Set initial status to PENDING
- Auto-populate orderTime with OffsetDateTime.now()
- Generate order number (optional)

##### 1.3 Controller (`backend/src/main/java/.../controller/OrderController.java`)
**Pattern Reference**: `PaymentController.java`

```java
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    private final OrderService orderService;
    
    // Endpoints:
    // POST   /api/orders                    -> Create order
    // GET    /api/orders/{id}               -> Get order by ID
    // GET    /api/orders                    -> Get all orders
    // GET    /api/orders/customer/{id}      -> Get orders by customer
    // GET    /api/orders/status/{status}    -> Get orders by status
    // PUT    /api/orders/{id}/status        -> Update order status
    // DELETE /api/orders/{id}               -> Delete/cancel order
}
```

**Error Handling**:
- Try-catch blocks with ResponseEntity
- Return appropriate HTTP status codes (201, 200, 400, 404)
- Map error messages in HashMap

---

### **Phase 2: Delivery Management Backend (F107 Complete)**
**Purpose**: Full F107 implementation with Order integration  
**Duration**: 2-3 hours  
**Priority**: HIGH

#### Backend Components to Create:

##### 2.1 DTOs (`backend/src/main/java/.../dto/`)
```java
// DeliveryDto.java
public class DeliveryDto {
    private Long id;
    private Long orderId;
    private String orderNumber;
    private Long addressId;
    private String fullAddress;
    private Long driverId;
    private String driverName;
    private BigDecimal deliveryFee;
    private Integer estimatedDeliveryTimeMinutes;
    private DeliveryStatus status;
    private String deliveryInstructions;
    private OffsetDateTime assignedAt;
    private OffsetDateTime pickedUpAt;
    private OffsetDateTime deliveredAt;
}

// DeliveryCreateRequestDto.java
public class DeliveryCreateRequestDto {
    private Long orderId;
    private Long deliveryAddressId;
    private BigDecimal deliveryFee;
    private Integer estimatedDeliveryTimeMinutes;
    private String deliveryInstructions;
}

// DeliveryUpdateRequestDto.java
public class DeliveryUpdateRequestDto {
    private Long driverId;
    private DeliveryStatus status;
    private String deliveryInstructions;
}

// DeliveryAddressDto.java
public class DeliveryAddressDto {
    private Long id;
    private Long userId;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Boolean isDefault;
}

// DeliveryAddressCreateRequestDto.java
public class DeliveryAddressCreateRequestDto {
    private Long userId;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Boolean isDefault;
}

// DeliveryDriverDto.java
public class DeliveryDriverDto {
    private Long id;
    private Long userId;
    private String name;
    private String phone;
    private String vehicleType;
    private String vehicleNumber;
    private Boolean isActive;
    private Boolean isAvailable;
}
```

##### 2.2 Service (`backend/src/main/java/.../service/`)
```java
// DeliveryService.java
@Service
@Transactional
public class DeliveryService {
    
    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final DeliveryDriverRepository deliveryDriverRepository;
    
    // Methods:
    // - createDelivery(DeliveryCreateRequestDto) -> DeliveryDto
    // - getDeliveryById(Long id) -> DeliveryDto
    // - getAllDeliveries() -> List<DeliveryDto>
    // - getDeliveriesByStatus(DeliveryStatus status) -> List<DeliveryDto>
    // - getDeliveriesByDriver(Long driverId) -> List<DeliveryDto>
    // - assignDriver(Long deliveryId, Long driverId) -> DeliveryDto
    // - updateDeliveryStatus(Long id, DeliveryStatus status) -> DeliveryDto
    // - deleteDelivery(Long id) -> void
}

// DeliveryAddressService.java
@Service
@Transactional
public class DeliveryAddressService {
    
    private final DeliveryAddressRepository addressRepository;
    private final UserRepository userRepository;
    
    // Methods:
    // - createAddress(DeliveryAddressCreateRequestDto) -> DeliveryAddressDto
    // - getAddressById(Long id) -> DeliveryAddressDto
    // - getAddressesByUserId(Long userId) -> List<DeliveryAddressDto>
    // - updateAddress(Long id, DeliveryAddressCreateRequestDto) -> DeliveryAddressDto
    // - setDefaultAddress(Long userId, Long addressId) -> DeliveryAddressDto
    // - deleteAddress(Long id) -> void
}

// DeliveryDriverService.java (optional for F107)
@Service
@Transactional
public class DeliveryDriverService {
    
    private final DeliveryDriverRepository driverRepository;
    
    // Methods:
    // - getAllDrivers() -> List<DeliveryDriverDto>
    // - getAvailableDrivers() -> List<DeliveryDriverDto>
    // - getDriverById(Long id) -> DeliveryDriverDto
    // - updateDriverAvailability(Long id, Boolean isAvailable) -> DeliveryDriverDto
}
```

##### 2.3 Controller (`backend/src/main/java/.../controller/`)
```java
// DeliveryController.java
@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryController {
    
    // Endpoints:
    // POST   /api/deliveries                      -> Create delivery
    // GET    /api/deliveries/{id}                 -> Get delivery by ID
    // GET    /api/deliveries                      -> Get all deliveries
    // GET    /api/deliveries/status/{status}      -> Get by status
    // GET    /api/deliveries/driver/{driverId}    -> Get by driver
    // PUT    /api/deliveries/{id}/driver          -> Assign driver
    // PUT    /api/deliveries/{id}/status          -> Update status
    // DELETE /api/deliveries/{id}                 -> Delete delivery
}

// DeliveryAddressController.java
@RestController
@RequestMapping("/api/delivery-addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryAddressController {
    
    // Endpoints:
    // POST   /api/delivery-addresses                    -> Create address
    // GET    /api/delivery-addresses/{id}               -> Get address by ID
    // GET    /api/delivery-addresses/user/{userId}      -> Get user addresses
    // PUT    /api/delivery-addresses/{id}               -> Update address
    // PUT    /api/delivery-addresses/{id}/default       -> Set as default
    // DELETE /api/delivery-addresses/{id}               -> Delete address
}

// DeliveryDriverController.java (optional)
@RestController
@RequestMapping("/api/delivery-drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryDriverController {
    
    // Endpoints:
    // GET    /api/delivery-drivers                -> Get all drivers
    // GET    /api/delivery-drivers/available      -> Get available drivers
    // GET    /api/delivery-drivers/{id}           -> Get driver by ID
    // PUT    /api/delivery-drivers/{id}/status    -> Update availability
}
```

---

### **Phase 3: Reservation Backend (F108 + F109 Simultaneous)**
**Purpose**: Customer reservation booking + Manager approval  
**Duration**: 2-3 hours  
**Priority**: HIGH

#### Backend Components to Create:

##### 3.1 DTOs (`backend/src/main/java/.../dto/`)
```java
// ReservationDto.java
public class ReservationDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Long tableId;
    private String tableNumber;
    private Integer tableCapacity;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private Integer partySize;
    private String specialRequests;
    private ReservationStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime confirmedAt;
    private Long confirmedByUserId;
    private String confirmedByName;
}

// ReservationCreateRequestDto.java (F108 - Customer)
public class ReservationCreateRequestDto {
    private Long customerId;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private Integer partySize;
    private String specialRequests;
    // tableId is null initially, assigned by manager
}

// ReservationUpdateRequestDto.java (F109 - Manager)
public class ReservationUpdateRequestDto {
    private Long tableId;
    private ReservationStatus status;
    private String specialRequests;
}

// RestaurantTableDto.java
public class RestaurantTableDto {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private String location;
    private Boolean isAvailable;
}

// RestaurantTableCreateRequestDto.java
public class RestaurantTableCreateRequestDto {
    private String tableNumber;
    private Integer capacity;
    private String location;
    private Boolean isAvailable;
}
```

##### 3.2 Service (`backend/src/main/java/.../service/`)
```java
// ReservationService.java
@Service
@Transactional
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    
    // F108 Methods (Customer):
    // - createReservation(ReservationCreateRequestDto) -> ReservationDto
    // - getReservationById(Long id) -> ReservationDto
    // - getReservationsByCustomerId(Long customerId) -> List<ReservationDto>
    // - cancelReservation(Long id) -> void
    
    // F109 Methods (Manager):
    // - getAllReservations() -> List<ReservationDto>
    // - getReservationsByStatus(ReservationStatus) -> List<ReservationDto>
    // - getReservationsByDate(LocalDate date) -> List<ReservationDto>
    // - approveReservation(Long id, Long tableId, Long managerId) -> ReservationDto
    // - denyReservation(Long id, Long managerId) -> ReservationDto
    // - updateReservation(Long id, ReservationUpdateRequestDto) -> ReservationDto
    
    // Helper Methods:
    // - validateTableAvailability(Long tableId, LocalDate date, LocalTime time) -> Boolean
    // - checkTableCapacity(Long tableId, Integer partySize) -> Boolean
}

// RestaurantTableService.java
@Service
@Transactional
public class RestaurantTableService {
    
    private final RestaurantTableRepository tableRepository;
    
    // Methods:
    // - createTable(RestaurantTableCreateRequestDto) -> RestaurantTableDto
    // - getTableById(Long id) -> RestaurantTableDto
    // - getAllTables() -> List<RestaurantTableDto>
    // - getAvailableTables(LocalDate date, LocalTime time, Integer partySize) -> List<RestaurantTableDto>
    // - updateTable(Long id, RestaurantTableCreateRequestDto) -> RestaurantTableDto
    // - deleteTable(Long id) -> void
}
```

##### 3.3 Controller (`backend/src/main/java/.../controller/`)
```java
// ReservationController.java
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {
    
    // F108 Endpoints (Customer):
    // POST   /api/reservations                      -> Create reservation
    // GET    /api/reservations/{id}                 -> Get reservation by ID
    // GET    /api/reservations/customer/{id}        -> Get customer reservations
    // DELETE /api/reservations/{id}                 -> Cancel reservation
    
    // F109 Endpoints (Manager):
    // GET    /api/reservations                      -> Get all reservations
    // GET    /api/reservations/status/{status}      -> Get by status
    // GET    /api/reservations/date/{date}          -> Get by date
    // PUT    /api/reservations/{id}/approve         -> Approve (assign table)
    // PUT    /api/reservations/{id}/deny            -> Deny reservation
    // PUT    /api/reservations/{id}                 -> Update reservation
}

// RestaurantTableController.java
@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:5173")
public class RestaurantTableController {
    
    // Endpoints:
    // POST   /api/tables                            -> Create table
    // GET    /api/tables/{id}                       -> Get table by ID
    // GET    /api/tables                            -> Get all tables
    // GET    /api/tables/available                  -> Get available tables (with query params)
    // PUT    /api/tables/{id}                       -> Update table
    // DELETE /api/tables/{id}                       -> Delete table
}
```

---

### **Phase 4: Backend Testing**
**Purpose**: Ensure 80% test coverage for all services  
**Duration**: 2-3 hours  
**Priority**: MEDIUM (after Phase 1-3)

#### Test Files to Create:
```
backend/src/test/java/.../service/
├── OrderServiceTest.java
├── DeliveryServiceTest.java
├── DeliveryAddressServiceTest.java
├── ReservationServiceTest.java
└── RestaurantTableServiceTest.java
```

**Pattern Reference**: `PaymentServiceTest.java`

**Test Structure**:
```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    
    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private OrderService orderService;
    
    // Test methods:
    // - createOrder_WithValidData_ReturnsOrderDto()
    // - createOrder_WithInvalidCustomer_ThrowsException()
    // - getOrderById_WithValidId_ReturnsOrderDto()
    // - getOrderById_WithInvalidId_ThrowsException()
    // - updateOrderStatus_WithValidData_ReturnsUpdatedDto()
    // - getAllOrders_ReturnsListOfOrders()
}
```

**Coverage Requirements**:
- Line coverage: ≥ 80%
- Branch coverage: ≥ 80%
- Method coverage: ≥ 80%

---

### **Phase 5: Order Management Frontend**
**Purpose**: Create UI for Order management  
**Duration**: 2-3 hours  
**Priority**: HIGH

#### Frontend Components to Create:

##### 5.1 Types (`frontend/src/types/order.ts`)
```typescript
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  orderTime: string;
  estimatedCompletion?: string;
  items: OrderItem[];
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEOUT = 'TAKEOUT',
  DELIVERY = 'DELIVERY'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateOrderRequest {
  customerId: string;
  tableId?: string;
  orderType: OrderType;
  specialInstructions?: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}
```

##### 5.2 Hooks (`frontend/src/hooks/useOrderApi.ts`)
**Pattern Reference**: `usePaymentApi.ts`

```typescript
export const useOrderApi = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createOrder = async (request: CreateOrderRequest) => { /* ... */ };
  const getOrderById = async (id: string) => { /* ... */ };
  const getAllOrders = async () => { /* ... */ };
  const getOrdersByCustomer = async (customerId: string) => { /* ... */ };
  const getOrdersByStatus = async (status: OrderStatus) => { /* ... */ };
  const updateOrderStatus = async (id: string, status: OrderStatus) => { /* ... */ };
  const deleteOrder = async (id: string) => { /* ... */ };
  
  return {
    orders,
    loading,
    error,
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByCustomer,
    getOrdersByStatus,
    updateOrderStatus,
    deleteOrder
  };
};
```

##### 5.3 Components (Atomic Pattern)

**Organisms** (`frontend/src/components/organisms/`):
```typescript
// OrderManagementPanel.tsx (Manager view)
const OrderManagementPanel: React.FC = () => {
  // Features:
  // - Display all orders in a table
  // - Filter by status, date, customer
  // - Update order status
  // - View order details
  // - Delete/cancel orders
};

// OrderStatusTracker.tsx (Customer view)
const OrderStatusTracker: React.FC<{ orderId: string }> = ({ orderId }) => {
  // Features:
  // - Display order status timeline
  // - Show current status
  // - Display estimated completion
};
```

**Molecules** (`frontend/src/components/molecules/`):
```typescript
// OrderCard.tsx
export const OrderCard: React.FC<{ order: Order; onUpdate: (id: string, status: OrderStatus) => void }> = ({ order, onUpdate }) => {
  // Display order summary card
};

// OrderStatusBadge.tsx
export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  // Display colored status badge
};
```

**Atoms** (use existing Button, Input from `frontend/src/components/atoms/`)

---

### **Phase 6: Delivery Management Frontend (F107)**
**Purpose**: Extend existing DeliveryManagementPanel with full functionality  
**Duration**: 2-3 hours  
**Priority**: HIGH

#### Frontend Components to Update/Create:

##### 6.1 Update Hooks (`frontend/src/hooks/useDeliveryApi.ts`)
**Current Status**: File exists, extend with full CRUD operations

```typescript
// Add missing functions:
export const useDeliveryApi = () => {
  // Existing functions...
  
  // Add:
  const createDelivery = async (request: CreateDeliveryRequest) => { /* ... */ };
  const assignDriver = async (deliveryId: string, driverId: string) => { /* ... */ };
  const updateDeliveryStatus = async (id: string, status: DeliveryStatus) => { /* ... */ };
  const getAvailableDrivers = async () => { /* ... */ };
  
  // Address management:
  const createAddress = async (request: CreateAddressRequest) => { /* ... */ };
  const getUserAddresses = async (userId: string) => { /* ... */ };
  const setDefaultAddress = async (userId: string, addressId: string) => { /* ... */ };
  
  return { /* all functions */ };
};
```

##### 6.2 Update/Create Components

**Organisms** (`frontend/src/components/organisms/`):
```typescript
// Update: DeliveryManagementPanel.tsx
const DeliveryManagementPanel: React.FC = () => {
  // Features to add/update:
  // - Create delivery from order
  // - Assign driver dropdown
  // - Update delivery status
  // - Track delivery progress
  // - Filter by status, driver
  // - View delivery details
};

// Create: DeliveryAddressManager.tsx
const DeliveryAddressManager: React.FC<{ userId: string }> = ({ userId }) => {
  // Features:
  // - List user addresses
  // - Add new address
  // - Edit address
  // - Set default address
  // - Delete address
};
```

**Molecules** (`frontend/src/components/molecules/`):
```typescript
// DeliveryCard.tsx
export const DeliveryCard: React.FC<{ delivery: Delivery }> = ({ delivery }) => {
  // Display delivery summary with status
};

// DriverSelector.tsx
export const DriverSelector: React.FC<{ onSelect: (driverId: string) => void }> = ({ onSelect }) => {
  // Dropdown to select available drivers
};

// AddressForm.tsx
export const AddressForm: React.FC<{ onSubmit: (address: CreateAddressRequest) => void }> = ({ onSubmit }) => {
  // Form for creating/editing addresses
};
```

---

### **Phase 7: Reservation Frontend (F108 + F109)**
**Purpose**: Customer booking + Manager approval UI  
**Duration**: 2-3 hours  
**Priority**: HIGH

#### Frontend Components to Update/Create:

##### 7.1 Update Hooks (`frontend/src/hooks/useReservationApi.ts`)
**Current Status**: File exists, extend with full functionality

```typescript
export const useReservationApi = () => {
  // Customer functions (F108):
  const createReservation = async (request: CreateReservationRequest) => { /* ... */ };
  const getCustomerReservations = async (customerId: string) => { /* ... */ };
  const cancelReservation = async (id: string) => { /* ... */ };
  
  // Manager functions (F109):
  const getAllReservations = async () => { /* ... */ };
  const getReservationsByStatus = async (status: ReservationStatus) => { /* ... */ };
  const getReservationsByDate = async (date: string) => { /* ... */ };
  const approveReservation = async (id: string, tableId: string) => { /* ... */ };
  const denyReservation = async (id: string) => { /* ... */ };
  
  // Table management:
  const getAllTables = async () => { /* ... */ };
  const getAvailableTables = async (date: string, time: string, partySize: number) => { /* ... */ };
  
  return { /* all functions */ };
};
```

##### 7.2 Update/Create Components

**Organisms** (`frontend/src/components/organisms/`):
```typescript
// Update: ReservationModal.tsx (Customer - F108)
const ReservationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  // Features to ensure:
  // - Date/time picker
  // - Party size selector
  // - Special requests textarea
  // - Submit reservation
  // - Validation
};

// Create: ReservationManagementPanel.tsx (Manager - F109)
const ReservationManagementPanel: React.FC = () => {
  // Features:
  // - Display all reservations in table
  // - Filter by status, date
  // - Approve/deny buttons
  // - Assign table to reservation
  // - View reservation details
  // - Update reservation
};

// Create: CustomerReservationList.tsx (Customer view - F108)
const CustomerReservationList: React.FC<{ customerId: string }> = ({ customerId }) => {
  // Features:
  // - Display customer's reservations
  // - Show status
  // - Cancel reservation option
};
```

**Molecules** (`frontend/src/components/molecules/`):
```typescript
// ReservationCard.tsx
export const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  // Display reservation summary with status
};

// TableSelector.tsx
export const TableSelector: React.FC<{ 
  date: string; 
  time: string; 
  partySize: number; 
  onSelect: (tableId: string) => void 
}> = ({ date, time, partySize, onSelect }) => {
  // Dropdown to select available tables
};

// ReservationStatusBadge.tsx
export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  // Display colored status badge
};
```

---

### **Phase 8: Frontend Testing**
**Purpose**: Ensure 80% test coverage for components  
**Duration**: 2-3 hours  
**Priority**: MEDIUM

#### Test Files to Create:
```
frontend/src/components/organisms/__tests__/
├── OrderManagementPanel.test.tsx
├── DeliveryManagementPanel.test.tsx
├── DeliveryAddressManager.test.tsx
├── ReservationManagementPanel.test.tsx
└── CustomerReservationList.test.tsx
```

**Pattern Reference**: `PaymentManagementPanel.test.tsx`

**Test Structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderManagementPanel from '../OrderManagementPanel';

vi.mock('../../../hooks/useOrderApi');

describe('OrderManagementPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders order list correctly', async () => { /* ... */ });
  it('filters orders by status', async () => { /* ... */ });
  it('updates order status on button click', async () => { /* ... */ });
  it('handles loading state', () => { /* ... */ });
  it('displays error message when API fails', () => { /* ... */ });
});
```

---

### **Phase 9: Integration & Documentation**
**Purpose**: Final integration, testing, and documentation updates  
**Duration**: 1-2 hours  
**Priority**: LOW (cleanup)

#### Tasks:
1. **Update API Documentation** (`design-plan-reference/07-overall-test-case.md`)
   - Add Order endpoints: `/api/orders`
   - Add Delivery endpoints: `/api/deliveries`, `/api/delivery-addresses`
   - Add Reservation endpoints: `/api/reservations`, `/api/tables`
   - Update API assertions section

2. **Update README.md**
   - Add F107 feature description
   - Add F108/F109 feature description
   - Update feature ownership table

3. **E2E Testing**
   - Test full Order → Delivery flow
   - Test full Reservation → Approval flow
   - Verify all API endpoints with Postman/cURL

4. **Code Review Checklist**
   - All DTOs follow naming convention
   - All services use @Transactional
   - All controllers use @CrossOrigin
   - All components follow atomic pattern
   - All tests pass with 80% coverage

---

## 📊 Progress Tracking

| Phase | Component | Status | Test Coverage | Notes |
|-------|-----------|--------|---------------|-------|
| 1 | Order Backend | ⏳ Not Started | - | Foundation for F107 |
| 2 | Delivery Backend | ⏳ Not Started | - | F107 core |
| 3 | Reservation Backend | ⏳ Not Started | - | F108 + F109 |
| 4 | Backend Tests | ⏳ Not Started | Target: 80% | JUnit 5 + Mockito |
| 5 | Order Frontend | ⏳ Not Started | - | Atomic pattern |
| 6 | Delivery Frontend | ⏳ Not Started | - | F107 UI |
| 7 | Reservation Frontend | ⏳ Not Started | - | F108 + F109 UI |
| 8 | Frontend Tests | ⏳ Not Started | Target: 80% | Vitest + RTL |
| 9 | Integration & Docs | ⏳ Not Started | - | Final cleanup |

---

## 🔍 Quality Checklist

### Backend Quality Standards
- [ ] All entities have proper JPA annotations
- [ ] All DTOs have validation annotations where appropriate
- [ ] All services use `@Service` and `@Transactional`
- [ ] All repositories extend `JpaRepository`
- [ ] All controllers use `@RestController` and `@CrossOrigin`
- [ ] API routes follow pattern: `/api/{resource}`
- [ ] Error handling with try-catch and ResponseEntity
- [ ] Logging statements for important operations
- [ ] Helper methods are private
- [ ] DTOs are used for all API boundaries (never expose entities)

### Frontend Quality Standards
- [ ] All types are defined in `types/` directory
- [ ] All API hooks use centralized state management
- [ ] Organisms use `export default`
- [ ] Molecules/Atoms use named exports
- [ ] Components follow atomic design hierarchy
- [ ] All hooks return `{ data, loading, error, ...operations }`
- [ ] Forms have proper validation
- [ ] Loading states are displayed
- [ ] Errors are user-friendly

### Testing Standards
- [ ] Unit tests for all service methods
- [ ] Mocking with `@Mock` and `@InjectMocks`
- [ ] Component tests for all organisms
- [ ] Mock hooks in component tests
- [ ] Test user interactions with `userEvent`
- [ ] Minimum 80% line coverage
- [ ] Minimum 80% branch coverage

---

## 🚀 Getting Started

### Step 1: Create Backend Structure
```bash
# Navigate to backend source directory
cd backend/src/main/java/com/lerestaurant/le_restaurant_backend

# Create DTO files (Phase 1)
touch dto/OrderDto.java
touch dto/OrderCreateRequestDto.java
touch dto/OrderUpdateRequestDto.java
touch dto/OrderItemDto.java
touch dto/OrderItemRequestDto.java

# Create Service (Phase 1)
touch service/OrderService.java

# Create Controller (Phase 1)
touch controller/OrderController.java
```

### Step 2: Implement Phase 1
Follow the detailed specifications in Phase 1 section above.

### Step 3: Test Backend
```bash
cd backend
./gradlew test
./gradlew jacocoTestReport
```

### Step 4: Continue with Phases 2-9
Proceed sequentially through remaining phases.

---

## 📞 Support & Questions

If any uncertainty arises during implementation:
1. Check existing code patterns (UserController, PaymentController, PaymentService)
2. Review naming conventions in `Actual-design-plan/coding-standards/naming-conventions-dictionary.md`
3. Verify API patterns in `design-plan-reference/04-api-specification.md`
4. Ask for clarification before proceeding

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-20  
**Status**: Ready for Implementation
