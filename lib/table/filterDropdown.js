'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vcMenu = require('../vc-menu');

var _vcMenu2 = _interopRequireDefault(_vcMenu);

var _domClosest = require('dom-closest');

var _domClosest2 = _interopRequireDefault(_domClosest);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dropdown = require('../dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _icon = require('../icon');

var _icon2 = _interopRequireDefault(_icon);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _radio = require('../radio');

var _radio2 = _interopRequireDefault(_radio);

var _FilterDropdownMenuWrapper = require('./FilterDropdownMenuWrapper');

var _FilterDropdownMenuWrapper2 = _interopRequireDefault(_FilterDropdownMenuWrapper);

var _interface = require('./interface');

var _propsUtil = require('../_util/props-util');

var _vnode = require('../_util/vnode');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  mixins: [_BaseMixin2['default']],
  name: 'FilterMenu',
  props: (0, _propsUtil.initDefaultProps)(_interface.FilterMenuProps, {
    handleFilter: function handleFilter() {},

    column: {}
  }),

  data: function data() {
    var visible = 'filterDropdownVisible' in this.column ? this.column.filterDropdownVisible : false;

    return {
      sSelectedKeys: this.selectedKeys,
      sKeyPathOfSelectedItem: {}, // 记录所有有选中子菜单的祖先菜单
      sVisible: visible
    };
  },
  mounted: function mounted() {
    var _this = this;

    var column = this.column;

    this.$nextTick(function () {
      _this.setNeverShown(column);
    });
  },

  watch: {
    'column.fixed': function columnFixed(val) {
      this.setNeverShown(this.column);
    },
    column: function column(val) {
      if ('filterDropdownVisible' in val) {
        this.sVisible = val.filterDropdownVisible;
      }
    },
    selectedKeys: function selectedKeys(val) {
      this.sSelectedKeys = val;
    }
  },
  methods: {
    setNeverShown: function setNeverShown(column) {
      var rootNode = this.$el;
      var filterBelongToScrollBody = !!(0, _domClosest2['default'])(rootNode, '.ant-table-scroll');
      if (filterBelongToScrollBody) {
        // When fixed column have filters, there will be two dropdown menus
        // Filter dropdown menu inside scroll body should never be shown
        // To fix https://github.com/ant-design/ant-design/issues/5010 and
        // https://github.com/ant-design/ant-design/issues/7909
        this.neverShown = !!column.fixed;
      }
    },
    setSelectedKeys: function setSelectedKeys(_ref) {
      var selectedKeys = _ref.selectedKeys;

      this.setState({ sSelectedKeys: selectedKeys });
    },
    setVisible: function setVisible(visible) {
      var column = this.column;

      if (!('filterDropdownVisible' in column)) {
        this.setState({ sVisible: visible });
      }
      if (column.onFilterDropdownVisibleChange) {
        column.onFilterDropdownVisibleChange(visible);
      }
    },
    handleClearFilters: function handleClearFilters() {
      this.setState({
        sSelectedKeys: []
      }, this.handleConfirm);
    },
    handleConfirm: function handleConfirm() {
      this.setVisible(false);
      this.confirmFilter2();
    },
    onVisibleChange: function onVisibleChange(visible) {
      this.setVisible(visible);
      if (!visible) {
        this.confirmFilter2();
      }
    },
    confirmFilter2: function confirmFilter2() {
      if (this.sSelectedKeys !== this.selectedKeys) {
        this.confirmFilter(this.column, this.sSelectedKeys);
      }
    },
    renderMenuItem: function renderMenuItem(item) {
      var h = this.$createElement;
      var column = this.column;

      var multiple = 'filterMultiple' in column ? column.filterMultiple : true;
      var input = multiple ? h(_checkbox2['default'], {
        attrs: { checked: this.sSelectedKeys.indexOf(item.value.toString()) >= 0 }
      }) : h(_radio2['default'], {
        attrs: { checked: this.sSelectedKeys.indexOf(item.value.toString()) >= 0 }
      });

      return h(
        _vcMenu.Item,
        { key: item.value },
        [input, h('span', [item.text])]
      );
    },
    hasSubMenu: function hasSubMenu() {
      var _column$filters = this.column.filters,
          filters = _column$filters === undefined ? [] : _column$filters;

      return filters.some(function (item) {
        return !!(item.children && item.children.length > 0);
      });
    },
    renderMenus: function renderMenus(items) {
      var _this2 = this;

      var h = this.$createElement;

      return items.map(function (item) {
        if (item.children && item.children.length > 0) {
          var sKeyPathOfSelectedItem = _this2.sKeyPathOfSelectedItem;

          var containSelected = Object.keys(sKeyPathOfSelectedItem).some(function (key) {
            return sKeyPathOfSelectedItem[key].indexOf(item.value) >= 0;
          });
          var subMenuCls = containSelected ? _this2.dropdownPrefixCls + '-submenu-contain-selected' : '';
          return h(
            _vcMenu.SubMenu,
            {
              attrs: { title: item.text },
              'class': subMenuCls, key: item.value.toString() },
            [_this2.renderMenus(item.children)]
          );
        }
        return _this2.renderMenuItem(item);
      });
    },
    handleMenuItemClick: function handleMenuItemClick(info) {
      if (info.keyPath.length <= 1) {
        return;
      }
      var keyPathOfSelectedItem = this.sKeyPathOfSelectedItem;
      if (this.sSelectedKeys.indexOf(info.key) >= 0) {
        // deselect SubMenu child
        delete keyPathOfSelectedItem[info.key];
      } else {
        // select SubMenu child
        keyPathOfSelectedItem[info.key] = info.keyPath;
      }
      this.setState({ keyPathOfSelectedItem: keyPathOfSelectedItem });
    },
    renderFilterIcon: function renderFilterIcon() {
      var h = this.$createElement;
      var column = this.column,
          locale = this.locale,
          prefixCls = this.prefixCls;

      var filterIcon = column.filterIcon;
      var dropdownSelectedClass = this.selectedKeys.length > 0 ? prefixCls + '-selected' : '';

      return filterIcon ? (0, _vnode.cloneElement)(filterIcon, {
        attrs: {
          title: locale.filterTitle
        },
        'class': (0, _classnames2['default'])(filterIcon.className, (0, _defineProperty3['default'])({}, prefixCls + '-icon', true))
      }) : h(_icon2['default'], {
        attrs: { title: locale.filterTitle, type: 'filter' },
        'class': dropdownSelectedClass });
    }
  },

  render: function render() {
    var h = arguments[0];
    var column = this.column,
        locale = this.locale,
        prefixCls = this.prefixCls,
        dropdownPrefixCls = this.dropdownPrefixCls,
        getPopupContainer = this.getPopupContainer;
    // default multiple selection in filter dropdown

    var multiple = 'filterMultiple' in column ? column.filterMultiple : true;
    var dropdownMenuClass = (0, _classnames2['default'])((0, _defineProperty3['default'])({}, dropdownPrefixCls + '-menu-without-submenu', !this.hasSubMenu()));
    var menus = column.filterDropdown ? h(_FilterDropdownMenuWrapper2['default'], [column.filterDropdown]) : h(
      _FilterDropdownMenuWrapper2['default'],
      { 'class': prefixCls + '-dropdown' },
      [h(
        _vcMenu2['default'],
        {
          attrs: {
            multiple: multiple,

            prefixCls: dropdownPrefixCls + '-menu',

            selectedKeys: this.sSelectedKeys,
            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            }
          },
          on: {
            'click': this.handleMenuItemClick,
            'select': this.setSelectedKeys,
            'deselect': this.setSelectedKeys
          },
          'class': dropdownMenuClass
        },
        [this.renderMenus(column.filters)]
      ), h(
        'div',
        { 'class': prefixCls + '-dropdown-btns' },
        [h(
          'a',
          {
            'class': prefixCls + '-dropdown-link confirm',
            on: {
              'click': this.handleConfirm
            }
          },
          [locale.filterConfirm]
        ), h(
          'a',
          {
            'class': prefixCls + '-dropdown-link clear',
            on: {
              'click': this.handleClearFilters
            }
          },
          [locale.filterReset]
        )]
      )]
    );

    return h(
      _dropdown2['default'],
      {
        attrs: {
          trigger: ['click'],
          visible: this.neverShown ? false : this.sVisible,

          getPopupContainer: getPopupContainer,
          forceRender: true
        },
        on: {
          'visibleChange': this.onVisibleChange
        }
      },
      [h(
        'template',
        { slot: 'overlay' },
        [menus]
      ), this.renderFilterIcon()]
    );
  }
};
module.exports = exports['default'];