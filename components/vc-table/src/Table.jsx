/* eslint-disable camelcase */
import shallowequal from 'shallowequal';
import merge from 'lodash/merge';
import classes from 'component-classes';
import classNames from 'classnames';
import PropTypes from '../../_util/vue-types';
import { debounce } from './utils';
import warning from '../../_util/warning';
import addEventListener from '../../vc-util/Dom/addEventListener';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';
import { initDefaultProps, getOptionProps, getListeners } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';
import Vue from 'vue';

export default {
  name: 'Table',
  mixins: [BaseMixin],
  provide() {
    return { 'table-store': this.store, table: this };
  },
  props: initDefaultProps(
    {
      data: PropTypes.array,
      useFixedHeader: PropTypes.bool,
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
      showHeader: PropTypes.bool,
      title: PropTypes.func,
      id: PropTypes.string,
      footer: PropTypes.func,
      emptyText: PropTypes.any,
      scroll: PropTypes.object,
      rowRef: PropTypes.func,
      getBodyWrapper: PropTypes.func,
      components: PropTypes.shape({
        table: PropTypes.any,
        header: PropTypes.shape({
          wrapper: PropTypes.any,
          row: PropTypes.any,
          cell: PropTypes.any,
        }),
        body: PropTypes.shape({
          wrapper: PropTypes.any,
          row: PropTypes.any,
          cell: PropTypes.any,
        }),
      }),
      expandIconAsCell: PropTypes.bool,
      expandedRowKeys: PropTypes.array,
      expandedRowClassName: PropTypes.func,
      defaultExpandAllRows: PropTypes.bool,
      defaultExpandedRowKeys: PropTypes.array,
      expandIconColumnIndex: PropTypes.number,
      expandedRowRender: PropTypes.func,
      childrenColumnName: PropTypes.string,
      indentSize: PropTypes.number,
      expandRowByClick: PropTypes.bool,
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
  data() {
    this.preData = [...this.data];
    this.store = (this.$root.constructor.observable || Vue.observable)({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {},
      expandedRowsHeight: {},
      expandedRowKeys: [],
    });
    return {
      columnManager: new ColumnManager(this.columns),
      sComponents: merge(
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
    };
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
    columns(val) {
      if (val) {
        this.columnManager.reset(val);
      }
    },
    data(val) {
      if (val.length === 0 && this.hasScrollX()) {
        this.$nextTick(() => {
          this.resetScrollX();
        });
      }
    },
  },

  // static childContextTypes = {
  //   table: PropTypes.any,
  //   components: PropTypes.any,
  // },

  created() {
    ['rowClick', 'rowDoubleclick', 'rowContextmenu', 'rowMouseenter', 'rowMouseleave'].forEach(
      name => {
        warning(
          getListeners(this)[name] === undefined,
          `${name} is deprecated, please use customRow instead.`,
        );
      },
    );

    warning(
      this.getBodyWrapper === undefined,
      'getBodyWrapper is deprecated, please use custom components instead.',
    );

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  },

  mounted() {
    this.$nextTick(() => {
      if (this.columnManager.isAnyColumnsFixed()) {
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
      if (this.columnManager.isAnyColumnsFixed()) {
        this.handleWindowResize();
        if (!this.resizeEvent) {
          this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
        }
      }
    });
  },

  beforeDestroy() {
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
      const fixedColumnsHeadRowsHeight = [].map.call(headRows, row =>
        row.getBoundingClientRect().height ? row.getBoundingClientRect().height - 0.5 : 'auto',
      );
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
      // Fix https://github.com/ant-design/ant-design/issues/7635
      if (e.currentTarget !== e.target) {
        return;
      }
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
      const {
        ref_headTable,
        ref_bodyTable,
        ref_fixedColumnsBodyLeft,
        ref_fixedColumnsBodyRight,
      } = this;
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
      const isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
      const scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

      const table = [
        this.renderTable({
          columns: this.columnManager.groupedColumns(),
          isAnyColumnsFixed,
        }),
        this.renderEmptyText(),
        this.renderFooter(),
      ];

      return scrollable ? <div class={`${prefixCls}-scroll`}>{table}</div> : table;
    },

    renderLeftFixedTable() {
      const { prefixCls } = this;

      return (
        <div class={`${prefixCls}-fixed-left`}>
          {this.renderTable({
            columns: this.columnManager.leftColumns(),
            fixed: 'left',
          })}
        </div>
      );
    },
    renderRightFixedTable() {
      const { prefixCls } = this;

      return (
        <div class={`${prefixCls}-fixed-right`}>
          {this.renderTable({
            columns: this.columnManager.rightColumns(),
            fixed: 'right',
          })}
        </div>
      );
    },

    renderTable(options) {
      const { columns, fixed, isAnyColumnsFixed } = options;
      const { prefixCls, scroll = {} } = this;
      const tableClassName = scroll.x || fixed ? `${prefixCls}-fixed` : '';

      const headTable = (
        <HeadTable
          key="head"
          columns={columns}
          fixed={fixed}
          tableClassName={tableClassName}
          handleBodyScrollLeft={this.handleBodyScrollLeft}
          expander={this.expander}
        />
      );

      const bodyTable = (
        <BodyTable
          key="body"
          columns={columns}
          fixed={fixed}
          tableClassName={tableClassName}
          getRowKey={this.getRowKey}
          handleWheel={this.handleWheel}
          handleBodyScroll={this.handleBodyScroll}
          expander={this.expander}
          isAnyColumnsFixed={isAnyColumnsFixed}
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
    const props = getOptionProps(this);
    const { columnManager, getRowKey } = this;
    const prefixCls = props.prefixCls;

    const tableClassName = classNames(props.prefixCls, {
      [`${prefixCls}-fixed-header`]: props.useFixedHeader || (props.scroll && props.scroll.y),
      [`${prefixCls}-scroll-position-left ${prefixCls}-scroll-position-right`]:
        this.scrollPosition === 'both',
      [`${prefixCls}-scroll-position-${this.scrollPosition}`]: this.scrollPosition !== 'both',
      [`${prefixCls}-layout-fixed`]: this.isTableLayoutFixed(),
    });

    const hasLeftFixed = columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = columnManager.isAnyColumnsRightFixed();

    const expandableTableProps = {
      props: {
        ...props,
        columnManager,
        getRowKey,
      },
      on: getListeners(this),
      scopedSlots: {
        default: expander => {
          this.expander = expander;
          return (
            <div
              {...{
                directives: [
                  {
                    name: 'ant-ref',
                    value: this.saveTableNodeRef,
                  },
                ],
              }}
              class={tableClassName}
              // style={props.style}
              // id={props.id}
            >
              {this.renderTitle()}
              <div class={`${prefixCls}-content`}>
                {this.renderMainTable()}
                {hasLeftFixed && this.renderLeftFixedTable()}
                {hasRightFixed && this.renderRightFixedTable()}
              </div>
            </div>
          );
        },
      },
    };
    return <ExpandableTable {...expandableTableProps} />;
  },
};
