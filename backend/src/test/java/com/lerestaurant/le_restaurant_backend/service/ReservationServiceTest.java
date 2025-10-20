package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.ReservationApprovalRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.ReservationCreateRequestDto;
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

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for ReservationService (F108/F109 - Reservation Management)
 * 
 * This test suite validates the business logic for reservation operations
 * including creation (F108), approval/rejection (F109), and retrieval.
 * 
 * @author Le Restaurant Development Team
 * @module F108-CustomerReservation, F109-ManagerApproval
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ReservationService Tests (F108/F109)")
class ReservationServiceTest {

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
    private RestaurantTable testTable;
    private Reservation testReservation;
    private ReservationCreateRequestDto testReservationCreateRequest;

    @BeforeEach
    void setUp() {
        // Setup test customer
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setEmail("customer@example.com");
        testCustomer.setFirstName("John");
        testCustomer.setLastName("Doe");
        testCustomer.setPhoneNumber("0412345678");

        // Setup test manager
        testManager = new User();
        testManager.setId(2L);
        testManager.setEmail("manager@example.com");
        testManager.setFirstName("Manager");
        testManager.setLastName("User");

        // Setup test table
        testTable = new RestaurantTable();
        testTable.setId(1L);
        testTable.setTableNumber("T1");
        testTable.setCapacity(4);

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

        // Setup request DTO (F108 - Customer creates reservation)
        testReservationCreateRequest = new ReservationCreateRequestDto();
        testReservationCreateRequest.setCustomerId(1L);
        testReservationCreateRequest.setTableId(1L);
        testReservationCreateRequest.setReservationDateTime(
            LocalDate.now().plusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC)
        );
        testReservationCreateRequest.setNumberOfGuests(2);
        testReservationCreateRequest.setSpecialRequests("Window seat preferred");
    }

    // =================================================================
    // Create Reservation Tests (F108)
    // =================================================================
    @Nested
    @DisplayName("Create Reservation Tests (F108)")
    class CreateReservationTests {

        @Test
        @DisplayName("Should create reservation successfully with valid data")
        void shouldCreateReservationSuccessfully() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto createdReservation = reservationService.createReservation(testReservationCreateRequest);

            // Then
            assertThat(createdReservation).isNotNull();
            assertThat(createdReservation.getId()).isEqualTo(1L);
            assertThat(createdReservation.getStatus()).isEqualTo("PENDING");
            assertThat(createdReservation.getCustomerId()).isEqualTo(1L);
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when customer not found")
        void shouldThrowExceptionWhenCustomerNotFound() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(testReservationCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Customer not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when table not found")
        void shouldThrowExceptionWhenTableNotFound() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(testReservationCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Table not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when reservation date is in past")
        void shouldThrowExceptionWhenReservationDateInPast() {
            // Given
            testReservationCreateRequest.setReservationDateTime(
                LocalDate.now().minusDays(1).atTime(19, 0).atOffset(java.time.ZoneOffset.UTC)
            );
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(testReservationCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("past");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when number of guests exceeds table capacity")
        void shouldThrowExceptionWhenGuestCountExceedsCapacity() {
            // Given
            testReservationCreateRequest.setNumberOfGuests(10);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));

            // When & Then
            assertThatThrownBy(() -> reservationService.createReservation(testReservationCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("capacity");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should set status to PENDING on creation")
        void shouldSetStatusToPendingOnCreation() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
            when(restaurantTableRepository.findById(1L)).thenReturn(Optional.of(testTable));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto createdReservation = reservationService.createReservation(testReservationCreateRequest);

            // Then
            assertThat(createdReservation.getStatus()).isEqualTo("PENDING");
        }
    }

    // =================================================================
    // Get Reservation Tests
    // =================================================================
    @Nested
    @DisplayName("Get Reservation Tests")
    class GetReservationTests {

        @Test
        @DisplayName("Should return reservation by ID")
        void shouldReturnReservationById() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When
            ReservationDto foundReservation = reservationService.getReservationById(1L);

            // Then
            assertThat(foundReservation).isNotNull();
            assertThat(foundReservation.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw exception when reservation not found")
        void shouldThrowExceptionWhenReservationNotFound() {
            // Given
            when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.getReservationById(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");
        }

        @Test
        @DisplayName("Should return all reservations")
        void shouldReturnAllReservations() {
            // Given
            List<Reservation> reservations = Arrays.asList(testReservation);
            when(reservationRepository.findAll()).thenReturn(reservations);

            // When
            List<ReservationDto> allReservations = reservationService.getAllReservations();

            // Then
            assertThat(allReservations).isNotNull();
            assertThat(allReservations).hasSize(1);
        }

        @Test
        @DisplayName("Should return reservations by customer ID")
        void shouldReturnReservationsByCustomerId() {
            // Given
            List<Reservation> customerReservations = Arrays.asList(testReservation);
            when(reservationRepository.findByCustomerId(1L)).thenReturn(customerReservations);

            // When
            List<ReservationDto> reservations = reservationService.getReservationsByCustomer(1L);

            // Then
            assertThat(reservations).isNotNull();
            assertThat(reservations).hasSize(1);
            assertThat(reservations.get(0).getCustomerId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should return reservations by status")
        void shouldReturnReservationsByStatus() {
            // Given
            List<Reservation> pendingReservations = Arrays.asList(testReservation);
            when(reservationRepository.findByStatus(Reservation.ReservationStatus.PENDING))
                    .thenReturn(pendingReservations);

            // When
            List<ReservationDto> reservations = reservationService.getReservationsByStatus(Reservation.ReservationStatus.PENDING);

            // Then
            assertThat(reservations).isNotNull();
            assertThat(reservations).hasSize(1);
            assertThat(reservations.get(0).getStatus()).isEqualTo("PENDING");
        }
    }

    // =================================================================
    // Approve Reservation Tests (F109)
    // =================================================================
    @Nested
    @DisplayName("Approve Reservation Tests (F109)")
    class ApproveReservationTests {

        @Test
        @DisplayName("Should approve reservation and change status to CONFIRMED")
        void shouldApproveReservationSuccessfully() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            testReservation.setApprovedBy(testManager);
            testReservation.setUpdatedAt(OffsetDateTime.now());
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(userRepository.findById(2L)).thenReturn(Optional.of(testManager));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto approvedReservation = reservationService.approveReservation(1L, 2L);

            // Then
            assertThat(approvedReservation.getStatus()).isEqualTo("CONFIRMED");
            assertThat(approvedReservation.getApprovedBy()).isNotNull();
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when reservation not found for approval")
        void shouldThrowExceptionWhenReservationNotFoundForApproval() {
            // Given
            when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(99L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when manager not found")
        void shouldThrowExceptionWhenManagerNotFound() {
            // Given
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(1L, 99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Manager not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when approving non-PENDING reservation")
        void shouldThrowExceptionWhenApprovingNonPendingReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.approveReservation(1L, 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }
    }

    // =================================================================
    // Reject Reservation Tests (F109)
    // =================================================================
    @Nested
    @DisplayName("Reject Reservation Tests (F109)")
    class RejectReservationTests {

        @Test
        @DisplayName("Should reject reservation and change status to CANCELLED")
        void shouldRejectReservationSuccessfully() {
            // Given
            String rejectionReason = "Table unavailable at requested time";
            Long approverId = 2L;

            testReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            testReservation.setRejectionReason(rejectionReason);
            testReservation.setUpdatedAt(OffsetDateTime.now());

            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);

            // When
            ReservationDto rejectedReservation = reservationService.rejectReservation(1L, rejectionReason, approverId);

            // Then
            assertThat(rejectedReservation.getStatus()).isEqualTo("CANCELLED");
            assertThat(rejectedReservation.getRejectionReason()).isEqualTo(rejectionReason);
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when reservation not found for rejection")
        void shouldThrowExceptionWhenReservationNotFoundForRejection() {
            // Given
            when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(99L, "Not available", 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when rejecting non-PENDING reservation")
        void shouldThrowExceptionWhenRejectingNonPendingReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.rejectReservation(1L, "Not available", 2L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("PENDING");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }
    }

    // =================================================================
    // Cancel Reservation Tests
    // =================================================================
    @Nested
    @DisplayName("Cancel Reservation Tests")
    class CancelReservationTests {

        @Test
        @DisplayName("Should cancel CONFIRMED reservation")
        void shouldCancelConfirmedReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            Reservation cancelledReservation = new Reservation();
            cancelledReservation.setId(1L);
            cancelledReservation.setStatus(Reservation.ReservationStatus.CANCELLED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(cancelledReservation);

            // When
            ReservationDto result = reservationService.cancelReservation(1L);

            // Then
            assertThat(result.getStatus()).isEqualTo("CANCELLED");
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }

        @Test
        @DisplayName("Should throw exception when cancelling non-existent reservation")
        void shouldThrowExceptionWhenCancellingNonExistentReservation() {
            // Given
            when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.cancelReservation(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");

            verify(reservationRepository, never()).save(any(Reservation.class));
        }
    }

    // =================================================================
    // Complete Reservation Tests
    // =================================================================
    @Nested
    @DisplayName("Complete Reservation Tests")
    class CompleteReservationTests {

        @Test
        @DisplayName("Should complete CONFIRMED reservation")
        void shouldCompleteConfirmedReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            Reservation completedReservation = new Reservation();
            completedReservation.setId(1L);
            completedReservation.setStatus(Reservation.ReservationStatus.COMPLETED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));
            when(reservationRepository.save(any(Reservation.class))).thenReturn(completedReservation);

            // When
            ReservationDto result = reservationService.completeReservation(1L);

            // Then
            assertThat(result.getStatus()).isEqualTo("COMPLETED");
            verify(reservationRepository, times(1)).save(any(Reservation.class));
        }
    }

    // =================================================================
    // Delete Reservation Tests
    // =================================================================
    @Nested
    @DisplayName("Delete Reservation Tests")
    class DeleteReservationTests {

        @Test
        @DisplayName("Should delete PENDING reservation")
        void shouldDeletePendingReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.PENDING);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When
            reservationService.deleteReservation(1L);

            // Then
            verify(reservationRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Should throw exception when deleting confirmed reservation")
        void shouldThrowExceptionWhenDeletingConfirmedReservation() {
            // Given
            testReservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
            when(reservationRepository.findById(1L)).thenReturn(Optional.of(testReservation));

            // When & Then
            assertThatThrownBy(() -> reservationService.deleteReservation(1L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Cannot delete");

            verify(reservationRepository, never()).deleteById(anyLong());
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent reservation")
        void shouldThrowExceptionWhenDeletingNonExistentReservation() {
            // Given
            when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> reservationService.deleteReservation(99L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Reservation not found");

            verify(reservationRepository, never()).deleteById(anyLong());
        }
    }
}
