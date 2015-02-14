module.exports = {
  beforeConcat: ['src/js/plugin.js'],
  afterConcat: ['dist/js/<%= package.name %>.js']
};
