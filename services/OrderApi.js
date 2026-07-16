import { API } from '../config/apiConstants.js';
import { ApiClient } from './ApiClient.js';

class OrderApi {
    constructor(request) {
        this.apiClient = new ApiClient(request);
        this.basePath = API.URLS.order.base;
    }

    async getAllOrders() {
        return this.apiClient.get(this.basePath);
    }

    async getOrdersByUserID(id) {
        return this.apiClient.get(API.URLS.order.byUserId(id));
    }

    async createOrder(id, orderData) {
        return this.apiClient.post(API.URLS.order.byUserId(id), orderData);
    }

    async updateOrderStatus(id, orderStatus) {
        return this.apiClient.patch(API.URLS.order.updateStatus(id), orderStatus);
    }

};

export { OrderApi };