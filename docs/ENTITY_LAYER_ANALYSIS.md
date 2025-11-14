# Entity Layer 분석 보고서

**작성일**: 2025-01-27  
**분석 대상**: Backend Entity Layer 전체  
**상태**: 🔍 분석 완료

---

## 📋 Entity 목록

총 **15개** Entity 파일 확인:

### ✅ Core Entities (7개)
1. **User.java** - 사용자 정보
2. **Order.java** - 주문 정보
3. **OrderItem.java** - 주문 항목
4. **MenuItem.java** - 메뉴 항목
5. **Payment.java** - 결제 정보
6. **Delivery.java** - 배송 정보
7. **Reservation.java** - 예약 정보

### ✅ Supporting Entities (8개)
8. **DeliveryAddress.java** - 배송 주소
9. **DeliveryDriver.java** - 배송 기사
10. **RestaurantTable.java** - 레스토랑 테이블
11. **MenuCategory.java** - 메뉴 카테고리
12. **PaymentRefund.java** - 환불 정보
13. **UserSession.java** - 사용자 세션
14. **CustomerPreference.java** - 고객 선호도
15. **AuditLog.java** - 감사 로그

---

## 🔍 발견된 문제점

### 🔴 Critical Issues

#### 1. 잘못된 위치의 파일: `DeliveryService` ⚠️

**문제**:
- `DeliveryService` 파일이 `entity/` 디렉토리에 있음
- 실제로는 `Service` 클래스이므로 `service/` 디렉토리에 있어야 함
- 패키지 선언: `package com.lerestaurant.le_restaurant_backend.service;` ✅
- 파일 위치: `entity/DeliveryService` ❌

**영향도**: 높음  
**우선순위**: 높음

**수정 필요**:
```bash
# 파일 이동 필요
mv backend/src/main/java/com/lerestaurant/le_restaurant_backend/entity/DeliveryService \
   backend/src/main/java/com/lerestaurant/le_restaurant_backend/service/DeliveryService.java
```

---

## ✅ 잘 구현된 부분

### 1. JPA 어노테이션 사용
- ✅ `@Entity`, `@Table` 적절히 사용
- ✅ `@Id`, `@GeneratedValue` ID 생성 전략 명확
- ✅ `@Column` 어노테이션으로 컬럼 매핑 명확
- ✅ `@ManyToOne`, `@OneToMany` 관계 매핑 적절

### 2. Enum 타입 사용
- ✅ `UserRole`, `UserStatus` (User)
- ✅ `OrderType`, `OrderStatus` (Order)
- ✅ `PaymentMethod`, `PaymentStatus` (Payment)
- ✅ `DeliveryStatus` (Delivery)
- ✅ `ReservationStatus` (Reservation)
- ✅ `AddressType` (DeliveryAddress)
- ✅ `ActionType` (AuditLog)

### 3. 관계 매핑 (Relationships)

#### User Entity
```java
@OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
private List<Order> orders;
```

#### Order Entity
```java
@ManyToOne
@JoinColumn(name = "customer_id")
private User customer;

@ManyToOne
@JoinColumn(name = "table_id")
private RestaurantTable table;

@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List<OrderItem> items;
```

#### Payment Entity
```java
@ManyToOne(optional = false)
@JoinColumn(name = "order_id")
private Order order;
```

#### Delivery Entity
```java
@ManyToOne(optional = false)
@JoinColumn(name = "order_id")
private Order order;

@ManyToOne(optional = false)
@JoinColumn(name = "delivery_address_id")
private DeliveryAddress deliveryAddress;

@ManyToOne
@JoinColumn(name = "driver_id")
private DeliveryDriver driver;
```

### 4. 자동 타임스탬프 관리

#### MenuItem.java
```java
@PrePersist
protected void onCreate() {
    createdAt = OffsetDateTime.now();
    updatedAt = OffsetDateTime.now();
}

@PreUpdate
protected void onUpdate() {
    updatedAt = OffsetDateTime.now();
}
```

### 5. 데이터 타입 적절성
- ✅ `BigDecimal` 사용 (금액 필드)
- ✅ `OffsetDateTime` 사용 (타임스탬프)
- ✅ `LocalDate`, `LocalTime` 사용 (Reservation)

---

## ⚠️ 개선 권장 사항

### 1. Lombok 사용 일관성

**현재 상태**:
- `Delivery.java`: `@Data` 사용 ✅
- 나머지 Entity: 수동 getter/setter ❌

**권장사항**:
- 모든 Entity에 Lombok 적용 또는
- 모든 Entity에서 Lombok 제거 (일관성 유지)

**예시**:
```java
// Option 1: Lombok 사용
@Entity
@Data
@Table(name = "orders")
public class Order {
    // ...
}

// Option 2: 수동 getter/setter (현재 대부분)
@Entity
@Table(name = "orders")
public class Order {
    // getter/setter 수동 작성
}
```

### 2. Delivery Entity 개선

**현재 문제**:
```java
// 중복 필드
private String customerName;
private String phoneNumber;
private String address;

// 이미 관계로 연결되어 있음
@ManyToOne
@JoinColumn(name = "order_id")
private Order order;  // order.customer로 접근 가능

@ManyToOne
@JoinColumn(name = "delivery_address_id")
private DeliveryAddress deliveryAddress;  // address 정보 포함
```

**권장사항**:
- 중복 필드 제거 또는
- `@Transient`로 표시하여 DB에 저장하지 않도록 설정

### 3. Index 추가 권장

**현재**:
```java
// User.java만 index 있음
@Table(name = "users", indexes = {
    @Index(name = "uk_users_email", columnList = "email", unique = true)
})
```

**권장**:
```java
// Order.java
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_customer", columnList = "customer_id"),
    @Index(name = "idx_order_status", columnList = "status"),
    @Index(name = "idx_order_time", columnList = "order_time")
})

// Payment.java
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_order", columnList = "order_id"),
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_transaction", columnList = "transaction_id")
})
```

### 4. Validation 어노테이션 추가

**권장**:
```java
@Entity
@Table(name = "orders")
public class Order {
    @Column(nullable = false)
    @NotNull
    private BigDecimal totalAmount;
    
    @Column(nullable = false)
    @NotNull
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
```

### 5. Reservation Entity 개선

**현재**:
```java
// 중복 메서드
public User getApprovedBy() { return confirmedBy; }
public void setApprovedBy(User approvedBy) { this.confirmedBy = approvedBy; }
public Integer getNumberOfGuests() { return partySize; }
public void setNumberOfGuests(Integer numberOfGuests) { this.partySize = numberOfGuests; }
```

**권장사항**: 중복 메서드 제거 또는 명확한 네이밍 통일

---

## 📊 Entity별 상세 분석

### ✅ User.java
- **상태**: ✅ 양호
- **관계**: `@OneToMany` Order (LAZY)
- **Enum**: `UserRole`, `UserStatus`
- **Index**: Email unique index ✅
- **개선점**: 없음

### ✅ Order.java
- **상태**: ✅ 양호
- **관계**: `@ManyToOne` User, RestaurantTable, `@OneToMany` OrderItem
- **Enum**: `OrderType`, `OrderStatus`
- **Cascade**: `CascadeType.ALL`, `orphanRemoval = true` ✅
- **개선점**: Index 추가 권장

### ✅ Payment.java
- **상태**: ✅ 양호
- **관계**: `@ManyToOne` Order (optional = false)
- **Enum**: `PaymentMethod`, `PaymentStatus`
- **개선점**: Index 추가 권장

### ✅ Delivery.java
- **상태**: ⚠️ 개선 필요
- **문제**: 중복 필드 (customerName, phoneNumber, address)
- **Lombok**: `@Data` 사용 ✅
- **개선점**: 중복 필드 제거 또는 `@Transient` 추가

### ✅ Reservation.java
- **상태**: ⚠️ 개선 필요
- **문제**: 중복 메서드 (getApprovedBy, getNumberOfGuests)
- **개선점**: 중복 메서드 정리

### ✅ MenuItem.java
- **상태**: ✅ 양호
- **특징**: `@PrePersist`, `@PreUpdate` 사용 ✅
- **개선점**: 없음

### ✅ DeliveryAddress.java
- **상태**: ✅ 양호
- **관계**: `@ManyToOne` User
- **Enum**: `AddressType`
- **개선점**: 없음

---

## 🔧 수정 권장 사항 요약

### 즉시 수정 필요 (High Priority)
1. ✅ `DeliveryService` 파일을 `service/` 디렉토리로 이동

### 중기 개선 (Medium Priority)
2. ⚠️ Delivery Entity 중복 필드 정리
3. ⚠️ Reservation Entity 중복 메서드 정리
4. ⚠️ Index 추가 (Order, Payment 등)

### 장기 개선 (Low Priority)
5. ⚠️ Lombok 사용 일관성 확보
6. ⚠️ Validation 어노테이션 추가

---

## ✅ 전체 평가

| 항목 | 점수 | 비고 |
|------|------|------|
| **JPA 어노테이션** | ⭐⭐⭐⭐⭐ (5/5) | 적절히 사용 |
| **관계 매핑** | ⭐⭐⭐⭐⭐ (5/5) | 명확하고 적절 |
| **Enum 사용** | ⭐⭐⭐⭐⭐ (5/5) | 적절히 사용 |
| **데이터 타입** | ⭐⭐⭐⭐⭐ (5/5) | 적절 (BigDecimal, OffsetDateTime) |
| **파일 구조** | ⭐⭐⭐☆☆ (3/5) | DeliveryService 잘못된 위치 |
| **코드 일관성** | ⭐⭐⭐⭐☆ (4/5) | Lombok 사용 불일치 |

**종합 점수**: ⭐⭐⭐⭐☆ (4/5)

---

## 📝 결론

Entity Layer는 전반적으로 잘 구현되어 있습니다:
- ✅ JPA 어노테이션 적절히 사용
- ✅ 관계 매핑 명확
- ✅ Enum 타입 적절히 사용
- ✅ 데이터 타입 적절 (BigDecimal, OffsetDateTime)

**개선 필요 사항**:
- 🔴 `DeliveryService` 파일 위치 수정 (즉시)
- ⚠️ Delivery Entity 중복 필드 정리
- ⚠️ Reservation Entity 중복 메서드 정리
- ⚠️ Index 추가로 성능 개선

---

**다음 단계**: 발견된 문제점 수정 진행

