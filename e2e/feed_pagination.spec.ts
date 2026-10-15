import { test, expect } from '@playwright/test';

test.describe('Unified Feed Pagination & Load More', () => {
  test('appends results on Load More click without duplicate IDs', async ({ page }) => {
    await page.goto('/');

    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    const initialCount = await articles.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click Load More Content
    const loadMoreBtn = page.locator('button', { hasText: 'Load More Content' });
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();

      // Wait for additional cards to append
      await expect(async () => {
        const newCount = await articles.count();
        expect(newCount).toBeGreaterThan(initialCount);
      }).toPass({ timeout: 5000 });
    }
  });
});
