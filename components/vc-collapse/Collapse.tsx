import { isEmptyElement, initDefaultProps, flattenChildren } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import openAnimationFactory from './openAnimationFactory';
import { collapseProps, CollapsibleType } from './commonProps';
import { getDataAndAriaProps } from '../_util/util';
import { computed, defineComponent, ref, watch } from 'vue';
import firstNotUndefined from '../_util/firstNotUndefined';
import classNames from '../_util/classNames';

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

export default defineComponent({
  name: 'Collapse',
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    prefixCls: 'rc-collapse',
    accordion: false,
    destroyInactivePanel: false,
  }),
  slots: ['expandIcon'],
  emits: ['change'],
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
    const currentOpenAnimations = computed(
      () => props.openAnimation || openAnimationFactory(props.prefixCls),
    );

    const setActiveKey = (activeKey: Key[]) => {
      if (props.activeKey === undefined) {
        stateActiveKey.value = activeKey;
      }
      emit('change', props.accordion ? activeKey[0] : activeKey);
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
      const {
        prefixCls,
        accordion,
        destroyInactivePanel,
        expandIcon = slots.expandIcon,
        collapsible,
      } = props;

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
        prefixCls,
        destroyInactivePanel,
        openAnimation: currentOpenAnimations.value,
        accordion,
        onItemClick: mergeCollapsible === 'disabled' ? null : onClickItem,
        expandIcon,
        collapsible: mergeCollapsible,
      };

      return cloneElement(child, newProps);
    };

    const getItems = () => {
      return flattenChildren(slots.default?.()).map(getNewChild);
    };

    return () => {
      const { prefixCls, accordion } = props;
      const collapseClassName = classNames({
        [prefixCls]: true,
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
