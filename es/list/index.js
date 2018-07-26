import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import PropTypes from '../_util/vue-types';
import classNames from 'classnames';
import omit from 'omit.js';
import { SpinProps } from '../spin';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';

import Spin from '../spin';
import Pagination from '../pagination';
import { Row } from '../grid';

import Item from './Item';
import { initDefaultProps, getComponentFromProp, filterEmpty } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';

export { ListItemProps, ListItemMetaProps } from './Item';

export var ColumnCount = ['', 1, 2, 3, 4, 6, 8, 12, 24];

export var ColumnType = ['gutter', 'column', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export var ListGridType = {
  gutter: PropTypes.number,
  column: PropTypes.oneOf(ColumnCount),
  xs: PropTypes.oneOf(ColumnCount),
  sm: PropTypes.oneOf(ColumnCount),
  md: PropTypes.oneOf(ColumnCount),
  lg: PropTypes.oneOf(ColumnCount),
  xl: PropTypes.oneOf(ColumnCount),
  xxl: PropTypes.oneOf(ColumnCount)
};

export var ListSize = ['small', 'default', 'large'];

export var ListProps = function ListProps() {
  return {
    bordered: PropTypes.bool,
    dataSource: PropTypes.any,
    extra: PropTypes.any,
    grid: PropTypes.shape(ListGridType).loose,
    itemLayout: PropTypes.string,
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    loadMore: PropTypes.any,
    pagination: PropTypes.any,
    prefixCls: PropTypes.string,
    rowKey: PropTypes.any,
    renderItem: PropTypes.any,
    size: PropTypes.oneOf(ListSize),
    split: PropTypes.bool,
    header: PropTypes.any,
    footer: PropTypes.any,
    locale: PropTypes.object
  };
};

export default {
  Item: Item,
  name: 'AList',

  props: initDefaultProps(ListProps(), {
    dataSource: [],
    prefixCls: 'ant-list',
    bordered: false,
    split: true,
    loading: false,
    pagination: false
  }),
  provide: function provide() {
    return {
      listContext: this
    };
  },
  data: function data() {
    var _this = this;

    this.keys = [];
    this.defaultPaginationProps = {
      current: 1,
      pageSize: 10,
      onChange: function onChange(page, pageSize) {
        var pagination = _this.pagination;

        _this.paginationCurrent = page;
        if (pagination && pagination.onChange) {
          pagination.onChange(page, pageSize);
        }
      },
      total: 0
    };
    return {
      paginationCurrent: 1
    };
  },

  methods: {
    renderItem2: function renderItem2(item, index) {
      var dataSource = this.dataSource,
          $scopedSlots = this.$scopedSlots,
          rowKey = this.rowKey;

      var key = void 0;
      var renderItem = this.renderItem || $scopedSlots.renderItem;
      if (typeof rowKey === 'function') {
        key = rowKey(dataSource[index]);
      } else if (typeof rowKey === 'string') {
        key = dataSource[rowKey];
      } else {
        key = dataSource.key;
      }

      if (!key) {
        key = 'list-item-' + index;
      }

      this.keys[index] = key;

      return renderItem(item, index);
    },
    isSomethingAfterLastTtem: function isSomethingAfterLastTtem() {
      var pagination = this.pagination;

      var loadMore = getComponentFromProp(this, 'loadMore');
      var footer = getComponentFromProp(this, 'footer');
      return !!(loadMore || pagination || footer);
    },
    renderEmpty: function renderEmpty(contextLocale) {
      var h = this.$createElement;

      var locale = _extends({}, contextLocale, this.locale);
      return h(
        'div',
        { 'class': this.prefixCls + '-empty-text' },
        [locale.emptyText]
      );
    }
  },

  render: function render() {
    var _classNames,
        _this2 = this;

    var h = arguments[0];
    var bordered = this.bordered,
        split = this.split,
        itemLayout = this.itemLayout,
        pagination = this.pagination,
        prefixCls = this.prefixCls,
        grid = this.grid,
        dataSource = this.dataSource,
        size = this.size,
        loading = this.loading,
        $listeners = this.$listeners,
        $slots = this.$slots,
        paginationCurrent = this.paginationCurrent;

    var loadMore = getComponentFromProp(this, 'loadMore');
    var footer = getComponentFromProp(this, 'footer');
    var header = getComponentFromProp(this, 'header');
    var children = filterEmpty($slots['default'] || []);
    var loadingProp = loading;
    if (typeof loadingProp === 'boolean') {
      loadingProp = {
        spinning: loadingProp
      };
    }
    var isLoading = loadingProp && loadingProp.spinning;

    // large => lg
    // small => sm
    var sizeCls = '';
    switch (size) {
      case 'large':
        sizeCls = 'lg';
        break;
      case 'small':
        sizeCls = 'sm';
        break;
      default:
        break;
    }
    var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-vertical', itemLayout === 'vertical'), _defineProperty(_classNames, prefixCls + '-' + sizeCls, sizeCls), _defineProperty(_classNames, prefixCls + '-split', split), _defineProperty(_classNames, prefixCls + '-bordered', bordered), _defineProperty(_classNames, prefixCls + '-loading', isLoading), _defineProperty(_classNames, prefixCls + '-grid', grid), _defineProperty(_classNames, prefixCls + '-something-after-last-item', this.isSomethingAfterLastTtem()), _classNames));
    var paginationProps = _extends({}, this.defaultPaginationProps, {
      total: dataSource.length,
      current: paginationCurrent
    }, pagination || {});
    var largestPage = Math.ceil(paginationProps.total / paginationProps.pageSize);
    if (paginationProps.current > largestPage) {
      paginationProps.current = largestPage;
    }

    var cls = paginationProps['class'],
        style = paginationProps.style,
        _paginationProps$onSh = paginationProps.onShowSizeChange,
        onShowSizeChange = _paginationProps$onSh === undefined ? function () {} : _paginationProps$onSh,
        restProps = _objectWithoutProperties(paginationProps, ['class', 'style', 'onShowSizeChange']);

    var paginationContent = pagination ? h(
      'div',
      { 'class': prefixCls + '-pagination' },
      [h(Pagination, {
        props: omit(restProps, ['onChange']),
        'class': cls, style: style,
        on: { change: this.defaultPaginationProps.onChange, showSizeChange: onShowSizeChange }
      })]
    ) : null;

    var splitDataSource = [].concat(_toConsumableArray(dataSource));
    if (pagination) {
      if (dataSource.length > (paginationProps.current - 1) * paginationProps.pageSize) {
        splitDataSource = [].concat(_toConsumableArray(dataSource)).splice((paginationProps.current - 1) * paginationProps.pageSize, paginationProps.pageSize);
      }
    }

    var childrenContent = void 0;
    childrenContent = isLoading && h('div', { style: { minHeight: 53 } });
    if (splitDataSource.length > 0) {
      var items = splitDataSource.map(function (item, index) {
        return _this2.renderItem2(item, index);
      });
      var childrenList = items.map(function (child, index) {
        return cloneElement(child, {
          key: _this2.keys[index]
        });
      });

      childrenContent = grid ? h(
        Row,
        {
          attrs: { gutter: grid.gutter }
        },
        [childrenList]
      ) : childrenList;
    } else if (!children.length && !isLoading) {
      childrenContent = h(LocaleReceiver, {
        attrs: {
          componentName: 'Table',
          defaultLocale: defaultLocale.Table
        },
        scopedSlots: { 'default': this.renderEmpty }
      });
    }
    var paginationPosition = paginationProps.position || 'bottom';

    return h(
      'div',
      _mergeJSXProps([{ 'class': classString }, { on: $listeners }]),
      [(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent, header && h(
        'div',
        { 'class': prefixCls + '-header' },
        [header]
      ), h(
        Spin,
        { props: loadingProp },
        [childrenContent, children]
      ), footer && h(
        'div',
        { 'class': prefixCls + '-footer' },
        [footer]
      ), loadMore || (paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent]
    );
  }
};