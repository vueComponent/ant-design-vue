import _mergeJSXProps from 'babel-helper-vue-jsx-merge-props';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
import classNames from 'classnames';
// import PureRenderMixin from 'rc-util/lib/PureRenderMixin'
import PropTypes from '../_util/vue-types';
import { isValidElement, initDefaultProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import getTransitionProps from '../_util/getTransitionProps';
import Checkbox from '../checkbox';
import Search from './search';
import Item from './item';
import triggerEvent from '../_util/triggerEvent';

function noop() {}

var TransferItem = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool
};

function isRenderResultPlainObject(result) {
  return result && !isValidElement(result) && Object.prototype.toString.call(result) === '[object Object]';
}

export var TransferListProps = {
  prefixCls: PropTypes.string,
  titleText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape(TransferItem).loose),
  filter: PropTypes.string,
  filterOption: PropTypes.func,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: PropTypes.func,
  handleSelect: PropTypes.func,
  handleSelectAll: PropTypes.func,
  handleClear: PropTypes.func,
  renderItem: PropTypes.func,
  showSearch: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.any,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  body: PropTypes.any,
  footer: PropTypes.any,
  lazy: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
};

export default {
  name: 'TransferList',
  mixins: [BaseMixin],
  props: initDefaultProps(TransferListProps, {
    dataSource: [],
    titleText: '',
    showSearch: false,
    renderItem: noop,
    lazy: {}
  }),
  data: function data() {
    this.timer = null;
    this.triggerScrollTimer = null;
    return {
      mounted: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.timer = window.setTimeout(function () {
      _this.setState({
        mounted: true
      });
    }, 0);
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.triggerScrollTimer);
  },


  // shouldComponentUpdate (...args: any[]) {
  //   return PureRenderMixin.shouldComponentUpdate.apply(this, args)
  // }
  methods: {
    getCheckStatus: function getCheckStatus(filteredDataSource) {
      var checkedKeys = this.$props.checkedKeys;

      if (checkedKeys.length === 0) {
        return 'none';
      } else if (filteredDataSource.every(function (item) {
        return checkedKeys.indexOf(item.key) >= 0;
      })) {
        return 'all';
      }
      return 'part';
    },
    _handleSelect: function _handleSelect(selectedItem) {
      var checkedKeys = this.$props.checkedKeys;

      var result = checkedKeys.some(function (key) {
        return key === selectedItem.key;
      });
      this.handleSelect(selectedItem, !result);
    },
    _handleFilter: function _handleFilter(e) {
      var _this2 = this;

      this.handleSelect(e);
      if (!e.target.value) {
        return;
      }
      // Manually trigger scroll event for lazy search bug
      // https://github.com/ant-design/ant-design/issues/5631
      this.triggerScrollTimer = window.setTimeout(function () {
        var listNode = _this2.$el.querySelectorAll('.ant-transfer-list-content')[0];
        if (listNode) {
          triggerEvent(listNode, 'scroll');
        }
      }, 0);
    },
    _handleClear: function _handleClear(e) {
      this.handleClear(e);
    },
    matchFilter: function matchFilter(text, item) {
      var _$props = this.$props,
          filter = _$props.filter,
          filterOption = _$props.filterOption;

      if (filterOption) {
        return filterOption(filter, item);
      }
      return text.indexOf(filter) >= 0;
    },
    renderItemHtml: function renderItemHtml(item) {
      var _$props$renderItem = this.$props.renderItem,
          renderItem = _$props$renderItem === undefined ? noop : _$props$renderItem;

      var renderResult = renderItem(item);
      var isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult
      };
    },
    filterNull: function filterNull(arr) {
      return arr.filter(function (item) {
        return item !== null;
      });
    }
  },

  render: function render() {
    var _this3 = this;

    var h = arguments[0];
    var _$props2 = this.$props,
        prefixCls = _$props2.prefixCls,
        dataSource = _$props2.dataSource,
        titleText = _$props2.titleText,
        checkedKeys = _$props2.checkedKeys,
        lazy = _$props2.lazy,
        _$props2$body = _$props2.body,
        body = _$props2$body === undefined ? noop : _$props2$body,
        _$props2$footer = _$props2.footer,
        footer = _$props2$footer === undefined ? noop : _$props2$footer,
        showSearch = _$props2.showSearch,
        filter = _$props2.filter,
        searchPlaceholder = _$props2.searchPlaceholder,
        notFoundContent = _$props2.notFoundContent,
        itemUnit = _$props2.itemUnit,
        itemsUnit = _$props2.itemsUnit;

    // Custom Layout

    var footerDom = footer(_extends({}, this.$props));
    var bodyDom = body(_extends({}, this.$props));

    var listCls = classNames(prefixCls, _defineProperty({}, prefixCls + '-with-footer', !!footerDom));

    var filteredDataSource = [];
    var totalDataSource = [];

    var showItems = dataSource.map(function (item) {
      var _renderItemHtml = _this3.renderItemHtml(item),
          renderedText = _renderItemHtml.renderedText,
          renderedEl = _renderItemHtml.renderedEl;

      if (filter && filter.trim() && !_this3.matchFilter(renderedText, item)) {
        return null;
      }

      // all show items
      totalDataSource.push(item);
      if (!item.disabled) {
        // response to checkAll items
        filteredDataSource.push(item);
      }

      var checked = checkedKeys.indexOf(item.key) >= 0;
      return h(Item, {
        key: item.key,
        attrs: { item: item,
          lazy: lazy,
          renderedText: renderedText,
          renderedEl: renderedEl,
          checked: checked,
          prefixCls: prefixCls
        },
        on: {
          'click': _this3._handleSelect
        }
      });
    });

    var unit = dataSource.length > 1 ? itemsUnit : itemUnit;

    var search = showSearch ? h(
      'div',
      { 'class': prefixCls + '-body-search-wrapper' },
      [h(Search, {
        attrs: {
          prefixCls: prefixCls + '-search',

          handleClear: this.handleClear,
          placeholder: searchPlaceholder,
          value: filter
        },
        on: {
          'change': this.handleFilter
        }
      })]
    ) : null;
    var transitionName = this.mounted ? prefixCls + '-content-item-highlight' : '';
    var transitionProps = getTransitionProps(transitionName, {
      leave: noop
    });
    var listBody = bodyDom || h(
      'div',
      {
        'class': showSearch ? prefixCls + '-body ' + prefixCls + '-body-with-search' : prefixCls + '-body'
      },
      [search, h(
        'transition-group',
        _mergeJSXProps([transitionProps, {
          attrs: {
            tag: 'div'
          },
          'class': prefixCls + '-content-warp'
        }]),
        [showItems && showItems.length && this.filterNull(showItems).length ? h(
          'ul',
          {
            key: 'transferList',
            'class': prefixCls + '-content',
            on: {
              'scroll': function scroll(e) {
                _this3.$emit('scroll', e);
              }
            }
          },
          [showItems]
        ) : null]
      ), h(
        'div',
        { 'class': prefixCls + '-body-not-found' },
        [notFoundContent]
      )]
    );

    var listFooter = footerDom ? h(
      'div',
      { 'class': prefixCls + '-footer' },
      [footerDom]
    ) : null;

    var checkStatus = this.getCheckStatus(filteredDataSource);
    var checkedAll = checkStatus === 'all';
    var checkAllCheckbox = h(Checkbox, {
      ref: 'checkbox',
      attrs: { checked: checkedAll,
        indeterminate: checkStatus === 'part'
      },
      on: {
        'change': function change() {
          _this3.handleSelectAll(filteredDataSource, checkedAll);
        }
      }
    });

    return h(
      'div',
      { 'class': listCls },
      [h(
        'div',
        { 'class': prefixCls + '-header' },
        [checkAllCheckbox, h(
          'span',
          { 'class': prefixCls + '-header-selected' },
          [h('span', [(checkedKeys.length > 0 ? checkedKeys.length + '/' : '') + totalDataSource.length, ' ', unit]), h(
            'span',
            { 'class': prefixCls + '-header-title' },
            [titleText]
          )]
        )]
      ), listBody, listFooter]
    );
  }
};