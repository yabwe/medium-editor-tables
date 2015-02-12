'use strict';

function getSelectionStart() {
  var node = self.base.options.ownerDocument.getSelection().anchorNode,
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
};

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
  return(
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

function MediumEditorTable() {
  this.parent = true;
  this.hasForm = true;
  this.showGrid = false;

  this.createButton();
}

MediumEditorTable.prototype.createButton = function () {
  this.button = document.createElement('button');
  this.button.className = 'medium-editor-action';
  this.button.innerHTML = '<i class="table"></i>';
  this.button.addEventListener('click', function (e) {
    e.preventDefault();
    this.clickHandler();
  }.bind(this));
};

MediumEditorTable.prototype.clickHandler = function () {
  if (this.showGrid === true) {
    this.hide();
  } else {
    this.show();
  }
};

MediumEditorTable.prototype.hide = function () {
  this.showGrid = false;
  this.tableBuilderElement.style.display = '';
  this.button.classList.remove('medium-editor-button-active');
};

MediumEditorTable.prototype.show = function () {
  this.showGrid = true;
  this.tableBuilderElement.style.display = 'block';
  this.tableBuilderElement.style.left = this.button.offsetLeft + 'px';
  this.button.classList.add('medium-editor-button-active');
};

MediumEditorTable.prototype.getForm = function() {
  if (!this.tableBuilderElement) {
    this.createTableBuilder();
  }

  return this.tableBuilderElement;
};

MediumEditorTable.prototype.createTableBuilder = function () {
  this.tableBuilderElement = this.base.options
                                      .ownerDocument.createElement('div');
  this.tableBuilderElement.className = 'medium-editor-table-builder';

  this.renderGrid();

  this.bind();
};

MediumEditorTable.prototype.generateCells = function () {
  this.cells = [];

  for (var i = 0; i < 100; i++) {
    var col = i % 10;
    var row = Math.floor(i/10);

    this.cells.push({
      col: col,
      row: row,
      active: false
    });
  }
};

MediumEditorTable.prototype.getGridHTML = function () {
  var html = '<div class="medium-editor-table-builder-grid clearfix">';
  html += this.getCellsHTML();
  html += '</div>';
  return html;
};

MediumEditorTable.prototype.getCellsHTML = function () {
  var html = '';
  this.generateCells();
  this.cells.map(function(cell) {
    html += '<a href="#" class="medium-editor-table-builder-cell' +
            (cell.active === true ? ' active' : '') +
            '" ' + 'data-row="' + cell.row +
            '" data-col="' + cell.col + '">';
    html += '</a>';
  });
  return html;
};

MediumEditorTable.prototype.renderGrid = function () {
  this.tableBuilderElement.innerHTML = this.getGridHTML();
  this.cellsElements = this.tableBuilderElement.querySelectorAll('a');
};

MediumEditorTable.prototype.onHide = function () {
  this.hide();
  this.hoveredCell = {
    col: -1,
    row: -1
  };
  this.markCells();
};

MediumEditorTable.prototype.getButton = function () {
  return this.button;
};

MediumEditorTable.prototype.bind = function () {
  [].forEach.call(this.cellsElements, function(el) {
    this.bindMouseEnter(el);
    this.bindClick(el);
  }.bind(this));

  this.bindTabOnTables();
};

MediumEditorTable.prototype.bindMouseEnter = function (el) {
  var self = this;
  var timer;

  el.addEventListener('mouseenter', function () {
    clearTimeout(timer);

    var dataset = this.dataset;

    timer = setTimeout(function () {
      self.hoveredCell = {
        col: parseInt(dataset.col, 10),
        row: parseInt(dataset.row, 10)
      };
      self.markCells();
    }, 10);
  });
};

MediumEditorTable.prototype.bindClick = function (el) {
  var self = this;
  el.addEventListener('click', function (e) {
    e.preventDefault();
    self.insertTable(this.dataset.col, this.dataset.row);
  });
};

MediumEditorTable.prototype.markCells = function () {
  var self = this;
  [].forEach.call(this.cellsElements, function(el) {
    var cell = {
      col: parseInt(el.dataset.col, 10),
      row: parseInt(el.dataset.row, 10)
    };
    var active = self.hoveredCell &&
                 cell.col <= self.hoveredCell.col &&
                 cell.row <= self.hoveredCell.row;
    if (active === true) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
};

MediumEditorTable.prototype.insertTable = function (cols, rows) {
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
    '<table className="medium-editor-table" id="medium-editor-table">' +
    '<tbody>' +
    html +
    '</tbody>' +
    '</table>' +
    '<p><br /></p>'
  );

  var table = this.base.options.ownerDocument
                               .getElementById('medium-editor-table');
  table.removeAttribute('id');
  placeCaretAtNode(table.querySelector('td'), true);
};

MediumEditorTable.prototype.bindTabOnTables = function () {
  var self = this;

  [].forEach.call(this.base.elements, function (el) {
    el.addEventListener('keydown', function (e) {
      var el = getSelectionStart(),
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
            self.insertRow(
              getParentOf(el, 'tbody'),
              row.cells.length
            );
          }
          placeCaretAtNode(el);
        }
      }
    });
  });
};

MediumEditorTable.prototype.insertRow = function (tbody, cols) {
  var tr = document.createElement('tr'),
      html = '',
      i;
  for (i = 0; i < cols; i += 1) {
    html += '<td><br /></td>';
  }
  tr.innerHTML = html;
  tbody.appendChild(tr);
};

module.exports = MediumEditorTable;
