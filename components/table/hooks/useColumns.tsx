import devWarning from '../../vc-util/devWarning';
import type { Ref } from 'vue';
import type { ContextSlots } from '../context';
import type { TransformColumns, ColumnsType } from '../interface';
import { SELECTION_COLUMN } from './useSelection';
import { EXPAND_COLUMN } from '../../vc-table';
import { customRenderSlot } from '../../_util/vnode';

function fillSlots<RecordType>(columns: ColumnsType<RecordType>, contextSlots: Ref<ContextSlots>) {
  const $slots = contextSlots.value;
  return columns.map(column => {
    if (column === SELECTION_COLUMN || column === EXPAND_COLUMN) return column;
    const cloneColumn = { ...column };
    const { slots = {} } = cloneColumn;
    cloneColumn.__originColumn__ = column;
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

    if (contextSlots.value.headerCell && !column.slots?.title) {
      cloneColumn.title = customRenderSlot(
        contextSlots.value,
        'headerCell',
        {
          title: column.title,
          column,
        },
        () => [column.title as any],
      );
    }
    if ('children' in cloneColumn && Array.isArray(cloneColumn.children)) {
      cloneColumn.children = fillSlots(cloneColumn.children, contextSlots);
    }

    return cloneColumn;
  });
}

export default function useColumns<RecordType>(
  contextSlots: Ref<ContextSlots>,
): [TransformColumns<RecordType>] {
  const filledColumns = (columns: ColumnsType<RecordType>) => fillSlots(columns, contextSlots);

  return [filledColumns];
}
