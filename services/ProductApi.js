import { API } from '../config/apiConstants.js';
import { ApiClient } from './ApiClient.js';

class ProductApi {
    constructor(request) {
        this.apiClient = new ApiClient(request);
        this.basePath = API.URLS.product.base;
    }

    async createProduct(productData) {
        return this.apiClient.post(this.basePath, productData);
    }

    async getProductById(id) {
        return this.apiClient.get(API.URLS.product.byId(id));
    }

    async getAllProducts() {
        return this.apiClient.get(this.basePath);
    }

    async updateProductData(id, productData) {
        return this.apiClient.patch(API.URLS.product.byId(id), productData);
    }

    async deleteProduct(id) {
        return this.apiClient.delete(API.URLS.product.byId(id));
    }
};

export { ProductApi };