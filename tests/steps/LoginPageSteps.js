const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DataReader = require('../utils/DataReader');

let datamap;
const TestDataPath = process.cwd() + "/tests/testData/";

Given('user navigates to login page', async function () {
    await this.loginPage.gotoLoginPage();
    await this.attach(await this.page.screenshot(), 'image/png');
});

When('user fill login details and click submit button', async function () {
    await this.loginPage.enterUsername();
    await this.loginPage.enterPassword();

    await this.attach(await this.page.screenshot(), 'image/png');

    await this.loginPage.clickLoginButton();
});

When('user enter email and password with excel row {string}', async function (rows) {
    datamap = await DataReader.data(
        TestDataPath + "Invalid_Login_Test_Data.xlsx",
        "Sheet1"
    );

    const index = parseInt(rows) - 1;

    const username = datamap[index]["Username"];
    const password = datamap[index]["Password"];

    await this.loginPage.enterUsername(username);
    await this.loginPage.enterPassword(password);

    await this.attach(await this.page.screenshot(), 'image/png');
});

When('user click on login button', async function () {
    await this.loginPage.clickLoginButton();
});

Then('validate the Error Message', async function () {
    const isVisible = await this.loginPage.validateInvalidCredentialsAlrt();
    await this.attach(await this.page.screenshot(), 'image/png');
    expect(isVisible).toBeTruthy();
});