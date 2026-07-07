import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage.js';

test.describe('User header buttons', () => {
    let catalogPage;

    test.beforeEach(async ({ page }) => {
        catalogPage = new CatalogPage(page);
        console.log('\nStarting new user header test with a new login page ans a new catalog page\n');
    });

    test('TC#32: Go to cart page', async({page}) => {});
    test('TC#33: Go to the orders page', async({page}) => {});
    test('TC#34: User display (drop-down menu)', async({page}) => {});
    test('TC#35: Go to user profile page', async({page}) => {});
    test('TC#36: Log out of account', async({page}) => {});
});