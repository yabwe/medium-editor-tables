module.exports = {
  options: {
    shorthandCompacting: false,
    roundingPrecision: -1
  },
  target: {
    files: {
      'dist/css/<%= package.name %>.min.css': ['dist/css/<%= package.name %>.css']
    }
  }
};
