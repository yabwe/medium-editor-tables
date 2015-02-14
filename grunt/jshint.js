module.exports = {
  beforeConcat: jsSourceFiles,
  afterConcat: ['dist/js/<%= package.name %>.js']
};
