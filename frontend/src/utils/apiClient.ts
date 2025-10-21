/**
 * API 클라이언트 유틸리티 클래스
 * 
 * 이 클래스는 모든 API 요청의 공통 로직을 처리합니다:
 * - 환경 설정 관리
 * - 요청/응답 표준화
 * - 에러 처리 및 재시도 로직
 * - 백엔드 연결 상태 확인
 * - Mock 데이터 fallback 처리
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2024-01-15
 */

// =============================================================================
// 타입 정의
// =============================================================================

/**
 * API 응답 표준 형식
 * 모든 API 응답은 이 형식을 따라야 합니다.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId: string;
}

/**
 * API 요청 설정
 */
export interface ApiRequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  useMockData?: boolean;
}

/**
 * API 상태 정보
 */
export interface ApiHealthStatus {
  isHealthy: boolean;
  baseUrl: string;
  lastChecked: string;
  responseTime?: number;
}

/**
 * API 에러 클래스
 * HTTP 상태 코드와 함께 상세한 에러 정보를 제공합니다.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public requestId?: string,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// =============================================================================
// API 클라이언트 클래스
// =============================================================================

/**
 * 중앙화된 API 클라이언트
 * 
 * 모든 API 요청을 처리하는 중앙 클라이언트입니다.
 * 환경 설정, 에러 처리, 재시도 로직, Mock 데이터 fallback 등을 관리합니다.
 */
export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultTimeout: number = 10000; // 10초
  private maxRetries: number = 3;
  private healthStatus: ApiHealthStatus | null = null;

  private constructor() {
    // 환경별 API URL 설정
    this.baseUrl = this.getApiBaseUrl();
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * 환경별 API 기본 URL 반환
   * TODO: 환경변수 파일(.env)에서 관리하도록 개선 필요
   */
  private getApiBaseUrl(): string {
    // 개발 환경에서는 localhost 사용
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:8080/api';
    }
    
    // 프로덕션 환경에서는 환경변수 사용
    return process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  }

  /**
   * 백엔드 서버 상태 확인
   * 
   * @param endpoint 테스트할 엔드포인트 (기본값: '/health')
   * @returns Promise<boolean> 서버 상태
   */
  public async checkHealth(endpoint: string = '/health'): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        timeout: 5000, // 5초 타임아웃
      });
      
      const responseTime = Date.now() - startTime;
      const isHealthy = response.ok;
      
      this.healthStatus = {
        isHealthy,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString(),
        responseTime
      };
      
      return isHealthy;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      this.healthStatus = {
        isHealthy: false,
        baseUrl: this.baseUrl,
        lastChecked: new Date().toISOString()
      };
      return false;
    }
  }

  /**
   * 현재 API 상태 반환
   */
  public getHealthStatus(): ApiHealthStatus | null {
    return this.healthStatus;
  }

  /**
   * API 기본 URL 반환
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * HTTP 요청 실행
   * 
   * @param endpoint API 엔드포인트
   * @param config 요청 설정
   * @returns Promise<T> 응답 데이터
   */
  public async request<T>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      useMockData = true,
      ...requestConfig
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const requestId = this.generateRequestId();
    
    // 요청 설정 구성
    const finalConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        // TODO: JWT 토큰 자동 추가
        // 'Authorization': `Bearer ${this.getAuthToken()}`,
        ...requestConfig.headers,
      },
      ...requestConfig,
    };

    // 재시도 로직과 함께 요청 실행
    return this.executeWithRetry<T>(url, finalConfig, retries, requestId);
  }

  /**
   * 재시도 로직과 함께 요청 실행
   */
  private async executeWithRetry<T>(
    url: string,
    config: RequestInit,
    retries: number,
    requestId: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          throw new ApiError(
            response.status,
            `HTTP error! status: ${response.status}`,
            requestId,
            url
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        // 마지막 시도가 아니면 잠시 대기 후 재시도
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // 지수 백오프
          console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await this.delay(delay);
        }
      }
    }

    // 모든 재시도 실패 시 에러 발생
    throw lastError || new ApiError(0, 'Request failed after all retries', requestId);
  }

  /**
   * 요청 ID 생성
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET 요청 헬퍼
   */
  public async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST 요청 헬퍼
   */
  public async post<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 요청 헬퍼
   */
  public async put<T>(endpoint: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 요청 헬퍼
   */
  public async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// =============================================================================
// 싱글톤 인스턴스 내보내기
// =============================================================================

/**
 * 전역 API 클라이언트 인스턴스
 * 애플리케이션 전체에서 이 인스턴스를 사용합니다.
 */
export const apiClient = ApiClient.getInstance();

// =============================================================================
// 편의 함수들
// =============================================================================

/**
 * 백엔드 상태 확인 (편의 함수)
 */
export const checkBackendHealth = (): Promise<boolean> => {
  return apiClient.checkHealth();
};

/**
 * API 기본 URL 반환 (편의 함수)
 */
export const getApiBaseUrl = (): string => {
  return apiClient.getBaseUrl();
};
