'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _vueTypes = require('../_util/vue-types');

var _vueTypes2 = _interopRequireDefault(_vueTypes);

var _DropdownMenu = require('./DropdownMenu');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

var _util = require('./util');

var _BaseMixin = require('../_util/BaseMixin');

var _BaseMixin2 = _interopRequireDefault(_BaseMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  }
};

exports['default'] = {
  name: 'SelectTrigger',
  mixins: [_BaseMixin2['default']],
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: _vueTypes2['default'].bool,
    defaultActiveFirstOption: _vueTypes2['default'].bool,
    dropdownAlign: _vueTypes2['default'].object,
    visible: _vueTypes2['default'].bool,
    disabled: _vueTypes2['default'].bool,
    showSearch: _vueTypes2['default'].bool,
    dropdownClassName: _vueTypes2['default'].string,
    dropdownStyle: _vueTypes2['default'].object,
    dropdownMenuStyle: _vueTypes2['default'].object,
    multiple: _vueTypes2['default'].bool,
    inputValue: _vueTypes2['default'].string,
    filterOption: _vueTypes2['default'].any,
    options: _vueTypes2['default'].any,
    prefixCls: _vueTypes2['default'].string,
    popupClassName: _vueTypes2['default'].string,
    value: _vueTypes2['default'].array,
    // children: PropTypes.any,
    showAction: _vueTypes2['default'].arrayOf(_vueTypes2['default'].string),
    combobox: _vueTypes2['default'].bool,
    animation: _vueTypes2['default'].string,
    transitionName: _vueTypes2['default'].string,
    getPopupContainer: _vueTypes2['default'].func
  },
  data: function data() {
    return {
      dropdownWidth: null
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.setDropdownWidth();
    });
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.setDropdownWidth();
    });
  },

  methods: {
    setDropdownWidth: function setDropdownWidth() {
      var width = this.$el.offsetWidth;
      if (width !== this.dropdownWidth) {
        this.setState({ dropdownWidth: width });
      }
    },
    getInnerMenu: function getInnerMenu() {
      return this.$refs.dropdownMenuRef && this.$refs.dropdownMenuRef.$refs.menuRef;
    },
    getPopupDOMNode: function getPopupDOMNode() {
      return this.$refs.triggerRef.getPopupDomNode();
    },
    getDropdownElement: function getDropdownElement(newProps) {
      var h = this.$createElement;
      var value = this.value,
          firstActiveValue = this.firstActiveValue,
          defaultActiveFirstOption = this.defaultActiveFirstOption,
          dropdownMenuStyle = this.dropdownMenuStyle,
          getDropdownPrefixCls = this.getDropdownPrefixCls;
      var _$listeners = this.$listeners,
          menuSelect = _$listeners.menuSelect,
          menuDeselect = _$listeners.menuDeselect,
          popupScroll = _$listeners.popupScroll;

      var dropdownMenuProps = {
        props: (0, _extends3['default'])({}, newProps.props, {
          prefixCls: getDropdownPrefixCls(),
          value: value, firstActiveValue: firstActiveValue, defaultActiveFirstOption: defaultActiveFirstOption, dropdownMenuStyle: dropdownMenuStyle
        }),
        on: (0, _extends3['default'])({}, newProps.on, {
          menuSelect: menuSelect,
          menuDeselect: menuDeselect,
          popupScroll: popupScroll
        }),
        ref: 'dropdownMenuRef'
      };
      return h(_DropdownMenu2['default'], dropdownMenuProps);
    },
    getDropdownTransitionName: function getDropdownTransitionName() {
      var props = this.$props;
      var transitionName = props.transitionName;
      if (!transitionName && props.animation) {
        transitionName = this.getDropdownPrefixCls() + '-' + props.animation;
      }
      return transitionName;
    },
    getDropdownPrefixCls: function getDropdownPrefixCls() {
      return this.prefixCls + '-dropdown';
    }
  },

  render: function render() {
    var _popupClassName;

    var h = arguments[0];
    var $props = this.$props,
        $slots = this.$slots,
        $listeners = this.$listeners;
    var multiple = $props.multiple,
        visible = $props.visible,
        inputValue = $props.inputValue,
        dropdownAlign = $props.dropdownAlign,
        disabled = $props.disabled,
        showSearch = $props.showSearch,
        dropdownClassName = $props.dropdownClassName,
        dropdownStyle = $props.dropdownStyle,
        dropdownMatchSelectWidth = $props.dropdownMatchSelectWidth,
        options = $props.options,
        getPopupContainer = $props.getPopupContainer,
        showAction = $props.showAction;
    var mouseenter = $listeners.mouseenter,
        mouseleave = $listeners.mouseleave,
        popupFocus = $listeners.popupFocus,
        dropdownVisibleChange = $listeners.dropdownVisibleChange;

    var dropdownPrefixCls = this.getDropdownPrefixCls();
    var popupClassName = (_popupClassName = {}, (0, _defineProperty3['default'])(_popupClassName, dropdownClassName, !!dropdownClassName), (0, _defineProperty3['default'])(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
    var popupElement = this.getDropdownElement({
      props: {
        menuItems: options,
        multiple: multiple,
        inputValue: inputValue,
        visible: visible
      }, on: {
        popupFocus: popupFocus
      }
    });
    var hideAction = void 0;
    if (disabled) {
      hideAction = [];
    } else if ((0, _util.isSingleMode)($props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    var popupStyle = (0, _extends3['default'])({}, dropdownStyle);
    var widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = this.dropdownWidth + 'px';
    }
    var triggerProps = {
      props: (0, _extends3['default'])({}, $props, {
        showAction: disabled ? [] : showAction,
        hideAction: hideAction,
        ref: 'triggerRef',
        popupPlacement: 'bottomLeft',
        builtinPlacements: BUILT_IN_PLACEMENTS,
        prefixCls: dropdownPrefixCls,
        popupTransitionName: this.getDropdownTransitionName(),
        popupAlign: dropdownAlign,
        popupVisible: visible,
        getPopupContainer: getPopupContainer,
        popupClassName: (0, _classnames2['default'])(popupClassName),
        popupStyle: popupStyle
      }),
      on: {
        popupVisibleChange: dropdownVisibleChange
      },
      ref: 'triggerRef'
    };
    if (mouseenter) {
      triggerProps.on.mouseenter = mouseenter;
    }
    if (mouseleave) {
      triggerProps.on.mouseleave = mouseleave;
    }
    return h(
      _trigger2['default'],
      triggerProps,
      [$slots['default'], h(
        'template',
        { slot: 'popup' },
        [popupElement]
      )]
    );
  }
};
module.exports = exports['default'];