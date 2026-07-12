const{Before,After,BeforeAll,AfterAll,setDefaultTimeout} = require("@cucumber/cucumber")
const {chromium, firefox, webkit} = require('@playwright/test');

const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("test.properties");

const fs = require("fs");
const path = require("path");

const isHeadless =   properties.get("headless") === true;
const recordVideo = properties.get("recordVideo") === true;
const enableTrace = properties.get("enableTrace") === true;
const outputDir = path.join("cucumber-report", properties.get("outputDirectory"));

setDefaultTimeout(60 * 1000)
let browser; 

BeforeAll(async function () {
    const browserName = properties.get("browser") || 'chromium';

    switch (browserName.toLowerCase()) {
        case 'chrome':
            browser = await chromium.launch({
                headless: isHeadless,
                channel: 'chrome',
                args: ['--start-maximized']
            });
            break;

        case 'edge':
            browser = await chromium.launch({
                headless: isHeadless,
                channel: 'msedge',
                args: ['--start-maximized']
            });
            break;

        case 'firefox':
            browser = await firefox.launch({
                headless: isHeadless
            });
            break;

        case 'webkit':
            browser = await webkit.launch({
                headless: isHeadless
            });
            break;

        case 'chromium':
        default:
            browser = await chromium.launch({
                headless: isHeadless,
                args: ['--start-maximized']
            });
            break;
    }
});

Before(async function (scenario) {

    const scenarioName = scenario.pickle.name.replace(/[^\w]/g, "_");

    const contextOptions = {
        viewport: null,
    };

    if(recordVideo) {
        contextOptions.recordVideo = {
            dir: outputDir,
            size: {
              width: 1280,
              height: 720
            },
          }   
        };

    this.context = await browser.newContext(contextOptions);

    if(enableTrace)
    {
        await this.context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true
        })
    }
    this.page = await this.context.newPage();
     this.scenarioName = scenarioName;
});

After(async function (scenario) {

    const video = this.page?.video();

    if(scenario.result?.status === 'FAILED')
    {

        const screenshot = await this.page.screenshot();
        await this.attach(screenshot,'image/png')

        if(enableTrace){
            const tracePath = path.join(outputDir,"traces",`${this.scenarioName}.zip`);
            fs.mkdirSync(path.dirname(tracePath), { recursive: true });
            await this.context.tracing.stop({path: tracePath,});
        }

        await this.context?.close();

        if(recordVideo)
        {
            const oldPath = await video.path();
            const newPath = path.join(outputDir,"video",`${this.scenarioName}.webm`);
            fs.mkdirSync(path.dirname(newPath), { recursive: true });
            await fs.promises.rename(oldPath, newPath);
        }
    }

    else {

        if(enableTrace) await this.context.tracing.stop();
        await this.context?.close();

        if(recordVideo)
        {
            const videoPath = await video.path();
            await fs.promises.unlink(videoPath);
        }


    }
   
});

AfterAll(async function () {
    await browser?.close();
});