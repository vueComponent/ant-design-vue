import {
  isEmptyElement,
  initDefaultProps,
  flattenChildren,
  isValidElement,
} from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import type { CollapsibleType } from './commonProps';
import { collapseProps } from './commonProps';
import { getDataAndAriaProps } from '../_util/util';
import type { ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import firstNotUndefined from '../_util/firstNotUndefined';
import classNames from '../_util/classNames';
import animation from '../_util/openAnimation';
import useConfigInject from '../_util/hooks/useConfigInject';
import type { CollapsePanelProps } from './CollapsePanel';

type Key = number | string;

function getActiveKeysArray(activeKey: Key | Key[]) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey =
      activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(key => String(key));
}
export { collapseProps };
export type CollapseProps = Partial<ExtractPropTypes<ReturnType<typeof collapseProps>>>;
export default defineComponent({
  name: 'ACollapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    accordion: false,
    destroyInactivePanel: false,
    bordered: true,
    openAnimation: animation,
    expandIconPosition: 'left',
  }),
  slots: ['expandIcon'],
  emits: ['change', 'update:activeKey'],
  setup(props, { attrs, slots, emit }) {
    const stateActiveKey = ref<Key[]>(
      getActiveKeysArray(firstNotUndefined([props.activeKey, props.defaultActiveKey])),
    );

    watch(
      () => props.activeKey,
      () => {
        stateActiveKey.value = getActiveKeysArray(props.activeKey);
      },
    );
    const { prefixCls, direction } = useConfigInject('collapse', props);
    const iconPosition = computed(() => {
      const { expandIconPosition } = props;
      if (expandIconPosition !== undefined) {
        return expandIconPosition;
      }
      return direction.value === 'rtl' ? 'right' : 'left';
    });

    const renderExpandIcon = (panelProps: CollapsePanelProps) => {
      const { expandIcon = slots.expandIcon } = props;
      const icon = expandIcon ? (
        expandIcon(panelProps)
      ) : (
        <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />
      );

      return isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
        ? cloneElement(
            icon,
            {
              class: `${prefixCls.value}-arrow`,
            },
            false,
          )
        : icon;
    };
    const setActiveKey = (activeKey: Key[]) => {
      if (props.activeKey === undefined) {
        stateActiveKey.value = activeKey;
      }
      const newKey = props.accordion ? activeKey[0] : activeKey;
      emit('update:activeKey', newKey);
      emit('change', newKey);
    };
    const onClickItem = (key: Key) => {
      let activeKey = stateActiveKey.value;
      if (props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      setActiveKey(activeKey);
    };

    const getNewChild = (child, index) => {
      if (isEmptyElement(child)) return;
      const activeKey = stateActiveKey.value;
      const { accordion, destroyInactivePanel, collapsible, openAnimation } = props;

      // If there is no key provide, use the panel order as default key
      const key = String(child.key ?? index);
      const {
        header = child.children?.header?.(),
        headerClass,
        collapsible: childCollapsible,
        disabled,
      } = child.props || {};
      let isActive = false;

      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      let mergeCollapsible: CollapsibleType = childCollapsible ?? collapsible;
      // legacy 2.x
      if (disabled || disabled === '') {
        mergeCollapsible = 'disabled';
      }
      const newProps = {
        key,
        panelKey: key,
        header,
        headerClass,
        isActive,
        prefixCls: prefixCls.value,
        destroyInactivePanel,
        openAnimation,
        accordion,
        onItemClick: mergeCollapsible === 'disabled' ? null : onClickItem,
        expandIcon: renderExpandIcon,
        collapsible: mergeCollapsible,
      };

      return cloneElement(child, newProps);
    };

    const getItems = () => {
      return flattenChildren(slots.default?.()).map(getNewChild);
    };

    return () => {
      const { accordion, bordered, ghost } = props;
      const collapseClassName = classNames({
        [prefixCls.value]: true,
        [`${prefixCls.value}-borderless`]: !bordered,
        [`${prefixCls.value}-icon-position-${iconPosition.value}`]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-ghost`]: !!ghost,
        [attrs.class as string]: !!attrs.class,
      });
      return (
        <div
          class={collapseClassName}
          {...getDataAndAriaProps(attrs)}
          style={attrs.style}
          role={accordion ? 'tablist' : null}
        >
          {getItems()}
        </div>
      );
    };
  },
});
