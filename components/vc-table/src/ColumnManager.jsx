export default class ColumnManager {
  constructor(columns) {
    this.columns = columns;
    this._cached = {};
  }

  isAnyColumnsFixed() {
    return this._cache('isAnyColumnsFixed', () => {
      return this.columns.some(column => !!column.fixed);
    });
  }

  isAnyColumnsLeftFixed() {
    return this._cache('isAnyColumnsLeftFixed', () => {
      return this.columns.some(column => column.fixed === 'left' || column.fixed === true);
    });
  }

  isAnyColumnsRightFixed() {
    return this._cache('isAnyColumnsRightFixed', () => {
      return this.columns.some(column => column.fixed === 'right');
    });
  }

  leftColumns() {
    return this._cache('leftColumns', () => {
      return this.groupedColumns().filter(
        column => column.fixed === 'left' || column.fixed === true,
      );
    });
  }

  rightColumns() {
    return this._cache('rightColumns', () => {
      return this.groupedColumns().filter(column => column.fixed === 'right');
    });
  }

  leafColumns() {
    return this._cache('leafColumns', () => this._leafColumns(this.columns));
  }

  leftLeafColumns() {
    return this._cache('leftLeafColumns', () => this._leafColumns(this.leftColumns()));
  }

  rightLeafColumns() {
    return this._cache('rightLeafColumns', () => this._leafColumns(this.rightColumns()));
  }

  // add appropriate rowspan and colspan to column
  groupedColumns() {
    return this._cache('groupedColumns', () => {
      const _groupColumns = (columns, currentRow = 0, parentColumn = {}, rows = []) => {
        // track how many rows we got
        rows[currentRow] = rows[currentRow] || [];
        const grouped = [];
        const setRowSpan = column => {
          const rowSpan = rows.length - currentRow;
          if (
            column &&
            !column.children && // parent columns are supposed to be one row
            rowSpan > 1 &&
            (!column.rowSpan || column.rowSpan < rowSpan)
          ) {
            column.rowSpan = rowSpan;
          }
        };
        columns.forEach((column, index) => {
          const newColumn = { ...column };
          rows[currentRow].push(newColumn);
          parentColumn.colSpan = parentColumn.colSpan || 0;
          if (newColumn.children && newColumn.children.length > 0) {
            newColumn.children = _groupColumns(newColumn.children, currentRow + 1, newColumn, rows);
            parentColumn.colSpan += newColumn.colSpan;
          } else {
            parentColumn.colSpan++;
          }
          // update rowspan to all same row columns
          for (let i = 0; i < rows[currentRow].length - 1; ++i) {
            setRowSpan(rows[currentRow][i]);
          }
          // last column, update rowspan immediately
          if (index + 1 === columns.length) {
            setRowSpan(newColumn);
          }
          grouped.push(newColumn);
        });
        return grouped;
      };
      return _groupColumns(this.columns);
    });
  }

  reset(columns) {
    this.columns = columns;
    this._cached = {};
  }

  _cache(name, fn) {
    if (name in this._cached) {
      return this._cached[name];
    }
    this._cached[name] = fn();
    return this._cached[name];
  }

  _leafColumns(columns) {
    const leafColumns = [];
    columns.forEach(column => {
      if (!column.children) {
        leafColumns.push(column);
      } else {
        leafColumns.push(...this._leafColumns(column.children));
      }
    });
    return leafColumns;
  }
}
