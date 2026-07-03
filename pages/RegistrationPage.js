import { BasePage } from './BasePage.js';

class RegistrationPage extends BasePage {
    constructor(page) {
        super(page);

        this.firstNameInput = page.locator('input[name="firstname"]');
        this.lastNameInput = page.locator('input[name="lastname"]');
        this.emailInput = page.locator('input[name="email"]');
        this.usernameInput = page.locator('input[name="username"]');
        this.phoneInput = page.locator('input[name="phoneNumber"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerBtn = page.locator('button[type="submit"]');
        this.loginLink = page.locator('a:has-text("Войти")');

        this.errorRegistrationMessage = page.locator('[data-sonner-toast][data-type="error"]');

        this.requiredFirstNameMessage = page.getByText('Имя обязательно');
        this.requiredLastNameMessage = page.getByText('Фамилия обязательна');
        this.requiredEmailMessage = page.getByText('Email обязателен');
        this.requiredUsernameMessage = page.getByText('Username обязателен');
        this.requiredPhoneMessage = page.getByText('Телефон обязателен');
        this.requiredPasswordMessage = page.getByText('Пароль обязателен');
    }

    async gotoRegistrationPage() {
        await this.navigate('/register');
        await this.waitForElementVisible(this.firstNameInput);
        await this.waitForElementVisible(this.lastNameInput);
        await this.waitForElementVisible(this.emailInput);
        await this.waitForElementVisible(this.usernameInput);
        await this.waitForElementVisible(this.phoneInput);
        await this.waitForElementVisible(this.passwordInput);
        await this.waitForElementVisible(this.registerBtn);
        console.log(`Registration page loaded`);
    }

    async register(userData) {
        console.log(`Registering user with email: ${userData.email || 'no email'}`);

        if (userData.firstName) {
            await this.firstNameInput.fill(userData.firstName);
        }
        if (userData.lastName) {
            await this.lastNameInput.fill(userData.lastName);
        }
        if (userData.email) {
            await this.emailInput.fill(userData.email);
        }
        if (userData.username) {
            await this.usernameInput.fill(userData.username);
        }
        if (userData.phone) {
            await this.phoneInput.fill(userData.phone);
        }
        if (userData.password) {
            await this.passwordInput.fill(userData.password);
        }

        await this.registerBtn.click();
        console.log(`Register button clicked`);
    }

    async registerWithEnterKey(userData) {
        console.log(`Registering with Enter key`);

        if (userData.firstName) {
            await this.firstNameInput.fill(userData.firstName);
        }
        if (userData.lastName) {
            await this.lastNameInput.fill(userData.lastName);
        }
        if (userData.email) {
            await this.emailInput.fill(userData.email);
        }
        if (userData.username) {
            await this.usernameInput.fill(userData.username);
        }
        if (userData.phone) {
            await this.phoneInput.fill(userData.phone);
        }
        if (userData.password) {
            await this.passwordInput.fill(userData.password);
        }

        await this.passwordInput.press('Enter');
        console.log(`Enter key pressed`);
    }

    async gotoLoginPage() {
        console.log(`Click login link`);
        await this.loginLink.click();
        await this.page.waitForURL('**/login');
        console.log(`User is on login page`);
    }

    async getErrorRegistrationMessage() {
        await this.waitForElementVisible(this.errorRegistrationMessage);
        const message = await this.errorRegistrationMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isErrorRegistrationMessageVisible() {
        const visible = await this.errorRegistrationMessage.isVisible();
        console.log(`Error registration message visible: ${visible}`);
        return visible;
    }

    async getSuccessRegistrationMessage() {
        await this.waitForElementVisible(this.successRegistrationMessage);
        const message = await this.successRegistrationMessage.textContent();
        console.log(`Success: ${message}`);
        return message;
    }

    async isSuccessRegistrationMessageVisible() {
        const visible = await this.successRegistrationMessage.isVisible();
        console.log(`Success registration message visible: ${visible}`);
        return visible;
    }

    async getRequiredFirstNameMessage() {
        await this.waitForElementVisible(this.requiredFirstNameMessage);
        const message = await this.requiredFirstNameMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredFirstNameMessageVisible() {
        const visible = await this.requiredFirstNameMessage.isVisible();
        console.log(`Required first name message visible: ${visible}`);
        return visible;
    }

    async getRequiredLastNameMessage() {
        await this.waitForElementVisible(this.requiredLastNameMessage);
        const message = await this.requiredLastNameMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredLastNameMessageVisible() {
        const visible = await this.requiredLastNameMessage.isVisible();
        console.log(`Required last name message visible: ${visible}`);
        return visible;
    }

    async getRequiredEmailMessage() {
        await this.waitForElementVisible(this.requiredEmailMessage);
        const message = await this.requiredEmailMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredEmailMessageVisible() {
        const visible = await this.requiredEmailMessage.isVisible();
        console.log(`Required email message visible: ${visible}`);
        return visible;
    }

    async getRequiredUsernameMessage() {
        await this.waitForElementVisible(this.requiredUsernameMessage);
        const message = await this.requiredUsernameMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredUsernameMessageVisible() {
        const visible = await this.requiredUsernameMessage.isVisible();
        console.log(`Required username message visible: ${visible}`);
        return visible;
    }

    async getRequiredPhoneMessage() {
        await this.waitForElementVisible(this.requiredPhoneMessage);
        const message = await this.requiredPhoneMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredPhoneMessageVisible() {
        const visible = await this.requiredPhoneMessage.isVisible();
        console.log(`Required phone message visible: ${visible}`);
        return visible;
    }

    async getRequiredPasswordMessage() {
        await this.waitForElementVisible(this.requiredPasswordMessage);
        const message = await this.requiredPasswordMessage.textContent();
        console.log(`Error: ${message}`);
        return message;
    }

    async isRequiredPasswordMessageVisible() {
        const visible = await this.requiredPasswordMessage.isVisible();
        console.log(`Required password message visible: ${visible}`);
        return visible;
    }

    async clearAllFields() {
        console.log(`Clearing all registration fields`);
        await this.firstNameInput.clear();
        await this.lastNameInput.clear();
        await this.emailInput.clear();
        await this.usernameInput.clear();
        await this.phoneInput.clear();
        await this.passwordInput.clear();
    }
}

export { RegistrationPage };