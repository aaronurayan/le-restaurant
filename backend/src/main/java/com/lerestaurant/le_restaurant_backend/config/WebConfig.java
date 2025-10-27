package com.lerestaurant.le_restaurant_backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Read allowed origins from environment variable for production flexibility
        String allowed = System.getenv("CORS_ALLOWED_ORIGINS");
        String[] origins;
        if (allowed == null || allowed.trim().isEmpty()) {
            // Default: allow localhost dev + Azure Static Web App
            origins = new String[] {
                    "http://localhost:5173",
                    "https://yellow-ground-042c31000.3.azurestaticapps.net"
            };
        } else {
            origins = Arrays.stream(allowed.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toArray(String[]::new);
        }

        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
