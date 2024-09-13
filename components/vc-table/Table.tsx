import Header from './Header/Header';
import type {
  GetRowKey,
  ColumnsType,
  TableComponents,
  Key,
  TriggerEventHandler,
  GetComponentProps,
  PanelRender,
  TableLayout,
  RowClassName,
  CustomizeComponent,
  ColumnType,
  CustomizeScrollBody,
  TableSticky,
  ExpandedRowRender,
  RenderExpandIcon,
  TransformCellText,
  DefaultRecordType,
} from './interface';
import Body from './Body';
import useColumns from './hooks/useColumns';
import { useLayoutState, useTimeoutLock } from './hooks/useFrame';
import { getPathValue, mergeObject, validateValue, getColumnsKey } from './utils/valueUtil';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import Panel from './Panel';
import Footer from './Footer';
import { findAllChildrenKeys, renderExpandIcon } from './utils/expandUtil';
import { getCellFixedInfo } from './utils/fixUtil';
import StickyScrollBar from './stickyScrollBar';
import useSticky from './hooks/useSticky';
import FixedHolder from './FixedHolder';
import type { CSSProperties } from 'vue';
import {
  onUpdated,
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  shallowRef,
  toRef,
  toRefs,
  watch,
  watchEffect,
} from 'vue';
import { warning } from '../vc-util/warning';
import { reactivePick } from '../_util/reactivePick';
import useState from '../_util/hooks/useState';
import { toPx } from '../_util/util';
import isVisible from '../vc-util/Dom/isVisible';
import { getTargetScrollBarSize } from '../_util/getScrollBarSize';
import classNames from '../_util/classNames';
import type { EventHandler } from '../_util/EventInterface';
import VCResizeObserver from '../vc-resize-observer';
import { useProvideTable } from './context/TableContext';
import { useProvideBody } from './context/BodyContext';
import { useProvideResize } from './context/ResizeContext';
import { useProvideSticky } from './context/StickyContext';
import pickAttrs from '../_util/pickAttrs';
import { useProvideExpandedRow } from './context/ExpandedRowContext';

// Used for conditions cache
const EMPTY_DATA = [];

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

export const INTERNAL_HOOKS = 'rc-table-internal-hook';

export interface TableProps<RecordType = DefaultRecordType> {
  prefixCls?: string;
  data?: RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string };

  rowClassName?: string | RowClassName<RecordType>;

  // Additional Part
  title?: PanelRender<RecordType>;
  footer?: PanelRender<RecordType>;
  // summary?: (data: readonly RecordType[]) => any;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  customRow?: GetComponentProps<RecordType>;
  customHeaderRow?: GetComponentProps<ColumnType<RecordType>[]>;
  // emptyText?: any;

  direction?: 'ltr' | 'rtl';

  // Expandable
  expandFixed?: 'left' | 'right' | boolean;
  expandColumnWidth?: number;
  expandedRowKeys?: Key[];
  defaultExpandedRowKeys?: Key[];
  expandedRowRender?: ExpandedRowRender<RecordType>;
  expandRowByClick?: boolean;
  expandIcon?: RenderExpandIcon<RecordType>;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedKeys: Key[]) => void;
  defaultExpandAllRows?: boolean;
  indentSize?: number;
  expandIconColumnIndex?: number;
  showExpandColumn?: boolean;
  expandedRowClassName?: RowClassName<RecordType>;
  childrenColumnName?: string;
  rowExpandable?: (record: RecordType) => boolean;

  // =================================== Internal ===================================
  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalHooks?: string;

  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Used for antd table transform column with additional column
  transformColumns?: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalRefs?: {
    body: HTMLDivElement;
  };

  sticky?: boolean | TableSticky;

  canExpandable?: boolean;

  onUpdateInternalRefs?: (refs: Record<string, any>) => void;

  transformCellText?: TransformCellText<RecordType>;
}

export default defineComponent({
  name: 'VcTable',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'data',
    'columns',
    'rowKey',
    'tableLayout',
    'scroll',
    'rowClassName',
    'title',
    'footer',
    'id',
    'showHeader',
    'components',
    'customRow',
    'customHeaderRow',
    'direction',
    'expandFixed',
    'expandColumnWidth',
    'expandedRowKeys',
    'defaultExpandedRowKeys',
    'expandedRowRender',
    'expandRowByClick',
    'expandIcon',
    'onExpand',
    'onExpandedRowsChange',
    'onUpdate:expandedRowKeys',
    'defaultExpandAllRows',
    'indentSize',
    'expandIconColumnIndex',
    'expandedRowClassName',
    'childrenColumnName',
    'rowExpandable',
    'sticky',
    'transformColumns',
    'internalHooks',
    'internalRefs',
    'canExpandable',
    'onUpdateInternalRefs',
    'transformCellText',
  ],
  emits: ['expand', 'expandedRowsChange', 'updateInternalRefs', 'update:expandedRowKeys'],
  setup(props, { attrs, slots, emit }) {
    const mergedData = computed(() => props.data || EMPTY_DATA);
    const hasData = computed(() => !!mergedData.value.length);
    // ==================== Customize =====================
    const mergedComponents = computed(() =>
      mergeObject<TableComponents<any>>(props.components, {}),
    );

    const getComponent = (path, defaultComponent?: string) =>
      getPathValue<CustomizeComponent, TableComponents<any>>(mergedComponents.value, path) ||
      defaultComponent;

    const getRowKey = computed(() => {
      const rowKey = props.rowKey;
      if (typeof rowKey === 'function') {
        return rowKey;
      }
      return record => {
        const key = record && record[rowKey];

        if (process.env.NODE_ENV !== 'production') {
          warning(
            key !== undefined,
            'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
          );
        }

        return key;
      };
    });

    // ====================== Expand ======================

    const mergedExpandIcon = computed(() => props.expandIcon || renderExpandIcon);

    const mergedChildrenColumnName = computed(() => props.childrenColumnName || 'children');

    const expandableType = computed(() => {
      if (props.expandedRowRender) {
        return 'row';
      }
      /* eslint-disable no-underscore-dangle */
      /**
       * Fix https://github.com/ant-design/ant-design/issues/21154
       * This is a workaround to not to break current behavior.
       * We can remove follow code after final release.
       *
       * To other developer:
       *  Do not use `__PARENT_RENDER_ICON__` in prod since we will remove this when refactor
       */
      if (
        props.canExpandable ||
        mergedData.value.some(
          record => record && typeof record === 'object' && record[mergedChildrenColumnName.value],
        )
      ) {
        return 'nest';
      }
      /* eslint-enable */
      return false;
    });

    const innerExpandedKeys = shallowRef([]);
    const stop = watchEffect(() => {
      if (props.defaultExpandedRowKeys) {
        innerExpandedKeys.value = props.defaultExpandedRowKeys;
      }
      if (props.defaultExpandAllRows) {
        innerExpandedKeys.value = findAllChildrenKeys(
          mergedData.value,
          getRowKey.value,
          mergedChildrenColumnName.value,
        );
      }
    });
    // defalutXxxx 仅仅第一次生效
    stop();

    const mergedExpandedKeys = computed<Set<Key>>(
      () => new Set(props.expandedRowKeys || innerExpandedKeys.value || []),
    );

    const onTriggerExpand: TriggerEventHandler<any> = record => {
      const key = getRowKey.value(record, mergedData.value.indexOf(record));

      let newExpandedKeys: Key[];
      const hasKey = mergedExpandedKeys.value.has(key);
      if (hasKey) {
        mergedExpandedKeys.value.delete(key);
        newExpandedKeys = [...(mergedExpandedKeys.value as any)];
      } else {
        newExpandedKeys = [...(mergedExpandedKeys.value as any), key];
      }
      innerExpandedKeys.value = newExpandedKeys;

      emit('expand', !hasKey, record);
      emit('update:expandedRowKeys', newExpandedKeys);
      emit('expandedRowsChange', newExpandedKeys);
    };

    // Warning if use `expandedRowRender` and nest children in the same time
    if (
      process.env.NODE_ENV !== 'production' &&
      props.expandedRowRender &&
      mergedData.value.some(record => {
        return Array.isArray(record?.[mergedChildrenColumnName.value]);
      })
    ) {
      warning(false, '`expandedRowRender` should not use with nested Table');
    }

    const componentWidth = ref(0);

    const [columns, flattenColumns] = useColumns(
      {
        ...toRefs(props),

        // children,
        expandable: computed(() => !!props.expandedRowRender),
        expandedKeys: mergedExpandedKeys,
        getRowKey,
        onTriggerExpand,
        expandIcon: mergedExpandIcon,
      },
      computed(() => (props.internalHooks === INTERNAL_HOOKS ? props.transformColumns : null)),
    );

    const columnContext = computed(() => ({
      columns: columns.value,
      flattenColumns: flattenColumns.value,
    }));

    // ====================== Scroll ======================
    const fullTableRef = ref<HTMLDivElement>();
    const scrollHeaderRef = ref<HTMLDivElement>();
    const scrollBodyRef = ref<HTMLDivElement>();
    const scrollBodySizeInfo = ref<{ scrollWidth: number; clientWidth: number }>({
      scrollWidth: 0,
      clientWidth: 0,
    });
    const scrollSummaryRef = ref<HTMLDivElement>();
    const [pingedLeft, setPingedLeft] = useState(false);
    const [pingedRight, setPingedRight] = useState(false);
    const [colsWidths, updateColsWidths] = useLayoutState(new Map<Key, number>());

    // Convert map to number width
    const colsKeys = computed(() => getColumnsKey(flattenColumns.value));
    const colWidths = computed(() =>
      colsKeys.value.map(columnKey => colsWidths.value.get(columnKey)),
    );
    const columnCount = computed(() => flattenColumns.value.length);
    const stickyOffsets = useStickyOffsets(colWidths, columnCount, toRef(props, 'direction'));
    const fixHeader = computed(() => props.scroll && validateValue(props.scroll.y));
    const horizonScroll = computed(
      () => (props.scroll && validateValue(props.scroll.x)) || Boolean(props.expandFixed),
    );
    const fixColumn = computed(
      () => horizonScroll.value && flattenColumns.value.some(({ fixed }) => fixed),
    );

    // Sticky
    const stickyRef = ref<{ setScrollLeft: (left: number) => void }>();
    const stickyState = useSticky(toRef(props, 'sticky'), toRef(props, 'prefixCls'));

    const summaryFixedInfos = reactive<Record<string, boolean | string>>({});
    const fixFooter = computed(() => {
      const info = Object.values(summaryFixedInfos)[0];
      return (fixHeader.value || stickyState.value.isSticky) && info;
    });

    const summaryCollect = (uniKey: string, fixed: boolean | string) => {
      if (fixed) {
        summaryFixedInfos[uniKey] = fixed;
      } else {
        delete summaryFixedInfos[uniKey];
      }
    };

    // Scroll
    const scrollXStyle = ref<CSSProperties>({});
    const scrollYStyle = ref<CSSProperties>({});
    const scrollTableStyle = ref<CSSProperties>({});

    watchEffect(() => {
      if (fixHeader.value) {
        scrollYStyle.value = {
          overflowY: 'scroll',
          maxHeight: toPx(props.scroll.y),
        };
      }

      if (horizonScroll.value) {
        scrollXStyle.value = { overflowX: 'auto' };
        // When no vertical scrollbar, should hide it
        // https://github.com/ant-design/ant-design/pull/20705
        // https://github.com/ant-design/ant-design/issues/21879
        if (!fixHeader.value) {
          scrollYStyle.value = { overflowY: 'hidden' };
        }
        scrollTableStyle.value = {
          width: props.scroll.x === true ? 'auto' : toPx(props.scroll.x),
          minWidth: '100%',
        };
      }
    });

    const onColumnResize = (columnKey: Key, width: number) => {
      if (isVisible(fullTableRef.value)) {
        updateColsWidths(widths => {
          if (widths.get(columnKey) !== width) {
            const newWidths = new Map(widths);
            newWidths.set(columnKey, width);
            return newWidths;
          }
          return widths;
        });
      }
    };

    const [setScrollTarget, getScrollTarget] = useTimeoutLock(null);

    function forceScroll(scrollLeft: number, target: HTMLDivElement | ((left: number) => void)) {
      if (!target) {
        return;
      }

      if (typeof target === 'function') {
        target(scrollLeft);
        return;
      }
      const domTarget = (target as any).$el || target;
      if (domTarget.scrollLeft !== scrollLeft) {
        // eslint-disable-next-line no-param-reassign
        domTarget.scrollLeft = scrollLeft;
      }
    }

    const onScroll: EventHandler = ({
      currentTarget,
      scrollLeft,
    }: {
      currentTarget: HTMLElement;
      scrollLeft?: number;
    }) => {
      const isRTL = props.direction === 'rtl';
      const mergedScrollLeft =
        typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;

      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);

        forceScroll(mergedScrollLeft, scrollHeaderRef.value);
        forceScroll(mergedScrollLeft, scrollBodyRef.value);
        forceScroll(mergedScrollLeft, scrollSummaryRef.value);
        forceScroll(mergedScrollLeft, stickyRef.value?.setScrollLeft);
      }

      if (currentTarget) {
        const { scrollWidth, clientWidth } = currentTarget;
        if (isRTL) {
          setPingedLeft(-mergedScrollLeft < scrollWidth - clientWidth);
          setPingedRight(-mergedScrollLeft > 0);
        } else {
          setPingedLeft(mergedScrollLeft > 0);
          setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
        }
      }
    };

    const triggerOnScroll = () => {
      if (horizonScroll.value && scrollBodyRef.value) {
        onScroll({ currentTarget: scrollBodyRef.value });
      } else {
        setPingedLeft(false);
        setPingedRight(false);
      }
    };
    let timtout;
    const updateWidth = (width: number) => {
      if (width !== componentWidth.value) {
        triggerOnScroll();
        componentWidth.value = fullTableRef.value ? fullTableRef.value.offsetWidth : width;
      }
    };
    const onFullTableResize = ({ width }) => {
      clearTimeout(timtout);
      if (componentWidth.value === 0) {
        updateWidth(width);
        return;
      }
      timtout = setTimeout(() => {
        updateWidth(width);
      }, 100);
    };

    watch(
      [horizonScroll, () => props.data, () => props.columns],
      () => {
        if (horizonScroll.value) {
          triggerOnScroll();
        }
      },
      { flush: 'post' },
    );

    const [scrollbarSize, setScrollbarSize] = useState(0);
    useProvideSticky();
    onMounted(() => {
      nextTick(() => {
        triggerOnScroll();
        setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.value).width);
        scrollBodySizeInfo.value = {
          scrollWidth: scrollBodyRef.value?.scrollWidth || 0,
          clientWidth: scrollBodyRef.value?.clientWidth || 0,
        };
      });
    });
    onUpdated(() => {
      nextTick(() => {
        const scrollWidth = scrollBodyRef.value?.scrollWidth || 0;
        const clientWidth = scrollBodyRef.value?.clientWidth || 0;
        if (
          scrollBodySizeInfo.value.scrollWidth !== scrollWidth ||
          scrollBodySizeInfo.value.clientWidth !== clientWidth
        ) {
          scrollBodySizeInfo.value = {
            scrollWidth,
            clientWidth,
          };
        }
      });
    });

    watchEffect(
      () => {
        if (props.internalHooks === INTERNAL_HOOKS && props.internalRefs) {
          props.onUpdateInternalRefs({
            body: scrollBodyRef.value
              ? (scrollBodyRef.value as any).$el || scrollBodyRef.value
              : null,
          });
        }
      },
      { flush: 'post' },
    );

    // Table layout
    const mergedTableLayout = computed(() => {
      if (props.tableLayout) {
        return props.tableLayout;
      }
      // https://github.com/ant-design/ant-design/issues/25227
      // When scroll.x is max-content, no need to fix table layout
      // it's width should stretch out to fit content
      if (fixColumn.value) {
        return props.scroll.x === 'max-content' ? 'auto' : 'fixed';
      }
      if (
        fixHeader.value ||
        stickyState.value.isSticky ||
        flattenColumns.value.some(({ ellipsis }) => ellipsis)
      ) {
        return 'fixed';
      }
      return 'auto';
    });

    const emptyNode = () => {
      return hasData.value ? null : slots.emptyText?.() || 'No Data';
    };
    useProvideTable(
      reactive({
        ...toRefs(reactivePick(props, 'prefixCls', 'direction', 'transformCellText')),
        getComponent,
        scrollbarSize,
        fixedInfoList: computed(() =>
          flattenColumns.value.map((_, colIndex) =>
            getCellFixedInfo(
              colIndex,
              colIndex,
              flattenColumns.value,
              stickyOffsets.value,
              props.direction,
            ),
          ),
        ),
        isSticky: computed(() => stickyState.value.isSticky),
        summaryCollect,
      }),
    );
    useProvideBody(
      reactive({
        ...toRefs(
          reactivePick(
            props,
            'rowClassName',
            'expandedRowClassName',
            'expandRowByClick',
            'expandedRowRender',
            'expandIconColumnIndex',
            'indentSize',
          ),
        ),
        columns,
        flattenColumns,
        tableLayout: mergedTableLayout,
        expandIcon: mergedExpandIcon,
        expandableType,
        onTriggerExpand,
      }),
    );

    useProvideResize({
      onColumnResize,
    });

    useProvideExpandedRow({
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,
    });

    // Body
    const bodyTable = () => (
      <Body
        data={mergedData.value}
        measureColumnWidth={fixHeader.value || horizonScroll.value || stickyState.value.isSticky}
        expandedKeys={mergedExpandedKeys.value}
        rowExpandable={props.rowExpandable}
        getRowKey={getRowKey.value}
        customRow={props.customRow}
        childrenColumnName={mergedChildrenColumnName.value}
        v-slots={{ emptyNode }}
      />
    );

    const bodyColGroup = () => (
      <ColGroup
        colWidths={flattenColumns.value.map(({ width }) => width)}
        columns={flattenColumns.value}
      />
    );
    return () => {
      const {
        prefixCls,
        scroll,
        tableLayout,
        direction,

        // Additional Part
        title = slots.title,
        footer = slots.footer,

        // Customize
        id,
        showHeader,
        customHeaderRow,
      } = props;
      const { isSticky, offsetHeader, offsetSummary, offsetScroll, stickyClassName, container } =
        stickyState.value;
      const TableComponent = getComponent(['table'], 'table');
      const customizeScrollBody = getComponent(['body']) as unknown as CustomizeScrollBody<any>;
      const summaryNode = slots.summary?.({ pageData: mergedData.value });

      let groupTableNode = () => null;

      // Header props
      const headerProps = {
        colWidths: colWidths.value,
        columCount: flattenColumns.value.length,
        stickyOffsets: stickyOffsets.value,
        customHeaderRow,
        fixHeader: fixHeader.value,
        scroll,
      };

      if (
        process.env.NODE_ENV !== 'production' &&
        typeof customizeScrollBody === 'function' &&
        hasData.value &&
        !fixHeader.value
      ) {
        warning(false, '`components.body` with render props is only work on `scroll.y`.');
      }
      if (fixHeader.value || isSticky) {
        // >>>>>> Fixed Header
        let bodyContent = () => null;

        if (typeof customizeScrollBody === 'function') {
          bodyContent = () =>
            customizeScrollBody(mergedData.value, {
              scrollbarSize: scrollbarSize.value,
              ref: scrollBodyRef,
              onScroll,
            });

          headerProps.colWidths = flattenColumns.value.map(({ width }, index) => {
            const colWidth =
              index === columns.value.length - 1 ? (width as number) - scrollbarSize.value : width;
            if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
              return colWidth;
            }
            warning(
              false,
              'When use `components.body` with render props. Each column should have a fixed `width` value.',
            );

            return 0;
          }) as number[];
        } else {
          bodyContent = () => (
            <div
              style={{
                ...scrollXStyle.value,
                ...scrollYStyle.value,
              }}
              onScroll={onScroll}
              ref={scrollBodyRef}
              class={classNames(`${prefixCls}-body`)}
            >
              <TableComponent
                style={{
                  ...scrollTableStyle.value,
                  tableLayout: mergedTableLayout.value,
                }}
              >
                {bodyColGroup()}
                {bodyTable()}
                {!fixFooter.value && summaryNode && (
                  <Footer stickyOffsets={stickyOffsets.value} flattenColumns={flattenColumns.value}>
                    {summaryNode}
                  </Footer>
                )}
              </TableComponent>
            </div>
          );
        }

        // Fixed holder share the props
        const fixedHolderProps = {
          noData: !mergedData.value.length,
          maxContentScroll: horizonScroll.value && scroll.x === 'max-content',
          ...headerProps,
          ...columnContext.value,
          direction,
          stickyClassName,
          onScroll,
        };

        groupTableNode = () => (
          <>
            {/* Header Table */}
            {showHeader !== false && (
              <FixedHolder
                {...fixedHolderProps}
                stickyTopOffset={offsetHeader}
                class={`${prefixCls}-header`}
                ref={scrollHeaderRef}
                v-slots={{
                  default: fixedHolderPassProps => (
                    <>
                      <Header {...fixedHolderPassProps} />
                      {fixFooter.value === 'top' && (
                        <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>
                      )}
                    </>
                  ),
                }}
              ></FixedHolder>
            )}

            {/* Body Table */}
            {bodyContent()}

            {/* Summary Table */}
            {fixFooter.value && fixFooter.value !== 'top' && (
              <FixedHolder
                {...fixedHolderProps}
                stickyBottomOffset={offsetSummary}
                class={`${prefixCls}-summary`}
                ref={scrollSummaryRef}
                v-slots={{
                  default: fixedHolderPassProps => (
                    <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>
                  ),
                }}
              ></FixedHolder>
            )}

            {isSticky && scrollBodyRef.value && (
              <StickyScrollBar
                ref={stickyRef}
                offsetScroll={offsetScroll}
                scrollBodyRef={scrollBodyRef}
                onScroll={onScroll}
                container={container}
                scrollBodySizeInfo={scrollBodySizeInfo.value}
              />
            )}
          </>
        );
      } else {
        // >>>>>> Unique table
        groupTableNode = () => (
          <div
            style={{
              ...scrollXStyle.value,
              ...scrollYStyle.value,
            }}
            class={classNames(`${prefixCls}-content`)}
            onScroll={onScroll}
            ref={scrollBodyRef}
          >
            <TableComponent
              style={{ ...scrollTableStyle.value, tableLayout: mergedTableLayout.value }}
            >
              {bodyColGroup()}
              {showHeader !== false && <Header {...headerProps} {...columnContext.value} />}
              {bodyTable()}
              {summaryNode && (
                <Footer stickyOffsets={stickyOffsets.value} flattenColumns={flattenColumns.value}>
                  {summaryNode}
                </Footer>
              )}
            </TableComponent>
          </div>
        );
      }
      const ariaProps = pickAttrs(attrs, { aria: true, data: true });
      const fullTable = () => (
        <div
          {...ariaProps}
          class={classNames(prefixCls, {
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-ping-left`]: pingedLeft.value,
            [`${prefixCls}-ping-right`]: pingedRight.value,
            [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
            [`${prefixCls}-fixed-header`]: fixHeader.value,
            /** No used but for compatible */
            [`${prefixCls}-fixed-column`]: fixColumn.value,
            [`${prefixCls}-scroll-horizontal`]: horizonScroll.value,
            [`${prefixCls}-has-fix-left`]: flattenColumns.value[0] && flattenColumns.value[0].fixed,
            [`${prefixCls}-has-fix-right`]:
              flattenColumns.value[columnCount.value - 1] &&
              flattenColumns.value[columnCount.value - 1].fixed === 'right',
            [attrs.class as string]: attrs.class,
          })}
          style={attrs.style as CSSProperties}
          id={id}
          ref={fullTableRef}
        >
          {title && <Panel class={`${prefixCls}-title`}>{title(mergedData.value)}</Panel>}
          <div class={`${prefixCls}-container`}>{groupTableNode()}</div>
          {footer && <Panel class={`${prefixCls}-footer`}>{footer(mergedData.value)}</Panel>}
        </div>
      );

      if (horizonScroll.value) {
        return (
          <VCResizeObserver
            onResize={onFullTableResize}
            v-slots={{ default: fullTable }}
          ></VCResizeObserver>
        );
      }
      return fullTable();
    };
  },
});
