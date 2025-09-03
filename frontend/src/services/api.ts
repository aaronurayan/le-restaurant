import { MenuItem, Order, CartItem } from '../types';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8080/api';

// API 응답 타입 (향후 사용 예정)
// interface ApiResponse<T> {
//   data: T;
//   success: boolean;
//   message?: string;
// }

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
