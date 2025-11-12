# 논리적 흐름 분석 (Logical Flow Analysis)

## 전체 사용자 플로우 개요

### 1. 사용자 등록/로그인 플로우

```
[Frontend]                    [Backend]
─────────────────────────────────────────────
1. RegisterForm
   └─> POST /api/auth/register
       └─> ❌ AuthController에 없음!
           └─> 대안: POST /api/users 사용
                └─> UserController.createUser()
                    └─> UserService.createUser()
                        └─> ✅ User 생성 (status: ACTIVE)
                            └─> 비밀번호 암호화 (BCrypt)
```

**현재 상태:**
- ✅ `RegisterForm`은 `/api/auth/register` 호출 시도
- ❌ `AuthController`에 `/register` 엔드포인트 없음
- ✅ `UserController.createUser()`로 대체 가능
- ⚠️ `AuthContext.register()`는 mock 데이터 사용 (TODO 주석)

**권장 수정:**
1. `AuthController`에 `POST /api/auth/register` 추가
2. 또는 `RegisterForm`을 `/api/users`로 변경
3. `AuthContext.register()`를 실제 API 호출로 변경

---

### 2. 로그인 플로우

```
[Frontend]                    [Backend]
─────────────────────────────────────────────
1. LoginForm
   └─> POST /api/auth/login
       └─> AuthController.login()
           └─> UserService.authenticateUser()
               └─> ✅ 비밀번호 검증
                   └─> ✅ lastLogin 업데이트
                       └─> ✅ UserDto + token 반환
```

**현재 상태:**
- ✅ `LoginForm`은 실제 API 호출 (`/api/auth/login`)
- ✅ `AuthController.login()` 구현됨
- ⚠️ `AuthContext.login()`은 mock 데이터 사용 (TODO 주석)

**권장 수정:**
- `AuthContext.login()`을 실제 API 호출로 변경

---

### 3. 주문 생성 플로우

```
[Frontend]                    [Backend]
─────────────────────────────────────────────
1. 사용자가 메뉴 선택
   └─> CartContext.addToCart()
       └─> 로컬 상태에 저장

2. CheckoutForm
   └─> handlePlaceOrder()
       └─> createOrder(orderRequest)
           └─> POST /api/orders
               └─> OrderController.createOrder()
                   └─> OrderService.createOrder()
                       └─> ✅ 고객 검증
                           └─> ✅ 메뉴 아이템 검증
                               └─> ✅ 가용성 확인
                                   └─> ✅ 총액 계산 (subtotal + tax + tip)
                                       └─> ✅ Order 생성 (status: PENDING)
                                           └─> OrderItem 생성
                                               └─> OrderDto 반환
                                                   └─> 장바구니 비우기
                                                       └─> /payment로 이동
```

**현재 상태:**
- ✅ 논리적 흐름 완벽
- ✅ 모든 검증 로직 구현됨
- ✅ 총액 계산 정확함

---

### 4. 결제 처리 플로우

```
[Frontend]                    [Backend]
─────────────────────────────────────────────
1. Payment.tsx
   └─> handleSubmitPayment()
       ├─> Step 1: createPayment(paymentData)
       │   └─> POST /api/payments
       │       └─> PaymentController.createPayment()
       │           └─> PaymentService.createPayment()
       │               └─> ✅ Order 검증
       │                   └─> ✅ Payment 생성 (status: PENDING)
       │                       └─> transactionId 생성 (UUID)
       │                           └─> PaymentDto 반환
       │
       ├─> Step 2: 결제 게이트웨이 시뮬레이션 (1.5초 대기)
       │
       ├─> Step 3: processPayment(paymentId)
       │   └─> POST /api/payments/{id}/process
       │       └─> PaymentController.processPayment()
       │           └─> PaymentService.processPayment()
       │               └─> ✅ Payment 상태를 COMPLETED로 변경
       │                   └─> processedAt 설정
       │                       └─> gatewayResponse 설정
       │                           └─> ⚠️ 주문 상태는 자동 업데이트 안 됨
       │
       └─> Step 4: updateOrderStatus(orderId, 'CONFIRMED')
           └─> PUT /api/orders/{id}/status
               └─> OrderController.updateOrderStatus()
                   └─> OrderService.updateOrderStatus()
                       └─> ✅ Order 상태를 CONFIRMED로 변경
```

**현재 상태:**
- ✅ 결제 플로우 완전 구현됨
- ✅ Payment 엔티티 생성됨
- ✅ Payment 상태 관리됨
- ⚠️ **논리적 문제**: `processPayment`가 주문 상태를 자동으로 업데이트하지 않음
- ⚠️ **논리적 문제**: 프론트엔드에서 수동으로 `updateOrderStatus` 호출 필요

**백엔드 테스트 기대값:**
- 테스트에서는 결제 후 주문 상태가 `PREPARING`으로 변경됨
- 하지만 현재 구현은 `CONFIRMED`로 변경됨

**권장 수정:**
1. `PaymentService.processPayment()`에서 주문 상태를 자동으로 업데이트
2. 또는 `OrderService.updateOrderStatus()`를 `PaymentService`에서 호출
3. 주문 상태 전환 규칙 명확화:
   - `PENDING` → `CONFIRMED` (결제 완료 후)
   - `CONFIRMED` → `PREPARING` (매니저가 주문 확인 후)

---

### 5. 매니저 결제 확인 플로우

```
[Frontend]                    [Backend]
─────────────────────────────────────────────
1. PaymentManagementPanel
   └─> loadPayments()
       └─> getAllPayments()
           └─> GET /api/payments
               └─> PaymentController.getAllPayments()
                   └─> PaymentService.getAllPayments()
                       └─> ✅ 모든 Payment 조회
                           └─> PaymentDto 리스트 반환
                               └─> UI에 표시
```

**현재 상태:**
- ✅ 완전히 구현됨
- ✅ 모든 결제 내역 확인 가능
- ✅ 필터링/검색 기능 구현됨

---

## 발견된 논리적 문제점

### 🔴 심각한 문제

#### 1. AuthContext가 Mock 데이터 사용
**위치:** `frontend/src/contexts/AuthContext.tsx`
- `login()` 함수: mock 데이터 사용 (TODO 주석)
- `register()` 함수: mock 데이터 사용 (TODO 주석)
- **영향:** 실제 백엔드와 연결되지 않음

**해결 방법:**
```typescript
// AuthContext.tsx 수정 필요
const login = async (credentials: LoginRequest): Promise<void> => {
  dispatch({ type: 'LOGIN_START' });
  
  try {
    const { apiClient } = await import('../services/apiClient.unified');
    const { API_ENDPOINTS } = await import('../config/api.config');
    
    const res = await fetch(`${apiClient.getBaseUrl()}${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!res.ok) throw new Error('Login failed');
    
    const data = await res.json();
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: data.user, token: data.token, expiresAt: data.expiresAt }
    });
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE' });
    throw error;
  }
};
```

#### 2. Register 엔드포인트 불일치
**위치:** 
- Frontend: `RegisterForm.tsx` → `/api/auth/register` 호출
- Backend: `AuthController` → `/api/auth/register` 없음

**해결 방법:**
1. `AuthController`에 `POST /api/auth/register` 추가
2. 또는 `RegisterForm`을 `/api/users`로 변경

#### 3. 결제 후 주문 상태 업데이트 로직 분리
**위치:** `Payment.tsx`와 `PaymentService.java`
- 현재: 프론트엔드에서 수동으로 `updateOrderStatus` 호출
- 문제: 결제 완료 후 주문 상태가 자동으로 업데이트되지 않음
- 백엔드 테스트 기대값: `PREPARING`으로 변경
- 현재 구현: `CONFIRMED`로 변경

**해결 방법:**
```java
// PaymentService.java 수정
public PaymentDto processPayment(Long id) {
    Payment payment = paymentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    
    payment.setStatus(Payment.PaymentStatus.COMPLETED);
    payment.setProcessedAt(OffsetDateTime.now());
    payment.setGatewayResponse("Payment processed successfully");
    
    Payment updatedPayment = paymentRepository.save(payment);
    
    // 주문 상태 자동 업데이트
    Order order = payment.getOrder();
    if (order.getStatus() == Order.OrderStatus.PENDING) {
        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);
    }
    
    return convertToDto(updatedPayment);
}
```

---

### 🟡 개선 가능한 부분

#### 1. 주문 상태 전환 규칙 명확화
**현재 상태:**
- `PENDING` → `CONFIRMED` (결제 완료 후)
- `CONFIRMED` → `PREPARING` (매니저 확인 후)
- `PREPARING` → `READY` (조리 완료)
- `READY` → `COMPLETED` (배달/픽업 완료)

**권장:**
- 상태 전환 규칙을 문서화
- 백엔드에서 상태 전환 검증 로직 추가

#### 2. 트랜잭션 관리
**현재 상태:**
- `PaymentService.processPayment()`와 `OrderService.updateOrderStatus()`가 분리됨
- 트랜잭션 경계가 명확하지 않음

**권장:**
- `@Transactional` 어노테이션 확인
- 결제와 주문 상태 업데이트를 하나의 트랜잭션으로 처리

---

## 완전한 논리적 흐름 다이어그램

### 사용자 주문 플로우 (완전한 버전)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 사용자 등록/로그인                                        │
├─────────────────────────────────────────────────────────────┤
│ RegisterForm → /api/auth/register (없음!)                   │
│   → UserController.createUser() (대안)                      │
│     → UserService.createUser()                              │
│       → User 생성 (ACTIVE)                                   │
│                                                              │
│ LoginForm → /api/auth/login                                 │
│   → AuthController.login()                                  │
│     → UserService.authenticateUser()                        │
│       → UserDto + token 반환                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. 메뉴 선택 및 장바구니                                     │
├─────────────────────────────────────────────────────────────┤
│ MenuItem 클릭                                                │
│   → CartContext.addToCart()                                  │
│     → 로컬 상태에 저장                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. 주문 생성                                                 │
├─────────────────────────────────────────────────────────────┤
│ CheckoutForm.handlePlaceOrder()                              │
│   → createOrder(orderRequest)                               │
│     → POST /api/orders                                      │
│       → OrderController.createOrder()                       │
│         → OrderService.createOrder()                         │
│           → 고객 검증                                        │
│           → 메뉴 아이템 검증                                 │
│           → 가용성 확인                                      │
│           → 총액 계산 (subtotal + tax + tip)                │
│           → Order 생성 (status: PENDING)                     │
│           → OrderItem 생성                                   │
│           → OrderDto 반환                                    │
│           → 장바구니 비우기                                  │
│           → /payment로 이동                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. 결제 처리                                                 │
├─────────────────────────────────────────────────────────────┤
│ Payment.tsx.handleSubmitPayment()                           │
│   ├─> Step 1: createPayment(paymentData)                   │
│   │     → POST /api/payments                                │
│   │       → PaymentController.createPayment()                │
│   │         → PaymentService.createPayment()                │
│   │           → Order 검증                                   │
│   │           → Payment 생성 (status: PENDING)               │
│   │           → transactionId 생성 (UUID)                    │
│   │                                                          │
│   ├─> Step 2: 결제 게이트웨이 시뮬레이션 (1.5초)            │
│   │                                                          │
│   ├─> Step 3: processPayment(paymentId)                    │
│   │     → POST /api/payments/{id}/process                  │
│   │       → PaymentController.processPayment()               │
│   │         → PaymentService.processPayment()                │
│   │           → Payment 상태를 COMPLETED로 변경              │
│   │           → ⚠️ 주문 상태는 자동 업데이트 안 됨          │
│   │                                                          │
│   └─> Step 4: updateOrderStatus(orderId, 'CONFIRMED')     │
│         → PUT /api/orders/{id}/status                       │
│           → OrderController.updateOrderStatus()              │
│             → OrderService.updateOrderStatus()               │
│               → Order 상태를 CONFIRMED로 변경                │
│               → /customer/orders/{id}로 이동                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. 매니저 결제 확인                                          │
├─────────────────────────────────────────────────────────────┤
│ PaymentManagementPanel.loadPayments()                        │
│   → getAllPayments()                                         │
│     → GET /api/payments                                      │
│       → PaymentController.getAllPayments()                   │
│         → PaymentService.getAllPayments()                    │
│           → 모든 Payment 조회                                │
│           → PaymentDto 리스트 반환                          │
│           → UI에 표시                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 권장 수정 사항 요약

### 즉시 수정 필요 (Critical)

1. **AuthContext 실제 API 연결**
   - `login()` 함수를 실제 API 호출로 변경
   - `register()` 함수를 실제 API 호출로 변경

2. **Register 엔드포인트 추가**
   - `AuthController`에 `POST /api/auth/register` 추가
   - 또는 `RegisterForm`을 `/api/users`로 변경

3. **결제 후 주문 상태 자동 업데이트**
   - `PaymentService.processPayment()`에서 주문 상태 자동 업데이트
   - 또는 상태 전환 규칙 명확화

### 개선 권장 (Recommended)

1. **주문 상태 전환 규칙 문서화**
2. **트랜잭션 경계 명확화**
3. **에러 처리 강화**

---

**Last Updated**: 2025-01-27

