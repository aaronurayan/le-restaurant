import { MenuItem, Order, CartItem } from '../types';

// =============================================================================
// API TODO LIST - 30년차 전문가 피드백 기반 개선 사항
// =============================================================================

// TODO: [CRITICAL] 환경 설정 개선
// - API_BASE_URL을 환경변수로 관리 (process.env.REACT_APP_API_URL)
// - 개발/스테이징/프로덕션 환경별 URL 설정
// - .env 파일 생성 및 환경별 설정

// TODO: [HIGH] API 응답 표준화
// - ApiResponse<T> 인터페이스 활성화 및 표준화
// - 요청 ID, 타임스탬프, 성공/실패 상태 포함
// - 일관된 에러 응답 형식 정의

// TODO: [HIGH] Fallback 전략 구현
// - API 실패 시 Mock 데이터 자동 사용
// - 네트워크 오프라인 상태 감지 및 처리
// - 사용자에게 적절한 피드백 제공

// TODO: [MEDIUM] 에러 처리 개선
// - HTTP 상태 코드별 세분화된 에러 처리
// - 재시도 로직 구현 (exponential backoff)
// - 에러 로깅 및 모니터링 시스템 구축

// TODO: [MEDIUM] 성능 최적화
// - API 응답 캐싱 시스템 구현
// - 요청 중복 제거 (debouncing)
// - 로딩 상태 세분화 (개별 API별 로딩 상태)

// TODO: [MEDIUM] 보안 강화
// - JWT 토큰 기반 인증 시스템
// - API 요청 헤더에 인증 토큰 자동 추가
// - 민감한 데이터 암호화

// TODO: [LOW] API 문서화
// - OpenAPI/Swagger 스펙 생성
// - API 엔드포인트별 상세 문서화
// - 요청/응답 예시 추가

// TODO: [LOW] 테스트 코드 작성
// - API 훅 단위 테스트
// - Mock 서버 구축
// - 통합 테스트 시나리오 작성

// TODO: [LOW] 모니터링 및 로깅
// - API 호출 성능 모니터링
// - 에러 발생률 추적
// - 사용자 행동 분석

// API 기본 설정
// 🔑 CRITICAL: Use environment variable from Azure pipeline or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:8080/api';

console.log('🔗 API Base URL:', API_BASE_URL);

// API 응답 타입 (TODO: 표준화 필요)
// interface ApiResponse<T> {
//   data: T;
//   success: boolean;
//   message?: string;
//   timestamp?: string;
//   requestId?: string;
// }

// 에러 처리
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP 요청 헬퍼 함수
// TODO: [HIGH] 요청 ID, 타임스탬프, 재시도 로직 추가
// TODO: [MEDIUM] 요청/응답 로깅 시스템 구축
// TODO: [MEDIUM] 네트워크 상태 감지 및 오프라인 처리
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // TODO: [MEDIUM] JWT 토큰 자동 추가
      // 'Authorization': `Bearer ${getAuthToken()}`,
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
    // TODO: [HIGH] Fallback 전략 구현
    // TODO: [MEDIUM] 재시도 로직 구현
    throw error;
  }
}

// 메뉴 관련 API
export const menuApi = {
  // 모든 메뉴 아이템 조회
  getAllItems: (): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>('/menu-items'),
  
  // 카테고리별 메뉴 조회
  getItemsByCategory: (category: string): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>(`/menu-items?category=${category}`),
  
  // 메뉴 아이템 상세 조회
  getItemById: (id: string): Promise<MenuItem> => 
    apiRequest<MenuItem>(`/menu-items/${id}`),
  
  // 모든 카테고리 조회
  getAllCategories: (): Promise<string[]> => 
    apiRequest<string[]>('/menu-items/categories'),
  
  // 메뉴 검색
  searchItems: (keyword: string): Promise<MenuItem[]> => 
    apiRequest<MenuItem[]>(`/menu-items?search=${encodeURIComponent(keyword)}`),
  
  // 백엔드 연결 테스트
  testConnection: (): Promise<{ message: string }> => 
    apiRequest<{ message: string }>('/menu-items'),
};

// 주문 관련 API
// TODO: [HIGH] 주문 API 완전 구현 필요
// TODO: [MEDIUM] 주문 상태 업데이트 API 추가
// TODO: [MEDIUM] 주문 취소 API 추가
// TODO: [MEDIUM] 주문 히스토리 조회 API 추가
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
    
  // TODO: [MEDIUM] 추가 주문 API들
  // updateOrderStatus: (orderId: string, status: OrderStatus): Promise<Order>
  // cancelOrder: (orderId: string): Promise<void>
  // getOrderHistory: (customerId: string): Promise<Order[]>
};

// 장바구니 관련 API
// TODO: [HIGH] 장바구니 API 완전 구현 필요
// TODO: [MEDIUM] 장바구니 비우기 API 추가
// TODO: [MEDIUM] 장바구니 아이템 일괄 수정 API 추가
// TODO: [LOW] 장바구니 저장/복원 기능 (로컬 스토리지 연동)
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
    
  // TODO: [MEDIUM] 추가 장바구니 API들
  // clearCart: (): Promise<void>
  // updateCartItems: (items: CartItem[]): Promise<CartItem[]>
  // saveCart: (): Promise<void>
  // restoreCart: (): Promise<CartItem[]>
};

// API 상태 확인
// TODO: [MEDIUM] 헬스체크 개선 (상세 상태 정보 포함)
// TODO: [MEDIUM] 주기적 헬스체크 및 상태 모니터링
// TODO: [LOW] API 버전 정보 확인 기능
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
  
  // TODO: [MEDIUM] 추가 헬스체크 기능들
  // getDetailedStatus: (): Promise<HealthStatus>
  // checkApiVersion: (): Promise<string>
  // getSystemInfo: (): Promise<SystemInfo>
};

// TODO: [LOW] 새로운 API 모듈 추가 시 여기에 등록
// TODO: [MEDIUM] API 모듈 자동 등록 시스템 구축
export default {
  menu: menuApi,
  order: orderApi,
  cart: cartApi,
  health: apiHealth,
  // TODO: [MEDIUM] 추가 API 모듈들
  // payment: paymentApi,
  // user: userApi,
  // notification: notificationApi,
};
