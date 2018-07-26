
import PropTypes from '../_util/vue-types';
import arrayTreeFilter from 'array-tree-filter';
import BaseMixin from '../_util/BaseMixin';

export default {
  mixins: [BaseMixin],
  props: {
    value: PropTypes.array.def([]),
    activeValue: PropTypes.array.def([]),
    options: PropTypes.array.isRequired,
    prefixCls: PropTypes.string.def('rc-cascader-menus'),
    expandTrigger: PropTypes.string.def('click'),
    // onSelect: PropTypes.func,
    visible: PropTypes.bool.def(false),
    dropdownMenuColumnStyle: PropTypes.object
  },
  data: function data() {
    this.menuItems = {};
    return {};
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.scrollActiveItemToView();
    });
  },

  watch: {
    visible: function visible(val) {
      var _this2 = this;

      if (val) {
        this.$nextTick(function () {
          _this2.scrollActiveItemToView();
        });
      }
    }
  },
  methods: {
    getOption: function getOption(option, menuIndex) {
      var _this3 = this;

      var h = this.$createElement;
      var prefixCls = this.prefixCls,
          expandTrigger = this.expandTrigger;

      var onSelect = function onSelect(e) {
        _this3.__emit('select', option, menuIndex, e);
      };
      var expandProps = {
        attrs: {},
        on: {
          click: onSelect
        },
        key: option.value.toString()
      };
      var menuItemCls = prefixCls + '-menu-item';
      var hasChildren = option.children && option.children.length > 0;
      if (hasChildren || option.isLeaf === false) {
        menuItemCls += ' ' + prefixCls + '-menu-item-expand';
      }
      if (expandTrigger === 'hover' && hasChildren) {
        expandProps.on = {
          mouseenter: this.delayOnSelect.bind(this, onSelect),
          mouseleave: this.delayOnSelect.bind(this),
          click: onSelect
        };
      }
      if (this.isActiveOption(option, menuIndex)) {
        menuItemCls += ' ' + prefixCls + '-menu-item-active';
        expandProps.ref = this.getMenuItemRef(menuIndex);
      }
      if (option.disabled) {
        menuItemCls += ' ' + prefixCls + '-menu-item-disabled';
      }
      if (option.loading) {
        menuItemCls += ' ' + prefixCls + '-menu-item-loading';
      }
      var title = '';
      if (option.title) {
        title = option.title;
      } else if (typeof option.label === 'string') {
        title = option.label;
      }
      expandProps.attrs.title = title;
      expandProps['class'] = menuItemCls;
      return h(
        'li',
        expandProps,
        [option.label]
      );
    },
    getActiveOptions: function getActiveOptions(values) {
      var activeValue = values || this.activeValue;
      var options = this.options;
      return arrayTreeFilter(options, function (o, level) {
        return o.value === activeValue[level];
      });
    },
    getShowOptions: function getShowOptions() {
      var options = this.options;

      var result = this.getActiveOptions().map(function (activeOption) {
        return activeOption.children;
      }).filter(function (activeOption) {
        return !!activeOption;
      });
      result.unshift(options);
      return result;
    },
    delayOnSelect: function delayOnSelect(onSelect) {
      var _this4 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
      if (typeof onSelect === 'function') {
        this.delayTimer = setTimeout(function () {
          onSelect(args);
          _this4.delayTimer = null;
        }, 150);
      }
    },
    scrollActiveItemToView: function scrollActiveItemToView() {
      // scroll into view
      var optionsLength = this.getShowOptions().length;
      for (var i = 0; i < optionsLength; i++) {
        var itemComponent = this.$refs['menuItems_' + i];
        if (itemComponent) {
          var target = itemComponent;
          target.parentNode.scrollTop = target.offsetTop;
        }
      }
    },
    isActiveOption: function isActiveOption(option, menuIndex) {
      var _activeValue = this.activeValue,
          activeValue = _activeValue === undefined ? [] : _activeValue;

      return activeValue[menuIndex] === option.value;
    },
    getMenuItemRef: function getMenuItemRef(index) {
      return 'menuItems_' + index;
    }
  },

  render: function render() {
    var _this5 = this;

    var h = arguments[0];
    var prefixCls = this.prefixCls,
        dropdownMenuColumnStyle = this.dropdownMenuColumnStyle;

    return h('div', [this.getShowOptions().map(function (options, menuIndex) {
      return h(
        'ul',
        { 'class': prefixCls + '-menu', key: menuIndex, style: dropdownMenuColumnStyle },
        [options.map(function (option) {
          return _this5.getOption(option, menuIndex);
        })]
      );
    })]);
  }
};