function MediumEditorTable (options) {
  this.options = extend(options, {
    columns: 10,
    rows: 10
  });
  this.parent = true;
  this.hasForm = true;
  this.isFormVisible = false;
  this.createButton();
}

MediumEditorTable.prototype = {
  createButton: function () {
    this._createButtonElement();
    this._bindButtonClick();
  },

  isDisplayed: function () {
    return this.isFormVisible;
  },

  getForm: function() {
    if (!this.builder) {
      this.builder = new Builder({
        onClick: function (rows, columns) {
          this.table.insert(rows, columns);
          this.hideForm();
        }.bind(this),
        ownerDocument: this.base.options.ownerDocument,
        rows: this.options.rows,
        columns: this.options.columns
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
    this.hideForm();
  },

  hideForm: function () {
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
      // TODO: what is 16 and what is 2?
      elements[i].style.height = (16 * this.options.rows + 2) + 'px';
      elements[i].style.width = (16 * this.options.columns + 2) + 'px';
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
      this[this.isFormVisible === true ? 'hideForm' : 'show']();
    }.bind(this));
  }
};
