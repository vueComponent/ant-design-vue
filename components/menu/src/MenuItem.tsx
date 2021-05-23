import { flattenChildren, getPropsSlot, isValidElement } from '../../_util/props-util';
import PropTypes from '../../_util/vue-types';
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { useInjectKeyPath } from './hooks/useKeyPath';
import { useInjectFirstLevel, useInjectMenu } from './hooks/useMenuContext';
import { cloneElement } from '../../_util/vnode';
import Tooltip from '../../tooltip';
import { MenuInfo } from './interface';

let indexGuid = 0;

export default defineComponent({
  name: 'AMenuItem',
  props: {
    role: String,
    disabled: Boolean,
    danger: Boolean,
    title: { type: [String, Boolean], default: undefined },
    icon: PropTypes.VNodeChild,
  },
  emits: ['mouseenter', 'mouseleave', 'click'],
  slots: ['icon'],
  inheritAttrs: false,
  setup(props, { slots, emit, attrs }) {
    const instance = getCurrentInstance();
    const key = instance.vnode.key;
    const eventKey = `menu_item_${++indexGuid}_$$_${key}`;
    const { parentEventKeys } = useInjectKeyPath();
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
      store,
      registerMenuInfo,
      unRegisterMenuInfo,
    } = useInjectMenu();
    const firstLevel = useInjectFirstLevel();
    const isActive = ref(false);
    const keyPath = computed(() => {
      return [...parentEventKeys.value.map(eK => store[eK].key), key];
    });

    const keysPath = computed(() => [...parentEventKeys.value, eventKey]);
    const menuInfo = {
      eventKey,
      key,
      parentEventKeys,
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

    const getEventInfo = (e: MouseEvent): MenuInfo => {
      return {
        key: key,
        eventKey: eventKey,
        keyPath: keyPath.value,
        eventKeyPath: [...parentEventKeys.value, eventKey],
        domEvent: e,
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
        console.log('item mouseenter', keysPath.value);
        emit('mouseenter', event);
      }
    };
    const onMouseLeave = (event: MouseEvent) => {
      if (!mergedDisabled.value) {
        changeActiveKeys([]);
        emit('mouseleave', event);
      }
    };

    const renderItemChildren = (icon: any, children: any) => {
      // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
      // ref: https://github.com/ant-design/ant-design/pull/23456
      if (!icon || (isValidElement(children) && children.type === 'span')) {
        if (children && inlineCollapsed.value && firstLevel && typeof children === 'string') {
          return (
            <div class={`${prefixCls.value}-inline-collapsed-noicon`}>{children.charAt(0)}</div>
          );
        }
        return children;
      }
      return <span class={`${prefixCls.value}-title-content`}>{children}</span>;
    };

    return () => {
      const { title } = props;
      const children = flattenChildren(slots.default?.());
      const childrenLength = children.length;
      let tooltipTitle: any = title;
      if (typeof title === 'undefined') {
        tooltipTitle = firstLevel ? children : '';
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
          <li
            {...attrs}
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
            title={typeof title === 'string' ? title : undefined}
          >
            {cloneElement(icon, {
              class: `${prefixCls.value}-item-icon`,
            })}
            {renderItemChildren(icon, children)}
          </li>
        </Tooltip>
      );
    };
  },
});
