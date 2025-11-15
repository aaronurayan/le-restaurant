# 01. 어드민 대시보드 접근 가이드

## 📍 라우트
**URL**: `/admin/dashboard`

## 🔐 접근 권한
- **ADMIN** 역할
- **MANAGER** 역할

다른 역할(CUSTOMER, 비로그인 사용자)은 접근할 수 없으며, `ProtectedRoute`에 의해 자동으로 리다이렉트됩니다.

## 🚀 접근 방법

### 1. 데스크톱 네비게이션 (Header 상단)
**위치**: 헤더 상단 메뉴바
- Admin/Manager로 로그인하면 헤더 상단에 **"Dashboard"** 링크가 표시됩니다
- 클릭하면 `/admin/dashboard`로 이동합니다

```
[Menu] [About] [Contact] [Dashboard] ← 이 부분
```

### 2. 사용자 드롭다운 메뉴 (Header 우측)
**위치**: 헤더 우측 상단의 사용자 아이콘 클릭
- 사용자 아이콘을 클릭하면 드롭다운 메뉴가 열립니다
- **"Admin Dashboard"** 링크를 클릭합니다

```
[사용자 아이콘] 클릭
  ↓
┌─────────────────────┐
│ Admin Dashboard     │ ← 클릭
│ Menu Management     │
│ User Management     │
│ ...                 │
└─────────────────────┘
```

### 3. 모바일 메뉴
**위치**: 모바일 화면에서 햄버거 메뉴(☰) 클릭
- 모바일 화면에서 좌측 상단의 햄버거 메뉴를 클릭합니다
- 사이드바에서 **"Admin Dashboard"** 링크를 클릭합니다

```
[☰] 클릭
  ↓
┌─────────────────┐
│ Admin Dashboard │ ← 클릭
│ Menu Management │
│ ...             │
└─────────────────┘
```

### 4. 직접 URL 입력
브라우저 주소창에 직접 입력:
```
http://localhost:5173/admin/dashboard
```

### 5. 다른 관리 페이지에서 뒤로가기
다음 페이지들에서 "Back to Dashboard" 버튼을 클릭:
- `/admin/menu` (메뉴 관리)
- `/admin/reservations` (예약 관리)
- `/admin/users` (사용자 관리)
- `/delivery` (배송 관리)
- `/payments` (결제 관리)

## 🔄 자동 리다이렉트

### 로그인하지 않은 경우
- `/admin/dashboard` 접근 시 → 로그인 페이지로 리다이렉트

### 권한이 없는 경우 (CUSTOMER 역할)
- `/admin/dashboard` 접근 시 → 홈(`/`) 또는 고객 대시보드로 리다이렉트

## 📝 테스트 계정

다음 계정으로 로그인하면 어드민 대시보드에 접근할 수 있습니다:

### Admin 계정
- **이메일**: `admin@lerestaurant.com`
- **비밀번호**: `password123`
- **역할**: ADMIN

### Manager 계정
- **이메일**: `manager@lerestaurant.com`
- **비밀번호**: `password123`
- **역할**: MANAGER

## 🎯 대시보드에서 할 수 있는 것

어드민 대시보드(`/admin/dashboard`)에서 다음 기능에 빠르게 접근할 수 있습니다:

1. **Reservation Management** - 예약 관리
2. **Orders** - 주문 보기
3. **Menu Management** - 메뉴 관리
4. **Users** - 사용자 관리
5. **Payments** - 결제 관리
6. **Delivery Management** - 배송 관리

## 💡 팁

- 대시보드는 **통계 정보**를 표시합니다:
  - Total Revenue (총 수익)
  - Pending Orders (대기 중인 주문)
  - Active Reservations (활성 예약)
  - Active Users (활성 사용자)

- 각 Quick Action 카드를 클릭하면 해당 관리 페이지로 이동합니다.

---

**참고**: [라우팅 검증](./02-routing-verification.md) | [UX 네비게이션 개선](./03-ux-navigation-improvements.md)

