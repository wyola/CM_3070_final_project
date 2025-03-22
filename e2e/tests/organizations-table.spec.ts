import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Sample KRS numbers from the whitelist
const krsOrg1 = '0000001767'; // BOKSERSKI KLUB SPORTOWY JASTRZĘBIE, ŚLĄSKIE
const krsOrg2 = '0000002503'; // KLUB ŻEGLARSKI "ORKAN", PODKARPACKIE
const krsOrg3 = '0000003968'; // STOWARZYSZENIE NA RZECZ REHABILITACJI PSYCHIATRYCZNEJ, PODLASKIE
const krsOrg4 = '0000861820'; // STOWARZYSZENIE WOLONTARIAT SCHRONISKA DLA PSÓW W NOWODWORZE, LUBELSKIE

// Helper function to register an organization
async function registerOrganization(
  page: Page,
  krs: string,
  email: string,
  postalCode: string,
  address: string,
  acceptsReports: boolean,
  animals: string[]
) {
  await page.goto('/register');
  await page.getByLabel('KRS Number').fill(krs);

  // Wait for auto-fill to complete
  await expect(page.getByLabel('Organization Name')).toHaveValue(/.*/, {
    timeout: 5000,
  });

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Password123!');
  await page.getByLabel('Phone').fill('+48123456789');
  await page.getByLabel('Address').fill(address);
  await page.getByLabel('Postal Code').fill(postalCode);
  
  //@ts-ignore
  const logoPath = path.join(__dirname, '../files/app-logo.png');
  await page.getByLabel('Upload Logo').setInputFiles(logoPath);

  // Fill rich text editor
  await page
    .locator('.rich-text-editor-form-field__editor [contenteditable="true"]')
    .click();
  await page.keyboard.type(
    'This is a test animal organization created by E2E tests. Description meets the minimum length requirements.'
  );

  await page.getByLabel('Website').fill('https://animal-org.example.com');

  // Select animals
  await page.getByText('Select at least one').click();
  for (const animal of animals) {
    await page.getByText(animal, { exact: true }).click();
  }
  await page.keyboard.press('Escape');

  // Set "Accept Reports" based on parameter
  if (acceptsReports) {
    await page.getByLabel('Accept Reports').check();
  } else {
    await page.getByLabel('Accept Reports').uncheck();
  }

  await page.getByRole('button', { name: 'Register' }).click();

  // Verify registration was successful
  await expect(page.getByText('Registration was successful!')).toBeVisible();
}

test.describe('Organizations Table', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    // Register organizations with different attributes
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await registerOrganization(
      page1,
      krsOrg1,
      'org1@test.com',
      '44-335',
      'Al. Jana Pawła II 6',
      true,
      ['Dogs', 'Cats']
    );
    await page1.close();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await registerOrganization(
      page2,
      krsOrg2,
      'org2@test.com',
      '39-300',
      'Mickiewicza 2',
      false,
      ['Birds', 'Other']
    );
    await page2.close();
    await context2.close();

    const context3 = await browser.newContext();
    const page3 = await context3.newPage();
    await registerOrganization(
      page3,
      krsOrg3,
      'org3@test.com',
      '15-225',
      'Grottgera 8',
      true,
      ['Horses', 'Other']
    );
    await page3.close();
    await context3.close();

    const context4 = await browser.newContext();
    const page4 = await context4.newPage();
    await registerOrganization(
      page4,
      krsOrg4,
      'org4@test.com',
      '22-068',
      'Stanisława Leszczyńskiego 23',
      false,
      ['Dogs']
    );
    await page4.close();
    await context4.close();
  });

  test('should display all registered organizations', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    const orgRows = page.locator('table tbody tr');

    await expect(await orgRows.count()).toBeGreaterThanOrEqual(4);

    // Check if organizations have correct data
    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();

    expect(
      orgNames.some((name) => name.toLowerCase().includes('bokserski'))
    ).toBeTruthy();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('orkan'))
    ).toBeTruthy();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('rehabilitacji'))
    ).toBeTruthy();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('schroniska'))
    ).toBeTruthy();
  });

  test('should filter organizations by voivodeship', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    await page
      .getByRole('combobox')
      .filter({ hasText: 'All voivodeships' })
      .click();

    await page.getByLabel('Lubelskie').getByText('Lubelskie').click();

    // Wait for filtered results to be updated
    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/organizations') &&
        response.status() === 200
    );

    const orgRows = page.locator('table tbody tr');

    await expect(await orgRows.count()).toBeGreaterThanOrEqual(1);

    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('wolontariat'))
    ).toBeTruthy();
  });

  test('should filter organizations by animals they handle', async ({
    page,
  }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    await page.getByText('Select animals').click();
    await page.getByText('Birds', { exact: true }).click();
    await page.keyboard.press('Escape');

    await page.waitForTimeout(1000);

    const orgRows = page.locator('table tbody tr');

    await expect(orgRows).toHaveCount(1);

    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();
    expect(orgNames[0].toLowerCase()).toContain('orkan');
  });

  test('should filter organizations by whether they accept reports', async ({
    page,
  }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    await page.getByText('Accepts reports').check();

    await page.waitForTimeout(1000);

    const orgRows = page.locator('table tbody tr');

    await expect(await orgRows.count()).toBeGreaterThanOrEqual(2);

    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('bokserski'))
    ).toBeTruthy();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('rehabilitacji'))
    ).toBeTruthy();
  });

  test('should search organizations by name', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    await page.getByPlaceholder('Search by name or city...').fill('schroniska');

    await page.waitForTimeout(1000);

    const orgRows = page.locator('table tbody tr');

    await expect(await orgRows.count()).toBeGreaterThanOrEqual(1);

    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('schroniska'))
    ).toBeTruthy();
  });

  test('should combine multiple filters', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('table tbody tr', { state: 'visible' });

    await page.getByText('Accepts reports').check();
    await page.getByText('Select animals').click();
    await page.getByText('Horses', { exact: true }).click();
    await page.keyboard.press('Escape');

    await page.waitForTimeout(1000);

    const orgRows = page.locator('table tbody tr');

    await expect(await orgRows.count()).toBeGreaterThanOrEqual(1);

    const orgNames = await orgRows.locator('td:nth-child(1)').allTextContents();
    expect(
      orgNames.some((name) => name.toLowerCase().includes('rehabilitacji'))
    ).toBeTruthy();
  });
});
