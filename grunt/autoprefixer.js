var autoprefixerBrowsers = ['last 3 versions', 'ie >= 9'];

module.exports = {
  main: {
    expand: true,
    cwd: 'dist/css/',
    src: ['*.css', '!*.min.css'],
    dest: 'dist/css/',
    browsers: autoprefixerBrowsers
  },
  themes: {
    expand: true,
    cwd: 'demo/css/',
    src: ['*.css', '!*.min.css'],
    dest: 'demo/css/',
    browsers: autoprefixerBrowsers
  }
};
