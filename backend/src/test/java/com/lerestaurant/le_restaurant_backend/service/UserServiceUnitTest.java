package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class UserServiceUnitTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    public void setup() {
        userRepository = Mockito.mock(UserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    public void createUser_nullEmail_throws() {
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail(null);
        req.setPassword("somepass");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(req);
        });
        assertThat(ex.getMessage()).contains("Email must not be null");
    }

    @Test
    public void createUser_emptyPassword_throws() {
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail("a@b.com");
        req.setPassword("");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(req);
        });
        assertThat(ex.getMessage()).contains("Password must not be null or empty");
    }

    @Test
    public void createUser_duplicateEmail_throws() {
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail("dup@example.com");
        req.setPassword("Password1");

        when(userRepository.findByEmail("dup@example.com")).thenReturn(Optional.of(new User()));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            userService.createUser(req);
        });
        assertThat(ex.getMessage()).contains("already exists");

        verify(userRepository, times(1)).findByEmail("dup@example.com");
    }

    @Test
    public void authenticate_nullEmail_throws() {
        assertThrows(IllegalArgumentException.class, () -> userService.authenticateUser(null, "pw"));
    }

    @Test
    public void authenticate_nullPassword_throws() {
        assertThrows(IllegalArgumentException.class, () -> userService.authenticateUser("a@b.com", null));
    }

    @Test
    public void authenticate_userNotFound_throws() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.authenticateUser("notfound@example.com", "pw"));
        assertThat(ex.getMessage()).contains("User not found");
    }

    @Test
    public void authenticate_wrongPassword_throws() {
        User user = new User();
        user.setEmail("u@example.com");
        user.setPasswordHash("encoded");

        when(userRepository.findByEmail("u@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(eq("bad"), eq("encoded"))).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.authenticateUser("u@example.com", "bad"));
        assertThat(ex.getMessage()).contains("Invalid credentials");
    }

    @Test
    public void createUser_success_savesUser() {
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail("new@example.com");
        req.setPassword("Secret123");

        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Secret123")).thenReturn("encodedSecret");
        when(userRepository.save(ArgumentMatchers.any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(42L);
            return u;
        });

        var dto = userService.createUser(req);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(42L);
        assertThat(dto.getEmail()).isEqualTo("new@example.com");

        verify(userRepository).save(ArgumentMatchers.any(User.class));
    }
}
