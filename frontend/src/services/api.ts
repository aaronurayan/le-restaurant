import { MenuItem, MenuCategory, Order, CartItem } from '../types';
import { User, CreateUserRequest, UpdateUserRequest, UserSearchParams } from '../types/user';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// API 응답 타입
// API response type
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 에러 처리
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP 요청 헬퍼 함수
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 메뉴 관련 API
export const menuApi = {
  // 모든 메뉴 아이템 조회
  getAllItems: (): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>('/menu/items'),
  
  // 카테고리별 메뉴 조회
  getItemsByCategory: (category: string): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>(`/menu/items/category/${category}`),
  
  // 메뉴 아이템 상세 조회
  getItemById: (id: string): Promise<MenuItem> => 
    apiRequest<MenuItem>(`/menu/items/${id}`),
  
  // 모든 카테고리 조회
  getAllCategories: (): Promise<string[]> => 
    apiRequest<string[]>('/menu/categories'),
  
  // 메뉴 검색
  searchItems: (keyword: string): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>(`/menu/search?keyword=${encodeURIComponent(keyword)}`),
  
  // 백엔드 연결 테스트
  testConnection: (): Promise<string> => 
    apiRequest<string>('/menu/test'),
};

// 주문 관련 API (향후 확장)
export const orderApi = {
  // 주문 생성
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>): Promise<Order> => 
    apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  // 주문 상태 조회
  getOrderStatus: (orderId: string): Promise<Order> => 
    apiRequest<Order>(`/orders/${orderId}/status`),
};

// 장바구니 관련 API (향후 확장)
export const cartApi = {
  // 장바구니 아이템 추가
  addToCart: (item: CartItem): Promise<CartItem> => 
    apiRequest<CartItem>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  
  // 장바구니 조회
  getCart: (): Promise<CartItem[]> => 
    apiRequest<CartItem[]>('/cart/items'),
  
  // 장바구니 아이템 수정
  updateCartItem: (itemId: string, quantity: number): Promise<CartItem> => 
    apiRequest<CartItem>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  
  // 장바구니 아이템 삭제
  removeFromCart: (itemId: string): Promise<void> => 
    apiRequest<void>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
};

// 사용자 관리 API
export const userApi: {
  getAllUsers: () => Promise<User[]>;
  getUserById: (id: number) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
  createUser: (userData: CreateUserRequest) => Promise<User>;
  updateUser: (id: number, userData: UpdateUserRequest) => Promise<User>;
  updateUserStatus: (id: number, status: string) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  getUsersByRole: (role: string) => Promise<User[]>;
  getActiveUsers: () => Promise<User[]>;
  searchUsersByName: (keyword: string) => Promise<User[]>;
} = {
  // 모든 사용자 조회 (매니저용)
  getAllUsers: (): Promise<User[]> => 
    apiRequest<User[]>('/users'),
  
  // ID로 사용자 조회
  getUserById: (id: number): Promise<User> => 
    apiRequest<User>(`/users/${id}`),
  
  // 이메일로 사용자 조회
  getUserByEmail: (email: string): Promise<User> => 
    apiRequest<User>(`/users/email/${email}`),
  
  // 사용자 생성
  createUser: (userData: CreateUserRequest): Promise<User> => 
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // 사용자 정보 업데이트
  updateUser: (id: number, userData: UpdateUserRequest): Promise<User> => 
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // 사용자 상태 변경
  updateUserStatus: (id: number, status: string): Promise<User> => 
    apiRequest<User>(`/users/${id}/status?status=${status}`),
  
  // 사용자 삭제 (소프트 삭제)
  deleteUser: (id: number): Promise<void> => 
    apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
  
  // 역할별 사용자 조회
  getUsersByRole: (role: string): Promise<User[]> => 
    apiRequest<User[]>(`/users/role/${role}`),
  
  // 활성 사용자만 조회
  getActiveUsers: (): Promise<User[]> => 
    apiRequest<User[]>('/users/active'),
  
  // 이름으로 사용자 검색
  searchUsersByName: (keyword: string): Promise<User[]> => 
    apiRequest<User[]>(`/users/search?keyword=${encodeURIComponent(keyword)}`),
};

// API 상태 확인
export const apiHealth = {
  // 백엔드 서버 상태 확인
  checkBackendStatus: async (): Promise<boolean> => {
    try {
      await menuApi.testConnection();
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  },
  
  // API 기본 URL 반환
  getBaseUrl: (): string => API_BASE_URL,
};

export default {
  menu: menuApi,
  order: orderApi,
  cart: cartApi,
  health: apiHealth,
};
