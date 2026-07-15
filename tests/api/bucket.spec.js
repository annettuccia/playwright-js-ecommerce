import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import { productToBucketById } from '../../helpers/apiTestProductData.js'

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

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBe(true);
    });

    test('API#28: Retrieve a non-existent user cart', async ({ request }) => {
        const response = await apiClient.get(API.URLS.bucket.base(USER_ID.nonExisting));

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#29: Add an item to an existing user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);

        expect(response.status()).toBe(API.STATUS.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('product_id', PRODUCT_ID.existing);
        expect(responseBody).toHaveProperty('bucket_id', USER_ID.existing);
    });

    test('API#30: Add an item to an non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.nonExisting), bucketData);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#31: Add a non-existent item to the cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.nonExisting);

        const response = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.productNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#32: Remove an item from the cart (item is in an existing user cart)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const responseCreate = await apiClient.post(API.URLS.bucket.addProduct(USER_ID.existing), bucketData);
        expect(responseCreate.status()).toBe(API.STATUS.created);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.existing), bucketData);
        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('product_id', 7);
        expect(responseBody).toHaveProperty('bucket_id', 3);
    });

    test('API#33: Remove an item from the cart (item is not in the cart; user exists)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.existing), bucketData);
        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.productNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#34: Remove a non-existent item from a non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        const response = await apiClient.delete(API.URLS.bucket.removeProduct(USER_ID.nonExisting), bucketData);
        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });
});