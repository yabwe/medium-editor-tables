module.exports = {
  dist: {
    src: ['src/wrappers/start.js']
           .concat(jsSourceFiles)
           .concat(['src/wrappers/end.js']),
    dest: 'dist/js/<%= package.name %>.js',
  }
};
