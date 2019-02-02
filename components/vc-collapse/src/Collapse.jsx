import BaseMixin from '../../_util/BaseMixin';
import { hasProp, getPropsData, isEmptyElement, initDefaultProps } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
import openAnimationFactory from './openAnimationFactory';
import { collapseProps } from './commonProps';

function _toArray(activeKey) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    currentActiveKey = currentActiveKey ? [currentActiveKey] : [];
  }
  return currentActiveKey;
}

export default {
  name: 'Collapse',
  mixins: [BaseMixin],
  model: {
    prop: 'activeKey',
    event: 'change',
  },
  props: initDefaultProps(collapseProps, {
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
    getItems() {
      const activeKey = this.stateActiveKey;
      const { prefixCls, accordion, destroyInactivePanel, expandIcon } = this.$props;
      const newChildren = [];
      this.$slots.default.forEach((child, index) => {
        if (isEmptyElement(child)) return;
        const { header, headerClass, disabled } = getPropsData(child);
        let isActive = false;
        const key = child.key || String(index);
        if (accordion) {
          isActive = activeKey[0] === key;
        } else {
          isActive = activeKey.indexOf(key) > -1;
        }

        let panelEvents = {};
        if (!disabled && disabled !== '') {
          panelEvents = {
            itemClick: () => {
              this.onClickItem(key);
            },
          };
        }

        const props = {
          props: {
            header,
            headerClass,
            isActive,
            prefixCls,
            destroyInactivePanel,
            openAnimation: this.currentOpenAnimations,
            accordion,
            expandIcon,
          },
          on: {
            ...panelEvents,
          },
        };

        newChildren.push(cloneElement(child, props));
      });
      return newChildren;
    },
    setActiveKey(activeKey) {
      this.setState({ stateActiveKey: activeKey });
      this.$emit('change', this.accordion ? activeKey[0] : activeKey);
    },
  },
  render() {
    const { prefixCls, accordion } = this.$props;
    const collapseClassName = {
      [prefixCls]: true,
    };
    return (
      <div class={collapseClassName} role={accordion ? 'tablist' : null}>
        {this.getItems()}
      </div>
    );
  },
};
