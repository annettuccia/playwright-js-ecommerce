import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient.js';
import { API } from '../../config/apiConstants.js';
import { productToOrderById, changeOrderStatus } from '../../helpers/apiTestProductData.js';

test.describe('Order API tests', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new order API test\n');
    });

    test('API#35: Retrieve all orders', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.base);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(Array.isArray(responseBody)).toBe(true);
        responseBody.forEach(order => {
            expect(order).toHaveProperty('id');
            expect(order).toHaveProperty('status');
            expect(order).toHaveProperty('user_id');
            expect(order.user).toHaveProperty('email');
            expect(order.user).toHaveProperty('username');
            expect(Array.isArray(order.items)).toBe(true);

            if (order.items.length > 0) {
                order.items.forEach(item => {
                    expect(item).toHaveProperty('quantity');
                    expect(item).toHaveProperty('totalCost');
                    expect(item.product).toHaveProperty('name');
                    expect(item.product).toHaveProperty('price');
                });
            }
        });
    });

    test('API#36: Retrieve orders for an existing user by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.byUserId(2));

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(Array.isArray(responseBody)).toBe(true);
        responseBody.forEach(order => {
            expect(order).toHaveProperty('id');
            expect(order).toHaveProperty('status');
            expect(order).toHaveProperty('user_id', 2);
            expect(order.user).toHaveProperty('email');
            expect(order.user).toHaveProperty('username');
            expect(Array.isArray(order.items)).toBe(true);

            if (order.items.length > 0) {
                order.items.forEach(item => {
                    expect(item).toHaveProperty('quantity');
                    expect(item).toHaveProperty('totalCost');
                    expect(item.product).toHaveProperty('name');
                    expect(item.product).toHaveProperty('price');
                });
            }
        });
    });

    test('API#37: Retrieve orders for a non-existent user by ID', async ({ request }) => {
        const response = await apiClient.get(API.URLS.order.byUserId(2000));

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.userNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#38: Create an order for an existing user (product exists)', async ({ request }) => {
        const orderData = productToOrderById(1, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(3), orderData);

        expect(response.status()).toBe(API.STATUS.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('orderId');
        expect(responseBody.orderId).toBeDefined();
    });

    test('API#39: Create an order for an existing user with a non-existent product', async ({ request }) => {
        const orderData = productToOrderById(1000, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(3), orderData);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.orderProductNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#40: Create an order for an existing user with an empty product list', async ({ request }) => {
        const orderData = {
            "items": [
            ]
        };

        const response = await apiClient.post(API.URLS.order.byUserId(3), orderData);

        expect(response.status()).toBe(API.STATUS.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('orderId');
        expect(responseBody.orderId).toBeDefined();
    });

    test('API#41: Create an order for a non-existent user', async ({ request }) => {
        const orderData = productToOrderById(1, 2);

        const response = await apiClient.post(API.URLS.order.byUserId(3000), orderData);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.userNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });

    test('API#42: Update order status to PENDING', async ({ request }) => {
        const orderStatus = changeOrderStatus('PENDING');

        const response = await apiClient.patch(API.URLS.order.updateStatus(1), orderStatus);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.id).toBeDefined();
        expect(responseBody).toHaveProperty('orderDate');
        expect(responseBody.orderDate).toBeDefined();
        expect(responseBody).toHaveProperty('status', 'PENDING');
        expect(responseBody).toHaveProperty('user_id');
        expect(responseBody.user_id).toBeDefined();
    });

    test('API#43: Update order status to SHIPPED', async ({ request }) => {
        const orderStatus = changeOrderStatus('SHIPPED');

        const response = await apiClient.patch(API.URLS.order.updateStatus(2), orderStatus);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.id).toBeDefined();
        expect(responseBody).toHaveProperty('orderDate');
        expect(responseBody.orderDate).toBeDefined();
        expect(responseBody).toHaveProperty('status', 'SHIPPED');
        expect(responseBody).toHaveProperty('user_id');
        expect(responseBody.user_id).toBeDefined();
    });

    test('API#44: Update order status to DELIVERED', async ({ request }) => {
        const orderStatus = changeOrderStatus('DELIVERED');

        const response = await apiClient.patch(API.URLS.order.updateStatus(1), orderStatus);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.id).toBeDefined();
        expect(responseBody).toHaveProperty('orderDate');
        expect(responseBody.orderDate).toBeDefined();
        expect(responseBody).toHaveProperty('status', 'DELIVERED');
        expect(responseBody).toHaveProperty('user_id');
        expect(responseBody.user_id).toBeDefined();
    });

    test('API#45: Update order status to CANCELED', async ({ request }) => {
        const orderStatus = changeOrderStatus('CANCELED');

        const response = await apiClient.patch(API.URLS.order.updateStatus(2), orderStatus);

        expect(response.status()).toBe(API.STATUS.ok);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('id');
        expect(responseBody.id).toBeDefined();
        expect(responseBody).toHaveProperty('orderDate');
        expect(responseBody.orderDate).toBeDefined();
        expect(responseBody).toHaveProperty('status', 'CANCELED');
        expect(responseBody).toHaveProperty('user_id');
        expect(responseBody.user_id).toBeDefined();
    });

    test('API#46: Update order status to an invalid value (anything other than PENDING, SHIPPED, DELIVERED, or CANCELLED)', async ({ request }) => {
        const orderStatus = changeOrderStatus('anything');

        const response = await apiClient.patch(API.URLS.order.updateStatus(4), orderStatus);

        expect(response.status()).toBe(API.STATUS.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API.MESSAGE.invalidOrderStatus);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.badRequest);
    });

    test('API#47: Update order status for a non-existent user', async ({ request }) => {
        const orderStatus = changeOrderStatus('SHIPPED');

        const response = await apiClient.patch(API.URLS.order.updateStatus(1000), orderStatus);

        expect(response.status()).toBe(API.STATUS.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API.MESSAGE.orderNotFound);
        expect(responseBody).toHaveProperty('error', API.STATUS_TEXT.notFound);
        expect(responseBody).toHaveProperty('statusCode', API.STATUS.notFound);
    });
});