import { test, expect } from '@playwright/test';

test.describe('Theme Toggle & Persistence', () => {
  test('toggles dark theme and persists dark class on html across page reload', async ({
    page,
  }) => {
    await page.goto('/');

    const themeToggleBtn = page.locator('button[aria-label*="theme"]').first();
    await expect(themeToggleBtn).toBeVisible();

    // Check initial mode
    const html = page.locator('html');
    const isInitiallyDark = await html.evaluate((el) => el.classList.contains('dark'));

    // Toggle theme
    await themeToggleBtn.click();

    // Verify dark class toggled
    const isAfterClickDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isAfterClickDark).toBe(!isInitiallyDark);

    // Reload page
    await page.reload();

    // Verify theme state persisted on html
    const isPersistedDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(isPersistedDark).toBe(isAfterClickDark);
  });
});
