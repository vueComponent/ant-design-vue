import _extends from 'babel-runtime/helpers/extends';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';

/* eslint-disable camelcase */
import PropTypes from '../../_util/vue-types';
import { debounce, warningOnce } from './utils';
import shallowequal from 'shallowequal';
import addEventListener from '../../_util/Dom/addEventListener';
import { Provider, create } from '../../_util/store';
import merge from 'lodash/merge';
import ColumnManager from './ColumnManager';
import classes from 'component-classes';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';
import { initDefaultProps, getOptionProps } from '../../_util/props-util';
import BaseMixin from '../../_util/BaseMixin';

export default {
  name: 'Table',
  mixins: [BaseMixin],
  props: initDefaultProps({
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
        cell: PropTypes.any
      }),
      body: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any
      })
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
    expandRowByClick: PropTypes.bool
  }, {
    data: [],
    useFixedHeader: false,
    rowKey: 'key',
    rowClassName: function rowClassName() {
      return '';
    },
    prefixCls: 'rc-table',
    bodyStyle: {},
    showHeader: true,
    scroll: {},
    rowRef: function rowRef() {
      return null;
    },
    emptyText: function emptyText() {
      return 'No Data';
    },
    customHeaderRow: function customHeaderRow() {}
  }),

  // static childContextTypes = {
  //   table: PropTypes.any,
  //   components: PropTypes.any,
  // },

  created: function created() {
    var _this = this;

    ['rowClick', 'rowDoubleclick', 'rowContextmenu', 'rowMouseenter', 'rowMouseleave'].forEach(function (name) {
      warningOnce(_this.$listeners[name] === undefined, name + ' is deprecated, please use customRow instead.');
    });

    warningOnce(this.getBodyWrapper === undefined, 'getBodyWrapper is deprecated, please use custom components instead.');

    // this.columnManager = new ColumnManager(this.columns, this.$slots.default)

    this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: []
    });

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  },
  data: function data() {
    this.preData = [].concat(_toConsumableArray(this.data));
    return {
      columnManager: new ColumnManager(this.columns),
      sComponents: merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th'
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td'
        }
      }, this.components)
    };
  },
  provide: function provide() {
    return {
      table: this
    };
  },

  watch: {
    components: function components(val) {
      this._components = merge({
        table: 'table',
        header: {
          wrapper: 'thead',
          row: 'tr',
          cell: 'th'
        },
        body: {
          wrapper: 'tbody',
          row: 'tr',
          cell: 'td'
        }
      }, this.components);
    },
    columns: function columns(val) {
      if (val) {
        this.columnManager.reset(val);
      }
    },
    data: function data(val) {
      var _this2 = this;

      if (val.length === 0 && this.hasScrollX()) {
        this.$nextTick(function () {
          _this2.resetScrollX();
        });
      }
    }
  },

  mounted: function mounted() {
    var _this3 = this;

    this.$nextTick(function () {
      if (_this3.columnManager.isAnyColumnsFixed()) {
        _this3.handleWindowResize();
        _this3.resizeEvent = addEventListener(window, 'resize', _this3.debouncedWindowResize);
      }
    });
  },
  updated: function updated(prevProps) {
    var _this4 = this;

    this.$nextTick(function () {
      if (_this4.columnManager.isAnyColumnsFixed()) {
        _this4.handleWindowResize();
        if (!_this4.resizeEvent) {
          _this4.resizeEvent = addEventListener(window, 'resize', _this4.debouncedWindowResize);
        }
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  },

  methods: {
    getRowKey: function getRowKey(record, index) {
      var rowKey = this.rowKey;
      var key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warningOnce(key !== undefined, 'Each record in table should have a unique `key` prop,' + 'or set `rowKey` to an unique primary key.');
      return key === undefined ? index : key;
    },
    setScrollPosition: function setScrollPosition(position) {
      this.scrollPosition = position;
      if (this.$refs.tableNode) {
        var prefixCls = this.prefixCls;

        if (position === 'both') {
          classes(this.$refs.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-left').add(prefixCls + '-scroll-position-right');
        } else {
          classes(this.$refs.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-' + position);
        }
      }
    },
    setScrollPositionClassName: function setScrollPositionClassName() {
      var node = this.ref_bodyTable;
      var scrollToLeft = node.scrollLeft === 0;
      var scrollToRight = node.scrollLeft + 1 >= node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
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
    handleWindowResize: function handleWindowResize() {
      this.syncFixedTableRowHeight();
      this.setScrollPositionClassName();
    },
    syncFixedTableRowHeight: function syncFixedTableRowHeight() {
      var tableRect = this.$refs.tableNode.getBoundingClientRect();
      // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
      // see: https://github.com/ant-design/ant-design/issues/4836
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return;
      }
      var prefixCls = this.prefixCls;

      var headRows = this.ref_headTable ? this.ref_headTable.querySelectorAll('thead') : this.ref_bodyTable.querySelectorAll('thead');
      var bodyRows = this.ref_bodyTable.querySelectorAll('.' + prefixCls + '-row') || [];
      var fixedColumnsHeadRowsHeight = [].map.call(headRows, function (row) {
        return row.getBoundingClientRect().height || 'auto';
      });
      var fixedColumnsBodyRowsHeight = [].map.call(bodyRows, function (row) {
        return row.getBoundingClientRect().height || 'auto';
      });
      var state = this.store.getState();
      if (shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
        return;
      }
      this.store.setState({
        fixedColumnsHeadRowsHeight: fixedColumnsHeadRowsHeight,
        fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight
      });
    },
    resetScrollX: function resetScrollX() {
      if (this.ref_headTable) {
        this.ref_headTable.scrollLeft = 0;
      }
      if (this.ref_bodyTable) {
        this.ref_bodyTable.scrollLeft = 0;
      }
    },
    hasScrollX: function hasScrollX() {
      var _scroll = this.scroll,
          scroll = _scroll === undefined ? {} : _scroll;

      return 'x' in scroll;
    },
    handleBodyScrollLeft: function handleBodyScrollLeft(e) {
      // Fix https://github.com/ant-design/ant-design/issues/7635
      if (e.currentTarget !== e.target) {
        return;
      }
      var target = e.target;
      var _scroll2 = this.scroll,
          scroll = _scroll2 === undefined ? {} : _scroll2;
      var ref_headTable = this.ref_headTable,
          ref_bodyTable = this.ref_bodyTable;

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
    handleBodyScrollTop: function handleBodyScrollTop(e) {
      var target = e.target;
      var _scroll3 = this.scroll,
          scroll = _scroll3 === undefined ? {} : _scroll3;
      var ref_headTable = this.ref_headTable,
          ref_bodyTable = this.ref_bodyTable,
          ref_fixedColumnsBodyLeft = this.ref_fixedColumnsBodyLeft,
          ref_fixedColumnsBodyRight = this.ref_fixedColumnsBodyRight;

      if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== ref_headTable) {
        var scrollTop = target.scrollTop;
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
    handleBodyScroll: function handleBodyScroll(e) {
      this.handleBodyScrollLeft(e);
      this.handleBodyScrollTop(e);
    },
    saveChildrenRef: function saveChildrenRef(name, node) {
      this['ref_' + name] = node;
    },
    renderMainTable: function renderMainTable() {
      var h = this.$createElement;
      var scroll = this.scroll,
          prefixCls = this.prefixCls;

      var isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
      var scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

      var table = [this.renderTable({
        columns: this.columnManager.groupedColumns(),
        isAnyColumnsFixed: isAnyColumnsFixed
      }), this.renderEmptyText(), this.renderFooter()];

      return scrollable ? h(
        'div',
        { 'class': prefixCls + '-scroll' },
        [table]
      ) : table;
    },
    renderLeftFixedTable: function renderLeftFixedTable() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls;


      return h(
        'div',
        { 'class': prefixCls + '-fixed-left' },
        [this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: 'left'
        })]
      );
    },
    renderRightFixedTable: function renderRightFixedTable() {
      var h = this.$createElement;
      var prefixCls = this.prefixCls;


      return h(
        'div',
        { 'class': prefixCls + '-fixed-right' },
        [this.renderTable({
          columns: this.columnManager.rightColumns(),
          fixed: 'right'
        })]
      );
    },
    renderTable: function renderTable(options) {
      var h = this.$createElement;
      var columns = options.columns,
          fixed = options.fixed,
          isAnyColumnsFixed = options.isAnyColumnsFixed;
      var prefixCls = this.prefixCls,
          _scroll4 = this.scroll,
          scroll = _scroll4 === undefined ? {} : _scroll4;

      var tableClassName = scroll.x || fixed ? prefixCls + '-fixed' : '';

      var headTable = h(HeadTable, {
        key: 'head',
        attrs: { columns: columns,
          fixed: fixed,
          tableClassName: tableClassName,
          handleBodyScrollLeft: this.handleBodyScrollLeft,
          expander: this.expander
        }
      });

      var bodyTable = h(BodyTable, {
        key: 'body',
        attrs: { columns: columns,
          fixed: fixed,
          tableClassName: tableClassName,
          getRowKey: this.getRowKey,
          handleBodyScroll: this.handleBodyScroll,
          expander: this.expander,
          isAnyColumnsFixed: isAnyColumnsFixed
        }
      });

      return [headTable, bodyTable];
    },
    renderTitle: function renderTitle() {
      var h = this.$createElement;
      var title = this.title,
          prefixCls = this.prefixCls,
          data = this.data;

      return title ? h(
        'div',
        { 'class': prefixCls + '-title', key: 'title' },
        [title(data)]
      ) : null;
    },
    renderFooter: function renderFooter() {
      var h = this.$createElement;
      var footer = this.footer,
          prefixCls = this.prefixCls,
          data = this.data;

      return footer ? h(
        'div',
        { 'class': prefixCls + '-footer', key: 'footer' },
        [footer(data)]
      ) : null;
    },
    renderEmptyText: function renderEmptyText() {
      var h = this.$createElement;
      var emptyText = this.emptyText,
          prefixCls = this.prefixCls,
          data = this.data;

      if (data.length) {
        return null;
      }
      var emptyClassName = prefixCls + '-placeholder';
      return h(
        'div',
        { 'class': emptyClassName, key: 'emptyText' },
        [typeof emptyText === 'function' ? emptyText() : emptyText]
      );
    }
  },

  render: function render() {
    var _this5 = this;

    var h = arguments[0];

    var props = getOptionProps(this);
    var $listeners = this.$listeners,
        columnManager = this.columnManager,
        getRowKey = this.getRowKey;

    var prefixCls = props.prefixCls;

    var className = props.prefixCls;
    if (props.useFixedHeader || props.scroll && props.scroll.y) {
      className += ' ' + prefixCls + '-fixed-header';
    }
    if (this.scrollPosition === 'both') {
      className += ' ' + prefixCls + '-scroll-position-left ' + prefixCls + '-scroll-position-right';
    } else {
      className += ' ' + prefixCls + '-scroll-position-' + this.scrollPosition;
    }
    var hasLeftFixed = columnManager.isAnyColumnsLeftFixed();
    var hasRightFixed = columnManager.isAnyColumnsRightFixed();

    var expandableTableProps = {
      props: _extends({}, props, {
        columnManager: columnManager,
        getRowKey: getRowKey
      }),
      on: _extends({}, $listeners),
      scopedSlots: {
        'default': function _default(expander) {
          _this5.expander = expander;
          return h(
            'div',
            {
              ref: 'tableNode',
              'class': className
              // style={props.style}
              // id={props.id}
            },
            [_this5.renderTitle(), h(
              'div',
              { 'class': prefixCls + '-content' },
              [_this5.renderMainTable(), hasLeftFixed && _this5.renderLeftFixedTable(), hasRightFixed && _this5.renderRightFixedTable()]
            )]
          );
        }
      }
    };
    return h(
      Provider,
      {
        attrs: { store: this.store }
      },
      [h(ExpandableTable, expandableTableProps)]
    );
  }
};