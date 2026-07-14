import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API_URLS } from '../../config/apiEndpoints.js';
import { API_Messages } from '../../config/apiMessages.js';
import { productToBucketById } from '../../helpers/apiTestProductData.js'

test.describe('Bucket API tests', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API bucket test\n');
    });

    test('API#27: Retrieve an existing user cart', async ({ request }) => {
        const response = await apiClient.get(API_URLS.BUCKET.base(2));

        expect(response.status()).toBe(API_Messages.statusCode.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBe(true);
    });

    test('API#28: Retrieve a non-existent user cart', async ({ request }) => {
        const response = await apiClient.get(API_URLS.BUCKET.base(2000));

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#29: Add an item to an existing user cart', async ({ request }) => {
        const bucketData = productToBucketById(7);

        const response = await apiClient.post(API_URLS.BUCKET.add_product(3), bucketData);

        expect(response.status()).toBe(API_Messages.statusCode.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('product_id', 7);
        expect(responseBody).toHaveProperty('bucket_id', 3);
    });

    test('API#30: Add an item to an non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(7);

        const response = await apiClient.post(API_URLS.BUCKET.add_product(3000), bucketData);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#31: Add a non-existent item to the cart', async ({ request }) => {
        const bucketData = productToBucketById(10000);

        const response = await apiClient.post(API_URLS.BUCKET.add_product(3), bucketData);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.productNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#32: Remove an item from the cart (item is in an existing user cart)', async ({ request }) => {
        const bucketData = productToBucketById(7);

        const responseCreate = await apiClient.post(API_URLS.BUCKET.add_product(3), bucketData);
        expect(responseCreate.status()).toBe(API_Messages.statusCode.created);

        const response = await apiClient.delete(API_URLS.BUCKET.remove_product(3), bucketData);
        expect(response.status()).toBe(API_Messages.statusCode.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('product_id', 7);
        expect(responseBody).toHaveProperty('bucket_id', 3);
    });

    test('API#33: Remove an item from the cart (item is not in the cart; user exists)', async ({ request }) => {
        const bucketData = productToBucketById(7);

        const response = await apiClient.delete(API_URLS.BUCKET.remove_product(3), bucketData);
        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.productNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#34: Remove a non-existent item from a non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(7);

        const response = await apiClient.delete(API_URLS.BUCKET.remove_product(3000), bucketData);
        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.bucketNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
     });
});