import { API } from '../config/apiConstants.js';

class ApiClient {
    constructor(request) {
        this.request = request;
        this.baseURL = API.URLS.baseURL;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;

        const response = await this.request.get(url);
        return response;
    }

    async post(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;

        const response = await this.request.post(url, {
            headers: this.headers,
            data: data
        });
        return response;
    }

    async patch(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;

        const response = await this.request.patch(url, {
            headers: this.headers,
            data: data
        });
        return response;
    }

    async delete(endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            headers: this.headers
        };
        if (data) {
            options.data = data;
        }
        const response = await this.request.delete(url, options);
        return response;
    }
}

export { ApiClient };