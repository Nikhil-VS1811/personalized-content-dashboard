import { test, expect } from '@playwright/test';

test.describe('Card Reordering (Pointer Drag, Keyboard & Persistence)', () => {
  test('reorders cards via pointer drag-and-drop using the drag handle across the grid, persists across reload, and verifies links/favorites work', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'HTML5 pointer drag is designed for desktop pointer devices; mobile touch reordering is verified via touch controls.');

    await page.goto('/');

    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    // Capture initial titles for card 1 and card 2
    const firstTitleBefore = (await articles.nth(0).locator('h3').first().innerText()).trim();
    const secondTitleBefore = (await articles.nth(1).locator('h3').first().innerText()).trim();
    expect(firstTitleBefore).not.toEqual(secondTitleBefore);

    // Locate the first card's drag handle and target the second card container
    const firstDragHandle = articles.nth(0).locator('[role="button"][aria-label*="Reorder card:"]');
    const secondCard = articles.nth(1);

    await expect(firstDragHandle).toBeVisible();

    // Perform pointer drag-and-drop from the explicit handle to the second card across the responsive grid
    await firstDragHandle.dragTo(secondCard);

    // Wait for the reorder to take effect
    await expect(page.locator('text=Custom Order Active')).toBeVisible();

    // Verify order changed: the second card's original title is now at position 0
    await expect(articles.nth(0).locator('h3').first()).toHaveText(secondTitleBefore);
    await expect(articles.nth(1).locator('h3').first()).toHaveText(firstTitleBefore);

    // Verify the order survives full page reload
    await page.reload();
    await expect(page.locator('text=Custom Order Active')).toBeVisible();
    await expect(articles.nth(0).locator('h3').first()).toHaveText(secondTitleBefore);
    await expect(articles.nth(1).locator('h3').first()).toHaveText(firstTitleBefore);

    // Verify favorite buttons on reordered card toggle state reliably without interference from drag handle
    const favoriteBtn = articles.nth(0).locator('button[aria-label*="favorite"], button[aria-label*="Favorite"]').first();
    const initialFavState = (await favoriteBtn.getAttribute('aria-pressed')) === 'true';
    await favoriteBtn.click();
    await expect(favoriteBtn).toHaveAttribute('aria-pressed', initialFavState ? 'false' : 'true');

    // Verify Reset Order restores the original algorithmic sequence
    const resetOrderBtn = page.locator('button', { hasText: 'Reset Order' });
    await expect(resetOrderBtn).toBeVisible();
    await resetOrderBtn.click();

    await expect(page.locator('text=Custom Order Active')).not.toBeVisible();
    await expect(articles.nth(0).locator('h3').first()).toHaveText(firstTitleBefore);
  });

  test('reorders cards via keyboard, verifies live announcement, persists across reload, and resets', async ({
    page,
  }) => {
    await page.goto('/');

    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    const dragHandles = page.locator('[role="button"][aria-label*="Reorder card:"]');
    await expect(dragHandles.first()).toBeVisible();

    // Focus the second card's drag handle and press ArrowUp
    await dragHandles.nth(1).focus();
    await page.keyboard.press('ArrowUp');

    // Verify live region announcement
    const liveRegion = page.locator('div[role="status"]');
    await expect(liveRegion).toContainText('Moved');

    // Reload page to verify custom order is preserved
    await page.reload();
    await expect(page.locator('text=Custom Order Active')).toBeVisible();

    // Reset card order action
    const resetOrderBtn = page.locator('button', { hasText: 'Reset Order' });
    await expect(resetOrderBtn).toBeVisible();
    await resetOrderBtn.click();

    await expect(page.locator('text=Custom Order Active')).not.toBeVisible();
  });

  test('reorders cards using accessible quick-step buttons and preserves order', async ({
    page,
  }) => {
    await page.goto('/');

    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();

    const firstTitleBefore = (await articles.nth(0).locator('h3').first().innerText()).trim();
    const secondTitleBefore = (await articles.nth(1).locator('h3').first().innerText()).trim();

    // Click the "Move card down" step button on the first card
    const moveDownBtn = articles.nth(0).locator('button[title="Move card down"]');
    await expect(moveDownBtn).toBeVisible();
    await moveDownBtn.click();

    // Custom order should now be active and items swapped
    await expect(page.locator('text=Custom Order Active')).toBeVisible();
    await expect(articles.nth(0).locator('h3').first()).toHaveText(secondTitleBefore);
    await expect(articles.nth(1).locator('h3').first()).toHaveText(firstTitleBefore);

    // Verify reload persistence of quick-step reordering
    await page.reload();
    await expect(page.locator('text=Custom Order Active')).toBeVisible();
    await expect(articles.nth(0).locator('h3').first()).toHaveText(secondTitleBefore);

    // Reset order
    const resetOrderBtn = page.locator('button', { hasText: 'Reset Order' });
    await resetOrderBtn.click();
    await expect(page.locator('text=Custom Order Active')).not.toBeVisible();
    await expect(articles.nth(0).locator('h3').first()).toHaveText(firstTitleBefore);
  });
});
