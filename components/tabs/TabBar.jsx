import Icon from '../icon';
import ScrollableInkTabBar from '../vc-tabs/src/ScrollableInkTabBar';
import { cloneElement } from '../_util/vnode';
const TabBar = {
  functional: true,
  render(h, context) {
    const {
      tabBarStyle,
      animated = true,
      renderTabBar,
      tabBarExtraContent,
      tabPosition,
      prefixCls,
      type = 'line',
      size,
    } = context.props;
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
        ...context.props,
        inkBarAnimated,
        extraContent: tabBarExtraContent,
        prevIcon,
        nextIcon,
      },
      style: tabBarStyle,
      on: context.listeners,
      class: cls,
    };

    let RenderTabBar;

    if (renderTabBar) {
      RenderTabBar = renderTabBar(renderProps, ScrollableInkTabBar);
    } else {
      RenderTabBar = <ScrollableInkTabBar {...renderProps} />;
    }

    return cloneElement(RenderTabBar, renderProps);
  },
};

export default TabBar;
