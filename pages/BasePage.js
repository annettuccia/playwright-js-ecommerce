export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        console.log(`Navigate to ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForElementVisible(locator) {
        await locator.waitFor({ state: 'visible' });
        console.log(`Element ${locator} is visible`);
    }
}