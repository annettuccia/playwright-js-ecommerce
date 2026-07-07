import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { UserHeader } from '../pages/UserHeader.js';
import { URLS } from '../config/url.js';
import { CREDENTIALS } from '../config/credentials.js';

test.describe('User header functionality', () => {
    let loginPage;
    let catalogPage;
    let userHeader;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        catalogPage = new CatalogPage(page);
        userHeader = new UserHeader(page);

        console.log('\nStarting new user header test with a new login page ans a new catalog page');

        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user1.email, CREDENTIALS.user1.password);
        console.log(`User with email ${CREDENTIALS.user1.email} is authenticated as a norman user\n`);

        await expect(page).toHaveURL(URLS.catalog);
        await catalogPage.gotoCatalogPage();
    });

    test('TC#32: Go to cart page', async ({ page }) => {
        const isCartIconVisible = await userHeader.IsCartIconBtnVisible();
        expect(isCartIconVisible).toBeTruthy();

        await userHeader.clickCartIconHeaderBtn();
        await expect(page).toHaveURL(URLS.cart);
        console.log('User is on page "Cart"');
    });

    test('TC#33: Go to the orders page', async ({ page }) => {
        const isOrderBtnVisible = await userHeader.isOrderBtnVisible();
        expect(isOrderBtnVisible).toBeTruthy();

        await userHeader.clickOrdersHeaderBtn();
        await expect(page).toHaveURL(URLS.orders);
        console.log('User is on page "Orders"');
    });

    test('TC#34: User is displayed (drop-down menu can be opened)', async ({ page }) => {
        const username = await userHeader.getUsername();
        expect(username).toContain('user1');

        const menuItems = await userHeader.getUserMenuItems();

        expect(menuItems.userFullName).toContain('John Doe');
        expect(menuItems.email).toContain('user1@test.com');
        expect(menuItems.profileText).toContain('Профиль');
        expect(menuItems.ordersText).toContain('История заказов');
        expect(menuItems.logoutText).toContain('Выйти');

        console.log('Drop-down menu is correctly displayed');
    });

    test('TC#35: Go to user profile page', async ({ page }) => {
        await userHeader.clickProfile();
        await expect(page).toHaveURL(URLS.profile);
    });

    test('TC#36: Log out of account', async ({ page }) => {
        await userHeader.clickLogout();
        await expect(page).toHaveURL(URLS.login);
    });
});