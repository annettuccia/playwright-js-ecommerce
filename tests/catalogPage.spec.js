import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage.js';

test.describe('Catalog functionality', () => {
    let catalogPage;

    test.beforeEach(async ({ page }) => {
        catalogPage = new CatalogPage(page);
        console.log('\nStarting new catalog test with a new login page and catalog page\n');
    });

    test('TC#37: Verifying the display of all elements in the product card preview', async ({ page }) => { });
    test('TC#38: Verification of the unified format for displaying product prices', async ({ page }) => { });
    test('TC#39: Checking for alt text on product images', async ({ page }) => { });
    test('TC#40: Navigate to the product details page upon clicking the product preview card', async ({ page }) => { });
    test('TC#41: Adding an item to the cart from the catalog', async ({ page }) => { });
    test('TC#42: Verifying behavior when re-adding the same item', async ({ page }) => { });
    test('TC#43: Catalog display when there are no products', async ({ page }) => { });
});