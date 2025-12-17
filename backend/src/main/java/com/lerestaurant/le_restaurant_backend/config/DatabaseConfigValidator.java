package com.lerestaurant.le_restaurant_backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Database Configuration Validator
 * 
 * Validates that all required database environment variables are set in production.
 * Prevents application startup with missing or default credentials.
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-12-06
 */
@Component
@Profile("prod")
public class DatabaseConfigValidator {
    
    @Value("${DB_HOST:}")
    private String dbHost;
    
    @Value("${DB_NAME:}")
    private String dbName;
    
    @Value("${DB_USERNAME:}")
    private String dbUsername;
    
    @Value("${DB_PASSWORD:}")
    private String dbPassword;
    
    @PostConstruct
    public void validateDatabaseConfig() {
        if (dbHost == null || dbHost.isEmpty()) {
            throw new IllegalStateException(
                "CRITICAL: DB_HOST environment variable not set in production!"
            );
        }
        
        if (dbName == null || dbName.isEmpty()) {
            throw new IllegalStateException(
                "CRITICAL: DB_NAME environment variable not set in production!"
            );
        }
        
        if (dbUsername == null || dbUsername.isEmpty()) {
            throw new IllegalStateException(
                "CRITICAL: DB_USERNAME environment variable not set in production!"
            );
        }
        
        if (dbPassword == null || dbPassword.isEmpty()) {
            throw new IllegalStateException(
                "CRITICAL: DB_PASSWORD environment variable not set in production!"
            );
        }
        
        // ✅ 추가: 기본값 사용 경고
        if ("postgres".equals(dbUsername) || "password".equals(dbPassword)) {
            throw new IllegalStateException(
                "CRITICAL: Using default database credentials in production!"
            );
        }
        
        // ✅ 추가: localhost 사용 경고
        if (dbHost.contains("localhost") || dbHost.equals("127.0.0.1")) {
            throw new IllegalStateException(
                "CRITICAL: Using localhost database in production!"
            );
        }
    }
}
