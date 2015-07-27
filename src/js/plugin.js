var MediumEditorTable = MediumEditor.extensions.form.extend({
  name: 'table',

  aria: 'create table',
  action: 'table',
  contentDefault: 'TBL',
  contentFA: '<i class="fa fa-table"></i>',

  handleClick: function () {
    this[this.isActive() === true ? 'hide' : 'show']();
  },

  hide: function () {
    this.setInactive();
    this.builder.hide();
  },

  show: function () {
    this.setActive();
    this.builder.show(this.button.offsetLeft);
    var elements = this.document.getElementsByClassName('medium-editor-table-builder-grid');
    for (var i = 0; i < elements.length; i++) {
      // TODO: what is 16 and what is 2?
      elements[i].style.height = (16 * this.rows + 2) + 'px';
      elements[i].style.width = (16 * this.columns + 2) + 'px';
    }
  },

  getForm: function () {
    this.builder = new Builder({
      onClick: function (rows, columns) {
        this.table.insert(rows, columns);
        this.hide();
      }.bind(this),
      ownerDocument: this.document,
      rows: this.rows || 10,
      columns: this.columns || 10
    });

    this.table = new Table(this.base);

    return this.builder.getElement();
  }
});
