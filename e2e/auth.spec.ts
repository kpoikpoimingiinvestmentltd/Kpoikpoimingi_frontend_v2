import { test, expect } from '@playwright/test';
import { loginViaUi } from './helpers/auth';

test.describe('Auth', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('validation blocks empty submit', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /log in/i }).click();
    // Stay on login
    await expect(page).toHaveURL(/\/$/);
  });

  test('failed login shows error or stays on login', async ({ page }) => {
    await page.goto('/');
    await page.locator('input[name="email"]').fill('bad@example.com');
    await page.locator('input[name="password"]').fill('wrongpass');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForTimeout(1500);
    await expect(page).not.toHaveURL(/\/dashboard$/);
  });

  test('successful login reaches dashboard', async ({ page }) => {
    await loginViaUi(page);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('body')).toBeVisible();
  });

  test('payment success page loads', async ({ page }) => {
    await page.goto('/payment/success');
    await expect(page.locator('body')).toBeVisible();
  });
});
