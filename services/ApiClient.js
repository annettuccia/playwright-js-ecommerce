import { API_URLS } from '../config/apiEndpoints.js';

class ApiClient {
    constructor(request) {
        this.request = request;
        this.baseURL = API_URLS.baseURL;
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    async get(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`GET ${url}`);

        const response = await this.request.get(url);

        console.log(`Response status: ${response.status}`);

        return response;
    }

    async post(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`POST ${url}`);

        const response = await this.request.post(url, {
            headers: this.headers,
            data: data
        });

        console.log(`Response status: ${response.status}`);

        return response;
    }

    async patch(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`PATCH ${url}`);

        const response = await this.request.patch(url, {
            headers: this.headers,
            data: data
        });

        console.log(`Response status: ${response.status}`);

        return response;
    }

    async delete(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`DELETE ${url}`);

        const response = await this.request.delete(url, {
            headers: this.headers
        });

        console.log(`Response status: ${response.status}`);

        return response;
    }
}

export { ApiClient };