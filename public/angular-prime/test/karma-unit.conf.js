module.exports = function(config) {
  config.set({
    files : [
      '../lib/angular-1.2.0-rc.2/angular.js',
      '../lib/angular-1.2.0-rc.2/angular-route.js',
      '../lib/angular-1.2.0-rc.2/angular-mocks.js',
      '../lib/angular-1.2.0-rc.2/angular-resource.js',
      'scripts/**/*.js',
      '../test/unit/**/*.js'
    ],
    basePath: '../app',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
