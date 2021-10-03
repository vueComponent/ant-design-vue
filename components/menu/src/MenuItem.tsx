import { flattenChildren, getPropsSlot, isValidElement } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { useInjectKeyPath } from './hooks/useKeyPath';
import { useInjectFirstLevel, useInjectMenu } from './hooks/useMenuContext';
import { cloneElement } from '../../_util/vnode';
import Tooltip from '../../tooltip';
import type { MenuInfo } from './interface';
import KeyCode from '../../_util/KeyCode';
import useDirectionStyle from './hooks/useDirectionStyle';
import Overflow from '../../vc-overflow';
import devWarning from '../../vc-util/devWarning';

let indexGuid = 0;
const menuItemProps = {
  id: String,
  role: String,
  disabled: Boolean,
  danger: Boolean,
  title: { type: [String, Boolean], default: undefined },
  icon: PropTypes.VNodeChild,
};

export type MenuItemProps = Partial<ExtractPropTypes<typeof menuItemProps>>;

export default defineComponent({
  name: 'AMenuItem',
  inheritAttrs: false,
  props: menuItemProps,
  emits: ['mouseenter', 'mouseleave', 'click', 'keydown', 'focus'],
  slots: ['icon', 'title'],
  setup(props, { slots, emit, attrs }) {
    const instance = getCurrentInstance();

    const key =
      typeof instance.vnode.key === 'symbol' ? String(instance.vnode.key) : instance.vnode.key;
    devWarning(
      typeof instance.vnode.key !== 'symbol',
      'MenuItem',
      `MenuItem \`:key="${String(key)}"\` not support Symbol type`,
    );

    const eventKey = `menu_item_${++indexGuid}_$$_${key}`;
    const { parentEventKeys, parentKeys } = useInjectKeyPath();
    const {
      prefixCls,
      activeKeys,
      disabled,
      changeActiveKeys,
      rtl,
      inlineCollapsed,
      siderCollapsed,
      onItemClick,
      selectedKeys,
      registerMenuInfo,
      unRegisterMenuInfo,
    } = useInjectMenu();
    const firstLevel = useInjectFirstLevel();
    const isActive = ref(false);
    const keysPath = computed(() => {
      return [...parentKeys.value, key];
    });

    // const keysPath = computed(() => [...parentEventKeys.value, eventKey]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
      parentKeys,
      isLeaf: true,
    };

    registerMenuInfo(eventKey, menuInfo);

    onBeforeUnmount(() => {
      unRegisterMenuInfo(eventKey);
    });

    watch(
      activeKeys,
      () => {
        isActive.value = !!activeKeys.value.find(val => val === key);
      },
      { immediate: true },
    );
    const mergedDisabled = computed(() => disabled.value || props.disabled);
    const selected = computed(() => selectedKeys.value.includes(key));
    const classNames = computed(() => {
      const itemCls = `${prefixCls.value}-item`;
      return {
        [`${itemCls}`]: true,
        [`${itemCls}-danger`]: props.danger,
        [`${itemCls}-active`]: isActive.value,
        [`${itemCls}-selected`]: selected.value,
        [`${itemCls}-disabled`]: mergedDisabled.value,
      };
    });

    const getEventInfo = (e: MouseEvent | KeyboardEvent): MenuInfo => {
      return {
        key,
        eventKey,
        keyPath: keysPath.value,
        eventKeyPath: [...parentEventKeys.value, eventKey],
        domEvent: e,
        item: {
          ...props,
          ...attrs,
        },
      };
    };

    // ============================ Events ============================
    const onInternalClick = (e: MouseEvent) => {
      if (mergedDisabled.value) {
        return;
      }

      const info = getEventInfo(e);
      emit('click', e);
      onItemClick(info);
    };

    const onMouseEnter = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys(keysPath.value);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };

    const onInternalKeyDown = (e: KeyboardEvent) => {
      emit('keydown', e);

      if (e.which === KeyCode.ENTER) {
        const info = getEventInfo(e);

        // Legacy. Key will also trigger click event
        emit('click', e);
        onItemClick(info);
      }
    };

    /**
     * Used for accessibility. Helper will focus element without key board.
     * We should manually trigger an active
     */
    const onInternalFocus = (e: FocusEvent) => {
      changeActiveKeys(keysPath.value);
      emit('focus', e);
    };

    const renderItemChildren = (icon: any, children: any) => {
      const wrapNode = <span class={`${prefixCls.value}-title-content`}>{children}</span>;
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      if (!icon || (isValidElement(children) && children.type === 'span')) {
        if (children && inlineCollapsed.value && firstLevel && typeof children === 'string') {
          return (
            <div class={`${prefixCls.value}-inline-collapsed-noicon`}>{children.charAt(0)}</div>
          );
        }
      }
      return wrapNode;
    };

    // ========================== DirectionStyle ==========================
    const directionStyle = useDirectionStyle(computed(() => keysPath.value.length));

    return () => {
      const title = props.title ?? slots.title?.();
      const children = flattenChildren(slots.default?.());
      const childrenLength = children.length;
      let tooltipTitle: any = title;
      if (typeof title === 'undefined') {
        tooltipTitle = firstLevel && childrenLength ? children : '';
      } else if (title === false) {
        tooltipTitle = '';
      }
      const tooltipProps: any = {
        title: tooltipTitle,
      };

      if (!siderCollapsed.value && !inlineCollapsed.value) {
        tooltipProps.title = null;
        // Reset `visible` to fix control mode tooltip display not correct
        // ref: https://github.com/ant-design/ant-design/issues/16742
        tooltipProps.visible = false;
      }

      // ============================ Render ============================
      const optionRoleProps = {};

      if (props.role === 'option') {
        optionRoleProps['aria-selected'] = selected.value;
      }

      const icon = getPropsSlot(slots, props, 'icon');
      return (
        <Tooltip
          {...tooltipProps}
          placement={rtl.value ? 'left' : 'right'}
          overlayClassName={`${prefixCls.value}-inline-collapsed-tooltip`}
        >
          <Overflow.Item
            component="li"
            {...attrs}
            id={props.id}
            style={{ ...((attrs.style as any) || {}), ...directionStyle.value }}
            class={[
              classNames.value,
              {
                [`${attrs.class}`]: !!attrs.class,
                [`${prefixCls.value}-item-only-child`]:
                  (icon ? childrenLength + 1 : childrenLength) === 1,
              },
            ]}
            role={props.role || 'menuitem'}
            tabindex={props.disabled ? null : -1}
            data-menu-id={key}
            aria-disabled={props.disabled}
            {...optionRoleProps}
            onMouseenter={onMouseEnter}
            onMouseleave={onMouseLeave}
            onClick={onInternalClick}
            onKeydown={onInternalKeyDown}
            onFocus={onInternalFocus}
            title={typeof title === 'string' ? title : undefined}
          >
            {cloneElement(icon, {
              class: `${prefixCls.value}-item-icon`,
            })}
            {renderItemChildren(icon, children)}
          </Overflow.Item>
        </Tooltip>
      );
    };
  },
});
