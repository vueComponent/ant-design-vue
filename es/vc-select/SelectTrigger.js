import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';

import classnames from 'classnames';
import Trigger from '../trigger';
import PropTypes from '../_util/vue-types';
import DropdownMenu from './DropdownMenu';
import { isSingleMode } from './util';
import BaseMixin from '../_util/BaseMixin';

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

export default {
  name: 'SelectTrigger',
  mixins: [BaseMixin],
  props: {
    // onPopupFocus: PropTypes.func,
    // onPopupScroll: PropTypes.func,
    dropdownMatchSelectWidth: PropTypes.bool,
    defaultActiveFirstOption: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    showSearch: PropTypes.bool,
    dropdownClassName: PropTypes.string,
    dropdownStyle: PropTypes.object,
    dropdownMenuStyle: PropTypes.object,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    value: PropTypes.array,
    // children: PropTypes.any,
    showAction: PropTypes.arrayOf(PropTypes.string),
    combobox: PropTypes.bool,
    animation: PropTypes.string,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func
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
        props: _extends({}, newProps.props, {
          prefixCls: getDropdownPrefixCls(),
          value: value, firstActiveValue: firstActiveValue, defaultActiveFirstOption: defaultActiveFirstOption, dropdownMenuStyle: dropdownMenuStyle
        }),
        on: _extends({}, newProps.on, {
          menuSelect: menuSelect,
          menuDeselect: menuDeselect,
          popupScroll: popupScroll
        }),
        ref: 'dropdownMenuRef'
      };
      return h(DropdownMenu, dropdownMenuProps);
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
    var popupClassName = (_popupClassName = {}, _defineProperty(_popupClassName, dropdownClassName, !!dropdownClassName), _defineProperty(_popupClassName, dropdownPrefixCls + '--' + (multiple ? 'multiple' : 'single'), 1), _popupClassName);
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
    } else if (isSingleMode($props) && !showSearch) {
      hideAction = ['click'];
    } else {
      hideAction = ['blur'];
    }
    var popupStyle = _extends({}, dropdownStyle);
    var widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
    if (this.dropdownWidth) {
      popupStyle[widthProp] = this.dropdownWidth + 'px';
    }
    var triggerProps = {
      props: _extends({}, $props, {
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
        popupClassName: classnames(popupClassName),
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
      Trigger,
      triggerProps,
      [$slots['default'], h(
        'template',
        { slot: 'popup' },
        [popupElement]
      )]
    );
  }
};