import { Page, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';


/** Dismiss What's new (or similar) if it is blocking the page. */
export async function dismissBlockingDialogs(page: Page) {
  const gotIt = page.getByRole('button', { name: /^Got it$/i });
  if (await gotIt.isVisible({ timeout: 1500 }).catch(() => false)) {
    await gotIt.click();
  }
  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible({ timeout: 300 }).catch(() => false)) {
    const close = dialog.getByRole('button', { name: /close|got it|ok/i }).first();
    if (await close.isVisible().catch(() => false)) await close.click();
  }
}

/** Fill the input/textarea in the same field group as a visible label.
 *  Accepts Page or a scoped Locator (e.g. dialog) so modal fields don't clash with page copy.
 *  Required fields render "Label*" — prefer /^Label/i over /^Label$/i.
 */
export async function fillLabeledField(
  root: Page | import('@playwright/test').Locator,
  label: RegExp | string,
  value: string,
) {
  const labelEl = root.locator('label').filter({ hasText: label }).first();
  await expect(labelEl, `label ${label}`).toBeVisible({ timeout: 15_000 });
  const group = labelEl.locator('xpath=ancestor::div[.//input or .//textarea][1]');
  const control = group.locator('input, textarea').first();
  await expect(control).toBeVisible();
  await control.fill(value);
}

/** Mock S3/presign so Add Property can upload without real AWS. */
export async function mockMediaUpload(page: Page) {
  await page.route('**/media/presign-upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        uploadUrl: 'http://127.0.0.1:9/e2e-fake-upload',
        url: 'http://127.0.0.1:9/e2e-fake-upload',
        key: `e2e/fake-${Date.now()}.png`,
      }),
    });
  });
  await page.route('**/e2e-fake-upload**', async (route) => {
    await route.fulfill({ status: 200, body: '' });
  });
}

export async function uploadFakePropertyImage(page: Page) {
  const tmp = path.join(os.tmpdir(), `e2e-prop-${Date.now()}.png`);
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  fs.writeFileSync(tmp, png);
  await page.locator('#kkm-image-upload-input').setInputFiles(tmp);
  await expect(
    page.getByRole('button', { name: /please upload at least one image/i }),
  ).toHaveCount(0, { timeout: 20_000 });
}

export async function fillBasePropertyForm(
  page: Page,
  opts: { name: string; chassisSuffix: string },
) {
  await dismissBlockingDialogs(page);
  await fillLabeledField(page, /Property Name/i, opts.name);

  const catGroup = page.locator('label').filter({ hasText: /Property Category/i }).locator('..');
  await catGroup.getByRole('combobox').click();
  const vehicleOpt = page.getByRole('option', { name: /vehicle/i }).first();
  await expect(vehicleOpt).toBeVisible({ timeout: 15_000 });
  await vehicleOpt.click();

  const subGroup = page.locator('label').filter({ hasText: /Sub Category/i }).locator('..');
  await expect(subGroup.getByRole('combobox')).toBeEnabled({ timeout: 10_000 });
  await subGroup.getByRole('combobox').click();
  const car = page.getByRole('option', { name: /^Car$/i });
  if (await car.count()) await car.first().click();
  else await page.getByRole('option').first().click();

  await fillLabeledField(page, /^Quantity/i, '1');
  await fillLabeledField(page, /Product Description/i, 'FE e2e automated purchase property');
  await fillLabeledField(page, /^Condition/i, 'Used');

  await fillLabeledField(page, /Vehicle Make/i, 'Toyota');
  await fillLabeledField(page, /Vehicle Model/i, 'Corolla');
  await fillLabeledField(page, /Vehicle Year/i, '2020');
  await fillLabeledField(page, /Vehicle Color/i, 'Silver');
  await fillLabeledField(page, /Chassis/i, `FE-CHASSIS-${opts.chassisSuffix}`);
  await fillLabeledField(page, /Vehicle Type/i, 'Sedan');
  await fillLabeledField(page, /Registration/i, `FE-${opts.chassisSuffix.slice(-6)}`);
}

export async function createSupplierInline(page: Page, name: string) {
  const addBtn = page.getByRole('button', { name: /\+ add new supplier/i });
  if (await addBtn.isVisible().catch(() => false)) {
    await addBtn.click();
  }
  await fillLabeledField(page, /supplier name/i, name);
  await page.getByRole('button', { name: /save supplier/i }).click();
  await expect(page.getByText(/Supplier added/i).first()).toBeVisible({
    timeout: 15_000,
  });

  // Ensure the new supplier is selected (auto-select can race with refetch).
  const supplierTrigger = page
    .locator('label')
    .filter({ hasText: /^Supplier\*/i })
    .locator('..')
    .getByRole('combobox');
  await expect(supplierTrigger).toBeVisible({ timeout: 10_000 });
  const selected = (await supplierTrigger.textContent()) || '';
  if (!selected.toLowerCase().includes(name.slice(0, 12).toLowerCase())) {
    await supplierTrigger.click();
    const opt = page.getByRole('option', { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
    await expect(opt.first()).toBeVisible({ timeout: 15_000 });
    await opt.first().click();
  }
  await expect(supplierTrigger).toContainText(name.slice(0, 12), { timeout: 10_000 });
}

export async function selectAcquisitionMode(
  page: Page,
  mode: 'individual' | 'new_batch' | 'existing_batch',
) {
  const id =
    mode === 'individual'
      ? 'acq-individual'
      : mode === 'new_batch'
        ? 'acq-new-batch'
        : 'acq-existing-batch';
  await page.locator(`label[for="${id}"]`).click();
}

export async function fillBatchSharedFees(page: Page, transport: string, misc: string) {
  await expect(page.locator('h4', { hasText: /Shared batch fees/i })).toBeVisible();
  // Prefer labeled fields — parent of the h4 also contains purchase date.
  await fillLabeledField(page, /^Transportation fee/i, transport);
  await fillLabeledField(page, /^Miscellaneous fee/i, misc);
}

export async function submitAddProperty(page: Page) {
  const btn = page.getByRole('button', { name: /^Add Property$/i });
  await expect(btn).toBeEnabled({ timeout: 25_000 });
  await btn.click();
  const success = page.getByText(/Property Added/i);
  const errorToast = page.locator('[data-sonner-toast][data-type="error"], [role="status"]').filter({
    hasText: /fail|error|required|invalid/i,
  });
  await Promise.race([
    success.waitFor({ state: 'visible', timeout: 45_000 }),
    errorToast.first().waitFor({ state: 'visible', timeout: 45_000 }).then(async () => {
      const msg = await errorToast.first().innerText();
      throw new Error(`Add Property failed: ${msg}`);
    }),
  ]);
  await expect(success).toBeVisible();
  await page.getByRole('button', { name: /^Ok$/i }).click();
}

/** Open property details via the card overflow menu (name is not a link). */
export async function openPropertyDetails(page: Page, propertyName: string) {
  await page.goto('/dashboard/properties');
  const search = page.getByPlaceholder(/search/i);
  if (await search.count()) {
    await search.fill(propertyName);
    await page.waitForTimeout(800);
  }

  const heading = page.getByRole('heading', {
    name: new RegExp(propertyName.slice(0, 24), 'i'),
  });
  await expect(heading).toBeVisible({ timeout: 20_000 });

  // Three-dots menu beside the price under the card title
  await heading.locator('xpath=following-sibling::div[1]//button').click();
  const view = page.getByRole('menuitem', { name: /view details/i }).or(
    page.getByRole('link', { name: /view details/i }),
  );
  await view.first().click();
  await expect(page).toHaveURL(/\/dashboard\/properties\/[^/?]+/);
}
