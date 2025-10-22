package com.lerestaurant.le_restaurant_backend.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class PasswordValidatorTest {

    @Test
    public void strongPassword_passes() {
        assertThat(PasswordValidator.isStrong("Abcdef1!"))
                .isTrue();
    }

    @Test
    public void shortPassword_fails() {
        assertThat(PasswordValidator.isStrong("A1!a"))
                .isFalse();
    }

    @Test
    public void missingUppercase_fails() {
        assertThat(PasswordValidator.isStrong("abcdef1!"))
                .isFalse();
    }

    @Test
    public void missingLowercase_fails() {
        assertThat(PasswordValidator.isStrong("ABCDEF1!"))
                .isFalse();
    }

    @Test
    public void missingDigit_fails() {
        assertThat(PasswordValidator.isStrong("Abcdefg!"))
                .isFalse();
    }

    @Test
    public void missingSpecial_fails() {
        assertThat(PasswordValidator.isStrong("Abcdef12"))
                .isFalse();
    }
}
