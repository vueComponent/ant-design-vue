'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationProps = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _select = require('../select');

var _select2 = _interopRequireDefault(_select);

var _MiniSelect = require('./MiniSelect');

var _MiniSelect2 = _interopRequireDefault(_MiniSelect);

var _en_US = require('../vc-pagination/locale/en_US');

var _en_US2 = _interopRequireDefault(_en_US);

var _LocaleReceiver = require('../locale-provider/LocaleReceiver');

var _LocaleReceiver2 = _interopRequireDefault(_LocaleReceiver);

var _propsUtil = require('../_util/props-util');

var _vcPagination = require('../vc-pagination');

var _vcPagination2 = _interopRequireDefault(_vcPagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PaginationProps = exports.PaginationProps = function PaginationProps() {
  return {
    total: _vueTypes2['default'].number,
    defaultCurrent: _vueTypes2['default'].number,
    current: _vueTypes2['default'].number,
    defaultPageSize: _vueTypes2['default'].number,
    pageSize: _vueTypes2['default'].number,
    hideOnSinglePage: _vueTypes2['default'].bool,
    showSizeChanger: _vueTypes2['default'].bool,
    pageSizeOptions: _vueTypes2['default'].arrayOf(_vueTypes2['default'].oneOfType([_vueTypes2['default'].number, _vueTypes2['default'].string])),
    buildOptionText: _vueTypes2['default'].func,
    showSizeChange: _vueTypes2['default'].func,
    showQuickJumper: _vueTypes2['default'].bool,
    showTotal: _vueTypes2['default'].any,
    size: _vueTypes2['default'].string,
    simple: _vueTypes2['default'].bool,
    locale: _vueTypes2['default'].object,
    prefixCls: _vueTypes2['default'].string,
    selectPrefixCls: _vueTypes2['default'].string,
    itemRender: _vueTypes2['default'].any
  };
};

exports['default'] = {
  name: 'APagination',
  props: (0, _extends3['default'])({}, PaginationProps(), {
    prefixCls: _vueTypes2['default'].string.def('ant-pagination'),
    selectPrefixCls: _vueTypes2['default'].string.def('ant-select')
  }),
  model: {
    prop: 'current',
    event: 'change'
  },
  methods: {
    renderPagination: function renderPagination(locale) {
      var h = this.$createElement;

      var _getOptionProps = (0, _propsUtil.getOptionProps)(this),
          buildOptionText = _getOptionProps.buildOptionText,
          size = _getOptionProps.size,
          restProps = (0, _objectWithoutProperties3['default'])(_getOptionProps, ['buildOptionText', 'size']);

      var isSmall = size === 'small';
      var paginationProps = {
        props: (0, _extends3['default'])({}, restProps, {
          selectComponentClass: isSmall ? _MiniSelect2['default'] : _select2['default'],
          locale: locale,
          buildOptionText: buildOptionText || this.$scopedSlots.buildOptionText
        }),
        'class': {
          'mini': isSmall
        },
        on: this.$listeners
      };

      return h(_vcPagination2['default'], paginationProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(_LocaleReceiver2['default'], {
      attrs: {
        componentName: 'Pagination',
        defaultLocale: _en_US2['default'],
        children: this.renderPagination
      }
    });
  }
};