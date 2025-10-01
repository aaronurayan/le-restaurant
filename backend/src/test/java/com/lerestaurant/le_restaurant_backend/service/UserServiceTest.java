package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserUpdateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
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
    private UserCreateRequestDto testUserCreateRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("john@example.com");
        testUser.setPasswordHash("encodedPassword");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(User.UserRole.CUSTOMER);
        testUser.setStatus(User.UserStatus.ACTIVE);

        testUserCreateRequest = new UserCreateRequestDto();
        testUserCreateRequest.setEmail("newuser@example.com");
        testUserCreateRequest.setPassword("SecurePass123!");
        testUserCreateRequest.setFirstName("New");
        testUserCreateRequest.setLastName("User");
        testUserCreateRequest.setRole(User.UserRole.CUSTOMER);
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
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            UserDto createdUser = userService.createUser(testUserCreateRequest);

            // Then
            assertThat(createdUser).isNotNull();
            verify(passwordEncoder, times(1)).encode("SecurePass123!");
            verify(userRepository, times(1)).save(any(User.class));

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getPasswordHash()).isEqualTo("encodedPassword");
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            // Given
            when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.of(testUser));

            // When & Then
            assertThatThrownBy(() -> userService.createUser(testUserCreateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("email already exists");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should set default status to ACTIVE for new users")
        void shouldSetDefaultStatusActive() {
            // Given
            when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            userService.createUser(testUserCreateRequest);

            // Then
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getStatus()).isEqualTo(User.UserStatus.ACTIVE);
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
            UserDto foundUser = userService.getUserById(1L);

            // Then
            assertThat(foundUser).isNotNull();
            assertThat(foundUser.getEmail()).isEqualTo("john@example.com");
            verify(userRepository, times(1)).findById(1L);
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            // Given
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.getUserById(999L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");
        }

        @Test
        @DisplayName("Should return all users")
        void shouldReturnAllUsers() {
            // Given
            User user2 = new User();
            user2.setId(2L);
            user2.setEmail("jane@example.com");
            user2.setRole(User.UserRole.MANAGER);
            List<User> users = Arrays.asList(testUser, user2);
            when(userRepository.findAll()).thenReturn(users);

            // When
            List<UserDto> allUsers = userService.getAllUsers();

            // Then
            assertThat(allUsers).hasSize(2);
            assertThat(allUsers).extracting(UserDto::getEmail)
                    .containsExactly("john@example.com", "jane@example.com");
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
            UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
            updateRequest.setFirstName("Updated");
            updateRequest.setLastName("Name");
            updateRequest.setPhoneNumber("0499999999");
            
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            UserDto updatedUser = userService.updateUser(1L, updateRequest);

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
            UserUpdateRequestDto updateRequest = new UserUpdateRequestDto();
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.updateUser(999L, updateRequest))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should update user status")
        void shouldUpdateUserStatus() {
            // Given
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // When
            UserDto updatedUser = userService.updateUserStatus(1L, User.UserStatus.SUSPENDED);

            // Then
            assertThat(updatedUser).isNotNull();
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            assertThat(userCaptor.getValue().getStatus()).isEqualTo(User.UserStatus.SUSPENDED);
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
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
            doNothing().when(userRepository).delete(any(User.class));

            // When
            userService.deleteUser(1L);

            // Then
            verify(userRepository, times(1)).delete(testUser);
        }

        @Test
        @DisplayName("Should throw exception when deleting non-existent user")
        void shouldThrowExceptionWhenDeletingNonExistentUser() {
            // Given
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // When & Then
            assertThatThrownBy(() -> userService.deleteUser(999L))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("User not found");

            verify(userRepository, never()).delete(any(User.class));
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
            User manager = new User();
            manager.setId(2L);
            manager.setEmail("manager@example.com");
            manager.setRole(User.UserRole.MANAGER);
            when(userRepository.findByRole(User.UserRole.MANAGER))
                    .thenReturn(Arrays.asList(manager));

            // When
            List<UserDto> filteredUsers = userService.getUsersByRole(User.UserRole.MANAGER);

            // Then
            assertThat(filteredUsers).hasSize(1);
            assertThat(filteredUsers.get(0).getRole()).isEqualTo(User.UserRole.MANAGER);
            verify(userRepository, times(1)).findByRole(User.UserRole.MANAGER);
        }

        @Test
        @DisplayName("Should filter users by status")
        void shouldFilterUsersByStatus() {
            // Given
            when(userRepository.findByStatus(User.UserStatus.ACTIVE))
                    .thenReturn(Arrays.asList(testUser));

            // When
            List<UserDto> filteredUsers = userService.getUsersByStatus(User.UserStatus.ACTIVE);

            // Then
            assertThat(filteredUsers).hasSize(1);
            assertThat(filteredUsers.get(0).getStatus()).isEqualTo(User.UserStatus.ACTIVE);
            verify(userRepository, times(1)).findByStatus(User.UserStatus.ACTIVE);
        }

        @Test
        @DisplayName("Should check if email exists")
        void shouldCheckIfEmailExists() {
            // Given
            when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

            // When
            boolean exists = userService.existsByEmail("john@example.com");

            // Then
            assertThat(exists).isTrue();
            verify(userRepository, times(1)).findByEmail("john@example.com");
        }
    }
}
