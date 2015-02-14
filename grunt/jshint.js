module.exports = {
  beforeConcat: ['src/js/core.js'],
  afterConcat: ['dist/js/<%= package.name %>.js']
};
