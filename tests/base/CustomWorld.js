const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

class CustomWorld extends World {
    constructor(options) {
        super(options);
    }

    ensurePageInitialized() {
        if (!this.page) {
            throw new Error("Playwright page is not initialized yet");
        }
    }

    get loginPage() {
        this.ensurePageInitialized();

        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }
        return this._loginPage;
    }

    get dashboardPage() {
        this.ensurePageInitialized();

        if (!this._dashboardPage) {
            this._dashboardPage = new DashboardPage(this.page);
        }
        return this._dashboardPage;
    }
}

setWorldConstructor(CustomWorld);