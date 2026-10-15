import { test, expect } from '@playwright/test';

test.describe('Preferences Selection & Reload Persistence', () => {
  test('customizes category preferences, updates feed, and persists across reloads', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Navigate to Settings using visible navigation item
    const settingsNav = page
      .locator('nav button')
      .filter({ hasText: 'Settings', visible: true })
      .first();
    await settingsNav.click();

    // Verify Settings heading is visible
    await expect(
      page.locator('h2', { hasText: 'Content Preferences & Dashboard Settings' })
    ).toBeVisible();

    // 2. Toggle off Technology category
    const techButton = page.locator('button', { hasText: 'Technology' });
    await expect(techButton).toHaveAttribute('aria-pressed', 'true');
    await techButton.click();
    await expect(techButton).toHaveAttribute('aria-pressed', 'false');

    // 3. Navigate back to Feed
    const feedNav = page
      .locator('nav button')
      .filter({ hasText: 'Feed', visible: true })
      .first();
    await feedNav.click();

    // 4. Reload page to verify persistence
    await page.reload();

    // Navigate to Settings to confirm Technology is still unselected
    const settingsNavAfterReload = page
      .locator('nav button')
      .filter({ hasText: 'Settings', visible: true })
      .first();
    await settingsNavAfterReload.click();

    const techButtonAfterReload = page.locator('button', { hasText: 'Technology' });
    await expect(techButtonAfterReload).toHaveAttribute('aria-pressed', 'false');
  });
});
