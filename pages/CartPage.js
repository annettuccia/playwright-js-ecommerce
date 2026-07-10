import { BasePage } from './BasePage.js';
import { URLS } from '../config/urls.js';

class CartPage extends BasePage {
    constructor(page) {
        super(page);

        this.cartTitle = page.locator('h1:has-text("Ваша Корзина")');

        this.cartItems = page.locator('.flex.items-center.justify-between.p-4.border-b');
        this.productTitle = page.locator('h4.font-semibold');
        this.productPrice = page.locator('.text-sm.text-muted-foreground');
        this.removeButton = page.locator('button:has-text("Удалить")');
        this.totalAmount = page.locator('.text-lg.font-bold span:last-child');
        this.checkoutBtn = page.locator('button:has-text("Оформить заказ")');

        this.emptyCartMessage = page.locator('p:has-text("Ваша корзина пуста")');
        this.successToast = page.locator('[data-sonner-toast][data-type="success"]');
    }

    async gotoCartPage() {
        await this.navigate(URLS.cart);
        await this.waitForElementVisible(this.cartTitle);
        console.log('Cart page is loaded');
    }

    async getCartItems() {
        const items = [];
        const count = await this.cartItems.count();
        console.log(`Found ${count} items in cart`);
        return this.cartItems;
    }

    async getCartItem(index = 0) {
        const item = this.cartItems.nth(index);
        const title = await item.locator(this.productTitle).textContent();
        const price = await item.locator(this.productPrice).textContent();
        const hasRemoveBtn = await item.locator(this.removeButton).isVisible();
        const isRemoveEnabled = await item.locator(this.removeButton).isEnabled();
        console.log(`Cart item ${index}: ${title} - ${price}`);
        return {
            title: title?.trim(),
            price: price?.trim(),
            hasRemoveButton: hasRemoveBtn,
            isRemoveEnabled
        };
    }

    async getAllCartItems() {
        const items = [];
        const count = await this.cartItems.count();
        for (let i = 0; i < count; i++) {
            const item = await this.getCartItem(i);
            items.push(item);
        }
        console.log(`Retrieved ${items.length} cart items`);
        return items;
    }

    async getRemoveButtons() {
        const btns = [];
        const count = await this.cartItems.count();
        for (let i = 0; i < count; i++) {
            const item = this.cartItems.nth(i);
            const hasButton = await item.locator(this.removeButton).isVisible();
            const isEnabled = await item.locator(this.removeButton).isEnabled();
            btns.push({ hasButton, isEnabled });
        }
        console.log(`Found ${btns.length} remove buttons`);
        return btns;
    }

    async removeItem(index = 0) {
        const item = this.cartItems.nth(index);
        await item.locator(this.removeButton).click();
    }

    async removeAllItems() {
        let count = await this.cartItems.count();
        console.log(`Removing ${count} items from cart`);

        if (count === 0) {
            console.log('Cart is already empty');
            return;
        }

        while (count > 0) {
            const item = this.cartItems.nth(0);
            const removeBtn = item.locator(this.removeButton);

            await removeBtn.waitFor({ state: 'visible', timeout: 5000 });
            await removeBtn.click();

            await this.page.waitForTimeout(500);

            count = await this.cartItems.count();
            console.log(`Remaining items to remove: ${count}`);
        }
        console.log('All items removed');
    }

    async getTotalAmount() {
        const total = await this.totalAmount.textContent();
        console.log(`Total amount: ${total}`);
        return total?.trim();
    }

    async getTotalAmountValue() {
        const totalText = await this.getTotalAmount();
        const value = parseFloat(totalText.replace(/[^\d.]/g, ''));
        console.log(`Total value: ${value}`);
        return value;
    }

    async checkout() {
        console.log(`Clicking checkout btn`);
        await this.checkoutBtn.click();
        try {
            await this.waitForElementVisible(this.successToast);
            const message = await this.successToast.textContent();
            console.log(`Checkout message: ${message}`);
        } catch (error) {
            console.log('No toast message appeared');
        }
        await this.page.waitForURL(URLS.catalog);
        console.log('Redirected to catalog page');
    }

    async isCartEmpty() {
        const empty = await this.emptyCartMessage.isVisible();
        console.log(`Cart empty: ${empty}`);
        return empty;
    }

    async getItemCount() {
        const count = await this.cartItems.count();
        console.log(`Total items in cart: ${count}`);
        return count;
    }

    async isCheckoutEnabled() {
        const enabled = await this.checkoutBtn.isEnabled();
        console.log(`Checkout button enabled: ${enabled}`);
        return enabled;
    }

    async getEmptyCartMessage() {
        await this.waitForElementVisible(this.emptyCartMessage);
        const message = await this.emptyCartMessage.textContent();
        console.log(`Empty cart message: ${message}`);
        return message;
    }
}

export { CartPage };