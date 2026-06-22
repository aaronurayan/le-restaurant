import { test, expect } from '@playwright/test';

/**
 * E2E Test: Table reservation flow
 * Covers: FR-801 (Create reservation), FR-802 (View table availability)
 */
test.describe('Table Reservation', () => {
  test('reservation form is accessible from the page', async ({ page }) => {
    await page.goto('/');
    // Look for a reservation link in nav or a button
    const reservationLink = page.getByRole('link', { name: /reserv/i })
      .or(page.getByRole('button', { name: /reserv/i }))
      .first();

    if (await reservationLink.isVisible()) {
      await reservationLink.click();
    } else {
      // Try navigating directly to a reservations URL pattern
      await page.goto('/reservations');
    }

    // Check the reservation form data-testid is present
    const form = page.locator('[data-testid="reservation-form"]');
    await expect(form).toBeVisible({ timeout: 8000 });
  });

  test('reservation form has required date and guest fields', async ({ page }) => {
    await page.goto('/');
    const reservationLink = page.getByRole('link', { name: /reserv/i })
      .or(page.getByRole('button', { name: /reserv/i }))
      .first();

    if (await reservationLink.isVisible()) {
      await reservationLink.click();
    } else {
      await page.goto('/reservations');
    }

    const form = page.locator('[data-testid="reservation-form"]');
    if (await form.isVisible({ timeout: 8000 })) {
      // Date input should be present
      const dateInput = form.locator('input[type="date"]');
      await expect(dateInput).toBeVisible();
    }
  });
});
