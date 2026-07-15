import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import {
    getApiProductWithnegativePrice, getApiProductWithoutCategory, getApiProductWithoutDescription,
    getApiProductWithoutImage, getApiProductWithoutName, getApiValidProduct
} from '../../helpers/apiTestProductData';
import { db } from '../../config/dbCopy.js'

test.describe('Product API tests', () => {
    let apiClient;

    const PRODUCT_ID = {
        existing: 4,
        nonEXisting: 4000
    };

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API create new product test\n');
    });

    test('API#14: Create a product (with all correct data) in the catalog', async ({ request }) => {
        const product = getApiValidProduct();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('name', product.name);
        expect(responseBody).toHaveProperty('description', product.description);
        expect(responseBody).toHaveProperty('category', product.category);
        expect(responseBody).toHaveProperty('urlImage', product.urlImage);

        expect(responseBody).toHaveProperty('price');
        const expectedPrice = parseFloat(product.price);
        const actualPrice = parseFloat(responseBody.price);
        expect(actualPrice).toBeCloseTo(expectedPrice, 2);
    });

    test('API#15: Create a product with a negative price', async ({ request }) => {
        const product = getApiProductWithnegativePrice();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.negativePrice);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#16: Create a product without a name', async ({ request }) => {
        const product = getApiProductWithoutName();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.emptyProductname);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#17: Create a product without description', async ({ request }) => {
        const product = getApiProductWithoutDescription();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.emptyProductDescription);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#18: Create a product without specifying its category', async ({ request }) => {
        const product = getApiProductWithoutCategory();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.invalidProductCategory);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#19: Create a product without specifying the image URL', async ({ request }) => {
        const product = getApiProductWithoutImage();

        const response = await apiClient.post(API.URLS.product.base, product);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.invalidProductURL);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#20: Get a list of all products in the catalog', async ({ request }) => {
        const response = await apiClient.get(API.URLS.product.base);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);

        responseBody.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(typeof item.id).toBe('number');
            expect(item).toHaveProperty('name');
            expect(item.name).not.toBe('');
            expect(item).toHaveProperty('description');
            expect(item.description).not.toBe('');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('category');
            expect(item.category).not.toBe('');
            expect(item).toHaveProperty('urlImage');
            expect(item.urlImage).not.toBe('');
        });
    });

    test('API#21: Get an existing product by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.product.byId(PRODUCT_ID.existing));

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id', db[PRODUCT_ID.existing].id);
        expect(responseBody).toHaveProperty('name', db[PRODUCT_ID.existing].name);
        expect(responseBody).toHaveProperty('description', db[PRODUCT_ID.existing].description);
        expect(responseBody).toHaveProperty('category', db[PRODUCT_ID.existing].category);
        expect(responseBody).toHaveProperty('urlImage', db[PRODUCT_ID.existing].urlImage);
    });

    test('API#22: Get a non-existent product by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.product.byId(PRODUCT_ID.nonEXisting));

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.productNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#23: Update data for an existing product (all data is correct)', async ({ request }) => {
        const product = getApiValidProduct();

        const response = await apiClient.patch(API.URLS.product.byId(PRODUCT_ID.existing), product);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('name', product.name);
        expect(responseBody).toHaveProperty('description', product.description);
        expect(responseBody).toHaveProperty('category', product.category);
        expect(responseBody).toHaveProperty('urlImage', product.urlImage);

        expect(responseBody).toHaveProperty('price');
        const expectedPrice = parseFloat(product.price);
        const actualPrice = parseFloat(responseBody.price);
        expect(actualPrice).toBeCloseTo(expectedPrice, 2);
    });

    test('API#24: Update data for a non-existent product', async ({ request }) => {
        const product = getApiValidProduct();

        const response = await apiClient.patch(API.URLS.product.byId(PRODUCT_ID.nonEXisting), product);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.productNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#25: Remove an existing product from the catalog', async ({ request }) => {
        const response = await apiClient.delete(API.URLS.product.byId(PRODUCT_ID.existing));

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id', db[PRODUCT_ID.existing].id);
        expect(responseBody).toHaveProperty('name', db[PRODUCT_ID.existing].name);
        expect(responseBody).toHaveProperty('description', db[PRODUCT_ID.existing].description);
        expect(responseBody).toHaveProperty('category', db[PRODUCT_ID.existing].category);
        expect(responseBody).toHaveProperty('urlImage', db[PRODUCT_ID.existing].urlImage);
    });

    test('API#26: Remove a non-existent product from the catalog', async ({ request }) => {
        const response = await apiClient.delete(API.URLS.product.byId(PRODUCT_ID.nonEXisting));

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.productNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });
});