global.jsSourceFiles = [
  'src/js/util.js',
  'src/js/grid.js',
  'src/js/builder.js',
  'src/js/table.js',
  'src/js/plugin.js'
];

module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    loadGruntTasks: { //can optionally pass options to load-grunt-tasks.  If you set to false, it will disable auto loading tasks.
      pattern: [
        'grunt-*',
        '!grunt-template-jasmine-istanbul'
      ]
    }
  });
  require('time-grunt')(grunt);
};
