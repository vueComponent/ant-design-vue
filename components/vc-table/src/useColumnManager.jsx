import { computed } from 'vue';
export default function useColumnManager(columns) {
  const _leafColumns = (cls, fixed = false) => {
    const leafColumns = [];
    cls.forEach(column => {
      column.fixed = fixed || column.fixed;
      if (!column.children) {
        leafColumns.push(column);
      } else {
        leafColumns.push(..._leafColumns(column.children, column.fixed));
      }
    });
    return leafColumns;
  };

  // add appropriate rowspan and colspan to column
  const groupedColumns = computed(() => {
    const _groupColumns = (cls, currentRow = 0, parentColumn = {}, rows = [], fixed = false) => {
      // track how many rows we got
      rows[currentRow] = rows[currentRow] || [];
      const grouped = [];
      const setRowSpan = column => {
        const rowSpan = rows.length - currentRow;
        if (
          column &&
          !column.children && // parent columns.value are supposed to be one row
          rowSpan > 1 &&
          (!column.rowSpan || column.rowSpan < rowSpan)
        ) {
          column.rowSpan = rowSpan;
        }
      };
      cls.forEach((column, index) => {
        const newColumn = { ...column };
        newColumn.fixed = fixed || column.fixed;
        rows[currentRow].push(newColumn);
        parentColumn.colSpan = parentColumn.colSpan || 0;
        if (newColumn.children && newColumn.children.length > 0) {
          newColumn.children = _groupColumns(
            newColumn.children,
            currentRow + 1,
            newColumn,
            rows,
            newColumn.fixed,
          );
          parentColumn.colSpan += newColumn.colSpan;
        } else {
          parentColumn.colSpan += 1;
        }
        // update rowspan to all same row columns.value
        for (let i = 0; i < rows[currentRow].length - 1; i += 1) {
          setRowSpan(rows[currentRow][i]);
        }
        // last column, update rowspan immediately
        if (index + 1 === cls.length) {
          setRowSpan(newColumn);
        }
        grouped.push(newColumn);
      });
      return grouped;
    };
    return _groupColumns(columns.value);
  });

  const isAnyColumnsFixed = computed(() => columns.value.some(column => !!column.fixed));

  const isAnyColumnsLeftFixed = computed(() =>
    columns.value.some(column => column.fixed === 'left' || column.fixed === true),
  );

  const isAnyColumnsRightFixed = computed(() =>
    columns.value.some(column => column.fixed === 'right'),
  );

  const leftColumns = computed(() =>
    groupedColumns.value.filter(column => column.fixed === 'left' || column.fixed === true),
  );

  const rightColumns = computed(() => {
    return groupedColumns.value.filter(column => column.fixed === 'right');
  });

  const leafColumns = computed(() => {
    return _leafColumns(columns.value);
  });

  const leftLeafColumns = computed(() => _leafColumns(leftColumns.value));

  const rightLeafColumns = computed(() => _leafColumns(rightColumns.value));
  return {
    groupedColumns,
    isAnyColumnsFixed,
    isAnyColumnsLeftFixed,
    isAnyColumnsRightFixed,
    leftColumns,
    rightColumns,
    leafColumns,
    leftLeafColumns,
    rightLeafColumns,
  };
}
