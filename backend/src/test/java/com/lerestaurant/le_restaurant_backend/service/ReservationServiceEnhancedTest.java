package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.dto.TableDto;
import com.lerestaurant.le_restaurant_backend.dto.TimeSlotDto;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import com.lerestaurant.le_restaurant_backend.repository.RestaurantTableRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Enhanced Unit Tests for ReservationService (F108 - Table Reservation)
 * 
 * This test suite provides comprehensive coverage for:
 * - Guest reservation creation
 * - Table availability checking
 * - Time slot generation
 * - Table conflict detection
 * - Edge cases and validation scenarios
 * 
 * Targets 80%+ code coverage for ReservationService
 * 
 * @author Le Restaurant Development Team
 * @module F108-CustomerReservation
 * @see com.lerestaurant.le_restaurant_backend.service.ReservationServiceTest
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ReservationService Enhanced Tests (F108)")
class ReservationServiceEnhancedTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User testCustomer;
    private RestaurantTable testTable;
    private Reservation testReservation;

    @BeforeEach
    void setUp() {
        // Setup test customer
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@example.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");
        testCustomer.setPhoneNumber("0412345678");
        testCustomer.setRole(User.UserRole.CUSTOMER);
        testCustomer.setStatus(User.UserStatus.ACTIVE);

        // Setup test table
        testTable = new RestaurantTable();
        testTable.setId(1L);
        testTable.setTableNumber("A1");
        testTable.setCapacity(4);
        testTable.setTableType(RestaurantTable.TableType.REGULAR);
        testTable.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        testTable.setLocationDescription("Window side, romantic setting");

        // Setup test reservation
        testReservation = new Reservation();
        testReservation.setId(1L);
        testReservation.setCustomer(testCustomer);
        testReservation.setTable(testTable);
        testReservation.setReservationDate(LocalDate.now().plusDays(1));
        testReservation.setReservationTime(LocalTime.of(19, 0));
        testReservation.setNumberOfGuests(2);
        testReservation.setStatus(Reservation.ReservationStatus.PENDING);
        testReservation.setCreatedAt(OffsetDateTime.now());
    }

    // =================================================================
    // Guest Reservation Tests (F108 - Guest Booking)
    // =================================================================
    @Nested
    @DisplayName("Guest Reservation Tests (F108)")
    class GuestReservationTests {

        @Test
        @DisplayName("Should create reservation for new guest customer")
        void createReservation_WithNewGuestCustomer_ReturnsCreatedReservation() {
            // Given - Guest reservation without customerId
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null); // Guest reservation
            guestRequest.setGuestName("Jane Smith");
            guestRequest.setGuestEmail("jane.smith@example.com");
            guestRequest.setGuestPhone("0423456789");
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            User newGuestUser = new User();
            newGuestUser.setId(10L);
            newGuestUser.setEmail("jane.smith@example.com");
            newGuestUser.setFirstName("Jane");
            newGuestUser.setLastName("Smith");
            newGuestUser.setPhoneNumber("0423456789");
            newGuestUser.setRole(User.UserRole.CUSTOMER);

            Reservation guestReservation = new Reservation();
            guestReservation.setId(1L);
            guestReservation.setCustomer(newGuestUser);
            guestReservation.setReservationDate(LocalDate.now().plusDays(1));
            guestReservation.setReservationTime(LocalTime.of(19, 0));
            guestReservation.setNumberOfGuests(2);
            guestReservation.setStatus(Reservation.ReservationStatus.PENDING);
            guestReservation.setCreatedAt(OffsetDateTime.now());

            when(userRepository.findByEmail("jane.smith@example.com")).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(newGuestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(guestReservation);

            // When
            ReservationDto result = reservationService.createReservation(guestRequest);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo("PENDING");
            assertThat(result.getCustomerEmail()).isEqualTo("jane.smith@example.com");
            assertThat(result.getCustomerName()).contains("Jane");
            verify(userRepository, times(1)).save(any(User.class)); // Guest user created
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should create reservation for existing guest customer by email")
        void createReservation_WithExistingGuestEmail_ReusesExistingCustomer() {
            // Given - Guest with existing email
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null);
            guestRequest.setGuestName("John Doe");
            guestRequest.setGuestEmail("customer@example.com"); // Existing email
            guestRequest.setGuestPhone("0412345678");
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(testCustomer));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto result = reservationService.createReservation(guestRequest);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerId()).isEqualTo(1L); // Existing customer used
            verify(userRepository, never()).save(any(User.class)); // No new user created
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when guest email is missing")
        void createReservation_WithMissingGuestEmail_ThrowsException() {
            // Given
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null);
            guestRequest.setGuestName("Jane Smith");
            guestRequest.setGuestEmail(null); // Missing email
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(guestRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("email");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when guest name is missing")
        void createReservation_WithMissingGuestName_ThrowsException() {
            // Given
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null);
            guestRequest.setGuestName(null); // Missing name
            guestRequest.setGuestEmail("jane.smith@example.com");
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(guestRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("name");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should parse multi-word guest name into first and last name")
        void createReservation_WithMultiWordGuestName_ParsesNameCorrectly() {
            // Given
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null);
            guestRequest.setGuestName("Mary Jane Watson");
            guestRequest.setGuestEmail("mary.watson@example.com");
            guestRequest.setGuestPhone("0434567890");
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            User newGuestUser = new User();
            newGuestUser.setId(11L);
            newGuestUser.setEmail("mary.watson@example.com");
            newGuestUser.setFirstName("Mary");
            newGuestUser.setLastName("Jane Watson");
            newGuestUser.setRole(User.UserRole.CUSTOMER);

            Reservation guestReservation = new Reservation();
            guestReservation.setId(2L);
            guestReservation.setCustomer(newGuestUser);
            guestReservation.setReservationDate(LocalDate.now().plusDays(1));
            guestReservation.setReservationTime(LocalTime.of(19, 0));
            guestReservation.setNumberOfGuests(2);
            guestReservation.setStatus(Reservation.ReservationStatus.PENDING);
            guestReservation.setCreatedAt(OffsetDateTime.now());

            when(userRepository.findByEmail("mary.watson@example.com")).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(newGuestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(guestReservation);

            // When
            ReservationDto result = reservationService.createReservation(guestRequest);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerName()).contains("Mary");
            verify(userRepository, times(1)).save(argThat(user -> user.getFirstName().equals("Mary") &&
                    user.getLastName().equals("Jane Watson")));
        }
    }

    // =================================================================
    // Table Conflict Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Table Conflict Detection Tests (F108)")
    class TableConflictTests {

        @Test
        @DisplayName("Should throw exception when table is already booked at same time")
        void createReservation_WithBookedTable_ThrowsException() {
            // Given
            ReservationCreateRequestDto request = new ReservationCreateRequestDto();
            request.setCustomerId(1L);
            request.setTableId(1L);
            request.setNumberOfGuests(2);
            request.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            Reservation existingReservation = new Reservation();
            existingReservation.setId(2L);
            existingReservation.setCustomer(testCustomer);
            existingReservation.setTable(testTable);
            existingReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(reservationRepository.findByTableIdAndReservationDateTime(anyLong(), any(OffsetDateTime.class)))
                    .thenReturn(Arrays.asList(existingReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(request))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("already reserved");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should allow booking when previous reservation is cancelled")
        void createReservation_WithCancelledReservationAtSameTime_Succeeds() {
            // Given
            ReservationCreateRequestDto request = new ReservationCreateRequestDto();
            request.setCustomerId(1L);
            request.setTableId(1L);
            request.setNumberOfGuests(2);
            request.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            Reservation cancelledReservation = new Reservation();
            cancelledReservation.setId(2L);
            cancelledReservation.setCustomer(testCustomer);
            cancelledReservation.setTable(testTable);
            cancelledReservation.setStatus(Reservation.ReservationStatus.CANCELLED);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(reservationRepository.findByTableIdAndReservationDateTime(anyLong(), any(OffsetDateTime.class)))
                    .thenReturn(Arrays.asList(cancelledReservation));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto result = reservationService.createReservation(request);

            // Then
            assertThat(result).isNotNull();
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should allow creation without table assignment")
        void createReservation_WithoutTableId_SucceedsWithNullTable() {
            // Given
            ReservationCreateRequestDto request = new ReservationCreateRequestDto();
            request.setCustomerId(1L);
            request.setTableId(null); // No table specified
            request.setNumberOfGuests(2);
            request.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            testReservation.setTable(null);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto result = reservationService.createReservation(request);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getTableId()).isNull();
            verify(restaurantTableRepository, never()).findById(anyLong());
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should handle multiple cancelled reservations at same time")
        void createReservation_WithMultipleCancelledReservations_Succeeds() {
            // Given
            ReservationCreateRequestDto request = new ReservationCreateRequestDto();
            request.setCustomerId(1L);
            request.setTableId(1L);
            request.setNumberOfGuests(2);
            request.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            Reservation cancelled1 = new Reservation();
            cancelled1.setStatus(Reservation.ReservationStatus.CANCELLED);
            Reservation cancelled2 = new Reservation();
            cancelled2.setStatus(Reservation.ReservationStatus.CANCELLED);

            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(reservationRepository.findByTableIdAndReservationDateTime(anyLong(), any(OffsetDateTime.class)))
                    .thenReturn(Arrays.asList(cancelled1, cancelled2));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto result = reservationService.createReservation(request);

            // Then
            assertThat(result).isNotNull();
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }
    }

    // =================================================================
    // Get Reservations By Date Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Get Reservations By Date Tests (F108)")
    class GetReservationsByDateTests {

        @Test
        @DisplayName("Should return reservations for specific date")
        void getReservationsByDate_WithReservationsOnDate_ReturnsReservations() {
            // Given
            String dateString = "2025-11-01";
            LocalDate targetDate = LocalDate.parse(dateString);

            List<Reservation> dateReservations = Arrays.asList(testReservation);
            when(reservationRepository.findByReservationDate(targetDate)).thenReturn(dateReservations);

            // When
            List<ReservationDto> result = reservationService.getReservationsByDate(dateString);

            // Then
            assertThat(result).isNotNull();
            assertThat(result).hasSize(1);
            verify(reservationRepository, times(1)).findByReservationDate(targetDate);
        }

        @Test
        @DisplayName("Should return empty list when no reservations for date")
        void getReservationsByDate_WithNoReservations_ReturnsEmptyList() {
            // Given
            String dateString = "2025-12-25";
            LocalDate targetDate = LocalDate.parse(dateString);

            when(reservationRepository.findByReservationDate(targetDate)).thenReturn(Arrays.asList());

            // When
            List<ReservationDto> result = reservationService.getReservationsByDate(dateString);

            // Then
            assertThat(result).isNotNull();
            assertThat(result).isEmpty();
        }

        @ParameterizedTest
        @ValueSource(strings = { "2025-01-15", "2025-06-30", "2025-12-31" })
        @DisplayName("Should handle various date formats correctly")
        void getReservationsByDate_WithVariousDates_ParsesCorrectly(String dateString) {
            // Given
            LocalDate targetDate = LocalDate.parse(dateString);
            when(reservationRepository.findByReservationDate(targetDate)).thenReturn(Arrays.asList());

            // When
            List<ReservationDto> result = reservationService.getReservationsByDate(dateString);

            // Then
            assertThat(result).isNotNull();
            verify(reservationRepository, times(1)).findByReservationDate(targetDate);
        }
    }

    // =================================================================
    // Available Time Slots Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Available Time Slots Tests (F108)")
    class AvailableTimeSlotsTests {

        @Test
        @DisplayName("Should return time slots from 17:00 to 21:30")
        void getAvailableTimeSlots_WithAvailableTables_ReturnsAllTimeSlots() {
            // Given
            String dateString = "2025-11-01";
            Integer partySize = 2;

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList());

            // When
            List<TimeSlotDto> timeSlots = reservationService.getAvailableTimeSlots(dateString, partySize);

            // Then
            assertThat(timeSlots).isNotNull();
            assertThat(timeSlots.size()).isGreaterThan(0);
            assertThat(timeSlots).anyMatch(slot -> slot.getTime().equals("17:00"));
            assertThat(timeSlots).anyMatch(slot -> slot.getTime().equals("21:30"));
        }

        @Test
        @DisplayName("Should mark time slots as unavailable when no tables available")
        void getAvailableTimeSlots_WithNoAvailableTables_MarksAllSlotsUnavailable() {
            // Given
            String dateString = "2025-11-01";
            Integer partySize = 10; // Exceeds all table capacities

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable)); // Max capacity 4

            // When
            List<TimeSlotDto> timeSlots = reservationService.getAvailableTimeSlots(dateString, partySize);

            // Then
            assertThat(timeSlots).isNotNull();
            assertThat(timeSlots).allMatch(slot -> !slot.getIsAvailable());
        }

        @Test
        @DisplayName("Should mark specific time slot as unavailable when table is booked")
        void getAvailableTimeSlots_WithBookedTable_MarksSlotUnavailable() {
            // Given
            String dateString = "2025-11-01";
            Integer partySize = 2;
            LocalDate date = LocalDate.parse(dateString);
            LocalTime bookedTime = LocalTime.of(19, 0);

            Reservation bookedReservation = new Reservation();
            bookedReservation.setTable(testTable);
            bookedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(date, bookedTime))
                    .thenReturn(Arrays.asList(bookedReservation));
            when(reservationRepository.findByReservationDateAndReservationTime(eq(date),
                    argThat(time -> !time.equals(bookedTime))))
                    .thenReturn(Arrays.asList());

            // When
            List<TimeSlotDto> timeSlots = reservationService.getAvailableTimeSlots(dateString, partySize);

            // Then
            assertThat(timeSlots).isNotNull();
            TimeSlotDto slot19 = timeSlots.stream()
                    .filter(slot -> slot.getTime().equals("19:00"))
                    .findFirst()
                    .orElse(null);
            assertThat(slot19).isNotNull();
            assertThat(slot19.getIsAvailable()).isFalse();
        }

        @Test
        @DisplayName("Should generate 30-minute interval time slots")
        void getAvailableTimeSlots_Always_GeneratesThirtyMinuteIntervals() {
            // Given
            String dateString = "2025-11-01";
            Integer partySize = 2;

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList());

            // When
            List<TimeSlotDto> timeSlots = reservationService.getAvailableTimeSlots(dateString, partySize);

            // Then
            assertThat(timeSlots).isNotNull();
            // Verify consecutive slots are 30 minutes apart
            assertThat(timeSlots).anyMatch(slot -> slot.getTime().equals("17:00"));
            assertThat(timeSlots).anyMatch(slot -> slot.getTime().equals("17:30"));
            assertThat(timeSlots).anyMatch(slot -> slot.getTime().equals("18:00"));
        }
    }

    // =================================================================
    // Available Tables Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Available Tables Tests (F108)")
    class AvailableTablesTests {

        @Test
        @DisplayName("Should return tables with sufficient capacity")
        void getAvailableTables_WithSufficientCapacity_ReturnsTables() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 2;

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList());

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).isNotNull();
            assertThat(availableTables).hasSize(1);
            assertThat(availableTables.get(0).getCapacity()).isGreaterThanOrEqualTo(partySize);
        }

        @Test
        @DisplayName("Should exclude reserved tables from available tables")
        void getAvailableTables_WithReservedTable_ExcludesTable() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 2;

            Reservation existingReservation = new Reservation();
            existingReservation.setTable(testTable);
            existingReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList(existingReservation));

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).isEmpty();
        }

        @Test
        @DisplayName("Should include tables when reservation is cancelled")
        void getAvailableTables_WithCancelledReservation_IncludesTable() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 2;

            Reservation cancelledReservation = new Reservation();
            cancelledReservation.setTable(testTable);
            cancelledReservation.setStatus(Reservation.ReservationStatus.CANCELLED);

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList(cancelledReservation));

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).hasSize(1);
        }

        @Test
        @DisplayName("Should return empty list when party size exceeds all table capacities")
        void getAvailableTables_WithOversizedParty_ReturnsEmpty() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 20;

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable)); // Max capacity 4

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).isEmpty();
        }

        @Test
        @DisplayName("Should only return AVAILABLE status tables")
        void getAvailableTables_WithMixedTableStatuses_ReturnsOnlyAvailable() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 2;

            RestaurantTable availableTable = new RestaurantTable();
            availableTable.setId(1L);
            availableTable.setCapacity(4);
            availableTable.setStatus(RestaurantTable.TableStatus.AVAILABLE);

            RestaurantTable occupiedTable = new RestaurantTable();
            occupiedTable.setId(2L);
            occupiedTable.setCapacity(4);
            occupiedTable.setStatus(RestaurantTable.TableStatus.OCCUPIED);

            RestaurantTable maintenanceTable = new RestaurantTable();
            maintenanceTable.setId(3L);
            maintenanceTable.setCapacity(4);
            maintenanceTable.setStatus(RestaurantTable.TableStatus.MAINTENANCE);

            when(restaurantTableRepository.findAll())
                    .thenReturn(Arrays.asList(availableTable, occupiedTable, maintenanceTable));
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList());

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).hasSize(1); // Only available table
        }

        @Test
        @DisplayName("Should filter tables by exact capacity match")
        void getAvailableTables_WithExactCapacityMatch_ReturnsTables() {
            // Given
            String dateString = "2025-11-01";
            String timeString = "19:00";
            Integer partySize = 4; // Exact match with table capacity

            when(restaurantTableRepository.findAll()).thenReturn(Arrays.asList(testTable)); // Capacity 4
            when(reservationRepository.findByReservationDateAndReservationTime(any(LocalDate.class),
                    any(LocalTime.class)))
                    .thenReturn(Arrays.asList());

            // When
            List<TableDto> availableTables = reservationService.getAvailableTables(dateString, timeString, partySize);

            // Then
            assertThat(availableTables).hasSize(1);
            assertThat(availableTables.get(0).getCapacity()).isEqualTo(4);
        }
    }

    // =================================================================
    // Edge Case Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Edge Case Tests (F108)")
    class EdgeCaseTests {

        @Test
        @DisplayName("Should handle reservation with null table gracefully in DTO conversion")
        void getReservationById_WithNullTable_ReturnsNullTableFields() {
            // Given
            testReservation.setTable(null);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When
            ReservationDto result = reservationService.getReservationById(1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getTableId()).isNull();
            assertThat(result.getTableNumber()).isNull();
            assertThat(result.getTableLocation()).isNull();
        }

        @Test
        @DisplayName("Should handle customer with null name fields")
        void getReservationById_WithNullCustomerNames_ReturnsEmptyName() {
            // Given
            testCustomer.setFirstName(null);
            testCustomer.setLastName(null);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When
            ReservationDto result = reservationService.getReservationById(1L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getCustomerName()).isEmpty();
        }

        @Test
        @DisplayName("Should successfully cancel PENDING reservation")
        void cancelReservation_WithPendingStatus_ChangesStatusToCancelled() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.PENDING);

            Reservation cancelledReservation = new Reservation();
            cancelledReservation.setId(1L);
            cancelledReservation.setCustomer(testCustomer);
            cancelledReservation.setTable(testTable);
            cancelledReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            cancelledReservation.setReservationDate(LocalDate.now().plusDays(1));
            cancelledReservation.setReservationTime(LocalTime.of(19, 0));
            cancelledReservation.setNumberOfGuests(2);
            cancelledReservation.setCreatedAt(OffsetDateTime.now());
            cancelledReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(cancelledReservation);

            // When
            ReservationDto result = reservationService.cancelReservation(1L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when cancelling completed reservation")
        void cancelReservation_WithCompletedStatus_ThrowsException() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.COMPLETED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.cancelReservation(1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("completed");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should handle single-word guest name")
        void createReservation_WithSingleWordGuestName_SetsFirstNameOnly() {
            // Given
            ReservationCreateRequestDto guestRequest = new ReservationCreateRequestDto();
            guestRequest.setCustomerId(null);
            guestRequest.setGuestName("Madonna"); // Single word name
            guestRequest.setGuestEmail("madonna@example.com");
            guestRequest.setGuestPhone("0445678901");
            guestRequest.setNumberOfGuests(2);
            guestRequest.setReservationDateTime(
                    LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC));

            User newGuestUser = new User();
            newGuestUser.setId(12L);
            newGuestUser.setEmail("madonna@example.com");
            newGuestUser.setFirstName("Madonna");
            newGuestUser.setLastName("");
            newGuestUser.setRole(User.UserRole.CUSTOMER);

            Reservation guestReservation = new Reservation();
            guestReservation.setId(3L);
            guestReservation.setCustomer(newGuestUser);
            guestReservation.setReservationDate(LocalDate.now().plusDays(1));
            guestReservation.setReservationTime(LocalTime.of(19, 0));
            guestReservation.setNumberOfGuests(2);
            guestReservation.setStatus(Reservation.ReservationStatus.PENDING);
            guestReservation.setCreatedAt(OffsetDateTime.now());

            when(userRepository.findByEmail("madonna@example.com")).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenReturn(newGuestUser);
            when(reservationRepository.save(any(Reservation.class))).thenReturn(guestReservation);

            // When
            ReservationDto result = reservationService.createReservation(guestRequest);

            // Then
            assertThat(result).isNotNull();
            verify(userRepository, times(1)).save(argThat(user -> user.getFirstName().equals("Madonna") &&
                    user.getLastName().isEmpty()));
        }
    }
}
