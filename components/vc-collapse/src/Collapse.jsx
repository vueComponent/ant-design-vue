import BaseMixin from '../../_util/BaseMixin';
import {
  hasProp,
  getPropsData,
  isEmptyElement,
  initDefaultProps,
  getSlot,
} from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import openAnimationFactory from './openAnimationFactory';
import { collapseProps } from './commonProps';
import { getDataAndAriaProps } from '../../_util/util';
import { defineComponent } from 'vue';

function _toArray(activeKey) {
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
  mixins: [BaseMixin],
  inheritAttrs: false,
  props: initDefaultProps(collapseProps(), {
    prefixCls: 'rc-collapse',
    accordion: false,
    destroyInactivePanel: false,
  }),
  data() {
    const { activeKey, defaultActiveKey, openAnimation, prefixCls } = this.$props;
    let currentActiveKey = defaultActiveKey;
    if (hasProp(this, 'activeKey')) {
      currentActiveKey = activeKey;
    }
    const currentOpenAnimations = openAnimation || openAnimationFactory(prefixCls);
    return {
      currentOpenAnimations,
      stateActiveKey: _toArray(currentActiveKey),
    };
  },
  watch: {
    activeKey(val) {
      this.setState({
        stateActiveKey: _toArray(val),
      });
    },
    openAnimation(val) {
      this.setState({
        currentOpenAnimations: val,
      });
    },
  },
  methods: {
    onClickItem(key) {
      let activeKey = this.stateActiveKey;
      if (this.accordion) {
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
      this.setActiveKey(activeKey);
    },
    getNewChild(child, index) {
      if (isEmptyElement(child)) return;
      const activeKey = this.stateActiveKey;
      const { prefixCls, accordion, destroyInactivePanel, expandIcon } = this.$props;

      // If there is no key provide, use the panel order as default key
      const key = String(child.key ?? index);
      const { header, headerClass, disabled } = getPropsData(child);
      let isActive = false;

      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }

      let panelEvents = {};
      if (!disabled && disabled !== '') {
        panelEvents = {
          onItemClick: this.onClickItem,
        };
      }

      const props = {
        key,
        panelKey: key,
        header,
        headerClass,
        isActive,
        prefixCls,
        destroyInactivePanel,
        openAnimation: this.currentOpenAnimations,
        accordion,
        expandIcon,
        ...panelEvents,
      };

      return cloneElement(child, props);
    },
    getItems() {
      const newChildren = [];
      const children = getSlot(this);
      children &&
        children.forEach((child, index) => {
          newChildren.push(this.getNewChild(child, index));
        });
      return newChildren;
    },
    setActiveKey(activeKey) {
      if (!hasProp(this, 'activeKey')) {
        this.setState({ stateActiveKey: activeKey });
      }
      this.__emit('change', this.accordion ? activeKey[0] : activeKey);
    },
  },
  render() {
    const { prefixCls, accordion } = this.$props;
    const { class: className, style } = this.$attrs;
    const collapseClassName = {
      [prefixCls]: true,
      [className]: className,
    };
    return (
      <div
        class={collapseClassName}
        {...getDataAndAriaProps(this.$attrs)}
        style={style}
        role={accordion ? 'tablist' : null}
      >
        {this.getItems()}
      </div>
    );
  },
});
