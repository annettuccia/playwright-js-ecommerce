import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage.js';

test.describe('Catalog functionality', () => {
    let cartPage;

    test.beforeEach(async ({ page }) => {
        cartPage = new CartPage(page);
        console.log('\nStarting new catalog test with a new login page and catalog page\n');
    });

    test('TC#44: Each item in the cart has a "Remove" button.', async ({ page }) => { });
    test('TC#45: Placing an order with an empty cart', async ({ page }) => { });
    test('TC#46: Removing the last item from the cart', async ({ page }) => { });
    test('TC#47: Displaying the total amount for items with different prices', async ({ page }) => { });
    test('TC#48: Placing an order from the shopping cart', async ({ page }) => { });
});