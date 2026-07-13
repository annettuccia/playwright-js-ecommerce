import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API_URLS } from '../../config/apiEndpoints.js';
import { API_Messages } from '../../config/apiMessages.js';
import {
    getApiUserDataUpdate, getApiUserDataUpdateInvalidPhone,
    getApiUserDataUpdatewithExistingEmail, getApiUserDataUpdatewithExistingUsername
} from '../../helpers/apiTestUserData.js';

test.describe('User information updation through API', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new information updation test\n');
    });

    test('API#9: Updating registered user data (all data is correct)', async ({ request }) => {
        const user = getApiUserDataUpdate();

        const response = await apiClient.patch(API_URLS.AUTH.refresh(2), user);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('email', user.email);
        expect(responseBody).toHaveProperty('username', user.username);;
        expect(responseBody).toHaveProperty('firstname', user.firstname);
        expect(responseBody).toHaveProperty('lastname', user.lastname);
        expect(responseBody).toHaveProperty('phoneNumber', user.phoneNumber);
        expect(responseBody).toHaveProperty('bucket_id');
    });

    test('API#10: Updating data for a non-existent user', async ({ request }) => {
        const user = getApiUserDataUpdate();

        const response = await apiClient.patch(API_URLS.AUTH.refresh(2000), user);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.userNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#11: Updating registered user details to an invalid phone number', async ({ request }) => {
        const user = getApiUserDataUpdateInvalidPhone();

        const response = await apiClient.patch(API_URLS.AUTH.refresh(2), user);

        expect(response.status()).toBe(API_Messages.statusCode.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.invalidPhoneNumber);
        expect(responseBody).toHaveProperty('error', API_Messages.status.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.badRequest);
    });

    test('API#12: Updating registered user details to an email address that is already in use', async ({ request }) => {
        const user = getApiUserDataUpdatewithExistingEmail();

        const response = await apiClient.patch(API_URLS.AUTH.refresh(2), user);

        expect(response.status()).toBe(API_Messages.statusCode.conflict);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.emailExists);
        expect(responseBody).toHaveProperty('error', API_Messages.status.conflict);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.conflict);
    });

    test('API#13: Updating registered user details to a username that is already in use', async ({ request }) => {
        const user = getApiUserDataUpdatewithExistingUsername();

        const response = await apiClient.patch(API_URLS.AUTH.refresh(2), user);

        expect(response.status()).toBe(API_Messages.statusCode.conflict);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.usernameExists);
        expect(responseBody).toHaveProperty('error', API_Messages.status.conflict);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.conflict);
    })
});