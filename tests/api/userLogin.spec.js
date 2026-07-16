import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/apiClient.js';
import { CREDENTIALS } from '../../config/credentials.js';
import { API } from '../../config/apiConstants.js';
import { assertSuccessResponse, assertErrorResponse, assertUserDataResponse } from '../../helpers/apiAssertions.js';

test.describe('API Login functionality', () => {
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

        console.log(`Starting login test with email: ${loginData.email}`);
        const response = await apiClient.post(API.URLS.auth.login, loginData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`User with email ${loginData.email} is logged in`);

        assertUserDataResponse(responseBody, {
            email: loginData.email,
            username: responseBody.username,
            role: responseBody.role,
            firstname: responseBody.firstname,
            lastname: responseBody.lastname,
            phoneNumber: responseBody.phoneNumber
        });
    });

    test('API#6: Login without password entered', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.admin.email,
            password: ''
        };
        console.log(`Starting login test without password`);
        const response = await apiClient.post(API.URLS.auth.login, loginData);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyPassword);
        console.log(`User is not logged in; an '${API.MESSAGE.emptyPassword}' error message occured`);
    });

    test('API#7: Login without email entered', async ({ request }) => {
        const loginData = {
            email: '',
            password: CREDENTIALS.admin.password
        };
        console.log(`Starting login test without email`);
        const response = await apiClient.post(API.URLS.auth.login, loginData);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyEmail);
        console.log(`User is not logged in; an '${API.MESSAGE.emptyEmail}' error message occured`);
    });

    test('API#8: Login with non existing user credentials', async ({ request }) => {
        const loginData = {
            email: CREDENTIALS.fakeUser.email,
            password: CREDENTIALS.fakeUser.password
        };
        console.log(`Starting login test with fake user credentials email: ${loginData.email}, password: ${loginData.password}`);
        const response = await apiClient.post(API.URLS.auth.login, loginData);

        await assertErrorResponse(response, API.STATUS.unauthorized, API.MESSAGE.invalidLogin);
        console.log(`User is not logged in; an '${API.MESSAGE.invalidLogin}' error message occured`);
    });
});