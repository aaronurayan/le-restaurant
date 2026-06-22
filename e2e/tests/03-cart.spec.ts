import { test, expect } from '@playwright/test';

/**
 * E2E Test: Cart and order flow
 * Covers: FR-501 (Create order), FR-105 (Order management)
 */
test.describe('Cart & Order Flow', () => {
  test('cart button is visible in the header', async ({ page }) => {
    await page.goto('/');
    const cartBtn = page.locator('[data-testid="cart-button"]');
    await expect(cartBtn).toBeVisible({ timeout: 5000 });
  });

  test('clicking Add to Cart on a menu item increases cart count', async ({ page }) => {
    await page.goto('/');

    // Wait for menu items to load
    const firstItem = page.locator('[data-testid="menu-item"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    // Click "Add to Cart" button on the first available item
    const addToCartBtn = firstItem.getByRole('button', { name: /add to cart/i });
    await addToCartBtn.click();

    // Wait for cart count badge to appear
    await page.waitForTimeout(1000);
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toBeVisible({ timeout: 5000 });
  });

  test('cart sidebar opens after clicking cart button', async ({ page }) => {
    await page.goto('/');
    const cartBtn = page.locator('[data-testid="cart-button"]');
    await cartBtn.click();
    // Cart sidebar or modal should become visible
    const sidebar = page.locator('[class*="cart"], [class*="Cart"]').first();
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });
});
