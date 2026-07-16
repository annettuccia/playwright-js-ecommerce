import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { API } from '../../config/apiConstants.js';
import {
    getApiValidUser, getApiUserWithExistingEmail, getApiUserWithExistingUsername, getApiUserWithoutPassword
} from '../../helpers/apiTestUserData.js';
import { assertSuccessResponse, assertErrorResponse, assertUserDataResponse } from '../../helpers/apiAssertions.js';

test.describe('API Registration functionality', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API registration test\n');
    });

    test('API#1: Register new user with valid data', async () => {
        const user = getApiValidUser();

        console.log(`User ${user.username} with email ${user.email} was created`);
        const response = await apiClient.post(API.URLS.auth.register, user);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`User ${user.username} with email ${user.email} is registered as ${user.role}`);

        assertUserDataResponse(responseBody, user);
    });

    test('API#2: Register user with existing email', async () => {
        const user = getApiUserWithExistingEmail();
        console.log(`User ${user.username} with email ${user.email} was created`);

        const response = await apiClient.post(API.URLS.auth.register, user);
        await assertErrorResponse(response, API.STATUS.conflict, API.MESSAGE.emailExists);

        console.log(`User ${user.username} with email ${user.email} was not registered`);
        console.log(`An ${API.MESSAGE.emailExists} error occured`);
    });

    test('API#3: Register user with existing username', async () => {
        const user = getApiUserWithExistingUsername();
        console.log(`User ${user.username} with email ${user.email} was created`);

        const response = await apiClient.post(API.URLS.auth.register, user);
        await assertErrorResponse(response, API.STATUS.ISE, API.STATUS_TEXT.ISE);

        console.log(`User ${user.username} with email ${user.email} was not registered`);
    });

    test('API#4: Register user without password', async () => {
        const user = getApiUserWithoutPassword();
        console.log(`User ${user.username} with email ${user.email} was created`);

        const response = await apiClient.post(API.URLS.auth.register, user);
        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.shortPassword);

        console.log(`User ${user.username} with email ${user.email} was not registered`);

    });
});