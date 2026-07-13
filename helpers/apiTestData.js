import { getValidUser } from './testDataUser.js';

export const getApiValidUser = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: user.email,
        username: user.username,
        password: user.password,
        role: 'USER'
    };
};

export const getApiUserWithExistingEmail = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: 'admin@test.com',
        username: user.username,
        password: user.password,
        role: 'USER'
    };
};

export const getApiUserWithExistingUsername = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: `ivan.${Date.now()}@test.com`,
        username: 'admin',
        password: user.password,
        role: 'USER'
    };
};

export const getApiUserWithoutPassword = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: `ivan.${Date.now()}@test.com`,
        username: `ivan${Date.now()}`,
        password: '',
        role: 'USER'
    };
};

export const getApiUserDataUpdate = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: user.email,
        username: user.username
    };
};

export const getApiUserDataUpdateInvalidPhone = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: '+1987654321',
        email: user.email,
        username: user.username
    };
};

export const getApiUserDataUpdatewithExistingEmail = () => {
    const user = getValidUser();
    return{
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: 'admin@test.com',
        username: user.username
    };
};

export const getApiUserDataUpdatewithExistingUsername = () => {
    const user = getValidUser();
    return {
        firstname: user.firstName,
        lastname: user.lastName,
        phoneNumber: user.phone,
        email: user.email,
        username: 'admin'
    };
}