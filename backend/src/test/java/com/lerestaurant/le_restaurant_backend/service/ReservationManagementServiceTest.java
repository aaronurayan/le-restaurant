package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationDto;
import com.lerestaurant.le_restaurant_backend.entity.*;
import com.lerestaurant.le_restaurant_backend.repository.ReservationRepository;
import com.lerestaurant.le_restaurant_backend.repository.RestaurantTableRepository;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * F109 Reservation Management Tests
 * 
 * Comprehensive test suite for F109 Manager/Admin operations:
 * - Role-based access control for approval/rejection
 * - Table assignment logic during approval
 * - Status transition validation
 * - Guest reservation management
 * - Concurrent modification scenarios
 * 
 * @author Le Restaurant Development Team
 * @module F109-ReservationManagement
 * @coverage-target 80%+
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("F109 Reservation Management Service Tests")
class ReservationManagementServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestaurantTableRepository restaurantTableRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User testCustomer;
    private User testManager;
    private User testAdmin;
    private User testStaff;
    private RestaurantTable testTable;
    private RestaurantTable largeTable;
    private Reservation pendingReservation;
    private Reservation confirmedReservation;
    private Reservation cancelledReservation;
    private Reservation guestReservation;

    @BeforeEach
    void setUp() {
        // Setup test customer (authenticated)
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@example.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");
        testCustomer.setPhoneNumber("0412345678");
        testCustomer.setRole(User.UserRole.CUSTOMER);
        testCustomer.setStatus(User.UserStatus.ACTIVE);

        // Setup test manager (can approve/reject)
        testManager = new User();
        testManager.setId(2L);
        testManager.setEmail("manager@example.com");
        testManager.setFirstName("Manager");
        testManager.setLastName("User");
        testManager.setRole(User.UserRole.MANAGER);
        testManager.setStatus(User.UserStatus.ACTIVE);

        // Setup test admin (can approve/reject + full CRUD)
        testAdmin = new User();
        testAdmin.setId(3L);
        testAdmin.setEmail("admin@example.com");
        testAdmin.setFirstName("Admin");
        testAdmin.setLastName("User");
        testAdmin.setRole(User.UserRole.ADMIN);
        testAdmin.setStatus(User.UserStatus.ACTIVE);

        // Setup test staff (regular customer for negative test scenarios)
        testStaff = new User();
        testStaff.setId(4L);
        testStaff.setEmail("staff@example.com");
        testStaff.setFirstName("Staff");
        testStaff.setLastName("User");
        testStaff.setRole(User.UserRole.CUSTOMER); // Regular customer role
        testStaff.setStatus(User.UserStatus.ACTIVE);

        // Setup test tables
        testTable = new RestaurantTable();
        testTable.setId(1L);
        testTable.setTableNumber("T1");
        testTable.setCapacity(4);
        testTable.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        testTable.setLocationDescription("Window seat");

        largeTable = new RestaurantTable();
        largeTable.setId(2L);
        largeTable.setTableNumber("T2");
        largeTable.setCapacity(8);
        largeTable.setStatus(RestaurantTable.TableStatus.AVAILABLE);
        largeTable.setLocationDescription("Private dining area");

        // Setup PENDING reservation
        pendingReservation = new Reservation();
        pendingReservation.setId(1L);
        pendingReservation.setCustomer(testCustomer);
        pendingReservation.setTable(testTable);
        pendingReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
        pendingReservation.setNumberOfGuests(2);
        pendingReservation.setStatus(Reservation.ReservationStatus.PENDING);
        pendingReservation.setCreatedAt(OffsetDateTime.now());

        // Setup CONFIRMED reservation (for status transition tests)
        confirmedReservation = new Reservation();
        confirmedReservation.setId(2L);
        confirmedReservation.setCustomer(testCustomer);
        confirmedReservation.setTable(testTable);
        confirmedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(2));
        confirmedReservation.setNumberOfGuests(2);
        confirmedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        confirmedReservation.setApprovedBy(testManager);
        confirmedReservation.setCreatedAt(OffsetDateTime.now());
        confirmedReservation.setUpdatedAt(OffsetDateTime.now());

        // Setup CANCELLED reservation
        cancelledReservation = new Reservation();
        cancelledReservation.setId(3L);
        cancelledReservation.setCustomer(testCustomer);
        cancelledReservation.setTable(testTable);
        cancelledReservation.setReservationDateTime(OffsetDateTime.now().plusDays(3));
        cancelledReservation.setNumberOfGuests(2);
        cancelledReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        cancelledReservation.setRejectionReason("Customer requested cancellation");
        cancelledReservation.setCreatedAt(OffsetDateTime.now());
        cancelledReservation.setUpdatedAt(OffsetDateTime.now());

        // Setup guest reservation (customer_id points to guest user)
        User guestUser = new User();
        guestUser.setId(100L);
        guestUser.setEmail("guest@example.com");
        guestUser.setFirstName("Guest");
        guestUser.setLastName("User");
        guestUser.setPhoneNumber("0400000000");
        guestUser.setPasswordHash("GUEST_USER");

        guestReservation = new Reservation();
        guestReservation.setId(10L);
        guestReservation.setCustomer(guestUser);
        guestReservation.setTable(null); // No table assigned yet
        guestReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
        guestReservation.setNumberOfGuests(4);
        guestReservation.setStatus(Reservation.ReservationStatus.PENDING);
        guestReservation.setCreatedAt(OffsetDateTime.now());
    }

    // =================================================================
    // F109: Manager Approval Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Manager Approval Tests")
    class ManagerApprovalTests {

        @Test
        @DisplayName("Should approve PENDING reservation successfully")
        void shouldApproveReservationSuccessfully() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.getApprovedBy()).isEqualTo(2L);
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should track approver ID when approval is completed")
        void shouldTrackApproverIdOnApproval() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result.getApprovedBy()).isNotNull();
            assertThat(result.getApprovedBy()).isEqualTo(2L);
        }

        @Test
        @DisplayName("Admin should be able to approve reservation")
        void adminShouldApproveReservation() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(3L)).thenReturn(Optional.of(testAdmin));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testAdmin);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 3L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.getApprovedBy()).isEqualTo(3L);
        }

        @Test
        @DisplayName("Should throw exception when approver user not found")
        void shouldThrowExceptionWhenApproverNotFound() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(1L, 999L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Approver not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when reservation not found")
        void shouldThrowExceptionWhenReservationNotFound() {
            // Given
            when(reservationRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(999L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should set updatedAt timestamp on approval")
        void shouldSetUpdatedAtOnApproval() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result.getUpdatedAt()).isNotNull();
        }
    }

    // =================================================================
    // F109: Manager Rejection Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Manager Rejection Tests")
    class ManagerRejectionTests {

        @Test
        @DisplayName("Should reject PENDING reservation with reason")
        void shouldRejectReservationWithReason() {
            // Given
            String rejectionReason = "Table unavailable at requested time";
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation rejectedReservation = new Reservation();
            rejectedReservation.setId(1L);
            rejectedReservation.setCustomer(testCustomer);
            rejectedReservation.setTable(testTable);
            rejectedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedReservation.setNumberOfGuests(2);
            rejectedReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedReservation.setRejectionReason(rejectionReason);
            rejectedReservation.setApprovedBy(testManager);
            rejectedReservation.setCreatedAt(OffsetDateTime.now());
            rejectedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(1L, rejectionReason, 2L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            assertThat(result.getRejectionReason()).isEqualTo(rejectionReason);
            assertThat(result.getApprovedBy()).isEqualTo(2L);
        }

        @Test
        @DisplayName("Admin should be able to reject reservation")
        void adminShouldRejectReservation() {
            // Given
            String rejectionReason = "Party size exceeds available capacity";
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(3L)).thenReturn(Optional.of(testAdmin));

            Reservation rejectedReservation = new Reservation();
            rejectedReservation.setId(1L);
            rejectedReservation.setCustomer(testCustomer);
            rejectedReservation.setTable(testTable);
            rejectedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedReservation.setNumberOfGuests(2);
            rejectedReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedReservation.setRejectionReason(rejectionReason);
            rejectedReservation.setApprovedBy(testAdmin);
            rejectedReservation.setCreatedAt(OffsetDateTime.now());
            rejectedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(1L, rejectionReason, 3L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            assertThat(result.getApprovedBy()).isEqualTo(3L);
        }

        @Test
        @DisplayName("Should track rejecter ID when rejection is completed")
        void shouldTrackRejecterIdOnRejection() {
            // Given
            String rejectionReason = "Customer did not confirm booking";
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation rejectedReservation = new Reservation();
            rejectedReservation.setId(1L);
            rejectedReservation.setCustomer(testCustomer);
            rejectedReservation.setTable(testTable);
            rejectedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedReservation.setNumberOfGuests(2);
            rejectedReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedReservation.setRejectionReason(rejectionReason);
            rejectedReservation.setApprovedBy(testManager);
            rejectedReservation.setCreatedAt(OffsetDateTime.now());
            rejectedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(1L, rejectionReason, 2L);

            // Then
            assertThat(result.getApprovedBy()).isNotNull();
            assertThat(result.getApprovedBy()).isEqualTo(2L);
        }

        @Test
        @DisplayName("Should throw exception when rejecter not found")
        void shouldThrowExceptionWhenRejecterNotFound() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(1L, "Not available", 999L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Rejecter not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }
    }

    // =================================================================
    // F109: Status Transition Validation Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Status Transition Validation Tests")
    class StatusTransitionTests {

        @Test
        @DisplayName("Should only approve PENDING reservations")
        void shouldOnlyApprovePendingReservations() {
            // Given - CONFIRMED reservation
            when(reservationRepository.findById(2L)).thenReturn(Optional.of(confirmedReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(2L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should only reject PENDING reservations")
        void shouldOnlyRejectPendingReservations() {
            // Given - CONFIRMED reservation
            when(reservationRepository.findById(2L)).thenReturn(Optional.of(confirmedReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(2L, "Reason", 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should not approve CANCELLED reservation")
        void shouldNotApproveCancelledReservation() {
            // Given
            when(reservationRepository.findById(3L)).thenReturn(Optional.of(cancelledReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(3L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should not reject CANCELLED reservation")
        void shouldNotRejectCancelledReservation() {
            // Given
            when(reservationRepository.findById(3L)).thenReturn(Optional.of(cancelledReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(3L, "Already cancelled", 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("PENDING to CONFIRMED transition should succeed")
        void pendingToConfirmedTransitionShouldSucceed() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("PENDING to CANCELLED transition should succeed")
        void pendingToCancelledTransitionShouldSucceed() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation rejectedReservation = new Reservation();
            rejectedReservation.setId(1L);
            rejectedReservation.setCustomer(testCustomer);
            rejectedReservation.setTable(testTable);
            rejectedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedReservation.setNumberOfGuests(2);
            rejectedReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedReservation.setRejectionReason("Not available");
            rejectedReservation.setApprovedBy(testManager);
            rejectedReservation.setCreatedAt(OffsetDateTime.now());
            rejectedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(1L, "Not available", 2L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }
    }

    // =================================================================
    // F109: Guest Reservation Management Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Guest Reservation Management Tests")
    class GuestReservationTests {

        @Test
        @DisplayName("Admin should be able to view all guest reservations")
        void adminShouldViewGuestReservations() {
            // Given
            List<Reservation> allReservations = Arrays.asList(
                    pendingReservation,
                    guestReservation,
                    confirmedReservation);
            when(reservationRepository.findAll()).thenReturn(allReservations);

            // When
            List<ReservationDto> result = reservationService.getAllReservations();

            // Then
            assertThat(result).hasSize(3);
            assertThat(result).anyMatch(r -> r.getId().equals(10L)); // Guest reservation included
        }

        @Test
        @DisplayName("Admin should be able to approve guest reservation")
        void adminShouldApproveGuestReservation() {
            // Given
            when(reservationRepository.findById(10L)).thenReturn(Optional.of(guestReservation));
            when(userRepository.findById(3L)).thenReturn(Optional.of(testAdmin));

            Reservation approvedGuestReservation = new Reservation();
            approvedGuestReservation.setId(10L);
            approvedGuestReservation.setCustomer(guestReservation.getCustomer());
            approvedGuestReservation.setTable(testTable);
            approvedGuestReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedGuestReservation.setNumberOfGuests(4);
            approvedGuestReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedGuestReservation.setApprovedBy(testAdmin);
            approvedGuestReservation.setCreatedAt(OffsetDateTime.now());
            approvedGuestReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedGuestReservation);

            // When
            ReservationDto result = reservationService.approveReservation(10L, 3L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.getCustomerEmail()).isEqualTo("guest@example.com");
        }

        @Test
        @DisplayName("Admin should be able to reject guest reservation")
        void adminShouldRejectGuestReservation() {
            // Given
            String rejectionReason = "Fully booked";
            when(reservationRepository.findById(10L)).thenReturn(Optional.of(guestReservation));
            when(userRepository.findById(3L)).thenReturn(Optional.of(testAdmin));

            Reservation rejectedGuestReservation = new Reservation();
            rejectedGuestReservation.setId(10L);
            rejectedGuestReservation.setCustomer(guestReservation.getCustomer());
            rejectedGuestReservation.setTable(null);
            rejectedGuestReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedGuestReservation.setNumberOfGuests(4);
            rejectedGuestReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedGuestReservation.setRejectionReason(rejectionReason);
            rejectedGuestReservation.setApprovedBy(testAdmin);
            rejectedGuestReservation.setCreatedAt(OffsetDateTime.now());
            rejectedGuestReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedGuestReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(10L, rejectionReason, 3L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            assertThat(result.getRejectionReason()).isEqualTo(rejectionReason);
        }

        @Test
        @DisplayName("Admin should be able to delete guest reservation")
        void adminShouldDeleteGuestReservation() {
            // Given
            when(reservationRepository.existsById(10L)).thenReturn(true);

            // When
            reservationService.deleteReservation(10L);

            // Then
            verify(reservationRepository, times(1)).deleteById(10L);
        }

        @Test
        @DisplayName("Should retrieve pending guest reservations")
        void shouldRetrievePendingGuestReservations() {
            // Given
            List<Reservation> pendingList = Arrays.asList(pendingReservation, guestReservation);
            when(reservationRepository.findByStatus(Reservation.ReservationStatus.PENDING))
                    .thenReturn(pendingList);

            // When
            List<ReservationDto> result = reservationService
                    .getReservationsByStatus(Reservation.ReservationStatus.PENDING);

            // Then
            assertThat(result).hasSize(2);
            assertThat(result).anyMatch(r -> r.getCustomerEmail().equals("guest@example.com"));
        }
    }

    // =================================================================
    // F109: Table Assignment During Approval Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Table Assignment Tests")
    class TableAssignmentTests {

        @Test
        @DisplayName("Should approve reservation with existing table assignment")
        void shouldApproveWithExistingTable() {
            // Given - reservation already has table assigned
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable); // Table already assigned
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result.getTableId()).isEqualTo(1L);
            assertThat(result.getTableNumber()).isEqualTo("T1");
        }

        @Test
        @DisplayName("Should approve guest reservation without table assignment")
        void shouldApproveGuestReservationWithoutTable() {
            // Given - guest reservation without table
            when(reservationRepository.findById(10L)).thenReturn(Optional.of(guestReservation));
            when(userRepository.findById(3L)).thenReturn(Optional.of(testAdmin));

            Reservation approvedGuestReservation = new Reservation();
            approvedGuestReservation.setId(10L);
            approvedGuestReservation.setCustomer(guestReservation.getCustomer());
            approvedGuestReservation.setTable(null); // No table assigned yet
            approvedGuestReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedGuestReservation.setNumberOfGuests(4);
            approvedGuestReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedGuestReservation.setApprovedBy(testAdmin);
            approvedGuestReservation.setCreatedAt(OffsetDateTime.now());
            approvedGuestReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedGuestReservation);

            // When
            ReservationDto result = reservationService.approveReservation(10L, 3L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.getTableId()).isNull(); // Table can be assigned later
        }

        @Test
        @DisplayName("Approved reservation should retain table information")
        void approvedReservationShouldRetainTableInfo() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When
            ReservationDto result = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(result.getTableNumber()).isEqualTo("T1");
            assertThat(result.getTableLocation()).isEqualTo("Window seat");
        }
    }

    // =================================================================
    // F109: Concurrent Modification Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Concurrent Modification Tests")
    class ConcurrentModificationTests {

        @Test
        @DisplayName("Should prevent double approval of same reservation")
        void shouldPreventDoubleApproval() {
            // Given - First approval succeeds
            when(reservationRepository.findById(1L))
                    .thenReturn(Optional.of(pendingReservation))
                    .thenReturn(Optional.of(confirmedReservation)); // Second call returns confirmed

            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedReservation = new Reservation();
            approvedReservation.setId(1L);
            approvedReservation.setCustomer(testCustomer);
            approvedReservation.setTable(testTable);
            approvedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedReservation.setNumberOfGuests(2);
            approvedReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedReservation.setApprovedBy(testManager);
            approvedReservation.setCreatedAt(OffsetDateTime.now());
            approvedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedReservation);

            // When - First approval
            ReservationDto firstApproval = reservationService.approveReservation(1L, 2L);
            assertThat(firstApproval.getStatus()).isEqualTo("CONFIRMED");

            // Then - Second approval should fail
            assertThatThrownBy(() -> reservationService.approveReservation(1L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test
        @DisplayName("Should prevent approval after rejection")
        void shouldPreventApprovalAfterRejection() {
            // Given - Reservation is already rejected (CANCELLED)
            when(reservationRepository.findById(3L)).thenReturn(Optional.of(cancelledReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(3L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test
        @DisplayName("Should prevent rejection after approval")
        void shouldPreventRejectionAfterApproval() {
            // Given - Reservation is already approved (CONFIRMED)
            when(reservationRepository.findById(2L)).thenReturn(Optional.of(confirmedReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(2L, "Reason", 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");
        }

        @Test
        @DisplayName("Multiple managers should not approve same reservation twice")
        void multipleManagersShouldNotApproveTwice() {
            // Given - Different managers trying to approve
            when(reservationRepository.findById(1L))
                    .thenReturn(Optional.of(pendingReservation))
                    .thenReturn(Optional.of(confirmedReservation));

            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation approvedByManager = new Reservation();
            approvedByManager.setId(1L);
            approvedByManager.setCustomer(testCustomer);
            approvedByManager.setTable(testTable);
            approvedByManager.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            approvedByManager.setNumberOfGuests(2);
            approvedByManager.setStatus(Reservation.ReservationStatus.CONFIRMED);
            approvedByManager.setApprovedBy(testManager);
            approvedByManager.setCreatedAt(OffsetDateTime.now());
            approvedByManager.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(approvedByManager);

            // When - Manager approves first
            ReservationDto result1 = reservationService.approveReservation(1L, 2L);
            assertThat(result1.getApprovedBy()).isEqualTo(2L);

            // Then - Admin tries to approve same reservation (should fail)
            assertThatThrownBy(() -> reservationService.approveReservation(1L, 3L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");
        }
    }

    // =================================================================
    // F109: Listing and Filtering Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Listing and Filtering Tests")
    class ListingTests {

        @Test
        @DisplayName("Should retrieve all PENDING reservations")
        void shouldRetrieveAllPendingReservations() {
            // Given
            List<Reservation> pendingList = Arrays.asList(pendingReservation, guestReservation);
            when(reservationRepository.findByStatus(Reservation.ReservationStatus.PENDING))
                    .thenReturn(pendingList);

            // When
            List<ReservationDto> result = reservationService
                    .getReservationsByStatus(Reservation.ReservationStatus.PENDING);

            // Then
            assertThat(result).hasSize(2);
            assertThat(result).allMatch(r -> r.getStatus().equals("PENDING"));
        }

        @Test
        @DisplayName("Should retrieve all CONFIRMED reservations")
        void shouldRetrieveAllConfirmedReservations() {
            // Given
            List<Reservation> confirmedList = Arrays.asList(confirmedReservation);
            when(reservationRepository.findByStatus(Reservation.ReservationStatus.CONFIRMED))
                    .thenReturn(confirmedList);

            // When
            List<ReservationDto> result = reservationService
                    .getReservationsByStatus(Reservation.ReservationStatus.CONFIRMED);

            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.get(0).getApprovedBy()).isNotNull();
        }

        @Test
        @DisplayName("Should retrieve all CANCELLED reservations")
        void shouldRetrieveAllCancelledReservations() {
            // Given
            List<Reservation> cancelledList = Arrays.asList(cancelledReservation);
            when(reservationRepository.findByStatus(Reservation.ReservationStatus.CANCELLED))
                    .thenReturn(cancelledList);

            // When
            List<ReservationDto> result = reservationService
                    .getReservationsByStatus(Reservation.ReservationStatus.CANCELLED);

            // Then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getStatus()).isEqualTo("CANCELLED");
            assertThat(result.get(0).getRejectionReason()).isNotNull();
        }

        @Test
        @DisplayName("Should retrieve all reservations including all statuses")
        void shouldRetrieveAllReservations() {
            // Given
            List<Reservation> allReservations = Arrays.asList(
                    pendingReservation,
                    confirmedReservation,
                    cancelledReservation,
                    guestReservation);
            when(reservationRepository.findAll()).thenReturn(allReservations);

            // When
            List<ReservationDto> result = reservationService.getAllReservations();

            // Then
            assertThat(result).hasSize(4);
            assertThat(result).anyMatch(r -> r.getStatus().equals("PENDING"));
            assertThat(result).anyMatch(r -> r.getStatus().equals("CONFIRMED"));
            assertThat(result).anyMatch(r -> r.getStatus().equals("CANCELLED"));
        }

        @Test
        @DisplayName("Should retrieve reservation by ID with all details")
        void shouldRetrieveReservationByIdWithDetails() {
            // Given
            when(reservationRepository.findById(2L)).thenReturn(Optional.of(confirmedReservation));

            // When
            ReservationDto result = reservationService.getReservationById(2L);

            // Then
            assertThat(result.getId()).isEqualTo(2L);
            assertThat(result.getStatus()).isEqualTo("CONFIRMED");
            assertThat(result.getApprovedBy()).isEqualTo(testManager.getId());
            assertThat(result.getCustomerName()).contains("John");
            assertThat(result.getTableNumber()).isEqualTo("T1");
        }
    }

    // =================================================================
    // F109: Edge Case Tests
    // =================================================================
    @Nested
    @DisplayName("F109: Edge Case Tests")
    class EdgeCaseTests {

        @Test
        @DisplayName("Should handle null rejection reason gracefully")
        void shouldHandleNullRejectionReason() {
            // Given - Note: In real scenario, validation should prevent null
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));

            Reservation rejectedReservation = new Reservation();
            rejectedReservation.setId(1L);
            rejectedReservation.setCustomer(testCustomer);
            rejectedReservation.setTable(testTable);
            rejectedReservation.setReservationDateTime(OffsetDateTime.now().plusDays(1));
            rejectedReservation.setNumberOfGuests(2);
            rejectedReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            rejectedReservation.setRejectionReason(null);
            rejectedReservation.setApprovedBy(testManager);
            rejectedReservation.setCreatedAt(OffsetDateTime.now());
            rejectedReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.save(any(Reservation.class))).thenReturn(rejectedReservation);

            // When
            ReservationDto result = reservationService.rejectReservation(1L, null, 2L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            assertThat(result.getRejectionReason()).isNull();
        }

        @Test
        @DisplayName("Should handle approval with invalid reservation ID")
        void shouldHandleInvalidReservationId() {
            // Given
            when(reservationRepository.findById(-1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(-1L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");
        }

        @Test
        @DisplayName("Should handle rejection with invalid approver ID")
        void shouldHandleInvalidApproverId() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(pendingReservation));
            when(userRepository.findById(-1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(1L, "Reason", -1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Rejecter not found");
        }

        @Test
        @DisplayName("Admin should delete reservation regardless of status")
        void adminShouldDeleteAnyReservation() {
            // Given - Delete CONFIRMED reservation
            when(reservationRepository.existsById(2L)).thenReturn(true);

            // When
            reservationService.deleteReservation(2L);

            // Then
            verify(reservationRepository, times(1)).deleteById(2L);
        }
    }
}
