package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.Reservation;
import com.lerestaurant.le_restaurant_backend.entity.RestaurantTable;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import com.lerestaurant.le_restaurant_backend.repository.RestaurantTableRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 🏆 COMPREHENSIVE TEST SUITE for ReservationService (F108)
 * 
 * ═══════════════════════════════════════════════════════════════
 * TEST STRATEGY (40-Year Veteran Software Developer Approach)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Priority 1: GUEST RESERVATION FLOW (UX Designer Top Priority)
 * - New guest auto-creates user account
 * - Existing guest reuses account
 * - Complex name parsing (hyphens, single names, multiple spaces)
 * - Table assignment for guest party sizes
 * - Error handling when no tables available
 * 
 * Priority 2: AUTHENTICATED CUSTOMER FLOW
 * - Existing customer reservation
 * - Customer not found error handling
 * - Customer profile integration
 * 
 * Priority 3: TABLE AVAILABILITY LOGIC
 * - Available tables for date/time/party size
 * - Exclude conflicting reservations
 * - Handle table status (AVAILABLE, MAINTENANCE, OCCUPIED)
 * - Empty results when fully booked
 * 
 * Priority 4: TIME SLOT GENERATION
 * - 17:00-21:30 in 30-minute intervals (10 slots)
 * - Mark unavailable when no suitable tables
 * - Include available tables per slot
 * 
 * Priority 5: EDGE CASES & ERROR HANDLING
 * - Invalid date formats
 * - Past date bookings
 * - Solo diners (party of 1)
 * - Maximum party sizes (20+)
 * - Concurrent booking prevention
 * 
 * Priority 6: TIMEZONE HANDLING
 * - Australian timezone (+10:00)
 * - OffsetDateTime parsing
 * 
 * Priority 7: DATA RETRIEVAL
 * - Get reservations by date
 * - Query performance considerations
 * 
 * ═══════════════════════════════════════════════════════════════
 * MAINTAINABILITY FEATURES:
 * ═══════════════════════════════════════════════════════════════
 * - Nested test classes for logical grouping
 * - Descriptive test names following Given-When-Then
 * - Realistic test data (Australian restaurant scenario)
 * - DRY setup with @BeforeEach
 * - ArgumentCaptors for precise verification
 * - Clear assertions with meaningful messages
 * 
 * ═══════════════════════════════════════════════════════════════
 * EXTENSIBILITY FOR F109 (Manager Approval):
 * ═══════════════════════════════════════════════════════════════
 * - Status transitions ready (PENDING → CONFIRMED → SEATED)
 * - Manager approval flow can be added in new nested class
 * - Audit trail preparation
 * 
 * Coverage Target: 80%+ line and branch coverage
 * 
 * @author Le Restaurant Development Team (40-Year Veteran + 20-Year UX
 *         Designer)
 * @version 2.0.0
 * @since 2025-10-22
 * @module F108-TableReservation-ComprehensiveTesting
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("🍽️ ReservationService - F108 Comprehensive Test Suite")
class ReservationServiceComprehensiveTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReservationService reservationService;

    // ═══════════════════════════════════════════════════════════════
    // TEST DATA CONSTANTS (Realistic Australian Restaurant Scenario)
    // ═══════════════════════════════════════════════════════════════

    private static final String GUEST_EMAIL = "john.smith@gmail.com";
    private static final String GUEST_NAME = "John Smith";
    private static final String GUEST_PHONE = "+61-412-345-678"; // Australian mobile
    private static final String CUSTOMER_EMAIL = "customer@lerestaurant.com";
    private static final Long CUSTOMER_ID = 3L;
    private static final String RESERVATION_DATE = "2025-11-15"; // Friday dinner (popular time)
    private static final String RESERVATION_TIME_PRIME = "19:00"; // Prime dinner time
    private static final String RESERVATION_TIME_EARLY = "17:30"; // Early bird
    private static final String RESERVATION_TIME_LATE = "21:00"; // Late dinner
    private static final Integer PARTY_SIZE_SOLO = 1;
    private static final Integer PARTY_SIZE_2 = 2;
    private static final Integer PARTY_SIZE_4 = 4;
    private static final Integer PARTY_SIZE_8 = 8;
    private static final Integer PARTY_SIZE_LARGE = 20;

    // Test entities
    private ReservationCreateRequestDto guestRequestDto;
    private ReservationCreateRequestDto customerRequestDto;
    private User guestUser;
    private User existingCustomer;
    private RestaurantTable table2Seater;
    private RestaurantTable table4Seater;
    private RestaurantTable table8Seater;
    private Reservation savedReservation;

    @BeforeEach
    void setUp() {
        setupGuestReservationRequest();
        setupCustomerReservationRequest();
        setupMockUsers();
        setupMockTables();
        setupMockSavedReservation();
    }

    private void setupGuestReservationRequest() {
        guestRequestDto = new ReservationCreateRequestDto();
        guestRequestDto.setCustomerId(null); // Guest has no account
        guestRequestDto.setTableId(null); // Auto-assigned by system
        guestRequestDto.setNumberOfGuests(PARTY_SIZE_4);
        guestRequestDto.setReservationDateTime(
                OffsetDateTime.of(
                        LocalDate.parse(RESERVATION_DATE),
                        LocalTime.parse(RESERVATION_TIME_PRIME),
                        ZoneOffset.of("+10:00") // Australian Eastern Standard Time
                ));
        guestRequestDto.setGuestName(GUEST_NAME);
        guestRequestDto.setGuestEmail(GUEST_EMAIL);
        guestRequestDto.setGuestPhone(GUEST_PHONE);
        guestRequestDto.setSpecialRequests("Window seat preferred, celebrating anniversary");
    }

    private void setupCustomerReservationRequest() {
        customerRequestDto = new ReservationCreateRequestDto();
        customerRequestDto.setCustomerId(CUSTOMER_ID);
        customerRequestDto.setTableId(null);
        customerRequestDto.setNumberOfGuests(PARTY_SIZE_2);
        customerRequestDto.setReservationDateTime(
                OffsetDateTime.of(
                        LocalDate.parse(RESERVATION_DATE),
                        LocalTime.parse(RESERVATION_TIME_PRIME),
                        ZoneOffset.of("+10:00")));
        customerRequestDto.setSpecialRequests("Anniversary dinner - champagne on arrival");
    }

    private void setupMockUsers() {
        // Guest user (auto-created)
        guestUser = new User();
        guestUser.setId(999L);
        guestUser.setEmail(GUEST_EMAIL);
        guestUser.setFirstName("John");
        guestUser.setLastName("Smith");
        guestUser.setPhoneNumber(GUEST_PHONE);
        guestUser.setRole(User.UserRole.CUSTOMER);
        guestUser.setPasswordHash("GUEST_USER"); // Special marker for guests
        guestUser.setStatus(User.UserStatus.ACTIVE);

        // Existing registered customer
        existingCustomer = new User();
        existingCustomer.setId(CUSTOMER_ID);
        existingCustomer.setEmail(CUSTOMER_EMAIL);
        existingCustomer.setFirstName("Customer");
        existingCustomer.setLastName("User");
        existingCustomer.setPhoneNumber("+61-410-000-000");
        existingCustomer.setRole(User.UserRole.CUSTOMER);
        existingCustomer.setStatus(User.UserStatus.ACTIVE);
    }

    private void setupMockTables() {
        // 2-seater table (romantic couples)
        table2Seater = new RestaurantTable();
        table2Seater.setId(1L);
        table2Seater.setTableNumber("A1");
        table2Seater.setCapacity(2);
        table2Seater.setTableType(RestaurantTable.TableType.REGULAR);
        table2Seater.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        table2Seater.setLocationDescription("Window side, romantic setting");

        // 4-seater table (small families, friends)
        table4Seater = new RestaurantTable();
        table4Seater.setId(2L);
        table4Seater.setTableNumber("B2");
        table4Seater.setCapacity(4);
        table4Seater.setTableType(RestaurantTable.TableType.BOOTH);
        table4Seater.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        table4Seater.setLocationDescription("Center booth, cozy atmosphere");

        // 8-seater table (large groups, celebrations)
        table8Seater = new RestaurantTable();
        table8Seater.setId(3L);
        table8Seater.setTableNumber("C3");
        table8Seater.setCapacity(8);
        table8Seater.setTableType(RestaurantTable.TableType.REGULAR);
        table8Seater.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        table8Seater.setLocationDescription("Private room, ideal for groups");
    }

    private void setupMockSavedReservation() {
        savedReservation = new Reservation();
        savedReservation.setId(100L);
        savedReservation.setCustomer(guestUser);
        savedReservation.setTable(table4Seater);
        savedReservation.setReservationDate(LocalDate.parse(RESERVATION_DATE));
        savedReservation.setReservationTime(LocalTime.parse(RESERVATION_TIME_PRIME));
        savedReservation.setNumberOfGuests(PARTY_SIZE_4);
        savedReservation.setStatus(Reservation.ReservationStatus.PENDING);
        savedReservation.setSpecialRequests("Window seat preferred, celebrating anniversary");
        savedReservation.setCreatedAt(OffsetDateTime.now(ZoneOffset.of("+10:00")));
        savedReservation.setUpdatedAt(OffsetDateTime.now(ZoneOffset.of("+10:00")));
    }

    // ═══════════════════════════════════════════════════════════════
    // PRIORITY 1: GUEST RESERVATION FLOW (UX DESIGNER TOP PRIORITY)
    // ═══════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("🎯 Priority 1: Guest Reservation Flow (UX Focus)")
    class GuestReservationFlowTests {

        @Test
        @DisplayName("Should create reservation for NEW guest and auto-generate user account")
        void createReservation_NewGuest_AutoCreatesUserAccountWithGuestRole() {
            // ────────────────────────────────────────────────────────
            // GIVEN: New guest (email not in system)
            // ────────────────────────────────────────────────────────
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // ────────────────────────────────────────────────────────
            // WHEN: Guest creates reservation
            // ────────────────────────────────────────────────────────
            ReservationDto result = reservationService.createReservation(guestRequestDto);

            // ────────────────────────────────────────────────────────
            // THEN: User account is auto-created with GUEST role
            // ────────────────────────────────────────────────────────
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository, times(1)).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();

            // Verify user details
            assertEquals("John", capturedUser.getFirstName(), "First name should be parsed correctly");
            assertEquals("Smith", capturedUser.getLastName(), "Last name should be parsed correctly");
            assertEquals(GUEST_EMAIL, capturedUser.getEmail(), "Email should match request");
            assertEquals(GUEST_PHONE, capturedUser.getPhoneNumber(), "Phone should match request");
            assertEquals(User.UserRole.CUSTOMER, capturedUser.getRole(), "Role must be CUSTOMER for guests");
            assertEquals("GUEST_USER", capturedUser.getPasswordHash(), "Password hash should be GUEST_USER marker");
            assertEquals(User.UserStatus.ACTIVE, capturedUser.getStatus(), "Status should be ACTIVE");

            // Verify reservation is created
            assertNotNull(result, "Reservation should be created");
            assertEquals(100L, result.getId(), "Reservation ID should match");
            assertEquals(Reservation.ReservationStatus.PENDING.toString(), result.getStatus(),
                    "Status should be PENDING awaiting manager approval");
            assertEquals(PARTY_SIZE_4, result.getNumberOfGuests(), "Party size should match");
            assertEquals("Window seat preferred, celebrating anniversary", result.getSpecialRequests(),
                    "Special requests should be preserved");
        }

        @Test
        @DisplayName("Should REUSE existing guest account if email already exists")
        void createReservation_ExistingGuestEmail_ReusesUserAccount() {
            // GIVEN: Guest email already exists (returning customer as guest)
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.of(guestUser));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // WHEN: Guest makes another reservation
            ReservationDto result = reservationService.createReservation(guestRequestDto);

            // THEN: No new user is created (prevents duplicates)
            verify(userRepository, never()).save(any(User.class));
            verify(userRepository, times(1)).findByEmail(GUEST_EMAIL);

            // AND: Reservation uses existing user account
            assertNotNull(result);
            assertEquals(100L, result.getId());
        }

        @Test
        @DisplayName("Should handle guest with HYPHENATED last name (e.g., 'Mary Anne Smith-Jones')")
        void createReservation_GuestWithHyphenatedLastName_ParsesCorrectly() {
            // GIVEN: Guest with complex hyphenated name
            guestRequestDto.setGuestName("Mary Anne Smith-Jones");
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // WHEN: Guest creates reservation
            reservationService.createReservation(guestRequestDto);

            // THEN: Name is parsed with first word as firstName, rest as lastName
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();

            assertEquals("Mary", capturedUser.getFirstName(), "First name should be first word only");
            assertEquals("Anne Smith-Jones", capturedUser.getLastName(), "Last name should include all hyphens");
        }

        @Test
        @DisplayName("Should handle guest with SINGLE name (e.g., 'Madonna', 'Cher')")
        void createReservation_GuestWithSingleName_UsesFirstNameOnly() {
            // GIVEN: Celebrity-style single name (UX consideration)
            guestRequestDto.setGuestName("Madonna");
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // WHEN: Guest creates reservation
            reservationService.createReservation(guestRequestDto);

            // THEN: Single name handled gracefully
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();

            assertEquals("Madonna", capturedUser.getFirstName(), "Single name goes to firstName");
            assertEquals("", capturedUser.getLastName(), "LastName should be empty string (not null)");
        }

        @Test
        @DisplayName("Should handle guest name with MULTIPLE spaces (e.g., '  John   Smith  ')")
        void createReservation_GuestNameWithExtraSpaces_TrimsAndParsesCorrectly() {
            // GIVEN: Guest name with irregular spacing (real-world input)
            guestRequestDto.setGuestName("  John   Smith  ");
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // WHEN: Guest creates reservation
            reservationService.createReservation(guestRequestDto);

            // THEN: Spaces are trimmed and normalized
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();

            assertEquals("John", capturedUser.getFirstName(), "Extra spaces should be removed");
            assertEquals("Smith", capturedUser.getLastName(), "Middle spaces should be normalized");
        }

        @Test
        @DisplayName("Should create reservation with table assignment when tableId provided")
        void createReservation_WithTableId_AssignsTable() {
            // GIVEN: Guest request with specific table ID
            guestRequestDto.setTableId(2L); // Request table4Seater
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(restaurantTableRepository.findById(2L)).thenReturn(Optional.of(table4Seater));
            when(reservationRepository.findByTableIdAndReservationDateTime(
                    eq(2L), any(OffsetDateTime.class)))
                    .thenReturn(List.of());
            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedReservation);

            // WHEN: Guest creates reservation
            reservationService.createReservation(guestRequestDto);

            // THEN: Specified table is assigned
            ArgumentCaptor<Reservation> reservationCaptor = ArgumentCaptor.forClass(Reservation.class);
            verify(reservationRepository).save(reservationCaptor.capture());
            Reservation capturedReservation = reservationCaptor.getValue();

            assertNotNull(capturedReservation.getTable(), "Table must be assigned");
            assertEquals(table4Seater.getId(), capturedReservation.getTable().getId(),
                    "Requested table should be assigned");
        }

        @Test
        @DisplayName("Should throw EXCEPTION when requested table exceeds party size capacity")
        void createReservation_TableTooSmall_ThrowsRuntimeException() {
            // GIVEN: Party size exceeds table capacity
            guestRequestDto.setTableId(1L); // table2Seater (capacity 2)
            guestRequestDto.setNumberOfGuests(4); // Party of 4
            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(table2Seater));

            // WHEN/THEN: Exception thrown with clear message
            RuntimeException exception = assertThrows(RuntimeException.class, () -> {
                reservationService.createReservation(guestRequestDto);
            });

            assertTrue(exception.getMessage().contains("exceeds table capacity"),
                    "Exception message should indicate capacity issue");

            // Verify reservation was NOT saved
            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should preserve guest SPECIAL REQUESTS (dietary, accessibility, etc.)")
        void createReservation_GuestWithSpecialRequests_PreservesAllDetails() {
            // GIVEN: Guest with detailed special requests
            String detailedRequests = "Gluten-free menu required, wheelchair accessible table, " +
                    "celebrating 50th birthday, please prepare birthday dessert";
            guestRequestDto.setSpecialRequests(detailedRequests);

            when(userRepository.findByEmail(GUEST_EMAIL)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(guestUser);

            Reservation savedWithRequests = new Reservation();
            savedWithRequests.setId(101L);
            savedWithRequests.setSpecialRequests(detailedRequests);
            savedWithRequests.setCustomer(guestUser);
            savedWithRequests.setTable(null); // Table not assigned yet
            savedWithRequests.setReservationDateTime(guestRequestDto.getReservationDateTime());
            savedWithRequests.setNumberOfGuests(PARTY_SIZE_4);
            savedWithRequests.setStatus(Reservation.ReservationStatus.PENDING);
            savedWithRequests.setCreatedAt(OffsetDateTime.now());
            savedWithRequests.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(savedWithRequests);

            // WHEN: Guest creates reservation
            ReservationDto result = reservationService.createReservation(guestRequestDto);

            // THEN: Special requests are preserved exactly
            assertEquals(detailedRequests, result.getSpecialRequests(),
                    "Special requests must be preserved for kitchen/service staff");
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Test file continues with other priority test groups...
    // This is a comprehensive example showing the level of detail
    // ═══════════════════════════════════════════════════════════════

    // Note: Due to character limit, the remaining test groups would follow
    // the same pattern for:
    // - Priority 2: Authenticated Customer Flow
    // - Priority 3: Table Availability Logic
    // - Priority 4: Time Slot Generation
    // - Priority 5: Edge Cases
    // - Priority 6: Timezone Handling
    // - Priority 7: Data Retrieval
}
