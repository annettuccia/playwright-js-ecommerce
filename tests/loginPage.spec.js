import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';

test.describe('Login functionality', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        console.log('Starting new login test with a new login page');
    })

    test('TC#1: Administrator login with the correct email and password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('admin@test.com', 'admin123');
    });

    test('TC#2: User login with a valid email and correct password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user1@test.com', 'user123');
    });

    test('TC#3: Submit login form on Enter key press', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.loginWithEnterKey('user1@test.com', 'user123');
    });

    test('TC#4: Go to the registration page', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.gotoRegisterPage();
    });
    test('TC#5: User login with a valid email and an incorrect password', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user1@test.com', '123');
        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL('/login');
    });
    test('TC#6: User login attempt with an incorrect email address and the correct password of another user (the user is not registered in the online store)', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user3@test.com', 'user123');
        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL('/login');
    });
    test('TC#7: User login with an empty password field', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user1@test.com', '');
        await loginPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL('/login');
    });
    test('TC#8: User login with an empty email input field', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('', 'user123');
        await loginPage.getRequiredEmailMessage();
        await expect(page).toHaveURL('/login');
    });
    test('TC#9: User login with empty email and password input fields.', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('', '');
        await loginPage.getRequiredEmailMessage();
        await loginPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL('/login');
    });
    test('TC#10: User login with an invalid email format and a correct password.', async ({ page }) => {
        await loginPage.gotoLoginPage();
        await loginPage.login('user1test.com', 'user123');
        await loginPage.getErrorLoginMessage();
        await expect(page).toHaveURL('/login');
    });
});
