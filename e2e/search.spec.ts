import { test, expect } from '@playwright/test';

test.describe('Search Interactions & Debounce', () => {
  test('opens search modal, debounces input, displays matches, and handles empty results', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open search modal by clicking search bar or shortcut
    const searchInput = page.locator('#dashboard-search-input');
    await searchInput.click();

    const modalInput = page.locator('#search-modal-input');
    await expect(modalInput).toBeVisible();

    // 2. Type search query with debounce
    await modalInput.fill('Interstellar');
    // Allow debounce timer (350ms) + request to finish
    await page.waitForTimeout(600);

    // Verify search results contain Interstellar
    const cardTitle = page.locator('article h3').filter({ hasText: /Interstellar/i });
    await expect(cardTitle.first()).toBeVisible();

    // 3. Clear search input
    const clearButton = page.locator('button[aria-label="Clear search input"]');
    await clearButton.click();
    await expect(modalInput).toHaveValue('');

    // 4. Test empty results
    await modalInput.fill('xyznonexistentquery999');
    await page.waitForTimeout(600);

    const emptyNotice = page.locator('text=No matches found for');
    await expect(emptyNotice).toBeVisible();

    // 5. Close search modal with Escape key
    await page.keyboard.press('Escape');
    await expect(modalInput).not.toBeVisible();
  });
});
