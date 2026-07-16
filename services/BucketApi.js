import { API } from '../config/apiConstants.js';
import { ApiClient } from './ApiClient.js';

class BucketApi {
    constructor(request) {
        this.apiClient = new ApiClient(request);
    }

    async getBucketByUserId(id) {
        return this.apiClient.get(API.URLS.bucket.base(id));
    }

    async addProductToBucket(id, bucketData) {
        return this.apiClient.post(API.URLS.bucket.addProduct(id), bucketData);
    }

    async removeProductFromBucket(id, bucketData) {
        return this.apiClient.delete(API.URLS.bucket.removeProduct(id), bucketData);
    }
};

export { BucketApi };