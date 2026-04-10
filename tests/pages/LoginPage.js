class LoginPage {
    
    constructor(page) {
        this.page = page;
        //this.txtUsername = page.locator("[name="username"]");
    }

    /********** Locators **********/

    get txtUsername() { 
        return this.page.locator('input[name="username"]'); 
    }

    get txtPassword() { 
        return this.page.locator('input[name="password"]'); 
    }

    get btnSubmit() { 
        return this.page.locator('button[type="submit"]'); 
    }

    get alrtInvalidCredentials() { 
        return this.page.locator('div[role="alert"]'); 
    }

     /********** Action Methods **********/

    async gotoLoginPage() {
        await this.page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
        await this.btnSubmit.waitFor({ state: 'visible' });
    }

    async login(username = "Admin", password = "admin123") {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

 
    async enterUsername(username = "Admin") {
        await this.txtUsername.fill(username);
    }

    async enterPassword(password = "admin123") {
        await this.txtPassword.fill(password);
    }

    async clickLoginButton() {
        await this.btnSubmit.click();
    }

    async validateInvalidCredentialsAlrt() {
        await this.alrtInvalidCredentials.waitFor({ state: 'visible' });
        return await this.alrtInvalidCredentials.isVisible();
    }
}

module.exports = { LoginPage };