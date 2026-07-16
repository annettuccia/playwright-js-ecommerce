import { test, expect } from '@playwright/test';
import { OrderApi } from '../../services/OrderApi.js';
import { API } from '../../config/apiConstants.js';
import { productToOrderById, changeOrderStatus } from '../../helpers/apiTestProductData.js';
import {
    assertSuccessResponse, assertErrorResponse, assertOrderItemsResponse, assertOrderCreatedResponse, assertOrderStatusResponse
} from '../../helpers/apiAssertions.js'

test.describe('Order API tests', () => {
    let orderApi;

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
        orderApi = new OrderApi(request);
        console.log('\nStarting new order API test\n');
    });

    test('API#35: Get a list of all orders', async ({ request }) => {
        console.log(`Getting list of all orders`);
        const response = await orderApi.getAllOrders();

        const responseBody = await assertSuccessResponse(response);
        console.log(`Received a list of ${responseBody.length} orders`);

        assertOrderItemsResponse(responseBody);
    });

    test('API#36: Get orders for an existing user by ID', async ({ request }) => {
        console.log(`Getting orders for user with id ${USER_ID.existing}`);
        const response = await orderApi.getOrdersByUserID(USER_ID.existing);

        const responseBody = await assertSuccessResponse(response);
        console.log(`Received orders for user with id ${USER_ID.existing}`);

        assertOrderItemsResponse(responseBody, USER_ID.existing);
    });

    test('API#37: Get orders for a non-existent user by ID', async ({ request }) => {
        console.log(`Getting orders for user with id ${USER_ID.nonExisting}`);
        const response = await orderApi.getOrdersByUserID(USER_ID.nonExisting);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.userNotFound);
        console.log(`Orders for user with id ${USER_ID.nonExisting} were not found; an '${API.MESSAGE.userNotFound}' error message occured`);
    });

    test('API#38: Create an order for an existing user (product exists)', async ({ request }) => {
        const orderData = productToOrderById(PRODUCT_ID.existing, 2);

        console.log(`Creating order for user ${USER_ID.existing} with product ${PRODUCT_ID.existing}`);
        const response = await orderApi.createOrder(USER_ID.existing, orderData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`Order for user ${USER_ID.existing} was created`);

        assertOrderCreatedResponse(responseBody);
    });

    test('API#39: Create an order for an existing user with a non-existent product', async ({ request }) => {
        const orderData = productToOrderById(PRODUCT_ID.nonExisting, 2);

        console.log(`Creating order for user ${USER_ID.existing} with non-existent product ${PRODUCT_ID.nonExisting}`);
        const response = await orderApi.createOrder(USER_ID.existing, orderData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.orderProductNotFound);
        console.log(`Order was not created; an '${API.MESSAGE.orderProductNotFound}' error message occured`);
    });

    test('API#40: Create an order for an existing user with an empty product list', async ({ request }) => {
        const orderData = {
            "items": [
            ]
        };

        console.log(`Creating order for user ${USER_ID.existing} with empty product list`);
        const response = await orderApi.createOrder(USER_ID.existing, orderData);
        const responseBody = await assertSuccessResponse(response, API.STATUS.created);
        console.log(`Order for user ${USER_ID.existing} was created with empty product list`);

        assertOrderCreatedResponse(responseBody);
    });

    test('API#41: Create an order for a non-existent user', async ({ request }) => {
        const orderData = productToOrderById(PRODUCT_ID.existing, 2);

        console.log(`Creating order for non-existent user ${USER_ID.nonExisting}`);
        const response = await orderApi.createOrder(USER_ID.nonExisting, orderData);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.userNotFound);
        console.log(`Order was not created; an '${API.MESSAGE.userNotFound}' error message occured`);
    });

    test('API#42: Update order status to PENDING', async () => {
        const status = 'PENDING';
        const orderStatus = changeOrderStatus(status);

        console.log(`Updating order ${ORDER_ID.existing} status to ${status}`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.existing, orderStatus);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Order ${ORDER_ID.existing} status was updated to ${status}`);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#43: Update order status to SHIPPED', async () => {
        const status = 'SHIPPED';
        const orderStatus = changeOrderStatus(status);

        console.log(`Updating order ${ORDER_ID.existing} status to ${status}`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.existing, orderStatus);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Order ${ORDER_ID.existing} status was updated to ${status}`);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#44: Update order status to DELIVERED', async () => {
        const status = 'DELIVERED';
        const orderStatus = changeOrderStatus(status);

        console.log(`Updating order ${ORDER_ID.existing} status to ${status}`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.existing, orderStatus);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Order ${ORDER_ID.existing} status was updated to ${status}`);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#45: Update order status to CANCELED', async () => {
        const status = 'CANCELED';
        const orderStatus = changeOrderStatus(status);

        console.log(`Updating order ${ORDER_ID.existing} status to ${status}`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.existing, orderStatus);
        const responseBody = await assertSuccessResponse(response);
        console.log(`Order ${ORDER_ID.existing} status was updated to ${status}`);
        
        assertOrderStatusResponse(responseBody, status);
    });

    test('API#46: Update order status to an invalid value (anything other than PENDING, SHIPPED, DELIVERED, or CANCELLED)', async ({ request }) => {
        const orderStatus = changeOrderStatus('anything');

        console.log(`Updating order ${ORDER_ID.existing} status to invalid value`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.existing, orderStatus);

        await assertErrorResponse(response, API.STATUS.badRequest, API.MESSAGE.invalidOrderStatus);
        console.log(`Order ${ORDER_ID.existing} status was not updated; an '${API.MESSAGE.invalidOrderStatus}' error message occured`);
    });

    test('API#47: Update order status for a non-existent user', async ({ request }) => {
        const status = 'SHIPPED';
        const orderStatus = changeOrderStatus(status);

        console.log(`Updating order ${ORDER_ID.nonExisting} status to ${status}`);
        const response = await orderApi.updateOrderStatus(ORDER_ID.nonExisting, orderStatus);

        await assertErrorResponse(response, API.STATUS.notFound, API.MESSAGE.orderNotFound);
        console.log(`Order ${ORDER_ID.nonExisting} status was not updated; an '${API.MESSAGE.orderNotFound}' error message occured`);
    });
});