import { test, expect } from '@playwright/test';

test('homepage loads with correct title', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');

  // Check if the page title is correct
  await expect(page).toHaveTitle('AnimalAllies');
});

test('homepage UI elements are visible', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/');
  
  // Check if the main container is visible
  await expect(page.locator('#root')).toBeVisible();
});