module.exports = {
  scripts: {
    files: ['src/js/**/*.js', 'spec/*.js', 'Gruntfile.js', 'grunt/*.js'],
    tasks: ['js'],
    options: {
      debounceDelay: 250
    }
  },
  styles: {
    files: ['src/sass/**/*.scss', 'demo/sass/**/*.scss'],
    tasks: ['css'],
    options: {
      debounceDelay: 250
    }
  }
};
