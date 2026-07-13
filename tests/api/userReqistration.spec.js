import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { API_URLS } from '../../config/apiEndpoints.js';
import { API_Messages } from '../../config/apiMessages.js';
import {
    getApiValidUser, getApiUserWithExistingEmail, getApiUserWithExistingUsername, getApiUserWithoutPassword
} from '../../helpers/apiTestUserData.js';

test.describe('API Registration functionality', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API registration test\n');
    });

    test('API#1: Register new user with valid data', async () => {
        const user = getApiValidUser();

        const response = await apiClient.post(API_URLS.AUTH.register, user);

        expect(response.status()).toBe(API_Messages.statusCode.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('email', user.email);
        expect(responseBody).toHaveProperty('username', user.username);
        expect(responseBody).toHaveProperty('role', user.role);
        expect(responseBody).toHaveProperty('firstname', user.firstname);
        expect(responseBody).toHaveProperty('lastname', user.lastname);
        expect(responseBody).toHaveProperty('phoneNumber', user.phoneNumber);
        expect(responseBody).toHaveProperty('bucket_id');
    });

    test('API#2: Register user with existing email', async () => {
        const user = getApiUserWithExistingEmail();

        const response = await apiClient.post(API_URLS.AUTH.register, user);

        expect(response.status()).toBe(API_Messages.statusCode.conflict);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.emailExists);
        expect(responseBody).toHaveProperty('error', API_Messages.status.conflict);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.conflict);
    });

    test('API#3: Register user with existing username', async () => {
        const user = getApiUserWithExistingUsername();

        const response = await apiClient.post(API_URLS.AUTH.register, user);

        expect(response.status()).toBe(API_Messages.statusCode.ISE);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.ISE);
        expect(responseBody).toHaveProperty('message', API_Messages.status.ISE);
    });

    test('API#4: Register user without password', async () => {
        const user = getApiUserWithoutPassword();

        const response = await apiClient.post(API_URLS.AUTH.register, user);

        expect(response.status()).toBe(API_Messages.statusCode.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.shortPassword);
        expect(responseBody).toHaveProperty('error', API_Messages.status.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.badRequest);
    });
});