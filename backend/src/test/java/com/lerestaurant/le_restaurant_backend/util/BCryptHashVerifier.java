package com.lerestaurant.le_restaurant_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility to verify BCrypt hashes
 */
public class BCryptHashVerifier {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Test the hash from data.sql
        String password = "password123";
        String existingHash = "$2a$10$N9qo8uLOickgx2ZMRZoMye/0cQs4z0b4LT.pZ2VZZQPy0sFpMAF5C";
        
        System.out.println("Testing existing hash from data.sql:");
        System.out.println("Password: " + password);
        System.out.println("Hash: " + existingHash);
        boolean matches = encoder.matches(password, existingHash);
        System.out.println("Matches: " + matches);
        System.out.println();
        
        if (!matches) {
            System.out.println("Hash does not match! Generating new hash:");
            String newHash = encoder.encode(password);
            System.out.println("New Hash: " + newHash);
            System.out.println("Verification: " + encoder.matches(password, newHash));
        } else {
            System.out.println("Hash is correct!");
        }
    }
}

