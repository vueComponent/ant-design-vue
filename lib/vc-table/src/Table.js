'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _addEventListener = require('../../_util/Dom/addEventListener');

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _store = require('../../_util/store');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _ColumnManager = require('./ColumnManager');

var _ColumnManager2 = _interopRequireDefault(_ColumnManager);

var _componentClasses = require('component-classes');

var _componentClasses2 = _interopRequireDefault(_componentClasses);

var _HeadTable = require('./HeadTable');

var _HeadTable2 = _interopRequireDefault(_HeadTable);

var _BodyTable = require('./BodyTable');

var _BodyTable2 = _interopRequireDefault(_BodyTable);

var _ExpandableTable = require('./ExpandableTable');

var _ExpandableTable2 = _interopRequireDefault(_ExpandableTable);

var _propsUtil = require('../../_util/props-util');

var _BaseMixin = require('../../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'Table',
  mixins: [_BaseMixin2['default']],
  props: (0, _propsUtil.initDefaultProps)({
    data: _vueTypes2['default'].array,
    useFixedHeader: _vueTypes2['default'].bool,
    columns: _vueTypes2['default'].array,
    prefixCls: _vueTypes2['default'].string,
    bodyStyle: _vueTypes2['default'].object,
    rowKey: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func]),
    rowClassName: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].func]),
    customRow: _vueTypes2['default'].func,
    customHeaderRow: _vueTypes2['default'].func,
    // onRowClick: PropTypes.func,
    // onRowDoubleClick: PropTypes.func,
    // onRowContextMenu: PropTypes.func,
    // onRowMouseEnter: PropTypes.func,
    // onRowMouseLeave: PropTypes.func,
    showHeader: _vueTypes2['default'].bool,
    title: _vueTypes2['default'].func,
    id: _vueTypes2['default'].string,
    footer: _vueTypes2['default'].func,
    emptyText: _vueTypes2['default'].any,
    scroll: _vueTypes2['default'].object,
    rowRef: _vueTypes2['default'].func,
    getBodyWrapper: _vueTypes2['default'].func,
    components: _vueTypes2['default'].shape({
      table: _vueTypes2['default'].any,
      header: _vueTypes2['default'].shape({
        wrapper: _vueTypes2['default'].any,
        row: _vueTypes2['default'].any,
        cell: _vueTypes2['default'].any
      }),
      body: _vueTypes2['default'].shape({
        wrapper: _vueTypes2['default'].any,
        row: _vueTypes2['default'].any,
        cell: _vueTypes2['default'].any
      })
    }),
    expandIconAsCell: _vueTypes2['default'].bool,
    expandedRowKeys: _vueTypes2['default'].array,
    expandedRowClassName: _vueTypes2['default'].func,
    defaultExpandAllRows: _vueTypes2['default'].bool,
    defaultExpandedRowKeys: _vueTypes2['default'].array,
    expandIconColumnIndex: _vueTypes2['default'].number,
    expandedRowRender: _vueTypes2['default'].func,
    childrenColumnName: _vueTypes2['default'].string,
    indentSize: _vueTypes2['default'].number,
    expandRowByClick: _vueTypes2['default'].bool
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
      (0, _utils.warningOnce)(_this.$listeners[name] === undefined, name + ' is deprecated, please use customRow instead.');
    });

    (0, _utils.warningOnce)(this.getBodyWrapper === undefined, 'getBodyWrapper is deprecated, please use custom components instead.');

    // this.columnManager = new ColumnManager(this.columns, this.$slots.default)

    this.store = (0, _store.create)({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: []
    });

    this.setScrollPosition('left');

    this.debouncedWindowResize = (0, _utils.debounce)(this.handleWindowResize, 150);
  },
  data: function data() {
    this.preData = [].concat((0, _toConsumableArray3['default'])(this.data));
    return {
      columnManager: new _ColumnManager2['default'](this.columns),
      sComponents: (0, _merge2['default'])({
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
      this._components = (0, _merge2['default'])({
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
        _this3.resizeEvent = (0, _addEventListener2['default'])(window, 'resize', _this3.debouncedWindowResize);
      }
    });
  },
  updated: function updated(prevProps) {
    var _this4 = this;

    this.$nextTick(function () {
      if (_this4.columnManager.isAnyColumnsFixed()) {
        _this4.handleWindowResize();
        if (!_this4.resizeEvent) {
          _this4.resizeEvent = (0, _addEventListener2['default'])(window, 'resize', _this4.debouncedWindowResize);
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
      (0, _utils.warningOnce)(key !== undefined, 'Each record in table should have a unique `key` prop,' + 'or set `rowKey` to an unique primary key.');
      return key === undefined ? index : key;
    },
    setScrollPosition: function setScrollPosition(position) {
      this.scrollPosition = position;
      if (this.$refs.tableNode) {
        var prefixCls = this.prefixCls;

        if (position === 'both') {
          (0, _componentClasses2['default'])(this.$refs.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-left').add(prefixCls + '-scroll-position-right');
        } else {
          (0, _componentClasses2['default'])(this.$refs.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-' + position);
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
      if ((0, _shallowequal2['default'])(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && (0, _shallowequal2['default'])(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
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

      var headTable = h(_HeadTable2['default'], {
        key: 'head',
        attrs: { columns: columns,
          fixed: fixed,
          tableClassName: tableClassName,
          handleBodyScrollLeft: this.handleBodyScrollLeft,
          expander: this.expander
        }
      });

      var bodyTable = h(_BodyTable2['default'], {
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

    var props = (0, _propsUtil.getOptionProps)(this);
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
      props: (0, _extends3['default'])({}, props, {
        columnManager: columnManager,
        getRowKey: getRowKey
      }),
      on: (0, _extends3['default'])({}, $listeners),
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
      _store.Provider,
      {
        attrs: { store: this.store }
      },
      [h(_ExpandableTable2['default'], expandableTableProps)]
    );
  }
};
/* eslint-disable camelcase */

module.exports = exports['default'];