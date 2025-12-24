# 🚀 F108 Testing - Quick Start Implementation Guide

> **For**: 40-Year Veteran Developer  
> **Time to Implement**: ~2-3 hours for full coverage  
> **Priority**: Guest Reservation Flow first  

---

## 🎯 Phase 1: Backend Tests (Priority 1 - 45 minutes)

### Step 1: Extend User.UserRole Enum (5 min)

**File**: `backend/src/main/java/com/lerestaurant/le_restaurant_backend/entity/User.java`

```java
public enum UserRole {
    CUSTOMER, MANAGER, ADMIN // Keep these for authenticated users
    // Note: For guests, still use CUSTOMER role with passwordHash="GUEST_USER" as marker
}
```

**Rationale**: No need for separate GUEST role. Use `CUSTOMER` with special password hash to identify guests.

---

### Step 2: Implement Core Guest Flow Test (20 min)

**File**: `backend/src/test/java/com/lerestaurant/le_restaurant_backend/service/ReservationServiceTest.java`

**Add this test** (copy-paste ready):

```java
@Test
@DisplayName("Should create reservation for NEW guest with auto-generated user account")
void createReservation_NewGuest_AutoCreatesUserAccount() {
    // GIVEN: New guest (email not in system)
    ReservationCreateRequestDto request = new ReservationCreateRequestDto();
    request.setCustomerId(null);
    request.setTableId(null);
    request.setNumberOfGuests(4);
    request.setReservationDateTime(OffsetDateTime.of(
        LocalDate.parse("2025-11-15"),
        LocalTime.parse("19:00"),
        ZoneOffset.of("+10:00")
    ));
    request.setGuestName("John Smith");
    request.setGuestEmail("john@example.com");
    request.setGuestPhone("+61-412-345-678");
    request.setSpecialRequests("Window seat preferred");

    User guestUser = new User();
    guestUser.setId(999L);
    guestUser.setEmail("john@example.com");
    guestUser.setFirstName("John");
    guestUser.setLastName("Smith");
    guestUser.setRole(User.UserRole.CUSTOMER);
    guestUser.setPasswordHash("GUEST_USER");

    RestaurantTable table = new RestaurantTable();
    table.setId(2L);
    table.setTableNumber("B2");
    table.setCapacity(4);
    table.setStatus(RestaurantTable.TableStatus.AVAILABLE);

    Reservation savedReservation = new Reservation();
    savedReservation.setId(100L);
    savedReservation.setCustomer(guestUser);
    savedReservation.setTable(table);
    savedReservation.setReservationDate(LocalDate.parse("2025-11-15"));
    savedReservation.setReservationTime(LocalTime.parse("19:00"));
    savedReservation.setNumberOfGuests(4);
    savedReservation.setStatus(Reservation.ReservationStatus.PENDING);
    savedReservation.setSpecialRequests("Window seat preferred");

    when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());
    when(userRepository.save(any(User.class))).thenReturn(guestUser);
    when(restaurantTableRepository.findByStatus(RestaurantTable.TableStatus.AVAILABLE))
        .thenReturn(Arrays.asList(table));
    when(reservationRepository.findByReservationDateAndReservationTime(
        any(LocalDate.class), any(LocalTime.class)))
        .thenReturn(List.of());
    when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

    // WHEN: Guest creates reservation
    ReservationDto result = reservationService.createReservation(request);

    // THEN: User account is auto-created
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository, times(1)).save(userCaptor.capture());
    User capturedUser = userCaptor.getValue();

    assertEquals("John", capturedUser.getFirstName());
    assertEquals("Smith", capturedUser.getLastName());
    assertEquals("john@example.com", capturedUser.getEmail());
    assertEquals(User.UserRole.CUSTOMER, capturedUser.getRole());
    assertEquals("GUEST_USER", capturedUser.getPasswordHash());

    // AND: Reservation is created
    assertNotNull(result);
    assertEquals(100L, result.getId());
    assertEquals("PENDING", result.getStatus());
}
```

---

### Step 3: Add Time Slot Test (10 min)

```java
@Test
@DisplayName("Should generate 10 time slots from 17:00 to 21:30")
void getAvailableTimeSlots_GeneratesCorrectSlots() {
    // GIVEN: No reservations
    RestaurantTable table = new RestaurantTable();
    table.setId(1L);
    table.setCapacity(4);
    table.setStatus(RestaurantTable.TableStatus.AVAILABLE);

    when(restaurantTableRepository.findByStatus(RestaurantTable.TableStatus.AVAILABLE))
        .thenReturn(Arrays.asList(table));
    when(reservationRepository.findByReservationDateAndReservationTime(
        any(LocalDate.class), any(LocalTime.class)))
        .thenReturn(List.of());

    // WHEN: Generate time slots
    List<TimeSlotDto> result = reservationService.getAvailableTimeSlots("2025-11-15", 2);

    // THEN: 10 slots generated
    assertNotNull(result);
    assertEquals(10, result.size());
    assertEquals("17:00", result.get(0).getTime());
    assertEquals("21:30", result.get(9).getTime());
    assertTrue(result.stream().allMatch(TimeSlotDto::isAvailable));
}
```

---

### Step 4: Run Tests (10 min)

```bash
cd backend
./gradlew test --tests "ReservationServiceTest"
./gradlew jacocoTestReport
```

**Expected**: 2 tests pass, coverage increases to ~60%+

---

## 🎨 Phase 2: Frontend Tests (Priority 1 - 60 minutes)

### Step 1: ReservationForm User Interaction Test (30 min)

**File**: `frontend/src/components/molecules/__tests__/ReservationForm.test.tsx`

**Create new file**:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReservationForm } from '../ReservationForm';

describe('ReservationForm - F108 Guest Flow', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockGetTimeSlots = vi.fn();
  const mockGetAvailableTables = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock time slots response
    mockGetTimeSlots.mockResolvedValue([
      { time: '17:00', isAvailable: true, availableTables: [] },
      { time: '17:30', isAvailable: true, availableTables: [] },
      { time: '18:00', isAvailable: true, availableTables: [] },
      // ... more slots
    ]);

    // Mock available tables response
    mockGetAvailableTables.mockResolvedValue([
      { id: 1, number: 'A1', capacity: 2, location: 'Window', isAvailable: true, features: [] },
      { id: 2, number: 'B2', capacity: 4, location: 'Center', isAvailable: true, features: [] },
    ]);
  });

  it('should populate time slots when date is selected', async () => {
    // Mock the hook
    vi.mock('../../../hooks/useReservationApi', () => ({
      useReservationApi: () => ({
        getTimeSlots: mockGetTimeSlots,
        getAvailableTables: mockGetAvailableTables,
      }),
    }));

    const user = userEvent.setup();

    render(
      <ReservationForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Select a date
    const dateInput = screen.getByLabelText(/Reservation Date/i);
    await user.type(dateInput, '2025-11-15');

    // Wait for time slots to load
    await waitFor(() => {
      expect(mockGetTimeSlots).toHaveBeenCalledWith('2025-11-15', 2); // default party size
    });

    // Verify time dropdown has options
    const timeSelect = screen.getByRole('combobox', { name: /Time/i });
    expect(timeSelect).toBeInTheDocument();
  });

  it('should validate guest information before submission', async () => {
    const user = userEvent.setup();

    render(
      <ReservationForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Reserve Table|Book Table/i });
    await user.click(submitButton);

    // Expect validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });

    // Verify onSubmit was NOT called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid guest reservation data', async () => {
    const user = userEvent.setup();

    render(
      <ReservationForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Fill in all required fields
    await user.type(screen.getByLabelText(/Reservation Date/i), '2025-11-15');
    
    await waitFor(() => {
      const timeSelect = screen.getByRole('combobox', { name: /Time/i });
      return timeSelect;
    });
    
    await user.selectOptions(screen.getByRole('combobox', { name: /Time/i }), '19:00');
    await user.type(screen.getByLabelText(/Name/i), 'John Smith');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '+61-412-345-678');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Reserve Table|Book Table/i });
    await user.click(submitButton);

    // Verify onSubmit called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          date: '2025-11-15',
          time: '19:00',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          customerPhone: '+61-412-345-678',
        })
      );
    });
  });
});
```

---

### Step 2: Run Frontend Tests (10 min)

```bash
cd frontend
npm run test -- ReservationForm
npm run test:coverage
```

**Expected**: 3 tests pass, component coverage ~75%+

---

### Step 3: ReservationModal Auth Detection Test (20 min)

**File**: `frontend/src/components/organisms/__tests__/ReservationModal.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReservationModal } from '../ReservationModal';
import { AuthContext } from '../../../contexts/AuthContext';

describe('ReservationModal - F108 Auth Detection', () => {
  it('should pre-fill form for authenticated customer', () => {
    const mockUser = {
      id: 3,
      email: 'customer@lerestaurant.com',
      firstName: 'Customer',
      lastName: 'User',
      phoneNumber: '+61-410-000-000',
      role: 'customer',
    };

    const mockAuthContext = {
      user: mockUser,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
      session: null,
      isLoading: false,
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ReservationModal isOpen={true} onClose={vi.fn()} />
      </AuthContext.Provider>
    );

    // Verify form fields are pre-filled
    expect(screen.getByDisplayValue('Customer User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('customer@lerestaurant.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+61-410-000-000')).toBeInTheDocument();
  });

  it('should show empty form for guest users', () => {
    const mockAuthContext = {
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      updateProfile: vi.fn(),
      session: null,
      isLoading: false,
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ReservationModal isOpen={true} onClose={vi.fn()} />
      </AuthContext.Provider>
    );

    // Verify fields are empty (using placeholders)
    const nameInput = screen.getByPlaceholderText(/name/i);
    expect(nameInput).toHaveValue('');
  });
});
```

---

## 📊 Coverage Verification (15 min)

### Backend Coverage Check
```bash
cd backend
./gradlew jacocoTestCoverageVerification
```

**Target**: 80%+ for ReservationService

### Frontend Coverage Check
```bash
cd frontend
npm run test:coverage
```

**Target**: 80%+ for ReservationForm, ReservationModal

---

## ✅ Quick Wins Checklist

**Phase 1 Complete (Backend)**:
- [x] Guest auto-creates user account test
- [x] Time slot generation test
- [x] Run and verify 80%+ coverage

**Phase 2 Complete (Frontend)**:
- [x] Date selection triggers time slots
- [x] Form validation test
- [x] Auth detection pre-fill test
- [x] Run and verify 80%+ coverage

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add edge case tests** (past dates, solo diners, large parties)
2. **Integration tests** (full flow from modal open to success)
3. **Performance tests** (concurrent booking scenarios)
4. **Accessibility tests** (keyboard navigation, screen readers)

---

## 📞 Troubleshooting

**Issue**: Tests fail due to missing mock data  
**Solution**: Check `mockReservations` and `mockTables` arrays in setup

**Issue**: Frontend tests timeout  
**Solution**: Increase timeout in `vitest.config.ts`: `testTimeout: 10000`

**Issue**: Coverage below 80%  
**Solution**: Add tests for error branches (try/catch blocks, validation failures)

---

**Estimated Total Time**: 2-3 hours for comprehensive coverage  
**Immediate Priority**: Phase 1 Backend Tests (45 min) → Deploy confidence ✅
