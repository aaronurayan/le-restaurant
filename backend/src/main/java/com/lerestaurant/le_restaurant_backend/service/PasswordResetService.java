package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final long TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

    private record TokenEntry(String email, Instant expiresAt) {}

    private final ConcurrentHashMap<String, TokenEntry> tokens = new ConcurrentHashMap<>();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordResetService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Generate a reset token for the given email.
     * Returns the token so it can be shown in demo mode (no email service).
     */
    public String generateResetToken(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email address."));

        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenEntry(email, Instant.now().plusMillis(TOKEN_TTL_MS)));
        return token;
    }

    /**
     * Validate the token and set the new password.
     */
    public void resetPassword(String token, String newPassword) {
        TokenEntry entry = tokens.get(token);
        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            tokens.remove(token);
            throw new RuntimeException("Reset token is invalid or has expired.");
        }

        User user = userRepository.findByEmail(entry.email())
                .orElseThrow(() -> new RuntimeException("User account no longer exists."));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokens.remove(token);
    }
}
