import { test, expect } from '@playwright/test';
import { loginViaApi } from './helpers/auth';
import {
  mockMediaUpload,
  uploadFakePropertyImage,
  fillBasePropertyForm,
  createSupplierInline,
  selectAcquisitionMode,
  fillLabeledField,
  fillBatchSharedFees,
  submitAddProperty,
  openPropertyDetails,
} from './helpers/purchase';

/**
 * Frontend E2E for purchase / acquisition flows.
 *
 * Listing price is Cost + Markup only (no manual selling price).
 *
 * Run (API must be up with purchase module):
 *   E2E_API_URL=http://localhost:3100/api E2E_DASHBOARD_URL=http://127.0.0.1:5174 npm run test:e2e:purchase
 */

test.describe.configure({ mode: 'serial' });

const stamp = Date.now();
let createdPropertyName = '';
let supplierName = '';

test.beforeEach(async ({ page, request }) => {
  await mockMediaUpload(page);
  await loginViaApi(page, request);
});

test.describe('Purchase acquisition UI', () => {
  test('Purchases list page loads', async ({ page }) => {
    await page.goto('/dashboard/properties/purchases');
    await expect(page.getByText(/Purchases/i).first()).toBeVisible();
    await expect(page.getByText(/something went wrong/i)).toHaveCount(0);
  });

  test('Add individual purchase with cost + markup', async ({ page }) => {
    createdPropertyName = `FE E2E Individual ${stamp}`;
    supplierName = `FE E2E Supplier ${stamp}`;

    await page.goto('/dashboard/properties/add');
    await uploadFakePropertyImage(page);
    await fillBasePropertyForm(page, {
      name: createdPropertyName,
      chassisSuffix: `${stamp}-1`,
    });

    await selectAcquisitionMode(page, 'individual');
    await createSupplierInline(page, supplierName);

    await fillLabeledField(page, /Purchase Price \(per unit\)/i, '200000');
    await fillLabeledField(page, /Transportation fee/i, '10000');
    await fillLabeledField(page, /Miscellaneous fee/i, '5000');

    await page.locator('label[for="price-markup"]').click();
    await fillLabeledField(page, /Markup \(%\)/i, '20');
    await expect(page.getByText(/Estimated acquisition cost/i)).toBeVisible();
    await expect(page.getByText(/Listing price \(per unit\)/i)).toBeVisible();

    await submitAddProperty(page);
  });

  test('Property details shows acquisition cost and Edit Acquisition', async ({
    page,
  }) => {
    await openPropertyDetails(page, createdPropertyName);
    await expect(page.getByText(/Acquisition Information/i)).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/Total Acquisition Cost/i)).toBeVisible();
    await expect(page.getByText(/Loading acquisition/i)).toHaveCount(0);
    await expect(page.getByText(/No acquisition has been recorded/i)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Edit Acquisition/i })).toBeVisible();
    await expect(page.getByText(/Cost \+ Markup/i)).toBeVisible();
    await expect(page.getByText(/Selling Price/i)).toBeVisible();
  });

  test('Edit Acquisition corrects individual fees', async ({ page }) => {
    if (!/\/dashboard\/properties\/[^/?]+/.test(page.url())) {
      await openPropertyDetails(page, createdPropertyName);
    }

    await page.getByRole('button', { name: /Edit Acquisition/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: /Edit Acquisition/i })).toBeVisible();

    // Labels include a required "*", so avoid end-anchored /^Transportation$/
    await fillLabeledField(dialog, /^Transportation/i, '30000');
    await dialog.getByRole('button', { name: /Save Acquisition/i }).click();
    await expect(page.getByText(/Acquisition updated/i)).toBeVisible({
      timeout: 20_000,
    });
    await expect(dialog).toBeHidden({ timeout: 10_000 });
    await expect(
      page.getByText('Total Acquisition Cost', { exact: true }),
    ).toBeVisible();
  });

  test('Add new EQUAL batch purchase', async ({ page }) => {
    const batchPropertyName = `FE E2E Batch A ${stamp}`;

    await page.goto('/dashboard/properties/add');
    await uploadFakePropertyImage(page);
    await fillBasePropertyForm(page, {
      name: batchPropertyName,
      chassisSuffix: `${stamp}-2`,
    });

    await selectAcquisitionMode(page, 'new_batch');

    const supplierTrigger = page
      .locator('label')
      .filter({ hasText: /^Supplier\*/i })
      .locator('..')
      .getByRole('combobox');
    if (await supplierTrigger.count()) {
      await supplierTrigger.click();
      const opt = page.getByRole('option', { name: new RegExp(supplierName, 'i') });
      if (await opt.count()) await opt.first().click();
      else {
        await page.keyboard.press('Escape');
        await createSupplierInline(page, `${supplierName} Batch`);
      }
    } else {
      await createSupplierInline(page, `${supplierName} Batch`);
    }

    await fillLabeledField(page, /Purchase Price \(per unit\)/i, '100000');
    await fillBatchSharedFees(page, '10000', '0');
    await page.locator('label[for="price-markup"]').click();
    await fillLabeledField(page, /Markup \(%\)/i, '20');

    await submitAddProperty(page);
  });

  test('Add property to existing batch', async ({ page }) => {
    const name = `FE E2E Batch B ${stamp}`;

    await page.goto('/dashboard/properties/add');
    await uploadFakePropertyImage(page);
    await fillBasePropertyForm(page, {
      name,
      chassisSuffix: `${stamp}-3`,
    });

    await selectAcquisitionMode(page, 'existing_batch');

    const batchTrigger = page
      .locator('label')
      .filter({ hasText: /Purchase batch/i })
      .locator('..')
      .getByRole('combobox');
    await expect(batchTrigger).toBeEnabled({ timeout: 15_000 });
    await batchTrigger.click();
    await page.getByRole('option').first().click();

    await fillLabeledField(page, /Purchase Price \(per unit\)/i, '200000');
    await page.locator('label[for="price-markup"]').click();
    await fillLabeledField(page, /Markup \(%\)/i, '25');

    await submitAddProperty(page);
  });

  test('Edit property modal shows read-only acquisition', async ({ page }) => {
    await openPropertyDetails(page, createdPropertyName);

    await page.getByRole('button', { name: /Edit property/i }).click();
    const editDialog = page.getByRole('dialog');
    await expect(editDialog.getByText(/Edit Property Details/i)).toBeVisible();
    await expect(
      editDialog.getByRole('heading', { name: /Acquisition Information — Read Only/i }),
    ).toBeVisible();
    await expect(
      editDialog.getByText(/managed through the purchase record/i),
    ).toBeVisible();
    await expect(
      editDialog.getByRole('button', { name: /Edit Acquisition/i }),
    ).toBeVisible();
    await expect(editDialog.getByText(/Selling Price/i)).toBeVisible();
  });
});
