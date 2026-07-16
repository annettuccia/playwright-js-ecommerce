import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import { productToBucketById } from '../../helpers/apiTestProductData.js'
import {
    assertSuccessResponse, assertErrorResponse, assertBucketResponse, assertBucketItemResponse
} from '../../helpers/apiAssertions.js';

test.describe('Bucket API tests', () => {
    let apiClient;

    const USER_ID = {
        existing: 3,
        nonExisting: 3000
    };

    const PRODUCT_ID = {
        existing: 7,
        nonExisting: 7000
    };

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API bucket test\n');
    });

    test('API#27: Retrieve an existing user cart', async ({ request }) => {
        const response = await apiClient.get(API.URLS.bucket.base(USER_ID.existing));

        const responseBody = await assertSuccessResponse(response);

        assertBucketResponse(responseBody);
    });

    test('API#28: Retrieve a non-existent user cart', async ({ request }) => {
        const response = await apiClient.get(API.URLS.bucket.base(USER_ID.nonExisting));

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
    });

    test('API#29: Add an item to an existing user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);

        assertBucketItemResponse(responseBody, PRODUCT_ID.existing, USER_ID.existing);
    });

    test('API#30: Add an item to an non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.nonExisting), bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
    });

    test('API#31: Add a non-existent item to the cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.nonExisting);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
    });

    test('API#32: Remove an item from the cart (item is in an existing user cart)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const responseCreate = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);
        expect(responseCreate.status()).toBe(API.STATUS.created);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.existing), bucketData);
        const responseBody = await assertSuccessResponse(response);

        assertBucketItemResponse(responseBody, PRODUCT_ID.existing, USER_ID.existing);
    });

    test('API#33: Remove an item from the cart (item is not in the cart; user exists)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.existing), bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
    });

    test('API#34: Remove a non-existent item from a non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.nonExisting), bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
    });
});