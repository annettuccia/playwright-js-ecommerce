export const API_URLS = {
    baseURL: 'http://localhost:5173/api',
    AUTH: {
        login: '/auth/login',
        register: '/auth/register',
        refresh: (id) => `/auth/${id}`
    },
    PRODUCT: {
        base: '/product',
        by_id: (id) => `/product/${id}`
    },
    BUCKET: {
        base: '/bucket',
        add_product: (id) => `/bucket/${id}/addProduct`,
        remove_product: (id) => `/bucket/${id}/removeProduct`
    },
    ORDER: {
        base: '/order',
        by_user_id: (id) => `/order/${id}`,
        update_status: (id) => `/order/${id}/status`
    }
};