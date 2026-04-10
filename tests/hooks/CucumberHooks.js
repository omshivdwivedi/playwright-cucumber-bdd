const{Before,After,BeforeAll,AfterAll,setDefaultTimeout} = require("@cucumber/cucumber")
const {chromium} = require('@playwright/test');

setDefaultTimeout(60 * 1000)
let browser; 

BeforeAll(async function () {
    
    browser = await chromium.launch({
        headless: false,
        args: ["--start-maximized"],
       // executablePath: "/opt/google/chrome/chrome"
       channel: 'chrome' 
    });
});

Before(async function () {
    
    this.context = await browser.newContext({ viewport: null });
    this.page = await this.context.newPage();
});

After(async function (scenario) {

    if(scenario.result?.status === 'FAILED')
    {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot,'image/png')
    }

    await this.context?.close();
   
});

AfterAll(async function () {
    await browser?.close();
});