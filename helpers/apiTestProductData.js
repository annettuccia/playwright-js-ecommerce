import { getValidProduct } from "./testDataProduct";

export const getApiValidProduct = () => {
    const product = getValidProduct();
    return {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        urlImage: product.urlImage
    };
};

export const getApiProductWithnegativePrice = () => {
    const product = getValidProduct();
    return {
        name: product.name,
        description: product.description,
        price: '49.99',
        category: product.category,
        urlImage: product.urlImage
    };
};
export const getApiProductWithoutName = () => {
    const product = getValidProduct();
    return {
        name: '',
        description: product.description,
        price: product.price,
        category: product.category,
        urlImage: product.urlImage
    };
};
export const getApiProductWithoutDescription = () => { 
    const product = getValidProduct();
    return {
        name: product.name,
        description: '',
        price: product.price,
        category: product.category,
        urlImage: product.urlImage
    };
};
export const getApiProductWithoutCategory = () => {
    const product = getValidProduct();
    return {
        name: product.name,
        description: product.description,
        price: product.price,
        category: '',
        urlImage: product.urlImage
    };
};
export const getApiProductWithoutImage = () => {
    const product = getValidProduct();
    return {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        urlImage: ''
    };
};