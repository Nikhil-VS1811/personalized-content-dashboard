import { test, expect } from '@playwright/test';

test.describe('Partial-Source Failure & Recovery', () => {
  test('gracefully isolates source errors and recovers on retry', async ({ page }) => {
    let shouldFailNews = true;

    // Intercept internal /api/news route to simulate upstream provider 502 error
    await page.route('**/api/news*', async (route) => {
      if (shouldFailNews) {
        await route.fulfill({
          status: 502,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Failed to fetch news stream',
            details: 'Upstream News provider 502 Bad Gateway',
            statusCode: 502,
            source: 'news',
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    // 1. Verify that News source error alert is visible
    const errorAlert = page.locator('text=News Feed:');
    await expect(errorAlert).toBeVisible();

    // 2. Verify that non-failed sources (movies, social) still render cards in the feed!
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    // 3. Test Retry recovery: allow news requests to succeed
    shouldFailNews = false;
    const retryBtn = page.locator('button', { hasText: 'Retry' }).first();
    await expect(retryBtn).toBeVisible();
    await retryBtn.click();

    // Verify error alert disappears on successful retry recovery
    await expect(errorAlert).not.toBeVisible({ timeout: 5000 });
  });
});
