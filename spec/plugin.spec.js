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

  it('should accept a custom button label', function () {
    var testLabel = '<span>Test label</span>';
    var plugin = new MediumEditorTable({
      buttonLabel: testLabel
    });
    var button = plugin.getButton();
    expect(button.innerHTML).toBe(testLabel);
  });
});
