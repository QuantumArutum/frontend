import { test, expect } from '@playwright/test';

test.describe('Comprehensive Website Test', () => {
  test('Home page loads and has key elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Quantaureum|Quantum/i);
    // Check for navigation bar
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check for main heading
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to DeFi section', async ({ page }) => {
    await page.goto('/defi');
    await expect(page).toHaveURL(/.*defi/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to STO section', async ({ page }) => {
    await page.goto('/sto');
    await expect(page).toHaveURL(/.*sto/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to Wallet section', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page).toHaveURL(/.*wallet/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to About section', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/.*about/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation to Login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveURL(/.*login/);
    // Check for login form inputs - making selector more specific to avoid ambiguity
    // The previous error showed multiple email inputs, likely one in a modal or footer
    await expect(page.locator('form input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Check Business Logic Elements (Mock)', async ({ page }) => {
    // This is a placeholder for deeper business logic tests
    // For example, checking if specific buttons exist
    await page.goto('/');
    // Look for "Connect Wallet" or similar
    const connectButton = page.getByRole('button', { name: /Connect|Wallet/i }).first();
    if (await connectButton.isVisible()) {
      await expect(connectButton).toBeEnabled();
    }
  });
});
