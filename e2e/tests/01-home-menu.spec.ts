import { test, expect } from '@playwright/test';

/**
 * E2E Test: Home page and menu display
 * Covers: FR-103 (Menu browsing), FR-205 (Anonymous browsing)
 */
test.describe('Home Page & Menu Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads and shows the restaurant name', async ({ page }) => {
    await expect(page).toHaveTitle(/Le Restaurant/i);
  });

  test('menu items are displayed on the home page', async ({ page }) => {
    // Wait for menu items to load (backend or mock data)
    const menuItems = page.locator('[data-testid="menu-item"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('anonymous user can browse menu without logging in', async ({ page }) => {
    // No login required — page should not redirect to login
    await expect(page).not.toHaveURL(/login/i);
    const menuItems = page.locator('[data-testid="menu-item"]');
    await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
  });

  test('navigation header is visible', async ({ page }) => {
    const header = page.locator('header, [role="banner"]').first();
    await expect(header).toBeVisible();
  });
});
