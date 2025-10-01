package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserCreateRequestDto;
import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void registerAndAuthenticate_success() {
        String email = "test.register." + System.currentTimeMillis() + "@example.com";
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail(email);
        req.setPassword("MySecret123");
        req.setFirstName("Test");
        req.setLastName("User");
        req.setPhoneNumber("+1000000000");

        UserDto created = userService.createUser(req);
        Assertions.assertNotNull(created);
        Assertions.assertEquals(email, created.getEmail());

        // Authenticate with correct password
        UserDto auth = userService.authenticateUser(email, "MySecret123");
        Assertions.assertNotNull(auth);
        Assertions.assertEquals(email, auth.getEmail());
    }

    @Test
    public void authenticate_nonExistent_throws() {
        String email = "no-such-user-" + System.currentTimeMillis() + "@example.com";
        Assertions.assertThrows(RuntimeException.class, () -> {
            userService.authenticateUser(email, "whatever");
        });
    }

    @Test
    public void authenticate_wrongPassword_throws() {
        String email = "test.wrongpw." + System.currentTimeMillis() + "@example.com";
        UserCreateRequestDto req = new UserCreateRequestDto();
        req.setEmail(email);
        req.setPassword("CorrectPass123!");
        req.setFirstName("Wrong");
        req.setLastName("Password");
        req.setPhoneNumber("+1000000001");

        UserDto created = userService.createUser(req);
        Assertions.assertNotNull(created);

        // Attempt to authenticate with bad password
        Assertions.assertThrows(RuntimeException.class, () -> {
            userService.authenticateUser(email, "BadPassword");
        });
    }
}
