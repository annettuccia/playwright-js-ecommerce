import { expect } from '@playwright/test';
import { API } from "../config/apiConstants.js";

export const assertSuccessResponse = async (response, expectedStatus = API.STATUS.ok) => {
    expect(response.status()).toBe(expectedStatus);

    const body = await response.json();
    return body;
};

export const assertErrorResponse = async (response, expectedStatus, expectedMessage) => {
    expect(response.status()).toBe(expectedStatus);

    const body = await response.json();

    let errorMessage = body.error || body.message;

    expect(body).toHaveProperty('message');

    if (expectedMessage) {
        if (expectedMessage instanceof RegExp) {
            expect(body.message).toMatch(expectedMessage)
        }
        else {
            expect(body.message).toContain(expectedMessage)
        }
    }
    else {
        expect(errorMessage).toContain(expectedMessage);
    }

    expect(body).toHaveProperty('statusCode', expectedStatus);

    return body;
};

export const assertUserDataResponse = (body, expectedUser) => {
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', expectedUser.email);
    expect(body).toHaveProperty('username', expectedUser.username);
    const expectedRole = expectedUser.role || 'USER';
    expect(body).toHaveProperty('role', expectedRole);
    expect(body).toHaveProperty('firstname', expectedUser.firstname);
    expect(body).toHaveProperty('lastname', expectedUser.lastname);
    expect(body).toHaveProperty('phoneNumber', expectedUser.phoneNumber);
    expect(body).toHaveProperty('bucket_id');
};

export const assertProductDataResponse = (body, expectedProduct) => {
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', expectedProduct.name);
    expect(body).toHaveProperty('description', expectedProduct.description);
    expect(body).toHaveProperty('category', expectedProduct.category);
    expect(body).toHaveProperty('urlImage', expectedProduct.urlImage);
    expect(body).toHaveProperty('price');
    if (expectedProduct.price) {
        const expectedPrice = parseFloat(expectedProduct.price);
        const actualPrice = parseFloat(response.price);
        expect(actualPrice).toBeCloseTo(expectedPrice, 2);
    }
};

export const assertProductListResponse = (body) => {
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    body.forEach(item => {
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

        if (item.price) {
            const price = parseFloat(item.price);
            expect(price).toBeGreaterThan(0);
        }
    });
};

export const assertBucketResponse = (body, expectedBucketId = null) => {
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
    
    if (expectedBucketId) {
        expect(body.id).toBe(expectedBucketId);
    }
};

export const assertBucketItemResponse = (body, expectedProductId, expectedBucketId) => {
    expect(body).toHaveProperty('product_id', expectedProductId);
    expect(body).toHaveProperty('bucket_id', expectedBucketId);
};

export const assertOrderItemsResponse = (body, expectedUserId = null) => {
    expect(Array.isArray(body)).toBe(true);
    body.forEach(order => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('user_id');
        if (expectedUserId) {
            expect(order.user_id).toBe(expectedUserId);
        }
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
};

export const assertOrderCreatedResponse = (body) => {
    expect(body).toHaveProperty('orderId');
    expect(body.orderId).toBeDefined();
};

export const assertOrderStatusResponse = (body, expectedStatus) => {
    expect(body).toHaveProperty('id');
    expect(body.id).toBeDefined();
    expect(body).toHaveProperty('orderDate');
    expect(body.orderDate).toBeDefined();
    expect(body.status).toBe(expectedStatus);;
    expect(body).toHaveProperty('user_id');
    expect(body.user_id).toBeDefined();
};