# Frontend View Explain Doc

## Overview

This document provides a comprehensive explanation of the frontend component architecture for the Le Restaurant application. The frontend is built using React with TypeScript, following Atomic Design principles for component organization and reusability.

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **State Persistence**: Zustand

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple component combinations
│   ├── organisms/      # Complex UI sections
│   └── templates/      # Page layout structures
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Mock data and constants
```

## Component Architecture

### Atomic Design Principles

The component structure follows Atomic Design methodology:

1. **Atoms** - Basic building blocks (buttons, badges, indicators)
2. **Molecules** - Simple combinations of atoms (menu cards, form inputs)
3. **Organisms** - Complex UI sections (headers, grids, sidebars)
4. **Templates** - Page layout structures (main layout, page wrappers)

---

## Atoms (Basic Building Blocks)

### Button Component
**File**: `components/atoms/Button.tsx`

**Purpose**: A reusable button component with multiple variants and states.

**Features**:
- Multiple variants: primary, secondary, outline, ghost
- Different sizes: sm, md, lg, xl
- Loading state with spinner
- Disabled state handling
- Full accessibility support

**Props**:
- `variant`: Button style variant
- `size`: Button size
- `loading`: Loading state boolean
- `disabled`: Disabled state boolean
- `children`: Button content

**Usage**:
```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Badge Component
**File**: `components/atoms/Badge.tsx`

**Purpose**: Small status indicators and labels for displaying tags and status information.

**Features**:
- Multiple color variants (primary, secondary, accent, neutral)
- Different sizes (sm, md)
- Rounded pill design
- Used for dietary tags, status indicators

**Props**:
- `children`: Badge content
- `variant`: Color variant
- `size`: Badge size
- `className`: Additional CSS classes

**Usage**:
```tsx
<Badge variant="secondary" size="sm">
  Vegetarian
</Badge>
```

### ApiStatusIndicator Component
**File**: `components/atoms/ApiStatusIndicator.tsx`

**Purpose**: Visual indicator showing real-time backend API connection status.

**Features**:
- Real-time API status monitoring using `useApiHealth` hook
- Color-coded status indicators:
  - Yellow: Checking backend connection
  - Green: Backend connected and healthy
  - Red: Backend disconnected or unhealthy
  - Gray: Unknown status
- Optional detailed status information display
- Base URL and health status details

**Props**:
- `showDetails`: Boolean to show detailed status information
- `className`: Additional CSS classes

**Usage**:
```tsx
<ApiStatusIndicator showDetails={false} />
```

---

## Molecules (Simple Component Combinations)

### MenuCard Component
**File**: `components/molecules/MenuCard.tsx`

**Purpose**: Individual menu item display card with interactive features for the restaurant menu.

**Features**:
- **Image Display**: Menu item image with hover zoom effect
- **Item Information**: Name, description, and price display
- **Dietary Tags**: Badge components for dietary restrictions (vegetarian, gluten-free, etc.)
- **Preparation Time**: Clock icon with preparation time in minutes
- **Favorite Toggle**: Heart icon for adding/removing favorites
- **Quantity Selector**: Plus/minus buttons for quantity adjustment
- **Add to Cart**: Button with loading state and availability check
- **Availability Status**: "Out of Stock" badge for unavailable items
- **Interactive States**: Hover effects, loading states, disabled states

**Props**:
- `item`: MenuItem object containing all menu item data
- `onAddToCart`: Callback function for adding items to cart
- `onFavorite`: Callback function for toggling favorite status
- `isFavorited`: Boolean indicating if item is favorited
- `className`: Additional CSS classes

**Internal State**:
- `quantity`: Number of items to add (default: 1)
- `isLoading`: Loading state during add to cart action

**Usage**:
```tsx
<MenuCard
  item={menuItem}
  onAddToCart={handleAddToCart}
  onFavorite={handleFavorite}
  isFavorited={favoritedItems.has(item.id)}
/>
```

---

## Organisms (Complex UI Sections)

### Header Component
**File**: `components/organisms/Header.tsx`

**Purpose**: Main navigation header with user authentication, cart access, and role-based features.

**Features**:
- **Restaurant Branding**: Logo and restaurant name display
- **Navigation Menu**: Menu, About, Contact links
- **Shopping Cart**: Cart button with item count badge and animation
- **User Authentication**: Login/logout functionality with user dropdown
- **API Status**: Real-time backend connection status indicator
- **Role-Based Access**: Admin/Manager panels (User Management, Payment Management)
- **Mobile Responsive**: Mobile menu toggle and responsive design
- **User Dropdown**: Profile information and role-specific actions

**Props**:
- `cartItemCount`: Number of items in cart
- `onCartClick`: Cart button click handler
- `onMenuToggle`: Mobile menu toggle handler

**Internal State**:
- `showAuthModal`: Authentication modal visibility
- `showUserManagement`: User management panel visibility
- `showPaymentManagement`: Payment management panel visibility

**Key Functionality**:
- Authentication state management using `useAuth` hook
- Cart item count display with animated badge
- User dropdown menu with role-based options
- Admin/Manager panel access controls

### MenuGrid Component
**File**: `components/organisms/MenuGrid.tsx`

**Purpose**: Responsive grid layout for displaying menu items with loading states and empty state handling.

**Features**:
- **Responsive Grid**: 1-4 columns based on screen size (mobile to desktop)
- **Loading Skeletons**: Animated placeholder cards during data loading
- **Empty State**: User-friendly message when no items are found
- **Smooth Animations**: Fade-in animations for menu cards
- **Menu Item Rendering**: Renders individual MenuCard components

**Props**:
- `items`: Array of MenuItem objects to display
- `onAddToCart`: Callback function for adding items to cart
- `onFavorite`: Callback function for toggling favorites
- `favoritedItems`: Set of favorited item IDs
- `loading`: Boolean indicating loading state

**Internal Components**:
- `MenuCardSkeleton`: Loading state placeholder component

**Usage**:
```tsx
<MenuGrid
  items={filteredItems}
  onAddToCart={onAddToCart}
  onFavorite={onFavorite}
  favoritedItems={favoritedItems}
  loading={loading}
/>
```

### CartSidebar Component
**File**: `components/organisms/CartSidebar.tsx`

**Purpose**: Shopping cart sidebar with comprehensive item management and checkout functionality.

**Features**:
- **Slide-in Design**: Fixed position sidebar that slides in from the right
- **Cart Item Display**: Image, name, price, and quantity for each item
- **Quantity Controls**: Plus/minus buttons for quantity adjustment
- **Item Removal**: Remove individual items from cart
- **Price Calculation**: Subtotal, tax calculation, and total price
- **Empty State**: Friendly message when cart is empty
- **Checkout Button**: Proceed to checkout functionality
- **Special Instructions**: Display any special notes for items

**Props**:
- `isOpen`: Boolean controlling sidebar visibility
- `onClose`: Function to close the sidebar
- `cartItems`: Array of cart items
- `cartTotal`: Total cart value before tax
- `onUpdateQuantity`: Function to update item quantity
- `onRemoveItem`: Function to remove items from cart
- `onCheckout`: Function to proceed to checkout

**Layout Structure**:
- Header with title and close button
- Scrollable items list
- Footer with price breakdown and checkout button

### CategoryFilter Component
**File**: `components/organisms/CategoryFilter.tsx`

**Purpose**: Horizontal category filtering system for menu items.

**Features**:
- **Horizontal Scroll**: Scrollable category buttons for mobile
- **Active State**: Visual highlighting of selected category
- **All Items Option**: "All Items" button to show all menu items
- **Item Count**: Display number of items in each category
- **Smooth Transitions**: Animated state changes
- **Sticky Positioning**: Stays visible while scrolling

**Props**:
- `categories`: Array of MenuCategory objects
- `selectedCategory`: Currently selected category ID or null
- `onCategorySelect`: Function to handle category selection

**Usage**:
```tsx
<CategoryFilter
  categories={mockCategories}
  selectedCategory={selectedCategory}
  onCategorySelect={handleCategorySelect}
/>
```

### Hero Component
**File**: `components/organisms/Hero.tsx`

**Purpose**: Main landing section with compelling restaurant branding and call-to-action elements.

**Features**:
- **Restaurant Branding**: Large title with gradient text effect
- **Star Rating**: 4.9/5 rating display with star icons
- **Compelling Copy**: Restaurant description and value proposition
- **Call-to-Action Buttons**: "Order Now" and "View Menu" buttons
- **Statistics Display**: Delivery time, customer count, menu items count
- **Hero Image**: High-quality restaurant food image
- **Floating Cards**: Animated feature highlights (Fresh Ingredients, Fast Delivery)
- **Background Decorations**: Gradient overlays for visual appeal

**Props**:
- `onOrderNow`: Function to handle "Order Now" button click

**Layout Structure**:
- Two-column layout (text content + image)
- Responsive design for mobile and desktop
- Animated floating elements

### OrderStatus Component
**File**: `components/organisms/OrderStatus.tsx`

**Purpose**: Comprehensive order tracking and status display system.

**Features**:
- **Status Visualization**: Color-coded status indicators with icons
- **Order Information**: Order number, date, and customer details
- **Status Descriptions**: Clear descriptions for each order status
- **Estimated Time**: Delivery/pickup time estimates
- **Order Items**: Detailed breakdown of ordered items
- **Price Summary**: Total cost display
- **Status Icons**: Visual indicators for each status type

**Order Statuses**:
- PENDING: Order received
- CONFIRMED: Order confirmed by restaurant
- IN_PREPARATION: Being prepared by chefs
- READY_FOR_PICKUP: Ready for customer pickup
- OUT_FOR_DELIVERY: On the way to customer
- COMPLETED: Order completed
- CANCELLED: Order cancelled

**Props**:
- `order`: Order object containing all order information

### AuthModal Component
**File**: `components/organisms/AuthModal.tsx`

**Purpose**: User authentication modal supporting both login and registration.

**Features**:
- **Dual Mode**: Toggle between login and registration forms
- **Form Validation**: Client-side validation for all fields
- **Password Visibility**: Toggle password visibility with eye icon
- **Error Handling**: Display validation errors and API errors
- **Role Selection**: Role-based registration (Customer/Manager/Admin)
- **Responsive Design**: Mobile-friendly modal layout
- **Form Reset**: Clear form when switching between modes

**Props**:
- `isOpen`: Boolean controlling modal visibility
- `onClose`: Function to close the modal

**Internal State**:
- `isLogin`: Boolean toggling between login/register modes
- `formData`: Form input data
- `showPassword`: Password visibility toggle
- `errors`: Form validation errors

**Form Fields**:
- Email (required, validated)
- Password (required, min 6 characters)
- First Name (registration only)
- Last Name (registration only)
- Phone Number (registration only)
- Role (registration only)

### UserManagementPanel Component
**File**: `components/organisms/UserManagementPanel.tsx`

**Purpose**: Comprehensive user management system for Admin and Manager roles.

**Features**:
- **User List**: Table display of all users with detailed information
- **Search Functionality**: Search by name, email, or phone number
- **Filtering**: Filter by role (Admin/Manager/Customer) and status (Active/Inactive/Suspended)
- **User Creation**: Add new users with form validation
- **User Editing**: Edit existing user information
- **User Deletion**: Remove users with confirmation
- **Role Icons**: Visual indicators for different user roles
- **Status Badges**: Color-coded status indicators
- **Last Login**: Display last login information
- **Pagination**: Handle large user lists efficiently

**Props**:
- `isOpen`: Boolean controlling panel visibility
- `onClose`: Function to close the panel

**Internal State**:
- `users`: Array of all users
- `filteredUsers`: Filtered user list based on search/filters
- `searchTerm`: Search input value
- `roleFilter`: Selected role filter
- `statusFilter`: Selected status filter
- `showCreateModal`: Create user modal visibility
- `showEditModal`: Edit user modal visibility
- `selectedUser`: Currently selected user for editing

**User Roles**:
- ADMIN: Full system access (red shield icon)
- MANAGER: Management access (blue user-check icon)
- CUSTOMER: Basic access (green users icon)

### PaymentManagementPanel Component
**File**: `components/organisms/PaymentManagementPanel.tsx`

**Purpose**: Comprehensive payment management system for Admin and Manager roles.

**Features**:
- **Payment List**: Table display of all payments with detailed information
- **Statistics Cards**: Total revenue, completed payments, pending payments
- **Search Functionality**: Search by customer name, email, transaction ID, or order ID
- **Filtering**: Filter by payment status and payment method
- **Status Management**: Update payment statuses
- **Refund Processing**: Process refunds for completed payments
- **Payment Details**: View detailed payment information
- **Method Icons**: Visual indicators for different payment methods
- **Status Badges**: Color-coded status indicators
- **Currency Formatting**: Proper currency display

**Props**:
- `isOpen`: Boolean controlling panel visibility
- `onClose`: Function to close the panel

**Payment Statuses**:
- COMPLETED: Payment successfully processed
- PROCESSING: Payment being processed
- PENDING: Payment awaiting processing
- FAILED: Payment failed
- REFUNDED: Payment refunded
- CANCELLED: Payment cancelled

**Payment Methods**:
- CREDIT_CARD: Credit card payments
- DEBIT_CARD: Debit card payments
- CASH: Cash payments
- BANK_TRANSFER: Bank transfer payments
- DIGITAL_WALLET: Digital wallet payments

### UserFormModal Component
**File**: `components/organisms/UserFormModal.tsx`

**Purpose**: Modal form for creating and editing users in the management system.

**Features**:
- **Dual Mode**: Create new users or edit existing users
- **Form Validation**: Comprehensive client-side validation
- **Role Selection**: Dropdown for user role selection with icons
- **Status Selection**: User status management
- **Password Handling**: Required for creation, optional for editing
- **Error Display**: Clear error messages for validation failures
- **Loading States**: Loading indicators during form submission

**Props**:
- `isOpen`: Boolean controlling modal visibility
- `onClose`: Function to close the modal
- `onSubmit`: Function to handle form submission
- `user`: User object for editing (null for creation)
- `mode`: "create" or "edit" mode

**Form Fields**:
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Password (required for creation only)
- Phone Number (required)
- Role (dropdown with icons)
- Status (dropdown)

### NotificationContainer Component
**File**: `components/organisms/NotificationContainer.tsx`

**Purpose**: Global notification system for displaying toast messages throughout the application.

**Features**:
- **Toast Notifications**: Slide-up animated notifications
- **Multiple Types**: Success, error, info, and warning notifications
- **Auto-dismiss**: Automatic removal after display time
- **Manual Dismiss**: Click to close notifications
- **Icon Indicators**: Visual icons for each notification type
- **Color Coding**: Different colors for different notification types
- **Positioning**: Fixed top-right positioning
- **Stacking**: Multiple notifications can be displayed

**Notification Types**:
- Success: Green color with check circle icon
- Error: Red color with alert circle icon
- Info: Blue color with info icon
- Warning: Yellow color with alert triangle icon

**Integration**: Uses the `toast` utility from `utils/notifications.ts`

---

## Templates (Page Layout Structures)

### MainLayout Component
**File**: `components/templates/MainLayout.tsx`

**Purpose**: Main page layout wrapper providing consistent structure across all pages.

**Features**:
- **Header Integration**: Includes the main Header component
- **Main Content Area**: Flexible content area for page-specific components
- **Footer Section**: Comprehensive footer with restaurant information
- **Responsive Design**: Mobile-first responsive layout
- **Cart Integration**: Passes cart-related props to header
- **Background Styling**: Consistent background and spacing

**Footer Features**:
- Restaurant branding and description
- Quick navigation links (Menu, About, Contact, Careers)
- Contact information (phone, email, address, hours)
- Social media links
- Copyright information

**Props**:
- `children`: React node containing page content
- `cartItemCount`: Number of items in cart for header display
- `onCartClick`: Function to handle cart button clicks

**Layout Structure**:
- Header (sticky positioning)
- Main content area (flexible height)
- Footer (fixed at bottom)

**Usage**:
```tsx
<MainLayout cartItemCount={cartItemCount} onCartClick={handleCartClick}>
  <Home onAddToCart={handleAddToCart} />
</MainLayout>
```

---

## Context Providers

### AuthContext
**File**: `contexts/AuthContext.tsx`

**Purpose**: Global authentication state management.

**Features**:
- User login/logout
- User registration
- Profile updates
- Session management
- Role-based access control
- Local storage persistence

**State**:
- `user`: Current user object
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `session`: Session information

**Methods**:
- `login(credentials)`: User login
- `logout()`: User logout
- `register(userData)`: User registration
- `updateProfile(userData)`: Profile updates

---

## Custom Hooks

### useCart Hook
**File**: `hooks/useCart.ts`

**Purpose**: Shopping cart state management.

**Features**:
- Add items to cart
- Remove items from cart
- Update item quantities
- Clear entire cart
- Calculate totals
- Special instructions support

**Returns**:
- `cartItems`: Array of cart items
- `cartTotal`: Total cart value
- `cartItemCount`: Total item count
- `addToCart`: Add item function
- `removeFromCart`: Remove item function
- `updateQuantity`: Update quantity function
- `clearCart`: Clear cart function

### useApi Hook
**File**: `hooks/useApi.ts`

**Purpose**: API request management with loading states and error handling.

**Features**:
- Request/response interceptors
- Loading state management
- Error handling
- Automatic retry logic
- Request cancellation

---

## Pages

### Home Page
**File**: `pages/Home.tsx`

**Purpose**: Main landing page providing the complete restaurant experience with menu browsing and ordering functionality.

**Features**:
- **Hero Section**: Compelling landing area with call-to-action
- **Category Filtering**: Interactive category selection for menu items
- **Menu Grid Display**: Responsive grid showing all available menu items
- **Order Status Tracking**: Sample order status display for demonstration
- **Cart Integration**: Seamless cart functionality throughout the page
- **Favorite System**: Users can favorite/unfavorite menu items
- **Loading States**: Smooth loading indicators during category changes
- **Scroll Navigation**: Smooth scrolling to menu section

**Page Sections**:
1. **Hero Section**: Restaurant branding and main call-to-action
2. **Menu Section**: Category filters and menu grid
3. **Order Status Section**: Sample order tracking display

**Props**:
- `onAddToCart`: Function to handle adding items to cart
- `favoritedItems`: Set of favorited item IDs
- `onFavorite`: Function to handle favorite toggle

**Internal State**:
- `selectedCategory`: Currently selected category ID or null
- `loading`: Loading state during category changes

**Key Functionality**:
- Category filtering with loading simulation
- Menu item display with interactive features
- Smooth scrolling navigation
- Responsive design for all screen sizes

**Usage**:
```tsx
<Home
  onAddToCart={handleAddToCart}
  favoritedItems={favoritedItems}
  onFavorite={handleFavorite}
/>
```

---

## Type Definitions

### Core Types
**File**: `types/index.ts`

**Key Interfaces**:
- **`MenuItem`**: Complete menu item structure with all properties
  - `id`, `categoryId`, `name`, `description`, `price`, `image`
  - `isAvailable`, `dietaryTags`, `preparationTime`, `allergens`
- **`MenuCategory`**: Category information for menu organization
  - `id`, `name`, `description`, `displayOrder`, `isActive`, `itemCount`
- **`CartItem`**: Shopping cart item with quantity and pricing
  - `id`, `menuItem`, `quantity`, `specialInstructions`, `subtotal`
- **`Order`**: Complete order information and tracking
  - `id`, `orderNumber`, `customerId`, `customerInfo`, `status`
  - `orderDate`, `items`, `pricing`, `deliveryInfo`
- **`Customer`**: Customer profile and preferences
  - `id`, `name`, `email`, `phone`, `preferences`

**Order Status Types**:
- `OrderStatus`: PENDING, CONFIRMED, IN_PREPARATION, READY_FOR_PICKUP, OUT_FOR_DELIVERY, COMPLETED, CANCELLED

### Authentication Types
**File**: `types/auth.ts`

**Key Interfaces**:
- **`AuthContextType`**: Complete context interface for authentication
  - User state, authentication methods, loading states
- **`AuthState`**: Authentication state structure
  - `user`, `session`, `isAuthenticated`, `isLoading`
- **`LoginRequest`**: Login form data structure
  - `email`, `password`
- **`CreateUserRequest`**: User registration data
  - `email`, `password`, `firstName`, `lastName`, `phoneNumber`, `role`

### User Types
**File**: `types/user.ts`

**Key Interfaces**:
- **`User`**: Complete user object structure
  - `id`, `email`, `passwordHash`, `phoneNumber`
  - `firstName`, `lastName`, `role`, `status`
  - `createdAt`, `updatedAt`, `lastLogin`
- **`UpdateUserRequest`**: User profile update data
  - All user fields except password (optional)
- **`UserRole`**: User role enumeration
  - ADMIN, MANAGER, CUSTOMER
- **`UserStatus`**: User status enumeration
  - ACTIVE, INACTIVE, SUSPENDED

### Payment Types
**File**: `types/payment.ts`

**Key Interfaces**:
- **`Payment`**: Payment transaction structure
  - `id`, `orderId`, `amount`, `currency`, `method`, `status`
  - `transactionId`, `processedAt`, `createdAt`, `updatedAt`
  - `customerEmail`, `customerName`
- **`PaymentMethod`**: Payment method enumeration
  - CREDIT_CARD, DEBIT_CARD, CASH, BANK_TRANSFER, DIGITAL_WALLET
- **`PaymentStatus`**: Payment status enumeration
  - COMPLETED, PROCESSING, PENDING, FAILED, REFUNDED, CANCELLED

### Session Types
**File**: `types/session.ts`

**Key Interfaces**:
- **`Session`**: User session information
  - `token`, `expiresAt`, `user`
- **`SessionData`**: Session data structure
  - Complete session information for storage

---

## Services

### API Service
**File**: `services/api.ts`

**Purpose**: Centralized API communication layer for all backend interactions.

**Features**:
- **Axios Configuration**: Pre-configured HTTP client with base settings
- **Request/Response Interceptors**: Automatic request/response processing
- **Error Handling**: Centralized error handling and logging
- **Base URL Configuration**: Environment-based API endpoint configuration
- **Authentication Headers**: Automatic token injection for authenticated requests
- **Request Timeout**: Configurable timeout settings
- **Retry Logic**: Automatic retry for failed requests

**Integration**: Used by custom hooks and components for all API calls

---

## Utilities

### Notifications
**File**: `utils/notifications.ts`

**Purpose**: Global notification system for user feedback and alerts.

**Features**:
- **Success Notifications**: Green toast notifications for successful actions
- **Error Notifications**: Red toast notifications for errors and failures
- **Info Notifications**: Blue toast notifications for informational messages
- **Warning Notifications**: Yellow toast notifications for warnings
- **Auto-dismiss**: Configurable auto-dismiss timing
- **Manual Dismiss**: Click-to-dismiss functionality
- **Queue Management**: Multiple notification support

**Usage**:
```tsx
import { toast } from '../utils/notifications';

toast.success('Item added to cart!');
toast.error('Failed to add item');
toast.info('Order status updated');
toast.warning('Low inventory');
```

---

## Data Management

### Mock Data
**File**: `data/mockData.ts`

**Purpose**: Development and testing data for frontend development and demonstration.

**Contains**:
- **Mock Menu Items**: Sample menu items with all required properties
- **Mock Categories**: Menu categories for filtering and organization
- **Mock Orders**: Sample orders for order status demonstration
- **Mock Users**: Test users for authentication and management features
- **Mock Payments**: Sample payment data for payment management

**Usage**: Used throughout the application for development and testing when backend is not available

---

## Data Flow Architecture

### Component Hierarchy
```
App.tsx
├── AuthProvider (Context)
├── MainLayout
│   ├── Header
│   │   ├── ApiStatusIndicator
│   │   ├── AuthModal
│   │   ├── UserManagementPanel
│   │   └── PaymentManagementPanel
│   └── Home
│       ├── Hero
│       ├── CategoryFilter
│       ├── MenuGrid
│       │   └── MenuCard (multiple)
│       └── OrderStatus
└── CartSidebar
```

### State Management Flow
1. **Global State**: AuthContext manages authentication state
2. **Local State**: Components manage their own UI state
3. **Custom Hooks**: useCart manages cart state, useApi manages API calls
4. **Props Drilling**: Data flows down through component props
5. **Callback Functions**: Events bubble up through callback functions

### Data Flow Examples
- **Adding to Cart**: MenuCard → Home → App → CartSidebar
- **User Authentication**: AuthModal → AuthContext → Header
- **Menu Filtering**: CategoryFilter → Home → MenuGrid → MenuCard
- **Order Management**: UserManagementPanel → API Service → Backend

---

## Key Features

### 1. Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions

### 2. State Management
- Context API for global state
- Custom hooks for local state
- Persistent authentication state

### 3. User Experience
- Loading states and skeletons
- Smooth animations and transitions
- Error handling and validation
- Accessibility support

### 4. Role-Based Access
- Admin/Manager/Customer roles
- Conditional feature display
- Protected routes and components

### 5. Shopping Cart
- Persistent cart state
- Quantity management
- Price calculations
- Special instructions

### 6. Authentication
- Login/Register functionality
- Session management
- Profile updates
- Role-based permissions

---

## Development Guidelines

### Component Creation
1. Follow Atomic Design principles
2. Use TypeScript for type safety
3. Implement proper prop interfaces
4. Add loading and error states
5. Ensure accessibility compliance

### State Management
1. Use Context for global state
2. Use custom hooks for complex logic
3. Keep component state minimal
4. Implement proper error handling

### Styling
1. Use Tailwind CSS classes
2. Follow design system patterns
3. Ensure responsive design
4. Maintain consistency

### Testing
1. Write unit tests for components
2. Test user interactions
3. Test error scenarios
4. Test accessibility features

---

## Getting Started for New Interns

### Prerequisites
- React and TypeScript knowledge
- Understanding of component-based architecture
- Familiarity with modern JavaScript features

### First Steps
1. Review the component structure
2. Understand the data flow
3. Examine the type definitions
4. Study the context providers
5. Practice with the custom hooks

### Common Tasks
1. Adding new menu items
2. Creating new components
3. Implementing new features
4. Fixing bugs and issues
5. Improving user experience

### Best Practices
1. Follow the established patterns
2. Maintain type safety
3. Write clean, readable code
4. Test your changes
5. Document new features

---

This documentation provides a comprehensive overview of the frontend architecture. For specific implementation details, refer to the individual component files and their inline documentation.
