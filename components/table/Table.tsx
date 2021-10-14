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
import type { PropType } from 'vue';
import { reactive, ref, computed, defineComponent, toRef, watchEffect } from 'vue';
import type { DefaultRecordType } from '../vc-table/interface';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useConfigInject from '../_util/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { initDefaultProps } from '../_util/props-util';
import { useProvideSlots } from './context';
import type { ContextSlots } from './context';
import useColumns from './hooks/useColumns';
import { convertChildrenToColumns } from './util';

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
    prefixCls: { type: String as PropType<string>, default: undefined },
    columns: { type: Array as PropType<ColumnsType>, default: undefined },
    rowKey: { type: [String, Function] as PropType<TableProps['rowKey']>, default: undefined },
    tableLayout: { type: String as PropType<TableProps['tableLayout']>, default: undefined },
    rowClassName: {
      type: [String, Function] as PropType<TableProps['rowClassName']>,
      default: undefined,
    },
    title: { type: Function as PropType<TableProps['title']>, default: undefined },
    footer: { type: Function as PropType<TableProps['footer']>, default: undefined },
    id: { type: String as PropType<TableProps['id']>, default: undefined },
    showHeader: { type: Boolean as PropType<TableProps['showHeader']>, default: undefined },
    components: { type: Object as PropType<TableProps['components']>, default: undefined },
    customRow: { type: Function as PropType<TableProps['customRow']>, default: undefined },
    customHeaderRow: {
      type: Function as PropType<TableProps['customHeaderRow']>,
      default: undefined,
    },
    direction: { type: String as PropType<TableProps['direction']>, default: undefined },
    expandFixed: { type: Boolean as PropType<TableProps['expandFixed']>, default: undefined },
    expandColumnWidth: {
      type: Number as PropType<TableProps['expandColumnWidth']>,
      default: undefined,
    },
    expandedRowKeys: {
      type: Array as PropType<TableProps['expandedRowKeys']>,
      default: undefined as TableProps['expandedRowKeys'],
    },
    defaultExpandedRowKeys: {
      type: Array as PropType<TableProps['defaultExpandedRowKeys']>,
      default: undefined as TableProps['defaultExpandedRowKeys'],
    },
    expandedRowRender: {
      type: Function as PropType<TableProps['expandedRowRender']>,
      default: undefined,
    },
    expandRowByClick: {
      type: Boolean as PropType<TableProps['expandRowByClick']>,
      default: undefined,
    },
    expandIcon: { type: Function as PropType<TableProps['expandIcon']>, default: undefined },
    onExpand: { type: Function as PropType<TableProps['onExpand']>, default: undefined },
    onExpandedRowsChange: {
      type: Function as PropType<TableProps['onExpandedRowsChange']>,
      default: undefined,
    },
    defaultExpandAllRows: {
      type: Boolean as PropType<TableProps['defaultExpandAllRows']>,
      default: undefined,
    },
    indentSize: { type: Number as PropType<TableProps['indentSize']>, default: undefined },
    expandIconColumnIndex: {
      type: Number as PropType<TableProps['expandIconColumnIndex']>,
      default: undefined,
    },
    expandedRowClassName: {
      type: Function as PropType<TableProps['expandedRowClassName']>,
      default: undefined,
    },
    childrenColumnName: {
      type: String as PropType<TableProps['childrenColumnName']>,
      default: undefined,
    },
    rowExpandable: { type: Function as PropType<TableProps['rowExpandable']>, default: undefined },
    sticky: { type: String as PropType<TableProps['sticky']>, default: undefined },

    dropdownPrefixCls: String,
    dataSource: { type: Array as PropType<RcTableProps['data']>, default: undefined },
    pagination: {
      type: [Boolean, Object] as PropType<false | TablePaginationConfig>,
      default: undefined,
    },
    loading: { type: [Boolean, Object] as PropType<false | SpinProps>, default: undefined },
    size: { type: String as PropType<SizeType>, default: undefined },
    bordered: Boolean,
    locale: { type: Object as PropType<TableLocale>, default: undefined },

    onChange: {
      type: Function as PropType<
        (
          pagination: TablePaginationConfig,
          filters: Record<string, FilterValue | null>,
          sorter: SorterResult | SorterResult[],
          extra: TableCurrentDataSource,
        ) => void
      >,
      default: undefined,
    },

    rowSelection: { type: Object as PropType<TableRowSelection>, default: undefined },
    getPopupContainer: { type: Function as PropType<GetPopupContainer>, default: undefined },
    scroll: {
      type: Object as PropType<
        RcTableProps['scroll'] & {
          scrollToFirstRowOnChange?: boolean;
        }
      >,
      default: undefined,
    },
    sortDirections: { type: Array as PropType<SortOrder[]>, default: undefined },
    showSorterTooltip: {
      type: [Boolean, Object] as PropType<boolean | TooltipProps>,
      default: true,
    },
    contextSlots: {
      type: Object as PropType<ContextSlots>,
    },
    transformCellText: {
      type: Function as PropType<TableProps['transformCellText']>,
    },
  };
};

const InteralTable = defineComponent<
  TableProps & {
    contextSlots: ContextSlots;
  }
>({
  name: 'InteralTable',
  inheritAttrs: false,
  props: initDefaultProps(tableProps(), {
    rowKey: 'key',
  }) as any,
  // emits: ['expandedRowsChange', 'change', 'expand'],
  slots: [
    'emptyText',
    'expandIcon',
    'title',
    'footer',
    'summary',
    'expandedRowRender',
    'bodyCell',
    'headerCell',
    'customFilterIcon',
    'customFilterDropdown',
  ],
  setup(props, { attrs, slots, expose }) {
    devWarning(
      !(typeof props.rowKey === 'function' && props.rowKey.length > 1),
      'Table',
      '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
    );

    useProvideSlots(computed(() => props.contextSlots));

    const screens = useBreakpoint();

    const mergedColumns = computed(() => {
      const matched = new Set(Object.keys(screens).filter((m: Breakpoint) => screens[m]));

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
    const transformCellText = computed(
      () => props.transformCellText || configProvider.transformCellText,
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

    const columnTitleProps = computed(() => ({
      ...sorterTitleProps.value,
    }));
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
          : getPaginationParam(props.pagination, mergedPagination.value);

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
          devWarning(
            false,
            'Table',
            '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
          );
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
        }
        return mergedData.value;
      }

      return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
    });

    const expandIconColumnIndex = computed(() => {
      // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
      if (expandType.value === 'nest' && props.expandIconColumnIndex === undefined) {
        return props.rowSelection ? 1 : 0;
      } else if (props.expandIconColumnIndex! > 0 && props.rowSelection) {
        return props.expandIconColumnIndex - 1;
      }
      return props.expandIconColumnIndex;
    });

    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = useSelection(
      computed(() => props.rowSelection),
      {
        prefixCls,
        data: mergedData,
        pageData,
        getRowKey,
        getRecordByKey,
        expandType,
        childrenColumnName,
        locale: tableLocale,
        expandIconColumnIndex,
        getPopupContainer: computed(() => props.getPopupContainer),
      },
    );

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
            class={`${prefixCls.value}-pagination ${prefixCls.value}-pagination-${position}`}
            {...mergedPagination.value}
            size={paginationSize}
          />
        );
        const defaultPosition = direction.value === 'rtl' ? 'left' : 'right';
        const { position } = mergedPagination.value;
        if (position !== null && Array.isArray(position)) {
          const topPos = position.find(p => p.indexOf('top') !== -1);
          const bottomPos = position.find(p => p.indexOf('bottom') !== -1);
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
      );
      const tableProps = omit(props, ['columns']);
      return (
        <div class={wrapperClassNames} style={attrs.style}>
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
                  slots.emptyText?.() || tableLocale.value.emptyText || renderEmpty.value('Table'),
              }}
            />
            {bottomPaginationNode}
          </Spin>
        </div>
      );
    };
  },
});

const Table = defineComponent<TableProps>({
  name: 'ATable',
  inheritAttrs: false,
  setup(_props, { attrs, slots, expose }) {
    const table = ref();
    expose({
      table,
    });
    return () => {
      const props = attrs as TableProps;
      const columns = props.columns || convertChildrenToColumns(slots.default?.());
      return (
        <InteralTable
          ref={table}
          {...attrs}
          columns={columns || []}
          expandedRowRender={slots.expandedRowRender}
          contextSlots={{ ...slots }} // use new object, 否则slot热更新失效，原因需进一步探究
          v-slots={slots}
        />
      );
    };
  },
});

export default Table;
