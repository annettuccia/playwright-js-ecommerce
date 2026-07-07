import { BasePage } from './BasePage.js';
import { URLS } from '../config/url.js';

class CatalogPage extends BasePage {
    constructor(page) {
        super(page);

        this.catalogTitle = page.locator('h1:has-text("Каталог товаров")');
    }

    async gotoCatalogPage() {
        await this.navigate(URLS.catalog);
        await this.waitForElementVisible(this.catalogTitle);
        console.log('Catalog page is loaded');
    }
}

export { CatalogPage };