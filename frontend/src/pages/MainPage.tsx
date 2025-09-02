import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { CartItem, Order, CreateOrderRequest } from '../types/order';
import { CreatePaymentRequest } from '../types/payment';
import { MenuItem } from '../types';
import AuthPanel from '../components/organisms/AuthPanel';
import CartPanel from '../components/organisms/CartPanel';
import PaymentForm from '../components/organisms/PaymentForm';
import UserManagementPanel from '../components/organisms/UserManagementPanel';
import { useUserApi } from '../hooks/useUserApi';
import { menuApi } from '../services/api';

const MainPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders' | 'users'>('menu');

  const { users, loading, error, createUser, getAllUsers } = useUserApi();

  // 임시 사용자 ID (보안 무시)
  const [tempUserId, setTempUserId] = useState(1);

  useEffect(() => {
    fetchMenuItems();
    if (currentUser?.role === UserRole.MANAGER || currentUser?.role === UserRole.ADMIN) {
      getAllUsers();
    }
  }, [currentUser, getAllUsers]);

  const fetchMenuItems = async () => {
    try {
      const items = await menuApi.getAllItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // 보안 무시 - 임시 로그인 로직
    const user: User = {
      id: tempUserId,
      email,
      firstName: '사용자',
      lastName: '이름',
      phoneNumber: '010-0000-0000',
      role: UserRole.CUSTOMER,
      status: 'ACTIVE' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(user);
    setTempUserId(prev => prev + 1);
  };

  const handleRegister = async (userData: any) => {
    try {
      const newUser = await createUser(userData);
      setCurrentUser(newUser);
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  };

  const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + quantity, subtotal: item.unitPrice * (item.quantity + quantity) }
          : item
      ));
    } else {
      const newCartItem: CartItem = {
        id: Date.now(),
        menuItemId: menuItem.id,
        menuItemName: menuItem.name,
        quantity,
        unitPrice: menuItem.price,
        subtotal: menuItem.price * quantity
      };
      setCartItems(prev => [...prev, newCartItem]);
    }
  };

  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, subtotal: item.unitPrice * quantity }
        : item
    ));
  };

  const removeCartItem = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCreateOrder = async (orderData: CreateOrderRequest) => {
    // 임시 주문 생성 (보안 무시)
    const newOrder: Order = {
      id: Date.now(),
      orderNumber: `ORD${Date.now()}`,
      userId: orderData.userId,
      orderItems: orderData.orderItems.map((item, index) => ({
        id: index + 1,
        menuItemId: item.menuItemId,
        menuItemName: cartItems.find(cartItem => cartItem.menuItemId === item.menuItemId)?.menuItemName || '',
        quantity: item.quantity,
        unitPrice: cartItems.find(cartItem => cartItem.menuItemId === item.menuItemId)?.unitPrice || 0,
        subtotal: (cartItems.find(cartItem => cartItem.menuItemId === item.menuItemId)?.unitPrice || 0) * item.quantity,
        specialInstructions: item.specialInstructions
      })),
      totalAmount: cartItems.reduce((sum, item) => sum + item.subtotal, 0),
      status: 'PENDING' as any,
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentOrder(newOrder);
    setShowPayment(true);
    setActiveTab('cart');
  };

  const handlePaymentSubmit = async (paymentData: CreatePaymentRequest) => {
    // 임시 결제 처리 (보안 무시)
    alert('결제가 완료되었습니다! 주문 번호: ' + currentOrder?.orderNumber);
    
    // 장바구니 비우기
    setCartItems([]);
    setShowPayment(false);
    setCurrentOrder(null);
    setActiveTab('orders');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setShowPayment(false);
    setCurrentOrder(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Le Restaurant</h1>
            <p className="text-gray-600">맛있는 음식을 주문하세요</p>
          </div>
          <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Le Restaurant</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                안녕하세요, {currentUser.firstName} {currentUser.lastName}님
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'menu' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              메뉴
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'cart' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              장바구니 ({cartItems.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'orders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              주문 내역
            </button>
            {(currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.ADMIN) && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                사용자 관리
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">메뉴</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        ₩{item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        장바구니에 추가
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            {showPayment && currentOrder ? (
              <PaymentForm
                orderId={currentOrder.id}
                amount={currentOrder.totalAmount}
                onPaymentSubmit={handlePaymentSubmit}
                onCancel={() => setShowPayment(false)}
              />
            ) : (
              <CartPanel
                cartItems={cartItems}
                onUpdateQuantity={updateCartItemQuantity}
                onRemoveItem={removeCartItem}
                onCreateOrder={handleCreateOrder}
                currentUserId={currentUser.id}
              />
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주문 내역</h2>
            {currentOrder ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  주문 번호: {currentOrder.orderNumber}
                </h3>
                <div className="space-y-2">
                  {currentOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.menuItemName} × {item.quantity}</span>
                      <span>₩{item.subtotal.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 font-medium">
                    <div className="flex justify-between">
                      <span>총 금액:</span>
                      <span>₩{currentOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">주문 내역이 없습니다.</p>
            )}
          </div>
        )}

        {activeTab === 'users' && (currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.ADMIN) && (
          <UserManagementPanel />
        )}
      </main>
    </div>
  );
};

export default MainPage;
