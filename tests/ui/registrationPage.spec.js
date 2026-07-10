import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage.js';
import { URLS } from '../../config/urls.js';
import {
    getUiValidUser, getUiUserWithSpecialChars, getUiUserWithMinNameLength, getUiUserWithEmptyFirstName,
    getUiUserWithEmptyLastName, getUiUserWithNumbersInName, getUiUserWithEmptyEmail, getUiUserWithInvalidEmail,
    getUiUserWithExistingEmail, getUiUserWithEmptyUsername, getUiUserWithExistingUsername, getUiUserWithEmptyPhone,
    getUiUserWithInvalidPhoneNoPlus48, getUiUserWithInvalidPhoneTooLong, getUiUserWithExistingPhone, getUiUserWithEmptyPassword,
    getUiUserWithShortPassword, getUiUserWithWeakPassword
} from '../../helpers/uiTestData.js';

test.describe('Registration functionality', () => {
    let registrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        console.log('\nStarting new registration test with a new registration page\n');
    });

    test('TC#11: Registration with valid data', async ({ page }) => {
        const user = getUiValidUser();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#12: Registration with special characters in name', async ({ page }) => {
        const user = getUiUserWithSpecialChars();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#13: Registration with minimum name length (1 char)', async ({ page }) => {
        const user = getUiUserWithMinNameLength();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#14: Go to the login page', async ({ page }) => {
        await registrationPage.gotoRegistrationPage();
        await registrationPage.gotoLoginPage();

        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#15: Registration with Enter key', async ({ page }) => {
        const user = getUiValidUser();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.registerWithEnterKey(user);
    });

    test('TC#16: Submit empty registration form', async ({ page }) => {
        await registrationPage.gotoRegistrationPage();
        await registrationPage.register({});

        await registrationPage.getRequiredFirstNameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#17: Registration with empty first name', async ({ page }) => {
        const user = getUiUserWithEmptyFirstName();
        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredFirstNameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#18: Registration with empty last name', async ({ page }) => {
        const user = getUiUserWithEmptyLastName();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredLastNameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#19: Registration with numbers in name fields', async ({ page }) => {
        const user = getUiUserWithNumbersInName();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#20: Registration with empty email', async ({ page }) => {
        const user = getUiUserWithEmptyEmail();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredEmailMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#21: Registration with invalid email format', async ({ page }) => {
        const user = getUiUserWithInvalidEmail();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#22: Registration with existing email', async ({ page }) => {
        const user = getUiUserWithExistingEmail();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#23: Registration with empty username', async ({ page }) => {
        const user = getUiUserWithEmptyUsername();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredUsernameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#24: Registration with existing username', async ({ page }) => {
        const user = getUiUserWithExistingUsername();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#25: Registration with empty phone', async ({ page }) => {
        const user = getUiUserWithEmptyPhone();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredPhoneMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#26: Registration with invalid phone format (no +48)', async ({ page }) => {
        const user = getUiUserWithInvalidPhoneNoPlus48();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#27: Registration with invalid phone format (too long)', async ({ page }) => {
        const user = getUiUserWithInvalidPhoneTooLong();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#28: Registration with existing phone', async ({ page }) => {
        const user = getUiUserWithExistingPhone();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#29: Registration with empty password', async ({ page }) => {
        const user = getUiUserWithEmptyPassword();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#30: Registration with short password', async ({ page }) => {
        const user = getUiUserWithShortPassword();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#31: Registration with weak password', async ({ page }) => {
        const user = getUiUserWithWeakPassword();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });
});