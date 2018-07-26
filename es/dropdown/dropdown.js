import _extends from 'babel-runtime/helpers/extends';

import RcDropdown from './src/index';
import DropdownButton from './dropdown-button';
// import warning from '../_util/warning'
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getPropsData } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
var DropdownProps = getDropdownProps();
var Dropdown = {
  name: 'ADropdown',
  props: _extends({}, DropdownProps, {
    prefixCls: PropTypes.string.def('ant-dropdown'),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft')
  }),
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  methods: {
    getTransitionName: function getTransitionName() {
      var _$props = this.$props,
          _$props$placement = _$props.placement,
          placement = _$props$placement === undefined ? '' : _$props$placement,
          transitionName = _$props.transitionName;

      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down';
      }
      return 'slide-up';
    }
  },

  render: function render() {
    var h = arguments[0];
    var $slots = this.$slots,
        prefixCls = this.prefixCls,
        trigger = this.trigger,
        disabled = this.disabled,
        $listeners = this.$listeners;

    var dropdownTrigger = cloneElement($slots['default'], {
      'class': prefixCls + '-trigger',
      disabled: disabled
    });
    var overlay = this.overlay || $slots.overlay && $slots.overlay[0];
    // menu cannot be selectable in dropdown defaultly, but multiple type can be selectable
    var overlayProps = overlay && getPropsData(overlay);
    var selectable = false;
    if (overlayProps) {
      selectable = !!overlayProps.selectable || overlayProps.multiple;
    }
    var fixedModeOverlay = overlay && cloneElement(overlay, {
      props: {
        mode: 'vertical',
        selectable: selectable,
        isRootMenu: false
      }
    });
    var dropdownProps = {
      props: _extends({}, getOptionProps(this), {
        transitionName: this.getTransitionName(),
        trigger: disabled ? [] : trigger
      }),
      on: $listeners
    };
    return h(
      RcDropdown,
      dropdownProps,
      [dropdownTrigger, h(
        'template',
        { slot: 'overlay' },
        [fixedModeOverlay]
      )]
    );
  }
};

Dropdown.Button = DropdownButton;
export default Dropdown;
export { DropdownProps };