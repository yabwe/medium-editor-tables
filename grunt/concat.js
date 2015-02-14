module.exports = {
  dist: {
    src: [
      'src/wrappers/start.js',
      'src/js/util.js',
      'src/js/builder.js',
      'src/js/core.js',
      'src/wrappers/end.js'
    ],
    dest: 'dist/js/<%= package.name %>.js',
  }
};
