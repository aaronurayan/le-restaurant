# 🎨 Frontend Design Specification - Le Restaurant

> **Document Type**: Frontend Engineering Specification  
> **Target Audience**: Senior Frontend Engineers, UI/UX Developers  
> **Focus Areas**: Component Architecture, Design System, Performance, Maintainability  
> **Technology Stack**: React 18+, TypeScript, Tailwind CSS, Vite  

---

## 🎯 Design Philosophy

### Core Principles
- **Component-First Architecture**: Reusable, composable components
- **Performance at Scale**: Lazy loading, code splitting, optimization
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile-First Design**: Responsive design with touch optimization
- **Design System Consistency**: Unified visual language across the application

### Visual Identity
- **Color Palette**: Warm, appetizing colors inspired by food
- **Typography**: Clean, readable fonts with proper hierarchy
- **Imagery**: High-quality food photography and illustrations
- **Animations**: Subtle, purposeful micro-interactions

---

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
/* Warm, appetizing primary colors */
--primary-50: #fef7ed;   /* Light cream */
--primary-100: #fdecd4;  /* Soft cream */
--primary-500: #f59e0b;  /* Warm orange */
--primary-600: #d97706;   /* Rich orange */
--primary-700: #b45309;   /* Deep orange */
--primary-900: #78350f;   /* Dark brown */
```

#### Secondary Colors
```css
/* Fresh, natural secondary colors */
--secondary-50: #f0fdf4;  /* Light green */
--secondary-100: #dcfce7; /* Soft green */
--secondary-500: #22c55e; /* Fresh green */
--secondary-600: #16a34a; /* Rich green */
--secondary-700: #15803d; /* Deep green */
```

#### Accent Colors
```css
/* Vibrant accent colors */
--accent-red: #ef4444;    /* Tomato red */
--accent-yellow: #fbbf24; /* Golden yellow */
--accent-purple: #a855f7; /* Rich purple */
--accent-blue: #3b82f6;   /* Ocean blue */
```

#### Neutral Colors
```css
/* Professional neutral colors */
--neutral-50: #fafafa;   /* Pure white */
--neutral-100: #f5f5f5;  /* Light gray */
--neutral-500: #737373;  /* Medium gray */
--neutral-700: #404040;  /* Dark gray */
--neutral-900: #171717;  /* Near black */
```

### Typography Scale

#### Font Families
```css
/* Modern, readable typography */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'Playfair Display', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Font Sizes
```css
/* Consistent type scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

#### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Spacing System

#### Spacing Scale
```css
/* Consistent spacing using 4px base unit */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius & Shadows

#### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Full circle */
```

#### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

---

## 🏗️ Component Architecture

### Component Hierarchy

```
src/
├── components/
│   ├── atoms/           # Basic building blocks
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Typography/
│   │   └── Icon/
│   ├── molecules/       # Simple combinations
│   │   ├── SearchBar/
│   │   ├── Card/
│   │   ├── Badge/
│   │   └── Modal/
│   ├── organisms/       # Complex components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   └── Sidebar/
│   ├── templates/       # Page layouts
│   │   ├── MainLayout/
│   │   ├── DashboardLayout/
│   │   └── AuthLayout/
│   └── pages/           # Page components
│       ├── Home/
│       ├── Menu/
│       ├── Order/
│       └── Admin/
├── hooks/               # Custom React hooks
├── services/            # API and business logic
├── store/               # State management
├── utils/               # Utility functions
├── types/               # TypeScript definitions
└── styles/              # Global styles and themes
```

### Component Design Patterns

#### 1. Compound Components
```tsx
// Example: MenuCard with compound components
<MenuCard>
  <MenuCard.Image src="/pizza.jpg" alt="Margherita Pizza" />
  <MenuCard.Content>
    <MenuCard.Title>Margherita Pizza</MenuCard.Title>
    <MenuCard.Description>Fresh mozzarella, basil, tomato sauce</MenuCard.Description>
    <MenuCard.Price>$18.99</MenuCard.Price>
  </MenuCard.Content>
  <MenuCard.Actions>
    <MenuCard.AddToCart />
    <MenuCard.Favorite />
  </MenuCard.Actions>
</MenuCard>
```

#### 2. Render Props Pattern
```tsx
// Example: Data fetching with render props
<DataFetcher url="/api/menu" fallback={<MenuSkeleton />}>
  {(data, loading, error) => (
    <MenuGrid items={data} loading={loading} error={error} />
  )}
</DataFetcher>
```

#### 3. Higher-Order Components
```tsx
// Example: Authentication wrapper
const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
};

export default withAuth(AdminDashboard);
```

---

## 🎭 Component Library

### Atomic Components

#### Button Component
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
};
```

#### Input Component
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  className = '',
}) => {
  const inputId = useId();
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error 
            ? 'border-accent-red focus:ring-accent-red' 
            : 'border-neutral-300 focus:border-transparent'
          }
          ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-accent-red">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
};
```

### Molecular Components

#### MenuCard Component
```tsx
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  dietaryTags: string[];
  preparationTime: number;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  onFavorite: (item: MenuItem) => void;
  isFavorited?: boolean;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onFavorite,
  isFavorited = false,
  className = '',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(item, quantity);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`
      bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300
      overflow-hidden border border-neutral-100 ${className}
    `}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Availability Badge */}
        {!item.isAvailable && (
          <div className="absolute top-3 right-3 bg-accent-red text-white px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => onFavorite(item)}
          className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <HeartIcon
            className={`w-5 h-5 ${isFavorited ? 'text-accent-red fill-current' : 'text-neutral-400'}`}
          />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
            {item.name}
          </h3>
          <span className="text-xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        {/* Dietary Tags */}
        {item.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Preparation Time */}
        <div className="flex items-center text-neutral-500 text-sm mb-4">
          <ClockIcon className="w-4 h-4 mr-1" />
          {item.preparationTime} min
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-neutral-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 hover:bg-neutral-100 transition-colors"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 hover:bg-neutral-100 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          <Button
            onClick={handleAddToCart}
            loading={isLoading}
            disabled={!item.isAvailable}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📱 Responsive Design

### Breakpoint System
```css
/* Tailwind CSS breakpoints */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

### Mobile-First Approach
```tsx
// Example: Responsive grid layout
const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <div className="
      grid gap-4
      grid-cols-1                    /* Mobile: 1 column */
      sm:grid-cols-2                 /* Small: 2 columns */
      md:grid-cols-3                 /* Medium: 3 columns */
      lg:grid-cols-4                 /* Large: 4 columns */
      xl:grid-cols-5                 /* XL: 5 columns */
      2xl:grid-cols-6                /* 2XL: 6 columns */
    ">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

### Touch Optimization
```tsx
// Example: Touch-friendly button sizing
const TouchButton: React.FC<TouchButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
        min-h-[44px] min-w-[44px]  /* iOS touch target minimum */
        px-4 py-2
        rounded-lg
        transition-all duration-200
        active:scale-95             /* Touch feedback */
        focus:outline-none focus:ring-2 focus:ring-primary-500
      "
    >
      {children}
    </button>
  );
};
```

---

## 🚀 Performance Optimization

### Code Splitting Strategy
```tsx
// Route-based code splitting
const HomePage = lazy(() => import('./pages/Home'));
const MenuPage = lazy(() => import('./pages/Menu'));
const OrderPage = lazy(() => import('./pages/Order'));
const AdminPage = lazy(() => import('./pages/Admin'));

// Component-based code splitting
const MenuCard = lazy(() => import('./components/MenuCard'));
const OrderSummary = lazy(() => import('./components/OrderSummary'));
```

### Image Optimization
```tsx
// Responsive images with multiple sizes
const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className }) => {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={`${src}?w=400&h=300&fit=crop&auto=format`}
      />
      <source
        media="(min-width: 768px)"
        srcSet={`${src}?w=300&h=225&fit=crop&auto=format`}
      />
      <img
        src={`${src}?w=200&h=150&fit=crop&auto=format`}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};
```

### Virtual Scrolling
```tsx
// Example: Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedMenuList: React.FC<VirtualizedMenuListProps> = ({ items }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <MenuCard item={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

---

## 🎨 Animation & Interactions

### Micro-Interactions
```tsx
// Example: Smooth hover effects
const AnimatedCard: React.FC<AnimatedCardProps> = ({ children }) => {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};
```

### Loading States
```tsx
// Example: Skeleton loading components
const MenuCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-200 rounded w-full" />
        <div className="h-3 bg-neutral-200 rounded w-2/3" />
        <div className="h-8 bg-neutral-200 rounded w-full" />
      </div>
    </div>
  );
};
```

### Page Transitions
```tsx
// Example: Page transition animations
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};
```

---

## ♿ Accessibility Features

### ARIA Labels & Roles
```tsx
// Example: Accessible form components
const AccessibleInput: React.FC<AccessibleInputProps> = ({
  label,
  error,
  helperText,
  ...props
}) => {
  const inputId = useId();
  const errorId = useId();
  const helperId = useId();
  
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      
      <input
        id={inputId}
        aria-describedby={`${helperText ? helperId : ''} ${error ? errorId : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      
      {helperText && (
        <div id={helperId} className="text-sm text-neutral-500">
          {helperText}
        </div>
      )}
      
      {error && (
        <div id={errorId} className="text-sm text-accent-red" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

### Keyboard Navigation
```tsx
// Example: Keyboard-accessible dropdown
const Dropdown: React.FC<DropdownProps> = ({ items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(items[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown}>
      {/* Dropdown implementation */}
    </div>
  );
};
```

---

## 📋 Testing Strategy

### Component Testing
```tsx
// Example: Component test with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCard } from './MenuCard';

describe('MenuCard', () => {
  const mockItem = {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, tomato sauce',
    price: 18.99,
    image: '/pizza.jpg',
    category: 'Pizza',
    isAvailable: true,
    dietaryTags: ['Vegetarian'],
    preparationTime: 20,
  };
  
  const mockOnAddToCart = jest.fn();
  const mockOnFavorite = jest.fn();
  
  it('renders menu item information correctly', () => {
    render(
      <MenuCard
        item={mockItem}
        onAddToCart={mockOnAddToCart}
        onFavorite={mockOnFavorite}
      />
    );
    
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$18.99')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
  });
  
  it('calls onAddToCart when add to cart button is clicked', () => {
    render(
      <MenuCard
        item={mockItem}
        onAddToCart={mockOnAddToCart}
        onFavorite={mockOnFavorite}
      />
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockItem, 1);
  });
});
```

### Visual Regression Testing
```tsx
// Example: Storybook stories for visual testing
import type { Meta, StoryObj } from '@storybook/react';
import { MenuCard } from './MenuCard';

const meta: Meta<typeof MenuCard> = {
  title: 'Components/MenuCard',
  component: MenuCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, basil, tomato sauce',
      price: 18.99,
      image: '/pizza.jpg',
      category: 'Pizza',
      isAvailable: true,
      dietaryTags: ['Vegetarian'],
      preparationTime: 20,
    },
    onAddToCart: () => {},
    onFavorite: () => {},
  },
};

export const OutOfStock: Story = {
  args: {
    ...Default.args,
    item: {
      ...Default.args.item!,
      isAvailable: false,
    },
  },
};
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation Setup
- [ ] Project initialization with Vite + React + TypeScript
- [ ] Tailwind CSS configuration and design system setup
- [ ] Component library foundation (atoms)
- [ ] Basic routing setup with React Router

### Phase 2: Core Components
- [ ] Molecular components (MenuCard, SearchBar, etc.)
- [ ] Organism components (Header, Footer, Navigation)
- [ ] Template layouts (MainLayout, DashboardLayout)
- [ ] Responsive design implementation

### Phase 3: Advanced Features
- [ ] State management setup (Context API or Redux)
- [ ] API integration with Axios
- [ ] Form handling and validation
- [ ] Error boundaries and error handling

### Phase 4: Performance & Testing
- [ ] Code splitting and lazy loading
- [ ] Image optimization and lazy loading
- [ ] Unit and integration tests
- [ ] Performance monitoring and optimization

### Phase 5: Polish & Deployment
- [ ] Accessibility improvements
- [ ] Animation and micro-interactions
- [ ] Storybook documentation
- [ ] Production build optimization

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Status**: Frontend Engineering Specification  
**Next Review**: 2025-02-03

하로 하로~! Frontend Design 문서 완성했어요~! 🎉

**주요 특징들:**

## 🎨 **식욕을 돋우는 디자인**
- **따뜻한 오렌지 계열**: 음식의 따뜻함을 표현
- **신선한 그린 계열**: 자연스럽고 건강한 느낌
- **풍부한 액센트 컬러**: 시각적 흥미 유발

## 🏗️ **체계적인 컴포넌트 아키텍처**
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **재사용 가능한 컴포넌트**: 일관된 디자인과 동작
- **TypeScript 지원**: 타입 안전성과 개발자 경험 향상

## 📱 **모바일 최적화**
- **Mobile-First Design**: 터치 친화적 인터페이스
- **반응형 레이아웃**: 모든 디바이스에서 최적화
- **성능 최적화**: 코드 스플리팅, 지연 로딩

## ♿ **접근성 우선**
- **WCAG 2.1 AA 준수**: 모든 사용자를 위한 접근성
- **키보드 네비게이션**: 마우스 없이도 사용 가능
- **스크린 리더 지원**: ARIA 라벨과 역할

이제 숙련된 Frontend 엔지니어가 체계적으로 개발할 수 있는 완벽한 가이드가 준비되었어요! 


