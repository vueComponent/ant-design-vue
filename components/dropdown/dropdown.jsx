import RcDropdown from '../vc-dropdown/src/index';
import DropdownButton from './dropdown-button';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { getOptionProps, getPropsData } from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import Icon from '../icon';

const DropdownProps = getDropdownProps();
const Dropdown = {
  name: 'ADropdown',
  props: {
    ...DropdownProps,
    prefixCls: PropTypes.string.def('ant-dropdown'),
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft'),
  },
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  inject: {
    configProvider: { default: () => ({}) },
  },
  methods: {
    getTransitionName() {
      const { placement = '', transitionName } = this.$props;
      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return 'slide-down';
      }
      return 'slide-up';
    },
  },

  render() {
    const { $slots, $listeners } = this;
    const props = getOptionProps(this);
    const { prefixCls, trigger, disabled, getPopupContainer } = props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const dropdownTrigger = cloneElement($slots.default, {
      class: `${prefixCls}-trigger`,
      disabled,
    });
    const overlay = this.overlay || ($slots.overlay && $slots.overlay[0]);
    // menu cannot be selectable in dropdown defaultly
    // menu should be focusable in dropdown defaultly
    const overlayProps = overlay && getPropsData(overlay);
    const { selectable = false, focusable = true } = overlayProps || {};

    const expandIcon = (
      <span class={`${prefixCls}-menu-submenu-arrow`}>
        <Icon type="right" class={`${prefixCls}-menu-submenu-arrow-icon`} />
      </span>
    );

    const fixedModeOverlay =
      overlay && overlay.componentOptions
        ? cloneElement(overlay, {
            props: {
              mode: 'vertical',
              selectable,
              focusable,
              expandIcon,
            },
          })
        : overlay;
    const triggerActions = disabled ? [] : trigger;
    let alignPoint;
    if (triggerActions && triggerActions.indexOf('contextmenu') !== -1) {
      alignPoint = true;
    }
    const dropdownProps = {
      props: {
        alignPoint,
        ...props,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        transitionName: this.getTransitionName(),
        trigger: triggerActions,
      },
      on: $listeners,
    };
    return (
      <RcDropdown {...dropdownProps}>
        {dropdownTrigger}
        <template slot="overlay">{fixedModeOverlay}</template>
      </RcDropdown>
    );
  },
};

Dropdown.Button = DropdownButton;
export default Dropdown;
export { DropdownProps };
