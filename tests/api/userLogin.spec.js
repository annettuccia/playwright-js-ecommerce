import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { CREDENTIALS } from '../../config/credentials.js';
import { API_URLS } from '../../config/apiEndpoints.js';
import { API_Messages } from '../../config/apiMessages.js';

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

        const response = await apiClient.post(API_URLS.AUTH.login, loginData);

        expect(response.status()).toBe(API_Messages.statusCode.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('email', loginData.email);
    });

    test('API#6: Login without password entered', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.admin.email,
            password: ''
        };

        const response = await apiClient.post(API_URLS.AUTH.login, loginData);

        expect(response.status()).toBe(API_Messages.statusCode.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.emptyPassword);
        expect(responseBody).toHaveProperty('error', API_Messages.status.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.badRequest);
    });

    test('API#7: Login without email entered', async ({ request }) => {
        const loginData = {
            email: '',
            password: CREDENTIALS.admin.password
        };

        const response = await apiClient.post(API_URLS.AUTH.login, loginData);

        expect(response.status()).toBe(API_Messages.statusCode.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.emptyEmail);
        expect(responseBody).toHaveProperty('error', API_Messages.status.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.badRequest);
    });

    test('API#8: Login with non existing user credentials', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.fakeUser.email,
            password: CREDENTIALS.fakeUser.password
        };

        const response = await apiClient.post(API_URLS.AUTH.login, loginData);

        expect(response.status()).toBe(API_Messages.statusCode.unauthorized);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.invalidLogin);
        expect(responseBody).toHaveProperty('error', API_Messages.status.unauthorized);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.unauthorized);
    });
});