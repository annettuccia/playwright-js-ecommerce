import { BasePage } from './BasePage.js';
import { URLS } from '../config/url.js';

class CatalogPage extends BasePage {
    constructor(page) {
        super(page);

        this.catalogTitle = page.locator('h1:has-text("Каталог товаров")');
        
        this.productCards = page.locator('.group.flex');
        this.productTitle = page.locator('.font-semibold.leading-none');
        this.productDescription = page.locator('.text-sm.text-muted-foreground');
        this.productPrice = page.locator('.text-2xl.font-bold.text-primary');
        this.addToCartBtn = page.locator('button:has-text("В корзину")');
        this.productImage = page.locator('img');

        this.emptyCatalogMessage = page.locator(':has-text("Ошибка загрузки данных")');
        this.successToast = page.locator('[data-sonner-toast][data-type="success"]');
    }

    async gotoCatalogPage() {
        await this.navigate(URLS.catalog);
        await this.waitForElementVisible(this.catalogTitle);
        console.log('Catalog page is loaded');
    }

    async getProductCount() {
        const count = await this.productCards.count();
        console.log(`Found ${count} products`);
        return count;
    }

    async getProductDetails(index = 0) {
        const card = this.productCards.nth(index);
        const title = await card.locator(this.productTitle).textContent();
        const description = await card.locator(this.productDescription).textContent();
        const price = await card.locator(this.productPrice).textContent();
        const hasImage = await card.locator(this.productImage).isVisible();
        const imageAlt = await card.locator(this.productImage).getAttribute('alt');
        console.log(`Product ${index}: ${title} - ${price}`);
        return {
            title: title?.trim(),
            description: description?.trim(),
            price: price?.trim(),
            hasImage,
            imageAlt
        };
    }

    async getAllProductPrices() {
        const prices = [];
        const count = await this.productCards.count();
        for (let i = 0; i < count; i++) {
            const card = this.productCards.nth(i);
            const price = await card.locator(this.productPrice).textContent();
            prices.push(price?.trim());
        }
        console.log(`Found ${prices.length} prices`);
        return prices;
    }

    async getAllProductImagesAlt() {
        const alts = [];
        const count = await this.productCards.count();
        for (let i = 0; i < count; i++) {
            const card = this.productCards.nth(i);
            const alt = await card.locator(this.productImage).getAttribute('alt');
            alts.push(alt);
        }
        console.log(`Found ${alts.length} image alts`);
        return alts;
    }

    async addToCart(index = 0) {
        const card = this.productCards.nth(index);
        const product = await this.getProductDetails(index);
        console.log(`Adding to cart: ${product.title}`);
        const addButton = card.locator(this.addToCartBtn);
        await addButton.click();
        await this.waitForElementVisible(this.successToast);
        console.log('Product added to cart successfully');
    }

    async addToCartMultipleTimes(index = 0, times = 2) {
        const card = this.productCards.nth(index);
        const product = await this.getProductDetails(index);
        console.log(`Adding ${product.title} ${times} times`);
        for (let i = 0; i < times; i++) {
            const addButton = card.locator(this.addToCartBtn);
            await addButton.click();
            await this.waitForElementVisible(this.successToast);
        }
        console.log(`Added ${product.title} ${times} times`);
    }

    async clickProduct(index = 0) {
        const card = this.productCards.nth(index);
        const product = await this.getProductDetails(index);
        console.log(`Clicking product: ${product.title}`);
        await card.click();
        await this.page.waitForURL(`**${URLS.detailed}/**`);
        console.log('Navigated to product detail page');
    }

    async isaddToCartBtnVisible(index = 0) {
        const card = this.productCards.nth(index);
        const visible = await card.locator(this.addToCartBtn).isVisible();
        console.log(`Add to cart button visible: ${visible}`);
        return visible;
    }

    async isaddToCartBtnEnabled(index = 0) {
        const card = this.productCards.nth(index);
        const enabled = await card.locator(this.addToCartBtn).isEnabled();
        console.log(`Add to cart button enabled: ${enabled}`);
        return enabled;
    }

    async getToastMessage() {
        await this.waitForElementVisible(this.successToast);
        const message = await this.successToast.textContent();
        console.log(`Toast message: ${message}`);
        return message;
    }

    async isCatalogEmpty() {
        const empty = await this.emptyCatalogMessage.isVisible();
        console.log(`Catalog empty: ${empty}`);
        return empty;
    }

    async getProductCardElement(index = 0) {
        return this.productCards.nth(index);
    }
}

export { CatalogPage };