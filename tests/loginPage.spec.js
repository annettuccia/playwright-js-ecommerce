import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { URLS } from '../config/url.js';
import { CREDENTIALS } from '../config/credentials.js';

test.describe('Login functionality', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        console.log('Starting new login test with a new login page');
    });

    test('TC#1: Administrator login with the correct email and password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
    });

    test('TC#2: User login with a valid email and correct password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user1.email, CREDENTIALS.user1.password);
    });

    test('TC#3: Go to the registration page', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.gotoRegisterPage();

        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#4: Submit login form on Enter key press', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.loginWithEnterKey(CREDENTIALS.user2.email, CREDENTIALS.user2.password);
    });

    test('TC#5: User login with a valid email and an incorrect password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user1.email, '123');

        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#6: User login attempt with an incorrect email address and the correct password of another user', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user3@test.com', CREDENTIALS.user1.password);

        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#7: User login with an empty password field', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user1.email, '');

        await loginPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#8: User login with an empty email input field', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('', CREDENTIALS.user1.password);

        await loginPage.getRequiredEmailMessage();
        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#9: User login with empty email and password input fields', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('', '');

        await loginPage.getRequiredEmailMessage();
        await loginPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#10: User login with an invalid email format and a correct password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user1test.com', CREDENTIALS.user1.password);

        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL(URLS.login);
    });
});