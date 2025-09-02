# 🚀 Frontend API Integration Guide

## 📋 개요

이 문서는 Le Restaurant 프론트엔드에서 백엔드 API를 사용하는 방법을 설명합니다.

## 🏗️ 아키텍처

```
Frontend Components
        ↓
    useApi Hooks
        ↓
    API Services
        ↓
    Backend API (localhost:8080)
```

## 📁 파일 구조

```
src/
├── services/
│   └── api.ts              # 메인 API 서비스
├── hooks/
│   └── useApi.ts           # React 커스텀 훅
├── components/
│   ├── atoms/
│   │   └── ApiStatusIndicator.tsx  # API 상태 표시
│   └── organisms/
│       └── ApiTestPanel.tsx        # API 테스트 패널
```

## 🔌 API 서비스 사용법

### 1. 기본 API 서비스

```typescript
import { menuApi, orderApi, cartApi } from '../services/api';

// 메뉴 조회
const menuItems = await menuApi.getAllItems();

// 카테고리별 조회
const pizzaItems = await menuApi.getItemsByCategory('Pizza');

// 메뉴 검색
const searchResults = await menuApi.searchItems('pizza');

// 백엔드 연결 테스트
const status = await menuApi.testConnection();
```

### 2. React 훅 사용법

```typescript
import { useMenuApi, useApiHealth } from '../hooks/useApi';

const MyComponent = () => {
  const { 
    data: menuItems, 
    loading, 
    error, 
    fetchAllItems 
  } = useMenuApi();
  
  const { isBackendHealthy } = useApiHealth();

  useEffect(() => {
    fetchAllItems();
  }, [fetchAllItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {isBackendHealthy ? 'Backend Connected' : 'Backend Disconnected'}
      {menuItems?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## 🌐 API 엔드포인트

### 메뉴 관련
- `GET /api/menu/items` - 모든 메뉴 아이템 조회
- `GET /api/menu/items/{id}` - 특정 메뉴 아이템 조회
- `GET /api/menu/categories` - 모든 카테고리 조회
- `GET /api/menu/items/category/{category}` - 카테고리별 메뉴 조회
- `GET /api/menu/search?keyword={keyword}` - 메뉴 검색
- `GET /api/menu/test` - 백엔드 연결 테스트

### 주문 관련 (향후 확장)
- `POST /api/orders` - 주문 생성
- `GET /api/orders/{id}/status` - 주문 상태 조회

### 장바구니 관련 (향후 확장)
- `GET /api/cart/items` - 장바구니 조회
- `POST /api/cart/items` - 장바구니에 아이템 추가
- `PUT /api/cart/items/{id}` - 장바구니 아이템 수정
- `DELETE /api/cart/items/{id}` - 장바구니에서 아이템 삭제

## 🔧 설정

### API 기본 URL
```typescript
// services/api.ts
const API_BASE_URL = 'http://localhost:8080/api';
```

### CORS 설정
백엔드에서 프론트엔드(localhost:5173) 접근을 허용해야 합니다.

## 📊 상태 관리

### API 상태 타입
```typescript
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

### 에러 처리
```typescript
try {
  const data = await menuApi.getAllItems();
  // 성공 처리
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.status, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 🧪 테스트

### API 테스트 패널
`ApiTestPanel` 컴포넌트를 사용하여 API 연결을 테스트할 수 있습니다:

```typescript
import ApiTestPanel from '../components/organisms/ApiTestPanel';

// 페이지에 추가
<ApiTestPanel />
```

### 백엔드 상태 확인
Header에 `ApiStatusIndicator`가 표시되어 백엔드 연결 상태를 실시간으로 확인할 수 있습니다.

## 🚨 문제 해결

### 일반적인 문제들

1. **CORS 에러**
   - 백엔드 CORS 설정 확인
   - 프론트엔드 URL이 허용 목록에 포함되어 있는지 확인

2. **연결 실패**
   - 백엔드 서버가 실행 중인지 확인 (포트 8080)
   - 네트워크 연결 상태 확인

3. **데이터 타입 불일치**
   - 프론트엔드와 백엔드 타입 정의 일치 확인
   - API 응답 구조 확인

### 디버깅 팁

```typescript
// API 요청 로깅
console.log('API Request:', endpoint, options);

// 응답 데이터 확인
console.log('API Response:', data);

// 에러 상세 정보
console.error('API Error Details:', error);
```

## 🔄 데이터 흐름

1. **컴포넌트 마운트** → `useApi` 훅 초기화
2. **API 호출** → `apiRequest` 함수 실행
3. **백엔드 응답** → 데이터 파싱 및 상태 업데이트
4. **UI 렌더링** → 새로운 데이터로 컴포넌트 업데이트

## 📈 성능 최적화

- **useCallback**을 사용하여 함수 재생성 방지
- **useEffect** 의존성 배열 최적화
- **로딩 상태** 표시로 사용자 경험 개선
- **에러 바운더리**로 애플리케이션 안정성 향상

## 🔮 향후 계획

- [ ] JWT 인증 추가
- [ ] 실시간 주문 상태 업데이트 (WebSocket)
- [ ] API 응답 캐싱
- [ ] 오프라인 지원
- [ ] API 요청 재시도 로직

---

**참고**: 이 문서는 개발 진행에 따라 업데이트됩니다.
