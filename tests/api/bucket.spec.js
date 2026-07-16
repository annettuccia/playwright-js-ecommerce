import { test, expect } from '@playwright/test';
import { BucketApi } from '../../services/BucketApi.js';
import { API } from '../../config/apiConstants.js';
import { productToBucketById } from '../../helpers/apiTestProductData.js'
import {
    assertSuccessResponse, assertErrorResponse, assertBucketResponse, assertBucketItemResponse
} from '../../helpers/apiAssertions.js';

test.describe('Bucket API tests', () => {
    let bucketApi;

    const USER_ID = {
        existing: 3,
        nonExisting: 3000
    };

    const PRODUCT_ID = {
        existing: 7,
        nonExisting: 7000
    };

    test.beforeEach(async ({ request }) => {
        bucketApi = new BucketApi(request);
        console.log('\nStarting new API bucket test\n');
    });

    test('API#27: Get an existing cart by user id', async ({ request }) => {
        console.log(`Getting cart for user ${USER_ID.existing}`);
        const response = await bucketApi.getBucketByUserId(USER_ID.existing);

        const responseBody = await assertSuccessResponse(response);
        console.log(`Cart for user ${USER_ID.existing} was found`);

        assertBucketResponse(responseBody);
    });

    test('API#28: Get a non-existent user cart (by id)', async ({ request }) => {
        console.log(`Getting cart for non-existent user ${USER_ID.nonExisting}`);
        const response = await bucketApi.getBucketByUserId(USER_ID.nonExisting);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
        console.log(`Cart for user ${USER_ID.nonExisting} was not found; an '${API.MESSAGE.bucketNotFound}' error message occured`);
    });

    test('API#29: Add an item to an existing user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        console.log(`Adding product ${PRODUCT_ID.existing} to cart for user ${USER_ID.existing}`);
        const response = await bucketApi.addProductToBucket(USER_ID.existing, bucketData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`Product ${PRODUCT_ID.existing} was added to cart for user ${USER_ID.existing}`);

        assertBucketItemResponse(responseBody, PRODUCT_ID.existing, USER_ID.existing);
    });

    test('API#30: Add an item to an non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        console.log(`Adding product ${PRODUCT_ID.existing} to cart for non-existent user ${USER_ID.nonExisting}`);
        const response = await bucketApi.addProductToBucket(USER_ID.nonExisting, bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
        console.log(`Product was not added to cart; an '${API.MESSAGE.bucketNotFound}' error message occured`);
    });

    test('API#31: Add a non-existent item to the cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.nonExisting);

        console.log(`Adding non-existent product ${PRODUCT_ID.nonExisting} to cart for user ${USER_ID.existing}`);
        const response = await bucketApi.addProductToBucket(USER_ID.existing, bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
        console.log(`Product was not added to cart; an '${API.MESSAGE.productNotFound}' error message occured`);
    });

    test('API#32: Remove an item from the cart (item is in an existing user cart)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        console.log(`Adding product ${PRODUCT_ID.existing} to cart for user ${USER_ID.existing}`);
        const addResponse = await bucketApi.addProductToBucket(USER_ID.existing, bucketData);
        await assertSuccessResponse(addResponse, API.STATUS.created);

        console.log(`Removing product ${PRODUCT_ID.existing} from cart for user ${USER_ID.existing}`);
        const removeResponse = await bucketApi.removeProductFromBucket(USER_ID.existing, bucketData);
        const removeResponseBody = await assertSuccessResponse(removeResponse);
        console.log(`Product ${PRODUCT_ID.existing} was removed from cart for user ${USER_ID.existing}`);

        assertBucketItemResponse(removeResponseBody, PRODUCT_ID.existing, USER_ID.existing);
    });

    test('API#33: Remove an item from the cart (item is not in the cart; user exists)', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        console.log(`Removing product ${PRODUCT_ID.existing} from cart for user ${USER_ID.existing}`);
        const response = await bucketApi.removeProductFromBucket(USER_ID.existing, bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.productNotFound);
        console.log(`Product ${PRODUCT_ID.existing} was not removed from cart; an '${API.MESSAGE.productNotFound}' error message occured`);
    });

    test('API#34: Remove a non-existent item from a non-existent user cart', async ({ request }) => {
        const bucketData = productToBucketById(PRODUCT_ID.existing);

        console.log(`Removing product ${PRODUCT_ID.existing} from cart for non-existent user ${USER_ID.nonExisting}`);
        const response = await bucketApi.removeProductFromBucket(USER_ID.nonExisting, bucketData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.bucketNotFound);
        console.log(`Product was not removed from cart; an '${API.MESSAGE.bucketNotFound}' error message occured`);
    });
});