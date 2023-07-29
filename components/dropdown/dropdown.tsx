import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent } from 'vue';
import RcDropdown from '../vc-dropdown';
import DropdownButton from './dropdown-button';
import { cloneElement } from '../_util/vnode';
import classNames from '../_util/classNames';
import { isValidElement, initDefaultProps } from '../_util/props-util';
import { dropdownProps } from './props';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import omit from '../_util/omit';
import getPlacements from '../_util/placements';
import warning from '../_util/warning';
import useStyle from './style';
import { useProvideOverride } from '../menu/src/OverrideContext';
import type { CustomSlotsType } from '../_util/type';

export type DropdownProps = Partial<ExtractPropTypes<ReturnType<typeof dropdownProps>>>;

const Dropdown = defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ADropdown',
  inheritAttrs: false,
  props: initDefaultProps(dropdownProps(), {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
    trigger: 'hover',
  }),
  // emits: ['visibleChange', 'update:visible'],
  slots: Object as CustomSlotsType<{
    default?: any;
    overlay?: any;
  }>,
  setup(props, { slots, attrs, emit }) {
    const { prefixCls, rootPrefixCls, direction, getPopupContainer } = useConfigInject(
      'dropdown',
      props,
    );
    const [wrapSSR, hashId] = useStyle(prefixCls);
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      [
        ['visible', 'open'],
        ['onVisibleChange', 'onOpenChange'],
        ['onUpdate:visible', 'onUpdate:open'],
      ].forEach(([deprecatedName, newName]) => {
        warning(
          props[deprecatedName] === undefined,
          'Dropdown',
          `\`${deprecatedName}\` is deprecated which will be removed in next major version, please use \`${newName}\` instead.`,
        );
      });
    }

    const transitionName = computed(() => {
      const { placement = '', transitionName } = props;
      if (transitionName !== undefined) {
        return transitionName;
      }
      if (placement.includes('top')) {
        return `${rootPrefixCls.value}-slide-down`;
      }
      return `${rootPrefixCls.value}-slide-up`;
    });
    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      expandIcon: computed(() => {
        return (
          <span class={`${prefixCls.value}-menu-submenu-arrow`}>
            <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`} />
          </span>
        );
      }),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
      validator: ({ mode }) => {
        // Warning if use other mode
        warning(
          !mode || mode === 'vertical',
          'Dropdown',
          `mode="${mode}" is not supported for Dropdown's Menu.`,
        );
      },
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
      const placement = props.placement;
      if (!placement) {
        return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
      }

      if (placement.includes('Center')) {
        const newPlacement = placement.slice(0, placement.indexOf('Center'));
        devWarning(
          !placement.includes('Center'),
          'Dropdown',
          `You are using '${placement}' placement in Dropdown, which is deprecated. Try to use '${newPlacement}' instead.`,
        );
        return newPlacement;
      }
      return placement;
    });

    const mergedVisible = computed(() => {
      return typeof props.visible === 'boolean' ? props.visible : props.open;
    });

    const handleVisibleChange = (val: boolean) => {
      emit('update:visible', val);
      emit('visibleChange', val);
      emit('update:open', val);
      emit('openChange', val);
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

      const overlayClassNameCustomized = classNames(overlayClassName, hashId.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      });

      const triggerActions = disabled ? [] : trigger;
      let alignPoint: boolean;
      if (triggerActions && triggerActions.includes('contextmenu')) {
        alignPoint = true;
      }

      const builtinPlacements = getPlacements({
        arrowPointAtCenter: typeof arrow === 'object' && arrow.pointAtCenter,
        autoAdjustOverflow: true,
      });
      const dropdownProps = omit(
        {
          ...props,
          ...attrs,
          visible: mergedVisible.value,
          builtinPlacements,
          overlayClassName: overlayClassNameCustomized,
          arrow: !!arrow,
          alignPoint,
          prefixCls: prefixCls.value,
          getPopupContainer: getPopupContainer?.value,
          transitionName: transitionName.value,
          trigger: triggerActions,
          onVisibleChange: handleVisibleChange,
          placement: placement.value,
        },
        ['overlay', 'onUpdate:visible'],
      );
      return wrapSSR(
        <RcDropdown {...dropdownProps} v-slots={{ overlay: renderOverlay }}>
          {dropdownTrigger}
        </RcDropdown>,
      );
    };
  },
});
Dropdown.Button = DropdownButton;
export default Dropdown;
