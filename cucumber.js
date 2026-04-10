module.exports = {
  default: {
    require: [
      'tests/base/CustomWorld.js',
      'tests/hooks/CucumberHooks.js',
      'tests/steps/*.js'
    ],
    paths: [
      'tests/features/**/*.feature'
    ],
    format: [
      "progress",
      "json:cucumber-report/cucumber_report.json"
    ]
  }
};

/*
module.exports = {
  default: `
   --require tests/base/CustomWorld.js
   --require tests/steps/*.js
   --publish-quiet
  `
};

"test:custom": "cucumber-js --require tests/hooks/CucumberHooks.js \"tests/features/*.feature\" --tags @Test -f json:cucumber-report/cucumber_report.json && node CucumberReporter.js"
*/
