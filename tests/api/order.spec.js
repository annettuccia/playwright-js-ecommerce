import { test, expect } from '@playwright/test';
import { ApiClient } from '../../services/ApiClient';
import { API_URLS } from '../../config/apiEndpoints';
import { API_Messages } from '../../config/apiMessages';
import { productToOrderById, changeOrderStatus } from '../../helpers/apiTestProductData.js';

test.describe('Order API tests', () => {
    let apiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
        console.log('\nStarting new order API test\n');
    });

    test('API#35: Retrieve all orders', async ({ request }) => {
        const response = await apiClient.get(API_URLS.ORDER.base);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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
        const response = await apiClient.get(API_URLS.ORDER.by_user_id(2));

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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
        const response = await apiClient.get(API_URLS.ORDER.by_user_id(2000));

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.userNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#38: Create an order for an existing user (product exists)', async ({ request }) => {
        const orderData = productToOrderById(1, 2);

        const response = await apiClient.post(API_URLS.ORDER.by_user_id(3), orderData);

        expect(response.status()).toBe(API_Messages.statusCode.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('orderId');
        expect(responseBody.orderId).toBeDefined();
    });

    test('API#39: Create an order for an existing user with a non-existent product', async ({ request }) => {
        const orderData = productToOrderById(1000, 2);

        const response = await apiClient.post(API_URLS.ORDER.by_user_id(3), orderData);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.orderProductNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#40: Create an order for an existing user with an empty product list', async ({ request }) => {
        const orderData = {
            "items": [
            ]
        };

        const response = await apiClient.post(API_URLS.ORDER.by_user_id(3), orderData);

        expect(response.status()).toBe(API_Messages.statusCode.created);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('orderId');
        expect(responseBody.orderId).toBeDefined();
    });

    test('API#41: Create an order for a non-existent user', async ({ request }) => {
        const orderData = productToOrderById(1, 2);

        const response = await apiClient.post(API_URLS.ORDER.by_user_id(3000), orderData);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.userNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });

    test('API#42: Update order status to PENDING', async ({ request }) => {
        const orderStatus = changeOrderStatus('PENDING');

        const response = await apiClient.patch(API_URLS.ORDER.update_status(3), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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

        const response = await apiClient.patch(API_URLS.ORDER.update_status(3), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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

        const response = await apiClient.patch(API_URLS.ORDER.update_status(1), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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

        const response = await apiClient.patch(API_URLS.ORDER.update_status(2), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.ok);

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

        const response = await apiClient.patch(API_URLS.ORDER.update_status(4), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.badRequest);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain(API_Messages.message.invalidOrderStatus);
        expect(responseBody).toHaveProperty('error', API_Messages.status.badRequest);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.badRequest);
    });

    test('API#47: Update order status for a non-existent user', async ({ request }) => {
        const orderStatus = changeOrderStatus('SHIPPED');

        const response = await apiClient.patch(API_URLS.ORDER.update_status(1000), orderStatus);

        expect(response.status()).toBe(API_Messages.statusCode.notFound);

        const responseBody = await response.json();
        console.log('Response:', JSON.stringify(responseBody, null, 2));

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toMatch(API_Messages.message.orderNotFound);
        expect(responseBody).toHaveProperty('error', API_Messages.status.notFound);
        expect(responseBody).toHaveProperty('statusCode', API_Messages.statusCode.notFound);
    });
});