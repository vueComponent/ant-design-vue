import RcDropdown from '../vc-dropdown/src/index';
import DropdownButton from './dropdown-button';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import {
  getOptionProps,
  getPropsData,
  getComponentFromProp,
  getListeners,
} from '../_util/props-util';
import getDropdownProps from './getDropdownProps';
import { ConfigConsumerProps } from '../config-provider';
import Icon from '../icon';

const DropdownProps = getDropdownProps();
const Dropdown = {
  name: 'ADropdown',
  props: {
    ...DropdownProps,
    prefixCls: PropTypes.string,
    mouseEnterDelay: PropTypes.number.def(0.15),
    mouseLeaveDelay: PropTypes.number.def(0.1),
    placement: DropdownProps.placement.def('bottomLeft'),
  },
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  provide() {
    return {
      savePopupRef: this.savePopupRef,
    };
  },
  inject: {
    configProvider: { default: () => ConfigConsumerProps },
  },
  methods: {
    savePopupRef(ref) {
      this.popupRef = ref;
    },
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
    renderOverlay(prefixCls) {
      const overlay = getComponentFromProp(this, 'overlay');
      const overlayNode = Array.isArray(overlay) ? overlay[0] : overlay;
      // menu cannot be selectable in dropdown defaultly
      // menu should be focusable in dropdown defaultly
      const overlayProps = overlayNode && getPropsData(overlayNode);
      const { selectable = false, focusable = true } = overlayProps || {};
      const expandIcon = (
        <span class={`${prefixCls}-menu-submenu-arrow`}>
          <Icon type="right" class={`${prefixCls}-menu-submenu-arrow-icon`} />
        </span>
      );

      const fixedModeOverlay =
        overlayNode && overlayNode.componentOptions
          ? cloneElement(overlayNode, {
              props: {
                mode: 'vertical',
                selectable,
                focusable,
                expandIcon,
              },
            })
          : overlay;
      return fixedModeOverlay;
    },
  },

  render() {
    const { $slots } = this;
    const props = getOptionProps(this);
    const { prefixCls: customizePrefixCls, trigger, disabled, getPopupContainer } = props;
    const { getPopupContainer: getContextPopupContainer } = this.configProvider;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('dropdown', customizePrefixCls);

    const dropdownTrigger = cloneElement($slots.default, {
      class: `${prefixCls}-trigger`,
      props: {
        disabled,
      },
    });
    const triggerActions = disabled ? [] : trigger;
    let alignPoint;
    if (triggerActions && triggerActions.indexOf('contextmenu') !== -1) {
      alignPoint = true;
    }
    const dropdownProps = {
      props: {
        alignPoint,
        ...props,
        prefixCls,
        getPopupContainer: getPopupContainer || getContextPopupContainer,
        transitionName: this.getTransitionName(),
        trigger: triggerActions,
      },
      on: getListeners(this),
    };
    return (
      <RcDropdown {...dropdownProps}>
        {dropdownTrigger}
        <template slot="overlay">{this.renderOverlay(prefixCls)}</template>
      </RcDropdown>
    );
  },
};

Dropdown.Button = DropdownButton;
export default Dropdown;
export { DropdownProps };
