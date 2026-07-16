import { API } from '../config/apiConstants.js';
import { ApiClient } from './ApiClient.js';

class UserApi{
    constructor(request){
        this.apiClient = new ApiClient(request);
    }

    async login(loginData){
        return this.apiClient.post(API.URLS.auth.login, loginData);
    }

    async register(userData) {
        return this.apiClient.post(API.URLS.auth.register, userData);
    }

    async updateUserData(id, userData){
        return this.apiClient.patch(API.URLS.auth.refresh(id), userData);
    }
};

export{UserApi};