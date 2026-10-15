import { test, expect } from '@playwright/test';

test.describe('Favorites Bookmark & Persistence', () => {
  test('favorites a card, verifies it in Favorites view, and survives reload', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Wait for feed cards to load
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    // 2. Click the favorite button on the first card
    const favBtn = articles.first().locator('button[aria-label*="favorites"]').first();
    await favBtn.click();

    // 3. Navigate to Favorites section using the visible navigation control
    const favoritesNav = page
      .locator('nav button')
      .filter({ hasText: 'Favorites', visible: true })
      .first();
    await favoritesNav.click();

    // Verify Favorites heading is visible
    await expect(page.locator('h2', { hasText: 'Saved Favorites' })).toBeVisible();

    // 4. Reload page to verify saved favorites remain rendered
    await page.reload();

    const favoritesNavAfterReload = page
      .locator('nav button')
      .filter({ hasText: 'Favorites', visible: true })
      .first();
    await favoritesNavAfterReload.click();

    // Confirm that favorites view still renders saved articles
    const favArticles = page.locator('article');
    await expect(favArticles.first()).toBeVisible();
  });
});
