import devWarning from '../../vc-util/devWarning';
import type { Ref } from 'vue';
import { ContextSlots } from '../context';
import type { TransformColumns, ColumnTitleProps, ColumnsType } from '../interface';
import { renderColumnTitle } from '../util';

function fillTitle<RecordType>(
  columns: ColumnsType<RecordType>,
  columnTitleProps: ColumnTitleProps<RecordType>,
  contextColumns: Ref<ContextSlots>,
) {
  const $slots = contextColumns.value;
  return columns.map(column => {
    const cloneColumn = { ...column };
    const { slots = {} } = cloneColumn;

    devWarning(
      !('slots' in cloneColumn),
      'Table',
      '`column.slots` is deprecated. Please use `v-slot:headerCell` `v-slot:bodyCell` instead.',
    );

    Object.keys(slots).forEach(key => {
      const name = slots[key];
      if (cloneColumn[key] === undefined && $slots[name]) {
        cloneColumn[key] = $slots[name];
      }
    });
    cloneColumn.title = renderColumnTitle(cloneColumn.title, columnTitleProps);

    if ('children' in cloneColumn) {
      cloneColumn.children = fillTitle(cloneColumn.children, columnTitleProps, contextColumns);
    }

    return cloneColumn;
  });
}

export default function useTitleColumns<RecordType>(
  columnTitleProps: Ref<ColumnTitleProps<RecordType>>,
  contextColumns: Ref<ContextSlots>,
): [TransformColumns<RecordType>] {
  const filledColumns = (columns: ColumnsType<RecordType>) =>
    fillTitle(columns, columnTitleProps.value, contextColumns);

  return [filledColumns];
}
