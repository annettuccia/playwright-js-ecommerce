import { STATUS_CODES } from "node:http";

export const API = {
    URLS: {
        baseURL: 'http://localhost:5173/api',
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            refresh: (id) => `/auth/${id}`
        },
        product: {
            base: '/product',
            byId: (id) => `/product/${id}`
        },
        bucket: {
            base: (id) => `/bucket/${id}`,
            addProduct: (id) => `/bucket/${id}/addProduct`,
            removeProduct: (id) => `/bucket/${id}/removeProduct`
        },
        order: {
            base: '/order',
            byUserId: (id) => `/order/${id}`,
            updateStatus: (id) => `/order/${id}/status`
        }
    },

    STATUS: {
        ok: 200,
        created: 201,
        badRequest: 400,
        unauthorized: 401,
        notFound: 404,
        conflict: 409,
        ISE: 500
    },

    STATUS_TEXT: {
        ok: 'OK',
        created: 'Created',
        badRequest: 'Bad Request',
        unauthorized: 'Unauthorized',
        notFound: 'Not Found',
        conflict: 'Conflict',
        ISE: 'Internal server error'
    },

    MESSAGE: {
        emailExists: /Email.*already exists/i,
        usernameExists: /Username.*already exists/i,
        shortPassword: 'Password must be at least 8 characters long',
        emptyPassword: 'password should not be empty',
        emptyEmail: 'email must be an email',
        emptyProductname: 'name should not be empty',
        emptyProductDescription: 'description should not be empty',
        invalidProductCategory: 'category must be one of the following values: ELECTRONICS, BOOKS, CLOTHING',
        invalidProductURL: 'urlImage must be a URL address',
        invalidLogin: 'Invalid email or password',
        invalidPhoneNumber: 'phoneNumber must be a valid phone number',
        invalidOrderStatus: 'status must be one of the following values: PENDING, SHIPPED, DELIVERED, CANCELED',
        userNotFound: /User with ID \S+ not found/i,
        productNotFound: /Product with ID \S+ not found/i,
        bucketNotFound: /Bucket not found for user with ID \S+/i,
        orderNotFound: /Order with ID \S+ not found/i,
        orderProductNotFound: 'One or more products included in the order were not found',
        negativePrice: 'price must not be less than 0',
    }
};