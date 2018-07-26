'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueTypes = require('../../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _utils = require('./utils');

var _BaseTable = require('./BaseTable');

var _BaseTable2 = _interopRequireDefault(_BaseTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  name: 'HeadTable',
  props: {
    fixed: _vueTypes2['default'].oneOfType([_vueTypes2['default'].string, _vueTypes2['default'].bool]),
    columns: _vueTypes2['default'].array.isRequired,
    tableClassName: _vueTypes2['default'].string.isRequired,
    handleBodyScrollLeft: _vueTypes2['default'].func.isRequired,
    expander: _vueTypes2['default'].object.isRequired
  },
  inject: {
    table: { 'default': {} }
  },
  mounted: function mounted() {
    this.updateTableRef();
  },
  updated: function updated() {
    this.updateTableRef();
  },

  methods: {
    updateTableRef: function updateTableRef() {
      var _this = this;

      this.$nextTick(function () {
        _this.$refs.headTable && _this.table.saveChildrenRef('headTable', _this.$refs.headTable);
      });
    }
  },
  render: function render() {
    var h = arguments[0];
    var columns = this.columns,
        fixed = this.fixed,
        tableClassName = this.tableClassName,
        handleBodyScrollLeft = this.handleBodyScrollLeft,
        expander = this.expander,
        table = this.table;
    var prefixCls = table.prefixCls,
        scroll = table.scroll,
        showHeader = table.showHeader;
    var useFixedHeader = table.useFixedHeader;

    var headStyle = {};

    if (scroll.y) {
      useFixedHeader = true;
      // Add negative margin bottom for scroll bar overflow bug
      var scrollbarWidth = (0, _utils.measureScrollbar)('horizontal');
      if (scrollbarWidth > 0 && !fixed) {
        headStyle.marginBottom = '-' + scrollbarWidth + 'px';
        headStyle.paddingBottom = '0px';
      }
    }

    if (!useFixedHeader || !showHeader) {
      return null;
    }
    return h(
      'div',
      {
        key: 'headTable',
        ref: fixed ? null : 'headTable',
        'class': prefixCls + '-header',
        style: headStyle,
        on: {
          'scroll': handleBodyScrollLeft
        }
      },
      [h(_BaseTable2['default'], {
        attrs: {
          tableClassName: tableClassName,
          hasHead: true,
          hasBody: false,
          fixed: fixed,
          columns: columns,
          expander: expander
        }
      })]
    );
  }
};
module.exports = exports['default'];