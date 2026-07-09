import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CatalogPage } from '../pages/CatalogPage.js';
import { UserHeader } from '../pages/UserHeader.js';
import { URLS } from '../config/url.js';
import { CREDENTIALS } from '../config/credentials.js';

test.describe('Cart functionality', () => {
    let loginPage;
    let cartPage;
    let catalogPage;
    let userHeader;

    // Вспомогательный метод для добавления рандомных товаров в корзину
    async function addRandomItemsToCart(count = 3) {
        console.log(`\nAdding ${count} random items to cart`);

        await catalogPage.gotoCatalogPage();

        const totalProducts = await catalogPage.getProductCount();
        console.log(`Total products available: ${totalProducts}`);

        if (totalProducts === 0) {
            throw new Error('No products available to add to cart');
        }

        const selectedIndices = [];
        const availableIndices = Array.from({ length: totalProducts }, (_, i) => i);

        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }

        const itemsToAdd = Math.min(count, availableIndices.length);
        for (let i = 0; i < itemsToAdd; i++) {
            selectedIndices.push(availableIndices[i]);
        }

        console.log(`Selected product indices: ${selectedIndices.join(', ')}`);

        for (const index of selectedIndices) {
            await catalogPage.addToCart(index);
            console.log(`Added product at index ${index} to cart`);
        }

        await userHeader.clickCartIconHeaderBtn();
        await expect(catalogPage.page).toHaveURL(URLS.cart);
        await cartPage.gotoCartPage();

        const itemCount = await cartPage.getItemCount();
        console.log(`Items in cart after adding: ${itemCount}`);

        return itemCount;
    }

    // Вспомогательный метод для очистки корзины
    async function clearCart() {
        try {
            await cartPage.gotoCartPage();
            await cartPage.removeAllItems();
            const isEmpty = await cartPage.isCartEmpty();
            console.log(`Cart is empty: ${isEmpty}`);
            return isEmpty;
        } catch (error) {
            console.log(`Error clearing cart: ${error.message}`);
        }
    }

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);
        catalogPage = new CatalogPage(page);
        userHeader = new UserHeader(page);

        console.log('\nStarting new cart test with a new login page and cart page\n');

        await loginPage.gotoLoginPage();
        await loginPage.login(CREDENTIALS.user2.email, CREDENTIALS.user2.password);
        console.log(`User with email ${CREDENTIALS.user2.email} is authenticated as a normal user\n`);

        await expect(page).toHaveURL(URLS.catalog);
        await catalogPage.gotoCatalogPage();

        await userHeader.clickCartIconHeaderBtn();
        await expect(page).toHaveURL(URLS.cart);
        await cartPage.gotoCartPage();
        await clearCart();

        await catalogPage.gotoCatalogPage();
    });

    test('TC#44: Each item in the cart has a "Remove" button', async ({ page }) => {
        await addRandomItemsToCart(3);

        const items = await cartPage.getAllCartItems();
        console.log('Cart items:', items.map(item => item.title));

        const removeBtns = await cartPage.getRemoveButtons();
        console.log(`Found ${removeBtns.length} remove buttons`);

        expect(removeBtns.length).toBe(3);

        removeBtns.forEach((btn, index) => {
            expect(btn.hasButton).toBeTruthy();
            expect(btn.isEnabled).toBeTruthy();
            console.log(`Item ${index} has remove button`);
        });
    });

    test('TC#45: Placing an order with an empty cart', async ({ page }) => {
        await clearCart();

        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBeTruthy();

        const isCheckoutEnabled = await cartPage.isCheckoutEnabled();
        expect(isCheckoutEnabled).toBeFalsy();

        const emptyMessage = await cartPage.getEmptyCartMessage();
        expect(emptyMessage).toContain('Ваша корзина пуста');
    });

    test('TC#46: Removing the last item from the cart', async ({ page }) => {
        await addRandomItemsToCart(1);

        const itemsBefore = await cartPage.getItemCount();
        expect(itemsBefore).toBe(1);

        await cartPage.removeAllItems();

        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBeTruthy();

        const isCheckoutEnabled = await cartPage.isCheckoutEnabled();
        expect(isCheckoutEnabled).toBeFalsy();

        const emptyMessage = await cartPage.getEmptyCartMessage();
        expect(emptyMessage).toContain('Ваша корзина пуста');
    });

    test('TC#47: Displaying the total amount for items with different prices', async ({ page }) => {
        // Добавляем рандомное количество товаров (2-4)
        const count = Math.floor(Math.random() * 3) + 2;
        await addRandomItemsToCart(count);

        const total = await cartPage.getTotalAmount();
        expect(total).not.toBeNull();
        expect(total).toContain('руб');

        // Дополнительная проверка - сумма должна быть больше 0
        const totalValue = await cartPage.getTotalAmountValue();
        expect(totalValue).toBeGreaterThan(0);
    });

    test('TC#48: Placing an order from the shopping cart', async ({ page }) => {
        await addRandomItemsToCart(3);

        const itemsBefore = await cartPage.getItemCount();
        expect(itemsBefore).toBe(3);

        await cartPage.checkout();

        await expect(page).toHaveURL(URLS.catalog);
    });
});