import PropTypes from '../../_util/vue-types';
import { cloneElement } from '../../_util/vnode';
import {
  getTransformByIndex,
  getActiveIndex,
  getTransformPropValue,
  getMarginStyle,
} from './utils';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TabContent',
  inheritAttrs: false,
  props: {
    animated: PropTypes.looseBool.def(true),
    animatedWithMargin: PropTypes.looseBool.def(true),
    prefixCls: PropTypes.string.def('ant-tabs'),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabBarPosition: PropTypes.string,
    direction: PropTypes.string,
    destroyInactiveTabPane: PropTypes.looseBool,
    children: PropTypes.any,
  },
  computed: {
    classes() {
      const { animated, prefixCls } = this;
      const { class: className } = this.$attrs;
      return {
        [className]: !!className,
        [`${prefixCls}-content`]: true,
        [animated ? `${prefixCls}-content-animated` : `${prefixCls}-content-no-animated`]: true,
      };
    },
  },
  methods: {
    getTabPanes(children) {
      const props = this.$props;
      const activeKey = props.activeKey;
      const newChildren = [];

      children.forEach(child => {
        if (!child) {
          return;
        }
        const key = child.key;
        const active = activeKey === key;
        newChildren.push(
          cloneElement(child, {
            active,
            destroyInactiveTabPane: props.destroyInactiveTabPane,
            rootPrefixCls: props.prefixCls,
          }),
        );
      });

      return newChildren;
    },
  },
  render() {
    const {
      activeKey,
      tabBarPosition,
      animated,
      animatedWithMargin,
      direction,
      classes,
      children,
    } = this;
    let style = {};
    if (animated && children) {
      const activeIndex = getActiveIndex(children, activeKey);
      if (activeIndex !== -1) {
        const animatedStyle = animatedWithMargin
          ? getMarginStyle(activeIndex, tabBarPosition)
          : getTransformPropValue(getTransformByIndex(activeIndex, tabBarPosition, direction));
        style = {
          ...this.$attrs.style,
          ...animatedStyle,
        };
      } else {
        style = {
          ...this.$attrs.style,
          display: 'none',
        };
      }
    }
    return (
      <div class={classes} style={style}>
        {this.getTabPanes(children || [])}
      </div>
    );
  },
});
