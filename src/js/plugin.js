function MediumEditorTable () {
  this.parent = true;
  this.hasForm = true;
  this.showGrid = false;

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
        onClick: function (cols, rows) {
          this._insertTable(cols, rows);
        }.bind(this),
        ownerDocument: this.base.options.ownerDocument
      });
      this._bindTabBehavior();
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
    this.showGrid = false;
    this.builder.hide();
    this.button.classList.remove('medium-editor-button-active');
  },

  show: function () {
    this.showGrid = true;
    this.builder.show(this.button.offsetLeft);
    this.button.classList.add('medium-editor-button-active');
  },

  _createButtonElement: function () {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerHTML = 'tbl';
  },

  _bindButtonClick: function () {
    this.button.addEventListener('click', function (e) {
      e.preventDefault();
      this[this.showGrid === true ? 'hide' : 'show']();
    }.bind(this));
  },

  _insertTable: function (cols, rows) {
    var html = '';
    var x;
    var y;

    for (y = 0; y <= rows; y++) {
      html += '<tr>';
      for (x = 0; x <= cols; x++) {
        html += '<td><br /></td>';
      }
      html += '</tr>';
    }

    this.base.insertHTML(
      '<table class="medium-editor-table" id="medium-editor-table">' +
      '<tbody>' +
      html +
      '</tbody>' +
      '</table>'
    );

    var table = this.base.options.ownerDocument
                                 .getElementById('medium-editor-table');
    table.removeAttribute('id');
    placeCaretAtNode(table.querySelector('td'), true);
  },

  // TODO: break method
  _bindTabBehavior: function () {
    var self = this;

    [].forEach.call(this.base.elements, function (el) {
      el.addEventListener('keydown', function (e) {
        var el = getSelectionStart(self.base.options.ownerDocument),
            row = row,
            table = table;

        if (e.which === 9 && isInsideTable(el)) {
          e.preventDefault();
          e.stopPropagation();
          el = getParentOf(el, 'td');
          row = getParentOf(el, 'tr');
          table = getParentOf(el, 'table');
          if (e.shiftKey) {
            placeCaretAtNode(
              el.previousSibling || getPreviousRowLastCell(row),
              true
            );
          } else {
            if (isLastCell(el, row, table)) {
              self._insertRow(
                getParentOf(el, 'tbody'),
                row.cells.length
              );
            }
            placeCaretAtNode(el);
          }
        }
      });
    });
  },

  _insertRow: function (tbody, cols) {
    var tr = document.createElement('tr'),
        html = '',
        i;
    for (i = 0; i < cols; i += 1) {
      html += '<td><br /></td>';
    }
    tr.innerHTML = html;
    tbody.appendChild(tr);
  }
};
