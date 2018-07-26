import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';

import PropTypes from '../_util/vue-types';
import VcSelect from '../select';
import MiniSelect from './MiniSelect';
import enUS from '../vc-pagination/locale/en_US';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { getOptionProps } from '../_util/props-util';
import VcPagination from '../vc-pagination';

export var PaginationProps = function PaginationProps() {
  return {
    total: PropTypes.number,
    defaultCurrent: PropTypes.number,
    current: PropTypes.number,
    defaultPageSize: PropTypes.number,
    pageSize: PropTypes.number,
    hideOnSinglePage: PropTypes.bool,
    showSizeChanger: PropTypes.bool,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    buildOptionText: PropTypes.func,
    showSizeChange: PropTypes.func,
    showQuickJumper: PropTypes.bool,
    showTotal: PropTypes.any,
    size: PropTypes.string,
    simple: PropTypes.bool,
    locale: PropTypes.object,
    prefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    itemRender: PropTypes.any
  };
};

export default {
  name: 'APagination',
  props: _extends({}, PaginationProps(), {
    prefixCls: PropTypes.string.def('ant-pagination'),
    selectPrefixCls: PropTypes.string.def('ant-select')
  }),
  model: {
    prop: 'current',
    event: 'change'
  },
  methods: {
    renderPagination: function renderPagination(locale) {
      var h = this.$createElement;

      var _getOptionProps = getOptionProps(this),
          buildOptionText = _getOptionProps.buildOptionText,
          size = _getOptionProps.size,
          restProps = _objectWithoutProperties(_getOptionProps, ['buildOptionText', 'size']);

      var isSmall = size === 'small';
      var paginationProps = {
        props: _extends({}, restProps, {
          selectComponentClass: isSmall ? MiniSelect : VcSelect,
          locale: locale,
          buildOptionText: buildOptionText || this.$scopedSlots.buildOptionText
        }),
        'class': {
          'mini': isSmall
        },
        on: this.$listeners
      };

      return h(VcPagination, paginationProps);
    }
  },
  render: function render() {
    var h = arguments[0];

    return h(LocaleReceiver, {
      attrs: {
        componentName: 'Pagination',
        defaultLocale: enUS,
        children: this.renderPagination
      }
    });
  }
};