// Karma configuration
// Generated on Sat Aug 01 2015 10:20:15 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      {
        pattern: 'src/**/*.js',
        watched: true,
        included: false,
        served: false
      },
      {
        pattern: 'test/**/*-spec.js'
      }
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: ['babelify']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['mobile', 'phablet', 'tablet', 'desktop', 'desktopXL'],

    customLaunchers: {
      mobile: {
        base: 'Chrome',
        flags: ['--window-size=400,600']
      },
      phablet: {
        base: 'Chrome',
        flags: ['--window-size=550,600']
      },
      tablet: {
        base: 'Chrome',
        flags: ['--window-size=768,600']
      },
      desktop: {
        base: 'Chrome',
        flags: ['--window-size=992,600']
      },
      desktopXL: {
        base: 'Chrome',
        flags: ['--window-size=1201,600']
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
