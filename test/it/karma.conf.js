/**
 * Karma Configuration.
 */

const path = require('path');

module.exports = (config) => {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-babel-preprocessor'),
      require('../../dist/karma-json-preprocessor'),
    ],

    frameworks: [
      'jasmine',
    ],

    files: [
      path.join(__dirname, 'data.json'),
      path.join(__dirname, 'it-spec.js'),
    ],

    exclude: [
    ],

    proxies: {
    },

    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    // CLI --reporters progress
    reporters: [
      'progress',
      'kjhtml',
    ],

    // web server port
    // CLI --port 9876
    port: 9876,

    // cli runner port
    // CLI --runner-port 9100
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: [
      'PhantomJS',
    ],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 10000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: true,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    // reportSlowerThan: 500,

    preprocessors: {
      '**/*.json': ['json'],
      '**/*.js': ['babel'],
    },
  });
};
