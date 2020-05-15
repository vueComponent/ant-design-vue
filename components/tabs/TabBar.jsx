import Icon from '../icon';
import ScrollableInkTabBar from '../vc-tabs/src/ScrollableInkTabBar';
import { cloneElement } from '../_util/vnode';
import PropTypes from '../_util/vue-types';
import { getListeners } from '../_util/props-util';
const TabBar = {
  name: 'TabBar',
  inheritAttrs: false,
  props: {
    prefixCls: PropTypes.string,
    tabBarStyle: PropTypes.object,
    tabBarExtraContent: PropTypes.any,
    type: PropTypes.oneOf(['line', 'card', 'editable-card']),
    tabPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('top'),
    tabBarPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    size: PropTypes.oneOf(['default', 'small', 'large']),
    animated: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    renderTabBar: PropTypes.func,
    panels: PropTypes.array.def([]),
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabBarGutter: PropTypes.number,
  },
  render() {
    const {
      tabBarStyle,
      animated = true,
      renderTabBar,
      tabBarExtraContent,
      tabPosition,
      prefixCls,
      type = 'line',
      size,
    } = this.$props;
    const inkBarAnimated = typeof animated === 'object' ? animated.inkBar : animated;

    const isVertical = tabPosition === 'left' || tabPosition === 'right';
    const prevIconType = isVertical ? 'up' : 'left';
    const nextIconType = isVertical ? 'down' : 'right';
    const prevIcon = (
      <span class={`${prefixCls}-tab-prev-icon`}>
        <Icon type={prevIconType} class={`${prefixCls}-tab-prev-icon-target`} />
      </span>
    );
    const nextIcon = (
      <span class={`${prefixCls}-tab-next-icon`}>
        <Icon type={nextIconType} class={`${prefixCls}-tab-next-icon-target`} />
      </span>
    );

    // Additional className for style usage
    const cls = {
      [`${prefixCls}-${tabPosition}-bar`]: true,
      [`${prefixCls}-${size}-bar`]: !!size,
      [`${prefixCls}-card-bar`]: type && type.indexOf('card') >= 0,
    };

    const renderProps = {
      props: {
        ...this.$props,
        ...this.$attrs,
        inkBarAnimated,
        extraContent: tabBarExtraContent,
        prevIcon,
        nextIcon,
      },
      style: tabBarStyle,
      on: getListeners(this),
      class: cls,
    };

    let RenderTabBar;

    if (renderTabBar) {
      RenderTabBar = renderTabBar(renderProps, ScrollableInkTabBar);
      // https://github.com/vueComponent/ant-design-vue/issues/2157
      return cloneElement(RenderTabBar, renderProps);
    } else {
      return <ScrollableInkTabBar {...renderProps} />;
    }
  },
};

export default TabBar;
