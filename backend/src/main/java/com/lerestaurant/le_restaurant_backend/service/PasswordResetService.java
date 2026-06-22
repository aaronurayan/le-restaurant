package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.entity.User;
import com.lerestaurant.le_restaurant_backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

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
     *
     * The token is intentionally NOT returned to the caller — exposing it over the API
     * would allow anyone who knows an email to take over that account. It must be
     * delivered out-of-band (email in production). To keep the email unknown to callers
     * (anti-enumeration), this method silently no-ops when the email is not registered.
     */
    public void generateResetToken(String email) {
        if (userRepository.findByEmail(email).isEmpty()) {
            // Do not reveal whether the account exists.
            logger.info("Password reset requested for an unrecognised email; ignoring.");
            return;
        }

        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenEntry(email, Instant.now().plusMillis(TOKEN_TTL_MS)));

        // DEMO ONLY: no email service is configured, so the token is written to the server
        // log (not the HTTP response). In production, send this via email instead.
        logger.info("[DEMO] Password reset token generated for {}. Deliver via email in production.", email);
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
