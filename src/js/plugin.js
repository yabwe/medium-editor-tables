function MediumEditorTable (rows, columns) {
  this.parent = true;
  this.hasForm = true;
  this.isFormVisible = false;
  this.rows = rows || 10;
  this.columns = columns || 10;

  this.createButton();
}

MediumEditorTable.prototype = {
  createButton: function () {
    this._createButtonElement();
    this._bindButtonClick();
  },

  getForm: function() {
    if (!this.builder) {
      this.builder = new Builder({
        onClick: function (rows, cols) {
          this.table.insert(rows, cols);
          this.hide();
        }.bind(this),
        ownerDocument: this.base.options.ownerDocument,
        rows: this.rows,
        columns: this.columns
      });
      this.table = new Table(this.base);
    }

    return this.builder.getElement();
  },

  getButton: function () {
    if (this.base.options.buttonLabels === 'fontawesome') {
      this.button.innerHTML = '<i class="fa fa-table"></i>';
    }
    return this.button;
  },

  onHide: function () {
    this.hide();
  },

  hide: function () {
    this.isFormVisible = false;
    this.builder.hide();
    this.button.classList.remove('medium-editor-button-active');
  },

  show: function () {
    this.isFormVisible = true;
    this.builder.show(this.button.offsetLeft);
    this.button.classList.add('medium-editor-button-active');
    var elements = document.getElementsByClassName('medium-editor-table-builder-grid');
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.height = (16 * this.rows + 2) + 'px';
      elements[i].style.width = (16 * this.columns + 2) + 'px';
    }
  },

  _createButtonElement: function () {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerHTML = 'tbl';
  },

  _bindButtonClick: function () {
    this.button.addEventListener('click', function (e) {
      e.preventDefault();
      this[this.isFormVisible === true ? 'hide' : 'show']();
    }.bind(this));
  }
};
