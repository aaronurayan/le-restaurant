# F108 Table Reservation - Quick Test Guide

**Quick reference for running JUnit tests for F108 Table Reservation feature**

---

## 🚀 Quick Start

### Run All Tests
```powershell
cd backend
./gradlew test
```

### Run Only F108 Reservation Tests
```powershell
./gradlew test --tests "*ReservationService*Test"
```

### Run With Coverage Report
```powershell
./gradlew test jacocoTestReport
```

### Open Coverage Report
```powershell
# After running tests with coverage
start build/reports/jacoco/test/html/index.html
```

---

## 📊 Test Files

| File | Tests | Purpose |
|------|-------|---------|
| `ReservationServiceTest.java` | 32 | Core CRUD operations + F109 approval |
| `ReservationServiceEnhancedTest.java` | 29 | Guest bookings, availability, edge cases |
| **Total** | **61** | **100% Pass Rate** |

---

## ✅ What's Tested

### F108 Customer Features
- ✅ Create reservation (authenticated customer)
- ✅ Create reservation (guest with email/name)
- ✅ View reservations by customer
- ✅ View reservations by date
- ✅ Check available time slots (17:00-21:30)
- ✅ Check available tables (by capacity & time)
- ✅ Cancel reservation
- ✅ Table conflict detection

### F109 Manager Features (Related)
- ✅ Approve reservation (PENDING → CONFIRMED)
- ✅ Reject reservation (PENDING → CANCELLED)
- ✅ Complete reservation (CONFIRMED → COMPLETED)

### Edge Cases
- ✅ Past date validation
- ✅ Table capacity validation
- ✅ Double booking prevention
- ✅ Missing guest email/name
- ✅ Null table handling
- ✅ Cancelled reservation reuse

---

## 🎯 Expected Results

```
BUILD SUCCESSFUL
Tests: 61, Failures: 0, Errors: 0, Skipped: 0
Coverage: 85-90% (Target: 80%)
```

---

## 🐛 Troubleshooting

### Tests Not Running?
```powershell
# Clean and rebuild
./gradlew clean test
```

### Coverage Report Not Generated?
```powershell
# Ensure you run jacocoTestReport after test
./gradlew test jacocoTestReport
```

### Java Version Issues?
```powershell
# Check Java version (must be 17)
java -version

# Set Java 17 if needed
$env:JAVA_HOME="C:\Program Files\Java\jdk-17"
```

---

## 📝 Test Naming Convention

```java
methodName_Scenario_ExpectedBehavior()
```

**Examples:**
- `createReservation_WithNewGuestCustomer_ReturnsCreatedReservation`
- `getAvailableTimeSlots_WithNoAvailableTables_MarksAllSlotsUnavailable`
- `cancelReservation_WithCompletedStatus_ThrowsException`

---

## 📚 Related Documents

- **Full Test Summary**: `F108_TEST_SUITE_SUMMARY.md`
- **Test Case Reference**: `design-plan-reference/07-overall-test-case.md`
- **Architecture**: `design-plan-reference/02-system-architecture.md`

---

**Last Updated**: October 22, 2025  
**Status**: ✅ All 61 Tests Passing
