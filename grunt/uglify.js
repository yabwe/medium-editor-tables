module.exports = {
  dist: {
    files: {
      'dist/js/<%= package.name %>.min.js': ['dist/js/<%= package.name %>.js']
    }
  }
};
