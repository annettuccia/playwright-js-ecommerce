import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { UserHeader } from '../pages/UserHeader.js';
import { URLS } from '../config/url.js';
import { CREDENTIALS } from '../config/credentials.js';

test.describe('Catalog functionality', () => {
    let loginPage;
    let catalogPage;
    let userHeader;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        catalogPage = new CatalogPage(page);
        userHeader = new UserHeader(page);

        console.log('\nStarting new catalog test with a new login page and catalog page');

        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user1.email, CREDENTIALS.user1.password);
        console.log(`User with email ${CREDENTIALS.user1.email} is authenticated as a norman user\n`);

        await expect(page).toHaveURL(URLS.catalog);
        await catalogPage.gotoCatalogPage();
    });

    test('TC#37: Verifying the display of all elements in the product card preview', async ({ page }) => {
        const productCount = await catalogPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
        
        const product = await catalogPage.getProductDetails(0);
        expect(product.title).not.toBeNull();
        expect(product.description).not.toBeNull();
        expect(product.price).not.toBeNull();
        expect(product.hasImage).toBeTruthy();
        
        const isAddButtonVisible = await catalogPage.isaddToCartBtnVisible(0);
        expect(isAddButtonVisible).toBeTruthy();
        
        const isAddButtonEnabled = await catalogPage.isaddToCartBtnEnabled(0);
        expect(isAddButtonEnabled).toBeTruthy();

        console.log('All product card elements present');
    });

    test('TC#38: Verification of the unified format for displaying product prices', async ({ page }) => {
        const prices = await catalogPage.getAllProductPrices();
        
        for (const price of prices) {
            console.log(`Checking price format: ${price}`);
            expect(price).toContain('₽');
            
            const numberPart = price.replace('₽', '').trim();
            
            if (numberPart.includes(' ')) {
                const parts = numberPart.split(' ');
                expect(parts[0]).toMatch(/[\d,]+/);
            }
            
            if (numberPart.includes(',')) {
                const decimalPart = numberPart.split(',')[1];
                expect(decimalPart.length).toBeLessThanOrEqual(2);
            }
        }
    });

    test('TC#39: Checking for alt text on product images', async ({ page }) => {
        const alts = await catalogPage.getAllProductImagesAlt();
        
        alts.forEach((alt, index) => {
            console.log(`Product ${index} alt: ${alt}`);
            expect(alt).not.toBeNull();
            expect(alt).not.toBe('');
            expect(alt).toMatch(/\S+/);
        });
    });

    test('TC#40: Navigate to the product details page upon clicking the product preview card', async ({ page }) => {
        const product = await catalogPage.getProductDetails(0);
        await catalogPage.clickProduct(0);
        
        await expect(page).toHaveURL(new RegExp(`${URLS.detailed}/\\d+`));
        await expect(page.locator('h1')).toContainText(product.title);
    });

    test('TC#41: Adding an item to the cart from the catalog', async ({ page }) => {
        const product = await catalogPage.getProductDetails(0);
        await catalogPage.addToCart(0);
        
        const toastMessage = await catalogPage.getToastMessage();
        expect(toastMessage).toContain('добавлен в корзину');
        
        await userHeader.clickCartIconHeaderBtn();
        await expect(page).toHaveURL(URLS.cart);
    });

    test('TC#42: Verifying behavior when re-adding the same item', async ({ page }) => {
        const product = await catalogPage.getProductDetails(0);
        await catalogPage.addToCartMultipleTimes(0, 2);
        
        await userHeader.clickCartIconHeaderBtn();
        await expect(page).toHaveURL(URLS.cart);
    });
    
    test('TC#43: Catalog display when there are no products', async ({ page }) => {
        const isEmpty = await catalogPage.isCatalogEmpty();
        
        if (isEmpty) {
            await expect(catalogPage.emptyCatalogMessage).toBeVisible();
            const productCount = await catalogPage.getProductCount();
            expect(productCount).toBe(0);
        } else {
            console.log('Catalog is not empty - test skipped');
            test.skip();
        }
    });
});