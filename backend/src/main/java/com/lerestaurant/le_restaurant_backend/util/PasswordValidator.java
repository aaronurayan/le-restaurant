package com.lerestaurant.le_restaurant_backend.util;

public final class PasswordValidator {

    private PasswordValidator() {
    }

    /**
     * Return true when the password meets the minimum complexity rules:
     * - at least 8 characters
     * - at least one uppercase
     * - at least one lowercase
     * - at least one digit
     * - at least one special character
     */
    public static boolean isStrong(String password) {
        if (password == null)
            return false;
        if (password.length() < 8)
            return false;
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecial = password.matches(".*[!@#$%^&*()\\-_=+\\[\\]{};:'\\\",.<>/?].*");
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
