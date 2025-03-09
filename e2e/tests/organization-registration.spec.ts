import { test, expect } from '@playwright/test';
import path from 'path';

const validKRS = '0000000963';
const validKRS2 = '0000000291';

test('should successfully register an organization (happy path)', async ({ page }) => {
  await page.goto('/register');

  await expect(page).toHaveTitle(/AnimalAllies/);

  await page.getByLabel('KRS Number').fill(validKRS);

  // Wait for auto-fill to complete
  await expect(page.getByLabel('Organization Name')).toHaveValue(/STOWARZYSZENIE/i, { timeout: 5000 });

  await page.getByLabel('Email').fill('animal@allies.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByLabel('Phone').fill('+48123456789');

  await page.getByLabel('Address').fill('Animal Street 123');
  await page.getByLabel('Postal Code').fill('50-001');

  const logoPath = path.join(__dirname, '../files/app-logo.png');
  await page.getByLabel('Upload Logo').setInputFiles(logoPath);

  await page.getByLabel('Description').fill('This is a test animal org created by an E2E tests. Description should meet the minimum length requirements.');

  await page.getByLabel('Website').fill('https://animal-org.example.com');

  await page.getByText('Select at least one').click();
  await page.getByText('Dogs').click();
  await page.getByText('Cats').click();
  await page.keyboard.press('Escape');

  await page.getByLabel('Accept Reports').check();

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText('Registration was successful!')).toBeVisible({ timeout: 10000 });
});

test('should show validation errors when submitting invalid data', async ({ page }) => {
  await page.goto('/register');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText(/KRS/i).nth(1)).toBeVisible();

  await page.getByLabel('KRS Number').fill(validKRS2);

  await expect(page.getByLabel('Organization Name')).toHaveValue(/FUNDACJA/i, { timeout: 5000 });

  await page.getByLabel('Email').fill('animal@allies.test');
  await page.getByLabel('Password').fill('weak');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.locator('.form-item__message').first()).toBeVisible();
  await expect(page.getByText(/invalid/i).first()).toBeVisible();
});