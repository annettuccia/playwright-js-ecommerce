import { test, expect } from '@playwright/test';
import { UserApi } from '../../services/UserApi.js';
import { API } from '../../config/apiConstants.js';
import {
    getApiUserDataUpdate, getApiUserDataUpdateInvalidPhone,
    getApiUserDataUpdatewithExistingEmail, getApiUserDataUpdatewithExistingUsername
} from '../../helpers/apiTestUserData.js';
import { assertSuccessResponse, assertErrorResponse, assertUserDataResponse } from '../../helpers/apiAssertions.js';

test.describe('User information updation through API', () => {
    let userApi;

    const USER_ID = {
        existing: 2,
        nonExisting: 2000
    };

    test.beforeEach(async ({ request }) => {
        userApi = new UserApi(request);
        console.log('\nStarting new information updation test\n');
    });

    test('API#9: Updating registered user data (all data is correct)', async ({ request }) => {
        const user = getApiUserDataUpdate();

        console.log(`User ${user.username} with email ${user.email} was updated`);
        const response = await userApi.updateUserData(USER_ID.existing, user);
        const responseBody = await assertSuccessResponse(response);
        console.log(`User with id ${USER_ID.existing} was updated with new information`);

        assertUserDataResponse(responseBody, user);
    });

    test('API#10: Updating data for a non-existent user', async ({ request }) => {
        const user = getApiUserDataUpdate();

        console.log(`User ${user.username} with email ${user.email} was updated`);
        const response = await userApi.updateUserData(USER_ID.nonExisting, user);
        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.userNotFound);

        console.log(`User with id ${USER_ID.nonExisting} was not updated`);
        console.log(`An ${API.MESSAGE.userNotFound} error occured`);
    });

    test('API#11: Updating registered user details to an invalid phone number', async ({ request }) => {
        const user = getApiUserDataUpdateInvalidPhone();

        console.log(`User ${user.username} with email ${user.email} was updated`);
        const response = await userApi.updateUserData(USER_ID.existing, user);
        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidPhoneNumber);

        console.log(`User with id ${USER_ID.existing} was not updated`);
        console.log(`An ${API.MESSAGE.invalidPhoneNumber} error occured`);
    });

    test('API#12: Updating registered user details to an email address that is already in use', async ({ request }) => {
        const user = getApiUserDataUpdatewithExistingEmail();

        console.log(`User ${user.username} with email ${user.email} was updated`);
        const response = await userApi.updateUserData(USER_ID.existing, user);
        await assertErrorResponse(response, API.STATUS.conflict, API.MESSAGE.emailExists);

        console.log(`User with id ${USER_ID.existing} was not updated`);
        console.log(`An ${API.MESSAGE.emailExists} error occured`);
    });

    test('API#13: Updating registered user details to a username that is already in use', async ({ request }) => {
        const user = getApiUserDataUpdatewithExistingUsername();

        console.log(`User ${user.username} with email ${user.email} was updated`);
        const response = await userApi.updateUserData(USER_ID.existing, user);
        await assertErrorResponse(response, API.STATUS.conflict, API.MESSAGE.usernameExists);

        console.log(`User with id ${USER_ID.existing} was not updated`);
        console.log(`An ${API.MESSAGE.emailExists} error occured`);
    })
});