describe('Core TestCase', function () {
  it('should accept rows and columns as options', function () {
    var plugin = new MediumEditorTable({
      columns: 13,
      rows: 37
    });
    expect(plugin.options.columns).toBe(13);
    expect(plugin.options.rows).toBe(37);
  });

  it('should have a default of 10 columns/rows', function () {
    var plugin = new MediumEditorTable();
    expect(plugin.options.columns).toBe(10);
    expect(plugin.options.rows).toBe(10);
  });
});
