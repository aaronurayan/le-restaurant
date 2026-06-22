package com.lerestaurant.le_restaurant_backend.config;

import com.lerestaurant.le_restaurant_backend.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security Configuration with RBAC
 * 
 * Implements Role-Based Access Control (RBAC) for API endpoints.
 * Addresses Critical Issue: No backend RBAC enforcement (F102 audit finding).
 * 
 * Security Rules:
 * - H2 Console: Development only (disable in production)
 * - Public endpoints: Health, menu (GET), auth
 * - ADMIN: User management, system configuration
 * - MANAGER: Reservations, staff management, analytics
 * - STAFF: Order processing, delivery management
 * - CUSTOMER: Own profile, orders, payments, reservations
 * 
 * @author Le Restaurant Development Team
 * @version 1.0.0
 * @since 2025-01-20
 * @module F102-UserManagement (RBAC enforcement)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Explicit CorsConfigurationSource so Spring Security's CorsFilter
     * (enabled via cors(withDefaults())) can resolve allowed origins.
     * Must mirror the origins defined in WebConfig.addCorsMappings().
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        String allowed = System.getenv("CORS_ALLOWED_ORIGINS");
        if (allowed == null || allowed.trim().isEmpty()) {
            config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://le-restaurant-frontend.azurestaticapps.net"
            ));
            config.addAllowedOriginPattern("https://*.azurestaticapps.net");
        } else {
            config.setAllowedOrigins(Arrays.stream(allowed.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toList());
        }

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
            .cors(Customizer.withDefaults()) // Delegate CORS to WebConfig (WebMvcConfigurer)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Allow all CORS preflight requests through before auth checks
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // H2 Console (Development only - remove in production)
                .requestMatchers("/h2-console/**").permitAll()

                // Public endpoints
                .requestMatchers("/api/health").permitAll()
                // Menu browsing is public (FR-103, FR-205) — controller is /api/menu-items
                .requestMatchers(HttpMethod.GET, "/api/menu-items").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/menu-items/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // User Management (F102) - ADMIN only for sensitive operations
                .requestMatchers(HttpMethod.POST, "/api/users").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "CUSTOMER")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "CUSTOMER")

                // Menu Management (F103) - ADMIN/MANAGER for modifications
                .requestMatchers(HttpMethod.POST, "/api/menu-items").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/menu-items/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/menu-items/**").hasAnyRole("ADMIN", "MANAGER")
                
                // Order Management (F105) - Staff manage all; customers own only (ownership checked in controller)
                // NOTE: more specific matchers MUST precede the generic /** matcher (first match wins).
                .requestMatchers(HttpMethod.POST, "/api/orders").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/status/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")

                // Cart (server-side) - any authenticated user; ownership enforced in the controller
                .requestMatchers("/api/cart/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")

                // Payment Management (F106) - Customers own only; staff/manager privileged ops
                .requestMatchers(HttpMethod.POST, "/api/payments/*/process").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/payments/*/refund").hasAnyRole("MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/payments").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/payments/status/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/payments").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/payments/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/payments/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/payments/**").hasAnyRole("MANAGER", "ADMIN")

                // Delivery Management (F107) - Staff and drivers
                .requestMatchers(HttpMethod.POST, "/api/deliveries/*/assign-driver/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/deliveries").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/deliveries/**").hasAnyRole("STAFF", "DRIVER", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/deliveries/**").hasAnyRole("STAFF", "DRIVER", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/deliveries/**").hasAnyRole("MANAGER", "ADMIN")

                // Delivery addresses (F107) - any authenticated user; ownership enforced in the controller
                .requestMatchers("/api/delivery-addresses/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")

                // Reservation Management (F108) - Customers own only; staff/manager manage
                .requestMatchers(HttpMethod.POST, "/api/reservations").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations/timeslots").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations/availability").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations/date/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations/status/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations/**").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/reservations/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/reservations/**").hasAnyRole("MANAGER", "ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin()) // Allow H2 console in iframe
            )
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
