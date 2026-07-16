import { test, expect } from '@playwright/test';
import { ProductApi } from '../../services/ProductApi.js';
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
    let productApi;

    const PRODUCT_ID = {
        existing: 4,
        nonExisting: 4000
    };

    test.beforeEach(async ({ request }) => {
        productApi = new ProductApi(request);
        console.log('\nStarting new API create new product test\n');
    });

    test('API#14: Create a product (with all correct data) in the catalog', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Product ${product.name} was created`);
        const response = await productApi.createProduct(product);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`Product ${product.name} was added to the catalog`);

        assertProductDataResponse(responseBody, product);
    });

    test('API#15: Create a product with a negative price', async ({ request }) => {
        const product = getApiProductWithnegativePrice();

        console.log(`Product ${product.name} was created`);
        const response = await productApi.createProduct(product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.negativePrice);
        console.log(`Product ${product.name} was not created; an '${API.MESSAGE.negativePrice}' error message occured`);
    });

    test('API#16: Create a product without a name', async ({ request }) => {
        const product = getApiProductWithoutName();

        console.log(`Product with empty name was created`);
        const response = await productApi.createProduct(product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyProductname);
        console.log(`Product was not created; an '${API.MESSAGE.emptyProductname}' error message occured`);
    });

    test('API#17: Create a product without description', async ({ request }) => {
        const product = getApiProductWithoutDescription();

        console.log(`Product ${product.name} was created`);
        const response = await productApi.createProduct(product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.emptyProductDescription);
        console.log(`Product ${product.name} was not created; an '${API.MESSAGE.emptyProductDescription}' error message occured`);
    });

    test('API#18: Create a product without specifying its category', async ({ request }) => {
        const product = getApiProductWithoutCategory();

        console.log(`Product ${product.name} was created`);
        const response = await productApi.createProduct(product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidProductCategory);
        console.log(`Product ${product.name} was not created; an '${API.MESSAGE.invalidProductCategory}' error message occured`);
    });

    test('API#19: Create a product without specifying the image URL', async ({ request }) => {
        const product = getApiProductWithoutImage();

        console.log(`Product ${product.name} was created`);
        const response = await productApi.createProduct(product);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidProductURL);
        console.log(`Product ${product.name} was not created; an '${API.MESSAGE.invalidProductURL}' error message occured`);
    });

    test('API#20: Get a list of all products in the catalog', async ({ request }) => {
        console.log(`Getting list of all products`);
        const response = await productApi.getAllProducts();

        const responseBody = await assertSuccessResponse(response);
        console.log(`Received a list of ${responseBody.length} products`);

        assertProductListResponse(responseBody);
    });

    test('API#21: Get an existing product by ID', async ({ request }) => {
        console.log(`Getting product with id ${PRODUCT_ID.existing}`);

        const response = await productApi.getProductById(PRODUCT_ID.existing);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Product with id ${PRODUCT_ID.existing} was found`);

        assertProductDataResponse(responseBody, db[PRODUCT_ID.existing]);
    });

    test('API#22: Get a non-existent product by ID', async ({ request }) => {
        console.log(`Getting product with id ${PRODUCT_ID.nonExisting}`);
        const response = await productApi.getProductById(PRODUCT_ID.nonExisting);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
        console.log(`Product with id ${PRODUCT_ID.nonExisting} was not found; an '${API.MESSAGE.productNotFound}' error message occured`);
    });

    test('API#23: Update data for an existing product (all data is correct)', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Updating product with id ${PRODUCT_ID.existing}`);
        const response = await productApi.updateProductData(PRODUCT_ID.existing, product);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Product with id ${PRODUCT_ID.existing} was updated with new information`);

        assertProductDataResponse(responseBody, product);
    });

    test('API#24: Update data for a non-existent product', async ({ request }) => {
        const product = getApiValidProduct();

        console.log(`Updating product with id ${PRODUCT_ID.nonExisting}`);
        const response = await productApi.updateProductData(PRODUCT_ID.nonExisting, product);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
        console.log(`Product with id ${PRODUCT_ID.nonExisting} was not updated; an '${API.MESSAGE.productNotFound}' error message occured`);
    });

    test('API#25: Remove an existing product from the catalog', async ({ request }) => {
        console.log(`Removing product with id ${PRODUCT_ID.existing}`);

        const response = await productApi.deleteProduct(PRODUCT_ID.existing);

        const responseBody = await assertSuccessResponse(response);
        console.log(`Product with id ${PRODUCT_ID.existing} was removed from catalog`);

        assertProductDataResponse(responseBody, db[PRODUCT_ID.existing])
    });

    test('API#26: Remove a non-existent product from the catalog', async ({ request }) => {
        console.log(`Removing product with id ${PRODUCT_ID.nonExisting}`);

        const response = await productApi.deleteProduct(PRODUCT_ID.nonExisting);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
        console.log(`Product with id ${PRODUCT_ID.nonExisting} was not removedan '${API.MESSAGE.productNotFound}' error message occured`);
    });
});