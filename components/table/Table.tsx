import RcTable from '../vc-table';
import type { TableProps as RcTableProps } from '../vc-table/Table';
import { INTERNAL_HOOKS } from '../vc-table/Table';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import Pagination from '../pagination';
import type { TooltipProps } from '../tooltip';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useLazyKVMap from './hooks/useLazyKVMap';
import type { Breakpoint } from '../_util/responsiveObserve';
import type {
  TableRowSelection,
  GetRowKey,
  ColumnType,
  ColumnsType,
  TableCurrentDataSource,
  SorterResult,
  GetPopupContainer,
  ExpandType,
  TablePaginationConfig,
  SortOrder,
  TableLocale,
  TableAction,
  FilterValue,
} from './interface';
import useSelection from './hooks/useSelection';
import type { SortState } from './hooks/useSorter';
import useSorter, { getSortData } from './hooks/useSorter';
import type { FilterState } from './hooks/useFilter';
import useFilter, { getFilterData } from './hooks/useFilter';
import useTitleColumns from './hooks/useTitleColumns';
import renderExpandIcon from './ExpandIcon';
import scrollTo from '../_util/scrollTo';
import defaultLocale from '../locale/en_US';
import type { SizeType } from '../config-provider';
import devWarning from '../vc-util/devWarning';
import type { CSSProperties } from 'vue';
import { nextTick, reactive, ref, computed, defineComponent, toRef, watchEffect, watch } from 'vue';
import type { DefaultRecordType, RenderExpandIconProps } from '../vc-table/interface';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { initDefaultProps } from '../_util/props-util';
import { useProvideSlots, useProvideTableContext } from './context';
import type { ContextSlots } from './context';
import useColumns from './hooks/useColumns';
import { convertChildrenToColumns } from './util';

import {
  stringType,
  booleanType,
  arrayType,
  someType,
  functionType,
  objectType,
} from '../_util/type';

// CSSINJS
import useStyle from './style';
import type { CustomSlotsType } from '../_util/type';

export type { ColumnsType, TablePaginationConfig };

const EMPTY_LIST: any[] = [];

interface ChangeEventInfo<RecordType = DefaultRecordType> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: Function;
}

export interface TableProps<RecordType = DefaultRecordType>
  extends Omit<
    RcTableProps<RecordType>,
    | 'transformColumns'
    | 'internalHooks'
    | 'internalRefs'
    | 'data'
    | 'columns'
    | 'scroll'
    | 'emptyText'
    | 'canExpandable'
    | 'onUpdateInternalRefs'
  > {
  dropdownPrefixCls?: string;
  dataSource?: RcTableProps<RecordType>['data'];
  columns?: ColumnsType<RecordType>;
  pagination?: false | TablePaginationConfig;
  loading?: boolean | SpinProps;
  size?: SizeType;
  bordered?: boolean;
  locale?: TableLocale;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  onResizeColumn?: (w: number, col: ColumnType) => void;
  rowSelection?: TableRowSelection<RecordType>;

  getPopupContainer?: GetPopupContainer;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | TooltipProps;
}

export const tableProps = () => {
  return {
    prefixCls: stringType<string>(),
    columns: arrayType<ColumnsType>(),
    rowKey: someType<TableProps['rowKey']>([String, Function]),
    tableLayout: stringType<TableProps['tableLayout']>(),
    rowClassName: someType<TableProps['rowClassName']>([String, Function]),
    title: functionType<TableProps['title']>(),
    footer: functionType<TableProps['footer']>(),
    id: stringType<TableProps['id']>(),
    showHeader: booleanType(),
    components: objectType<TableProps['components']>(),
    customRow: functionType<TableProps['customRow']>(),
    customHeaderRow: functionType<TableProps['customHeaderRow']>(),
    direction: stringType<TableProps['direction']>(),
    expandFixed: someType<TableProps['expandFixed']>([Boolean, String]),
    expandColumnWidth: Number,
    expandedRowKeys: arrayType<TableProps['expandedRowKeys']>(),
    defaultExpandedRowKeys: arrayType<TableProps['defaultExpandedRowKeys']>(),
    expandedRowRender: functionType<TableProps['expandedRowRender']>(),
    expandRowByClick: booleanType(),
    expandIcon: functionType<TableProps['expandIcon']>(),
    onExpand: functionType<TableProps['onExpand']>(),
    onExpandedRowsChange: functionType<TableProps['onExpandedRowsChange']>(),
    'onUpdate:expandedRowKeys': functionType<TableProps['onExpandedRowsChange']>(),
    defaultExpandAllRows: booleanType(),
    indentSize: Number,
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
    expandIconColumnIndex: Number,
    showExpandColumn: booleanType(),
    expandedRowClassName: functionType<TableProps['expandedRowClassName']>(),
    childrenColumnName: stringType<TableProps['childrenColumnName']>(),
    rowExpandable: functionType<TableProps['rowExpandable']>(),
    sticky: someType<TableProps['sticky']>([Boolean, Object]),

    dropdownPrefixCls: String,
    dataSource: arrayType<RcTableProps['data']>(),
    pagination: someType<false | TablePaginationConfig>([Boolean, Object]),
    loading: someType<boolean | SpinProps>([Boolean, Object]),
    size: stringType<SizeType>(),
    bordered: booleanType(),
    locale: objectType<TableLocale>(),

    onChange:
      functionType<
        (
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult | SorterResult[],
          extra: TableCurrentDataSource,
        ) => void
      >(),
    onResizeColumn: functionType<(w: number, col: ColumnType) => void>(),
    rowSelection: objectType<TableRowSelection>(),
    getPopupContainer: functionType<GetPopupContainer>(),
    scroll: objectType<
      RcTableProps['scroll'] & {
        scrollToFirstRowOnChange?: boolean;
      }
    >(),
    sortDirections: arrayType<SortOrder[]>(),
    showSorterTooltip: someType<boolean | TooltipProps>([Boolean, Object], true),
    transformCellText: functionType<TableProps['transformCellText']>(),
  };
};

const InternalTable = defineComponent({
  name: 'InternalTable',
  inheritAttrs: false,
  props: initDefaultProps(
    {
      ...tableProps(),
      contextSlots: objectType<ContextSlots>(),
    },
    {
      rowKey: 'key',
    },
  ),
  setup(props, { attrs, slots, expose, emit }) {
    devWarning(
      !(typeof props.rowKey === 'function' && props.rowKey.length > 1),
      'Table',
      '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
    );

    useProvideSlots(computed(() => props.contextSlots));
    useProvideTableContext({
      onResizeColumn: (w, col) => {
        emit('resizeColumn', w, col);
      },
    });
    const screens = useBreakpoint();

    const mergedColumns = computed(() => {
      const matched = new Set(
        Object.keys(screens.value).filter((m: Breakpoint) => screens.value[m]),
      );
      return props.columns.filter(
        (c: ColumnType<DefaultRecordType>) =>
          !c.responsive || c.responsive.some((r: Breakpoint) => matched.has(r)),
      );
    });

    const {
      size: mergedSize,
      renderEmpty,
      direction,
      prefixCls,
      configProvider,
    } = useConfigInject('table', props);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const transformCellText = computed(
      () => props.transformCellText || configProvider.transformCellText?.value,
    );
    const [tableLocale] = useLocaleReceiver('Table', defaultLocale.Table, toRef(props, 'locale'));
    const rawData = computed(() => props.dataSource || EMPTY_LIST);

    const dropdownPrefixCls = computed(() =>
      configProvider.getPrefixCls('dropdown', props.dropdownPrefixCls),
    );

    const childrenColumnName = computed(() => props.childrenColumnName || 'children');

    const expandType = computed<ExpandType>(() => {
      if (rawData.value.some(item => (item as any)?.[childrenColumnName.value])) {
        return 'nest';
      }

      if (props.expandedRowRender) {
        return 'row';
      }

      return null;
    });

    const internalRefs = reactive({
      body: null,
    });

    const updateInternalRefs = refs => {
      Object.assign(internalRefs, refs);
    };

    // ============================ RowKey ============================
    const getRowKey = computed<GetRowKey<DefaultRecordType>>(() => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey;
      }

      return record => (record as any)?.[props.rowKey as string];
    });

    const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

    // ============================ Events =============================
    const changeEventInfo: Partial<ChangeEventInfo> = {};

    const triggerOnChange = (
      info: Partial<ChangeEventInfo>,
      action: TableAction,
      reset = false,
    ) => {
      const { pagination, scroll, onChange } = props;
      const changeInfo = {
        ...changeEventInfo,
        ...info,
      };

      if (reset) {
        changeEventInfo.resetPagination!();

        // Reset event param
        if (changeInfo.pagination!.current) {
          changeInfo.pagination!.current = 1;
        }

        // Trigger pagination events
        if (pagination && pagination.onChange) {
          pagination.onChange(1, changeInfo.pagination!.pageSize);
        }
      }

      if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body) {
        scrollTo(0, {
          getContainer: () => internalRefs.body,
        });
      }

      onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
        currentDataSource: getFilterData(
          getSortData(rawData.value, changeInfo.sorterStates!, childrenColumnName.value),
          changeInfo.filterStates!,
        ),
        action,
      });
    };

    /**
     * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
     * state out and then put it back to title render. Move these code into `hooks` but still too
     * complex. We should provides Table props like `sorter` & `filter` to handle control in next big version.
     */

    // ============================ Sorter =============================
    const onSorterChange = (sorter: SorterResult | SorterResult[], sorterStates: SortState[]) => {
      triggerOnChange(
        {
          sorter,
          sorterStates,
        },
        'sort',
        false,
      );
    };

    const [transformSorterColumns, sortStates, sorterTitleProps, sorters] = useSorter({
      prefixCls,
      mergedColumns,
      onSorterChange,
      sortDirections: computed(() => props.sortDirections || ['ascend', 'descend']),
      tableLocale,
      showSorterTooltip: toRef(props, 'showSorterTooltip'),
    });
    const sortedData = computed(() =>
      getSortData(rawData.value, sortStates.value, childrenColumnName.value),
    );

    // ============================ Filter ============================
    const onFilterChange = (filters: Record<string, FilterValue>, filterStates: FilterState[]) => {
      triggerOnChange(
        {
          filters,
          filterStates,
        },
        'filter',
        true,
      );
    };

    const [transformFilterColumns, filterStates, filters] = useFilter({
      prefixCls,
      locale: tableLocale,
      dropdownPrefixCls,
      mergedColumns,
      onFilterChange,
      getPopupContainer: toRef(props, 'getPopupContainer'),
    });
    const mergedData = computed(() => getFilterData(sortedData.value, filterStates.value));
    // ============================ Column ============================

    const [transformBasicColumns] = useColumns(toRef(props, 'contextSlots'));

    const columnTitleProps = computed(() => {
      const mergedFilters: Record<string, FilterValue> = {};
      const filtersValue = filters.value;
      Object.keys(filtersValue).forEach(filterKey => {
        if (filtersValue[filterKey] !== null) {
          mergedFilters[filterKey] = filtersValue[filterKey]!;
        }
      });
      return {
        ...sorterTitleProps.value,
        filters: mergedFilters,
      };
    });
    const [transformTitleColumns] = useTitleColumns(columnTitleProps);

    // ========================== Pagination ==========================
    const onPaginationChange = (current: number, pageSize: number) => {
      triggerOnChange(
        {
          pagination: { ...changeEventInfo.pagination, current, pageSize },
        },
        'paginate',
      );
    };

    const [mergedPagination, resetPagination] = usePagination(
      computed(() => mergedData.value.length),
      toRef(props, 'pagination'),
      onPaginationChange,
    );

    watchEffect(() => {
      changeEventInfo.sorter = sorters.value;
      changeEventInfo.sorterStates = sortStates.value;

      changeEventInfo.filters = filters.value;
      changeEventInfo.filterStates = filterStates.value;
      changeEventInfo.pagination =
        props.pagination === false
          ? {}
          : getPaginationParam(mergedPagination.value, props.pagination);

      changeEventInfo.resetPagination = resetPagination;
    });

    // ============================= Data =============================
    const pageData = computed(() => {
      if (props.pagination === false || !mergedPagination.value.pageSize) {
        return mergedData.value;
      }

      const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value;
      devWarning(current > 0, 'Table', '`current` should be positive number.');

      // Dynamic table data
      if (mergedData.value.length < total!) {
        if (mergedData.value.length > pageSize) {
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
        }
        return mergedData.value;
      }

      return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
    });

    watchEffect(
      () => {
        nextTick(() => {
          const { total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination.value;
          // Dynamic table data
          if (mergedData.value.length < total!) {
            if (mergedData.value.length > pageSize) {
              devWarning(
                false,
                'Table',
                '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
              );
            }
          }
        });
      },
      { flush: 'post' },
    );

    const expandIconColumnIndex = computed(() => {
      if (props.showExpandColumn === false) return -1;
      // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
      if (expandType.value === 'nest' && props.expandIconColumnIndex === undefined) {
        return props.rowSelection ? 1 : 0;
      } else if (props.expandIconColumnIndex! > 0 && props.rowSelection) {
        return props.expandIconColumnIndex - 1;
      }
      return props.expandIconColumnIndex;
    });
    const rowSelection = ref();
    watch(
      () => props.rowSelection,
      () => {
        rowSelection.value = props.rowSelection ? { ...props.rowSelection } : props.rowSelection;
      },
      { deep: true, immediate: true },
    );
    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = useSelection(rowSelection, {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: computed(() => props.getPopupContainer),
    });

    const internalRowClassName = (record: any, index: number, indent: number) => {
      let mergedRowClassName;
      const { rowClassName } = props;
      if (typeof rowClassName === 'function') {
        mergedRowClassName = classNames(rowClassName(record, index, indent));
      } else {
        mergedRowClassName = classNames(rowClassName);
      }

      return classNames(
        {
          [`${prefixCls.value}-row-selected`]: selectedKeySet.value.has(
            getRowKey.value(record, index),
          ),
        },
        mergedRowClassName,
      );
    };
    expose({
      selectedKeySet,
    });

    const indentSize = computed(() => {
      // Indent size
      return typeof props.indentSize === 'number' ? props.indentSize : 15;
    });

    const transformColumns = (innerColumns: ColumnsType<any>): ColumnsType<any> => {
      const res = transformTitleColumns(
        transformSelectionColumns(
          transformFilterColumns(transformSorterColumns(transformBasicColumns(innerColumns))),
        ),
      );
      return res;
    };

    return () => {
      const {
        expandIcon = slots.expandIcon || renderExpandIcon(tableLocale.value),
        pagination,
        loading,
        bordered,
      } = props;

      let topPaginationNode;
      let bottomPaginationNode;
      if (pagination !== false && mergedPagination.value?.total) {
        let paginationSize: TablePaginationConfig['size'];
        if (mergedPagination.value.size) {
          paginationSize = mergedPagination.value.size;
        } else {
          paginationSize =
            mergedSize.value === 'small' || mergedSize.value === 'middle' ? 'small' : undefined;
        }

        const renderPagination = (position: string) => (
          <Pagination
            {...mergedPagination.value}
            class={[
              `${prefixCls.value}-pagination ${prefixCls.value}-pagination-${position}`,
              mergedPagination.value.class,
            ]}
            size={paginationSize}
          />
        );
        const defaultPosition = direction.value === 'rtl' ? 'left' : 'right';
        const { position } = mergedPagination.value;
        if (position !== null && Array.isArray(position)) {
          const topPos = position.find(p => p.includes('top'));
          const bottomPos = position.find(p => p.includes('bottom'));
          const isDisable = position.every(p => `${p}` === 'none');
          if (!topPos && !bottomPos && !isDisable) {
            bottomPaginationNode = renderPagination(defaultPosition);
          }
          if (topPos) {
            topPaginationNode = renderPagination(topPos!.toLowerCase().replace('top', ''));
          }
          if (bottomPos) {
            bottomPaginationNode = renderPagination(bottomPos!.toLowerCase().replace('bottom', ''));
          }
        } else {
          bottomPaginationNode = renderPagination(defaultPosition);
        }
      }

      // >>>>>>>>> Spinning
      let spinProps: SpinProps | undefined;
      if (typeof loading === 'boolean') {
        spinProps = {
          spinning: loading,
        };
      } else if (typeof loading === 'object') {
        spinProps = {
          spinning: true,
          ...loading,
        };
      }

      const wrapperClassNames = classNames(
        `${prefixCls.value}-wrapper`,
        {
          [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
        },
        attrs.class,
        hashId.value,
      );
      const tableProps = omit(props, ['columns']);
      return wrapSSR(
        <div class={wrapperClassNames} style={attrs.style as CSSProperties}>
          <Spin spinning={false} {...spinProps}>
            {topPaginationNode}
            <RcTable
              {...attrs}
              {...tableProps}
              expandedRowKeys={props.expandedRowKeys as any}
              defaultExpandedRowKeys={props.defaultExpandedRowKeys as any}
              expandIconColumnIndex={expandIconColumnIndex.value}
              indentSize={indentSize.value}
              expandIcon={expandIcon}
              columns={mergedColumns.value}
              direction={direction.value}
              prefixCls={prefixCls.value}
              class={classNames({
                [`${prefixCls.value}-middle`]: mergedSize.value === 'middle',
                [`${prefixCls.value}-small`]: mergedSize.value === 'small',
                [`${prefixCls.value}-bordered`]: bordered,
                [`${prefixCls.value}-empty`]: rawData.value.length === 0,
              })}
              data={pageData.value}
              rowKey={getRowKey.value}
              rowClassName={internalRowClassName}
              // Internal
              internalHooks={INTERNAL_HOOKS}
              internalRefs={internalRefs}
              onUpdateInternalRefs={updateInternalRefs}
              transformColumns={transformColumns}
              transformCellText={transformCellText.value}
              v-slots={{
                ...slots,
                emptyText: () =>
                  slots.emptyText?.() || props.locale?.emptyText || renderEmpty('Table'),
              }}
            />
            {bottomPaginationNode}
          </Spin>
        </div>,
      );
    };
  },
});

const Table = defineComponent({
  name: 'ATable',
  inheritAttrs: false,
  props: initDefaultProps(tableProps(), {
    rowKey: 'key',
  }),
  slots: Object as CustomSlotsType<{
    emptyText?: any;
    expandIcon?: RenderExpandIconProps<any>;
    title?: any;
    footer?: any;
    summary?: any;
    expandedRowRender?: any;
    expandColumnTitle?: any;
    bodyCell?: (props: {
      text: any;
      value: any;
      record: Record<string, any>;
      index: number;
      column: ColumnType;
    }) => void;
    headerCell?: (props: { title: any; column: ColumnType }) => void;
    customFilterIcon?: any;
    customFilterDropdown?: any;
    default: any;
  }>,
  setup(props, { attrs, slots, expose }) {
    const table = ref();
    expose({
      table,
    });
    return () => {
      const columns = props.columns || convertChildrenToColumns(slots.default?.());
      return (
        <InternalTable
          ref={table}
          {...attrs}
          {...props}
          columns={columns || []}
          expandedRowRender={slots.expandedRowRender || props.expandedRowRender}
          contextSlots={{ ...slots }} // use new object, 否则slot热更新失效，原因需进一步探究
          v-slots={slots}
        />
      );
    };
  },
});

export default Table;
