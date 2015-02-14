function Table(editor) {
  return this.init(editor);
}

Table.prototype = {
  init: function (editor) {
    this._editor = editor;
    this._bindTabBehavior();
  },

  // TODO: break method
  insert: function (cols, rows) {
    var html = '';
    var x;
    var y;
    var text = getSelectionText();

    for (y = 0; y <= rows; y++) {
      html += '<tr>';
      for (x = 0; x <= cols; x++) {
        if (y === 0 && x === 0) {
          html += '<td>' + text + '</td>';
        } else {
          html += '<td><br /></td>';
        }
      }
      html += '</tr>';
    }

    this._editor.insertHTML(
      '<table class="medium-editor-table" id="medium-editor-table">' +
      '<tbody>' +
      html +
      '</tbody>' +
      '</table>'
    );

    var table = this._editor.options.ownerDocument
                                 .getElementById('medium-editor-table');
    table.removeAttribute('id');
    placeCaretAtNode(table.querySelector('td'), true);
  },

  // TODO: break method
  _bindTabBehavior: function () {
    var self = this;

    [].forEach.call(this._editor.elements, function (el) {
      el.addEventListener('keydown', function (e) {
        var el = getSelectionStart(self._editor.options.ownerDocument),
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
