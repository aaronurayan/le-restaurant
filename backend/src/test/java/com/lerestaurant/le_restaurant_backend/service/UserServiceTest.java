package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserDTO;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.enums.UserRole;
import com.lerestaurant.le_restaurant_backend.enums.UserStatus;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for UserService (F102 - User Management)
 * 
 * This test suite validates the business logic for user management operations
 * including user creation, updates, deletion, and filtering.
 * 
 * @author Le Restaurant Development Team
 * @module F102-UserManagement
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests (F102)")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("johndoe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(UserRole.CUSTOMER);
        testUser.setStatus(UserStatus.ACTIVE);

        testUserDTO = new UserDTO();
        testUserDTO.setUsername("newuser");
        testUserDTO.setEmail("newuser@example.com");
        testUserDTO.setPassword("SecurePass123!");
        testUserDTO.setFirstName("New");
        testUserDTO.setLastName("User");
        testUserDTO.setRole(UserRole.CUSTOMER);
    }

    // =================================================================
    // Create User Tests
    // =================================================================
    @Nested
    @DisplayName("Create User Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should create user successfully with encoded password")
        void shouldCreateUserWithEncodedPassword() {
            // Given
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            User createdUser = userService.createUser(testUserDTO);

            // Then
            assertThat(createdUser).isNotNull();
            verify(passwordEncoder, times(1)).encode("SecurePass123!");
            verify(userRepository, times(1)).save(any(User.class));

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getPassword()).isEqualTo("encodedPassword");
        }

        @Test
        @DisplayName("Should throw exception when username already exists")
        void shouldThrowExceptionWhenUsernameExists() {
            // Given
            when(userRepository.existsByUsername("newuser")).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> userService.createUser(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Username already exists");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            // Given
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.existsByEmail("newuser@example.com")).thenReturn(true);

            // When & Then
            assertThatThrownBy(() -> userService.createUser(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Email already exists");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should set default status to ACTIVE for new users")
        void shouldSetDefaultStatusActive() {
            // Given
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            userService.createUser(testUserDTO);

            // Then
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getStatus()).isEqualTo(UserStatus.ACTIVE);
        }
    }

    // =================================================================
    // Get User Tests
    // =================================================================
    @Nested
    @DisplayName("Get User Tests")
    class GetUserTests {

        @Test
        @DisplayName("Should return user by ID")
        void shouldReturnUserById() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

            // When
            Optional<User> foundUser = userService.getUserById(1L);

            // Then
            assertThat(foundUser).isPresent();
            assertThat(foundUser.get().getUsername()).isEqualTo("johndoe");
            verify(userRepository, times(1)).findById(1L);
        }

        @Test
        @DisplayName("Should return empty when user not found")
        void shouldReturnEmptyWhenUserNotFound() {
            // Given
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When
            Optional<User> foundUser = userService.getUserById(999L);

            // Then
            assertThat(foundUser).isEmpty();
            verify(userRepository, times(1)).findById(999L);
        }

        @Test
        @DisplayName("Should return all users")
        void shouldReturnAllUsers() {
            // Given
            User user2 = new User();
            user2.setId(2L);
            user2.setUsername("janesmith");
            List<User> users = Arrays.asList(testUser, user2);
            when(userRepository.findAll()).thenReturn(users);

            // When
            List<User> allUsers = userService.getAllUsers();

            // Then
            assertThat(allUsers).hasSize(2);
            assertThat(allUsers).extracting(User::getUsername)
                    .containsExactly("johndoe", "janesmith");
            verify(userRepository, times(1)).findAll();
        }
    }

    // =================================================================
    // Update User Tests
    // =================================================================
    @Nested
    @DisplayName("Update User Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("Should update user details successfully")
        void shouldUpdateUserDetails() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            testUserDTO.setFirstName("Updated");
            testUserDTO.setLastName("Name");

            // When
            User updatedUser = userService.updateUser(1L, testUserDTO);

            // Then
            assertThat(updatedUser).isNotNull();
            verify(userRepository, times(1)).findById(1L);
            verify(userRepository, times(1)).save(any(User.class));

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getFirstName()).isEqualTo("Updated");
            assertThat(userCaptor.getValue().getLastName()).isEqualTo("Name");
        }

        @Test
        @DisplayName("Should throw exception when updating non-existent user")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.updateUser(999L, testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should update password when provided")
        void shouldUpdatePasswordWhenProvided() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            testUserDTO.setPassword("NewSecurePass456!");

            // When
            userService.updateUser(1L, testUserDTO);

            // Then
            verify(passwordEncoder, times(1)).encode("NewSecurePass456!");
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getPassword()).isEqualTo("newEncodedPassword");
        }

        @Test
        @DisplayName("Should not update password when not provided")
        void shouldNotUpdatePasswordWhenNotProvided() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            testUserDTO.setPassword(null);

            // When
            userService.updateUser(1L, testUserDTO);

            // Then
            verify(passwordEncoder, never()).encode(anyString());
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getPassword()).isEqualTo("encodedPassword"); // Original password
        }
    }

    // =================================================================
    // Delete User Tests
    // =================================================================
    @Nested
    @DisplayName("Delete User Tests")
    class DeleteUserTests {

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUser() {
            // Given
            when(userRepository.existsById(1L)).thenReturn(true);
            doNothing().when(userRepository).deleteById(1L);

            // When
            userService.deleteUser(1L);

            // Then
            verify(userRepository, times(1)).existsById(1L);
            verify(userRepository, times(1)).deleteById(1L);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent user")
        void shouldThrowExceptionWhenDeletingNonExistentUser() {
            // Given
            when(userRepository.existsById(999L)).thenReturn(false);

            // When & Then
            assertThatThrownBy(() -> userService.deleteUser(999L))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, never()).deleteById(anyLong());
        }
    }

    // =================================================================
    // Update User Status Tests
    // =================================================================
    @Nested
    @DisplayName("Update User Status Tests")
    class UpdateUserStatusTests {

        @Test
        @DisplayName("Should update user status to SUSPENDED")
        void shouldUpdateStatusToSuspended() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            User updatedUser = userService.updateUserStatus(1L, UserStatus.SUSPENDED);

            // Then
            assertThat(updatedUser).isNotNull();
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getStatus()).isEqualTo(UserStatus.SUSPENDED);
        }

        @Test
        @DisplayName("Should update user status to ACTIVE")
        void shouldUpdateStatusToActive() {
            // Given
            testUser.setStatus(UserStatus.SUSPENDED);
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            User updatedUser = userService.updateUserStatus(1L, UserStatus.ACTIVE);

            // Then
            assertThat(updatedUser).isNotNull();
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getStatus()).isEqualTo(UserStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.updateUserStatus(999L, UserStatus.SUSPENDED))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, never()).save(any(User.class));
        }
    }

    // =================================================================
    // Filter Users Tests
    // =================================================================
    @Nested
    @DisplayName("Filter Users Tests")
    class FilterUsersTests {

        @Test
        @DisplayName("Should filter users by role")
        void shouldFilterUsersByRole() {
            // Given
            when(userRepository.findByRole(UserRole.CUSTOMER))
                    .thenReturn(Arrays.asList(testUser));

            // When
            List<User> filteredUsers = userService.filterUsers(UserRole.CUSTOMER, null, null);

            // Then
            assertThat(filteredUsers).hasSize(1);
            assertThat(filteredUsers.get(0).getRole()).isEqualTo(UserRole.CUSTOMER);
            verify(userRepository, times(1)).findByRole(UserRole.CUSTOMER);
        }

        @Test
        @DisplayName("Should filter users by status")
        void shouldFilterUsersByStatus() {
            // Given
            when(userRepository.findByStatus(UserStatus.ACTIVE))
                    .thenReturn(Arrays.asList(testUser));

            // When
            List<User> filteredUsers = userService.filterUsers(null, UserStatus.ACTIVE, null);

            // Then
            assertThat(filteredUsers).hasSize(1);
            assertThat(filteredUsers.get(0).getStatus()).isEqualTo(UserStatus.ACTIVE);
            verify(userRepository, times(1)).findByStatus(UserStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should filter users by search term")
        void shouldFilterUsersBySearchTerm() {
            // Given
            when(userRepository.findByUsernameContainingOrEmailContaining("john", "john"))
                    .thenReturn(Arrays.asList(testUser));

            // When
            List<User> filteredUsers = userService.filterUsers(null, null, "john");

            // Then
            assertThat(filteredUsers).hasSize(1);
            assertThat(filteredUsers.get(0).getUsername()).contains("john");
            verify(userRepository, times(1))
                    .findByUsernameContainingOrEmailContaining("john", "john");
        }

        @Test
        @DisplayName("Should apply multiple filters")
        void shouldApplyMultipleFilters() {
            // Given
            when(userRepository.findByRoleAndStatusAndUsernameContainingOrEmailContaining(
                    UserRole.CUSTOMER, UserStatus.ACTIVE, "john", "john"))
                    .thenReturn(Arrays.asList(testUser));

            // When
            List<User> filteredUsers = userService.filterUsers(
                    UserRole.CUSTOMER, UserStatus.ACTIVE, "john");

            // Then
            assertThat(filteredUsers).hasSize(1);
            verify(userRepository, times(1))
                    .findByRoleAndStatusAndUsernameContainingOrEmailContaining(
                            UserRole.CUSTOMER, UserStatus.ACTIVE, "john", "john");
        }

        @Test
        @DisplayName("Should return all users when no filters applied")
        void shouldReturnAllUsersWhenNoFilters() {
            // Given
            when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

            // When
            List<User> filteredUsers = userService.filterUsers(null, null, null);

            // Then
            assertThat(filteredUsers).hasSize(1);
            verify(userRepository, times(1)).findAll();
        }
    }

    // =================================================================
    // Business Logic Validation Tests
    // =================================================================
    @Nested
    @DisplayName("Business Logic Validation")
    class BusinessLogicTests {

        @Test
        @DisplayName("Should validate email format")
        void shouldValidateEmailFormat() {
            // Given
            testUserDTO.setEmail("invalid-email");

            // When & Then
            assertThatThrownBy(() -> userService.validateUserData(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Invalid email format");
        }

        @Test
        @DisplayName("Should validate password strength")
        void shouldValidatePasswordStrength() {
            // Given
            testUserDTO.setPassword("weak");

            // When & Then
            assertThatThrownBy(() -> userService.validatePasswordStrength(testUserDTO.getPassword()))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Password must be at least 8 characters");
        }

        @Test
        @DisplayName("Should validate username length")
        void shouldValidateUsernameLength() {
            // Given
            testUserDTO.setUsername("ab"); // Too short

            // When & Then
            assertThatThrownBy(() -> userService.validateUserData(testUserDTO))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("Username must be between 3 and 50 characters");
        }
    }

    // =================================================================
    // Edge Cases Tests
    // =================================================================
    @Nested
    @DisplayName("Edge Cases")
    class EdgeCaseTests {

        @Test
        @DisplayName("Should handle null password in update")
        void shouldHandleNullPasswordUpdate() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);
            testUserDTO.setPassword(null);

            // When
            User updatedUser = userService.updateUser(1L, testUserDTO);

            // Then
            assertThat(updatedUser.getPassword()).isEqualTo("encodedPassword");
            verify(passwordEncoder, never()).encode(anyString());
        }

        @Test
        @DisplayName("Should handle concurrent user creation")
        void shouldHandleConcurrentCreation() {
            // Given
            when(userRepository.existsByUsername(anyString())).thenReturn(false);
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(userRepository.save(any(User.class)))
                    .thenThrow(new RuntimeException("Unique constraint violation"));

            // When & Then
            assertThatThrownBy(() -> userService.createUser(testUserDTO))
                    .isInstanceOf(RuntimeException.class);
        }
    }
}
