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

        this._range = null;
        this._toolbar = this._doc.createElement('div');
        this._toolbar.className = 'medium-editor-table-builder-toolbar';

        var spanRow = this._doc.createElement('span');
        spanRow.innerHTML = 'Row:';
        this._toolbar.appendChild(spanRow);
        var addRowBefore = this._doc.createElement('button');
        addRowBefore.title = 'Add row before';
        addRowBefore.innerHTML = '<i class="fa fa-long-arrow-up"></i>';
        addRowBefore.onclick = this.addRow.bind(this, true);
        this._toolbar.appendChild(addRowBefore);

        var addRowAfter = this._doc.createElement('button');
        addRowAfter.title = 'Add row after';
        addRowAfter.innerHTML = '<i class="fa fa-long-arrow-down"></i>';
        addRowAfter.onclick = this.addRow.bind(this, false);
        this._toolbar.appendChild(addRowAfter);

        var remRow = this._doc.createElement('button');
        remRow.title = 'Remove row';
        remRow.innerHTML = '<i class="fa fa-close"></i>';
        remRow.onclick = this.removeRow.bind(this);
        this._toolbar.appendChild(remRow);

        var spanCol = this._doc.createElement('span');
        spanCol.innerHTML = 'Column:';
        this._toolbar.appendChild(spanCol);
        var addColumnBefore = this._doc.createElement('button');
        addColumnBefore.title = 'Add column before';
        addColumnBefore.innerHTML = '<i class="fa fa-long-arrow-left"></i>';
        addColumnBefore.onclick = this.addColumn.bind(this, true);
        this._toolbar.appendChild(addColumnBefore);

        var addColumnAfter = this._doc.createElement('button');
        addColumnAfter.title = 'Add column after';
        addColumnAfter.innerHTML = '<i class="fa fa-long-arrow-right"></i>';
        addColumnAfter.onclick = this.addColumn.bind(this, false);
        this._toolbar.appendChild(addColumnAfter);

        var remColumn = this._doc.createElement('button');
        remColumn.title = 'Remove column';
        remColumn.innerHTML = '<i class="fa fa-close"></i>';
        remColumn.onclick = this.removeColumn.bind(this);
        this._toolbar.appendChild(remColumn);

        var remTable = this._doc.createElement('button');
        remTable.title = 'Remove table';
        remTable.innerHTML = '<i class="fa fa-trash-o"></i>';
        remTable.onclick = this.removeTable.bind(this);
        this._toolbar.appendChild(remTable);

        var grid = this._root.childNodes[0];
        this._root.insertBefore(this._toolbar, grid);
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
    },

    setEditor: function (range, restrictNestedTable) {
        this._range = range;
        this._toolbar.style.display = 'block';
        if (restrictNestedTable) {
            var elements = this._doc.getElementsByClassName('medium-editor-table-builder-grid');
            elements[0].style.display = 'none';
        }
    },

    setBuilder: function () {
        this._range = null;
        this._toolbar.style.display = 'none';
        var elements = this._doc.getElementsByClassName('medium-editor-table-builder-grid');
        elements[0].style.display = 'block';
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.height = (COLUMN_WIDTH * this.rows + BORDER_WIDTH * 2) + 'px';
            elements[i].style.width = (COLUMN_WIDTH * this.columns + BORDER_WIDTH * 2) + 'px';
        }
    },

    getParentType: function (el, targetNode) {
        var nodeName = el && el.nodeName ? el.nodeName.toLowerCase() : false;
        if (!nodeName) {
            return false;
        }
        while (nodeName && nodeName !== 'body') {
            if (nodeName === targetNode) {
                return el;
            }
            el = el.parentNode;
            nodeName = el && el.nodeName ? el.nodeName.toLowerCase() : false;
        }
    },

    addRow: function (before, e) {
        e.preventDefault();
        e.stopPropagation();
        var tbody = this.getParentType(this._range, 'tbody'),
            selectedTR = this.getParentType(this._range, 'tr'),
            tr = this._doc.createElement('tr'),
            td;
        for (var i = 0; i < selectedTR.childNodes.length; i++) {
            td = this._doc.createElement('td');
            td.appendChild(this._doc.createElement('br'));
            tr.appendChild(td);
        }
        if (before !== true && selectedTR.nextSibling) {
            tbody.insertBefore(tr, selectedTR.nextSibling);
        } else if (before === true) {
            tbody.insertBefore(tr, selectedTR);
        } else {
            tbody.appendChild(tr);
        }
        this.options.onClick(0, 0);
    },

    removeRow: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var tbody = this.getParentType(this._range, 'tbody'),
            selectedTR = this.getParentType(this._range, 'tr');
        tbody.removeChild(selectedTR);
        this.options.onClick(0, 0);
    },

    addColumn: function (before, e) {
        e.preventDefault();
        e.stopPropagation();
        var selectedTR = this.getParentType(this._range, 'tr'),
            selectedTD = this.getParentType(this._range, 'td'),
            cell = Array.prototype.indexOf.call(selectedTR.childNodes, selectedTD),
            tbody = this.getParentType(this._range, 'tbody'),
            td;

        for (var i = 0; i < tbody.childNodes.length; i++) {
            td = this._doc.createElement('td');
            td.appendChild(this._doc.createElement('br'));
            if (before === true) {
                tbody.childNodes[i].insertBefore(td, tbody.childNodes[i].childNodes[cell]);
            } else if (tbody.childNodes[i].childNodes[cell].nextSibling) {
                tbody.childNodes[i].insertBefore(td, tbody.childNodes[i].childNodes[cell].nextSibling);
            } else {
                tbody.childNodes[i].appendChild(td);
            }
        }

        this.options.onClick(0, 0);
    },

    removeColumn: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var selectedTR = this.getParentType(this._range, 'tr'),
            selectedTD = this.getParentType(this._range, 'td'),
            cell = Array.prototype.indexOf.call(selectedTR.childNodes, selectedTD),
            tbody = this.getParentType(this._range, 'tbody'),
            rows = tbody.childNodes.length;

        for (var i = 0; i < rows; i++) {
            tbody.childNodes[i].removeChild(tbody.childNodes[i].childNodes[cell]);
        }
        this.options.onClick(0, 0);
    },

    removeTable: function (e) {
        e.preventDefault();
        e.stopPropagation();
        var selectedTR = this.getParentType(this._range, 'tr'),
            selectedTD = this.getParentType(this._range, 'td'),
            cell = Array.prototype.indexOf.call(selectedTR.childNodes, selectedTD),
            table = this.getParentType(this._range, 'table');

        table.parentNode.removeChild(table);
        this.options.onClick(0, 0);
    }
};
