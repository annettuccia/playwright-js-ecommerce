import { BasePage } from './BasePage.js'
import { URLS } from '../config/urls.js';

class UserHeader extends BasePage {
    constructor(page) {
        super(page);

        this.ordersBtn = page.locator(`a[href="${URLS.orders}"]`);
        this.cartIconBtn = page.locator(`a[href="${URLS.cart}"]`);

        this.userMenuBtn = page.locator('button[aria-haspopup="menu"]');
        this.userUsername = page.locator('.flex-col.items-start.text-left');

        this.userMenu = page.locator('[role="menu"]');
        this.userMenuFullName = page.locator('p.text-sm.font-medium.leading-none');
        this.userMenuEmail = page.locator('p.text-xs.leading-none.text-muted-foreground');
        this.userMenuProfileBtn = page.locator('a:has-text("Профиль")');
        this.userMenuOrdersBtn = page.locator('a:has-text("История заказов")');
        this.userMenuLogoutBtn = page.locator('[role="menuitem"]:has-text("Выйти")');
    }

    async IsCartIconBtnVisible() {
        const visible = await this.cartIconBtn.isVisible();
        console.log(`Cart icon button visible: ${visible}`);
        return visible;
    }

    async clickCartIconHeaderBtn() {
        console.log('Clicking cart header icon btn')
        await this.cartIconBtn.click();
        await this.page.waitForURL(`**${URLS.cart}`);
        console.log('Cart btn in header is clicked')
    }

    async isOrderBtnVisible() {
        const visible = await this.ordersBtn.isVisible();
        console.log(`Orders button visible: ${visible}`);
        return visible;
    }

    async clickOrdersHeaderBtn() {
        console.log('Clicking orders header btn');
        await this.ordersBtn.click();
        await this.page.waitForURL(`**${URLS.orders}`);
        console.log('Orders btn in header is clicked');
    }

    async openUserMenu() {
        console.log('Opening user menu');
        await this.userMenuBtn.click();
        await this.waitForElementVisible(this.userMenu);
        console.log('User menu is opened');
    }

    async getUsername() {
        const name = await this.userUsername.textContent();
        console.log(`Username in header: ${name}`);
        return name;
    }

    async getUserMenuItems() {
        await this.openUserMenu();

        const userFullName = await this.userMenuFullName.textContent();
        const email = await this.userMenuEmail.textContent();
        const profileText = await this.userMenuProfileBtn.textContent();
        const ordersText = await this.userMenuOrdersBtn.textContent();
        const logoutText = await this.userMenuLogoutBtn.textContent();

        console.log(`User email: ${email}`);
        console.log(`User full name in menu: ${userFullName}`);
        console.log(`User menu items: ${profileText}, ${ordersText}, ${logoutText}`);

        return { userFullName, email, profileText, ordersText, logoutText };
    }

    async clickProfile() {
        await this.openUserMenu();

        console.log('Clicking profile btn');
        await this.userMenuProfileBtn.click();
        await this.page.waitForURL(`**${URLS.profile}`);
        console.log('Profile btn is clicked');
    }

    async clickLogout() {
        await this.openUserMenu();
        console.log('Clickeing logout btn');
        await this.userMenuLogoutBtn.click();
        await this.page.waitForURL(`**${URLS.login}`);
        console.log('Logout btn is clicked. User logged out successfully');
    }
}

export { UserHeader };