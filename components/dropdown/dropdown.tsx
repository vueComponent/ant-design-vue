import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import RcDropdown from '../vc-dropdown';
import DropdownButton from './dropdown-button';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';
import { isValidElement, initDefaultProps } from '../_util/props-util';
import { dropdownProps } from './props';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import useConfigInject from '../_util/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import omit from '../_util/omit';

export type DropdownProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownProps>>>;

const Dropdown = defineComponent({
  name: 'ADropdown',
  inheritAttrs: false,
  props: initDefaultProps(dropdownProps(), {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
    trigger: 'hover',
  }),
  emits: ['visibleChange', 'update:visible'],
  slots: ['overlay'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, rootPrefixCls, direction, getPopupContainer } = useConfigInject(
      'dropdown',
      props,
    );

    const transitionName = computed(() => {
      const { placement = '', transitionName } = props;
      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.indexOf('top') >= 0) {
        return `${rootPrefixCls.value}-slide-down`;
      }
      return `${rootPrefixCls.value}-slide-up`;
    });

    const renderOverlay = () => {
      // rc-dropdown already can process the function of overlay, but we have check logic here.
      // So we need render the element to check and pass back to rc-dropdown.
      const overlay = props.overlay || slots.overlay?.();
      const overlayNode = Array.isArray(overlay) ? overlay[0] : overlay;

      if (!overlayNode) return null;
      const overlayProps = overlayNode.props || {};

      // Warning if use other mode
      devWarning(
        !overlayProps.mode || overlayProps.mode === 'vertical',
        'Dropdown',
        `mode="${overlayProps.mode}" is not supported for Dropdown's Menu.`,
      );

      // menu cannot be selectable in dropdown defaultly
      const { selectable = false, expandIcon = (overlayNode.children as any)?.expandIcon?.() } =
        overlayProps;

      const overlayNodeExpandIcon =
        typeof expandIcon !== 'undefined' && isValidElement(expandIcon) ? (
          expandIcon
        ) : (
          <span class={`${prefixCls.value}-menu-submenu-arrow`}>
            <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
          </span>
        );

      const fixedModeOverlay = isValidElement(overlayNode)
        ? cloneElement(overlayNode, {
            mode: 'vertical',
            selectable,
            expandIcon: () => overlayNodeExpandIcon,
          })
        : overlayNode;

      return fixedModeOverlay;
    };

    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });

    const handleVisibleChange = (val: boolean) => {
      emit('update:visible', val);
      emit('visibleChange', val);
    };

    return () => {
      const { arrow, trigger, disabled, overlayClassName } = props;
      const child = slots.default?.()[0];
      const dropdownTrigger = cloneElement(
        child,
        Object.assign(
          {
            class: classNames(
              child?.props?.class,
              {
                [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
              },
              `${prefixCls.value}-trigger`,
            ),
          },
          disabled ? { disabled } : {},
        ),
      );

      const overlayClassNameCustomized = classNames(overlayClassName, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });

      const triggerActions = disabled ? [] : trigger;
      let alignPoint: boolean;
      if (triggerActions && triggerActions.indexOf('contextmenu') !== -1) {
        alignPoint = true;
      }
      const dropdownProps = omit(
        {
          ...props,
          ...attrs,
          overlayClassName: overlayClassNameCustomized,
          arrow,
          alignPoint,
          prefixCls: prefixCls.value,
          getPopupContainer: getPopupContainer.value,
          transitionName: transitionName.value,
          trigger: triggerActions,
          onVisibleChange: handleVisibleChange,
          placement: placement.value,
        },
        ['overlay'],
      );
      return (
        <RcDropdown {...dropdownProps} v-slots={{ overlay: renderOverlay }}>
          {dropdownTrigger}
        </RcDropdown>
      );
    };
  },
});

Dropdown.Button = DropdownButton;
export default Dropdown;
