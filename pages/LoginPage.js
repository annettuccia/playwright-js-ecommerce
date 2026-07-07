import { BasePage } from './BasePage.js';
import { URLS } from '../config/url.js'

class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginBtn = page.locator('button[type="submit"]');
        this.registerLink = page.locator('a:has-text("Зарегистрироваться")');

        this.errorLoginMessage = page.locator('[data-sonner-toast][data-type="error"]').filter({ hasText: 'Неверный email или пароль' });

        this.requiredPasswordMessage = page.getByText('Пароль обязателен');
        this.requiredEmailMessage = page.getByText('Email обязателен');
    }

    async gotoLoginPage() {
        await this.navigate(URLS.login);
        await this.waitForElementVisible(this.emailInput);
        await this.waitForElementVisible(this.passwordInput);
        await this.waitForElementVisible(this.loginBtn);
        console.log(`Login page loaded`);
    }

    async login(email, password) {
        console.log(`Login with ${email} credentials`);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
        await this.page.waitForURL(`**${URLS.catalog}`);
        console.log(`Login button clicked`);
    }

    async loginWithEnterKey(email, password) {
        console.log(`Login with ${email} credentials through Enter key`);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
        console.log(`Enter key pressed`);
    }

    async gotoRegisterPage() {
        console.log(`Click register link`);
        await this.registerLink.click();
        await this.page.waitForURL(`**${URLS.register}`);
        console.log(`User is on register page`);
    }

    async getErrorLoginMessage() {
        await this.waitForElementVisible(this.errorLoginMessage);
        const message = await this.errorLoginMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async getRequiredPasswordMessage() {
        await this.waitForElementVisible(this.requiredPasswordMessage);
        const message = await this.requiredPasswordMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async getRequiredEmailMessage() {
        await this.waitForElementVisible(this.requiredEmailMessage);
        const message = await this.requiredEmailMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isErrorLoginMessageVisible() {
        const visible = await this.errorLoginMessage.isVisible();
        console.log(`Error login message visible: ${visible}`);
        return visible;
    }

    async isRequiredPasswordMessageVisible() {
        const visible = await this.requiredPasswordMessage.isVisible();
        console.log(`Required password message visible: ${visible}`);
        return visible;
    }

    async isRequiredEmailMessageVisible() {
        const visible = await this.requiredEmailMessage.isVisible();
        console.log(`Required email message visible: ${visible}`);
        return visible;
    }
}

export { LoginPage };