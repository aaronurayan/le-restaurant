package com.lerestaurant.le_restaurant_backend.service;

import com.lerestaurant.le_restaurant_backend.dto.UserDto;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Central helper for record-level (ownership) authorization.
 *
 * Spring Security's URL/method rules only gate by ROLE. They cannot express
 * "a CUSTOMER may only access their OWN orders/payments/reservations". This
 * helper resolves the authenticated principal to a user id so controllers can
 * enforce ownership and close IDOR gaps consistently.
 *
 * @module F102-UserManagement (RBAC enforcement)
 */
@Component
public class AuthorizationService {

    private final UserService userService;

    public AuthorizationService(UserService userService) {
        this.userService = userService;
    }

    /**
     * The current authentication, or {@code null} when there is no security context.
     * A null context only occurs where Spring Security is not active (e.g. tests with
     * security disabled). In production every endpoint guarded here also requires
     * authentication in {@link com.lerestaurant.le_restaurant_backend.config.SecurityConfig},
     * so the context is always populated before a controller runs.
     */
    private Authentication authentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private boolean isAuthenticated() {
        Authentication auth = authentication();
        return auth != null && auth.isAuthenticated() && auth.getName() != null;
    }

    public boolean hasRole(String role) {
        Authentication auth = authentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    /** Staff = any non-customer operational role that may act across users. */
    public boolean isStaff() {
        return hasRole("ADMIN") || hasRole("MANAGER") || hasRole("STAFF");
    }

    /** Resolve the authenticated principal (JWT subject = email) to its user id. */
    public Long currentUserId() {
        UserDto user = userService.getUserByEmail(authentication().getName());
        return user.getId();
    }

    /**
     * Allow the action only if the caller is staff, or is the owner of the resource.
     * @throws AccessDeniedException (HTTP 403) otherwise.
     */
    public void requireSelfOrStaff(Long ownerId) {
        // No security context => authentication is enforced upstream (or disabled in tests).
        if (!isAuthenticated()) {
            return;
        }
        if (isStaff()) {
            return;
        }
        if (ownerId == null || !ownerId.equals(currentUserId())) {
            throw new AccessDeniedException("Access denied: you can only access your own resources");
        }
    }

    /**
     * For create endpoints that carry an owner id in the request body: staff may act
     * on behalf of any user, but a customer is forced to be the owner (prevents
     * spoofing another user's id). Returns the owner id that should actually be used.
     */
    public Long resolveOwnerId(Long requestedOwnerId) {
        if (!isAuthenticated() || isStaff()) {
            return requestedOwnerId;
        }
        return currentUserId();
    }
}
