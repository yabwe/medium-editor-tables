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

function getSelectionStart (doc) {
  var node = doc.getSelection().anchorNode,
      startNode = (node && node.nodeType === 3 ? node.parentNode : node);
  return startNode;
}

function placeCaretAtNode(node, before) {
  if (window.getSelection !== undefined && node) {
    var range = document.createRange();
    var selection = window.getSelection();

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

function isInsideTable(node) {
  if (!node) {
    return false;
  }

  var parentNode = node.parentNode,
      tagName = parentNode.tagName.toLowerCase();

  while (tagName !== 'body') {
    if (tagName === 'table') {
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

function isLastCell(el, row, table) {
  return (
    --row.cells.length == el.cellIndex &&
    --table.rows.length == row.rowIndex
  );
}

function getPreviousRowLastCell(row) {
  row = row.previousSibling;
  if (row) {
    return row.cells[row.cells.length - 1];
  }
}

function Builder(options) {
  return this.init(options);
}

Builder.prototype = {
  init: function (options) {
    this.options = options;
    this._doc = options.ownerDocument || document;
    this._root = this._doc.createElement('div');
    this._root.className = 'medium-editor-table-builder';
    this._renderGrid();
    this._bindEvents();
  },

  getElement: function () {
    return this._root;
  },

  hide: function () {
    this._root.style.display = '';
    this.setCurrentCell({ col: -1, row: -1 });
    this._markCells();
  },

  show: function (left) {
    this._root.style.display = 'block';
    this._root.style.left = left + 'px';
  },

  setCurrentCell: function (cell) {
    this._currentCell = cell;
  },

  _markCells: function () {
    [].forEach.call(this._cellsElements, function(el) {
      var cell = {
        col: parseInt(el.dataset.col, 10),
        row: parseInt(el.dataset.row, 10)
      };
      var active = this._currentCell &&
                   cell.row <= this._currentCell.row  &&
                   cell.col <= this._currentCell.col;
      if (active === true) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }.bind(this));
  },

  _generateCells: function () {
    this._cells = [];

    for (var i = 0; i < 100; i++) {
      var col = i % 10;
      var row = Math.floor(i/10);

      this._cells.push({
        col: col,
        row: row,
        active: false
      });
    }
  },

  _getGridHTML: function () {
    var html = '<div class="medium-editor-table-builder-grid clearfix">';
    html += this._getCellsHTML();
    html += '</div>';
    return html;
  },

  _getCellsHTML: function () {
    var html = '';
    this._generateCells();
    this._cells.map(function(cell) {
      html += '<a href="#" class="medium-editor-table-builder-cell' +
              (cell.active === true ? ' active' : '') +
              '" ' + 'data-row="' + cell.row +
              '" data-col="' + cell.col + '">';
      html += '</a>';
    });
    return html;
  },

  _renderGrid: function () {
    this._root.innerHTML = this._getGridHTML();
    this._cellsElements = this._root.querySelectorAll('a');
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
          col: parseInt(dataset.col, 10),
          row: parseInt(dataset.row, 10)
        };
        self._markCells();
      }, 10);
    });
  },

  _onClick: function (el) {
    var self = this;
    el.addEventListener('click', function (e) {
      e.preventDefault();
      self.options.onClick(this.dataset.col, this.dataset.row);
    });
  }
};

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

  return MediumEditorTable;
}()));
