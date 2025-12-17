package com.lerestaurant.le_restaurant_backend.config;

import com.lerestaurant.le_restaurant_backend.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
            .cors(cors -> cors.disable()) // CORS configured in WebConfig
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // H2 Console (Development only - remove in production)
                .requestMatchers("/h2-console/**").permitAll()
                
                // Public endpoints
                .requestMatchers("/api/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                
                // User Management (F102) - ADMIN only for sensitive operations
                .requestMatchers(HttpMethod.POST, "/api/users").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "CUSTOMER")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "CUSTOMER")
                
                // Menu Management (F103) - ADMIN/MANAGER for modifications
                .requestMatchers(HttpMethod.POST, "/api/menu/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/menu/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasAnyRole("ADMIN", "MANAGER")
                
                // Order Management (F105) - Staff can view/manage all orders
                .requestMatchers(HttpMethod.POST, "/api/orders").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                
                // Payment Management (F106) - Customers create, staff/manager view all
                .requestMatchers(HttpMethod.POST, "/api/payments").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/payments").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/payments/*/process").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/payments/*/refund").hasAnyRole("MANAGER", "ADMIN")
                
                // Delivery Management (F107) - Staff and drivers
                .requestMatchers(HttpMethod.POST, "/api/deliveries").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/deliveries/**").hasAnyRole("STAFF", "DRIVER", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/deliveries/**").hasAnyRole("STAFF", "DRIVER", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/deliveries/**").hasAnyRole("MANAGER", "ADMIN")
                
                // Reservation Management (F108) - Customers create, staff/manager manage
                .requestMatchers(HttpMethod.POST, "/api/reservations").hasAnyRole("CUSTOMER", "STAFF", "MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reservations").hasAnyRole("STAFF", "MANAGER", "ADMIN")
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
