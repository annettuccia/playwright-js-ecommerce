import { expect } from '@playwright/test';

export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        console.log(`Navigating to: ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        console.log(`Page loaded`);
    }

    async waitForElementVisible(locator) {
        console.log(`Waiting for element to be visible`);
        await locator.waitFor({ state: 'visible' });
        console.log(`Element is visible`);
    }
}