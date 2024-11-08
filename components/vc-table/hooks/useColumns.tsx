import { warning } from '../../vc-util/warning';
import type { ComputedRef, Ref } from 'vue';
import { computed, watchEffect } from 'vue';
import type {
  ColumnsType,
  ColumnType,
  FixedType,
  Key,
  GetRowKey,
  TriggerEventHandler,
  RenderExpandIcon,
  ColumnGroupType,
} from '../interface';
import { INTERNAL_COL_DEFINE } from '../utils/legacyUtil';
import { EXPAND_COLUMN } from '../constant';
import { useInjectSlots } from '../../table/context';
import { customRenderSlot } from '../../_util/vnode';

function flatColumns<RecordType>(columns: ColumnsType<RecordType>): ColumnType<RecordType>[] {
  return columns.reduce((list, column) => {
    const { fixed } = column;

    // Convert `fixed='true'` to `fixed='left'` instead
    const parsedFixed = fixed === true ? 'left' : fixed;

    const subColumns = (column as ColumnGroupType<RecordType>).children;
    if (subColumns && subColumns.length > 0) {
      return [
        ...list,
        ...flatColumns(subColumns).map(subColum => ({
          fixed: parsedFixed,
          ...subColum,
        })),
      ];
    }
    return [
      ...list,
      {
        ...column,
        fixed: parsedFixed,
      },
    ];
  }, []);
}

function warningFixed(flattenColumns: readonly { fixed?: FixedType }[]) {
  let allFixLeft = true;
  for (let i = 0; i < flattenColumns.length; i += 1) {
    const col = flattenColumns[i];
    if (allFixLeft && col.fixed !== 'left') {
      allFixLeft = false;
    } else if (!allFixLeft && col.fixed === 'left') {
      warning(false, `Index ${i - 1} of \`columns\` missing \`fixed='left'\` prop.`);
      break;
    }
  }

  let allFixRight = true;
  for (let i = flattenColumns.length - 1; i >= 0; i -= 1) {
    const col = flattenColumns[i];
    if (allFixRight && col.fixed !== 'right') {
      allFixRight = false;
    } else if (!allFixRight && col.fixed === 'right') {
      warning(false, `Index ${i + 1} of \`columns\` missing \`fixed='right'\` prop.`);
      break;
    }
  }
}

function revertForRtl<RecordType>(columns: ColumnsType<RecordType>): ColumnsType<RecordType> {
  return columns.map(column => {
    const { fixed, ...restProps } = column;

    // Convert `fixed='left'` to `fixed='right'` instead
    let parsedFixed = fixed;
    if (fixed === 'left') {
      parsedFixed = 'right';
    } else if (fixed === 'right') {
      parsedFixed = 'left';
    }
    return {
      fixed: parsedFixed,
      ...restProps,
    };
  });
}

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns<RecordType>(
  {
    prefixCls,
    columns: baseColumns,
    // children,
    expandable,
    expandedKeys,
    getRowKey,
    onTriggerExpand,
    expandIcon,
    rowExpandable,
    expandIconColumnIndex,
    direction,
    expandRowByClick,
    expandColumnWidth,
    expandFixed,
  }: {
    prefixCls?: Ref<string>;
    columns?: Ref<ColumnsType<RecordType>>;
    expandable: Ref<boolean>;
    expandedKeys: ComputedRef<Set<Key>>;
    getRowKey: Ref<GetRowKey<RecordType>>;
    onTriggerExpand: TriggerEventHandler<RecordType>;
    expandIcon?: Ref<RenderExpandIcon<RecordType>>;
    rowExpandable?: Ref<(record: RecordType) => boolean>;
    expandIconColumnIndex?: Ref<number>;
    direction?: Ref<'ltr' | 'rtl'>;
    expandRowByClick?: Ref<boolean>;
    expandColumnWidth?: Ref<number | string>;
    expandFixed?: Ref<FixedType>;
  },
  transformColumns: Ref<(columns: ColumnsType<RecordType>) => ColumnsType<RecordType>>,
): [ComputedRef<ColumnsType<RecordType>>, ComputedRef<readonly ColumnType<RecordType>[]>] {
  const contextSlots = useInjectSlots();
  // Add expand column
  const withExpandColumns = computed<ColumnsType<RecordType>>(() => {
    if (expandable.value) {
      let cloneColumns = baseColumns.value.slice();

      // >>> Warning if use `expandIconColumnIndex`
      if (process.env.NODE_ENV !== 'production' && expandIconColumnIndex.value >= 0) {
        warning(
          false,
          '`expandIconColumnIndex` is deprecated. Please use `Table.EXPAND_COLUMN` in `columns` instead.',
        );
      }

      // >>> Insert expand column if not exist
      if (!cloneColumns.includes(EXPAND_COLUMN)) {
        const expandColIndex = expandIconColumnIndex.value || 0;
        if (expandColIndex >= 0) {
          cloneColumns.splice(expandColIndex, 0, EXPAND_COLUMN);
        }
      }

      // >>> Deduplicate additional expand column
      if (
        process.env.NODE_ENV !== 'production' &&
        cloneColumns.filter(c => c === EXPAND_COLUMN).length > 1
      ) {
        warning(false, 'There exist more than one `EXPAND_COLUMN` in `columns`.');
      }
      const expandColumnIndex = cloneColumns.indexOf(EXPAND_COLUMN);
      cloneColumns = cloneColumns.filter(
        (column, index) => column !== EXPAND_COLUMN || index === expandColumnIndex,
      );

      // >>> Check if expand column need to fixed
      const prevColumn = baseColumns.value[expandColumnIndex];

      let fixedColumn: FixedType | null;
      if ((expandFixed.value === 'left' || expandFixed.value) && !expandIconColumnIndex.value) {
        fixedColumn = 'left';
      } else if (
        (expandFixed.value === 'right' || expandFixed.value) &&
        expandIconColumnIndex.value === baseColumns.value.length
      ) {
        fixedColumn = 'right';
      } else {
        fixedColumn = prevColumn ? prevColumn.fixed : null;
      }
      const expandedKeysValue = expandedKeys.value;
      const rowExpandableValue = rowExpandable.value;
      const expandIconValue = expandIcon.value;
      const prefixClsValue = prefixCls.value;
      const expandRowByClickValue = expandRowByClick.value;
      // >>> Create expandable column
      const expandColumn = {
        [INTERNAL_COL_DEFINE]: {
          class: `${prefixCls.value}-expand-icon-col`,
          columnType: 'EXPAND_COLUMN',
        },
        title: customRenderSlot(contextSlots.value, 'expandColumnTitle', {}, () => ['']),
        fixed: fixedColumn,
        class: `${prefixCls.value}-row-expand-icon-cell`,
        width: expandColumnWidth.value,
        customRender: ({ record, index }) => {
          const rowKey = getRowKey.value(record, index);
          const expanded = expandedKeysValue.has(rowKey);
          const recordExpandable = rowExpandableValue ? rowExpandableValue(record) : true;

          const icon = expandIconValue({
            prefixCls: prefixClsValue,
            expanded,
            expandable: recordExpandable,
            record,
            onExpand: onTriggerExpand,
          });

          if (expandRowByClickValue) {
            return <span onClick={e => e.stopPropagation()}>{icon}</span>;
          }
          return icon;
        },
      };

      return cloneColumns.map(col => (col === EXPAND_COLUMN ? expandColumn : col));
    }
    if (process.env.NODE_ENV !== 'production' && baseColumns.value.includes(EXPAND_COLUMN)) {
      warning(false, '`expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.');
    }

    return baseColumns.value.filter(col => col !== EXPAND_COLUMN);
  });

  const mergedColumns = computed(() => {
    let finalColumns = withExpandColumns.value;
    if (transformColumns.value) {
      finalColumns = transformColumns.value(finalColumns);
    }

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [
        {
          customRender: () => null,
        },
      ];
    }
    return finalColumns;
  });

  const flattenColumns = computed(() => {
    if (direction.value === 'rtl') {
      return revertForRtl(flatColumns(mergedColumns.value));
    }
    return flatColumns(mergedColumns.value);
  });
  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    watchEffect(() => {
      setTimeout(() => {
        warningFixed(flattenColumns.value);
      });
    });
  }
  return [mergedColumns, flattenColumns];
}

export default useColumns;
