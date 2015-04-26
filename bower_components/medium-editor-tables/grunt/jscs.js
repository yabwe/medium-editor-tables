module.exports = {
  src: jsSourceFiles.concat(['Gruntfile.js', 'grunt/*.js', 'spec/*.js']),
  options: {
    config: '.jscsrc'
  }
};
