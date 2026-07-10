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

export const getApiUserWithExistingEmail = () => ({
    firstname: 'Ivan',
    lastname: 'Ivanov',
    phoneNumber: '+1234567890',
    email: 'admin@test.com',
    username: `ivan${Date.now()}`,
    password: 'password123',
    role: 'USER'
});

export const getApiUserWithExistingUsername = () => {
    return {
        firstname: 'Ivan',
        lastname: 'Ivanov',
        phoneNumber: '+1234567890',
        email: `ivan.${Date.now()}@test.com`,
        username: 'admin',
        password: 'password123',
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