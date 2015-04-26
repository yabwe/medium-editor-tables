(function (root, factory) {
  'use strict';
  if (typeof module === 'object') {
    module.exports = factory;
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.MediumEditorTable = factory;
  }
}(this, function () {

  'use strict';

function extend(dest, source) {
  var prop;
  dest = dest || {};
  for (prop in source) {
    if (source.hasOwnProperty(prop) && !dest.hasOwnProperty(prop)) {
      dest[prop] = source[prop];
    }
  }
  return dest;
}

function getSelectionText(doc) {
  if (doc.getSelection) {
    return doc.getSelection().toString();
  }
  if (doc.selection && doc.selection.type !== 'Control') {
    return doc.selection.createRange().text;
  }
  return '';
}

function getSelectionStart(doc) {
  var node = doc.getSelection().anchorNode,
      startNode = (node && node.nodeType === 3 ? node.parentNode : node);
  return startNode;
}

function placeCaretAtNode(doc, node, before) {
  if (doc.getSelection !== undefined && node) {
    var range = doc.createRange();
    var selection = doc.getSelection();

    if (before) {
      range.setStartBefore(node);
    } else {
      range.setStartAfter(node);
    }

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function isInsideElementOfTag(node, tag) {
  if (!node) {
    return false;
  }

  var parentNode = node.parentNode,
      tagName = parentNode.tagName.toLowerCase();

  while (tagName !== 'body') {
    if (tagName === tag) {
      return true;
    }
    parentNode = parentNode.parentNode;

    if (parentNode && parentNode.tagName) {
      tagName = parentNode.tagName.toLowerCase();
    } else {
      return false;
    }
  }

  return false;
}

function getParentOf(el, tagTarget) {
  var tagName = el && el.tagName ? el.tagName.toLowerCase() : false;
  if (!tagName) {
    return false;
  }
  while (tagName && tagName !== 'body') {
    if (tagName === tagTarget) {
      return el;
    }
    el = el.parentNode;
    tagName = el && el.tagName ? el.tagName.toLowerCase() : false;
  }
}

function Grid (el, callback, rows, columns) {
  return this.init(el, callback, rows, columns);
}

Grid.prototype = {
  init: function (el, callback, rows, columns) {
    this._root = el;
    this._callback = callback;
    this.rows = rows;
    this.columns = columns;
    return this._render();
  },

  setCurrentCell: function (cell) {
    this._currentCell = cell;
  },

  markCells: function () {
    [].forEach.call(this._cellsElements, function(el) {
      var cell = {
        column: parseInt(el.dataset.column, 10),
        row: parseInt(el.dataset.row, 10)
      };
      var active = this._currentCell &&
                   cell.row <= this._currentCell.row  &&
                   cell.column <= this._currentCell.column;
      if (active === true) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }.bind(this));
  },

  _generateCells: function () {
    this._cells = [];

    for (var i = 0; i < this.rows * this.columns; i++) {
      var column = i % this.columns;
      var row = Math.floor(i / this.rows);

      this._cells.push({
        column: column,
        row: row,
        active: false
      });
    }
  },

  _html: function () {
    var html = '<div class="medium-editor-table-builder-grid clearfix">';
    html += this._cellsHTML();
    html += '</div>';
    return html;
  },

  _cellsHTML: function () {
    var html = '';
    this._generateCells();
    this._cells.map(function(cell) {
      html += '<a href="#" class="medium-editor-table-builder-cell' +
              (cell.active === true ? ' active' : '') +
              '" ' + 'data-row="' + cell.row +
              '" data-column="' + cell.column + '">';
      html += '</a>';
    });
    return html;
  },

  _render: function () {
    this._root.innerHTML = this._html();
    this._cellsElements = this._root.querySelectorAll('a');
    this._bindEvents();
  },

  _bindEvents: function () {
    [].forEach.call(this._cellsElements, function(el) {
      this._onMouseEnter(el);
      this._onClick(el);
    }.bind(this));
  },

  _onMouseEnter: function (el) {
    var self = this;
    var timer;

    el.addEventListener('mouseenter', function () {
      clearTimeout(timer);

      var dataset = this.dataset;

      timer = setTimeout(function () {
        self._currentCell = {
          column: parseInt(dataset.column, 10),
          row: parseInt(dataset.row, 10)
        };
        self.markCells();
      }, 50);
    });
  },

  _onClick: function (el) {
    var self = this;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      self._callback(this.dataset.row, this.dataset.column);
    });
  }
};

function Builder(options) {
  return this.init(options);
}

Builder.prototype = {
  init: function (options) {
    this.options = options;
    this._doc = options.ownerDocument || document;
    this._root = this._doc.createElement('div');
    this._root.className = 'medium-editor-table-builder';
    this.grid = new Grid(
      this._root,
      this.options.onClick,
      this.options.rows,
      this.options.columns
    );
  },

  getElement: function () {
    return this._root;
  },

  hide: function () {
    this._root.style.display = '';
    this.grid.setCurrentCell({ column: -1, row: -1 });
    this.grid.markCells();
  },

  show: function (left) {
    this._root.style.display = 'block';
    this._root.style.left = left + 'px';
  }
};

function Table(editor) {
  return this.init(editor);
}

var TAB_KEY_CODE = 9;

Table.prototype = {
  init: function (editor) {
    this._editor = editor;
    this._doc = this._editor.options.ownerDocument;
    this._bindTabBehavior();
  },

  insert: function (rows, cols) {
    var html = this._html(rows, cols);

    this._editor.pasteHTML(
      '<table class="medium-editor-table" id="medium-editor-table"' +
      ' width="100%">' +
      '<tbody>' +
      html +
      '</tbody>' +
      '</table>', {
        cleanAttrs: [],
        cleanTags: []
      }
    );

    var table = this._doc.getElementById('medium-editor-table');
    table.removeAttribute('id');
    placeCaretAtNode(this._doc, table.querySelector('td'), true);
  },

  _html: function (rows, cols) {
    var html = '';
    var x, y;
    var text = getSelectionText(this._doc);

    for (x = 0; x <= rows; x++) {
      html += '<tr>';
      for (y = 0; y <= cols; y++) {
        html += '<td>' + (x === 0 && y === 0 ? text : '<br />') + '</td>';
      }
      html += '</tr>';
    }
    return html;
  },

  _bindTabBehavior: function () {
    var self = this;
    [].forEach.call(this._editor.elements, function (el) {
      el.addEventListener('keydown', function (e) {
        self._onKeyDown(e);
      });
    });
  },

  _onKeyDown: function (e) {
    var el = getSelectionStart(this._doc),
        table;

    if (e.which === TAB_KEY_CODE && isInsideElementOfTag(el, 'table')) {
      e.preventDefault();
      e.stopPropagation();
      table = this._getTableElements(el);
      if (e.shiftKey) {
        this._tabBackwards(el.previousSibling, table.row);
      } else {
        if (this._isLastCell(el, table.row, table.root)) {
          this._insertRow(getParentOf(el, 'tbody'), table.row.cells.length);
        }
        placeCaretAtNode(this._doc, el);
      }
    }
  },

  _getTableElements: function (el) {
    return {
      cell: getParentOf(el, 'td'),
      row: getParentOf(el, 'tr'),
      root: getParentOf(el, 'table')
    };
  },

  _tabBackwards: function (el, row) {
    el = el || this._getPreviousRowLastCell(row);
    placeCaretAtNode(this._doc, el, true);
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
  },

  _isLastCell: function (el, row, table) {
    return (
      --row.cells.length == el.cellIndex &&
      --table.rows.length == row.rowIndex
    );
  },

  _getPreviousRowLastCell: function (row) {
    row = row.previousSibling;
    if (row) {
      return row.cells[row.cells.length - 1];
    }
  }
};

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

  return MediumEditorTable;
}()));
