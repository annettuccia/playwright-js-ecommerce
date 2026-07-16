import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import {
    getApiProductWithnegativePrice, getApiProductWithoutCategory, getApiProductWithoutDescription,
    getApiProductWithoutImage, getApiProductWithoutName, getApiValidProduct
} from '../../helpers/apiTestProductData';
import { db } from '../../config/dbCopy.js';
import {
    assertSuccessResponse, assertErrorResponse, assertProductDataResponse, assertProductListResponse
} from '../../helpers/apiAssertions.js';

test.describe('Product API tests', () => {
    let apiClient;

    const PRODUCT_ID = {
        existing: 4,
        nonExisting: 4000
    };

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new API create new product test\n');
    });

    test('API#14: Create a product (with all correct data) in the catalog', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`Product ${product.name} was added to the catalog`);

        assertProductDataResponse(responseBody, product);
    });

    test('API#15: Create a product with a negative price', async ({ request }) => {
        const product = getApiProductWithnegativePrice();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.negativePrice);
    });

    test('API#16: Create a product without a name', async ({ request }) => {
        const product = getApiProductWithoutName();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyProductname);
    });

    test('API#17: Create a product without description', async ({ request }) => {
        const product = getApiProductWithoutDescription();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyProductDescription);
    });

    test('API#18: Create a product without specifying its category', async ({ request }) => {
        const product = getApiProductWithoutCategory();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidProductCategory);
    });

    test('API#19: Create a product without specifying the image URL', async ({ request }) => {
        const product = getApiProductWithoutImage();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.post(API.URLS.product.base, product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidProductURL);
    });

    test('API#20: Get a list of all products in the catalog', async ({ request }) => {
        const response = await apiClient.get(API.URLS.product.base);

        const responseBody = await assertSuccessResponse(response);
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);

        assertProductListResponse(responseBody);
    });

    test('API#21: Get an existing product by ID', async ({ request }) => {
        console.log(`Product with id ${PRODUCT_ID.existing} exists`);

        const response = await apiClient.get(API.URLS.product.byId(PRODUCT_ID.existing));
        const responseBody = await assertSuccessResponse(response);

        assertProductDataResponse(responseBody, db[PRODUCT_ID.existing]);
    });

    test('API#22: Get a non-existent product by ID', async ({ request }) => {
        console.log(`Product with id ${PRODUCT_ID.existing} does not exist`);
        const response = await apiClient.get(API.URLS.product.byId(PRODUCT_ID.nonExisting));

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
    });

    test('API#23: Update data for an existing product (all data is correct)', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.patch(API.URLS.product.byId(PRODUCT_ID.existing), product);
        const responseBody = await assertSuccessResponse(response);

        assertProductDataResponse(responseBody, product);
    });

    test('API#24: Update data for a non-existent product', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Product ${product.name} was created`);
        const response = await apiClient.patch(API.URLS.product.byId(PRODUCT_ID.nonExisting), product);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
    });

    test('API#25: Remove an existing product from the catalog', async ({ request }) => {
        console.log(`Product with id ${PRODUCT_ID.existing} exists`);

        const response = await apiClient.delete(API.URLS.product.byId(PRODUCT_ID.existing));

        const responseBody = await assertSuccessResponse(response);

        assertProductDataResponse(responseBody, db[PRODUCT_ID.existing])
    });

    test('API#26: Remove a non-existent product from the catalog', async ({ request }) => {
        console.log(`Product with id ${PRODUCT_ID.nonEXisting} does not exist`);

        const response = await apiClient.delete(API.URLS.product.byId(PRODUCT_ID.nonExisting));

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
    });
});