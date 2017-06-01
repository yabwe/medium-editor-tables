function Grid(el, callback, rows, columns) {
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
        [].forEach.call(this._cellsElements, function (el) {
            var cell = {
                    column: parseInt(el.getAttribute('data-column'), 10),
                    row: parseInt(el.getAttribute('data-row'), 10)
                },
                active = this._currentCell &&
                         cell.row <= this._currentCell.row &&
                         cell.column <= this._currentCell.column;

            if (active === true) {
                if ('classList' in el) {
                    el.classList.add('active');
                } else {
                    el.className += ' ' + 'active';
                }
            } else {
                if ('classList' in el) {
                    el.classList.remove('active');
                } else {
                    el.className = (' ' + el.className).replace(' ' + 'active' + ' ', '');
                }
            }
        }.bind(this));
    },

    _generateCells: function () {
        var row = -1;

        this._cells = [];

        for (var i = 0; i < this.rows * this.columns; i++) {
            var column = i % this.columns;

            if (column === 0) {
                row++;
            }

            this._cells.push({
                column: column,
                row: row,
                active: false
            });
        }
    },

    _html: function () {
        var width = this.columns * COLUMN_WIDTH + BORDER_WIDTH * 2,
            height = this.rows * COLUMN_WIDTH + BORDER_WIDTH * 2,
            html = '<div class="medium-editor-table-builder-grid clearfix" style="width:' + width + 'px;height:' + height + 'px;">';
        html += this._cellsHTML();
        html += '</div>';
        return html;
    },

    _cellsHTML: function () {
        var html = '';
        this._generateCells();
        this._cells.map(function (cell) {
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
        [].forEach.call(this._cellsElements, function (el) {
            this._onMouseEnter(el);
            this._onClick(el);
        }.bind(this));
    },

    _onMouseEnter: function (el) {
        var self = this,
            timer;

        el.addEventListener('mouseenter', function (e) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                self._currentCell = {
                    column: parseInt(e.target.getAttribute('data-column'), 10),
                    row: parseInt(e.target.getAttribute('data-row'), 10)
                };
                self.markCells();
            }, 50);
        });
    },

    _onClick: function (el) {
        var self = this;
        el.addEventListener('click', function (e) {
            e.preventDefault();
            self._callback(e.target.getAttribute('data-row'), e.target.getAttribute('data-column'));
        });
    }
};
