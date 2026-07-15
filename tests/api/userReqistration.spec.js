import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { API } from '../../config/apiConstants.js';
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

        const response = await apiClient.post(API.URLS.auth.register, user);

        expect(response.status()).toBe(API.STATUS.created);

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

        const response = await apiClient.post(API.URLS.auth.register, user);

        expect(response.status()).toBe(API.STATUS.conflict);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.emailExists);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.conflict);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.conflict);
    });

    test('API#3: Register user with existing username', async () => {
        const user = getApiUserWithExistingUsername();

        const response = await apiClient.post(API.URLS.auth.register, user);

        expect(response.status()).toBe(API.STATUS.ISE);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('statusCode', API.STATUS.ISE);
        expect(responseBody).toHaveProperty('message', API.STATUS_TEXT.ISE);
    });

    test('API#4: Register user without password', async () => {
        const user = getApiUserWithoutPassword();

        const response = await apiClient.post(API.URLS.auth.register, user);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.shortPassword);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });
});