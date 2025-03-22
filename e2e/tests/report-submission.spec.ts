import { test, expect, Page } from '@playwright/test';
import path from 'path';

const krsOrgAcceptingReports = '0000024649';
const krsOrgDecliningReports = '0000024839';

async function registerOrganization(
  page: Page,
  krs: string,
  email: string,
  postalCode: string,
  address: string,
  acceptsReports: boolean
) {
  await page.goto('/register');
  await page.getByLabel('KRS Number').fill(krs);

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

  await page
    .locator('.rich-text-editor-form-field__editor [contenteditable="true"]')
    .click();
  await page.keyboard.type(
    'This is a test animal organization created by E2E tests. Description meets the minimum length requirements.'
  );

  await page.getByLabel('Website').fill('https://animal-org.example.com');

  await page.getByText('Select at least one').click();
  await page.getByText('Dogs').click();
  await page.getByText('Cats').click();
  await page.keyboard.press('Escape');

  if (acceptsReports) {
    await page.getByLabel('Accept Reports').check();
  } else {
    await page.getByLabel('Accept Reports').uncheck();
  }

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByText('Registration was successful!')).toBeVisible();
}

test.describe('Report Submission', () => {
  test.beforeAll(async ({ browser }) => {
    // Register two organizations: one that accepts reports and one that doesn't
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await registerOrganization(
      page1,
      krsOrgAcceptingReports,
      'accepts-reports@test.com',
      '20-236',
      'Doświadczalna 46',
      true
    );
    await page1.close();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await registerOrganization(
      page2,
      krsOrgDecliningReports,
      'no-reports@test.com',
      '17-200',
      'Ks. Ściegiennego 7',
      false
    );
    await page2.close();
    await context2.close();
  });

  test('should successfully submit a report using the map location', async ({
    page,
  }) => {
    await page.goto('/report');

    await page.getByLabel('Title').fill('Stray dog needs help');

    await page.getByText('Select animals involved').click();
    await page.getByText('Dogs').click();
    await page.keyboard.press('Escape');

    await page
      .locator('.rich-text-editor-form-field__editor [contenteditable="true"]')
      .click();
    await page.keyboard.type(
      "I found a stray dog that appears injured and needs medical attention. It looks like it hasn't eaten in days."
    );

    await expect(page.locator('.report__form--map')).toBeVisible({
      timeout: 10000,
    });

    await expect(page.locator('.map-pin')).toBeVisible();

    await page.getByLabel('Your Name (optional)').fill('Test Reporter');
    await page.getByLabel('Email (optional)').fill('reporter@test.com');
    await page.getByLabel('Phone Number (optional)').fill('123456789');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('.report-summary__title')).toBeVisible();
    await expect(page.locator('.report-summary__title')).toContainText(
      'Your report was sent to the following organizations'
    );

    const orgLinks = page.locator('.report-summary__link');
    await expect(await orgLinks.count()).toBeGreaterThanOrEqual(1);
    const orgLinkTexts = await orgLinks.allTextContents();
    expect(
      orgLinkTexts.some((text) => text.toLowerCase().includes('stowarzyszenie'))
    ).toBeTruthy();
  });

  test('should successfully submit a report using address details', async ({
    page,
  }) => {
    await page.goto('/report');

    await page.getByLabel('Title').fill('Cat colony needs help');

    await page.getByText('Select animals involved').click();
    await page.getByText('Cats').click();
    await page.keyboard.press('Escape');

    await page
      .locator('.rich-text-editor-form-field__editor [contenteditable="true"]')
      .click();
    await page.keyboard.type(
      'There is a colony of stray cats near the abandoned building. They need food and medical attention urgently.'
    );

    await page.getByRole('tab', { name: 'Type address' }).click();

    await page.getByRole('textbox', { name: 'Address *' }).fill('Bardzka 32');
    await page.getByLabel('City').fill('Wrocław');
    await page.getByLabel('Postal Code').fill('50-517');

    await page
      .getByLabel('I want to provide my contact information (optional)')
      .uncheck();

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.locator('.report-summary__title')).toBeVisible();

    const orgLinks = page.locator('.report-summary__link');
    await expect(await orgLinks.count()).toBeGreaterThanOrEqual(1);
    const orgLinkTexts = await orgLinks.allTextContents();
    expect(
      orgLinkTexts.some((text) => text.toLowerCase().includes('stowarzyszenie'))
    ).toBeTruthy();
  });

  test('should show validation errors when submitting invalid data', async ({
    page,
  }) => {
    await page.goto('/report');

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(
      await page.locator('.text-destructive').count()
    ).toBeGreaterThan(1);

    await page.getByLabel('Title').fill('Invalid report');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(
      await page.locator('.text-destructive').count()
    ).toBeGreaterThan(1);

    const errorTexts = await page
      .locator('.text-destructive')
      .allTextContents();
    expect(
      errorTexts.some((text) =>
        text.toLowerCase().includes('at least one animal')
      )
    ).toBeTruthy();
    expect(
      errorTexts.some((text) => text.toLowerCase().includes('description'))
    ).toBeTruthy();
  });
});
