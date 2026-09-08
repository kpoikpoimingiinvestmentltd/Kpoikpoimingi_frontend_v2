import { test, expect } from '@playwright/test';
import { expectPageLoaded, loginViaApi } from './helpers/auth';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page, request }) => {
  await loginViaApi(page, request);
});

const SIDEBAR_ROUTES: { path: string; label: string }[] = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/customers', label: 'Customers' },
  { path: '/dashboard/contract', label: 'Contract' },
  { path: '/dashboard/properties', label: 'Properties' },
  { path: '/dashboard/users', label: 'Users' },
  { path: '/dashboard/receipt', label: 'Receipt' },
  { path: '/dashboard/payment', label: 'Payment' },
  { path: '/dashboard/debt', label: 'Debt' },
  { path: '/dashboard/report-analytics', label: 'Report & Analytics' },
  { path: '/dashboard/audit-and-compliance', label: 'Audit & Compliance' },
  { path: '/dashboard/notifications', label: 'Notifications' },
  { path: '/dashboard/settings', label: 'Settings' },
  { path: '/dashboard/product-request', label: 'Product Request' },
  { path: '/dashboard/properties/categories', label: 'Categories' },
  { path: '/dashboard/properties/add', label: 'Add Property' },
  { path: '/dashboard/customers/add', label: 'Add Customer' },
  { path: '/dashboard/users/add', label: 'Add User' },
  { path: '/dashboard/customers/select-properties', label: 'Select Properties' },
  { path: '/dashboard/customers/payment-method', label: 'Payment Method' },
];

test.describe('Dashboard pages load (SUPER_ADMIN)', () => {
  for (const route of SIDEBAR_ROUTES) {
    test(`loads ${route.path} (${route.label})`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      await expectPageLoaded(page);
      // Should not bounce to login
      await expect(page).not.toHaveURL(/\/$/);
    });
  }

  test('unknown dashboard path shows not found or stays in shell', async ({
    page,
  }) => {
    await page.goto('/dashboard/this-route-does-not-exist-xyz');
    await expectPageLoaded(page);
  });
});

test.describe('Detail pages when list has rows', () => {
  test('open first customer details', async ({ page }) => {
    await page.goto('/dashboard/customers');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/customers/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No customer links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/customers\//);
    await expectPageLoaded(page);
  });

  test('open first contract details', async ({ page }) => {
    await page.goto('/dashboard/contract');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/contract/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No contract links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/contract\//);
    await expectPageLoaded(page);

    // Tabs on contract details
    for (const tab of [
      /contract information/i,
      /payment plan/i,
      /payment links/i,
      /receipt/i,
      /document/i,
    ]) {
      const t = page.getByRole('tab', { name: tab });
      if (await t.count()) {
        await t.click();
        await expectPageLoaded(page);
      }
    }
  });

  test('open first property details', async ({ page }) => {
    await page.goto('/dashboard/properties');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/properties/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No property links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/properties\//);
    await expectPageLoaded(page);
  });

  test('open first receipt details', async ({ page }) => {
    await page.goto('/dashboard/receipt');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/receipt/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No receipt links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/receipt\//);
    await expectPageLoaded(page);
  });

  test('open first debt details', async ({ page }) => {
    await page.goto('/dashboard/debt');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/debt/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No debt links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/debt\//);
    await expectPageLoaded(page);
  });

  test('open first user details', async ({ page }) => {
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    const link = page.locator('a[href*="/dashboard/users/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No user links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/users\//);
    await expectPageLoaded(page);
  });

  test('open first product request details', async ({ page }) => {
    await page.goto('/dashboard/product-request');
    await page.waitForLoadState('networkidle');
    const link = page
      .locator('a[href*="/dashboard/product-request/"]')
      .first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No product request links');
    }
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/product-request\//);
    await expectPageLoaded(page);
  });
});
