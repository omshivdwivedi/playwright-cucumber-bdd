class DashboardPage {

    constructor(page) {
        this.page = page;
    }

    /********** Locators **********/

    get header_Dashboard() {
        return this.page.locator('//h6[normalize-space()="Dashboard"]');
    }

    get drp_usrDropdown() {
        return this.page.locator('.oxd-userdropdown-tab');
    }

    get lnk_Logout() {
        return this.page.locator('text=Logout');
    }

    /********** Action Methods **********/

    async validateHeader() {
        try {
            await this.header_Dashboard.waitFor({ state: 'visible', timeout: 30000 });
            return true;
        }
        catch(e){
            return false;
        }
    }

    async click_usrDropdown() {
        await this.drp_usrDropdown.click();
    }

    async click_LogoutLink() {
        await this.lnk_Logout.click();
    }
}

module.exports = { DashboardPage };