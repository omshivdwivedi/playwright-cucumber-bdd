const reporter = require("cucumber-html-reporter");
const fs = require("fs");
const path = require("path");
const os = require("os");
const PropertiesReader = require("properties-reader");


try {

  const properties = PropertiesReader("test.properties");
  const env = properties.get("env") || "LOCAL"; 
  const outputDirectory = properties.get("outputDirectory") || "out";
  
  const reportFilePath = path.join("cucumber-report", "cucumber_report.json");
  const baseOutputDir = path.join("cucumber-report", outputDirectory);

    const sharedOptions = {
    theme: "hierarchy",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    storeScreenshots: false,
    screenshotsDirectory: path.join("screenshots", ""), 
    ignoreBadJsonFile: true,
    columnLayout:1,
    metadata: {
      "App Version": "1.0.0",
      "Test Environment": env.toUpperCase(),
      Browser: "Chrome",
      Platform: os.type(),
    },
  };

  const reportData = fs.readFileSync(reportFilePath, "utf-8");
  const reportJson = JSON.parse(reportData);

  if (reportJson.length === 1 && reportJson[0].elements?.length === 1) {
    // Single Feature with Single Scenario
  }

else{
  let scenarioCounter = 1;

  reportJson.forEach((feature, featureIndex) => {
    const currentFeatureNum = featureIndex + 1;

    feature.elements.forEach((scenario) => {

      const scenarioOnly = [{ ...feature, elements: [scenario] }];

      const isPassed = scenario.steps.every((step) => step.result.status === "passed");
      const statusFolder = isPassed ? "passed" : "failed";
      
      const featureFolder = `feature_${currentFeatureNum}`;
      const jsonFileName = `temp-scenario-${scenarioCounter}.json`;
      const htmlFileName = `html-report-scenario-${scenarioCounter}.html`;

      const tempJsonPath = path.join(os.tmpdir(), jsonFileName);
      
      const outputHtmlPath = path.join(
        baseOutputDir,
        featureFolder,
        statusFolder,
        htmlFileName
      );

      fs.writeFileSync(tempJsonPath, JSON.stringify(scenarioOnly, null, 2));

      reporter.generate({
        ...sharedOptions,
        jsonFile: tempJsonPath,
        output: outputHtmlPath,
        launchReport: false,
      });

      if (fs.existsSync(tempJsonPath)) {
        fs.rmSync(tempJsonPath, { force: true });
      }

      scenarioCounter++;
    });
  });

}
 
  const finalReportPath = path.join(baseOutputDir, "cucumber-html-report.html");
  
  reporter.generate({
    ...sharedOptions,
    jsonFile: reportFilePath,
    output: finalReportPath,
    launchReport: true, 
  });

} catch (error) {
    console.log(error);
  process.exit(1);
}