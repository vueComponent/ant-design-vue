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
import type { CSSProperties, ExtractPropTypes } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';
import RightOutlined from '@ant-design/icons-vue/RightOutlined';
import firstNotUndefined from '../_util/firstNotUndefined';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CollapsePanelProps } from './CollapsePanel';
import collapseMotion from '../_util/collapseMotion';
import type { CustomSlotsType } from '../_util/type';

// CSSINJS
import useStyle from './style';

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
  compatConfig: { MODE: 3 },
  name: 'ACollapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    accordion: false,
    destroyInactivePanel: false,
    bordered: true,
    expandIconPosition: 'start',
  }),
  slots: Object as CustomSlotsType<{
    default?: any;
    expandIcon?: CollapsePanelProps;
  }>,
  setup(props, { attrs, slots, emit }) {
    const stateActiveKey = ref<Key[]>(
      getActiveKeysArray(firstNotUndefined([props.activeKey, props.defaultActiveKey])),
    );

    watch(
      () => props.activeKey,
      () => {
        stateActiveKey.value = getActiveKeysArray(props.activeKey);
      },
      { deep: true },
    );
    const { prefixCls, direction, rootPrefixCls } = useConfigInject('collapse', props);

    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const iconPosition = computed(() => {
      const { expandIconPosition } = props;
      if (expandIconPosition !== undefined) {
        return expandIconPosition;
      }
      return direction.value === 'rtl' ? 'end' : 'start';
    });

    const renderExpandIcon = (panelProps: CollapsePanelProps) => {
      const { expandIcon = slots.expandIcon } = props;
      const icon = expandIcon ? (
        expandIcon(panelProps)
      ) : (
        <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />
      );

      return (
        <div
          class={[`${prefixCls.value}-expand-icon`, hashId.value]}
          onClick={() =>
            ['header', 'icon'].includes(props.collapsible) && onClickItem(panelProps.panelKey)
          }
        >
          {isValidElement(Array.isArray(expandIcon) ? icon[0] : icon)
            ? cloneElement(
                icon,
                {
                  class: `${prefixCls.value}-arrow`,
                },
                false,
              )
            : icon}
        </div>
      );
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
      const animation = openAnimation || collapseMotion(`${rootPrefixCls.value}-motion-collapse`);

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
        openAnimation: animation,
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
      const collapseClassName = classNames(
        prefixCls.value,
        {
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-icon-position-${iconPosition.value}`]: true,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-ghost`]: !!ghost,
          [attrs.class as string]: !!attrs.class,
        },
        hashId.value,
      );
      return wrapSSR(
        <div
          class={collapseClassName}
          {...getDataAndAriaProps(attrs)}
          style={attrs.style as CSSProperties}
          role={accordion ? 'tablist' : null}
        >
          {getItems()}
        </div>,
      );
    };
  },
});
