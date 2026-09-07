import { Page, expect, APIRequestContext } from '@playwright/test';

export const API_BASE =
  process.env.E2E_API_URL || 'http://localhost:3000/api';

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || 'e2e.admin@kpoikpoimingi.com',
  password: process.env.E2E_ADMIN_PASSWORD || 'E2E_Admin_123!',
};

/** UI login on the admin dashboard. */
export async function loginViaUi(page: Page) {
  await page.goto('/');
  await page.locator('input[name="email"]').fill(E2E_ADMIN.email);
  await page.locator('input[name="password"]').fill(E2E_ADMIN.password);
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
}

/**
 * Faster auth: API login then inject localStorage (kkm_auth) before visiting dashboard.
 */
export async function loginViaApi(page: Page, request: APIRequestContext) {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email: E2E_ADMIN.email, password: E2E_ADMIN.password },
  });
  expect(
    res.ok(),
    `Login failed (${res.status()}). Run backend seed:e2e-admin. ${await res.text()}`,
  ).toBeTruthy();
  const body = await res.json();

  await page.addInitScript(
    ({ auth }) => {
      localStorage.setItem('kkm_auth', JSON.stringify(auth));
    },
    {
      auth: {
        id: body.id,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        expiresAt:
          typeof body.expiresIn === 'number' && body.expiresIn > 1_000_000_000_000
            ? body.expiresIn
            : Date.now() + 60 * 60 * 1000,
      },
    },
  );
}

export async function expectPageLoaded(page: Page) {
  await expect(page.locator('body')).toBeVisible();
  // Soft check: no full-page crash banner text commonly used
  await expect(page.getByText(/something went wrong/i)).toHaveCount(0);
}
