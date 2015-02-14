module.exports = {
  dist: {
    files: {
      'dist/css/<%= package.name %>.css': 'src/sass/<%= package.name %>.scss',
      'demo/css/demo.css': 'demo/sass/demo.scss'
    }
  }
};
