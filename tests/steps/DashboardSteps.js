const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('user land on Dashboard page', async function () {
   
    const isVisible = await this.dashboardPage.validateHeader();
    await expect(isVisible).toBeTruthy();

    this.attach("Dashboard Page Displayed");
});

When('user click on user dropdown', async function () {
    await this.dashboardPage.click_usrDropdown();
    await this.attach(await this.page.screenshot(), 'image/png');
});

Then('user click on logout link', async function () {
    await this.dashboardPage.click_LogoutLink();
});