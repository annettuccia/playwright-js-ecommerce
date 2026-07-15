import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { CREDENTIALS } from '../../config/credentials.js';
import { API } from '../../config/apiConstants.js';

test.describe('API Registration functionality', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API registration test\n');
    });

    test('API#5: Login with valid data', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.admin.email,
            password: CREDENTIALS.admin.password
        };

        const response = await apiClient.post(API.URLS.auth.login, loginData);

        expect(response.status()).toBe(API.STATUS.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('email', loginData.email);
    });

    test('API#6: Login without password entered', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.admin.email,
            password: ''
        };

        const response = await apiClient.post(API.URLS.auth.login, loginData);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.emptyPassword);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#7: Login without email entered', async ({ request }) => {
        const loginData = {
            email: '',
            password: CREDENTIALS.admin.password
        };

        const response = await apiClient.post(API.URLS.auth.login, loginData);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.emptyEmail);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#8: Login with non existing user credentials', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.fakeUser.email,
            password: CREDENTIALS.fakeUser.password
        };

        const response = await apiClient.post(API.URLS.auth.login, loginData);

        expect(response.status()).toBe(API.STATUS.unauthorized);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.invalidLogin);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.unauthorized);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.unauthorized);
    });
});