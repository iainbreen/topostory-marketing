import { test, expect } from '@playwright/test';

test.describe('Cookie Consent Banner', () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies before each test
    await context.clearCookies();
  });

  test('shows banner on first visit when no consent exists', async ({ page }) => {
    await page.goto('/');

    // Banner should be visible
    await expect(page.getByText('We use cookies to enhance your experience')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reject All' })).toBeVisible();
    await expect(page.getByText('Customize')).toBeVisible();
  });

  test('hides banner after clicking Accept All', async ({ page }) => {
    await page.goto('/');

    // Click Accept All
    await page.getByRole('button', { name: 'Accept All' }).click();

    // Banner should disappear
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('hides banner after clicking Reject All', async ({ page }) => {
    await page.goto('/');

    // Click Reject All
    await page.getByRole('button', { name: 'Reject All' }).click();

    // Banner should disappear
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('does not show banner on subsequent visits after consent', async ({ page }) => {
    await page.goto('/');

    // Accept cookies
    await page.getByRole('button', { name: 'Accept All' }).click();

    // Reload page
    await page.reload();

    // Banner should not appear
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('opens preferences modal when clicking Customize', async ({ page }) => {
    await page.goto('/');

    // Click Customize
    await page.getByText('Customize').click();

    // Modal should appear with category labels
    await expect(page.getByRole('heading', { name: 'Cookie Preferences' })).toBeVisible();
    await expect(page.getByText('Necessary', { exact: true })).toBeVisible();
    await expect(page.getByText('Analytics', { exact: true })).toBeVisible();
    await expect(page.getByText('Support & Marketing', { exact: true })).toBeVisible();
  });

  test('can toggle preferences in modal', async ({ page }) => {
    await page.goto('/');

    // Open preferences
    await page.getByText('Customize').click();

    // Toggle analytics on
    const analyticsToggle = page.locator('#toggle-analytics');
    await analyticsToggle.click();
    await expect(analyticsToggle).toHaveAttribute('aria-checked', 'true');

    // Toggle it back off
    await analyticsToggle.click();
    await expect(analyticsToggle).toHaveAttribute('aria-checked', 'false');
  });

  test('saves preferences when clicking Save Preferences', async ({ page }) => {
    await page.goto('/');

    // Open preferences
    await page.getByText('Customize').click();

    // Enable analytics only
    await page.locator('#toggle-analytics').click();

    // Save
    await page.getByRole('button', { name: 'Save Preferences' }).click();

    // Modal and banner should close
    await expect(page.locator('#cookie-modal')).toBeHidden();
    await expect(page.locator('#cookie-banner')).toBeHidden();
  });

  test('closes modal on Cancel and shows banner again', async ({ page }) => {
    await page.goto('/');

    // Open preferences
    await page.getByText('Customize').click();

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Modal should close but banner should reappear (since no consent was given)
    await expect(page.locator('#cookie-modal')).toBeHidden();
    await expect(page.locator('#cookie-banner')).toBeVisible();
  });

  test('sets correct cookie value on Accept All', async ({ page, context }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Accept All' }).click();

    // Check cookie was set
    const cookies = await context.cookies();
    const consentCookie = cookies.find(c => c.name === 'topostory_consent');

    expect(consentCookie).toBeDefined();

    const value = JSON.parse(decodeURIComponent(consentCookie!.value));
    expect(value.categories.analytics).toBe(true);
    expect(value.categories.marketing).toBe(true);
    expect(value.categories.necessary).toBe(true);
  });

  test('sets correct cookie value on Reject All', async ({ page, context }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Reject All' }).click();

    // Check cookie was set
    const cookies = await context.cookies();
    const consentCookie = cookies.find(c => c.name === 'topostory_consent');

    expect(consentCookie).toBeDefined();

    const value = JSON.parse(decodeURIComponent(consentCookie!.value));
    expect(value.categories.analytics).toBe(false);
    expect(value.categories.marketing).toBe(false);
    expect(value.categories.necessary).toBe(true);
  });

  test('Cookie Settings link in footer opens modal', async ({ page }) => {
    await page.goto('/');

    // First accept to hide banner
    await page.getByRole('button', { name: 'Accept All' }).click();

    // Click Cookie Settings in footer
    await page.locator('#cookie-settings-trigger').click();

    // Modal should appear
    await expect(page.getByRole('heading', { name: 'Cookie Preferences' })).toBeVisible();
  });

  test('banner appears on all pages', async ({ page }) => {
    // Test homepage
    await page.goto('/');
    await expect(page.locator('#cookie-banner')).toBeVisible();

    // Clear cookies and test pricing page
    await page.context().clearCookies();
    await page.goto('/pricing');
    await expect(page.locator('#cookie-banner')).toBeVisible();

    // Clear cookies and test features page
    await page.context().clearCookies();
    await page.goto('/features');
    await expect(page.locator('#cookie-banner')).toBeVisible();
  });
});
