import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import { productToOrderById, changeOrderStatus } from '../../helpers/apiTestProductData.js';
import {
    assertSuccessResponse, assertErrorResponse, assertOrderItemsResponse, assertOrderCreatedResponse, assertOrderStatusResponse
} from '../../helpers/apiAssertions.js'

test.describe('Order API tests', () => {
    let apiClient;

    const USER_ID = {
        existing: 2,
        nonExisting: 2000
    };

    const PRODUCT_ID = {
        existing: 3,
        nonExisting: 3000
    };

    const ORDER_ID = {
        existing: 1,
        nonExisting: 1000
    };

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new order API test\n');
    });

    test('API#35: Retrieve all orders', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.base);

        const responseBody = await assertSuccessResponse(response);

        assertOrderItemsResponse(responseBody);
    });

    test('API#36: Retrieve orders for an existing user by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.byUserId(USER_ID.existing));

        const responseBody = await assertSuccessResponse(response);

        assertOrderItemsResponse(responseBody, USER_ID.existing);
    });

    test('API#37: Retrieve orders for a non-existent user by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.byUserId(USER_ID.nonExisting));

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.userNotFound);
    });

    test('API#38: Create an order for an existing user (product exists)', async ({ request }) => {
        const orderData = productToOrderById(PRODUCT_ID.existing, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(USER_ID.existing), orderData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);

        assertOrderCreatedResponse(responseBody);
    });

    test('API#39: Create an order for an existing user with a non-existent product', async ({ request }) => {
        const orderData = productToOrderById(PRODUCT_ID.nonExisting, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(USER_ID.existing), orderData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.orderProductNotFound);
    });

    test('API#40: Create an order for an existing user with an empty product list', async ({ request }) => {
        const orderData = {
            "items": [
            ]
        };

        const response = await apiClient.post(API.URLS.order.byUserId(USER_ID.existing), orderData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);

        assertOrderCreatedResponse(responseBody);
    });

    test('API#41: Create an order for a non-existent user', async ({ request }) => {
        const orderData = productToOrderById(1, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(USER_ID.nonExisting), orderData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.userNotFound);
    });

    test('API#42: Update order status to PENDING', async () => {
        const status = 'PENDING';
        
        const orderStatus = changeOrderStatus(status);
        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.existing), orderStatus);
        const responseBody = await assertSuccessResponse(response);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#43: Update order status to SHIPPED', async () => {
        const status = 'SHIPPED';
        
        const orderStatus = changeOrderStatus(status);
        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.existing), orderStatus);
        const responseBody = await assertSuccessResponse(response);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#44: Update order status to DELIVERED', async () => {
        const status = 'DELIVERED';
        
        const orderStatus = changeOrderStatus(status);
        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.existing), orderStatus);
        const responseBody = await assertSuccessResponse(response);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#45: Update order status to CANCELED', async () => {
        const status = 'CANCELED';
        
        const orderStatus = changeOrderStatus(status);
        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.existing), orderStatus);
        const responseBody = await assertSuccessResponse(response);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#46: Update order status to an invalid value (anything other than PENDING, SHIPPED, DELIVERED, or CANCELLED)', async ({ request }) => {
        const orderStatus = changeOrderStatus('anything');

        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.existing), orderStatus);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidOrderStatus);
    });

    test('API#47: Update order status for a non-existent user', async ({ request }) => {
        const orderStatus = changeOrderStatus('SHIPPED');

        const response = await apiClient.patch(API.URLS.order.updateStatus(ORDER_ID.nonExisting), orderStatus);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.orderNotFound);
    });
});