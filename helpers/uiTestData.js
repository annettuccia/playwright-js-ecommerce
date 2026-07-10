import { getValidUser } from "./testDataUser";

import { getValidUser } from './testDataUser.js';

export const getUiValidUser = () => {
    return getValidUser();
};

export const getUiUserWithSpecialChars = () => {
    const user = getValidUser();
    return {
        ...user,
        firstName: 'Иван-Михаил',
        lastName: "о'Брайн"
    };
};

export const getUiUserWithMinNameLength = () => {
    const user = getValidUser();
    return {
        ...user,
        firstName: 'И',
        lastName: 'И'
    };
};

export const getUiUserWithEmptyFirstName = () => {
    const user = getValidUser();
    return {
        ...user,
        firstName: ''
    };
};

export const getUiUserWithEmptyLastName = () => {
    const user = getValidUser();
    return {
        ...user,
        lastName: ''
    };
};

export const getUiUserWithNumbersInName = () => {
    const user = getValidUser();
    return {
        ...user,
        firstName: 'Иван123',
        lastName: 'Иванов123'
    };
};

export const getUiUserWithEmptyEmail = () => {
    const user = getValidUser();
    return {
        ...user,
        email: ''
    };
};

export const getUiUserWithInvalidEmail = () => {
    const user = getValidUser();
    return {
        ...user,
        email: 'ivvanov1test.com'
    };
};

export const getUiUserWithExistingEmail = () => {
    const user = getValidUser();
    return {
        ...user,
        email: 'admin@test.com'
    };
};

export const getUiUserWithEmptyUsername = () => {
    const user = getValidUser();
    return {
        ...user,
        username: ''
    };
};

export const getUiUserWithExistingUsername = () => {
    const user = getValidUser();
    return {
        ...user,
        username: 'ivanov_i'
    };
};

export const getUiUserWithEmptyPhone = () => {
    const user = getValidUser();
    return {
        ...user,
        phone: ''
    };
};

export const getUiUserWithInvalidPhoneNoPlus48 = () => {
    const user = getValidUser();
    return {
        ...user,
        phone: '123456789'
    };
};

export const getUiUserWithInvalidPhoneTooLong = () => {
    const user = getValidUser();
    return {
        ...user,
        phone: '123456789012345678901234567890'
    };
};

export const getUiUserWithExistingPhone = () => {
    const user = getValidUser();
    return {
        ...user,
        phone: '+48123456789'
    };
};

export const getUiUserWithEmptyPassword = () => {
    const user = getValidUser();
    return {
        ...user,
        password: ''
    };
};

export const getUiUserWithShortPassword = () => {
    const user = getValidUser();
    return {
        ...user,
        password: '1'
    };
};

export const getUiUserWithWeakPassword = () => {
    const user = getValidUser();
    return {
        ...user,
        password: 'Password123'
    };
};