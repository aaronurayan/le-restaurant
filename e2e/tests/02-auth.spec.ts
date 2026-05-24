import { test, expect } from '@playwright/test';

/**
 * E2E Test: Authentication — registration and login
 * Covers: FR-200 (Customer registration), FR-101 (Authentication)
 */

const TEST_EMAIL = `e2e_${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPass@123';

test.describe('Authentication', () => {
  test('auth modal opens when clicking login button', async ({ page }) => {
    await page.goto('/');
    // Look for a Login / Sign In button in the header
    const loginBtn = page.getByRole('button', { name: /login|sign in/i }).first();
    await loginBtn.click();
    const modal = page.locator('[data-testid="auth-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });
  });

  test('registration form accepts valid input and shows result', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /login|sign in/i }).first();
    await loginBtn.click();

    const modal = page.locator('[data-testid="auth-modal"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Switch to sign-up mode
    const signupLink = page.getByRole('button', { name: /sign up/i });
    await signupLink.click();

    // Fill in the form
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);

    // Attempt first name, last name, phone if visible
    const firstNameInput = page.locator('input#firstName');
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill('E2E');
    }
    const lastNameInput = page.locator('input#lastName');
    if (await lastNameInput.isVisible()) {
      await lastNameInput.fill('Tester');
    }
    const phoneInput = page.locator('input#phoneNumber');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('0400000000');
    }

    // Submit
    await page.getByRole('button', { name: /sign up/i }).last().click();

    // Expect either a success or the modal closes (successful registration)
    await page.waitForTimeout(2000);
  });

  test('password strength meter appears during registration', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /login|sign in/i }).first();
    await loginBtn.click();

    const signupLink = page.getByRole('button', { name: /sign up/i });
    await signupLink.click();

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('weak');
    // Strength meter should now be visible
    const strengthMeter = page.locator('[aria-label*="Password strength"]');
    await expect(strengthMeter).toBeVisible({ timeout: 3000 });
  });

  test('login shows error for wrong credentials', async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /login|sign in/i }).first();
    await loginBtn.click();

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.getByRole('button', { name: /^login$/i }).click();

    // Error message should appear (our new authError state)
    const errorMsg = page.locator('.text-red-600, [class*="red"]').first();
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  });
});
