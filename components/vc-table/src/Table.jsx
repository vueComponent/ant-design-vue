/* eslint-disable camelcase */
import {
  provide,
  markRaw,
  defineComponent,
  nextTick,
  reactive,
  computed,
  ref,
  onUpdated,
  onMounted,
  toRef,
} from 'vue';
import shallowequal from '../../_util/shallowequal';
import merge from 'lodash-es/merge';
import classes from '../../_util/component-classes';
import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { debounce, getColumnsKey, getDataAndAriaProps, validateValue } from './utils';
import warning from '../../_util/warning';
import addEventListener from '../../vc-util/Dom/addEventListener';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';
import { initDefaultProps, getOptionProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import { useLayoutState } from '../../_util/hooks/useLayoutState';
import useColumnManager from './useColumnManager';
import useStickyOffsets from './useStickyOffsets';
import { getCellFixedInfo } from './fixUtil';
import ResizeObserver from '../../vc-resize-observer';

export default defineComponent({
  name: 'Table',
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(
    {
      data: PropTypes.array,
      useFixedHeader: PropTypes.looseBool,
      columns: PropTypes.array,
      prefixCls: PropTypes.string,
      bodyStyle: PropTypes.object,
      rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      customRow: PropTypes.func,
      customHeaderRow: PropTypes.func,
      // onRowClick: PropTypes.func,
      // onRowDoubleClick: PropTypes.func,
      // onRowContextMenu: PropTypes.func,
      // onRowMouseEnter: PropTypes.func,
      // onRowMouseLeave: PropTypes.func,
      showHeader: PropTypes.looseBool,
      title: PropTypes.func,
      id: PropTypes.string,
      footer: PropTypes.func,
      emptyText: PropTypes.any,
      scroll: PropTypes.object,
      rowRef: PropTypes.func,
      // getBodyWrapper: PropTypes.func,
      components: PropTypes.shape({
        table: PropTypes.any,
        header: PropTypes.shape({
          wrapper: PropTypes.any,
          row: PropTypes.any,
          cell: PropTypes.any,
        }).loose,
        body: PropTypes.shape({
          wrapper: PropTypes.any,
          row: PropTypes.any,
          cell: PropTypes.any,
        }).loose,
      }).loose,
      expandIconAsCell: PropTypes.looseBool,
      expandedRowKeys: PropTypes.array,
      expandedRowClassName: PropTypes.func,
      defaultExpandAllRows: PropTypes.looseBool,
      defaultExpandedRowKeys: PropTypes.array,
      expandIconColumnIndex: PropTypes.number,
      expandedRowRender: PropTypes.func,
      childrenColumnName: PropTypes.string,
      indentSize: PropTypes.number,
      expandRowByClick: PropTypes.looseBool,
      expandIcon: PropTypes.func,
      tableLayout: PropTypes.string,
      transformCellText: PropTypes.func,
    },
    {
      data: [],
      useFixedHeader: false,
      rowKey: 'key',
      rowClassName: () => '',
      prefixCls: 'rc-table',
      bodyStyle: {},
      showHeader: true,
      scroll: {},
      rowRef: () => null,
      emptyText: () => 'No Data',
      customHeaderRow: () => {},
    },
  ),
  setup(props) {
    const columnManager = useColumnManager(toRef(props, 'columns'));
    const colsKeys = computed(() => getColumnsKey(columnManager.leafColumns.value));
    const [colsWidths, updateColsWidths] = useLayoutState(new Map());
    const pureColWidths = computed(() =>
      colsKeys.value.map(columnKey => colsWidths.value.get(columnKey)),
    );
    const stickyOffsets = useStickyOffsets(pureColWidths, columnManager.leafColumns);
    const onColumnResize = (columnKey, width) => {
      updateColsWidths(widths => {
        if (widths.get(columnKey) !== width) {
          const newWidths = new Map(widths);
          newWidths.set(columnKey, width);
          return newWidths;
        }
        return widths;
      });
    };
    const fixedInfoList = computed(() =>
      columnManager.leafColumns.value.map((_, colIndex) =>
        getCellFixedInfo(colIndex, colIndex, columnManager.leafColumns.value, stickyOffsets.value),
      ),
    );
    const store = reactive({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {},
      expandedRowsHeight: {},
      expandedRowKeys: [],
      columnManager,
      fixedInfoList,
      stickyOffsets,
    });
    provide('table-store', store);
    const bodyRef = ref();
    const pingedLeft = ref(false);
    const pingedRight = ref(false);
    const horizonScroll = computed(() => props.scroll && validateValue(props.scroll.x));
    const onScroll = currentTarget => {
      const { scrollWidth, clientWidth, scrollLeft } = currentTarget;
      pingedLeft.value = scrollLeft > 0;
      pingedRight.value = scrollLeft < scrollWidth - clientWidth;
    };
    onUpdated(() => {
      nextTick(() => {
        horizonScroll.value && onScroll(bodyRef.value.$el);
      });
    });
    onMounted(() => {
      nextTick(() => {
        horizonScroll.value && onScroll(bodyRef.value.$el);
      });
    });
    const onFullTableResize = () => {
      horizonScroll.value && onScroll(bodyRef.value.$el);
    };
    return {
      bodyRef,
      store,
      onColumnResize,
      columnManager,
      onScroll,
      pingedLeft,
      pingedRight,
      onFullTableResize,
    };
  },
  data() {
    this.preData = [...this.data];
    return {
      sComponents: markRaw(
        merge(
          {
            table: 'table',
            header: {
              wrapper: 'thead',
              row: 'tr',
              cell: 'th',
            },
            body: {
              wrapper: 'tbody',
              row: 'tr',
              cell: 'td',
            },
          },
          this.components,
        ),
      ),
    };
  },
  computed: {
    dataLen() {
      return this.$props.data.length;
    },
  },
  watch: {
    components() {
      this._components = merge(
        {
          table: 'table',
          header: {
            wrapper: 'thead',
            row: 'tr',
            cell: 'th',
          },
          body: {
            wrapper: 'tbody',
            row: 'tr',
            cell: 'td',
          },
        },
        this.components,
      );
    },
    dataLen(val, preVal) {
      if ((val === 0 || preVal === 0) && this.hasScrollX()) {
        nextTick(() => {
          this.resetScrollX();
        });
      }
    },
  },
  created() {
    provide('table', this);

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  },

  mounted() {
    this.$nextTick(() => {
      if (this.columnManager.isAnyColumnsFixed.value) {
        this.handleWindowResize();
        this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
      }
      // https://github.com/ant-design/ant-design/issues/11635
      if (this.ref_headTable) {
        this.ref_headTable.scrollLeft = 0;
      }
      if (this.ref_bodyTable) {
        this.ref_bodyTable.scrollLeft = 0;
      }
    });
  },

  updated() {
    this.$nextTick(() => {
      if (this.columnManager.isAnyColumnsFixed.value) {
        this.handleWindowResize();
        if (!this.resizeEvent) {
          this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
        }
      }
    });
  },

  beforeUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  },
  methods: {
    getRowKey(record, index) {
      const rowKey = this.rowKey;
      const key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warning(
        key !== undefined,
        'Each record in table should have a unique `key` prop,' +
          'or set `rowKey` to an unique primary key.',
      );
      return key === undefined ? index : key;
    },

    setScrollPosition(position) {
      this.scrollPosition = position;
      if (this.tableNode) {
        const { prefixCls } = this;
        if (position === 'both') {
          classes(this.tableNode)
            .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
            .add(`${prefixCls}-scroll-position-left`)
            .add(`${prefixCls}-scroll-position-right`);
        } else {
          classes(this.tableNode)
            .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
            .add(`${prefixCls}-scroll-position-${position}`);
        }
      }
    },

    setScrollPositionClassName() {
      const node = this.ref_bodyTable;
      const scrollToLeft = node.scrollLeft === 0;
      const scrollToRight =
        node.scrollLeft + 1 >=
        node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
      if (scrollToLeft && scrollToRight) {
        this.setScrollPosition('both');
      } else if (scrollToLeft) {
        this.setScrollPosition('left');
      } else if (scrollToRight) {
        this.setScrollPosition('right');
      } else if (this.scrollPosition !== 'middle') {
        this.setScrollPosition('middle');
      }
    },

    isTableLayoutFixed() {
      const { tableLayout, columns = [], useFixedHeader, scroll = {} } = this.$props;
      if (typeof tableLayout !== 'undefined') {
        return tableLayout === 'fixed';
      }
      // if one column is ellipsis, use fixed table layout to fix align issue
      if (columns.some(({ ellipsis }) => !!ellipsis)) {
        return true;
      }
      // if header fixed, use fixed table layout to fix align issue
      if (useFixedHeader || scroll.y) {
        return true;
      }
      // if scroll.x is number/px/% width value, we should fixed table layout
      // to avoid long word layout broken issue
      if (scroll.x && scroll.x !== true && scroll.x !== 'max-content') {
        return true;
      }
      return false;
    },

    handleWindowResize() {
      this.syncFixedTableRowHeight();
      this.setScrollPositionClassName();
    },

    syncFixedTableRowHeight() {
      const tableRect = this.tableNode.getBoundingClientRect();
      // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
      // see: https://github.com/ant-design/ant-design/issues/4836
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return;
      }
      const { prefixCls } = this;
      const headRows = this.ref_headTable
        ? this.ref_headTable.querySelectorAll('thead')
        : this.ref_bodyTable.querySelectorAll('thead');
      const bodyRows = this.ref_bodyTable.querySelectorAll(`.${prefixCls}-row`) || [];
      const fixedColumnsHeadRowsHeight = [].map.call(headRows, row => {
        return row.getBoundingClientRect().height
          ? row.getBoundingClientRect().height - 0.5
          : 'auto';
      });
      const state = this.store;
      const fixedColumnsBodyRowsHeight = [].reduce.call(
        bodyRows,
        (acc, row) => {
          const rowKey = row.getAttribute('data-row-key');
          const height =
            row.getBoundingClientRect().height ||
            state.fixedColumnsBodyRowsHeight[rowKey] ||
            'auto';
          acc[rowKey] = height;
          return acc;
        },
        {},
      );
      if (
        shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
        shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)
      ) {
        return;
      }
      this.store.fixedColumnsHeadRowsHeight = fixedColumnsHeadRowsHeight;
      this.store.fixedColumnsBodyRowsHeight = fixedColumnsBodyRowsHeight;
    },

    resetScrollX() {
      if (this.ref_headTable) {
        this.ref_headTable.scrollLeft = 0;
      }
      if (this.ref_bodyTable) {
        this.ref_bodyTable.scrollLeft = 0;
      }
    },

    hasScrollX() {
      const { scroll = {} } = this;
      return 'x' in scroll;
    },

    handleBodyScrollLeft(e) {
      const target = e.target;
      const { scroll = {} } = this;
      const { ref_headTable, ref_bodyTable } = this;
      if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
        if (target === ref_bodyTable && ref_headTable) {
          ref_headTable.scrollLeft = target.scrollLeft;
        } else if (target === ref_headTable && ref_bodyTable) {
          ref_bodyTable.scrollLeft = target.scrollLeft;
        }
        this.setScrollPositionClassName();
      }
      // Remember last scrollLeft for scroll direction detecting.
      this.lastScrollLeft = target.scrollLeft;
    },

    handleBodyScrollTop(e) {
      const target = e.target;
      // Fix https://github.com/ant-design/ant-design/issues/9033
      if (e.currentTarget !== target) {
        return;
      }
      const { scroll = {} } = this;
      const { ref_headTable, ref_bodyTable, ref_fixedColumnsBodyLeft, ref_fixedColumnsBodyRight } =
        this;
      if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== ref_headTable) {
        const scrollTop = target.scrollTop;
        if (ref_fixedColumnsBodyLeft && target !== ref_fixedColumnsBodyLeft) {
          ref_fixedColumnsBodyLeft.scrollTop = scrollTop;
        }
        if (ref_fixedColumnsBodyRight && target !== ref_fixedColumnsBodyRight) {
          ref_fixedColumnsBodyRight.scrollTop = scrollTop;
        }
        if (ref_bodyTable && target !== ref_bodyTable) {
          ref_bodyTable.scrollTop = scrollTop;
        }
      }
      // Remember last scrollTop for scroll direction detecting.
      this.lastScrollTop = target.scrollTop;
    },
    handleBodyScroll(e) {
      this.onScroll(e.target);
      this.handleBodyScrollLeft(e);
      this.handleBodyScrollTop(e);
    },
    handleWheel(event) {
      const { scroll = {} } = this.$props;
      if (window.navigator.userAgent.match(/Trident\/7\./) && scroll.y) {
        event.preventDefault();
        const wd = event.deltaY;
        const target = event.target;
        const {
          ref_bodyTable: bodyTable,
          ref_fixedColumnsBodyLeft: fixedColumnsBodyLeft,
          ref_fixedColumnsBodyRight: fixedColumnsBodyRight,
        } = this;
        let scrollTop = 0;

        if (this.lastScrollTop) {
          scrollTop = this.lastScrollTop + wd;
        } else {
          scrollTop = wd;
        }

        if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
          fixedColumnsBodyLeft.scrollTop = scrollTop;
        }
        if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
          fixedColumnsBodyRight.scrollTop = scrollTop;
        }
        if (bodyTable && target !== bodyTable) {
          bodyTable.scrollTop = scrollTop;
        }
      }
    },
    // saveChildrenRef(name, node) {
    //   this[`ref_${name}`] = node;
    // },
    saveRef(name) {
      return node => {
        this[`ref_${name}`] = node;
      };
    },

    saveTableNodeRef(node) {
      this.tableNode = node;
    },
    renderMainTable() {
      const { scroll, prefixCls } = this;
      const isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed.value;
      const scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

      const table = [
        this.renderTable({
          columns: this.columnManager.groupedColumns.value,
          isAnyColumnsFixed,
        }),
        this.renderEmptyText(),
        this.renderFooter(),
      ];

      return scrollable ? (
        <ResizeObserver onResize={this.onFullTableResize}>
          <div class={`${prefixCls}-scroll`}>{table}</div>
        </ResizeObserver>
      ) : (
        table
      );
    },

    renderTable(options) {
      const { columns, isAnyColumnsFixed } = options;
      const { prefixCls, scroll = {} } = this;
      const tableClassName = scroll.x ? `${prefixCls}-fixed` : '';

      const headTable = (
        <HeadTable
          key="head"
          columns={columns}
          tableClassName={tableClassName}
          handleBodyScrollLeft={this.handleBodyScrollLeft}
          expander={this.expander}
        />
      );

      const bodyTable = (
        <BodyTable
          key="body"
          columns={columns}
          tableClassName={tableClassName}
          getRowKey={this.getRowKey}
          handleWheel={this.handleWheel}
          handleBodyScroll={this.handleBodyScroll}
          expander={this.expander}
          isAnyColumnsFixed={isAnyColumnsFixed}
          ref="bodyRef"
        />
      );

      return [headTable, bodyTable];
    },

    renderTitle() {
      const { title, prefixCls, data } = this;
      return title ? (
        <div class={`${prefixCls}-title`} key="title">
          {title(data)}
        </div>
      ) : null;
    },

    renderFooter() {
      const { footer, prefixCls, data } = this;
      return footer ? (
        <div class={`${prefixCls}-footer`} key="footer">
          {footer(data)}
        </div>
      ) : null;
    },

    renderEmptyText() {
      const { emptyText, prefixCls, data } = this;
      if (data.length) {
        return null;
      }
      const emptyClassName = `${prefixCls}-placeholder`;
      return (
        <div class={emptyClassName} key="emptyText">
          {typeof emptyText === 'function' ? emptyText() : emptyText}
        </div>
      );
    },
  },

  render() {
    const props = { ...getOptionProps(this), ...this.$attrs };
    const { columnManager, getRowKey } = this;
    const prefixCls = props.prefixCls;

    const tableClassName = classNames(props.prefixCls, props.class, {
      [`${prefixCls}-fixed-header`]: props.useFixedHeader || (props.scroll && props.scroll.y),
      [`${prefixCls}-scroll-position-left ${prefixCls}-scroll-position-right`]:
        this.scrollPosition === 'both',
      [`${prefixCls}-scroll-position-${this.scrollPosition}`]: this.scrollPosition !== 'both',
      [`${prefixCls}-layout-fixed`]: this.isTableLayoutFixed(),
      [`${prefixCls}-ping-left`]: this.pingedLeft,
      [`${prefixCls}-ping-right`]: this.pingedRight,
    });
    const dataAndAriaProps = getDataAndAriaProps(props);
    const expandableTableProps = {
      ...props,
      columnManager,
      getRowKey,
    };
    return (
      <ExpandableTable
        {...expandableTableProps}
        v-slots={{
          default: expander => {
            this.expander = expander;
            return (
              <div
                ref={this.saveTableNodeRef}
                class={tableClassName}
                style={props.style}
                id={props.id}
                {...dataAndAriaProps}
              >
                {this.renderTitle()}
                <div class={`${prefixCls}-content`}>{this.renderMainTable()}</div>
              </div>
            );
          },
        }}
      />
    );
  },
});
