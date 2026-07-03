import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage.js';
import { URLS } from '../config/url.js';

test.describe('Registration functionality', () => {
    let registrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        console.log('Starting new registration test with a new registration page');
    });

    const getValidUser = () => ({
        firstName: 'Иван',
        lastName: 'Иванов',
        email: `ivanov${Date.now()}@test.com`,
        username: `ivanov_i_${Date.now()}`,
        phone: '+48123456789',
        password: 'HO$0RxAW'
    });

    test('TC#11: Registration with valid data', async ({ page }) => {
        const user = getValidUser();

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#12: Registration with special characters in name', async ({ page }) => {
        const user = {
            ...getValidUser(),
            firstName: 'Иван-Михаил',
            lastName: "о'Брайн",
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_m_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#13: Registration with minimum name length (1 char)', async ({ page }) => {
        const user = {
            ...getValidUser(),
            firstName: 'И',
            lastName: 'И',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_m_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);
    });

    test('TC#14: Go to the login page', async ({ page }) => {
        await registrationPage.gotoRegistrationPage();
        await registrationPage.gotoLoginPage();

        await expect(page).toHaveURL(URLS.login);
    });

    test('TC#15: Registration with Enter key', async ({ page }) => {
        const user = {
            ...getValidUser(),
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

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
        const user = {
            ...getValidUser(),
            firstName: '',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredFirstNameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#18: Registration with empty last name', async ({ page }) => {
        const user = {
            ...getValidUser(),
            lastName: '',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredLastNameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#19: Registration with numbers in name fields', async ({ page }) => {
        const user = {
            ...getValidUser(),
            firstName: 'Иван123',
            lastName: 'Иванов123',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#20: Registration with empty email', async ({ page }) => {
        const user = {
            ...getValidUser(),
            email: '',
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredEmailMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#21: Registration with invalid email format', async ({ page }) => {
        const user = {
            ...getValidUser(),
            email: 'ivvanov1test.com',
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#22: Registration with existing email', async ({ page }) => {
        const user = {
            ...getValidUser(),
            email: 'ivanov1@test.com',
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#23: Registration with empty username', async ({ page }) => {
        const user = {
            ...getValidUser(),
            username: '',
            email: `ivan${Date.now()}@test.com`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredUsernameMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#24: Registration with existing username', async ({ page }) => {
        const user = {
            ...getValidUser(),
            username: 'ivanov_i',
            email: `ivan${Date.now()}@test.com`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#25: Registration with empty phone', async ({ page }) => {
        const user = {
            ...getValidUser(),
            phone: '',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredPhoneMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#26: Registration with invalid phone format (no +48)', async ({ page }) => {
        const user = {
            ...getValidUser(),
            phone: '123456789',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#27: Registration with invalid phone format (too long)', async ({ page }) => {
        const user = {
            ...getValidUser(),
            phone: '123456789012345678901234567890',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#28: Registration with existing phone', async ({ page }) => {
        const user = {
            ...getValidUser(),
            phone: '+48123456789',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#29: Registration with empty password', async ({ page }) => {
        const user = {
            ...getValidUser(),
            password: '',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getRequiredPasswordMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#30: Registration with short password', async ({ page }) => {
        const user = {
            ...getValidUser(),
            password: '1',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });

    test('TC#31: Registration with weak password', async ({ page }) => {
        const user = {
            ...getValidUser(),
            password: 'Password123',
            email: `ivan${Date.now()}@test.com`,
            username: `ivan_i_${Date.now()}`
        };

        await registrationPage.gotoRegistrationPage();
        await registrationPage.register(user);

        await registrationPage.getErrorRegistrationMessage();
        await expect(page).toHaveURL(URLS.register);
    });
});