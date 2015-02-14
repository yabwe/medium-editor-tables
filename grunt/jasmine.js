module.exports = {
  suite: {
    src: 'src/js/**/*.js',
    options: {
      specs: 'spec/*.spec.js',
      helpers: 'spec/helpers/*.js',
      styles: 'dist/css/*.css',
      junit: {
        path: "reports/jasmine/",
        consolidate: true
      },
      keepRunner: true,
      template: require('grunt-template-jasmine-istanbul'),
      templateOptions: {
        coverage: 'reports/jasmine/coverage.json',
        report: 'coverage'
      },
      summary: true
    }
  }
};
