import type { Ref } from 'vue';
import type { TransformColumns, ColumnTitleProps, ColumnsType } from '../interface';
import { renderColumnTitle } from '../util';

function fillTitle<RecordType>(
  columns: ColumnsType<RecordType>,
  columnTitleProps: ColumnTitleProps<RecordType>,
) {
  return columns.map(column => {
    const cloneColumn = { ...column };

    cloneColumn.title = renderColumnTitle(cloneColumn.title, columnTitleProps);

    if ('children' in cloneColumn) {
      cloneColumn.children = fillTitle(cloneColumn.children, columnTitleProps);
    }

    return cloneColumn;
  });
}

export default function useTitleColumns<RecordType>(
  columnTitleProps: Ref<ColumnTitleProps<RecordType>>,
): [TransformColumns<RecordType>] {
  const filledColumns = (columns: ColumnsType<RecordType>) =>
    fillTitle(columns, columnTitleProps.value);

  return [filledColumns];
}
